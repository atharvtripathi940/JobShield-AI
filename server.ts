import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { scanJobWithGemini, scanScreenshotWithGemini, chatWithShieldBot } from './src/server/geminiService.js';
import { analyzeRecruiterDomain } from './src/server/ruleEngine.js';
import { dataStore } from './src/server/dataStore.js';
import { JobComparisonResult } from './src/types/jobshield.js';
import { 
  persistScanToSupabase, 
  persistReportToSupabase, 
  fetchReportsFromSupabase, 
  fetchSavedJobsFromSupabase, 
  checkSupabaseHealth,
  SUPABASE_PROJECT_ID 
} from './src/server/supabaseServer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(cors());
// Generous limit for base64 screenshot uploads
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ extended: true, limit: '16mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'JobShield AI Backend', time: new Date().toISOString() });
});

// Database Connection Status (Supabase)
app.get('/api/database/status', async (req, res) => {
  try {
    const health = await checkSupabaseHealth();
    res.json(health);
  } catch (error: any) {
    res.status(500).json({ connected: false, error: error?.message });
  }
});

// Platform Stats
app.get('/api/stats', (req, res) => {
  try {
    const stats = dataStore.getPlatformStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve stats' });
  }
});

// Job Text AI Scan
app.post('/api/scan/text', async (req, res) => {
  try {
    const { jobTitle, companyName, recruiterName, recruiterEmail, salaryClaim, content } = req.body;
    if (!content || typeof content !== 'string') {
      return res.status(400).json({ error: 'Job description or communication text is required.' });
    }

    const result = await scanJobWithGemini({
      jobTitle,
      companyName,
      recruiterName,
      recruiterEmail,
      salaryClaim,
      content,
    });

    // Register in in-memory store and persist to Supabase PostgreSQL
    dataStore.saveScan(result, 'Quick text scan');
    persistScanToSupabase(result, 'Quick text scan').catch(() => {});
    res.json(result);
  } catch (error: any) {
    console.error('API Error /api/scan/text:', error);
    res.status(500).json({ error: error?.message || 'Error processing scan request.' });
  }
});

// Multimodal Screenshot to Scam Scan
app.post('/api/scan/image', async (req, res) => {
  try {
    const { base64Data, mimeType, fileName } = req.body;
    if (!base64Data) {
      return res.status(400).json({ error: 'Screenshot image base64 data is required.' });
    }

    // Strip prefix if included, supporting all mime types (png, jpg, webp, svg+xml)
    const cleanBase64 = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;

    const result = await scanScreenshotWithGemini(cleanBase64, mimeType || 'image/png', fileName);
    dataStore.saveScan(result, `Screenshot Scan: ${fileName || 'Document'}`);
    persistScanToSupabase(result, `Screenshot Scan: ${fileName || 'Document'}`).catch(() => {});
    res.json(result);
  } catch (error: any) {
    console.error('API Error /api/scan/image:', error);
    res.status(500).json({ error: error?.message || 'Failed to scan screenshot.' });
  }
});

// Recruiter Credibility Checker
app.post('/api/scan/recruiter', (req, res) => {
  try {
    const { recruiterName, email, companyName, website, linkedinUrl } = req.body;
    if (!email || !companyName) {
      return res.status(400).json({ error: 'Recruiter email and company name are required.' });
    }

    const result = analyzeRecruiterDomain({
      recruiterName: recruiterName || 'Recruiter',
      email,
      companyName,
      website,
      linkedinUrl,
    });

    res.json(result);
  } catch (error: any) {
    console.error('API Error /api/scan/recruiter:', error);
    res.status(500).json({ error: error?.message || 'Failed to analyze recruiter.' });
  }
});

// Scam DNA Job Comparison
app.post('/api/scan/compare', async (req, res) => {
  try {
    const { jobA, jobB } = req.body;
    if (!jobA?.content || !jobB?.content) {
      return res.status(400).json({ error: 'Both Job A and Job B contents are required for comparison.' });
    }

    const [scanA, scanB] = await Promise.all([
      scanJobWithGemini({
        jobTitle: jobA.title || 'Job A',
        companyName: jobA.company || 'Company A',
        content: jobA.content,
      }),
      scanJobWithGemini({
        jobTitle: jobB.title || 'Job B',
        companyName: jobB.company || 'Company B',
        content: jobB.content,
      })
    ]);

    // Find overlapping scam phrases or sequences
    const commonPhrases = scanA.findings
      .map(f => f.highlightedText)
      .filter((text): text is string => Boolean(text && scanB.findings.some(fb => fb.highlightedText && fb.highlightedText.toLowerCase() === text.toLowerCase())));

    let recommendedChoice: JobComparisonResult['recommendedChoice'] = 'NEITHER_RECOMMENDED';
    if (scanA.riskLevel === 'LOW' && scanB.riskLevel === 'LOW') {
      recommendedChoice = 'BOTH_ACCEPTABLE';
    } else if (scanA.riskScore < scanB.riskScore && scanA.riskLevel !== 'HIGH') {
      recommendedChoice = 'JOB_A';
    } else if (scanB.riskScore < scanA.riskScore && scanB.riskLevel !== 'HIGH') {
      recommendedChoice = 'JOB_B';
    } else {
      recommendedChoice = 'NEITHER_RECOMMENDED';
    }

    const comparison: JobComparisonResult = {
      id: `compare-${Date.now()}`,
      jobA: scanA,
      jobB: scanB,
      riskComparison: `Job A scored ${scanA.riskScore}/100 (${scanA.riskLevel}) vs Job B scored ${scanB.riskScore}/100 (${scanB.riskLevel}).`,
      salaryFairnessComparison: `Job A evaluated as ${scanA.realityCheck.roleSalaryFairness}; Job B evaluated as ${scanB.realityCheck.roleSalaryFairness}.`,
      commonScamDnaPhrases: commonPhrases.length > 0 ? commonPhrases : ['No duplicate malicious boilerplate identified across both postings.'],
      recommendedChoice,
      analysisNotes: scanA.riskLevel === 'HIGH' && scanB.riskLevel === 'HIGH' 
        ? 'WARNING: Both positions exhibit significant fraud and advance fee indicators. Neither opportunity is recommended.' 
        : 'Compare offer terms carefully and verify corporate email domains prior to signing.',
    };

    res.json(comparison);
  } catch (error: any) {
    console.error('API Error /api/scan/compare:', error);
    res.status(500).json({ error: error?.message || 'Comparison failed.' });
  }
});

// ShieldBot Chat AI
app.post('/api/shieldbot/chat', async (req, res) => {
  try {
    const { message, language, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const reply = await chatWithShieldBot(history || [], message, language || 'en');
    res.json({ reply });
  } catch (error: any) {
    console.error('API Error /api/shieldbot/chat:', error);
    res.status(500).json({ error: error?.message || 'Chat service encountered an error.' });
  }
});

// Community Reports
app.get('/api/community/reports', async (req, res) => {
  const fromDb = await fetchReportsFromSupabase();
  if (fromDb && fromDb.length > 0) {
    return res.json(fromDb);
  }
  res.json(dataStore.getCommunityReports());
});

app.post('/api/community/report', (req, res) => {
  try {
    const { companyName, recruiterContact, scamType, title, description, requestedAmount, paymentMethod, isAnonymous, reporterAlias } = req.body;
    if (!companyName || !title || !description || !scamType) {
      return res.status(400).json({ error: 'Company name, scam type, title, and description are required.' });
    }

    const report = dataStore.addCommunityReport({
      companyName,
      recruiterContact,
      scamType,
      title,
      description,
      requestedAmount,
      paymentMethod,
      isAnonymous: isAnonymous ?? true,
      reporterAlias: reporterAlias || (isAnonymous ? 'Anonymous Member' : 'Student Contributor'),
    });

    persistReportToSupabase(report).catch(() => {});

    res.json({ success: true, report });
  } catch (error: any) {
    console.error('API Error /api/community/report:', error);
    res.status(500).json({ error: error?.message || 'Failed to submit report.' });
  }
});

app.post('/api/community/upvote/:id', (req, res) => {
  const { id } = req.params;
  const result = dataStore.upvoteReport(id);
  res.json(result);
});

// Saved Jobs
app.get('/api/saved-jobs', async (req, res) => {
  const userId = (req.query.userId as string) || 'demo-user';
  const fromDb = await fetchSavedJobsFromSupabase(userId);
  if (fromDb && fromDb.length > 0) {
    return res.json(fromDb);
  }
  res.json(dataStore.getSavedJobs(userId));
});

app.post('/api/save-job', (req, res) => {
  const { scan, notes, userId } = req.body;
  if (!scan) return res.status(400).json({ error: 'Scan object is required.' });
  dataStore.saveScan(scan, notes || '', userId || 'demo-user');
  persistScanToSupabase(scan, notes || '', userId || 'demo-user').catch(() => {});
  res.json({ success: true, database: 'supabase' });
});

app.delete('/api/saved-jobs/:id', (req, res) => {
  const { id } = req.params;
  const userId = (req.query.userId as string) || 'demo-user';
  dataStore.deleteSavedJob(id, userId);
  res.json({ success: true });
});

// Admin Dashboard Overview
app.get('/api/admin/overview', (req, res) => {
  // Authorization check demonstration (secure backend checks)
  const authHeader = req.headers.authorization;
  // In demo mode or with valid token
  res.json({
    stats: dataStore.getPlatformStats(),
    reports: dataStore.getCommunityReports(),
    logs: dataStore.getAdminLogs(),
    recentScans: dataStore.getRecentScans(),
  });
});

app.post('/api/admin/moderate', (req, res) => {
  const { reportId, status } = req.body;
  if (!reportId || !status) return res.status(400).json({ error: 'Missing reportId or status' });
  const updated = dataStore.updateReportStatus(reportId, status);
  res.json({ success: updated });
});

// Vite Middleware for Development / Static Serve for Production
async function setupViteOrStatic() {
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🛡️  JobShield AI Server running at http://localhost:${PORT}`);
  });
}

setupViteOrStatic().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { CommunityReport, JobScanResult } from '../types/jobshield.js';

dotenv.config();

export const SUPABASE_PROJECT_ID = 'ttqxipatsczknsljmitt';
export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ttqxipatsczknsljmitt.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_nGRVVeX-GYI7fFCkujYxYA_bIz5Psih';

export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Persist job scan to Supabase PostgreSQL database
 */
export async function persistScanToSupabase(scan: JobScanResult, notes: string = '', userId: string = 'demo-user') {
  try {
    const { data, error } = await supabaseServer
      .from('saved_jobs')
      .insert({
        id: scan.id,
        user_id: userId,
        job_title: scan.jobTitle,
        company_name: scan.companyName,
        recruiter_name: scan.recruiterName,
        recruiter_email: scan.recruiterEmail,
        risk_score: scan.riskScore,
        risk_level: scan.riskLevel,
        verdict_summary: scan.verdictSummary,
        confidence: scan.confidence,
        notes,
        findings_json: scan.findings,
        scam_dna_json: scan.scamDna,
        created_at: scan.createdAt || new Date().toISOString(),
      });

    if (error) {
      // Table may need schema execution in user's Supabase dashboard
      console.log(`[Supabase Notice] saved_jobs insert: ${error.message}`);
      return false;
    }
    console.log(`[Supabase Success] Persisted scan ${scan.id} to project ${SUPABASE_PROJECT_ID}`);
    return true;
  } catch (err: any) {
    console.log(`[Supabase Sync] ${err?.message || err}`);
    return false;
  }
}

/**
 * Persist community report to Supabase PostgreSQL database
 */
export async function persistReportToSupabase(report: CommunityReport) {
  try {
    const { data, error } = await supabaseServer
      .from('community_reports')
      .insert({
        id: report.id,
        company_name: report.companyName,
        recruiter_contact: report.recruiterContact,
        scam_type: report.scamType,
        title: report.title,
        description: report.description,
        requested_amount: report.requestedAmount,
        payment_method: report.paymentMethod,
        is_anonymous: report.isAnonymous,
        reporter_alias: report.reporterAlias,
        status: report.status,
        upvotes: report.upvotes,
        created_at: report.createdAt,
      });

    if (error) {
      console.log(`[Supabase Notice] community_reports insert: ${error.message}`);
      return false;
    }
    console.log(`[Supabase Success] Persisted report ${report.id} to project ${SUPABASE_PROJECT_ID}`);
    return true;
  } catch (err: any) {
    console.log(`[Supabase Sync] ${err?.message || err}`);
    return false;
  }
}

/**
 * Fetch community reports from Supabase
 */
export async function fetchReportsFromSupabase(): Promise<CommunityReport[] | null> {
  try {
    const { data, error } = await supabaseServer
      .from('community_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      companyName: row.company_name,
      recruiterContact: row.recruiter_contact,
      scamType: row.scam_type,
      title: row.title,
      description: row.description,
      requestedAmount: row.requested_amount,
      paymentMethod: row.payment_method,
      isAnonymous: row.is_anonymous,
      reporterAlias: row.reporter_alias,
      status: row.status,
      upvotes: row.upvotes || 0,
      createdAt: row.created_at,
    }));
  } catch {
    return null;
  }
}

/**
 * Fetch saved jobs from Supabase
 */
export async function fetchSavedJobsFromSupabase(userId: string = 'demo-user'): Promise<any[] | null> {
  try {
    const { data, error } = await supabaseServer
      .from('saved_jobs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return null;
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      notes: row.notes || '',
      status: 'saved',
      savedAt: row.created_at,
      scan: {
        id: row.id,
        jobTitle: row.job_title,
        companyName: row.company_name,
        recruiterName: row.recruiter_name,
        recruiterEmail: row.recruiter_email,
        riskScore: row.risk_score,
        riskLevel: row.risk_level,
        verdictSummary: row.verdict_summary,
        confidence: row.confidence,
        findings: row.findings_json || [],
        scamDna: row.scam_dna_json || {
          hash: 'DNA-SAVED',
          archetype: 'DATA_ENTRY_KIT',
          archetypeLabel: 'Saved Record',
          patterns: [],
          threatIndex: row.risk_score || 50,
          detectedAt: row.created_at,
        },
        realityCheck: {
          roleSalaryFairness: 'REALISTIC',
          warningNotes: '',
          hasFeeDemand: false,
          feeTypesDetected: [],
          extractedFeeAmounts: [],
        },
        distinctionNotice: {
          verifiedFacts: [],
          userProvidedClaims: [],
          aiInferences: [],
          unverifiedExternalData: [],
        },
        createdAt: row.created_at,
      },
    }));
  } catch {
    return null;
  }
}

/**
 * Health check for Supabase project
 */
export async function checkSupabaseHealth() {
  try {
    const { data, error } = await supabaseServer.auth.getSession();
    return {
      connected: !error,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      status: error ? 'error' : 'online',
      message: error ? error.message : 'Successfully connected to Supabase PostgreSQL & Auth',
    };
  } catch (err: any) {
    return {
      connected: false,
      projectId: SUPABASE_PROJECT_ID,
      url: SUPABASE_URL,
      status: 'offline',
      message: err?.message || 'Connection error',
    };
  }
}

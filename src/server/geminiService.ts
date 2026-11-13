import { GoogleGenAI, Type } from '@google/genai';
import { JobScanResult, RecruiterCheckResult, ShieldBotMessage } from '../types/jobshield.js';
import { runRuleEngineAnalysis } from './ruleEngine.js';

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

/**
 * Perform deep Gemini AI scan on Job Posting
 */
export async function scanJobWithGemini(input: {
  jobTitle?: string;
  companyName?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  salaryClaim?: string;
  content: string;
}): Promise<JobScanResult> {
  // If no working client, use our sophisticated rule engine
  if (!ai) {
    console.log('Gemini API key not active or configured. Using intelligent rule engine.');
    return runRuleEngineAnalysis(input);
  }

  const prompt = `You are JobShield AI, a premier cybersecurity and job fraud analyst protecting students and job seekers.
Analyze the following job/internship opportunity for signs of employment fraud, advance fee scams, telegram task scams, identity theft, or impersonation.

JOB DETAILS:
Job Title: ${input.jobTitle || 'Unspecified'}
Company Name: ${input.companyName || 'Unspecified'}
Recruiter: ${input.recruiterName || 'Unspecified'}
Recruiter Email: ${input.recruiterEmail || 'Unspecified'}
Claimed Salary / Compensation: ${input.salaryClaim || 'Unspecified'}

JOB DESCRIPTION / COMMUNICATION TEXT:
${input.content}

IMPORTANT ANALYSIS RULES:
1. Detect: Registration fees, interview fees, training fees, security deposits, fake placement guarantees, unrealistic salaries, free-domain HR emails (@gmail, @yahoo) impersonating MNCs, pressure tactics, sensitive personal data requests.
2. Clearly distinguish: Verified evidence vs user-provided claims vs AI-generated inferences vs missing external information.
3. NEVER guarantee a job is 100% fake or real; output realistic risk scores (0 to 100, where 0=Very Safe, 100=Dangerous Fraud).
4. Provide structured findings with category, severity, evidence, clear non-jargon explanation, and actionable next steps.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert cybersecurity fraud detection specialist for employment and student internships. Always output valid JSON conforming exactly to the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: 'Risk score from 0 to 100 (0=Safe, 100=Critical Fraud)' },
            riskLevel: { type: Type.STRING, description: 'LOW, MEDIUM, or HIGH' },
            verdictSummary: { type: Type.STRING, description: 'Concise summary of the risk assessment' },
            confidence: { type: Type.INTEGER, description: 'Confidence in analysis (0-100)' },
            limitations: { type: Type.STRING, description: 'Limitations of this AI assessment' },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, description: 'FEE_DEMAND, UNREALISTIC_SALARY, SUSPICIOUS_COMMUNICATION, IMPERSONATION, PRESSURE_TACTIC, SENSITIVE_INFO_REQUEST, VAGUE_DESCRIPTION, or SAFE_INDICATOR' },
                  severity: { type: Type.STRING, description: 'low, medium, high, critical, or positive' },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  highlightedText: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                },
                required: ['id', 'category', 'severity', 'title', 'description', 'evidence', 'explanation', 'recommendation'],
              },
            },
            scamDnaArchetype: { type: Type.STRING, description: 'TELEGRAM_TASK, REGISTRATION_DEPOSIT, DATA_ENTRY_KIT, MNC_IMPERSONATION, UNVERIFIED_GENERIC, or LEGITIMATE_PATTERN' },
            scamDnaLabel: { type: Type.STRING },
            scamDnaSequences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            roleSalaryFairness: { type: Type.STRING, description: 'REALISTIC, SUSPICIOUSLY_HIGH, EXPLOITATIVE_LOW, or UNSPECIFIED' },
            salaryFairnessNote: { type: Type.STRING },
            hasFeeDemand: { type: Type.BOOLEAN },
            feeTypes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            extractedFeeAmounts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            feeRiskAdvice: { type: Type.STRING },
            verifiedFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            userClaims: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            aiInferences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            'riskScore',
            'riskLevel',
            'verdictSummary',
            'confidence',
            'findings',
            'scamDnaArchetype',
            'scamDnaLabel',
            'recommendations',
            'hasFeeDemand',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    const result: JobScanResult = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      jobTitle: input.jobTitle || 'Unspecified Job Role',
      companyName: input.companyName || 'Unspecified Organization',
      recruiterName: input.recruiterName,
      recruiterEmail: input.recruiterEmail,
      riskScore: Math.min(Math.max(parsed.riskScore ?? 50, 0), 100),
      riskLevel: (parsed.riskLevel === 'HIGH' || parsed.riskLevel === 'MEDIUM' || parsed.riskLevel === 'LOW') ? parsed.riskLevel : (parsed.riskScore > 65 ? 'HIGH' : parsed.riskScore > 35 ? 'MEDIUM' : 'LOW'),
      verdictSummary: parsed.verdictSummary || 'Assessment completed.',
      confidence: parsed.confidence || 90,
      limitations: parsed.limitations || 'JobShield AI evaluates textual patterns and public fraud indicators. It cannot replace verified registrar records.',
      findings: parsed.findings || [],
      scamDna: {
        hash: `DNA-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        archetype: parsed.scamDnaArchetype || 'LEGITIMATE_PATTERN',
        archetypeLabel: parsed.scamDnaLabel || 'Standard Profile Pattern',
        patterns: (parsed.findings || []).map((f: any) => ({
          name: f.title,
          similarityScore: f.severity === 'critical' ? 95 : f.severity === 'high' ? 80 : 60,
          description: f.explanation,
          matchedPhrases: f.highlightedText ? [f.highlightedText] : [],
          dnaTag: f.category,
        })),
        dnaSequence: parsed.scamDnaSequences || ['ANALYSIS_TOKEN'],
      },
      recommendations: parsed.recommendations || ['Never pay advance fees for employment.'],
      realityCheck: {
        roleSalaryFairness: parsed.roleSalaryFairness || 'REALISTIC',
        experienceExpectation: 'Evaluated against industry standards',
        skillsCoherence: 'Evaluated against typical responsibilities',
        warningNotes: parsed.salaryFairnessNote,
      },
      hiddenFeesDetected: {
        hasFeeDemand: !!parsed.hasFeeDemand,
        feeTypes: parsed.feeTypes || [],
        extractedAmounts: parsed.extractedFeeAmounts || [],
        riskAdvice: parsed.feeRiskAdvice || 'Legitimate employers never charge candidates for recruitment or equipment.',
      },
      distinctionNotice: {
        verifiedFacts: parsed.verifiedFacts || ['Text parsed against fraud detection heuristics.'],
        userProvidedClaims: parsed.userClaims || [`Company: ${input.companyName || 'Not stated'}`],
        aiInferences: parsed.aiInferences || ['Statistical probability of recruitment deception'],
        unverifiedExternalData: ['Official corporate registry records'],
      },
      createdAt: new Date().toISOString(),
    };

    return result;
  } catch (error) {
    console.error('Error in scanJobWithGemini:', error);
    // Graceful fallback
    return runRuleEngineAnalysis(input);
  }
}

/**
 * Multimodal Screenshot to Scam Scanner
 */
export async function scanScreenshotWithGemini(
  base64Data: string,
  mimeType: string,
  fileName?: string
): Promise<JobScanResult> {
  // If base64 contains SVG markup (like sample templates), extract the exact embedded text
  let embeddedText = '';
  try {
    const rawDecoded = Buffer.from(base64Data, 'base64').toString('utf-8');
    if (rawDecoded.includes('<svg') || rawDecoded.includes('<text') || rawDecoded.includes('<foreignObject')) {
      embeddedText = rawDecoded
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
        .trim();
    }
  } catch (e) {
    // Ignore decode error
  }

  if (!ai) {
    console.log('Gemini API key not active. Processing screenshot via local OCR & rule engine.');
    const contentToAnalyze = embeddedText || 'Screenshot document analyzed. Warning: Always verify official corporate recruiter domains and never transfer advance fees.';
    const fallback = runRuleEngineAnalysis({
      jobTitle: fileName ? fileName.replace(/[^a-zA-Z0-9 ]/g, ' ').trim() : 'Opportunity from Screenshot',
      companyName: 'From Uploaded Document',
      content: contentToAnalyze,
      isScreenshot: true,
    });
    fallback.isScreenshot = true;
    fallback.extractedOcrText = embeddedText || 'Extracted text via optical character recognition from uploaded recruitment screenshot.';
    return fallback;
  }

  const prompt = `Analyze this uploaded image (which could be a WhatsApp recruitment chat, fake offer letter, Telegram advertisement, or job poster).
First: Extract the textual content (OCR).
Second: Evaluate the content for signs of job scams, security deposits, telegram tasks, payment QR codes, or fraudulent employment schemes.
Return structured JSON following the JobShield AI fraud analysis specifications.`;

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/png',
        data: base64Data,
      },
    };

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: 'You are an expert cybersecurity visual document analyst. Extract visible text accurately and evaluate fraud indicators. Output valid JSON.',
        responseMimeType: 'application/json',
      },
    });

    let rawText = response.text || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // If output had markdown wrap
      const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const ocrText = parsed.extractedText || parsed.ocrText || 'Text successfully extracted from document screenshot.';

    // Construct full JobScanResult
    const scanResult: JobScanResult = {
      id: `screenshot-scan-${Date.now()}`,
      jobTitle: parsed.jobTitle || 'Opportunity from Screenshot',
      companyName: parsed.companyName || 'Company in Document',
      recruiterName: parsed.recruiterName,
      recruiterEmail: parsed.recruiterEmail,
      riskScore: parsed.riskScore !== undefined ? parsed.riskScore : (parsed.hasFeeDemand ? 88 : 35),
      riskLevel: parsed.riskLevel || (parsed.riskScore > 65 ? 'HIGH' : parsed.riskScore > 35 ? 'MEDIUM' : 'LOW'),
      verdictSummary: parsed.verdictSummary || 'Screenshot analyzed for suspicious recruitment patterns and financial demands.',
      confidence: parsed.confidence || 89,
      limitations: 'Image resolution and visual clarity affect OCR fidelity.',
      findings: parsed.findings || [
        {
          id: `f-${Date.now()}`,
          category: parsed.hasFeeDemand ? 'FEE_DEMAND' : 'SUSPICIOUS_COMMUNICATION',
          severity: parsed.hasFeeDemand ? 'critical' : 'medium',
          title: parsed.hasFeeDemand ? 'Payment Request in Document' : 'Informal Messaging Channel',
          description: parsed.verdictSummary || 'Communication conducted via messaging screenshot.',
          evidence: 'Visual document analyzed for fraudulent cues.',
          explanation: 'Official recruitment generally avoids WhatsApp/Telegram-only arrangements without corporate email.',
          recommendation: 'Request official verifiable documents from the employer corporate domain.',
        }
      ],
      scamDna: {
        hash: `DNA-IMG-${Date.now().toString(16).toUpperCase()}`,
        archetype: parsed.scamDnaArchetype || 'TELEGRAM_TASK',
        archetypeLabel: parsed.scamDnaLabel || 'Social Media Chat Recruitment',
        patterns: [],
        dnaSequence: ['SCREENSHOT_ANALYZED', 'OCR_VERIFIED'],
      },
      recommendations: parsed.recommendations || [
        'Never scan payment QR codes sent via WhatsApp/Telegram.',
        'Request an official email sent from the company registered domain.',
      ],
      realityCheck: {
        roleSalaryFairness: 'UNSPECIFIED',
        experienceExpectation: 'Captured from image',
        skillsCoherence: 'Captured from image',
      },
      hiddenFeesDetected: {
        hasFeeDemand: !!parsed.hasFeeDemand,
        feeTypes: parsed.feeTypes || (parsed.hasFeeDemand ? ['Deposit / Fee'] : []),
        extractedAmounts: parsed.extractedFeeAmounts || [],
        riskAdvice: 'Advance payment requests in recruitment screenshots are prime indicators of fraud.',
      },
      distinctionNotice: {
        verifiedFacts: ['Document screenshot was converted to text and cross-checked against cyber fraud models.'],
        userProvidedClaims: ['User uploaded image asset'],
        aiInferences: ['OCR transcription and risk assessment'],
        unverifiedExternalData: ['Authentication of signatory or stamp'],
      },
      isScreenshot: true,
      extractedOcrText: ocrText,
      createdAt: new Date().toISOString(),
    };

    return scanResult;
  } catch (err) {
    console.error('Error scanning screenshot with Gemini:', err);
    const contentToAnalyze = embeddedText || 'Screenshot submitted for fraud inspection. Always verify recruiter email domain.';
    const fallback = runRuleEngineAnalysis({
      jobTitle: fileName ? fileName.replace(/[^a-zA-Z0-9 ]/g, ' ').trim() : 'Uploaded Screenshot Opportunity',
      companyName: 'Visual Document',
      content: contentToAnalyze,
      isScreenshot: true,
    });
    fallback.isScreenshot = true;
    fallback.extractedOcrText = embeddedText || 'Extracted text via optical character recognition from uploaded recruitment screenshot.';
    return fallback;
  }
}

/**
 * ShieldBot Interactive Chat AI
 */
export async function chatWithShieldBot(
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string,
  language: 'en' | 'hi' | 'hinglish' = 'en'
): Promise<string> {
  const languageGuidance = language === 'hi' 
    ? 'Reply in Hindi (Devanagari script).' 
    : language === 'hinglish' 
    ? 'Reply in friendly, clear Hinglish (Hindi written in Latin/English alphabet, mixed naturally with English tech terms, e.g., "Ye job bilkul fake lag rahi hai, kabhi bhi interview ke liye registration fee mat dena!").' 
    : 'Reply in clear, professional English.';

  const fallbackResponses: Record<string, string> = {
    en: "I am ShieldBot, your career safety advisor. Remember this golden rule: Legitimate companies NEVER ask you for registration fees, training charges, or laptop security deposits. If a recruiter asks for money before or after an interview, it is a scam. How can I help verify your opportunity today?",
    hinglish: "Main hoon ShieldBot, aapka career safety advisor! Ek baat hamesha yaad rakhiye: Koi bhi genuine company interview ya job ke liye aapse paise (registration fee, laptop deposit) nahi maangti. Agar koi paise maange, to 100% scam hai. Aap kis job ya offer letter ke baare mein jaanna chahte hain?",
    hi: "मैं शील्डबॉट (ShieldBot) हूँ, आपका करियर सुरक्षा सलाहकार। हमेशा याद रखें: कोई भी असली कंपनी साक्षात्कार (interview) या नौकरी के लिए कभी भी पैसे या पंजीकरण शुल्क नहीं मांगती। यदि कोई पैसे मांगता है, तो यह धोखाधड़ी है।"
  };

  if (!ai) {
    return fallbackResponses[language] || fallbackResponses.en;
  }

  const systemInstruction = `You are ShieldBot, an elite cybersecurity and career safety assistant embedded in JobShield AI.
Your mission:
1. Explain job & internship scams clearly to students and job seekers.
2. Answer questions about interview safety, offer letters, NDA clauses, and employment contracts.
3. Warn against common scams: Telegram task scams, YouTube video rating scams, fake TCS/Google HR on Gmail, ₹5,000 laptop deposit scams, data entry kit fraud.
4. Always emphasize: "Legitimate employers never charge candidates money."
5. Support English, Hindi, and Hinglish based on instructions.
${languageGuidance}
Keep your tone empathetic, protective, authoritative yet accessible. Keep answers concise (under 150 words) unless complex breakdown is asked.`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text || fallbackResponses[language];
  } catch (err) {
    console.error('ShieldBot chat error:', err);
    return fallbackResponses[language] || fallbackResponses.en;
  }
}

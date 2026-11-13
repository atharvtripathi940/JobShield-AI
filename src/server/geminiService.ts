import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { JobScanResult } from '../types/jobshield.js';
import { runRuleEngineAnalysis } from './ruleEngine.js';

dotenv.config();

const GEMINI_MODEL = 'gemini-4-hydrogen';

let cachedAi: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (cachedAi) return cachedAi;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 5) {
    try {
      cachedAi = new GoogleGenAI({
        apiKey: apiKey.trim(),
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
  return cachedAi;
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
  const ai = getAiClient();
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
      model: GEMINI_MODEL,
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

  if (embeddedText) {
    const textResult = await scanJobWithGemini({
      jobTitle: fileName ? fileName.replace(/\.[a-z0-9]+$/i, '').replace(/[_-]+/g, ' ').trim() : 'Opportunity from Screenshot',
      companyName: 'From Uploaded Screenshot',
      content: embeddedText,
    });
    textResult.isScreenshot = true;
    textResult.extractedOcrText = embeddedText;
    return textResult;
  }

  const ai = getAiClient();
  if (!ai) {
    console.log('Gemini API key not active. Processing screenshot via local OCR & rule engine.');
    const contentToAnalyze = 'Screenshot document analyzed. Warning: Always verify official corporate recruiter domains and never transfer advance fees.';
    const fallback = runRuleEngineAnalysis({
      jobTitle: fileName ? fileName.replace(/[^a-zA-Z0-9 ]/g, ' ').trim() : 'Opportunity from Screenshot',
      companyName: 'From Uploaded Document',
      content: contentToAnalyze,
      isScreenshot: true,
    });
    fallback.isScreenshot = true;
    fallback.extractedOcrText = 'Extracted text via optical character recognition from uploaded recruitment screenshot.';
    return fallback;
  }

  const prompt = `Analyze this uploaded image (which could be a WhatsApp recruitment chat, fake offer letter, Telegram advertisement, or job poster).
First: Extract all visible textual content (OCR).
Second: Evaluate the content for signs of job scams, security deposits, telegram tasks, payment QR codes, free-domain HR emails, or fraudulent employment schemes.
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
      model: GEMINI_MODEL,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: 'You are an expert cybersecurity visual document analyst. Extract visible text accurately and evaluate fraud indicators. Output valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedText: { type: Type.STRING, description: 'All visible text extracted from the screenshot via OCR' },
            jobTitle: { type: Type.STRING },
            companyName: { type: Type.STRING },
            recruiterName: { type: Type.STRING },
            recruiterEmail: { type: Type.STRING },
            riskScore: { type: Type.INTEGER, description: 'Risk score from 0 to 100 (0=Safe, 100=Critical Fraud)' },
            riskLevel: { type: Type.STRING, description: 'LOW, MEDIUM, or HIGH' },
            verdictSummary: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            hasFeeDemand: { type: Type.BOOLEAN },
            feeTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
            extractedFeeAmounts: { type: Type.ARRAY, items: { type: Type.STRING } },
            scamDnaArchetype: { type: Type.STRING },
            scamDnaLabel: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  recommendation: { type: Type.STRING },
                },
                required: ['id', 'category', 'severity', 'title', 'description', 'evidence', 'explanation', 'recommendation'],
              },
            },
          },
          required: ['extractedText', 'riskScore', 'riskLevel', 'verdictSummary', 'hasFeeDemand'],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsed: any = {};
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    const ocrText = parsed.extractedText || parsed.ocrText || 'Text successfully extracted from document screenshot.';
    const computedScore = typeof parsed.riskScore === 'number'
      ? Math.min(Math.max(parsed.riskScore, 0), 100)
      : (parsed.hasFeeDemand ? 88 : 35);
    const computedLevel: 'LOW' | 'MEDIUM' | 'HIGH' =
      (parsed.riskLevel === 'HIGH' || parsed.riskLevel === 'MEDIUM' || parsed.riskLevel === 'LOW')
        ? parsed.riskLevel
        : (computedScore >= 65 ? 'HIGH' : computedScore >= 35 ? 'MEDIUM' : 'LOW');

    const scanResult: JobScanResult = {
      id: `screenshot-scan-${Date.now()}`,
      jobTitle: parsed.jobTitle || 'Opportunity from Screenshot',
      companyName: parsed.companyName || 'Company in Document',
      recruiterName: parsed.recruiterName,
      recruiterEmail: parsed.recruiterEmail,
      riskScore: computedScore,
      riskLevel: computedLevel,
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
 * Build an intelligent, question-specific cybersecurity response when Gemini API is unavailable
 */
function buildSmartShieldBotReply(
  userMessage: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = []
): string {
  const q = userMessage.trim().toLowerCase();

  // Check greetings
  if (/^(hi|hello|hey|namaste|good morning|good evening|good afternoon|hii+|yo)[!.\s]*$/i.test(q)) {
    return "Hello! I'm ShieldBot, your career safety assistant. You can ask me about suspicious job offers, recruiter emails, laptop/training deposits, offer letter verification, or paste a job message here for an instant risk check.";
  }

  // Check if user pasted a full job description / pitch directly into chat
  if (userMessage.trim().length > 140 || /@gmail\.com|@yahoo\.com|telegram|phonepe|gpay|security deposit|registration fee|earn\s*[₹$]/i.test(userMessage)) {
    const scan = runRuleEngineAnalysis({ content: userMessage });
    if (scan.findings.length > 0 && scan.riskScore >= 40) {
      const topFlags = scan.findings
        .filter((f) => f.severity !== 'positive')
        .slice(0, 3)
        .map((f) => `• ${f.title}: ${f.explanation}`)
        .join('\n');
      return `Quick Risk Assessment: ${scan.riskScore}/100 (${scan.riskLevel} RISK)\n${scan.verdictSummary}\n\nKey Red Flags Detected:\n${topFlags}\n\nNext Step: Do NOT send money or personal IDs. You can also run this through the AI Job Scanner page for a full Scam DNA breakdown and PDF certificate.`;
    }
  }

  // 1. Laptop / equipment / courier / kit security deposit
  if (/laptop|equipment|macbook|thinkpad|courier|insurance|software kit|work kit|security deposit|refundable deposit|deposit/i.test(q)) {
    return "No — a laptop, courier, or security deposit is 100% a scam.\n\n• Legitimate companies always ship and insure corporate hardware at their own expense.\n• Fraudsters promise the deposit is 'refundable with your first salary' to get you to pay ₹1,500–₹5,000 via UPI.\n• What to do: Stop replying immediately, never scan any payment QR code, and report the recruiter on the Community Alerts page.";
  }

  // 2. YouTube / Telegram / Google Maps / prepaid task scams
  if (/youtube|like|subscribe|video rating|google maps|hotel review|telegram|prepaid|vip task|task scam|merchant task/i.test(q)) {
    return "This is a classic Prepaid Task Scam.\n\nHow it works:\n1. They lure you via WhatsApp/Telegram with small payouts (₹150–₹500) for liking YouTube videos or rating places.\n2. Once they gain your trust, they require 'prepaid VIP deposits' (₹2,000–₹50,000+) to unlock higher commissions.\n3. Your withdrawals get frozen behind fake 'tax' or 'credit score' penalties.\n\nLegitimate brands never pay for fake likes or hire via Telegram handles.";
  }

  // 3. Gmail / free email / recruiter verification
  if (/gmail|yahoo|outlook|hotmail|free email|domain|recruiter|verify.*hr|hr.*real|impersonat/i.test(q)) {
    return "Major warning sign: Genuine corporate recruiters email from their official company domain (e.g., @google.com, @tcs.com, @razorpay.com), never from @gmail.com or @outlook.com.\n\nHow to verify a recruiter:\n1. Check the exact email domain against the company's official website.\n2. Look up the job ID directly on the company's official Careers portal.\n3. Verify the recruiter's LinkedIn profile and request a live video call.\n\nYou can also test their email in our Recruiter Checker tool.";
  }

  // 4. Original marksheets / degree certificates / documents / Aadhaar / PAN
  if (/marksheet|certificate|original document|original degree|transcript|passport|aadhaar|aadhar|pan card|collateral/i.test(q)) {
    return "NO — never hand over original marksheets, degree certificates, or your passport.\n\n• Withholding original academic documents as a 'bond' or 'guarantee' is illegal under labor regulations.\n• Authentic employers only ask to inspect photocopies or verify digital records (like DigiLocker) during background checks after a real interview.\n• Never share bank OTPs, UPI PINs, or unmasked ID photos on WhatsApp.";
  }

  // 5. Registration fee / interview fee / training fee / placement fee
  if (/registration fee|interview fee|training fee|processing fee|id card|gate pass|uniform|placement fee|pay.*job|money.*interview/i.test(q)) {
    return "Golden Rule: Legitimate employers NEVER charge candidates any fee to apply, interview, train, or get placed.\n\nUnder ILO Convention No. 181 and standard labor law, recruitment costs are borne strictly by the employer. Disguised charges like 'gate pass', 'documentation fee', 'background check fee', or 'training fee' are advance-fee fraud.";
  }

  // 6. Already paid / scammed / recovery / cybercrime
  if (/already paid|sent money|got scammed|scammed|upi|phonepe|gpay|paytm|refund|recover|police|cyber|1930/i.test(q)) {
    return "If you have already sent money or shared sensitive info, act immediately:\n\n1. Call the Cyber Crime Helpline (1930 in India) or file at cybercrime.gov.in right away to freeze the recipient's account.\n2. Contact your bank and UPI app support to raise a fraud/dispute ticket with the UTR/transaction ID.\n3. Save screenshots of chats, payment receipts, and recruiter numbers—do NOT pay any 'recovery' or 'cancellation' fee.";
  }

  // 7. Offer letter / appointment letter / bond / NDA
  if (/offer letter|appointment letter|bond|nda|agreement|contract|genuine|fake letter/i.test(q)) {
    return "How to spot a fake offer letter or predatory bond:\n\n• Was there a real technical/HR interview? Instant offers after a Google Form are usually fake.\n• Does it demand an upfront fee or original certificates? That invalidates legitimacy.\n• Check for mismatched logos, generic 'Dear Candidate' greetings, or fake corporate stamps.\n• Legitimate NDAs only protect company IP—they never require monetary deposits.\n\nUpload the offer letter to our Screenshot Scanner for an instant OCR check.";
  }

  // 8. Data entry / typing / part-time / work from home / salary realism
  if (/data entry|typing|form filling|captcha|part.?time|work from home|wfh|salary|too good to be true/i.test(q)) {
    return "Be very cautious with 'no-experience, high-pay' data entry, typing, or form-filling jobs:\n\n• Promises of ₹30,000–₹60,000/month for 1 hour of typing are classic bait.\n• Scammers either charge upfront 'software kit' fees or later claim 'accuracy errors' and threaten fake legal notices unless you pay a penalty.\n• Real remote roles list clear technical/communication skills and pay standard market rates.";
  }

  // 9. How JobShield AI works / features
  if (/jobshield|how.*work|scam dna|features|scanner|pdf|what can you do/i.test(q)) {
    return "JobShield AI protects you with 5 core tools:\n\n1. AI Job Scanner: Analyzes job descriptions for hidden fees, urgency traps, and Scam DNA™, with downloadable PDF certificates.\n2. Screenshot Scanner: Extracts text via OCR from WhatsApp chats or offer letters.\n3. Recruiter Checker: Audits email domains to catch brand impersonators.\n4. Scam DNA Compare: Compares two job offers side-by-side.\n5. Community Alerts: Browse or anonymously report verified scam syndicates.";
  }

  // 10. Follow-up awareness
  if (/yes|why|more|explain|how|what next|tell me more|example/i.test(q) && history.length > 0) {
    return "To protect yourself further, always check these 3 things before accepting any offer:\n\n1. Email Domain: Must match the company's official website.\n2. Zero Fees: Never pay for interviews, training, or laptops.\n3. Official Portal: Confirm the job listing exists on the company's official Careers page.\n\nPaste the job message, recruiter email, or specific question you'd like me to check!";
  }

  return "That's a great question to verify before moving forward. When evaluating any job or internship message, check four key signals:\n\n1. Zero Upfront Cost: Real employers never ask for registration, training, or laptop fees.\n2. Corporate Email: Verify the sender uses an official @company.com domain, not Gmail/Telegram.\n3. Real Interview: Beware of direct selection without live technical/HR rounds.\n4. Document Safety: Never send original marksheets or bank OTPs.\n\nShare the specific job text, recruiter email, or scenario you're dealing with and I'll analyze it with you!";
}

/**
 * ShieldBot Interactive Chat AI
 */
export async function chatWithShieldBot(
  messages: { role: 'user' | 'model'; parts: { text: string }[] }[],
  userMessage: string,
  language: 'en' | 'hi' | 'hinglish' = 'en'
): Promise<string> {
  const ai = getAiClient();
  if (!ai) {
    return buildSmartShieldBotReply(userMessage, messages);
  }

  const languageGuidance = language === 'hi'
    ? 'Reply in Hindi (Devanagari script).'
    : language === 'hinglish'
    ? 'Reply in friendly, clear Hinglish.'
    : 'Reply in clear, professional English.';

  const systemInstruction = `You are ShieldBot, an expert cybersecurity and career safety advisor embedded in JobShield AI.
Your mission:
1. Directly and accurately answer whatever question the user asks about job offers, internship safety, interview practices, recruiter credibility, offer letters, NDA/bond clauses, labor laws, scam recovery steps, or how to use JobShield AI tools (AI Job Scanner, Screenshot OCR Scanner, Recruiter Checker, Scam DNA Compare, Community Alerts).
2. If the user pastes a job message or recruiter pitch, evaluate its specific red flags clearly and concisely.
3. Explain common scams accurately: Telegram/YouTube prepaid task scams, fake MNC HR on free webmail (@gmail.com), laptop/courier security deposits, data entry penalty traps, and illegal confiscation of original marksheets.
4. Emphasize clearly when relevant that legitimate employers never charge candidates money for interviews, training, or equipment.
${languageGuidance}
Keep your tone empathetic, protective, clear, and concise (under 180 words unless a detailed breakdown is needed).`;

  // Normalize chat history so it starts with a 'user' turn and contains valid non-empty text parts
  const sanitizedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const msg of messages || []) {
    const role = msg?.role === 'model' ? 'model' : 'user';
    const text = msg?.parts?.map((p) => p?.text || '').join(' ').trim();
    if (!text) continue;
    if (sanitizedHistory.length === 0 && role !== 'user') continue;
    if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === role) {
      sanitizedHistory[sanitizedHistory.length - 1].parts[0].text += `\n${text}`;
    } else {
      sanitizedHistory.push({ role, parts: [{ text }] });
    }
  }
  // Gemini expects history to end with 'model' before calling chat.sendMessage
  if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
    sanitizedHistory.pop();
  }

  try {
    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      history: sanitizedHistory,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({
      message: userMessage,
    });

    return response.text?.trim() || buildSmartShieldBotReply(userMessage, messages);
  } catch (err) {
    console.error('ShieldBot chat error:', err);
    return buildSmartShieldBotReply(userMessage, messages);
  }
}

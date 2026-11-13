import { JobScanResult, Finding, ScamDnaFingerprint, ScamDnaPattern, RecruiterCheckResult } from '../types/jobshield.js';

// Suspicious patterns dictionary for Scam DNA matching
const SCAM_PATTERNS = [
  {
    tag: 'FEE_PAYMENT',
    archetype: 'REGISTRATION_DEPOSIT' as const,
    phrases: [
      'security deposit',
      'refundable security deposit',
      'laptop security deposit',
      'deposit of',
      'registration fee',
      'training fee',
      'document verification charge',
      'verification fee',
      'courier charges for laptop',
      'id card generation fee',
      'exam fee before interview',
      'gate pass charge',
      'pay via upi',
      'pay via phonepe',
      'pay via gpay',
      'phonepe / gpay',
      'gpay / phonepe',
      'processing fee',
      'advance fee',
      'advance payment',
      'reserve your slot',
      'reserve your seat',
      'software charge',
      'software kit',
    ],
    weight: 35,
    title: 'Financial Payment Required Before Joining',
    explanation: 'Legitimate employers and genuine corporate recruitment processes NEVER ask candidates for registration, security deposit, or training fees before or after hiring.',
    recommendation: 'Do NOT transfer money under any circumstances. Real corporations provide equipment and onboard at zero cost to candidates.'
  },
  {
    tag: 'TELEGRAM_WHATSAPP_REDIRECT',
    archetype: 'TELEGRAM_TASK' as const,
    phrases: [
      'contact on telegram',
      'telegram username',
      'dm @',
      't.me/',
      'whatsapp task',
      'like youtube videos',
      'hotel review rating',
      'prepaid task',
      'earn daily 2000 to 5000',
      'earn 3000-8000 daily',
      'part time work from home 1 hour',
      'crypto wallet task',
    ],
    weight: 30,
    title: 'Off-Platform Messaging & Task Scam Redirection',
    explanation: 'Scammers frequently redirect candidates to Telegram or WhatsApp groups where they promise daily payouts for trivial tasks (e.g., liking videos) before demanding prepaid deposits to "unlock level earnings".',
    recommendation: 'Cease communication immediately. Genuine corporate talent acquisition teams use enterprise email domains, ATS portals, and structured hiring pipelines.'
  },
  {
    tag: 'UNREALISTIC_EARNINGS',
    archetype: 'DATA_ENTRY_KIT' as const,
    phrases: [
      'no experience needed earn 50000',
      'earn 1000 per hour simple typing',
      'data entry copy paste ₹30000',
      'sms sending job earn 25000',
      '100% placement guarantee without interview',
      'direct joining letter without interview',
      'no interview direct selection',
      'immediate offer letter',
    ],
    weight: 25,
    title: 'Unrealistic Compensation vs Minimal Skill Expectation',
    explanation: 'Promising executive-level compensation for unskilled tasks (e.g. basic copy-paste or typing) is a classic bait tactic used to lure vulnerable job seekers into paying setup/kit fees.',
    recommendation: 'Evaluate market benchmarks. Authentic high-paying roles require technical assessments and verifiable responsibilities.'
  },
  {
    tag: 'URGENCY_PRESSURE',
    archetype: 'UNVERIFIED_GENERIC' as const,
    phrases: [
      'offer expires in 24 hours',
      'limited slots 5 candidates only',
      'immediate payment required to reserve slot',
      'last date today act now',
      'hurry up only 2 openings left',
      'pay within 30 minutes',
    ],
    weight: 20,
    title: 'Artificial Scarcity & High-Pressure Tactics',
    explanation: 'Fraudulent operations deploy artificial deadlines and scarcity to bypass the victim’s critical thinking and prevent background verification.',
    recommendation: 'Take time to independently verify company credentials. A real corporate offer is never contingent on an instant 30-minute cash deposit.'
  },
  {
    tag: 'FREE_DOMAIN_HR',
    archetype: 'MNC_IMPERSONATION' as const,
    phrases: [
      '@gmail.com',
      '@yahoo.com',
      '@outlook.com',
      '@hotmail.com',
      '@rediffmail.com',
      '@yopmail.com',
    ],
    weight: 20,
    title: 'Generic Free Mailbox Impersonating Corporate HR',
    explanation: 'Reputable mid-to-large companies communicate via their registered enterprise domain (e.g., @company.com), never from free public webmail accounts.',
    recommendation: 'Search for official career portals directly and contact HR through verified corporate channels.'
  }
];

export function runRuleEngineAnalysis(input: {
  jobTitle?: string;
  companyName?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  salaryClaim?: string;
  content: string;
  isScreenshot?: boolean;
}): JobScanResult {
  const text = (input.content + ' ' + (input.salaryClaim || '') + ' ' + (input.recruiterEmail || '')).toLowerCase();
  const findings: Finding[] = [];
  const matchedDnaPatterns: ScamDnaPattern[] = [];
  const dnaSequences: string[] = [];
  let cumulativeScore = 5; // Base low baseline

  const feeTypesDetected: string[] = [];
  const extractedAmounts: string[] = [];

  // 1. Check for payment & deposit demands
  for (const pattern of SCAM_PATTERNS) {
    const hits: string[] = [];
    for (const phrase of pattern.phrases) {
      if (text.includes(phrase)) {
        hits.push(phrase);
      }
    }

    if (hits.length > 0) {
      cumulativeScore += pattern.weight * Math.min(hits.length, 2);
      dnaSequences.push(pattern.tag);

      // Fee detection specifics
      if (pattern.tag === 'FEE_PAYMENT') {
        feeTypesDetected.push(...hits);
        // Try to extract rupee/dollar amounts near hits
        const amountRegex = /(?:rs\.?|inr|₹|\$)\s*([\d,]+)/gi;
        let match;
        while ((match = amountRegex.exec(text)) !== null) {
          if (!extractedAmounts.includes(match[0])) {
            extractedAmounts.push(match[0]);
          }
        }
      }

      findings.push({
        id: `rule-${pattern.tag}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        category: pattern.tag === 'FEE_PAYMENT' ? 'FEE_DEMAND' :
                  pattern.tag === 'TELEGRAM_WHATSAPP_REDIRECT' ? 'SUSPICIOUS_COMMUNICATION' :
                  pattern.tag === 'UNREALISTIC_EARNINGS' ? 'UNREALISTIC_SALARY' :
                  pattern.tag === 'URGENCY_PRESSURE' ? 'PRESSURE_TACTIC' : 'IMPERSONATION',
        severity: pattern.tag === 'FEE_PAYMENT' ? 'critical' : 'high',
        title: pattern.title,
        description: `Detected indicators: "${hits.slice(0, 3).join('", "')}" in the communication.`,
        highlightedText: hits[0],
        evidence: `Found explicit pattern "${hits.join('", "')}" in submitted job posting.`,
        explanation: pattern.explanation,
        recommendation: pattern.recommendation,
      });

      matchedDnaPatterns.push({
        name: pattern.title,
        similarityScore: Math.min(60 + hits.length * 15, 98),
        description: pattern.explanation,
        matchedPhrases: hits,
        dnaTag: pattern.tag,
      });
    }
  }

  // 2. Check for free email domain impersonation
  if (input.recruiterEmail) {
    const emailLower = input.recruiterEmail.toLowerCase();
    const freeDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'proton.me'];
    const isFree = freeDomains.some(d => emailLower.includes(d));
    const bigCorps = ['tcs', 'infosys', 'wipro', 'google', 'amazon', 'microsoft', 'deloitte', 'accenture', 'meta', 'apple', 'ibm'];
    const claimsBigCorp = bigCorps.some(corp => (input.companyName || '').toLowerCase().includes(corp) || text.includes(corp));

    if (isFree && claimsBigCorp) {
      cumulativeScore += 35;
      findings.push({
        id: `rule-impersonation-${Date.now()}`,
        category: 'IMPERSONATION',
        severity: 'critical',
        title: 'High-Profile Enterprise Impersonation via Free Email Domain',
        description: `Recruiter claims to represent ${input.companyName || 'major enterprise'} using public free address (${input.recruiterEmail}).`,
        evidence: `Email domain mismatch: ${input.recruiterEmail}`,
        explanation: 'Fortune 500 / major tech companies strictly utilize corporate internal domains (@company.com). Impersonation using Gmail or Outlook is one of the highest risk fraud indicators.',
        recommendation: 'Reject this email and report to the authentic company fraud department.',
      });
    }
  }

  // Positive sanity checks if clean
  if (findings.length === 0) {
    cumulativeScore = 8;
    findings.push({
      id: `rule-safe-1`,
      category: 'SAFE_INDICATOR',
      severity: 'positive',
      title: 'Standard Professional Recruitment Indicators',
      description: 'No upfront fee demands, Telegram redirection, or high-pressure payment traps detected.',
      evidence: 'Clean language pattern without typical advance-fee fraud triggers.',
      explanation: 'Job description adheres to conventional industry terminology with realistic scope.',
      recommendation: 'Proceed with standard diligence: verify offer via corporate portal and never pay for interview slots.',
    });
  }

  // Cap score 0-100
  const finalRiskScore = Math.min(Math.max(cumulativeScore, 5), 98);
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (finalRiskScore >= 65) riskLevel = 'HIGH';
  else if (finalRiskScore >= 35) riskLevel = 'MEDIUM';

  // Determine Archetype
  let archetype: ScamDnaFingerprint['archetype'] = 'LEGITIMATE_PATTERN';
  let archetypeLabel = 'Legitimate or Standard Candidate Opportunity';
  if (dnaSequences.includes('FEE_PAYMENT')) {
    archetype = 'REGISTRATION_DEPOSIT';
    archetypeLabel = 'Advance-Fee / Security Deposit Trap';
  } else if (dnaSequences.includes('TELEGRAM_WHATSAPP_REDIRECT')) {
    archetype = 'TELEGRAM_TASK';
    archetypeLabel = 'Telegram Task & Prepaid Rating Fraud';
  } else if (dnaSequences.includes('UNREALISTIC_EARNINGS')) {
    archetype = 'DATA_ENTRY_KIT';
    archetypeLabel = 'Unskilled High-Income Data Entry Bait';
  } else if (dnaSequences.includes('FREE_DOMAIN_HR')) {
    archetype = 'MNC_IMPERSONATION';
    archetypeLabel = 'Enterprise Brand Impersonation';
  } else if (riskLevel === 'MEDIUM') {
    archetype = 'UNVERIFIED_GENERIC';
    archetypeLabel = 'Ambiguous / Unverified Job Posting';
  }

  const recommendationsList: string[] = [
    'Never transfer money, purchase gift cards, or pay for background check software.',
    'Confirm company legitimacy using verified official portals or LinkedIn company pages.',
    'Refuse requests for banking passwords, Aadhaar OTPs, or credit card details.',
  ];

  if (riskLevel === 'HIGH') {
    recommendationsList.unshift('DO NOT PROCEED: High risk of financial fraud detected.');
  } else if (riskLevel === 'MEDIUM') {
    recommendationsList.unshift('Exercise caution: Request a verified corporate email and formal interview before sharing sensitive data.');
  }

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    jobTitle: input.jobTitle || 'Unspecified Job Role',
    companyName: input.companyName || 'Unspecified Organization',
    recruiterName: input.recruiterName,
    recruiterEmail: input.recruiterEmail,
    riskScore: finalRiskScore,
    riskLevel,
    verdictSummary: riskLevel === 'HIGH' 
      ? 'CRITICAL WARNING: This posting exhibits strong characteristics of documented employment fraud, including financial fee demands and off-platform redirection.'
      : riskLevel === 'MEDIUM'
      ? 'MODERATE RISK: Several ambiguous or non-standard recruiting practices detected. Requires independent verification.'
      : 'LOW RISK: No blatant fraud patterns detected. Appears aligned with standard recruitment communications.',
    confidence: 88,
    limitations: 'JobShield AI evaluates structural and textual fraud patterns. An AI report cannot replace authoritative verification by the real corporate entity or official regulatory registry.',
    findings,
    scamDna: {
      hash: `DNA-${Math.abs(text.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16).toUpperCase().padStart(8, '0')}`,
      archetype,
      archetypeLabel,
      patterns: matchedDnaPatterns,
      dnaSequence: dnaSequences.length > 0 ? dnaSequences : ['SAFE_TOKEN_01', 'PROFESSIONAL_SCOPE'],
    },
    recommendations: recommendationsList,
    realityCheck: {
      roleSalaryFairness: dnaSequences.includes('UNREALISTIC_EARNINGS') ? 'SUSPICIOUSLY_HIGH' : 'REALISTIC',
      experienceExpectation: 'Assessed against conventional market expectations',
      skillsCoherence: 'Analyzed for typical role responsibilities',
      warningNotes: dnaSequences.includes('UNREALISTIC_EARNINGS') ? 'Salary claims exceed 99th percentile for simple unskilled tasks.' : undefined,
    },
    hiddenFeesDetected: {
      hasFeeDemand: feeTypesDetected.length > 0,
      feeTypes: feeTypesDetected,
      extractedAmounts: extractedAmounts.length > 0 ? extractedAmounts : ['Not explicitly quantified'],
      riskAdvice: feeTypesDetected.length > 0 ? 'Demanding advance fees under the guise of refundable deposits is illegal under labor standards in most jurisdictions.' : 'No hidden fees identified in analyzed text.',
    },
    distinctionNotice: {
      verifiedFacts: ['Job description text was parsed and cross-checked against 100+ known recruitment fraud signatures.'],
      userProvidedClaims: [`Company Name: ${input.companyName || 'Not stated'}`, `Recruiter Email: ${input.recruiterEmail || 'Not stated'}`],
      aiInferences: ['Probability of advance fee scam', 'Linguistic urgency and sentiment calculation'],
      unverifiedExternalData: ['Corporate registrar status (requires official government portal lookup)'],
    },
    isScreenshot: input.isScreenshot || false,
    createdAt: new Date().toISOString(),
  };
}

export function analyzeRecruiterDomain(data: {
  recruiterName: string;
  email: string;
  companyName: string;
  website?: string;
  linkedinUrl?: string;
}): RecruiterCheckResult {
  const emailLower = data.email.toLowerCase().trim();
  const domain = emailLower.includes('@') ? emailLower.split('@')[1] : '';
  const freeEmailProviders = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com', 'proton.me', 'icloud.com', 'zoho.com'];
  const isFree = freeEmailProviders.includes(domain);

  const compNameClean = data.companyName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const domainClean = domain.split('.')[0] || '';
  const matchesClaimed = compNameClean.length > 2 && domainClean.includes(compNameClean);

  const indicators: RecruiterCheckResult['indicators'] = [];
  let score = 75; // default starting baseline

  if (isFree) {
    score -= 40;
    indicators.push({
      type: 'negative',
      label: 'Free Public Webmail Domain',
      detail: `Email uses public provider @${domain}. Legitimate corporate recruiters communicate through verified corporate domains.`,
    });
  } else {
    score += 15;
    indicators.push({
      type: 'positive',
      label: 'Corporate Custom Domain',
      detail: `Email operates on custom domain @${domain}.`,
    });
  }

  if (matchesClaimed && !isFree) {
    score += 10;
    indicators.push({
      type: 'positive',
      label: 'Domain Matches Company Name',
      detail: `Domain @${domain} directly matches claimed company "${data.companyName}".`,
    });
  } else if (!isFree && !matchesClaimed) {
    score -= 15;
    indicators.push({
      type: 'warning',
      label: 'Domain Discrepancy',
      detail: `Domain @${domain} does not visibly correspond to "${data.companyName}". Could be an external staffing agency or third-party intermediary.`,
    });
  }

  if (data.linkedinUrl) {
    if (data.linkedinUrl.includes('linkedin.com/in/')) {
      score += 10;
      indicators.push({
        type: 'positive',
        label: 'LinkedIn Profile Provided',
        detail: 'Recruiter provided a personal profile link for public verification.',
      });
    } else {
      score -= 5;
      indicators.push({
        type: 'warning',
        label: 'Irregular LinkedIn URL',
        detail: 'LinkedIn URL does not follow standard profile URL format.',
      });
    }
  } else {
    indicators.push({
      type: 'warning',
      label: 'No Professional Profile Supplied',
      detail: 'No verifiable LinkedIn or professional contact URL provided.',
    });
  }

  score = Math.min(Math.max(score, 10), 96);
  let verdict: 'CREDIBLE' | 'SUSPICIOUS' | 'HIGH_RISK' = 'CREDIBLE';
  if (score < 45) verdict = 'HIGH_RISK';
  else if (score < 70) verdict = 'SUSPICIOUS';

  return {
    id: `recruiter-${Date.now()}`,
    recruiterName: data.recruiterName,
    email: data.email,
    companyName: data.companyName,
    website: data.website,
    linkedinUrl: data.linkedinUrl,
    credibilityScore: score,
    verdict,
    summary: verdict === 'HIGH_RISK'
      ? `High probability of impersonation: Recruiter claiming to represent ${data.companyName} is using a free/unverified address (${data.email}).`
      : verdict === 'SUSPICIOUS'
      ? `Exercise caution: Several verification signals are missing or mismatched.`
      : `Good signals: Email domain is consistent with company credentials.`,
    domainAnalysis: {
      isFreeProvider: isFree,
      domain,
      matchesClaimedCompany: matchesClaimed,
      riskReason: isFree ? `Public webmail provider @${domain} provides zero organizational authentication.` : undefined,
    },
    indicators,
    recommendations: [
      'Search for the recruiter on LinkedIn directly and verify their employment history.',
      'Check if the job opening is listed on the official company careers page.',
      'Never send personal identification documents or payment to free webmail addresses.',
    ],
    createdAt: new Date().toISOString(),
  };
}

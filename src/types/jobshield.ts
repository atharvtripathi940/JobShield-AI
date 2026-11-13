/**
 * JobShield AI - Core Type Definitions
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Finding {
  id: string;
  category: 
    | 'FEE_DEMAND' 
    | 'UNREALISTIC_SALARY' 
    | 'SUSPICIOUS_COMMUNICATION' 
    | 'IMPERSONATION' 
    | 'PRESSURE_TACTIC' 
    | 'SENSITIVE_INFO_REQUEST' 
    | 'VAGUE_DESCRIPTION' 
    | 'SAFE_INDICATOR';
  severity: 'low' | 'medium' | 'high' | 'critical' | 'positive';
  title: string;
  description: string;
  highlightedText?: string;
  evidence: string;
  explanation: string;
  recommendation: string;
}

export interface ScamDnaPattern {
  name: string;
  similarityScore: number; // 0-100%
  description: string;
  matchedPhrases: string[];
  dnaTag: string;
}

export interface ScamDnaFingerprint {
  hash: string;
  archetype: 'TELEGRAM_TASK' | 'REGISTRATION_DEPOSIT' | 'DATA_ENTRY_KIT' | 'MNC_IMPERSONATION' | 'UNVERIFIED_GENERIC' | 'LEGITIMATE_PATTERN';
  archetypeLabel: string;
  patterns: ScamDnaPattern[];
  dnaSequence: string[];
}

export interface JobScanResult {
  id: string;
  jobTitle: string;
  companyName: string;
  recruiterName?: string;
  recruiterEmail?: string;
  riskScore: number; // 0-100 (0=Very Safe, 100=Definite Fraud)
  riskLevel: RiskLevel;
  verdictSummary: string;
  confidence: number; // 0-100
  limitations: string;
  findings: Finding[];
  scamDna: ScamDnaFingerprint;
  recommendations: string[];
  realityCheck: {
    roleSalaryFairness: 'REALISTIC' | 'SUSPICIOUSLY_HIGH' | 'EXPLOITATIVE_LOW' | 'UNSPECIFIED';
    experienceExpectation: string;
    skillsCoherence: string;
    warningNotes?: string;
  };
  hiddenFeesDetected: {
    hasFeeDemand: boolean;
    feeTypes: string[];
    extractedAmounts: string[];
    riskAdvice: string;
  };
  distinctionNotice: {
    verifiedFacts: string[];
    userProvidedClaims: string[];
    aiInferences: string[];
    unverifiedExternalData: string[];
  };
  isScreenshot?: boolean;
  extractedOcrText?: string;
  createdAt: string;
}

export interface RecruiterCheckResult {
  id: string;
  recruiterName: string;
  email: string;
  companyName: string;
  website?: string;
  linkedinUrl?: string;
  credibilityScore: number; // 0-100 (Higher is more credible)
  verdict: 'CREDIBLE' | 'SUSPICIOUS' | 'HIGH_RISK';
  summary: string;
  domainAnalysis: {
    isFreeProvider: boolean;
    domain: string;
    matchesClaimedCompany: boolean;
    riskReason?: string;
  };
  indicators: {
    type: 'positive' | 'warning' | 'negative';
    label: string;
    detail: string;
  }[];
  recommendations: string[];
  createdAt: string;
}

export interface JobComparisonResult {
  id: string;
  jobA: JobScanResult;
  jobB: JobScanResult;
  riskComparison: string;
  salaryFairnessComparison: string;
  commonScamDnaPhrases: string[];
  recommendedChoice: 'JOB_A' | 'JOB_B' | 'NEITHER_RECOMMENDED' | 'BOTH_ACCEPTABLE';
  analysisNotes: string;
}

export interface CommunityReport {
  id: string;
  companyName: string;
  recruiterContact?: string;
  scamType: 
    | 'REGISTRATION_FEE' 
    | 'SECURITY_DEPOSIT' 
    | 'TELEGRAM_TASK_FRAUD' 
    | 'FAKE_PLACEMENT_AGENCY' 
    | 'DATA_ENTRY_SCAM' 
    | 'IMPERSONATION' 
    | 'PHISHING_OFFER' 
    | 'OTHER';
  title: string;
  description: string;
  requestedAmount?: string;
  paymentMethod?: string;
  isAnonymous: boolean;
  reporterAlias: string;
  status: 'unverified' | 'investigating' | 'verified' | 'dismissed';
  upvotes: number;
  hasUserUpvoted?: boolean;
  createdAt: string;
}

export interface ShieldBotMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  language?: 'en' | 'hi' | 'es' | 'fr' | 'de' | 'bn' | 'ta' | 'te' | 'mr';
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

export interface PlatformStats {
  totalJobsAnalyzed: number;
  highRiskCaught: number;
  mediumRiskWarned: number;
  lowRiskCleared: number;
  communityReportsLogged: number;
  estimatedMoneySavedInr: number;
  activeShieldUsers: number;
}

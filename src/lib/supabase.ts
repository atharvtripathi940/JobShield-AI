import { createClient } from '@supabase/supabase-js';
import { JobScanResult, CommunityReport } from '../types/jobshield.js';

export const SUPABASE_PROJECT_ID = 'ttqxipatsczknsljmitt';
export const SUPABASE_DEFAULT_URL = 'https://ttqxipatsczknsljmitt.supabase.co';
export const SUPABASE_DEFAULT_KEY = 'sb_publishable_nGRVVeX-GYI7fFCkujYxYA_bIz5Psih';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_DEFAULT_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'user' | 'admin';
  careerSafetyScore: number;
  totalScansCount: number;
  isDemo?: boolean;
}

export const DEMO_USER: UserProfile = {
  id: 'usr-student-01',
  email: 'atharv.student@university.edu',
  fullName: 'Atharv Tripathi (Student)',
  role: 'user',
  careerSafetyScore: 88,
  totalScansCount: 9,
  isDemo: true,
};

export const DEMO_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'security.lead@jobshield.ai',
  fullName: 'CyberSec Lead (Admin)',
  role: 'admin',
  careerSafetyScore: 99,
  totalScansCount: 42,
  isDemo: true,
};

/**
 * Test live connection to the user's Supabase project
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string; projectId: string }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: error.message, projectId: SUPABASE_PROJECT_ID };
    }
    return { ok: true, message: 'Connected to Supabase PostgreSQL & Auth', projectId: SUPABASE_PROJECT_ID };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Connection failed', projectId: SUPABASE_PROJECT_ID };
  }
}

/**
 * Save user profile in Supabase profiles table
 */
export async function saveProfileToSupabase(profile: UserProfile): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: profile.id,
        email: profile.email,
        full_name: profile.fullName,
        role: profile.role,
        career_safety_score: profile.careerSafetyScore,
        total_scans_count: profile.totalScansCount,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase profile upsert notice (schema may be pending creation):', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to sync profile to Supabase:', err);
    return false;
  }
}

/**
 * Save a job scan to Supabase job_scans / saved_jobs table
 */
export async function saveJobScanToSupabase(scan: JobScanResult, userId?: string, notes?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('saved_jobs')
      .insert({
        id: scan.id,
        user_id: userId || 'demo-user',
        job_title: scan.jobTitle,
        company_name: scan.companyName,
        recruiter_name: scan.recruiterName,
        recruiter_email: scan.recruiterEmail,
        risk_score: scan.riskScore,
        risk_level: scan.riskLevel,
        verdict_summary: scan.verdictSummary,
        confidence: scan.confidence,
        reality_fairness: scan.realityCheck?.roleSalaryFairness,
        has_fee_demand: Boolean(scan.findings?.some(f => f.category === 'FEE_DEMAND')),
        findings_json: scan.findings,
        scam_dna_json: scan.scamDna,
        notes: notes || '',
        created_at: scan.createdAt || new Date().toISOString(),
      });

    if (error) {
      console.warn('Supabase saved_jobs insert notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert scan to Supabase:', err);
    return false;
  }
}

/**
 * Save community report to Supabase
 */
export async function saveCommunityReportToSupabase(report: CommunityReport): Promise<boolean> {
  try {
    const { error } = await supabase
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
      console.warn('Supabase community_reports insert notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Failed to insert community report to Supabase:', err);
    return false;
  }
}

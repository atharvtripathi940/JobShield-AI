-- ==============================================================================
-- JOBSHIELD AI - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Project ID: ttqxipatsczknsljmitt
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ttqxipatsczknsljmitt/sql/new
-- ==============================================================================

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  career_safety_score INTEGER DEFAULT 88,
  total_scans_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SAVED JOBS & SCANS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  recruiter_name TEXT,
  recruiter_email TEXT,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  verdict_summary TEXT,
  confidence INTEGER DEFAULT 90,
  notes TEXT,
  findings_json JSONB,
  scam_dna_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. COMMUNITY REPORTS TABLE (Peer-reported recruitment scams)
CREATE TABLE IF NOT EXISTS public.community_reports (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  recruiter_contact TEXT,
  scam_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requested_amount TEXT,
  payment_method TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  reporter_alias TEXT,
  status TEXT DEFAULT 'investigating' CHECK (status IN ('verified', 'investigating', 'unverified')),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES (Safe idempotent creation)
DROP POLICY IF EXISTS "Allow public read of profiles" ON public.profiles;
CREATE POLICY "Allow public read of profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert/update profiles" ON public.profiles;
CREATE POLICY "Allow public insert/update profiles" ON public.profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public read of saved_jobs" ON public.saved_jobs;
CREATE POLICY "Allow public read of saved_jobs" ON public.saved_jobs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of saved_jobs" ON public.saved_jobs;
CREATE POLICY "Allow public insert of saved_jobs" ON public.saved_jobs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete of saved_jobs" ON public.saved_jobs;
CREATE POLICY "Allow public delete of saved_jobs" ON public.saved_jobs FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read of community_reports" ON public.community_reports;
CREATE POLICY "Allow public read of community_reports" ON public.community_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of community_reports" ON public.community_reports;
CREATE POLICY "Allow public insert of community_reports" ON public.community_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update of community_reports" ON public.community_reports;
CREATE POLICY "Allow public update of community_reports" ON public.community_reports FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read of admin_audit_logs" ON public.admin_audit_logs;
CREATE POLICY "Allow public read of admin_audit_logs" ON public.admin_audit_logs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert of admin_audit_logs" ON public.admin_audit_logs;
CREATE POLICY "Allow public insert of admin_audit_logs" ON public.admin_audit_logs FOR INSERT WITH CHECK (true);

-- SEED INITIAL SAMPLES
INSERT INTO public.community_reports (id, company_name, recruiter_contact, scam_type, title, description, requested_amount, payment_method, is_anonymous, reporter_alias, status, upvotes)
VALUES 
('report-001', 'Apex Global Placement Solutions', 'hr.apexplacement@gmail.com', 'REGISTRATION_FEE', 'Demanded ₹2,500 registration fee before scheduling Zoom interview', 'Received WhatsApp message promising direct placement at an MNC in Bangalore. They sent an official-looking PDF invoice asking for ₹2,500 refundable security deposit via PhonePe before giving the interview link.', '₹2,500', 'PhonePe UPI QR', true, 'Anonymous Student (Bangalore)', 'verified', 42),
('report-002', 'NexGen Digital Media Tasks', 'Telegram @NexGen_Task_Manager', 'TELEGRAM_TASK_FRAUD', 'YouTube video like and Google review rating prepaid task trap', 'Offered ₹150 per YouTube like. Paid ₹450 for the first 3 likes to build trust. Then invited to VIP Task group requiring ₹5,000 recharge.', '₹5,000 - ₹30,000', 'Crypto USDT & UPI ID', false, 'Rohan K.', 'verified', 89),
('report-003', 'TCS Impersonator (TATA Career Services fake)', 'tcs.recruitment.india2026@gmail.com', 'IMPERSONATION', 'Fake TCS Offer Letter asking ₹4,999 for Company Laptop Courier', 'Sent a polished fake offer letter claiming selection without any technical round. Asked for ₹4,999 courier insurance charge to dispatch laptop.', '₹4,999', 'Bank Transfer', true, 'College Graduate (Pune)', 'verified', 114)
ON CONFLICT (id) DO NOTHING;

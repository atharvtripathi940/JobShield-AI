-- =========================================================
-- JOBSHIELD AI - SUPABASE POSTGRESQL DATABASE SCHEMA & RLS
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    career_safety_score INTEGER DEFAULT 85 CHECK (career_safety_score BETWEEN 0 AND 100),
    total_scans_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. JOB ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.job_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    company_name TEXT,
    recruiter_name TEXT,
    recruiter_email TEXT,
    salary_claim TEXT,
    raw_content TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    findings JSONB DEFAULT '[]'::jsonb,
    evidence JSONB DEFAULT '[]'::jsonb,
    scam_dna JSONB DEFAULT '{}'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    confidence INTEGER DEFAULT 90 CHECK (confidence BETWEEN 0 AND 100),
    limitations TEXT,
    is_screenshot BOOLEAN DEFAULT FALSE,
    screenshot_url TEXT,
    source_url TEXT,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RECRUITER CHECKS TABLE
CREATE TABLE IF NOT EXISTS public.recruiter_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    recruiter_name TEXT,
    email TEXT NOT NULL,
    company_name TEXT NOT NULL,
    website TEXT,
    linkedin_url TEXT,
    credibility_score INTEGER NOT NULL CHECK (credibility_score BETWEEN 0 AND 100),
    verdict TEXT NOT NULL CHECK (verdict IN ('CREDIBLE', 'SUSPICIOUS', 'HIGH_RISK')),
    domain_status TEXT,
    issues JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. COMMUNITY REPORTS TABLE (Allegations & Alerts)
CREATE TABLE IF NOT EXISTS public.community_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT TRUE,
    company_name TEXT NOT NULL,
    recruiter_contact TEXT,
    scam_type TEXT NOT NULL CHECK (scam_type IN (
        'REGISTRATION_FEE', 
        'SECURITY_DEPOSIT', 
        'TELEGRAM_TASK_FRAUD', 
        'FAKE_PLACEMENT_AGENCY', 
        'DATA_ENTRY_SCAM', 
        'IMPERSONATION', 
        'PHISHING_OFFER', 
        'OTHER'
    )),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requested_amount TEXT,
    payment_method TEXT,
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'unverified' CHECK (status IN ('unverified', 'investigating', 'verified', 'dismissed')),
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    analysis_id UUID NOT NULL REFERENCES public.job_analyses(id) ON DELETE CASCADE,
    notes TEXT,
    status TEXT DEFAULT 'investigating' CHECK (status IN ('investigating', 'flagged_scam', 'safe', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, analysis_id)
);

-- 6. CHAT HISTORY (ShieldBot)
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('alert', 'warning', 'info', 'badge')),
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMIN ACTIVITY TABLE
CREATE TABLE IF NOT EXISTS public.admin_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_job_analyses_user ON public.job_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_job_analyses_risk ON public.job_analyses(risk_level);
CREATE INDEX IF NOT EXISTS idx_recruiter_email ON public.recruiter_checks(email);
CREATE INDEX IF NOT EXISTS idx_community_status ON public.community_reports(status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_user_session ON public.chat_history(user_id, session_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- Helper to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read and update their own profile; Admins can read all
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Job Analyses: Anyone can read anonymous/demo scans, users read own scans, users can insert
CREATE POLICY "Users can view own scans or public scans" 
    ON public.job_analyses FOR SELECT 
    USING (user_id IS NULL OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Anyone can create job analyses" 
    ON public.job_analyses FOR INSERT 
    WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- Recruiter Checks: Users read own or admins
CREATE POLICY "Users can view recruiter checks" 
    ON public.recruiter_checks FOR SELECT 
    USING (user_id IS NULL OR user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users can insert recruiter checks" 
    ON public.recruiter_checks FOR INSERT 
    WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- Community Reports: Public read; Authenticated or anonymous insert; Admin update/delete
CREATE POLICY "Community reports are viewable by all" 
    ON public.community_reports FOR SELECT 
    USING (true);

CREATE POLICY "Anyone can submit a community report" 
    ON public.community_reports FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Only admins can moderate community reports" 
    ON public.community_reports FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only admins can delete community reports" 
    ON public.community_reports FOR DELETE 
    USING (public.is_admin());

-- Saved Jobs: User can manage own saved jobs
CREATE POLICY "Users manage own saved jobs" 
    ON public.saved_jobs FOR ALL 
    USING (auth.uid() = user_id);

-- Chat History: User can manage own chat history
CREATE POLICY "Users access own chat history" 
    ON public.chat_history FOR ALL 
    USING (auth.uid() = user_id);

-- Notifications: User can access own notifications
CREATE POLICY "Users access own notifications" 
    ON public.notifications FOR ALL 
    USING (auth.uid() = user_id);

-- Admin Activity: Only admins can view or insert
CREATE POLICY "Admins view admin activity" 
    ON public.admin_activity FOR ALL 
    USING (public.is_admin());

-- Trigger to create profile when auth.user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

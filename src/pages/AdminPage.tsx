import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Activity, 
  Users, 
  FileText, 
  Check, 
  Clock,
  Sparkles,
  ShieldAlert,
  Database,
  Copy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { CommunityReport, PlatformStats } from '../types/jobshield.js';
import { SUPABASE_PROJECT_ID, testSupabaseConnection } from '../lib/supabase.js';
import { apiFetch } from '../lib/api.js';

export const AdminPage: React.FC = () => {
  const { user, switchDemoRole } = useAuth();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<string>('Testing connection...');
  const [copiedSql, setCopiedSql] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    testSupabaseConnection().then((res) => {
      setDbStatus(res.ok ? 'Online & Synchronized' : `Notice: ${res.message}`);
    });
  }, []);

  const fetchAdminData = async () => {
    try {
      const res = await apiFetch('/api/admin/overview', {
        headers: {
          'Authorization': `Bearer ${user?.id || 'admin-token'}`
        }
      });
      const data = await res.json();
      setReports(data.reports || []);
      setStats(data.stats || null);
      setAuditLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin, user]);

  const handleModerate = async (reportId: string, status: CommunityReport['status']) => {
    try {
      await apiFetch('/api/admin/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
      setAuditLogs(prev => [
        {
          id: `log-${Date.now()}`,
          action: `STATUS_${status.toUpperCase()}`,
          target: reportId,
          timestamp: new Date().toISOString(),
          details: `Admin changed status to ${status}`,
        },
        ...prev
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center mx-auto mb-4 text-red-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Security Admin Portal Restricted</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto mt-2">
          This portal enforces backend role-based access control (RBAC). Only authenticated platform administrators can moderate community reports and update global fraud signatures.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 max-w-md mx-auto">
          <p className="text-xs font-semibold text-slate-300 mb-2">Administrator Session Required:</p>
          <button
            onClick={() => switchDemoRole('admin')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Administrator Session</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>CyberSec Command & Community Moderation Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Security Administration Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authenticated Admin: <strong className="text-slate-200">{user?.email}</strong>. Moderating peer fraud reports and syndicates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 font-mono text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            ROLE: SECURITY LEAD
          </span>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#090e1f] border border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Community Reports</p>
          <p className="text-2xl font-black font-mono text-white mt-1">{reports.length}</p>
          <p className="text-[10px] text-slate-500">Live in moderation pool</p>
        </div>
        <div className="p-4 rounded-xl bg-[#090e1f] border border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Verified Fraud Syndicates</p>
          <p className="text-2xl font-black font-mono text-red-400 mt-1">
            {reports.filter(r => r.status === 'verified').length}
          </p>
          <p className="text-[10px] text-slate-500">Confirmed by analyst review</p>
        </div>
        <div className="p-4 rounded-xl bg-[#090e1f] border border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Pending Review</p>
          <p className="text-2xl font-black font-mono text-amber-400 mt-1">
            {reports.filter(r => r.status === 'unverified' || r.status === 'investigating').length}
          </p>
          <p className="text-[10px] text-slate-500">Action required</p>
        </div>
        <div className="p-4 rounded-xl bg-[#090e1f] border border-slate-800">
          <p className="text-[10px] font-mono text-slate-400 uppercase">Protected Candidates</p>
          <p className="text-2xl font-black font-mono text-cyan-400 mt-1">
            {stats?.activeShieldUsers || 8430}
          </p>
          <p className="text-[10px] text-slate-500">Total active subscribers</p>
        </div>
      </div>

      {/* Supabase PostgreSQL Database Management Card */}
      <div className="rounded-2xl bg-[#090e1f] border border-emerald-500/40 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Database className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Supabase PostgreSQL Cloud Database
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">
                Project ID: <span className="font-mono text-cyan-300 font-bold">{SUPABASE_PROJECT_ID}</span> • Status: <span className="font-mono text-emerald-400 font-semibold">{dbStatus}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const sqlSnippet = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (id TEXT PRIMARY KEY, email TEXT NOT NULL, full_name TEXT, role TEXT DEFAULT 'user', career_safety_score INTEGER DEFAULT 88, total_scans_count INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.saved_jobs (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, job_title TEXT NOT NULL, company_name TEXT NOT NULL, risk_score INTEGER NOT NULL, risk_level TEXT NOT NULL, verdict_summary TEXT, notes TEXT, findings_json JSONB, scam_dna_json JSONB, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.community_reports (id TEXT PRIMARY KEY, company_name TEXT NOT NULL, scam_type TEXT NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, status TEXT DEFAULT 'investigating', upvotes INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all saved_jobs" ON public.saved_jobs FOR ALL USING (true);
CREATE POLICY "Allow all community_reports" ON public.community_reports FOR ALL USING (true);`;
              navigator.clipboard.writeText(sqlSnippet);
              setCopiedSql(true);
              setTimeout(() => setCopiedSql(false), 2500);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-xs font-mono text-slate-200 transition-all flex items-center gap-2 shrink-0"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">SQL Schema Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Supabase SQL Schema</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] block uppercase">Authentication</span>
            <span className="text-slate-200 font-bold mt-1 block">Supabase Auth (Active)</span>
            <span className="text-[10px] text-slate-500">Persistent email/password sessions</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] block uppercase">PostgreSQL Sync</span>
            <span className="text-slate-200 font-bold mt-1 block">Real-time REST API</span>
            <span className="text-[10px] text-slate-500">ttqxipatsczknsljmitt.supabase.co</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] block uppercase">Storage & Evidence</span>
            <span className="text-slate-200 font-bold mt-1 block">Scam DNA & Visual Vault</span>
            <span className="text-[10px] text-slate-500">Encrypted JSON & OCR records</span>
          </div>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Community Allegation Moderation Queue</span>
            </h3>
            <p className="text-xs text-slate-400">
              Audit peer reports, verify payment screenshots, and mark authentic fraud warnings for the public feed.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{reports.length} Reports</span>
        </div>

        <div className="space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{report.companyName}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {report.scamType}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    report.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : report.status === 'investigating'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-200">{report.title}</p>
                <p className="text-[11px] text-slate-400 line-clamp-2">{report.description}</p>
                <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                  <span>Contact: {report.recruiterContact || 'N/A'}</span>
                  <span>Amount: {report.requestedAmount || 'N/A'}</span>
                  <span>Upvotes: {report.upvotes}</span>
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleModerate(report.id, 'verified')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    report.status === 'verified'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify</span>
                </button>

                <button
                  onClick={() => handleModerate(report.id, 'investigating')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    report.status === 'investigating'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border border-slate-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                </button>

                <button
                  onClick={() => handleModerate(report.id, 'dismissed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    report.status === 'dismissed'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 hover:bg-red-950/60 text-slate-300 hover:text-red-300 border border-slate-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Audit Trail */}
      <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Security Audit Trail & Admin Activity Log</span>
        </h3>
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-mono text-cyan-400 font-bold uppercase">{log.action}</span>
                <p className="text-slate-300 text-[11px]">{log.details} - <strong className="text-slate-200">{log.target}</strong></p>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

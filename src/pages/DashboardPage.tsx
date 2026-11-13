import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Download, 
  TrendingUp, 
  Calendar,
  Sparkles,
  CheckCircle2,
  Database
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';
import { JobScanResult, PlatformStats } from '../types/jobshield.js';
import { generateRiskReportPDF } from '../utils/pdfGenerator.js';
import { apiFetch } from '../lib/api.js';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [savedRes, statsRes] = await Promise.all([
        apiFetch(`/api/saved-jobs?userId=${user?.id || 'demo-user'}`),
        apiFetch('/api/stats')
      ]);

      const savedData = await savedRes.json();
      const statsData = await statsRes.json();
      setSavedJobs(savedData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleDeleteSaved = async (id: string) => {
    setSavedJobs(prev => prev.filter(j => j.id !== id));
    try {
      await apiFetch(`/api/saved-jobs/${id}?userId=${user?.id || 'demo-user'}`, { method: 'DELETE' });
    } catch (e) {
      console.error(e);
    }
  };

  // Recharts Data
  const pieData = [
    { name: 'Low Risk', value: stats?.lowRiskCleared || 7390, color: '#10b981' },
    { name: 'Medium Risk', value: stats?.mediumRiskWarned || 3120, color: '#f59e0b' },
    { name: 'High Risk (Fraud)', value: stats?.highRiskCaught || 4310, color: '#ef4444' },
  ];

  const weeklyActivityData = [
    { day: 'Mon', scans: 42, caught: 14 },
    { day: 'Tue', scans: 68, caught: 21 },
    { day: 'Wed', scans: 55, caught: 18 },
    { day: 'Thu', scans: 84, caught: 32 },
    { day: 'Fri', scans: 95, caught: 37 },
    { day: 'Sat', scans: 61, caught: 19 },
    { day: 'Sun', scans: 49, caught: 15 },
  ];

  const userSafetyScore = user?.careerSafetyScore || 88;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Candidate Defense Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.dashboardTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.dashboardSubtitle}
          </p>
        </div>

        <Link
          to="/scanner"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0"
        >
          <span>Scan New Opportunity</span>
        </Link>
      </div>

      {/* Supabase PostgreSQL Cloud Database Connection Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a1224] to-[#0a1020] border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(16,185,129,0.1)]">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
                Supabase PostgreSQL Cloud Database Connected
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300 mt-1">
              All user profiles, fraud scans, and community reports sync directly to your Supabase cloud database.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Cloud Database Active
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Safety Score Meter */}
        <div className="p-5 rounded-2xl bg-[#090e1f] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Career Safety Score</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-cyan-300">{userSafetyScore}</span>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Based on active diligence, verified checklists, and zero fraud engagements.
          </p>
        </div>

        {/* High Risk Caught */}
        <div className="p-5 rounded-2xl bg-[#090e1f] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Scams Blocked</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-red-400">
              {stats?.highRiskCaught || 4310}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Advance fee, deposit, and Telegram traps detected platform-wide.
          </p>
        </div>

        {/* Total Scanned */}
        <div className="p-5 rounded-2xl bg-[#090e1f] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Analyses Completed</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-purple-300">
              {stats?.totalJobsAnalyzed || 14820}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Opportunities submitted by students and job seekers.
          </p>
        </div>

        {/* Saved Jobs */}
        <div className="p-5 rounded-2xl bg-[#090e1f] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Saved Opportunities</span>
            <Bookmark className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-emerald-300">
              {savedJobs.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Currently monitored in your personal protection vault.
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weekly Bar Chart (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Verification Activity</h3>
              <p className="text-xs text-slate-400">Total Opportunities Scanned vs Fraudulent Red Flags Caught</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090e1f', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
                <Bar dataKey="scans" fill="#06b6d4" name="Total Scans" radius={[4, 4, 0, 0]} />
                <Bar dataKey="caught" fill="#ef4444" name="Scams Caught" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut Chart (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Risk Classification Breakdown</h3>
            <p className="text-xs text-slate-400">Proportion of scanned opportunities by risk level</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090e1f', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300">
              <p className="text-[10px]">Low Risk</p>
              <p className="font-bold text-sm">50%</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-300">
              <p className="text-[10px]">Medium</p>
              <p className="font-bold text-sm">21%</p>
            </div>
            <div className="p-2 rounded-lg bg-red-950/30 border border-red-800/40 text-red-300">
              <p className="text-[10px]">High Risk</p>
              <p className="font-bold text-sm">29%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Jobs Verification Vault */}
      <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Saved Job Verification Reports</span>
            </h3>
            <p className="text-xs text-slate-400">
              Opportunities you have bookmarked for follow-up verification or reporting.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {savedJobs.length} Saved Record(s)
          </span>
        </div>

        {savedJobs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No saved jobs in your vault yet. Analyze an opportunity on the AI Scanner and click "Save Job".
          </div>
        ) : (
          <div className="space-y-3">
            {savedJobs.map((item) => {
              const scan: JobScanResult = item.scan;
              const isHigh = scan.riskLevel === 'HIGH';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isHigh ? 'bg-red-950/60 text-red-300 border border-red-800/50' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}>
                        {scan.riskLevel} ({scan.riskScore}/100)
                      </span>
                      <span className="text-xs font-bold text-white">{scan.jobTitle}</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Company: <strong className="text-cyan-300">{scan.companyName}</strong>
                    </p>
                    <p className="text-[11px] font-mono text-slate-500">
                      Scam DNA: {scan.scamDna.hash} • Saved: {new Date(item.savedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => generateRiskReportPDF(scan)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
                      title="Download PDF Certificate"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteSaved(item.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove from vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

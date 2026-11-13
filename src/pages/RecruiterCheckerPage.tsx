import React, { useState } from 'react';
import { 
  UserCheck, 
  Mail, 
  Building2, 
  Globe, 
  Linkedin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  ExternalLink,
  Loader2,
  Sparkles
} from 'lucide-react';
import { RecruiterCheckResult } from '../types/jobshield.js';
import { useLanguage } from '../context/LanguageContext.js';
import { apiFetch } from '../lib/api.js';

export const RecruiterCheckerPage: React.FC = () => {
  const { t } = useLanguage();
  const [recruiterName, setRecruiterName] = useState('Ananya Sen (Talent Partner)');
  const [email, setEmail] = useState('ananya.recruitment.google@gmail.com');
  const [companyName, setCompanyName] = useState('Google India');
  const [website, setWebsite] = useState('https://google.com/about/careers');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/ananya-recruiter-demo');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<RecruiterCheckResult | null>(null);

  const presets = [
    {
      label: "Fake Google HR on Gmail (High Risk)",
      name: "Ananya Sen (Talent Partner)",
      email: "ananya.recruitment.google@gmail.com",
      company: "Google India",
      website: "https://careers.google.com",
      linkedin: "",
    },
    {
      label: "Legitimate Stripe Recruiter (Credible)",
      name: "Marcus Vance",
      email: "mvance@stripe.com",
      company: "Stripe",
      website: "https://stripe.com",
      linkedin: "https://linkedin.com/in/marcus-vance-talent",
    },
    {
      label: "Suspicious Intermediary (.top domain)",
      name: "Vikram Malhotra",
      email: "contact@fastjobs-portal.top",
      company: "Wipro Technologies (Impersonation)",
      website: "https://fastjobs-portal.top",
      linkedin: "",
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setRecruiterName(p.name);
    setEmail(p.email);
    setCompanyName(p.company);
    setWebsite(p.website);
    setLinkedinUrl(p.linkedin);
    setResult(null);
  };

  const handleRunCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !companyName) return;

    setIsChecking(true);
    try {
      const response = await apiFetch('/api/scan/recruiter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiterName,
          email,
          companyName,
          website,
          linkedinUrl,
        }),
      });

      const data: RecruiterCheckResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Domain Verification & Impersonation Defense</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.recruiterTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          {t.recruiterSubtitle}
        </p>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400">Quick Test Profiles:</span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5">
          <form onSubmit={handleRunCheck} className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Recruiter Communication Credentials</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter Name</label>
              <input
                type="text"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="e.g. Pooja Sharma"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Recruiter Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@company.com or hr@gmail.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Claimed Company / Employer <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google India, TCS, Infosys"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Website</label>
              <div className="relative">
                <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://company.com"
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter LinkedIn URL (Optional)</label>
              <div className="relative">
                <Linkedin className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChecking || !email || !companyName}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] mt-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Cross-referencing domain registers...</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4" />
                  <span>Evaluate Recruiter Credibility</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Display (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isChecking && (
            <div className="h-full min-h-[360px] rounded-2xl border border-dashed border-slate-800 bg-[#070b14]/50 flex flex-col items-center justify-center p-8 text-center">
              <UserCheck className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-300">Ready for Verification</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Submit recruiter details to inspect domain legitimacy, webmail exposure, and organization consistency.
              </p>
            </div>
          )}

          {isChecking && (
            <div className="h-full min-h-[360px] rounded-2xl border border-cyan-500/30 bg-[#090e1f] p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <h3 className="text-sm font-bold text-white">Analyzing Recruiter Credentials</h3>
              <p className="text-xs font-mono text-slate-400">Inspecting MX records and domain ownership consistency...</p>
            </div>
          )}

          {result && !isChecking && (
            <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-6 animate-in fade-in duration-300">
              {/* Verdict Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-mono uppercase text-slate-400">Credibility Analysis</span>
                  <h2 className="text-lg font-bold text-white">{result.recruiterName || 'Recruiter'}</h2>
                  <p className="text-xs font-mono text-cyan-300">{result.email}</p>
                  <p className="text-xs text-slate-400">Claiming: <strong>{result.companyName}</strong></p>
                </div>

                <div className="text-center">
                  <div className={`text-4xl font-black font-mono ${
                    result.credibilityScore >= 70 ? 'text-emerald-400' :
                    result.credibilityScore >= 45 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {result.credibilityScore}/100
                  </div>
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-mono font-bold mt-1 uppercase ${
                    result.verdict === 'CREDIBLE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    result.verdict === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}>
                    {result.verdict.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Summary note */}
              <div className={`p-4 rounded-xl border text-xs font-semibold leading-relaxed ${
                result.verdict === 'HIGH_RISK' ? 'bg-red-950/30 border-red-500/40 text-red-200' :
                result.verdict === 'SUSPICIOUS' ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' :
                'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
              }`}>
                {result.summary}
              </div>

              {/* Indicators List */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Verification Signals & Domain Audit:
                </h4>
                <div className="space-y-2">
                  {result.indicators.map((ind, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs"
                    >
                      {ind.type === 'positive' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : ind.type === 'negative' ? (
                        <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-200">{ind.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{ind.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Advice */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono uppercase text-cyan-400 font-bold">
                  Recommended Verification Steps:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-cyan-400">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

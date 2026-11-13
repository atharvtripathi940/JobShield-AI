import React, { useState } from 'react';
import { Dna, ArrowRightLeft, Sparkles, AlertCircle, CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';
import { JobComparisonResult } from '../types/jobshield.js';
import { ScamDnaCard } from '../components/ScamDnaCard.js';
import { apiFetch } from '../lib/api.js';

export const ScamDnaComparePage: React.FC = () => {
  const [jobATitle, setJobATitle] = useState('Data Entry Specialist');
  const [jobACompany, setJobACompany] = useState('Apex Data Services');
  const [jobAContent, setJobAContent] = useState(
    'Earn ₹45,000 monthly for typing 10 pages daily. No experience needed. Immediate selection. Refundable security deposit of ₹1,500 required for software license key.'
  );

  const [jobBTitle, setJobBTitle] = useState('Telegram VIP Task Associate');
  const [jobBCompany, setJobBCompany] = useState('Global Media Growth');
  const [jobBContent, setJobBContent] = useState(
    'Earn ₹3,000 to ₹8,000 daily liking YouTube videos. Work 1 hour. DM Telegram HR @VIP_Growth_Jobs. Prepaid security deposit of ₹2,000 to unlock VIP tasks.'
  );

  const [isComparing, setIsComparing] = useState(false);
  const [comparison, setComparison] = useState<JobComparisonResult | null>(null);

  const handleRunComparison = async () => {
    setIsComparing(true);
    try {
      const response = await apiFetch('/api/scan/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobA: { title: jobATitle, company: jobACompany, content: jobAContent },
          jobB: { title: jobBTitle, company: jobBCompany, content: jobBContent },
        }),
      });

      const data: JobComparisonResult = await response.json();
      setComparison(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
          <Dna className="w-3.5 h-3.5" />
          <span>Dual Scam DNA™ Semantic Alignment Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Scam DNA Fingerprint & Job Comparison
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Compare two job opportunities side-by-side to detect recurring fraud boilerplate, identical advance-fee demands, or identify the genuine career opportunity.
        </p>
      </div>

      {/* Quick Test Presets */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400">Load Comparison Test Pairs:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              setJobATitle('Data Entry Executive');
              setJobACompany('Apex Data Services');
              setJobAContent('Earn ₹45,000 monthly for typing 10 pages daily. No experience needed. Immediate selection. Refundable security deposit of ₹1,500 required for software license key.');
              setJobBTitle('Telegram VIP Task Associate');
              setJobBCompany('Global Media Growth');
              setJobBContent('Earn ₹3,000 to ₹8,000 daily liking YouTube videos. Work 1 hour. DM Telegram HR @VIP_Growth_Jobs. Prepaid security deposit of ₹2,000 to unlock VIP tasks.');
              setComparison(null);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-purple-500/60 text-slate-300 hover:text-white transition-all"
          >
            Deposit Trap vs Telegram Task (Both Fraud)
          </button>
          <button
            onClick={() => {
              setJobATitle('TCS Impersonator (Free Gmail)');
              setJobACompany('TCS (Fake Representative)');
              setJobAContent('Congratulations! Selected as System Engineer at TCS without test. Pay ₹4,999 laptop courier insurance fee to receive corporate ThinkPad.');
              setJobBTitle('Software Engineer Intern');
              setJobBCompany('Razorpay');
              setJobBContent('Razorpay is hiring Software Engineer Interns. Technical coding rounds, zero fees, apply exclusively via razorpay.com/careers.');
              setComparison(null);
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-slate-300 hover:text-white transition-all"
          >
            Impersonation Scam vs Authentic Role (Contrast)
          </button>
        </div>
      </div>

      {/* Comparison Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Job A */}
        <div className="rounded-2xl bg-[#090e1f] border border-cyan-500/30 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Opportunity A</span>
            <span className="text-[10px] font-mono text-slate-400">Target 1</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                value={jobATitle}
                onChange={(e) => setJobATitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Company</label>
              <input
                type="text"
                value={jobACompany}
                onChange={(e) => setJobACompany(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Job Terms / Communication Text</label>
            <textarea
              rows={4}
              value={jobAContent}
              onChange={(e) => setJobAContent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
            />
          </div>
        </div>

        {/* Job B */}
        <div className="rounded-2xl bg-[#090e1f] border border-purple-500/30 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">Opportunity B</span>
            <span className="text-[10px] font-mono text-slate-400">Target 2</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Title</label>
              <input
                type="text"
                value={jobBTitle}
                onChange={(e) => setJobBTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Company</label>
              <input
                type="text"
                value={jobBCompany}
                onChange={(e) => setJobBCompany(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Job Terms / Communication Text</label>
            <textarea
              rows={4}
              value={jobBContent}
              onChange={(e) => setJobBContent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Compare Button */}
      <div className="text-center">
        <button
          onClick={handleRunComparison}
          disabled={isComparing || !jobAContent.trim() || !jobBContent.trim()}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(147,51,234,0.3)] inline-flex items-center gap-2"
        >
          {isComparing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Genetic Fraud Overlap...</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-4 h-4" />
              <span>Compare Scam DNA & Risk Profiles</span>
            </>
          )}
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Executive Verdict Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d1428] to-slate-900 border border-slate-700 p-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Comparison Verdict</span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Recommendation: {comparison.recommendedChoice.replace(/_/g, ' ')}
                </h3>
                <p className="text-xs text-slate-300 mt-1">{comparison.analysisNotes}</p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-xs">
                <span className="text-cyan-400 font-bold">{comparison.jobA.riskScore} Risk</span>
                <span className="text-slate-500 mx-2">vs</span>
                <span className="text-purple-400 font-bold">{comparison.jobB.riskScore} Risk</span>
              </div>
            </div>

            {/* Overlapping malicious phrases */}
            {comparison.commonScamDnaPhrases.length > 0 && (
              <div className="pt-3 border-t border-slate-800 text-xs">
                <span className="font-mono text-[10px] uppercase text-amber-400 font-bold">
                  Shared Malicious Patterns:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {comparison.commonScamDnaPhrases.map((phrase, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300 text-[11px] font-mono">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side by side Scam DNA Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-cyan-300">{comparison.jobA.jobTitle} ({comparison.jobA.companyName})</h4>
                <span className="font-mono font-bold text-red-400">{comparison.jobA.riskScore}/100 Risk</span>
              </div>
              <ScamDnaCard dna={comparison.jobA.scamDna} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <h4 className="font-bold text-purple-300">{comparison.jobB.jobTitle} ({comparison.jobB.companyName})</h4>
                <span className="font-mono font-bold text-red-400">{comparison.jobB.riskScore}/100 Risk</span>
              </div>
              <ScamDnaCard dna={comparison.jobB.scamDna} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

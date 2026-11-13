import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Scan, 
  Sparkles, 
  Building2, 
  User, 
  Mail, 
  DollarSign, 
  Link as LinkIcon, 
  Download, 
  Bookmark, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Loader2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { JobScanResult } from '../types/jobshield.js';
import { RiskMeter } from '../components/RiskMeter.js';
import { ScamDnaCard } from '../components/ScamDnaCard.js';
import { EvidenceExplainer } from '../components/EvidenceExplainer.js';
import { generateRiskReportPDF } from '../utils/pdfGenerator.js';
import { useAuth } from '../context/AuthContext.js';
import { useLanguage } from '../context/LanguageContext.js';

export const ScannerPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Form State
  const [jobTitle, setJobTitle] = useState('Data Entry Executive / Virtual Assistant');
  const [companyName, setCompanyName] = useState('Apex Digital Logistics');
  const [recruiterName, setRecruiterName] = useState('Pooja Sharma (Talent Acquisition)');
  const [recruiterEmail, setRecruiterEmail] = useState('hr.apexcareers.india@gmail.com');
  const [salaryClaim, setSalaryClaim] = useState('₹45,000 / month (1 hour work daily)');
  const [sourceUrl, setSourceUrl] = useState('');
  const [content, setContent] = useState(
    'Urgent Opening: Online Data Entry Executive. Earn ₹45,000/month working from home 1 hour daily. No prior experience or technical interview needed. Direct selection letter issued today. Candidates must pay a refundable security deposit of ₹1,500 via PhonePe/GPay before dispatching the work kit and software access key. Pay within 30 minutes to confirm your seat.'
  );

  // Status
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<JobScanResult | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If navigated from landing page preset
  useEffect(() => {
    if (location.state?.initialContent) {
      setContent(location.state.initialContent);
    }
  }, [location.state]);

  const presets = [
    {
      name: "Data Entry ₹1,500 Deposit Scam",
      risk: "HIGH",
      title: "Data Entry Operator",
      company: "Apex Digital Logistics",
      email: "hr.apexcareers@gmail.com",
      salary: "₹45,000 / month",
      text: "Urgent Opening: Online Data Entry Executive. Earn ₹45,000/month working from home 1 hour daily. No prior experience or technical interview needed. Direct selection letter issued today. Candidates must pay a refundable security deposit of ₹1,500 via PhonePe/GPay before dispatching the work kit and software access key. Pay within 30 minutes to confirm your seat.",
    },
    {
      name: "Telegram YouTube Rating Fraud",
      risk: "HIGH",
      title: "Social Media Task Associate",
      company: "NexGen Media Growth",
      email: "recruiter@nexgen-group.online",
      salary: "₹3,000 - ₹8,000 / day",
      text: "Earn daily ₹3,000 - ₹8,000 from your smartphone by simply liking YouTube videos and rating hotels on Google Maps. No skills required. Immediate payout after every 3 tasks. Contact the HR coordinator directly on Telegram @NexGen_VIP_Jobs. Pre-paid VIP level activation of ₹3,000 required to unlock high payouts.",
    },
    {
      name: "Fake MNC Impersonator (Free Gmail)",
      risk: "HIGH",
      title: "Graduate Engineer Trainee",
      company: "Tata Consultancy Services (Impersonation)",
      email: "tcs.recruitment.campus2026@gmail.com",
      salary: "₹7.5 LPA",
      text: "Congratulations! You have been shortlisted for Graduate Engineer Trainee at TCS Pune office. We are pleased to provide immediate offer without further rounds. To receive your corporate Lenovo ThinkPad and employee badge, deposit ₹4,999 towards courier transit insurance. This amount will be reimbursed with your first salary slip.",
    },
    {
      name: "Legitimate Stripe SWE Intern",
      risk: "LOW",
      title: "Software Engineering Intern (Summer 2026)",
      company: "Stripe",
      email: "recruiting@stripe.com",
      salary: "Industry standard competitive stipend + benefits",
      text: "Stripe is seeking Software Engineering Interns for our infrastructure teams. Qualifications: currently enrolled in Computer Science or related degree, knowledge of distributed systems, proficiency in Go, Java, or Ruby. The interview process comprises an online coding assessment, followed by two pair-programming technical interviews. Zero application fees. Apply exclusively at stripe.com/jobs.",
    }
  ];

  const executeDirectScan = async (params: {
    jobTitle: string;
    companyName: string;
    recruiterName?: string;
    recruiterEmail?: string;
    salaryClaim?: string;
    content: string;
  }) => {
    setIsScanning(true);
    setErrorMessage(null);
    setScanResult(null);
    setIsSaved(false);

    try {
      const response = await fetch('/api/scan/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Scan server returned status ${response.status}`);
      }

      const result: JobScanResult = await response.json();
      setScanResult(result);

      if (result.riskLevel === 'LOW') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    setJobTitle(p.title);
    setCompanyName(p.company);
    setRecruiterEmail(p.email);
    setSalaryClaim(p.salary);
    setContent(p.text);
    executeDirectScan({
      jobTitle: p.title,
      companyName: p.company,
      recruiterEmail: p.email,
      salaryClaim: p.salary,
      content: p.text,
    });
  };

  const handleRunScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    await executeDirectScan({
      jobTitle,
      companyName,
      recruiterName,
      recruiterEmail,
      salaryClaim,
      content,
    });
  };

  const handleSaveJob = async () => {
    if (!scanResult) return;
    try {
      await fetch('/api/save-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan: scanResult,
          notes: 'Saved from AI Scanner verification report',
          userId: user?.id || 'demo-user',
        }),
      });
      setIsSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    if (!scanResult) return;
    const summary = `JobShield AI Verification Report:\nPosition: ${scanResult.jobTitle}\nCompany: ${scanResult.companyName}\nRisk Score: ${scanResult.riskScore}/100 (${scanResult.riskLevel})\nScam DNA Hash: ${scanResult.scamDna.hash}\nVerify employment opportunities safely on JobShield AI!`;
    navigator.clipboard.writeText(summary);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual Engine: Gemini 3.8 Flash + Cyber Heuristics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.scannerTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.scannerSubtitle}
          </p>
        </div>

        {/* Quick Presets Menu */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400">{t.loadTestPresets}</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                p.risk === 'HIGH'
                  ? 'bg-red-950/40 border-red-800/40 text-red-300 hover:border-red-500'
                  : 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 hover:border-emerald-500'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Left, Real-time Scan Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleRunScan} className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Scan className="w-4 h-4 text-cyan-400" />
              <span>Target Opportunity Details</span>
            </h3>

            {/* Job Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job / Internship Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Data Entry Executive, Software Intern"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Company & Recruiter */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company / Organization</label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Apex Corp"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={recruiterName}
                    onChange={(e) => setRecruiterName(e.target.value)}
                    placeholder="e.g. HR Pooja"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Recruiter Email & Salary Claim */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Recruiter Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="e.g. hr@company.com"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Claimed Salary / Compensation</label>
                <div className="relative">
                  <DollarSign className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={salaryClaim}
                    onChange={(e) => setSalaryClaim(e.target.value)}
                    placeholder="e.g. ₹50,000/month"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Source URL (optional) */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Link / Portal URL (Optional)</label>
              <div className="relative">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Full Content */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">
                  Job Description / Recruiter Message / Offer Terms <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {content.length} characters
                </span>
              </div>
              <textarea
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the full job advertisement, WhatsApp offer, interview invitation email, or appointment letter text..."
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>

            {/* Submit Scan Button */}
            <button
              type="submit"
              disabled={isScanning || !content.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.3)]"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Linguistic DNA & Heuristics...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4" />
                  <span>{t.runAnalysisBtn}</span>
                </>
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!scanResult && !isScanning && (
            <div className="h-full min-h-[420px] rounded-2xl border border-dashed border-slate-800 bg-[#070b14]/50 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
                <Scan className="w-8 h-8 text-cyan-500/60 animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-300">Ready to Analyze</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Enter job details on the left or select a preset to generate a structured risk verification report with Scam DNA matching.
              </p>
            </div>
          )}

          {isScanning && (
            <div className="h-full min-h-[420px] rounded-2xl border border-cyan-500/30 bg-[#090e1f] p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-20 h-20">
                <div className="w-full h-full rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white">AI Neural Deception Scan Active</h3>
              <div className="space-y-1 text-xs font-mono text-slate-400">
                <p>• Extracting semantic fraud indicators...</p>
                <p>• Cross-referencing advance-fee dictionary...</p>
                <p>• Checking domain consistency against enterprise registries...</p>
              </div>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Executive Summary Card */}
              <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                      Verification Certificate #{scanResult.id}
                    </span>
                    <h2 className="text-xl font-bold text-white">{scanResult.jobTitle}</h2>
                    <p className="text-xs text-slate-300">
                      Claimed Company: <strong className="text-cyan-300">{scanResult.companyName}</strong>
                    </p>
                    {scanResult.recruiterEmail && (
                      <p className="text-[11px] font-mono text-slate-400">
                        Sender: {scanResult.recruiterEmail}
                      </p>
                    )}
                  </div>

                  {/* Circular Risk Meter */}
                  <RiskMeter
                    score={scanResult.riskScore}
                    level={scanResult.riskLevel}
                    confidence={scanResult.confidence}
                    size="lg"
                  />
                </div>

                {/* Verdict Text */}
                <div className={`p-4 rounded-xl border ${
                  scanResult.riskLevel === 'HIGH'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : scanResult.riskLevel === 'MEDIUM'
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}>
                  <p className="text-xs font-semibold leading-relaxed">
                    {scanResult.verdictSummary}
                  </p>
                </div>

                {/* Reality Check Bar */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-400 uppercase text-[10px]">
                      Job Offer Reality Checker:
                    </span>
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      scanResult.realityCheck.roleSalaryFairness === 'SUSPICIOUSLY_HIGH'
                        ? 'bg-red-900/50 text-red-300 border border-red-700/50'
                        : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                    }`}>
                      Compensation: {scanResult.realityCheck.roleSalaryFairness.replace(/_/g, ' ')}
                    </span>
                  </div>
                  {scanResult.realityCheck.warningNotes && (
                    <p className="text-amber-300/90 text-[11px]">
                      Note: {scanResult.realityCheck.warningNotes}
                    </p>
                  )}
                </div>

                {/* Action Bar: Download PDF, Save, Share */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => generateRiskReportPDF(scanResult)}
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{t.downloadPdf}</span>
                    </button>

                    <button
                      onClick={handleSaveJob}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSaved
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? t.savedSuccess : t.saveJob}</span>
                    </button>
                  </div>

                  <button
                    onClick={handleShare}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? t.copied : t.share}</span>
                  </button>
                </div>
              </div>

              {/* Proprietary Scam DNA Card */}
              <ScamDnaCard dna={scanResult.scamDna} />

              {/* Evidence Explainer with Tabs */}
              <EvidenceExplainer scan={scanResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

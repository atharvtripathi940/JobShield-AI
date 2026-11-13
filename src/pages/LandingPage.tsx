import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Scan, 
  Camera, 
  UserCheck, 
  Dna, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  HelpCircle, 
  ChevronRight,
  TrendingUp,
  FileText,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

export const LandingPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [quickInput, setQuickInput] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const samplePresets = [
    {
      title: "Data Entry ₹45,000 Deposit Trap",
      type: "HIGH RISK",
      text: "Urgent Hiring: Online Data Entry Executive. Earn ₹45,000/month working 1 hour daily from home. Direct selection without interview. Refundable security deposit of ₹1,500 required for software kit. Pay via PhonePe to reserve your slot.",
    },
    {
      title: "Telegram YouTube Rating Scam",
      type: "HIGH RISK",
      text: "Part-time job from mobile: Like YouTube videos and earn ₹150 per like. Earn ₹3,000 to ₹8,000 daily. DM HR manager on Telegram @TaskManager_VIP to start work immediately.",
    },
    {
      title: "Legitimate Junior SDE at Razorpay",
      type: "LOW RISK",
      text: "Razorpay is hiring Software Engineer Interns (6 months). Requirements: Proficiency in React, Node.js, and REST APIs. Technical assessment followed by system design and behavioral rounds. Zero application fee. Apply via razorpay.com/careers.",
    }
  ];

  const handleRunPreset = (presetText: string) => {
    navigate('/scanner', { state: { initialContent: presetText } });
  };

  const faqs = [
    {
      q: "Why do legitimate employers never ask for registration or interview fees?",
      a: "Authentic companies allocate recruitment budgets to talent acquisition. Demanding advance 'training fees', 'laptop deposits', or 'exam fees' from candidates violates international labor standards and is a hallmark indicator of advance-fee recruitment fraud."
    },
    {
      q: "How does the Scam DNA™ Fingerprinting technology work?",
      a: "Our neural AI models break down recruitment communications into semantic fraud genes (such as pressure tactics, off-platform Telegram redirection, unrealistic unskilled earnings, and generic free mailboxes) and generates a verifiable hash to identify recurring scam syndicates."
    },
    {
      q: "Can I verify a job simply by uploading a WhatsApp screenshot or offer letter?",
      a: "Yes! JobShield AI's Screenshot-to-Scam scanner uses Gemini multimodal intelligence to extract visible text via OCR and instantly flag suspicious clauses, fake corporate seals, or unofficial payment requests."
    },
    {
      q: "Does JobShield AI guarantee whether a job is 100% fake or real?",
      a: "No automated tool can provide an absolute legal guarantee. JobShield AI transparently separates verified textual facts from AI probabilistic inferences, highlighting evidence and recommending safe verification steps."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Cyber Glow Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none">
        <div className="absolute top-[-100px] left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-[-50px] right-1/4 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-[130px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.tagline}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
          {t.heroHeadline}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
            Verify Before You Trust.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t.heroSubheadline}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/scanner"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center gap-2 group"
          >
            <Scan className="w-4 h-4 text-cyan-200 group-hover:rotate-90 transition-transform duration-300" />
            <span>{t.analyzeJob}</span>
            <ArrowRight className="w-4 h-4 text-cyan-200 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/screenshot"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-cyan-400" />
            <span>{t.scanScreenshotBtn}</span>
          </Link>
        </div>

        {/* Interactive Quick Scanner Card (Hero Demo) */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl glass-panel-glow p-5 sm:p-7 text-left border border-cyan-500/30 relative">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">
                {t.quickThreatScanner}
              </span>
            </div>
            <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              No Sign-Up Required
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            {t.loadTestPresets}
          </p>

          {/* Quick Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleRunPreset(p.text)}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className={p.type === 'HIGH RISK' ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {p.type}
                  </span>
                  <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">&rarr;</span>
                </div>
                <p className="text-xs font-semibold text-slate-200 truncate">{p.title}</p>
              </button>
            ))}
          </div>

          {/* Input field */}
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Paste job posting text, Telegram pitch, recruiter email, or interview fee demand here..."
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              className="w-full rounded-xl bg-slate-950/90 border border-slate-700/80 p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
            />
            <button
              onClick={() => {
                if (quickInput.trim()) {
                  navigate('/scanner', { state: { initialContent: quickInput } });
                }
              }}
              disabled={!quickInput.trim()}
              className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              <Scan className="w-4 h-4" />
              <span>{t.runAnalysisBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section (Metrics clearly labeled as platform / demo statistics) */}
      <section className="py-12 border-y border-slate-800/80 bg-[#060914]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">Platform Benchmarks</h3>
            <p className="text-xl font-bold text-white">Defending Job Seekers with Explainable AI</p>
            <p className="text-[11px] font-mono text-slate-500 mt-1">[Platform Verification Metrics]</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">14,800+</p>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Postings Scanned</p>
              <p className="text-[10px] text-slate-500">Across Tech, Ops & Remote</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-black font-mono text-red-400">4,300+</p>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Advance-Fee Traps Caught</p>
              <p className="text-[10px] text-slate-500">Deposit & Kit Demands</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-black font-mono text-purple-400">₹1.84 Cr</p>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Estimated Student Funds Saved</p>
              <p className="text-[10px] text-slate-500">Prevented Fraud Transfers</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
              <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">0%</p>
              <p className="text-xs text-slate-300 mt-1 font-semibold">Legit Recruitment Fee Tolerance</p>
              <p className="text-[10px] text-slate-500">Zero-Fee Standard Enforced</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Simple 4-Step Verification</span>
          <h2 className="text-3xl font-black text-white mt-2">How JobShield AI Protects You</h2>
          <p className="text-sm text-slate-400 mt-2">
            From suspicious WhatsApp messages to elaborate fake offer letters, we provide clarity in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 relative space-y-3">
            <span className="text-3xl font-black font-mono text-slate-700">01</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Input Details or Screenshot</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the job text, recruiter email, URL, or upload a screenshot of the chat or offer letter.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 relative space-y-3">
            <span className="text-3xl font-black font-mono text-slate-700">02</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Dna className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">AI Neural & Rule Scan</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini 3.8 Flash extracts OCR text, matches 100+ scam signatures, and identifies hidden fee traps.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 relative space-y-3">
            <span className="text-3xl font-black font-mono text-slate-700">03</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Evidence & Scam DNA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive a transparent 0-100 score with exact highlighted phrases, domain checks, and evidence explanations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 relative space-y-3">
            <span className="text-3xl font-black font-mono text-slate-700">04</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Safe Career Action</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download official PDF verification certificates, alert the community, or verify safely through real corporate portals.
            </p>
          </div>
        </div>
      </section>

      {/* Unique Innovations Grid */}
      <section className="py-20 bg-[#060914] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">Core Innovations</span>
            <h2 className="text-3xl font-black text-white mt-2">Engineered to Outsmart Modern Job Fraud</h2>
            <p className="text-sm text-slate-400 mt-2">
              Beyond simple keyword blockers: true multimodal, explainable AI built for real job-hunting defense.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-purple-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Dna className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Scam DNA™ Fingerprinting</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deconstructs fraudulent job offers into recurring gene archetypes. Compare two suspicious postings to uncover identical syndicate boilerplate.
              </p>
              <Link to="/scam-dna-compare" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 pt-1">
                Explore Scam DNA &rarr;
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-cyan-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Screenshot-to-Scam Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Multimodal Gemini OCR reads WhatsApp chats, Instagram DMs, fake appointment letters, and Telegram task posters with instant clause extraction.
              </p>
              <Link to="/screenshot" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 pt-1">
                Scan Screenshots &rarr;
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Recruiter Credibility Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Detects enterprise impersonation where fraudsters use free Gmail, Outlook, or suspicious .xyz domains while claiming to represent Google or TCS.
              </p>
              <Link to="/recruiter-check" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 pt-1">
                Check Recruiter &rarr;
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-red-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Hidden Fee Detector</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sniffs out disguised fee demands: laptop insurance, ID card charges, gate passes, or training kit security deposits hidden deep in fine print.
              </p>
              <Link to="/scanner" className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 pt-1">
                Test Fee Detector &rarr;
              </Link>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-amber-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Community Scam Alert Feed</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Peer-verified alert network. Students anonymously report fake placement agencies, shared UPI IDs, and fraudulent recruitment numbers.
              </p>
              <Link to="/community" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 pt-1">
                View Community Alerts &rarr;
              </Link>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base font-bold text-white">Official PDF Risk Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate downloadable verification certificates with timestamped Scam DNA hashes to show college placement cells or share with peers.
              </p>
              <Link to="/scanner" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 pt-1">
                Generate PDF Report &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">Questions & Answers</span>
          <h2 className="text-3xl font-black text-white mt-2">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400 mt-1">Understanding job security, labor norms, and AI verification</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#090e1f] border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90 text-cyan-400' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-cyan-900/40 border border-cyan-500/30 p-8 sm:p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)]">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
            Never Fall for an Employment Scam Again.
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Take 30 seconds to verify any recruiter message, internship offer, or contract fine print before risking your money or personal data.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/scanner"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center gap-2"
            >
              <Scan className="w-4 h-4" />
              <span>Launch AI Scanner Free</span>
            </Link>

            <Link
              to="/learning"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs tracking-wider transition-all"
            >
              Take Career Scam Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

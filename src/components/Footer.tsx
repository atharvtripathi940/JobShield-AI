import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Lock, CheckCircle2, AlertTriangle, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 p-[1px]">
                <div className="w-full h-full bg-[#080d1a] rounded-[7px] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-wider">
                JOBSHIELD <span className="text-cyan-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't Just Find Jobs. Verify Your Future. Next-generation AI fraud defense protecting students, freshers, and job seekers worldwide.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                AI Core Active
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Gemini 3.8 Flash
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Supabase DB
              </span>
            </div>
          </div>

          {/* Quick Tools */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-200 tracking-wider mb-3">Verification Tools</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/scanner" className="hover:text-cyan-300 transition-colors">
                  Job & Internship AI Scanner
                </Link>
              </li>
              <li>
                <Link to="/screenshot" className="hover:text-cyan-300 transition-colors">
                  Screenshot-to-Scam Scanner (OCR)
                </Link>
              </li>
              <li>
                <Link to="/recruiter-check" className="hover:text-cyan-300 transition-colors">
                  Recruiter Credibility Checker
                </Link>
              </li>
              <li>
                <Link to="/scam-dna-compare" className="hover:text-cyan-300 transition-colors">
                  Scam DNA Fingerprint Comparison
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-cyan-300 transition-colors">
                  Community Scam Alert Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Awareness & Safety */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-200 tracking-wider mb-3">Career Safety Laws</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Legitimate employers NEVER ask candidates for fees.</span>
              </li>
              <li className="flex items-start gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Corporate recruiters use verified company emails, not public webmail.</span>
              </li>
              <li className="flex items-start gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>No authentic MNC hires solely over Telegram tasks or YouTube likes.</span>
              </li>
              <li className="pt-1">
                <Link to="/learning" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                  Read Full Scam Awareness Guide &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethical AI & Legal Boundary */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-200 tracking-wider mb-3">Ethical AI Notice</h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Evidence vs Inferences</span>
              </div>
              <p className="leading-relaxed">
                JobShield AI evaluates structural and linguistic deception cues. Automated predictions do not replace official regulatory registries or company verifications.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 JobShield AI. Protecting students, freshers, and job seekers worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-cyan-400">Zero-Fee Employment Coalition</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-purple-400">Privacy First Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

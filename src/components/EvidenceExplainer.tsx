import React, { useState } from 'react';
import { JobScanResult, Finding } from '../types/jobshield.js';
import { 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface EvidenceExplainerProps {
  scan: JobScanResult;
}

export const EvidenceExplainer: React.FC<EvidenceExplainerProps> = ({ scan }) => {
  const [expandedId, setExpandedId] = useState<string | null>(scan.findings[0]?.id || null);
  const [activeTab, setActiveTab] = useState<'findings' | 'distinction' | 'fees'>('findings');

  return (
    <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-6">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            AI Evidence Explainer & Distinction Notice
          </h3>
          <p className="text-xs text-slate-400">
            Transparently separating documented facts from AI inferences.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('findings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'findings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Findings ({scan.findings.length})
          </button>
          <button
            onClick={() => setActiveTab('distinction')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'distinction'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Fact vs Inference
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'fees'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hidden Fees ({scan.hiddenFeesDetected.hasFeeDemand ? 'Detected' : 'None'})
          </button>
        </div>
      </div>

      {/* Tab 1: Findings List */}
      {activeTab === 'findings' && (
        <div className="space-y-3">
          {scan.findings.map((f) => {
            const isExpanded = expandedId === f.id;
            const isCrit = f.severity === 'critical';
            const isHigh = f.severity === 'high';
            const isPos = f.severity === 'positive';

            return (
              <div
                key={f.id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isCrit
                    ? 'border-red-500/40 bg-red-950/20'
                    : isHigh
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : isPos
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCrit ? 'bg-red-500/20 text-red-400' :
                      isHigh ? 'bg-amber-500/20 text-amber-400' :
                      isPos ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {isCrit || isHigh ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isPos ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                          [{f.category.replace(/_/g, ' ')}]
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded ${
                          isCrit ? 'bg-red-900/50 text-red-300' :
                          isHigh ? 'bg-amber-900/50 text-amber-300' :
                          isPos ? 'bg-emerald-900/50 text-emerald-300' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {f.severity}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mt-0.5">{f.title}</h4>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/80 text-xs">
                    {/* Evidence Quote */}
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                      <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1">
                        Concrete Evidence (In Document Text):
                      </p>
                      <p className="text-cyan-300 font-mono text-[11px] italic">
                        "{f.evidence || f.highlightedText || 'Direct clause in submission'}"
                      </p>
                    </div>

                    {/* Non-jargon Explanation */}
                    <div>
                      <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider mb-1">
                        Cybersecurity Explanation:
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {f.explanation}
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-200">
                      <p className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider mb-0.5 font-bold">
                        Recommended Candidate Action:
                      </p>
                      <p className="text-xs font-medium">{f.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Fact vs User Claim vs AI Inference Distinction */}
      {activeTab === 'distinction' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Facts</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Information extracted directly from the submitted job text or digital artifact without conjecture.
            </p>
            <ul className="space-y-1 pt-1 text-slate-300 font-mono text-[11px]">
              {scan.distinctionNotice.verifiedFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-emerald-400">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <HelpCircle className="w-4 h-4" />
              <span>User Claims</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Values entered by the candidate (company name, recruiter email) that have not been independently validated by a corporate authority.
            </p>
            <ul className="space-y-1 pt-1 text-slate-300 font-mono text-[11px]">
              {scan.distinctionNotice.userProvidedClaims.map((claim, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-amber-400">•</span>
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>AI Inferences</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Probabilistic evaluations made by Gemini AI and heuristic models based on recurring scam pattern datasets.
            </p>
            <ul className="space-y-1 pt-1 text-slate-300 font-mono text-[11px]">
              {scan.distinctionNotice.aiInferences.map((inf, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-purple-400">•</span>
                  <span>{inf}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Hidden Fees Breakdown */}
      {activeTab === 'fees' && (
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${scan.hiddenFeesDetected.hasFeeDemand ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {scan.hiddenFeesDetected.hasFeeDemand ? 'Financial Demands Detected' : 'No Upfront Fee Demands'}
                </h4>
                <p className="text-xs text-slate-400">
                  {scan.hiddenFeesDetected.hasFeeDemand 
                    ? 'Candidate financial payments requested prior to or during employment.' 
                    : 'Posting does not request candidate money.'}
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              scan.hiddenFeesDetected.hasFeeDemand 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40' 
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {scan.hiddenFeesDetected.hasFeeDemand ? 'HIGH RISK CHARGES' : 'CLEAN'}
            </span>
          </div>

          {scan.hiddenFeesDetected.hasFeeDemand && (
            <div className="space-y-3 pt-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Fee Classifications:</p>
                  <p className="text-sm font-semibold text-red-400 mt-1">
                    {scan.hiddenFeesDetected.feeTypes.join(', ')}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <p className="text-[10px] font-mono uppercase text-slate-400">Extracted Figures:</p>
                  <p className="text-sm font-mono font-semibold text-cyan-300 mt-1">
                    {scan.hiddenFeesDetected.extractedAmounts.join(', ')}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300">
                <p className="font-semibold mb-0.5">Legal & Cybersecurity Warning:</p>
                <p className="text-[11px] leading-relaxed">
                  {scan.hiddenFeesDetected.riskAdvice}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

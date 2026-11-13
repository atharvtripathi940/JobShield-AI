import React from 'react';
import { ScamDnaFingerprint } from '../types/jobshield.js';
import { Dna, Fingerprint, AlertCircle, CheckCircle } from 'lucide-react';

interface ScamDnaCardProps {
  dna: ScamDnaFingerprint;
  onCompareRequest?: () => void;
}

export const ScamDnaCard: React.FC<ScamDnaCardProps> = ({ dna, onCompareRequest }) => {
  const isLegit = dna.archetype === 'LEGITIMATE_PATTERN';

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#0c1328] to-[#070b18] border border-purple-500/30 p-5 shadow-[0_0_30px_rgba(147,51,234,0.1)] relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Dna className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Scam DNA™ Fingerprint
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                PROPRIETARY AI
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Pattern Hash: <span className="text-cyan-400 font-bold">{dna.hash}</span>
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase tracking-wider ${
            isLegit 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
          }`}>
            <Fingerprint className="w-3.5 h-3.5" />
            {dna.archetype.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Visual DNA Sequence Bar */}
      <div className="my-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Deception Gene Sequence (Signature Alignment)</span>
          <span className="text-purple-400 font-bold">{dna.patterns.length} Identified Genes</span>
        </p>

        <div className="flex items-center gap-1.5 h-6">
          {dna.dnaSequence.map((seq, idx) => (
            <div
              key={idx}
              className={`flex-1 h-full rounded transition-all duration-300 flex items-center justify-center text-[9px] font-mono font-bold truncate px-1 ${
                seq.includes('FEE') || seq.includes('DEPOSIT')
                  ? 'bg-red-500/30 border border-red-500/60 text-red-300'
                  : seq.includes('TELEGRAM') || seq.includes('WHATSAPP')
                  ? 'bg-purple-500/30 border border-purple-500/60 text-purple-300'
                  : seq.includes('UNREALISTIC') || seq.includes('IMPERSONATION')
                  ? 'bg-amber-500/30 border border-amber-500/60 text-amber-300'
                  : 'bg-emerald-500/30 border border-emerald-500/60 text-emerald-300'
              }`}
              title={seq}
            >
              {seq.replace(/_/g, ' ').substring(0, 8)}
            </div>
          ))}
        </div>
      </div>

      {/* Identified DNA Archetype & Explanation */}
      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <p className="font-semibold text-slate-200 mb-1">
            Detected Archetype: <span className="text-cyan-300">{dna.archetypeLabel}</span>
          </p>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            {isLegit
              ? 'This opportunity does not match known fraudulent employment gene templates. Communication structure adheres to standard professional industry recruitment practices.'
              : 'Our neural fraud cluster detected recurring semantic phrasing historically associated with employment baiting, advance-fee schemes, or off-platform task operations.'}
          </p>
        </div>

        {/* Matched Pattern Phrases */}
        {dna.patterns.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
              Scam DNA Triggers Detected:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {dna.patterns.flatMap(p => p.matchedPhrases).map((phrase, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded bg-red-950/60 border border-red-800/50 text-red-300 text-[11px] font-mono flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 text-red-400" />
                  "{phrase}"
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action / Comparison Footer */}
      {onCompareRequest && (
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onCompareRequest}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
          >
            <span>Compare with Another Job DNA</span>
            <span>&rarr;</span>
          </button>
        </div>
      )}
    </div>
  );
};

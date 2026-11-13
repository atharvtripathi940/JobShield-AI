import React from 'react';
import { RiskLevel } from '../types/jobshield.js';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface RiskMeterProps {
  score: number;
  level: RiskLevel;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({
  score,
  level,
  confidence = 90,
  size = 'md',
}) => {
  const isHigh = level === 'HIGH';
  const isMed = level === 'MEDIUM';

  const strokeColor = isHigh 
    ? '#ef4444' 
    : isMed 
    ? '#f59e0b' 
    : '#10b981';

  const glowColor = isHigh 
    ? 'rgba(239, 68, 68, 0.4)' 
    : isMed 
    ? 'rgba(245, 158, 11, 0.4)' 
    : 'rgba(16, 185, 129, 0.4)';

  const radius = size === 'lg' ? 68 : size === 'md' ? 52 : 36;
  const strokeWidth = size === 'lg' ? 10 : size === 'md' ? 8 : 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div 
          className="absolute inset-0 rounded-full blur-xl opacity-50"
          style={{ background: glowColor }}
        />

        <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
          {/* Background Track */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {/* Active Meter Bar */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black font-mono tracking-tight text-white ${
            size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-2xl' : 'text-lg'
          }`}>
            {score}
          </span>
          <span className="text-[10px] font-mono uppercase text-slate-400 -mt-0.5">
            / 100 Risk
          </span>
        </div>
      </div>

      {/* Badge below */}
      <div className="mt-3 flex flex-col items-center gap-1">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold uppercase tracking-wider ${
          isHigh
            ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
            : isMed
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
        }`}>
          {isHigh ? (
            <ShieldAlert className="w-3.5 h-3.5" />
          ) : isMed ? (
            <AlertTriangle className="w-3.5 h-3.5" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5" />
          )}
          <span>{level} RISK</span>
        </div>

        {confidence && (
          <span className="text-[11px] text-slate-400 font-mono">
            AI Confidence: <strong className="text-slate-200">{confidence}%</strong>
          </span>
        )}
      </div>
    </div>
  );
};

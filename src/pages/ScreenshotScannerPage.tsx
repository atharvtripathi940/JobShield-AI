import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  FileImage, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Download, 
  FileText,
  Loader2,
  Eye,
  RefreshCw,
  Bookmark
} from 'lucide-react';
import { JobScanResult } from '../types/jobshield.js';
import { RiskMeter } from '../components/RiskMeter.js';
import { ScamDnaCard } from '../components/ScamDnaCard.js';
import { EvidenceExplainer } from '../components/EvidenceExplainer.js';
import { generateRiskReportPDF } from '../utils/pdfGenerator.js';
import { useLanguage } from '../context/LanguageContext.js';
import { apiFetch } from '../lib/api.js';

export const ScreenshotScannerPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [fileName, setFileName] = useState<string>('whatsapp_offer.png');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<JobScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveScreenshot = async () => {
    if (!scanResult) return;
    try {
      await apiFetch('/api/save-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scan: scanResult,
          notes: `Screenshot OCR Scan: ${fileName}`,
          userId: 'demo-user',
        }),
      });
      setIsSaved(true);
    } catch (e) {
      console.error(e);
    }
  };

  // Quick preset sample screenshots (rendered via data URIs / SVG canvas mockups)
  const sampleScenarios = [
    {
      title: "WhatsApp Recruitment Chat (₹2,500 Security Deposit)",
      subtitle: "Fake HR demanding PhonePe transfer before Zoom interview",
      text: "WhatsApp Chat with HR Sneha:\n'Hello candidate, congratulations! You are selected for Senior Assistant. Package ₹4.8 LPA. Before interview link is issued, kindly transfer ₹2,500 security deposit via PhonePe to reserve your seat.'",
      previewColor: "from-emerald-950 to-slate-900",
    },
    {
      title: "Telegram VIP Video Task Poster",
      subtitle: "YouTube rating prepaid task trap",
      text: "VIP Task Telegram Poster:\n'Daily Part-Time Work. Like 3 YouTube videos = ₹450. Upgrade to Gold Level Task with ₹5,000 prepaid recharge to earn ₹12,000 instantly. Contact @VIP_Manager.'",
      previewColor: "from-purple-950 to-slate-900",
    },
    {
      title: "Fake MNC Offer Letter (Courier Laptop Charge)",
      subtitle: "₹4,999 laptop insurance demand",
      text: "Appointment Letter from Global Tech:\n'Subject: Offer of Employment. To deliver corporate Lenovo Laptop, candidate must pay courier transit bond ₹4,999 to account 987654321.'",
      previewColor: "from-blue-950 to-slate-900",
    }
  ];

  // Generate lightweight base64 SVG preview for sample screenshots
  const generateSvgSampleBase64 = (title: string, text: string) => {
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <rect width="600" height="400" fill="#090e1f"/>
        <rect x="20" y="20" width="560" height="360" rx="12" fill="#0f172a" stroke="#334155" stroke-width="2"/>
        <rect x="20" y="20" width="560" height="50" rx="12" fill="#1e293b"/>
        <circle cx="45" cy="45" r="10" fill="#06b6d4"/>
        <text x="65" y="50" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="14">${title}</text>
        <foreignObject x="40" y="90" width="520" height="270">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#cbd5e1;font-family:monospace;font-size:13px;line-height:1.6;white-space:pre-wrap;">
            ${text}
          </div>
        </foreignObject>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));
  };

  const handleSelectSample = (sample: typeof sampleScenarios[0]) => {
    const base64 = generateSvgSampleBase64(sample.title, sample.text);
    setSelectedImage(base64);
    setMimeType('image/svg+xml');
    setFileName(`${sample.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`);
    setScanResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be under 10MB.');
      return;
    }

    setFileName(file.name);
    setMimeType(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setScanResult(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleExecuteScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch('/api/scan/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: selectedImage,
          mimeType,
          fileName,
        }),
      });

      if (!response.ok) {
        throw new Error('Screenshot analysis server returned an error.');
      }

      const result: JobScanResult = await response.json();
      setScanResult(result);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to process screenshot.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Multimodal OCR & Vision Scam Extraction</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.screenshotTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          {t.screenshotSubtitle}
        </p>
      </div>

      {/* Preset Samples Selector */}
      <div className="space-y-3">
        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Try Document & Chat Verification Samples:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sampleScenarios.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(sample)}
              className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                <span className="text-red-400 font-bold">SAMPLE #{idx + 1}</span>
                <span className="text-slate-500 group-hover:text-cyan-400">&rarr;</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {sample.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{sample.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Preview Left (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Document Screenshot</span>
            </h3>

            {/* Drag & Drop File Input */}
            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-950/60">
              <Camera className="w-10 h-10 text-cyan-400 mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-slate-200">
                Click to browse or drag & drop image
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Supports PNG, JPG, WEBP, SVG (Max 10MB)
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Selected Image Preview */}
            {selectedImage && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono truncate max-w-[200px]">{fileName}</span>
                  <span className="text-cyan-400 font-semibold">Image Ready</span>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-64 bg-black flex items-center justify-center">
                  <img
                    src={selectedImage}
                    alt="Uploaded screenshot"
                    className="w-full h-auto object-contain max-h-64"
                  />
                </div>

                <button
                  onClick={handleExecuteScan}
                  disabled={isScanning}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs tracking-wider transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Extracting OCR & Scanning Fraud Signatures...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Scan Screenshot with Multimodal AI</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}
          </div>
        </div>

        {/* Results Right (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!scanResult && !isScanning && (
            <div className="h-full min-h-[380px] rounded-2xl border border-dashed border-slate-800 bg-[#070b14]/50 flex flex-col items-center justify-center p-8 text-center">
              <Camera className="w-12 h-12 text-slate-600 mb-3" />
              <h3 className="text-sm font-bold text-slate-300">Awaiting Screenshot</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Upload a screenshot or click one of the verification samples above to trigger multimodal OCR extraction and risk analysis.
              </p>
            </div>
          )}

          {isScanning && (
            <div className="h-full min-h-[380px] rounded-2xl border border-cyan-500/30 bg-[#090e1f] p-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <h3 className="text-sm font-bold text-white">Multimodal Gemini Vision Pipeline</h3>
              <p className="text-xs font-mono text-slate-400">
                1. Performing optical character recognition on document...
              </p>
              <p className="text-xs font-mono text-slate-400">
                2. Analyzing visual seals, payment QR triggers, and deposit demands...
              </p>
            </div>
          )}

          {scanResult && !isScanning && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Extracted OCR Text Card */}
              {scanResult.extractedOcrText && (
                <div className="rounded-2xl bg-[#090e1f] border border-cyan-500/30 p-5 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      Extracted Text from Screenshot (OCR)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Verified Readout</span>
                  </div>
                  <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 border border-slate-800">
                    {scanResult.extractedOcrText}
                  </pre>
                </div>
              )}

              {/* Scan Results Card */}
              <div className="rounded-2xl bg-[#090e1f] border border-slate-800 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400">Screenshot Analysis #{scanResult.id}</span>
                    <h2 className="text-lg font-bold text-white">{scanResult.jobTitle}</h2>
                    <p className="text-xs text-slate-300">
                      Target: <strong className="text-cyan-300">{scanResult.companyName}</strong>
                    </p>
                  </div>

                  <RiskMeter
                    score={scanResult.riskScore}
                    level={scanResult.riskLevel}
                    confidence={scanResult.confidence}
                    size="md"
                  />
                </div>

                <div className={`p-4 rounded-xl border ${
                  scanResult.riskLevel === 'HIGH'
                    ? 'bg-red-950/30 border-red-500/40 text-red-200'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                }`}>
                  <p className="text-xs leading-relaxed font-semibold">
                    {scanResult.verdictSummary}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2.5">
                  <button
                    onClick={handleSaveScreenshot}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                      isSaved
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isSaved ? 'Saved to Supabase ✓' : 'Save to Supabase'}</span>
                  </button>

                  <button
                    onClick={() => generateRiskReportPDF(scanResult)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF Certificate</span>
                  </button>
                </div>
              </div>

              {/* Scam DNA */}
              <ScamDnaCard dna={scanResult.scamDna} />

              {/* Evidence Explainer */}
              <EvidenceExplainer scan={scanResult} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

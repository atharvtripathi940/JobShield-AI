import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Plus, 
  ThumbsUp, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  DollarSign,
  Search,
  Lock
} from 'lucide-react';
import { CommunityReport } from '../types/jobshield.js';
import { useLanguage } from '../context/LanguageContext.js';

export const CommunityAlertsPage: React.FC = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New report form state
  const [companyName, setCompanyName] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');
  const [scamType, setScamType] = useState<CommunityReport['scamType']>('REGISTRATION_FEE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterAlias, setReporterAlias] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/community/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpvote = async (id: string) => {
    // Optimistic update
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1, hasUserUpvoted: true } : r));
    try {
      await fetch(`/api/community/upvote/${id}`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !title || !description) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/community/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          recruiterContact,
          scamType,
          title,
          description,
          requestedAmount,
          paymentMethod,
          isAnonymous,
          reporterAlias: isAnonymous ? 'Anonymous Student' : (reporterAlias || 'Student Contributor'),
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        // Reset form
        setCompanyName('');
        setRecruiterContact('');
        setTitle('');
        setDescription('');
        setRequestedAmount('');
        setPaymentMethod('');
        await fetchReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesFilter = filterType === 'ALL' || r.scamType === filterType;
    const matchesSearch = !searchQuery || 
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Peer Defense & Crowdsourced Scam Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.communityTitle}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {t.communitySubtitle}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-purple-600 hover:opacity-90 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.25)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report a Suspicious Opportunity</span>
        </button>
      </div>

      {/* Legal Allegation Notice */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Community Notice:</strong> Reports submitted to this feed represent peer allegations and warnings. Verified tags indicate corroboration by JobShield AI security analysts.
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search company, recruiter, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 focus:outline-none text-white placeholder-slate-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 text-xs">
          {['ALL', 'REGISTRATION_FEE', 'TELEGRAM_TASK_FRAUD', 'IMPERSONATION', 'DATA_ENTRY_SCAM'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-all ${
                filterType === type
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type === 'ALL' ? 'All Alerts' : type.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading community alerts...</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/50 border border-slate-800 text-center text-slate-400 text-xs">
            No community reports found matching your criteria.
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl bg-[#090e1f] border border-slate-800/90 p-5 sm:p-6 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider">
                      [{report.scamType.replace(/_/g, ' ')}]
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      report.status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : report.status === 'investigating'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {report.status === 'verified' ? '✓ Verified by Security Lead' : report.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">{report.title}</h3>
                  <p className="text-xs text-slate-300">
                    Target Organization: <strong className="text-cyan-300">{report.companyName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.description}
              </p>

              {/* Meta pills: Contact, Requested Amount */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                {report.recruiterContact && (
                  <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                    Contact: <span className="text-slate-200">{report.recruiterContact}</span>
                  </div>
                )}
                {report.requestedAmount && (
                  <div className="px-2.5 py-1 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 font-mono text-[11px]">
                    Amount Demanded: <strong>{report.requestedAmount}</strong>
                  </div>
                )}
                {report.paymentMethod && (
                  <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
                    Method: {report.paymentMethod}
                  </div>
                )}
              </div>

              {/* Footer: Reporter and Upvote */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                <span className="text-[11px] text-slate-400">
                  Reported by: <strong className="text-slate-300">{report.reporterAlias}</strong>
                </span>

                <button
                  onClick={() => handleUpvote(report.id)}
                  disabled={report.hasUserUpvoted}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    report.hasUserUpvoted
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Confirm / Upvote ({report.upvotes})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-2xl bg-[#090e1f] border border-red-500/30 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              <span>Submit Community Scam Alert</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Help fellow candidates avoid predatory recruiters and fraudulent placement outfits.
            </p>

            <form onSubmit={handleCreateReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company / Entity Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Scam Category *</label>
                <select
                  value={scamType}
                  onChange={(e) => setScamType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                >
                  <option value="REGISTRATION_FEE">Registration / Interview Fee Demand</option>
                  <option value="SECURITY_DEPOSIT">Laptop / Equipment Security Deposit</option>
                  <option value="TELEGRAM_TASK_FRAUD">Telegram / WhatsApp Video Task Scheme</option>
                  <option value="DATA_ENTRY_SCAM">Data Entry Penalty Trap</option>
                  <option value="IMPERSONATION">Brand / HR Impersonation</option>
                  <option value="FAKE_PLACEMENT_AGENCY">Fake Placement Agency</option>
                  <option value="OTHER">Other Employment Fraud</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Recruiter Phone / Email / Telegram *</label>
                <input
                  type="text"
                  placeholder="e.g. hr.company@gmail.com / Telegram @XYZ"
                  value={recruiterContact}
                  onChange={(e) => setRecruiterContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Headline Summary *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asked ₹2,500 security deposit before sending interview link"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Detailed Description *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain what happened: what did they promise, what did they demand, and how did they pressure you?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Amount Demanded</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2,500"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Payment Method</label>
                  <input
                    type="text"
                    placeholder="e.g. PhonePe QR / UPI ID"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              {/* Privacy / Anonymous toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                  <span className="text-slate-300 font-semibold">Post as Anonymous Student (Protects your identity)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                >
                  {submitting ? 'Submitting...' : 'Broadcast Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

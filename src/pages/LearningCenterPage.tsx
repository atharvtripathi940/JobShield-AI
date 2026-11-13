import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  AlertTriangle, 
  Award, 
  Scale, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  FileCheck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext.js';

export const LearningCenterPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'checklist' | 'quiz' | 'laws' | 'redflags'>('checklist');

  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'c1': true,
    'c2': true,
  });

  const checklistItems = [
    { id: 'c1', title: "Official Corporate Domain Check", desc: "Did the offer come from a corporate email (@company.com) rather than @gmail.com or @outlook.com?" },
    { id: 'c2', title: "Zero Upfront Financial Demands", desc: "Did the company confirm that NO registration, training, laptop deposit, or uniform fee is required?" },
    { id: 'c3', title: "Official Career Portal Verification", desc: "Is this opening or requisition ID listed on the company's verified careers page?" },
    { id: 'c4', title: "Real Face-to-Face or Live Video Interview", desc: "Did you participate in a substantive technical/behavioral interview before receiving an appointment letter?" },
    { id: 'c5', title: "Clear Physical Office & Tax Registrations", desc: "Does the company have a verifiable CIN (Corporate Identification Number) and physical corporate address?" },
    { id: 'c6', title: "No Withholding of Original Certificates", desc: "The employer does not demand your original 10th/12th/Degree marksheets (strictly illegal)?" },
  ];

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalChecked = Object.values(checkedItems).filter(Boolean).length;
  const safetyPercent = Math.round((totalChecked / checklistItems.length) * 100);

  // Interactive Quiz State
  const quizQuestions = [
    {
      q: "A recruiter claiming to be from Amazon India offers you a direct job via WhatsApp and asks for ₹2,500 'laptop courier insurance'. What should you do?",
      options: [
        { text: "Pay immediately so you don't miss the laptop dispatch", correct: false },
        { text: "Reject and report immediately: Amazon never charges candidates for equipment", correct: true },
        { text: "Ask for a 50% discount on the courier fee", correct: false },
      ],
      explanation: "Legitimate enterprise employers bear all logistical costs for corporate equipment."
    },
    {
      q: "You are invited to a Telegram channel paying ₹150 for liking YouTube videos, and then asked to 'deposit ₹3,000 to unlock VIP earnings'. This is:",
      options: [
        { text: "A legitimate high-yield freelance task opportunity", correct: false },
        { text: "A classic Prepaid Task Scam / Ponzi trap", correct: true },
        { text: "A standard digital marketing internship", correct: false },
      ],
      explanation: "Prepaid rating tasks lure victims with small initial payouts before stealing large deposit recharges."
    },
    {
      q: "Can an authentic employer legally confiscate your original degree or marksheet during employment?",
      options: [
        { text: "No, withholding original educational certificates is strictly prohibited by law", correct: true },
        { text: "Yes, companies need collateral for training costs", correct: false },
        { text: "Yes, for the probation period only", correct: false },
      ],
      explanation: "The Ministry of Human Resource Development and labor regulations strictly forbid retaining original certificates."
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectAnswer = (qIndex: number, oIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIndex]: oIndex }));
  };

  const handleGradeQuiz = () => {
    setQuizSubmitted(true);
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] !== undefined && q.options[quizAnswers[idx]].correct) {
        correct++;
      }
    });

    if (correct === quizQuestions.length) {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Student & Job Seeker Defense Academy</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          {t.learningTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          {t.learningSubtitle}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'checklist'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Interactive Safety Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'quiz'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Scam Awareness Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('redflags')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'redflags'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Top 10 Scam Red Flags</span>
        </button>

        <button
          onClick={() => setActiveTab('laws')}
          className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
            activeTab === 'laws'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Labor Laws on Recruitment</span>
        </button>
      </div>

      {/* Tab 1: Checklist */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-3">
            {checklistItems.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isChecked
                      ? 'bg-cyan-950/20 border-cyan-500/40 text-slate-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                    isChecked ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-950'
                  }`}>
                    {isChecked && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checklist Score Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-[#090e1f] border border-cyan-500/30 p-6 space-y-4 text-center">
              <span className="text-xs font-mono uppercase text-slate-400">Offer Safety Audit</span>
              <div className="text-5xl font-black font-mono text-cyan-400">
                {safetyPercent}%
              </div>
              <p className="text-xs font-semibold text-slate-300">
                {safetyPercent === 100
                  ? 'All vital security checks passed! Opportunity looks compliant with labor standards.'
                  : safetyPercent >= 60
                  ? 'Moderate compliance. Exercise caution with remaining unchecked items before signing.'
                  : 'High risk: Missing critical verified safety signals. Do not transfer funds!'}
              </p>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full transition-all duration-500"
                  style={{ width: `${safetyPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {totalChecked} of {checklistItems.length} safety items verified
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Quiz */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl space-y-6">
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
            <span>Test your scam detection reflexes and earn the JobShield Cyber Awareness Badge.</span>
            {quizSubmitted && (
              <button
                onClick={resetQuiz}
                className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[11px] font-mono hover:bg-purple-500/30"
              >
                Retake Quiz
              </button>
            )}
          </div>

          <div className="space-y-6">
            {quizQuestions.map((q, qIdx) => (
              <div key={qIdx} className="p-6 rounded-2xl bg-[#090e1f] border border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-purple-400">QUESTION {qIdx + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-white leading-relaxed">{q.q}</h3>

                <div className="space-y-2 pt-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    let style = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                    if (quizSubmitted) {
                      if (opt.correct) {
                        style = 'bg-emerald-950/50 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isSelected && !opt.correct) {
                        style = 'bg-red-950/50 border-red-500 text-red-200';
                      }
                    } else if (isSelected) {
                      style = 'bg-purple-500/20 border-purple-500 text-purple-300';
                    }

                    return (
                      <div
                        key={oIdx}
                        onClick={() => handleSelectAnswer(qIdx, oIdx)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${style}`}
                      >
                        <span>{opt.text}</span>
                        {quizSubmitted && opt.correct && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {quizSubmitted && isSelected && !opt.correct && <XCircle className="w-4 h-4 text-red-400" />}
                      </div>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800">
                    Insight: {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {!quizSubmitted && (
            <button
              onClick={handleGradeQuiz}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs tracking-wider transition-all"
            >
              Grade My Safety Score
            </button>
          )}
        </div>
      )}

      {/* Tab 3: Top 10 Red Flags */}
      {activeTab === 'redflags' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { title: "1. Advance Fee Under Any Name", desc: "Registration fee, interview reservation fee, gate pass, or software kit deposit. 100% scam." },
            { title: "2. Free Webmail Domain for Big Corporations", desc: "Recruiter uses an @gmail.com or @outlook.com address claiming to hire for Google, TCS, or Amazon." },
            { title: "3. Direct Selection Without Technical Interview", desc: "Received an offer letter simply after filling a Google Form or sharing your resume on WhatsApp." },
            { title: "4. Off-Platform Telegram Redirection", desc: "Job advert directs you to contact a 'Manager' or 'Coordinator' strictly on Telegram or WhatsApp groups." },
            { title: "5. Unrealistic Salary for Unskilled Tasks", desc: "Promises of ₹40,000 to ₹60,000 per month for basic typing, data entry, or watching videos." },
            { title: "6. Urgency and Scarcity Pressure", desc: "'Only 2 seats left', 'Offer expires in 30 minutes', or 'Pay deposit within 1 hour to confirm position'." },
            { title: "7. Request for NetBanking OTP or UPI PIN", desc: "Asking you to enter your UPI PIN to 'receive your stipend' or 'verify bank mandate'." },
            { title: "8. Demanding Original Degree Marksheets", desc: "Asking candidate to courier original 10th/12th or graduation certificates as 'security guarantee'." },
            { title: "9. Vague Job Descriptions & No Real Skills", desc: "Ad states 'All Graduates Eligible, No Experience Needed' without listing defined technologies or responsibilities." },
            { title: "10. Inconsistent Corporate Branding & Badges", desc: "Offer letter contains mismatched logos, spelling errors in executive titles, or unregistered stamp seals." },
          ].map((rf, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#090e1f] border border-slate-800 space-y-1">
              <h4 className="font-bold text-red-400">{rf.title}</h4>
              <p className="text-slate-300 leading-relaxed text-[11px]">{rf.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Labor Laws */}
      {activeTab === 'laws' && (
        <div className="max-w-3xl space-y-4 text-xs">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>International & National Recruitment Standards</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Under International Labour Organization (ILO) Convention No. 181, private employment agencies and corporations shall not charge directly or indirectly, in whole or in part, any fees or costs to job seekers.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Retention of Original Certificates is Illegal</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Employers have zero statutory authority to retain original academic transcripts, certificates, or passports. Any contract clause obligating deposit of original marksheets is void and legally unenforceable.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <h4 className="text-sm font-bold text-purple-400 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4" />
              <span>Standard Internship Stipends & Equipment Provisioning</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Employers requiring employees to use proprietary enterprise systems must provide laptops, licenses, and security tokens at corporate expense without security deposit deductions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

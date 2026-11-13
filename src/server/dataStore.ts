import { CommunityReport, JobScanResult, PlatformStats } from '../types/jobshield.js';

// Realistic initial community reports (marked as Allegations & Alerts)
let communityReports: CommunityReport[] = [
  {
    id: 'report-001',
    companyName: 'Apex Global Placement Solutions',
    recruiterContact: 'hr.apexplacement@gmail.com / Telegram @ApexHrSupport',
    scamType: 'REGISTRATION_FEE',
    title: 'Demanded ₹2,500 registration fee before scheduling Zoom interview',
    description: 'Received WhatsApp message promising direct placement at an MNC in Bangalore. They sent an official-looking PDF invoice asking for ₹2,500 "refundable security deposit" via PhonePe before giving the interview link. After payment, the number blocked me.',
    requestedAmount: '₹2,500',
    paymentMethod: 'PhonePe UPI QR',
    isAnonymous: true,
    reporterAlias: 'Anonymous Student (Bangalore)',
    status: 'verified',
    upvotes: 42,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'report-002',
    companyName: 'NexGen Digital Media Tasks',
    recruiterContact: 'Telegram @NexGen_Task_Manager',
    scamType: 'TELEGRAM_TASK_FRAUD',
    title: 'YouTube video like and Google review rating prepaid task trap',
    description: 'Offered ₹150 per YouTube like. Paid ₹450 for the first 3 likes to build trust. Then invited to "VIP Task group" requiring ₹5,000 recharge to unlock ₹8,500 payout. Once deposited, they demanded ₹25,000 tax clearance fee. Total lost: ₹5,000.',
    requestedAmount: '₹5,000 - ₹30,000',
    paymentMethod: 'Crypto USDT & UPI ID',
    isAnonymous: false,
    reporterAlias: 'Rohan K.',
    status: 'verified',
    upvotes: 89,
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
  },
  {
    id: 'report-003',
    companyName: 'TCS Impersonator (TATA Career Services fake)',
    recruiterContact: 'tcs.recruitment.india2026@gmail.com',
    scamType: 'IMPERSONATION',
    title: 'Fake TCS Offer Letter asking ₹4,999 for "Company Laptop Courier"',
    description: 'Sent a polished fake offer letter with Tata logos claiming selection for Associate System Engineer without any technical round. Asked for ₹4,999 courier insurance charge to dispatch Lenovo ThinkPad. Verified with TCS genuine careers portal and found it to be completely fake.',
    requestedAmount: '₹4,999',
    paymentMethod: 'Bank Transfer to personal savings account',
    isAnonymous: true,
    reporterAlias: 'College Graduate (Pune)',
    status: 'verified',
    upvotes: 114,
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
  {
    id: 'report-004',
    companyName: 'SpeedyType Document Solutions',
    recruiterContact: 'support@speedytype-work.online',
    scamType: 'DATA_ENTRY_SCAM',
    title: '₹12,000 penalty threat for typo in 100-page typing project',
    description: 'Offered ₹35,000 for typing scanned PDFs into Word. Contract contained hidden fine print: if accuracy is under 98%, candidate must pay ₹12,000 legal breach fee. Sent fake legal notice when candidate refused to pay.',
    requestedAmount: '₹12,000 legal fee',
    paymentMethod: 'GPay',
    isAnonymous: false,
    reporterAlias: 'Priya M. (Delhi)',
    status: 'investigating',
    upvotes: 36,
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
  },
  {
    id: 'report-005',
    companyName: 'CloudSky Logistics Remote HR',
    recruiterContact: '+91 98765 43210 (WhatsApp only)',
    scamType: 'SECURITY_DEPOSIT',
    title: 'Work from home customer service - ₹3,000 training software license fee',
    description: 'Selected on the spot after 2-minute WhatsApp chat. Asked candidate to purchase proprietary CRM license from a third-party link before day 1.',
    requestedAmount: '₹3,000',
    paymentMethod: 'Razorpay payment link to personal entity',
    isAnonymous: true,
    reporterAlias: 'JobSeeker2026',
    status: 'unverified',
    upvotes: 18,
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
  }
];

let savedJobsList: { id: string; userId: string; scan: JobScanResult; notes: string; status: string; savedAt: string }[] = [];

let recentScansList: JobScanResult[] = [];

let adminAuditLogs: { id: string; action: string; target: string; timestamp: string; details: string }[] = [
  {
    id: 'log-1',
    action: 'VERIFIED_REPORT',
    target: 'report-001 (Apex Global)',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: 'Multiple victim complaints and identical UPI receiver verified by security team.',
  },
  {
    id: 'log-2',
    action: 'FLAGGED_DOMAIN',
    target: 'tcs.recruitment.india2026@gmail.com',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    details: 'Added to global high-risk impersonation blocklist.',
  }
];

export const dataStore = {
  getCommunityReports(): CommunityReport[] {
    return [...communityReports].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  addCommunityReport(report: Omit<CommunityReport, 'id' | 'createdAt' | 'upvotes' | 'status'>): CommunityReport {
    const newReport: CommunityReport = {
      ...report,
      id: `report-${Date.now()}`,
      status: 'unverified',
      upvotes: 1,
      createdAt: new Date().toISOString(),
    };
    communityReports.unshift(newReport);
    return newReport;
  },

  upvoteReport(id: string): { success: boolean; newUpvotes: number } {
    const report = communityReports.find(r => r.id === id);
    if (report) {
      report.upvotes += 1;
      return { success: true, newUpvotes: report.upvotes };
    }
    return { success: false, newUpvotes: 0 };
  },

  updateReportStatus(id: string, status: CommunityReport['status']): boolean {
    const report = communityReports.find(r => r.id === id);
    if (report) {
      report.status = status;
      adminAuditLogs.unshift({
        id: `log-${Date.now()}`,
        action: `STATUS_${status.toUpperCase()}`,
        target: `${report.companyName} (${id})`,
        timestamp: new Date().toISOString(),
        details: `Report status moderated to ${status}`,
      });
      return true;
    }
    return false;
  },

  saveScan(scan: JobScanResult, notes: string = '', userId: string = 'demo-user') {
    recentScansList.unshift(scan);
    if (recentScansList.length > 50) recentScansList.pop();

    const existingIndex = savedJobsList.findIndex(item => item.scan.id === scan.id && item.userId === userId);
    if (existingIndex >= 0) {
      savedJobsList[existingIndex].notes = notes;
    } else {
      savedJobsList.unshift({
        id: `saved-${Date.now()}`,
        userId,
        scan,
        notes,
        status: scan.riskLevel === 'HIGH' ? 'flagged_scam' : scan.riskLevel === 'MEDIUM' ? 'investigating' : 'safe',
        savedAt: new Date().toISOString(),
      });
    }
  },

  getSavedJobs(userId: string = 'demo-user') {
    return savedJobsList.filter(item => item.userId === userId);
  },

  deleteSavedJob(id: string, userId: string = 'demo-user') {
    savedJobsList = savedJobsList.filter(item => !(item.id === id && item.userId === userId));
  },

  getRecentScans() {
    return recentScansList.slice(0, 10);
  },

  getPlatformStats(): PlatformStats {
    const totalCommunity = communityReports.length;
    return {
      totalJobsAnalyzed: 14820 + recentScansList.length,
      highRiskCaught: 4310 + recentScansList.filter(s => s.riskLevel === 'HIGH').length,
      mediumRiskWarned: 3120 + recentScansList.filter(s => s.riskLevel === 'MEDIUM').length,
      lowRiskCleared: 7390 + recentScansList.filter(s => s.riskLevel === 'LOW').length,
      communityReportsLogged: totalCommunity + 140,
      estimatedMoneySavedInr: 18450000, // ~1.84 Crore saved in scam fees
      activeShieldUsers: 8430,
    };
  },

  getAdminLogs() {
    return adminAuditLogs;
  }
};

import { jsPDF } from 'jspdf';
import { JobScanResult } from '../types/jobshield.js';

export function generateRiskReportPDF(scan: JobScanResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Background
  doc.setFillColor(10, 15, 30);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Title
  doc.setTextColor(6, 182, 212); // Cyan
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('JOBSHIELD AI', 15, y);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL CAREER SAFETY & FRAUD VERIFICATION REPORT', 15, y + 8);
  doc.text(`Generated: ${new Date(scan.createdAt).toLocaleString()} | ID: ${scan.id}`, 15, y + 14);

  y = 52;

  // Job Meta Box
  doc.setDrawColor(51, 65, 85);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, y, pageWidth - 30, 32, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Position: ${scan.jobTitle}`, 20, y + 9);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Company: ${scan.companyName || 'Not Disclosed'}`, 20, y + 17);
  doc.text(`Recruiter: ${scan.recruiterName || 'Unspecified'} (${scan.recruiterEmail || 'No email provided'})`, 20, y + 24);

  // Risk Score Badge
  const scoreX = pageWidth - 65;
  const isHigh = scan.riskLevel === 'HIGH';
  const isMed = scan.riskLevel === 'MEDIUM';

  if (isHigh) doc.setFillColor(220, 38, 38);
  else if (isMed) doc.setFillColor(217, 119, 6);
  else doc.setFillColor(22, 163, 74);

  doc.roundedRect(scoreX, y + 5, 45, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('RISK ASSESSMENT', scoreX + 6, y + 11);
  doc.setFontSize(14);
  doc.text(`${scan.riskScore}/100 (${scan.riskLevel})`, scoreX + 6, y + 21);

  y += 42;

  // Scam DNA Fingerprint section
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, y, pageWidth - 30, 20, 2, 2, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Scam DNA Fingerprint:', 20, y + 7);
  doc.setFont('courier', 'bold');
  doc.setTextColor(109, 40, 217); // Purple
  doc.text(`${scan.scamDna.hash} [${scan.scamDna.archetype}]`, 75, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Identified Archetype: ${scan.scamDna.archetypeLabel}`, 20, y + 14);

  y += 28;

  // Key Verdict Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('EXECUTIVE VERDICT SUMMARY', 15, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const verdictLines = doc.splitTextToSize(scan.verdictSummary, pageWidth - 30);
  doc.text(verdictLines, 15, y);
  y += verdictLines.length * 5 + 6;

  // Findings & Evidence Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('DETECTED RISK FINDINGS & EVIDENCE EXPLAINER', 15, y);
  y += 6;

  scan.findings.slice(0, 4).forEach((finding, idx) => {
    if (y > 240) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(15, y, pageWidth - 30, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(finding.severity === 'critical' || finding.severity === 'high' ? 220 : 30, 38, 38);
    doc.text(`[${finding.severity.toUpperCase()}] ${finding.title}`, 20, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const expText = doc.splitTextToSize(`Explanation: ${finding.explanation}`, pageWidth - 42);
    doc.text(expText.slice(0, 2), 20, y + 12);

    const recText = doc.splitTextToSize(`Action: ${finding.recommendation}`, pageWidth - 42);
    doc.text(recText.slice(0, 1), 20, y + 18);

    y += 26;
  });

  // Recommendations
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('RECOMMENDED CANDIDATE ACTIONS', 15, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  scan.recommendations.slice(0, 4).forEach(rec => {
    doc.text(`• ${rec}`, 18, y);
    y += 5;
  });

  // Footer Disclaimer
  y = doc.internal.pageSize.getHeight() - 25;
  doc.setDrawColor(203, 213, 225);
  doc.line(15, y, pageWidth - 15, y);
  y += 5;

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'LEGAL NOTICE: JobShield AI distinguishes verified facts, user claims, and AI probabilistic inferences.',
    15,
    y
  );
  doc.text(
    'No automated tool guarantees 100% authenticity. Legitimate employers never charge recruitment or training fees.',
    15,
    y + 4
  );
  doc.text(
    'Verify jobs directly with official corporate registries. © JobShield AI - Career Protection Ecosystem.',
    15,
    y + 8
  );

  doc.save(`JobShield_Verification_${scan.companyName.replace(/[^a-zA-Z0-9]/g, '_') || 'Report'}.pdf`);
}

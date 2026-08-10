import jsPDF from 'jspdf';
import { CropDiagnosisReport, UserProfile } from '../types';

export const generateCropReportPDF = async (
  report: CropDiagnosisReport,
  profile?: UserProfile
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Primary palette
  const primaryGreen = [16, 128, 67]; // #108043
  const darkSlate = [15, 23, 42];      // #0f172a
  const borderGray = [226, 232, 240];  // #e2e8f0
  const bgLight = [248, 250, 252];      // #f8fafc

  // 1. Header Banner
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Green accent bar
  doc.setFillColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
  doc.rect(0, 28, pageWidth, 3, 'F');

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('AgriVeda AI • Crop Pathology Diagnosis Report', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // light grayish
  doc.text('Smart Agricultural Intelligence & Field Pathology Advisory', margin, 20);

  // Report Reference & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text(`Report ID: ${report.id.slice(0, 16)}`, pageWidth - margin, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${report.timestamp || new Date().toLocaleDateString()}`, pageWidth - margin, 20, { align: 'right' });

  y = 38;

  // 2. Farmer & Location Credentials Box
  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('Farmer & Field Profile', margin + 4, y + 6);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const farmerName = profile?.name || 'Verified Farmer';
  const farmLoc = report.location || profile?.location || 'Vellore, Tamil Nadu';
  const farmId = profile?.farmId || 'AGRI-8832';
  const farmSize = profile?.farmSizeAcres ? `${profile.farmSizeAcres} Acres` : '2.5 Acres';

  doc.text(`Farmer Name: ${farmerName}`, margin + 4, y + 12);
  doc.text(`Farm ID: ${farmId}`, margin + 4, y + 17);

  doc.text(`Location: ${farmLoc}`, margin + 90, y + 12);
  doc.text(`Farm Area: ${farmSize}`, margin + 90, y + 17);

  y += 28;

  // 3. Diagnosis Summary Grid
  const gridHeight = 32;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), gridHeight, 3, 3, 'FD');

  // Title inside grid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text(`Crop: ${report.cropType} — ${report.detectedIssue}`, margin + 4, y + 8);

  // Badges
  const isHighRisk = report.riskLevel === 'High';
  const isMedRisk = report.riskLevel === 'Medium';
  const riskBg = isHighRisk ? [239, 68, 68] : isMedRisk ? [217, 119, 6] : [16, 185, 129];

  doc.setFillColor(riskBg[0], riskBg[1], riskBg[2]);
  doc.roundedRect(margin + 4, y + 13, 26, 6, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.riskLevel} Risk`, margin + 17, y + 17, { align: 'center' });

  // AI Confidence
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + 34, y + 13, 32, 6, 1.5, 1.5, 'FD');
  doc.setTextColor(29, 78, 216);
  doc.text(`AI Confidence: ${report.confidence}%`, margin + 50, y + 17, { align: 'center' });

  // Soil Type
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Soil Type: ${report.soilType || 'Red Soil'}`, margin + 4, y + 26);
  if (report.farmHealthScore) {
    doc.text(`Overall Plot Health Score: ${report.farmHealthScore}/100`, margin + 90, y + 26);
  }

  y += gridHeight + 6;

  // Optional: Embed Image if base64/URL valid
  if (report.imageUrl && report.imageUrl.startsWith('data:image')) {
    try {
      const imgWidth = 50;
      const imgHeight = 35;
      doc.addImage(report.imageUrl, 'JPEG', pageWidth - margin - imgWidth, y, imgWidth, imgHeight);
    } catch (e) {
      console.warn('Could not render image to PDF:', e);
    }
  }

  // 4. Cause Analysis Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('1. Biological / Environmental Cause Analysis', margin, y);
  y += 4;

  doc.setFillColor(bgLight[0], bgLight[1], bgLight[2]);
  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);

  const causeLines = doc.splitTextToSize(report.cause, pageWidth - (margin * 2) - 8);
  const causeBoxHeight = Math.max(16, causeLines.length * 4.5 + 6);

  doc.roundedRect(margin, y, pageWidth - (margin * 2), causeBoxHeight, 2, 2, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(causeLines, margin + 4, y + 6);

  y += causeBoxHeight + 6;

  // 5. Immediate Treatment Steps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('2. Recommended Treatment & Spray Protocol', margin, y);
  y += 4;

  if (Array.isArray(report.treatment)) {
    report.treatment.forEach((step, idx) => {
      const stepText = `${idx + 1}. ${step}`;
      const stepLines = doc.splitTextToSize(stepText, pageWidth - (margin * 2) - 10);
      const stepHeight = stepLines.length * 4 + 3;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
      doc.roundedRect(margin, y, pageWidth - (margin * 2), stepHeight, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 41, 59);
      doc.text(stepLines, margin + 4, y + 4.5);

      y += stepHeight + 2;
    });
  }

  y += 4;

  // 6. Long-Term Field Prevention
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.text('3. Field Prevention & Crop Protection Safeguards', margin, y);
  y += 4;

  if (Array.isArray(report.prevention)) {
    report.prevention.forEach((step) => {
      const stepText = `• ${step}`;
      const stepLines = doc.splitTextToSize(stepText, pageWidth - (margin * 2) - 10);
      const stepHeight = stepLines.length * 4 + 2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(stepLines, margin + 4, y + 4);

      y += stepHeight;
    });
  }

  y += 4;

  // 7. Fertilizer & Soil Nutrition Recommendation
  if (report.fertilizerSuggestion) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.text('4. Soil Nutrition & Fertilizer Dosages', margin, y);
    y += 4;

    doc.setFillColor(240, 253, 244); // light green bg
    doc.setDrawColor(187, 247, 208);
    const fertLines = doc.splitTextToSize(report.fertilizerSuggestion, pageWidth - (margin * 2) - 8);
    const fertHeight = Math.max(12, fertLines.length * 4.5 + 5);

    doc.roundedRect(margin, y, pageWidth - (margin * 2), fertHeight, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(22, 101, 52);
    doc.text(fertLines, margin + 4, y + 5.5);

    y += fertHeight + 8;
  }

  // Footer Disclaimer & Stamp
  const footerY = pageHeight - 16;

  doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2]);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('AgriVeda AI Pathology Engine', margin, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Official Digital Diagnosis Certificate • Valid for Agricultural Input Stores & KVK Advisory', margin, footerY + 4);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('✓ Verified Digital Signature', pageWidth - margin, footerY, { align: 'right' });

  // Save the PDF
  const filename = `AgriVeda_Report_${report.cropType}_${report.detectedIssue.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
};

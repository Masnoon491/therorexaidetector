import jsPDF from "jspdf";
import type { ScanResults } from "@/types/scan";
import { formatDateBD } from "@/utils/dateFormat";

interface ReportMeta {
  auditId: string;
  scanDate: Date;
  ipAddress: string | null;
  wordCount: number;
  creditsUsed: number;
}

function getRiskLabel(pct: number) {
  if (pct <= 14) return "CLEAN";
  if (pct <= 39) return "LOW RISK";
  if (pct <= 59) return "MODERATE RISK";
  if (pct <= 84) return "HIGH RISK";
  return "CRITICAL RISK";
}

function drawHLine(doc: jsPDF, y: number, x1: number, x2: number, color: string) {
  doc.setDrawColor(color);
  doc.setLineWidth(0.5);
  doc.line(x1, y, x2, y);
}

export function generatePdfReport(results: ScanResults, meta: ReportMeta) {
  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  const MARGIN = 20;
  const CW = W - MARGIN * 2;
  const NAVY = "#1B263B";
  const TEAL = "#00B894";
  const GREY = "#6B7280";
  const LIGHT = "#F3F4F6";

  // ─── PAGE 1: CERTIFICATE ───
  // Top accent bar
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, 8, "F");
  doc.setFillColor(TEAL);
  doc.rect(0, 8, W, 3, "F");

  let y = 22;

  // Logo / Brand
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(TEAL);
  doc.text("THEOREX", MARGIN, y);
  doc.setTextColor(NAVY);
  doc.text(" CONSULTING", MARGIN + doc.getTextWidth("THEOREX"), y);
  y += 4;
  doc.setFontSize(7);
  doc.setTextColor(GREY);
  doc.text("Promoting Transparency Over Mere Detection", MARGIN, y);

  y += 14;

  // Certificate title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY);
  doc.text("Certificate of Authenticity", W / 2, y, { align: "center" });
  y += 4;
  drawHLine(doc, y, MARGIN + 30, W - MARGIN - 30, TEAL);
  y += 10;

  doc.setFontSize(9);
  doc.setTextColor(GREY);
  doc.text("This certificate verifies the authenticity analysis of the submitted content.", W / 2, y, { align: "center" });
  y += 14;

  // Details box
  doc.setFillColor(LIGHT);
  doc.roundedRect(MARGIN, y, CW, 52, 3, 3, "F");
  doc.setDrawColor("#DEE2E6");
  doc.roundedRect(MARGIN, y, CW, 52, 3, 3, "S");
  y += 10;

  const detailLeft = MARGIN + 10;
  const detailValX = MARGIN + 55;
  const lineH = 9;

  const details: [string, string][] = [
    ["Audit ID:", meta.auditId],
    ["Scan Date:", formatDateBD(meta.scanDate)],
    ["Auditor:", "Theorex AI Detector"],
    ["User IP:", meta.ipAddress || "N/A"],
  ];

  doc.setFontSize(9);
  details.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text(label, detailLeft, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(GREY);
    doc.text(value, detailValX, y);
    y += lineH;
  });

  y += 10;

  // Core Verdict
  const humanPct = results.ai ? Math.round(results.ai.originalScore * 100) : 100;
  const aiPct = results.ai ? Math.round(results.ai.score * 100) : 0;

  doc.setFillColor(NAVY);
  doc.roundedRect(MARGIN, y, CW, 32, 3, 3, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#FFFFFF");
  doc.text("CORE VERDICT", W / 2, y + 10, { align: "center" });

  doc.setFontSize(18);
  doc.setTextColor(TEAL);
  doc.text(`${humanPct}% Human-Generated Content`, W / 2, y + 22, { align: "center" });
  y += 40;

  // Risk classification
  const riskLabel = getRiskLabel(aiPct);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(GREY);
  doc.text(`AI Risk Level: ${aiPct}% — ${riskLabel}`, W / 2, y, { align: "center" });
  y += 6;
  if (results.plagiarism) {
    doc.text(`Plagiarism Score: ${Math.round(results.plagiarism.score)}%`, W / 2, y, { align: "center" });
    y += 6;
  }

  y += 16;

  // Seal
  doc.setDrawColor(TEAL);
  doc.setLineWidth(1.5);
  doc.circle(W / 2, y + 14, 14, "S");
  doc.setDrawColor(NAVY);
  doc.setLineWidth(0.8);
  doc.circle(W / 2, y + 14, 11, "S");

  doc.setFontSize(6);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY);
  doc.text("THEOREX", W / 2, y + 11, { align: "center" });
  doc.setFontSize(5);
  doc.text("VERIFIED", W / 2, y + 15, { align: "center" });
  doc.setFontSize(4);
  doc.setTextColor(TEAL);
  doc.text("AUTHENTICITY SEAL", W / 2, y + 19, { align: "center" });

  y += 36;

  // Signature line
  drawHLine(doc, y, W / 2 - 30, W / 2 + 30, NAVY);
  y += 5;
  doc.setFontSize(7);
  doc.setTextColor(GREY);
  doc.text("Authorized Digital Signature — Theorex AI Detector", W / 2, y, { align: "center" });

  // Footer accent
  doc.setFillColor(TEAL);
  doc.rect(0, 294, W, 3, "F");

  // ─── PAGE 2: AUDIT DETAILS ───
  doc.addPage();

  // Top accent bar
  doc.setFillColor(NAVY);
  doc.rect(0, 0, W, 8, "F");
  doc.setFillColor(TEAL);
  doc.rect(0, 8, W, 3, "F");

  y = 22;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(NAVY);
  doc.text("Audit Details", MARGIN, y);
  y += 3;
  drawHLine(doc, y, MARGIN, MARGIN + 40, TEAL);
  y += 10;

  // Stats row
  const stats: [string, string][] = [
    ["Word Count", String(meta.wordCount)],
    ["Credits Used", String(meta.creditsUsed)],
    ["AI Score", `${aiPct}%`],
  ];
  if (results.plagiarism) stats.push(["Plagiarism", `${Math.round(results.plagiarism.score)}%`]);
  if (results.readability?.sentenceCount != null) stats.push(["Sentences", String(results.readability.sentenceCount)]);

  const boxW = (CW - (stats.length - 1) * 4) / stats.length;
  stats.forEach(([label, value], i) => {
    const bx = MARGIN + i * (boxW + 4);
    doc.setFillColor(LIGHT);
    doc.roundedRect(bx, y, boxW, 18, 2, 2, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text(value, bx + boxW / 2, y + 9, { align: "center" });
    doc.setFontSize(6);
    doc.setTextColor(GREY);
    doc.text(label.toUpperCase(), bx + boxW / 2, y + 15, { align: "center" });
  });
  y += 26;

  // Readability
  if (results.readability) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text("Readability Metrics", MARGIN, y);
    y += 6;

    const readStats: [string, string][] = [];
    if (results.readability.fleschReadingEase != null) readStats.push(["Flesch Reading Ease", String(Math.round(results.readability.fleschReadingEase))]);
    if (results.readability.fleschGradeLevel != null) readStats.push(["Flesch Grade Level", String(Math.round(results.readability.fleschGradeLevel))]);
    if (results.readability.gunningFoxIndex != null) readStats.push(["Gunning Fog Index", String(Math.round(results.readability.gunningFoxIndex))]);
    if (results.readability.smogIndex != null) readStats.push(["SMOG Index", String(Math.round(results.readability.smogIndex))]);
    if (results.readability.avgReadingTime != null) readStats.push(["Avg Reading Time", `${results.readability.avgReadingTime}s`]);

    doc.setFontSize(8);
    readStats.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.setTextColor(GREY);
      doc.text(`${label}:`, MARGIN + 4, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(NAVY);
      doc.text(value, MARGIN + 60, y);
      y += 5;
    });
    y += 6;
  }

  // Sentence Heatmap
  if (results.ai?.blocks && results.ai.blocks.length > 0) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text("Sentence-Level AI Analysis", MARGIN, y);
    y += 6;

    // Table header
    doc.setFillColor(NAVY);
    doc.rect(MARGIN, y, CW, 7, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#FFFFFF");
    doc.text("#", MARGIN + 3, y + 5);
    doc.text("Sentence", MARGIN + 12, y + 5);
    doc.text("AI %", W - MARGIN - 22, y + 5);
    doc.text("Risk", W - MARGIN - 10, y + 5);
    y += 7;

    doc.setFontSize(6.5);
    results.ai.blocks.forEach((block, i) => {
      if (y > 270) {
        doc.addPage();
        doc.setFillColor(NAVY);
        doc.rect(0, 0, W, 8, "F");
        doc.setFillColor(TEAL);
        doc.rect(0, 8, W, 3, "F");
        y = 18;
      }

      const pct = Math.round(block.fake * 100);
      const risk = getRiskLabel(pct);
      const rowBg = i % 2 === 0 ? "#FFFFFF" : LIGHT;
      doc.setFillColor(rowBg);
      doc.rect(MARGIN, y, CW, 6, "F");

      doc.setFont("helvetica", "normal");
      doc.setTextColor(GREY);
      doc.text(String(i + 1), MARGIN + 3, y + 4);

      // Truncate long sentences
      const maxChars = 80;
      const truncated = block.text.length > maxChars ? block.text.slice(0, maxChars) + "…" : block.text;
      doc.setTextColor(NAVY);
      doc.text(truncated, MARGIN + 12, y + 4);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(pct > 59 ? "#E53935" : pct > 39 ? "#FF9800" : NAVY);
      doc.text(`${pct}%`, W - MARGIN - 22, y + 4);

      doc.setFontSize(5.5);
      doc.text(risk, W - MARGIN - 10, y + 4);
      doc.setFontSize(6.5);

      y += 6;
    });
    y += 6;
  }

  // Fact Check
  if (results.facts && results.facts.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = 18;
    }
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(NAVY);
    doc.text("Fact Check Results", MARGIN, y);
    y += 6;

    doc.setFontSize(7);
    results.facts.forEach((f, i) => {
      if (y > 275) {
        doc.addPage();
        y = 18;
      }
      doc.setFont("helvetica", "bold");
      doc.setTextColor(NAVY);
      doc.text(`Claim ${i + 1}: ${f.truthfulness} verified`, MARGIN + 4, y);
      y += 4;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(GREY);
      const lines = doc.splitTextToSize(f.explanation, CW - 8);
      doc.text(lines, MARGIN + 4, y);
      y += lines.length * 3.5 + 3;
    });
  }

  // Footer accent
  doc.setFillColor(TEAL);
  doc.rect(0, 294, W, 3, "F");

  // Bottom text on last page
  doc.setFontSize(6);
  doc.setTextColor(GREY);
  doc.text("Generated by Theorex AI Detector — Promoting Transparency Over Mere Detection", W / 2, 291, { align: "center" });

  // Download
  const dateStr = formatDateBD(meta.scanDate).replace(/\//g, "-");
  doc.save(`Theorex_Audit_Report_${dateStr}.pdf`);
}

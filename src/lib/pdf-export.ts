/**
 * Export PDF natif via jsPDF — texte réel, pas de capture d'écran.
 * Mise en page courrier administratif A4.
 */

import { type UserPreferences } from "@/types";

interface PdfDocumentData {
  content: string;
  prefs: UserPreferences | null;
  showHeader: boolean;
}

// A4 dimensions in mm
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_LEFT = 25;
const MARGIN_RIGHT = 25;
const MARGIN_TOP = 25;
const MARGIN_BOTTOM = 30;
const CONTENT_W = PAGE_W - MARGIN_LEFT - MARGIN_RIGHT;

export async function exportToPdf(
  data: PdfDocumentData,
  filename: string = "document.pdf"
): Promise<void> {
  const jspdfMod = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default;
  if (typeof JsPDF !== "function") throw new Error("jsPDF non disponible");

  const pdf = new JsPDF("p", "mm", "a4");
  let y = MARGIN_TOP;

  // ============================================================
  // HEADER — Logo + School info
  // ============================================================
  if (data.showHeader && data.prefs?.school_name) {
    const p = data.prefs;
    let logoEndX = MARGIN_LEFT;

    // Logo — convert to canvas PNG data URL for jsPDF compatibility
    if (p.school_logo_url) {
      try {
        const img = await loadImage(p.school_logo_url);
        const maxH = 18; // mm
        const maxW = 35; // mm
        const ratio = img.width / img.height;
        let w = maxH * ratio;
        let h = maxH;
        if (w > maxW) { w = maxW; h = w / ratio; }

        // Render image to canvas to get a clean PNG data URL
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const pngDataUrl = canvas.toDataURL("image/png");
          pdf.addImage(pngDataUrl, "PNG", MARGIN_LEFT, y, w, h);
          logoEndX = MARGIN_LEFT + w + 5;
        }
      } catch (e) {
        console.warn("[PDF] Logo failed to load:", e);
      }
    }

    // School text next to logo
    const textX = logoEndX;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(24, 24, 27);
    pdf.text(p.school_name, textX, y + 5);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(82, 82, 91);
    let infoY = y + 9;

    if (p.school_address) {
      const lines = p.school_address.split("\n");
      for (const line of lines) {
        pdf.text(line.trim(), textX, infoY);
        infoY += 3.5;
      }
    }
    if (p.school_phone || p.school_email) {
      pdf.setFontSize(8);
      pdf.setTextColor(113, 113, 122);
      pdf.text(
        [p.school_phone, p.school_email].filter(Boolean).join(" — "),
        textX, infoY
      );
      infoY += 3.5;
    }

    y = Math.max(y + 20, infoY + 2);

    // Separator line
    pdf.setDrawColor(161, 161, 170);
    pdf.setLineWidth(0.3);
    pdf.line(MARGIN_LEFT, y, PAGE_W - MARGIN_RIGHT, y);
    y += 10;
  }

  // ============================================================
  // BODY — Document content (markdown → plain text)
  // ============================================================
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.setTextColor(24, 24, 27);

  const bodyText = markdownToPlainText(data.content);
  const paragraphs = bodyText.split("\n\n").filter((p) => p.trim());

  for (const para of paragraphs) {
    const trimmed = para.trim();

    // Detect headings (lines starting with bold marker or "Objet :")
    const isHeading = trimmed.startsWith("__") || trimmed.toLowerCase().startsWith("objet");
    const cleanText = trimmed.replace(/__/g, "");

    if (isHeading) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
    } else {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
    }

    const lines = pdf.splitTextToSize(cleanText, CONTENT_W);

    // Check page break
    const blockHeight = lines.length * 5;
    if (y + blockHeight > PAGE_H - MARGIN_BOTTOM) {
      pdf.addPage();
      y = MARGIN_TOP;
    }

    for (const line of lines) {
      pdf.text(line, MARGIN_LEFT, y);
      y += 5;
    }

    y += 3; // paragraph spacing
  }

  // ============================================================
  // SIGNATURE — Closing formula + name + title + school
  // ============================================================
  if (data.prefs) {
    const p = data.prefs;
    const sigLines: string[] = [];

    if (p.closing_formula) sigLines.push(p.closing_formula);
    sigLines.push(""); // spacing
    if (p.first_name && p.last_name) sigLines.push(`__${p.first_name} ${p.last_name}__`);
    if (p.job_title) sigLines.push(p.job_title);
    if (p.school_name) sigLines.push(p.school_name);

    if (sigLines.some((l) => l.trim())) {
      y += 5;

      // Check page break
      if (y + sigLines.length * 5 + 10 > PAGE_H - MARGIN_BOTTOM) {
        pdf.addPage();
        y = MARGIN_TOP;
      }

      for (const line of sigLines) {
        if (!line.trim()) { y += 3; continue; }
        const isBold = line.startsWith("__") && line.endsWith("__");
        const clean = line.replace(/__/g, "");
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(isBold ? 24 : 82, isBold ? 24 : 82, isBold ? 27 : 91);
        pdf.text(clean, MARGIN_LEFT, y);
        y += 5;
      }
    }
  }

  // ============================================================
  // FOOTER — School info (centré, bas de dernière page)
  // ============================================================
  if (data.prefs?.school_name) {
    const p = data.prefs;
    const footerY = PAGE_H - 15;

    // Separator
    pdf.setDrawColor(212, 212, 216);
    pdf.setLineWidth(0.2);
    pdf.line(MARGIN_LEFT, footerY - 5, PAGE_W - MARGIN_RIGHT, footerY - 5);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(113, 113, 122);

    const footerParts: string[] = [p.school_name!];
    if (p.school_address) footerParts.push(p.school_address.replace(/\n/g, ", "));
    const contactParts = [p.school_phone, p.school_email, p.school_website].filter(Boolean);
    if (contactParts.length) footerParts.push(contactParts.join(" — "));

    let fY = footerY;
    for (const part of footerParts) {
      const tw = pdf.getTextWidth(part);
      pdf.text(part, (PAGE_W - tw) / 2, fY);
      fY += 3.5;
    }
  }

  pdf.save(filename);
}

// ============================================================
// HELPERS
// ============================================================

/** Convert markdown to clean plain text, preserving paragraph structure */
function markdownToPlainText(md: string): string {
  let text = md;

  // Remove markdown headers (## Title → __Title__)
  text = text.replace(/^#{1,3}\s+(.+)$/gm, "__$1__");

  // Bold: **text** or __text__ → __text__
  text = text.replace(/\*\*(.+?)\*\*/g, "__$1__");

  // Italic: *text* or _text_ → text
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "$1");
  text = text.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "$1");

  // Lists: - item or * item → • item
  text = text.replace(/^[\-\*]\s+/gm, "• ");

  // Numbered lists: 1. item → 1. item (keep as is)

  // Links: [text](url) → text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove horizontal rules
  text = text.replace(/^---+$/gm, "");

  // Clean up extra blank lines
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/** Load an image (data URL or URL) and return an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = src;
  });
}

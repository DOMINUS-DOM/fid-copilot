/**
 * Export PDF client-side via html2canvas + jsPDF.
 * Rendu professionnel type courrier A4 — supporte le multi-pages.
 */
export async function exportToPdf(
  elementId: string,
  filename: string = "document.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Élément introuvable");

  // Dynamic imports — handle both CJS and ESM export shapes
  const jspdfMod = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default;

  const h2cMod = await import("html2canvas");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html2canvas: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement> =
    (h2cMod as any).default || (h2cMod as any);

  if (typeof JsPDF !== "function") throw new Error("jsPDF non disponible");
  if (typeof html2canvas !== "function") throw new Error("html2canvas non disponible");

  // Apply export styles — force simple colors to avoid lab() parsing errors
  element.classList.add("pdf-export-mode");

  // Override any remaining lab()/oklch() inline styles that html2canvas can't parse
  const allEls = element.querySelectorAll("*");
  const overrides: Array<{ el: HTMLElement; prev: string }> = [];
  allEls.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const cs = getComputedStyle(htmlEl);
    // Check if any color property contains "lab(" or "oklch("
    const props = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor"];
    for (const prop of props) {
      const val = cs.getPropertyValue(prop);
      if (val && (val.includes("lab(") || val.includes("oklch(") || val.includes("lch("))) {
        overrides.push({ el: htmlEl, prev: htmlEl.style.cssText });
        if (prop === "color") htmlEl.style.color = "#171717";
        if (prop === "backgroundColor") htmlEl.style.backgroundColor = "transparent";
        if (prop.startsWith("border")) htmlEl.style.borderColor = "#d4d4d8";
        break;
      }
    }
  });

  await new Promise((r) => setTimeout(r, 250));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  } catch (err) {
    element.classList.remove("pdf-export-mode");
    overrides.forEach(({ el, prev }) => { el.style.cssText = prev; });
    throw err;
  }

  element.classList.remove("pdf-export-mode");
  // Restore original inline styles
  overrides.forEach(({ el, prev }) => { el.style.cssText = prev; });

  // Create PDF A4
  const pdf = new JsPDF("p", "mm", "a4");
  const pageW = pdf.internal.pageSize.getWidth();   // 210
  const pageH = pdf.internal.pageSize.getHeight();   // 297
  const mx = 18; // margin X
  const mt = 18; // margin top
  const mb = 18; // margin bottom
  const contentW = pageW - 2 * mx;
  const contentH = pageH - mt - mb;

  const imgW = canvas.width;
  const imgH = canvas.height;
  const ratio = contentW / imgW;
  const totalScaledH = imgH * ratio;

  // Convert canvas to JPEG once
  const fullImgData = canvas.toDataURL("image/jpeg", 0.92);

  if (totalScaledH <= contentH) {
    // ===== SINGLE PAGE =====
    pdf.addImage(fullImgData, "JPEG", mx, mt, contentW, totalScaledH);
  } else {
    // ===== MULTI-PAGE =====
    // How many pixels of source canvas fit on one PDF page
    const slicePx = Math.floor(contentH / ratio);
    const pages = Math.ceil(imgH / slicePx);

    for (let i = 0; i < pages; i++) {
      if (i > 0) pdf.addPage();

      const srcY = i * slicePx;
      const srcH = Math.min(slicePx, imgH - srcY);

      // Create a slice canvas
      const slice = document.createElement("canvas");
      slice.width = imgW;
      slice.height = srcH;
      const ctx = slice.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(canvas, 0, srcY, imgW, srcH, 0, 0, imgW, srcH);

      const sliceImg = slice.toDataURL("image/jpeg", 0.92);
      const sliceH = srcH * ratio;
      pdf.addImage(sliceImg, "JPEG", mx, mt, contentW, sliceH);
    }
  }

  pdf.save(filename);
}

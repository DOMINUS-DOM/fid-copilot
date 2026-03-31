/**
 * Export PDF client-side via html2canvas + jsPDF.
 * Force une largeur A4 fixe pour un rendu professionnel.
 */
export async function exportToPdf(
  elementId: string,
  filename: string = "document.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Élément introuvable");

  const jspdfMod = await import("jspdf");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JsPDF = (jspdfMod as any).jsPDF || (jspdfMod as any).default;
  const h2cMod = await import("html2canvas");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html2canvas: (el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLCanvasElement> =
    (h2cMod as any).default || (h2cMod as any);

  if (typeof JsPDF !== "function") throw new Error("jsPDF non disponible");
  if (typeof html2canvas !== "function") throw new Error("html2canvas non disponible");

  // ---- SAVE original styles ----
  const origStyle = element.style.cssText;
  const origParentOverflow = element.parentElement?.style.overflow ?? "";

  // ---- FORCE A4 layout ----
  // A4 = 210mm. At 96dpi, 210mm ≈ 794px. With 20mm margins each side (76px), content = 642px.
  // We set the element to exactly this width so text wraps correctly for A4.
  const A4_CONTENT_WIDTH = 642; // px — represents ~170mm of printable area
  const A4_PADDING = 76; // px — represents ~20mm margins

  element.classList.add("pdf-export-mode");
  element.style.cssText = `
    position: fixed !important;
    left: -9999px !important;
    top: 0 !important;
    width: ${A4_CONTENT_WIDTH}px !important;
    max-width: ${A4_CONTENT_WIDTH}px !important;
    padding: ${A4_PADDING}px !important;
    background: white !important;
    z-index: -1 !important;
  `;
  if (element.parentElement) {
    element.parentElement.style.overflow = "visible";
  }

  // Fix lab() colors
  const allEls = element.querySelectorAll("*");
  const overrides: Array<{ el: HTMLElement; prev: string }> = [];
  allEls.forEach((node) => {
    const el = node as HTMLElement;
    const cs = getComputedStyle(el);
    const colorProps = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderBottomColor", "borderLeftColor", "borderRightColor"];
    for (const prop of colorProps) {
      const val = cs.getPropertyValue(prop);
      if (val && (val.includes("lab(") || val.includes("oklch(") || val.includes("lch("))) {
        overrides.push({ el, prev: el.style.cssText });
        el.style.color = "#171717";
        el.style.backgroundColor = "transparent";
        el.style.borderColor = "#d4d4d8";
        break;
      }
    }
  });

  await new Promise((r) => setTimeout(r, 300));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: A4_CONTENT_WIDTH + 2 * A4_PADDING,
    });
  } finally {
    // ---- RESTORE everything ----
    element.classList.remove("pdf-export-mode");
    element.style.cssText = origStyle;
    if (element.parentElement) {
      element.parentElement.style.overflow = origParentOverflow;
    }
    overrides.forEach(({ el, prev }) => { el.style.cssText = prev; });
  }

  // ---- BUILD PDF ----
  const pdf = new JsPDF("p", "mm", "a4");
  const PAGE_W = 210; // mm
  const PAGE_H = 297;
  const MARGIN = 0; // margins are already baked into the canvas via padding

  const imgW = canvas.width;
  const imgH = canvas.height;
  const ratio = PAGE_W / imgW;
  const totalH = imgH * ratio;

  if (totalH <= PAGE_H) {
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    pdf.addImage(imgData, "JPEG", 0, 0, PAGE_W, totalH);
  } else {
    const slicePx = Math.floor(PAGE_H / ratio);
    const pages = Math.ceil(imgH / slicePx);

    for (let i = 0; i < pages; i++) {
      const srcY = i * slicePx;
      const srcH = Math.min(slicePx, imgH - srcY);

      // Skip near-empty slices (< 5% of a page)
      if (srcH < slicePx * 0.05) continue;

      if (i > 0) pdf.addPage();

      const slice = document.createElement("canvas");
      slice.width = imgW;
      slice.height = srcH;
      const ctx = slice.getContext("2d");
      if (!ctx) continue;
      ctx.drawImage(canvas, 0, srcY, imgW, srcH, 0, 0, imgW, srcH);

      const sliceImg = slice.toDataURL("image/jpeg", 0.92);
      pdf.addImage(sliceImg, "JPEG", 0, 0, PAGE_W, srcH * ratio);
    }
  }

  pdf.save(filename);
}

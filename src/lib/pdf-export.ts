/**
 * Export PDF client-side via html2canvas + jsPDF.
 * Rendu professionnel type courrier A4.
 */
export async function exportToPdf(
  elementId: string,
  filename: string = "document.pdf"
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Élément introuvable");

  // Dynamic imports to avoid SSR issues
  const html2canvasModule = await import("html2canvas");
  const html2canvas = html2canvasModule.default;

  const jspdfModule = await import("jspdf");
  const jsPDF = jspdfModule.jsPDF || jspdfModule.default;

  // Apply export styles for clean rendering
  element.classList.add("pdf-export-mode");

  // Wait for styles to apply + images to load
  await new Promise((r) => setTimeout(r, 200));

  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
    });
  } finally {
    element.classList.remove("pdf-export-mode");
  }

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const marginX = 18;
  const marginTop = 18;
  const contentWidth = pageWidth - 2 * marginX;
  const pageContentHeight = pageHeight - marginTop - 18;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = contentWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  if (scaledHeight <= pageContentHeight) {
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    pdf.addImage(imgData, "JPEG", marginX, marginTop, contentWidth, scaledHeight);
  } else {
    // Multi-page
    const sliceHeightPx = Math.floor(pageContentHeight / ratio);
    const totalPages = Math.ceil(imgHeight / sliceHeightPx);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();

      const yStart = i * sliceHeightPx;
      const thisSliceHeight = Math.min(sliceHeightPx, imgHeight - yStart);

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidth;
      sliceCanvas.height = thisSliceHeight;

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) continue;

      ctx.drawImage(canvas, 0, yStart, imgWidth, thisSliceHeight, 0, 0, imgWidth, thisSliceHeight);

      const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.95);
      const sliceScaledHeight = thisSliceHeight * ratio;
      pdf.addImage(sliceData, "JPEG", marginX, marginTop, contentWidth, sliceScaledHeight);
    }
  }

  pdf.save(filename);
}

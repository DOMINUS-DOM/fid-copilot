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
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  // Apply export styles for clean rendering
  element.classList.add("pdf-export-mode");

  // Wait a tick for styles to apply
  await new Promise((r) => setTimeout(r, 100));

  const canvas = await html2canvas(element, {
    scale: 2.5, // Higher resolution for sharp text
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    windowWidth: 794, // A4 width at 96 DPI (210mm)
  });

  element.classList.remove("pdf-export-mode");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
  const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm
  const marginX = 20; // 20mm left/right margins
  const marginTop = 20;
  const marginBottom = 20;
  const contentWidth = pageWidth - 2 * marginX;
  const pageContentHeight = pageHeight - marginTop - marginBottom;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = contentWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;

  if (scaledHeight <= pageContentHeight) {
    // Single page
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", marginX, marginTop, contentWidth, scaledHeight);
  } else {
    // Multi-page: slice canvas into page-sized chunks
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

      ctx.drawImage(
        canvas,
        0, yStart,
        imgWidth, thisSliceHeight,
        0, 0,
        imgWidth, thisSliceHeight
      );

      const sliceData = sliceCanvas.toDataURL("image/png");
      const sliceScaledHeight = thisSliceHeight * ratio;
      pdf.addImage(sliceData, "PNG", marginX, marginTop, contentWidth, sliceScaledHeight);
    }
  }

  pdf.save(filename);
}

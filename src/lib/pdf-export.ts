/**
 * Export PDF client-side via html2canvas + jsPDF.
 * Capture le contenu HTML tel qu'il est affiché, y compris header + contenu + signature.
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

  // Apply export styles
  element.classList.add("pdf-export-mode");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  element.classList.remove("pdf-export-mode");

  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = contentWidth / imgWidth;
  const scaledHeight = imgHeight * ratio;
  const pageContentHeight = pageHeight - 2 * margin;

  if (scaledHeight <= pageContentHeight) {
    // Single page
    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", margin, margin, contentWidth, scaledHeight);
  } else {
    // Multi-page: slice canvas into page-sized chunks
    const totalPages = Math.ceil(scaledHeight / pageContentHeight);
    const sliceHeight = Math.ceil(imgHeight / totalPages);

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = imgWidth;
      sliceCanvas.height = Math.min(sliceHeight, imgHeight - i * sliceHeight);

      const ctx = sliceCanvas.getContext("2d");
      if (!ctx) continue;

      ctx.drawImage(
        canvas,
        0, i * sliceHeight,
        imgWidth, sliceCanvas.height,
        0, 0,
        imgWidth, sliceCanvas.height
      );

      const sliceData = sliceCanvas.toDataURL("image/png");
      const sliceScaledHeight = sliceCanvas.height * ratio;
      pdf.addImage(sliceData, "PNG", margin, margin, contentWidth, sliceScaledHeight);
    }
  }

  pdf.save(filename);
}

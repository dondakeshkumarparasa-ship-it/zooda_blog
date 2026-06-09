// lib/pdfText.js (CommonJS) ✅ Node 22 compatible
let pdfjsLibPromise = null;

async function getPdfJs() {
  if (!pdfjsLibPromise) {
    // ✅ Works with modern pdfjs-dist versions (exports .mjs)
    pdfjsLibPromise = import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  return pdfjsLibPromise;
}

async function extractPdfText(buffer) {
  if (!buffer || !buffer.length) return "";

  const pdfjsLib = await getPdfJs();

  const data = new Uint8Array(buffer);

  const loadingTask = pdfjsLib.getDocument({
    data,
    disableWorker: true, // ✅ important for Node
  });

  const pdf = await loadingTask.promise;

  let full = "";
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((it) => (it && it.str ? it.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) full += pageText + "\n";
  }

  return full.trim();
}

module.exports = { extractPdfText };
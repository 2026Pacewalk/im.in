// Client helpers to export a DOM card node as a PNG or PDF (free, no backend).
import { toPng } from "html-to-image";

async function render(node: HTMLElement): Promise<string> {
  return toPng(node, { pixelRatio: 2.5, cacheBust: true });
}

export async function exportPng(node: HTMLElement, name: string) {
  const url = await render(node);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.png`;
  a.click();
}

export async function exportPdf(node: HTMLElement, name: string) {
  const url = await render(node);
  const img = new Image();
  img.src = url;
  await new Promise((res) => {
    img.onload = res;
  });
  const { jsPDF } = await import("jspdf");
  const w = img.width;
  const h = img.height;
  const pdf = new jsPDF({
    orientation: w > h ? "landscape" : "portrait",
    unit: "px",
    format: [w, h],
  });
  pdf.addImage(url, "PNG", 0, 0, w, h);
  pdf.save(`${name}.pdf`);
}

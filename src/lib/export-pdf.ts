import { profileFilename } from "@/data/profile";

const PAGE_W = 794;
const PAGE_H = 1123;

type CanvasShot = (
  element: HTMLElement,
  options: Record<string, unknown>,
) => Promise<HTMLCanvasElement>;

export async function downloadProfilePdf(pages: HTMLElement[], name: string): Promise<void> {
  if (pages.length === 0) throw new Error("Nothing to export yet.");
  await document.fonts.ready;

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  const shoot = html2canvas as CanvasShot;
  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
    compress: true,
  });

  for (let index = 0; index < pages.length; index += 1) {
    const canvas = await shoot(pages[index], {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f6f1e7",
      width: PAGE_W,
      height: PAGE_H,
      windowWidth: PAGE_W,
      scrollX: 0,
      scrollY: 0,
      logging: false,
    });
    const image = canvas.toDataURL("image/jpeg", 0.92);
    if (index > 0) pdf.addPage();
    pdf.addImage(image, "JPEG", 0, 0, 210, 297);
  }

  pdf.save(profileFilename(name));
}

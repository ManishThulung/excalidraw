import { RefObject } from "react";
import jsPDF from "jspdf";

export function exportAsPDF(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  pdf.save("drawing.pdf");
}

export function exportAsImage(canvasRef: RefObject<HTMLCanvasElement | null>) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  const ctx = tempCanvas.getContext("2d")!;

  // white bg
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

  // copy original canvas
  ctx.drawImage(canvas, 0, 0);

  const url = tempCanvas.toDataURL("image/png");

  const a = document.createElement("a");
  a.href = url;
  a.download = "drawing.png";
  a.click();
}

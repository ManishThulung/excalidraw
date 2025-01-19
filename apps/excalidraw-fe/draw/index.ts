type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      x: number;
      y: number;
      width: number;
      height: number;
    };

export const initDraw = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  let click = false;
  let startY = 0;
  let startX = 0;

  canvas.addEventListener("mousedown", (e) => {
    click = true;
    startX = e.clientX;
    startY = e.clientY;
    console.log(e.clientX);
    console.log(e.clientY);
  });
  canvas.addEventListener("mouseup", (e) => {
    click = false;
    console.log(e.clientX);
    console.log(e.clientY);
  });
  canvas.addEventListener("mousemove", (e) => {
    if (click) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.strokeRect(startX, startY, width, height);
    }
  });
};

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement) {}

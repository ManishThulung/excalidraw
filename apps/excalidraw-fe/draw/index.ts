import { Tools } from "@/components/Canvas";

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

export const initDraw = (canvas: HTMLCanvasElement, tool: Tools | null) => {
  const context = canvas.getContext("2d");

  if (!context || !tool) {
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
      switch (tool) {
        case "rect": {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.strokeRect(startX, startY, width, height);
          break;
        }
        case "circle": {
          context.clearRect(0, 0, canvas.width, canvas.height);
          const radius = Math.max(height, width) / 2;
          context.beginPath();
          context.arc(
            startX + radius,
            startY + radius,
            Math.abs(radius),
            0,
            2 * Math.PI
          );
          context.stroke();
          context.closePath();
          break;
        }

        case "arrow": {
          context.clearRect(0, 0, canvas.width, canvas.height);

          const startCoordinate = { x: startX, y: startY };
          const endCoordinate = { x: e.clientX, y: e.clientY };
          const headLength = 15;
          const PI = Math.PI;
          const degreesInRadians225 = (225 * PI) / 180;
          const degreesInRadians135 = (135 * PI) / 180;
          const dx = endCoordinate.x - startCoordinate.x;
          const dy = endCoordinate.y - startCoordinate.y;
          const angle = Math.atan2(dy, dx);
          const x225 =
            endCoordinate.x +
            headLength * Math.cos(angle + degreesInRadians225);
          const y225 =
            endCoordinate.y +
            headLength * Math.sin(angle + degreesInRadians225);
          const x135 =
            endCoordinate.x +
            headLength * Math.cos(angle + degreesInRadians135);
          const y135 =
            endCoordinate.y +
            headLength * Math.sin(angle + degreesInRadians135);

          context.beginPath();
          context.moveTo(startCoordinate.x, startCoordinate.y);
          context.lineTo(endCoordinate.x, endCoordinate.y);
          context.moveTo(endCoordinate.x, endCoordinate.y);
          context.lineTo(x225, y225);
          context.moveTo(endCoordinate.x, endCoordinate.y);
          context.lineTo(x135, y135);
          context.stroke();
          break;
        }

        default:
          break;
      }
    }
  });
};

function drawExistingShapes(existingShapes: Shape[], canvas: HTMLCanvasElement) {
  
}

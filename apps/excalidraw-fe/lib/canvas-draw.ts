import { ContentType } from "@/types";
import { Tools } from "@/types/enums";

type DrawType = Omit<ContentType, "type">;

export function drawRectangle(ctx: CanvasRenderingContext2D, data: DrawType) {
  ctx.beginPath();
  ctx.strokeRect(data.x, data.y, data.width, data.height);
  ctx.closePath();
}

export function drawCircle(ctx: CanvasRenderingContext2D, data: DrawType) {
  ctx.beginPath();
  ctx.ellipse(
    data.x + data.width / 2,
    data.y + data.height / 2,
    Math.abs(data.width / 2),
    Math.abs(data.height / 2),
    0,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
}

export function displayText(
  ctx: CanvasRenderingContext2D,
  data: DrawType,
  linehieght: number,
) {
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "black";

  if (!data.text) return;
  const lines = data.text.split("\n");

  lines.forEach((line: string, index: number) => {
    ctx.fillText(line, data.x, data.y + index * linehieght);
  });
}

export function drawArrow(ctx: CanvasRenderingContext2D, data: DrawType) {
  if (!data.points) return;
  const [p1, p2] = data?.points;

  const startX = data.x + p1.x;
  const startY = data.y + p1.y;
  const endX = data.x + p2.x;
  const endY = data.y + p2.y;

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  const angle = Math.atan2(endY - startY, endX - startX);
  const head = 10;

  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - head * Math.cos(angle - Math.PI / 6),
    endY - head * Math.sin(angle - Math.PI / 6),
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - head * Math.cos(angle + Math.PI / 6),
    endY - head * Math.sin(angle + Math.PI / 6),
  );
  ctx.stroke();
}

export function drawDiamond(ctx: CanvasRenderingContext2D, data: DrawType) {
  const { x, y, width, height } = data;

  const cx = x + width / 2;
  const cy = y + height / 2;

  ctx.beginPath();

  // top
  ctx.moveTo(cx, y);

  // right
  ctx.lineTo(x + width, cy);

  // bottom
  ctx.lineTo(cx, y + height);

  // left
  ctx.lineTo(x, cy);

  ctx.closePath();
  ctx.stroke();
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
export function isOnEdge(x: number, y: number, data: ContentType) {
  const threshold = 5;

  const left = Math.abs(x - data.x) < threshold;
  const right = Math.abs(x - (data.x + data.width)) < threshold;
  const top = Math.abs(y - data.y) < threshold;
  const bottom = Math.abs(y - (data.y + data.height)) < threshold;

  const withinX = x >= data.x && x <= data.x + data.width;
  const withinY = y >= data.y && y <= data.y + data.height;

  return (
    (left && withinY) ||
    (right && withinY) ||
    (top && withinX) ||
    (bottom && withinX)
  );
}

export function handleResize(
  data: ContentType,
  handle: string,
  pos: { x: number; y: number },
) {
  const oldX = data.x;
  const oldY = data.y;
  const oldW = data.width;
  const oldH = data.height;

  if (handle === "se") {
    data.width = pos.x - oldX;
    data.height = pos.y - oldY;
  }

  if (handle === "nw") {
    data.x = pos.x;
    data.y = pos.y;
    data.width = oldW + (oldX - pos.x);
    data.height = oldH + (oldY - pos.y);
  }

  if (handle === "ne") {
    data.y = pos.y;
    data.width = pos.x - oldX;
    data.height = oldH + (oldY - pos.y);
  }

  if (handle === "sw") {
    data.x = pos.x;
    data.width = oldW + (oldX - pos.x);
    data.height = pos.y - oldY;
  }

  //  Arrow scaling
  if (data.type === Tools.Arrow && data.points) {
    const scaleX = data.width / oldW || 1;
    const scaleY = data.height / oldH || 1;

    data.points = data.points.map((p: any) => ({
      x: p.x * scaleX,
      y: p.y * scaleY,
    }));
  }
  return data;
}

export function drawSelectionBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = "blue";
  ctx.strokeRect(x, y, w, h);
  ctx.setLineDash([]);

  const size = 10;

  const handles = [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ];

  handles.forEach(([hx, hy]) => {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "blue";
    ctx.fillRect(hx - size / 2, hy - size / 2, size, size);
    ctx.strokeRect(hx - size / 2, hy - size / 2, size, size);
  });
}

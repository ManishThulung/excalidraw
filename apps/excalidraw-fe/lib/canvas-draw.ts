export function drawRectangle(ctx: CanvasRenderingContext2D, data: any) {
  ctx.beginPath();
  ctx.strokeRect(data.x, data.y, data.width, data.height);
  ctx.closePath();
}

export function drawCircle(ctx: CanvasRenderingContext2D, data: any) {
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
  data: any,
  linehieght: number,
) {
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "black";

  const lines = data.text.split("\n");

  lines.forEach((line: string, index: number) => {
    ctx.fillText(line, data.x, data.y + index * linehieght);
  });
}

export function drawArrow(ctx: CanvasRenderingContext2D, data: any) {
  const [p1, p2] = data.points;

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

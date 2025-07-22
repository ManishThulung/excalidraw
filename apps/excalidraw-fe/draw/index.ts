import { Tools } from "@/components/Canvas";
import { getShapes } from "@/config/http-request";

async function getData(roomId: string) {
  const res = await getShapes(roomId);
  return res.shapes;
}

export const initDraw = async (
  canvas: HTMLCanvasElement,
  tool: Tools | null,
  roomId: string,
  socket: WebSocket
  // existingShapes: any,
  // setExistingShapes: any
) => {
  const context = canvas.getContext("2d");
  if (!context || !tool) return;

  const existingShapes = await getData(roomId);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    console.log(data, "data");
    if (data.isDraw) {
      existingShapes.push({
        type: data.type,
        userId: data.userId,
        content: JSON.stringify(data.data),
        roomId: data.roomId,
      });
      // setExistingShapes((prev) => [
      //   ...prev,

      //   {
      //     type: data.type,
      //     userId: data.userId,
      //     content: JSON.stringify(data.data),
      //     roomId: data.roomId,
      //   },
      // ]);
      drawExistingShapes(existingShapes, context);
    }
  };

  drawExistingShapes(existingShapes, context);

  let click = false;
  let startX = 0;
  let startY = 0;

  const mouseDownHandler = (e: MouseEvent) => {
    click = true;
    startX = e.clientX;
    startY = e.clientY;
  };

  const mouseUpHandler = (e: MouseEvent) => {
    click = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    let shape: any;
    if (tool === "Rect") {
      shape = { startX, startY, width, height };
    } else if (tool === "Circle") {
      const radius = Math.max(height, width) / 2;
      shape = {
        centerX: startX + radius,
        centerY: startY + radius,
        radius,
      };
    }

    if (shape) {
      startDraw(socket, roomId, shape, tool);
      existingShapes.push({
        type: tool,
        content: JSON.stringify(shape),
        roomId,
      });
    }
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!click) return;

    const width = e.clientX - startX;
    const height = e.clientY - startY;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawExistingShapes(existingShapes, context);

    switch (tool) {
      case "Rect":
        context.strokeRect(startX, startY, width, height);
        break;
      case "Circle":
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
      case "Arrow":
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
          endCoordinate.x + headLength * Math.cos(angle + degreesInRadians225);
        const y225 =
          endCoordinate.y + headLength * Math.sin(angle + degreesInRadians225);
        const x135 =
          endCoordinate.x + headLength * Math.cos(angle + degreesInRadians135);
        const y135 =
          endCoordinate.y + headLength * Math.sin(angle + degreesInRadians135);

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
  };

  // Add event listeners
  canvas.addEventListener("mousedown", mouseDownHandler);
  canvas.addEventListener("mouseup", mouseUpHandler);
  canvas.addEventListener("mousemove", mouseMoveHandler);

  // ✅ Cleanup
  // return () => {
  //   canvas.removeEventListener("mousedown", mouseDownHandler);
  //   canvas.removeEventListener("mouseup", mouseUpHandler);
  //   canvas.removeEventListener("mousemove", mouseMoveHandler);
  // };
};

async function drawExistingShapes(
  existingShapes: any,
  context: CanvasRenderingContext2D
) {
  existingShapes &&
    existingShapes?.map((shape: any) => {
      if (shape.type == "Rect") {
        const parsedData = JSON.parse(shape.content);
        context.strokeRect(
          parsedData?.startX,
          parsedData?.startY,
          parsedData?.width,
          parsedData?.height
        );
      }
      if (shape.type == "Circle") {
        const parsedData = JSON.parse(shape.content);
        context.beginPath();
        context.arc(
          parsedData.centerX,
          parsedData.centerY,
          Math.abs(parsedData.radius),
          0,
          2 * Math.PI
        );
        context.stroke();
        context.closePath();
      }
    });
}

function startDraw(
  socket: WebSocket,
  roomId: string,
  content: Record<string, string | number>,
  type: string
) {
  socket.send(
    JSON.stringify({
      type: "draw",
      room: roomId,
      content,
      toolType: type,
    })
  );
}

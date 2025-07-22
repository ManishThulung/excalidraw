"use client";

import { getShapes } from "@/config/http-request";
import { useEffect, useRef, useState } from "react";

export type Tools = "Rect" | "Circle" | "Arrow";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools | null>("Rect");
  const [existingShapes, setExistingShapes] = useState<any[]>([]);
  const existingShapesRef = useRef<any[]>([]);

  useEffect(() => {
    const fetchShapes = async () => {
      const data = await getShapes(roomId);
      setExistingShapes(data.shapes);
    };

    fetchShapes();
  }, [roomId]);
  console.log(existingShapes, "existingShapesexistingShapes");
  const handleClick = (type: Tools) => {
    setDrawType(type);
  };

  async function drawExistingShapes(
    existingShapes: any,
    context: CanvasRenderingContext2D
  ) {
    console.log(existingShapes, "existingShapes");
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    existingShapesRef.current = existingShapes;
    context.clearRect(0, 0, canvas.width, canvas.height); // Optional: clear before drawing
    drawExistingShapes(existingShapes, context);
  }, [existingShapes]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const context = canvas.getContext("2d");
      if (!context) return;

      socket.onmessage = (event) => {
        const data = event && JSON?.parse(event.data || "");

        if (data.isDraw) {
          setExistingShapes((prev) => [
            ...prev,
            {
              type: data.type,
              userId: data.userId,
              content: data.data,
              roomId: data.roomId,
            },
          ]);
        }
      };

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
        if (drawType === "Rect") {
          shape = { startX, startY, width, height };
        } else if (drawType === "Circle") {
          const radius = Math.max(height, width) / 2;
          shape = {
            centerX: startX + radius,
            centerY: startY + radius,
            radius,
          };
        }

        if (shape) {
          startDraw(socket, roomId, shape, "Rect");
        }
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        if (!click) return;

        const width = e.clientX - startX;
        const height = e.clientY - startY;

        context.clearRect(0, 0, canvas.width, canvas.height);
        // drawExistingShapes(existingShapes, context);
        drawExistingShapes(existingShapesRef.current, context);

        context.strokeRect(startX, startY, width, height);

        switch (drawType) {
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
      };

      // Add event listeners
      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("mousemove", mouseMoveHandler);

      // ✅ Cleanup
      return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
      };
    }
  }, [roomId, canvasRef]);

  return (
    <>
      <canvas ref={canvasRef} width={500} height={500} className="bg-red-400" />
      <div className="fixed bg-white shadow-lg border top-5 left-[40%] flex gap-4 px-6 py-2 rounded-md">
        <button className="text-black" onClick={() => handleClick("Rect")}>
          rectangle
        </button>
        <button className="text-black" onClick={() => handleClick("Circle")}>
          circle
        </button>
        <button className="text-black" onClick={() => handleClick("Arrow")}>
          arraow
        </button>
        {/* <button>rectangle</button> */}
      </div>
    </>
  );
};

export default Canvas;

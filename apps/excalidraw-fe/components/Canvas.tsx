"use client";

import { getShapes } from "@/config/http-request";
import { Tools } from "@/types/enums";
import { useEffect, useRef, useState } from "react";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools | null>(Tools.Rectangle);
  const [existingShapes, setExistingShapes] = useState<any[]>([]);
  const existingShapesRef = useRef<any[]>([]);
  const scaleRef = useRef(1);

  useEffect(() => {
    const fetchShapes = async () => {
      const data = await getShapes(roomId);
      setExistingShapes(data.shapes);
    };

    fetchShapes();
  }, [roomId]);

  const handleClick = (type: Tools) => {
    setDrawType(type);
  };

  async function drawExistingShapes(
    shapes: any,
    context: CanvasRenderingContext2D,
  ) {
    // context.setTransform(1, 0, 0, 1, 0, 0); // Resets the zoom level to default before drawing existing shapes
    shapes &&
      shapes?.map((shape: any) => {
        if (shape.type == Tools.Rectangle) {
          const parsedData = JSON.parse(shape.content);
          context.strokeRect(
            parsedData?.startX,
            parsedData?.startY,
            parsedData?.width,
            parsedData?.height,
          );
        }
        if (shape.type == Tools.Circle) {
          const parsedData = JSON.parse(shape.content);
          context.beginPath();
          context.arc(
            parsedData.centerX,
            parsedData.centerY,
            Math.abs(parsedData.radius),
            0,
            2 * Math.PI,
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
    type: string,
  ) {
    socket.send(
      JSON.stringify({
        type: "draw",
        room: roomId,
        content,
        toolType: type,
      }),
    );
  }
  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(scaleRef.current, scaleRef.current);

    drawExistingShapes(existingShapesRef.current, ctx);
  };

  useEffect(() => {
    existingShapesRef.current = existingShapes;
    redraw();
  }, [existingShapes]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.clearRect(0, 0, canvas.width, canvas.height);

      console.log(scaleRef, "initial scale ref");

      redraw();

      // listening to incoming events and drawing on canvas
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

      const getMousePos = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();

        return {
          x: (e.clientX - rect.left) / scaleRef.current,
          y: (e.clientY - rect.top) / scaleRef.current,
        };
      };

      const mouseDownHandler = (e: MouseEvent) => {
        click = true;

        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;
      };

      const mouseUpHandler = (e: MouseEvent) => {
        click = false;
        const pos = getMousePos(e);
        const width = pos.x - startX;
        const height = pos.y - startY;

        let shape: any;
        if (drawType === Tools.Rectangle) {
          shape = { startX, startY, width, height };
        } else if (drawType === Tools.Circle) {
          const radius = Math.max(height, width) / 2;
          shape = {
            centerX: startX + radius,
            centerY: startY + radius,
            radius,
          };
        }

        if (shape) {
          startDraw(socket, roomId, shape, drawType as string);
        }
        redraw(); // Redraw after drawing the new shape
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        if (!click) return;

        const pos = getMousePos(e);
        const width = pos.x - startX;
        const height = pos.y - startY;

        redraw();

        console.log(drawType, "choose type");
        switch (drawType) {
          case Tools.Rectangle:
            context.beginPath();
            context.strokeRect(startX, startY, width, height); // draws a rectangle outline
            context.closePath();

            break;
          case Tools.Circle:
            const radius = Math.max(height, width) / 2;
            context.beginPath();
            context.arc(
              startX + radius,
              startY + radius,
              Math.abs(radius),
              0,
              2 * Math.PI,
            );
            context.stroke();
            context.closePath();
            break;
          case Tools.Arrow:
            const headLength = 15;
            const angle = Math.atan2(pos.y - startY, pos.x - startX);

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(pos.x, pos.y);

            context.lineTo(
              pos.x - headLength * Math.cos(angle - Math.PI / 6),
              pos.y - headLength * Math.sin(angle - Math.PI / 6),
            );

            context.moveTo(pos.x, pos.y);

            context.lineTo(
              pos.x - headLength * Math.cos(angle + Math.PI / 6),
              pos.y - headLength * Math.sin(angle + Math.PI / 6),
            );

            context.stroke();
            break;
        }
      };

      const wheelHandler = (e: WheelEvent) => {
        e.preventDefault();

        const zoomIntensity = 0.1;

        const newScale =
          e.deltaY < 0
            ? Math.min(scaleRef.current + zoomIntensity, 5)
            : Math.max(scaleRef.current - zoomIntensity, 0.2);

        scaleRef.current = newScale;

        console.log({ scaleRef, newScale }, "scaleRefscaleRef");

        redraw();
      };

      // Add event listeners
      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("mousemove", mouseMoveHandler);
      canvas.addEventListener("wheel", wheelHandler, { passive: false });

      // ✅ Cleanup
      return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("wheel", wheelHandler);
      };
    }
  }, [roomId, drawType]);

  return (
    <>
      <canvas ref={canvasRef} width={500} height={500} className="bg-red-400" />
      <div className="fixed bg-white shadow-lg border top-5 left-[40%] flex gap-4 px-6 py-2 rounded-md">
        <button
          className="text-black"
          onClick={() => handleClick(Tools.Rectangle)}
        >
          rectangle
        </button>
        <button
          className="text-black"
          onClick={() => handleClick(Tools.Circle)}
        >
          circle
        </button>
        <button className="text-black" onClick={() => handleClick(Tools.Arrow)}>
          arrow
        </button>
      </div>
    </>
  );
};

export default Canvas;

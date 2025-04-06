"use client";

import { getShapes } from "@/config/http-request";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export type Tools = "Rect" | "Circle" | "Arrow";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools | null>(null);
  const [existingShapes, setExistingShapes] = useState(null);

  useEffect(() => {
    const fetchShapes = async () => {
      const data = await getShapes(roomId);
      setExistingShapes(data);
    };

    fetchShapes();
  }, [roomId]);

  const handleClick = (type: Tools) => {
    setDrawType(type);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cleanup = initDraw(
        canvas,
        drawType,
        roomId,
        socket,
        existingShapes
      );

      return () => {
        cleanup?.();
      };
    }
  }, [drawType, roomId, existingShapes]);

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

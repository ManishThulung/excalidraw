"use client";

import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";

export type Tools = "rect" | "circle" | "arrow";

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools | null>(null);

  const handleClick = (type: Tools) => {
    setDrawType(type);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initDraw(canvas, drawType);
    }
  }, [drawType]);

  return (
    <>
      <canvas ref={canvasRef} width={500} height={500} className="bg-red-400" />
      <div className="fixed bg-white shadow-lg border top-5 left-[40%] flex gap-4 px-6 py-2 rounded-md">
        <button onClick={() => handleClick("rect")}>rectangle</button>
        <button onClick={() => handleClick("circle")}>circle</button>
        <button onClick={() => handleClick("arrow")}>arraow</button>
        {/* <button>rectangle</button> */}
      </div>
    </>
  );
};

export default Canvas;

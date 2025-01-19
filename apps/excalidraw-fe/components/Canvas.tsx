"use client";

import { initDraw } from "@/draw";
import React, { useEffect, useRef, useState } from "react";

type ShapeType = "rect" | "circle" | "arrow";

const Canvas = ({ roomId }: { roomId: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<ShapeType | null>(null);

  const handleClick = (type: ShapeType) => {
    setDrawType(type);
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      initDraw(canvas);
    }
  }, []);
  return (
    <div className="relative">
      <canvas ref={canvasRef} width={500} height={500} className="bg-red-400" />
      <div className="absolute bg-blue-800 top-2 left-10 flex gap-4">
        <button onClick={() => handleClick("rect")}>rectangle</button>
        <button onClick={() => handleClick("circle")}>circle</button>
        <button onClick={() => handleClick("arrow")}>arraow</button>
        {/* <button>rectangle</button> */}
      </div>
    </div>
  );
};

export default Canvas;

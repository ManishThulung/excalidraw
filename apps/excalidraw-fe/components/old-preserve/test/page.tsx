"use client";

import React, { useRef, useEffect, useState } from "react";

const ZoomableCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear canvas and apply transformations
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.translate(origin.x, origin.y);
    ctx.scale(scale, scale);

    // Draw content
    draw(ctx);
  }, [scale, origin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDragging = false;
    let lastX = 0,
      lastY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.offsetX - lastX;
      const dy = e.offsetY - lastY;
      setOrigin((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastX = e.offsetX;
      lastY = e.offsetY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      zoom(delta);
    };

    canvas.addEventListener("wheel", handleWheel);
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, []);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, 100, 100); // sample shape
    ctx.fillStyle = "black";
    ctx.fillText(`Zoom: ${scale.toFixed(2)}`, 10, 120);
  };

  const zoom = (delta: number) => {
    setScale((prev) => {
      const newScale = Math.min(Math.max(prev + delta, 0.1), 10); // clamp zoom
      return newScale;
    });
  };

  return (
    <div>
      <div className="controls">
        <button onClick={() => zoom(0.1)}>Zoom In</button>
        <button onClick={() => zoom(-0.1)}>Zoom Out</button>
      </div>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default ZoomableCanvas;

"use client";

import type React from "react";

import { useDrawing } from "@/contexts/drawing-context";
import { useRef, useEffect, useState, useCallback } from "react";
import type { DrawingObject, Point } from "@/contexts/drawing-context-copy";

export function Canvas({
  socket,
  roomId,
}: {
  socket: WebSocket;
  roomId: string;
}) {
  const { state, dispatch } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Point>({ x: 0, y: 0 });
  const [textInputValue, setTextInputValue] = useState("");

  console.log(state, "statestate");

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Focus text input when text editing starts
  useEffect(() => {
    if (state.isEditingText && textInputRef.current) {
      const existingText = state.editingTextId
        ? state.objects.find((obj) => obj.id === state.editingTextId)?.text ||
          ""
        : "";
      setTextInputValue(existingText);

      // Use requestAnimationFrame to ensure the input is rendered before focusing
      requestAnimationFrame(() => {
        if (textInputRef.current && state.isEditingText) {
          textInputRef.current.focus();
          if (existingText) {
            textInputRef.current.select();
          }
        }
      });
    }
  }, [state.isEditingText, state.editingTextId, state.objects]);

  // Transform screen coordinates to canvas coordinates
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      return {
        x: (screenX - rect.left - state.panX) / state.scale,
        y: (screenY - rect.top - state.panY) / state.scale,
      };
    },
    [state.panX, state.panY, state.scale]
  );

  // Transform canvas coordinates to screen coordinates
  const canvasToScreen = useCallback(
    (canvasX: number, canvasY: number): Point => {
      return {
        x: canvasX * state.scale + state.panX,
        y: canvasY * state.scale + state.panY,
      };
    },
    [state.panX, state.panY, state.scale]
  );

  // Check if point is inside object
  const isPointInObject = useCallback(
    (point: Point, obj: DrawingObject): boolean => {
      switch (obj.type) {
        case "rectangle":
          return (
            point.x >= obj.x &&
            point.x <= obj.x + (obj.width || 0) &&
            point.y >= obj.y &&
            point.y <= obj.y + (obj.height || 0)
          );
        case "circle":
          const radius = (obj.width || 0) / 2;
          const distance = Math.sqrt(
            Math.pow(point.x - obj.x, 2) + Math.pow(point.y - obj.y, 2)
          );
          return distance <= radius;
        case "line":
        case "arrow":
          if (!obj.points || obj.points.length < 2) return false;
          // Simple line hit detection - check if point is close to line
          const p1 = obj.points[0];
          const p2 = obj.points[1];
          const lineLength = Math.sqrt(
            Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
          );
          if (lineLength === 0) return false;
          const distanceToLine =
            Math.abs(
              (p2.y - p1.y) * point.x -
                (p2.x - p1.x) * point.y +
                p2.x * p1.y -
                p2.y * p1.x
            ) / lineLength;
          return distanceToLine < 5; // 5 pixel tolerance
        case "pencil":
          if (!obj.points || obj.points.length === 0) return false;
          // Check if point is close to any segment of the pencil path
          for (let i = 0; i < obj.points.length - 1; i++) {
            const p1 = obj.points[i];
            const p2 = obj.points[i + 1];
            const distance = Math.sqrt(
              Math.pow(point.x - p1.x, 2) + Math.pow(point.y - p1.y, 2)
            );
            if (distance < 10) return true; // 10 pixel tolerance for pencil
          }
          return false;
        case "text":
          const canvas = canvasRef.current;
          if (!canvas) return false;
          const ctx = canvas.getContext("2d");
          if (!ctx) return false;
          ctx.font = `${obj.fontSize || 16}px Arial`;
          const textWidth = ctx.measureText(obj.text || "").width;
          const textHeight = obj.fontSize || 16;
          return (
            point.x >= obj.x &&
            point.x <= obj.x + textWidth &&
            point.y >= obj.y - textHeight &&
            point.y <= obj.y
          );
        default:
          return false;
      }
    },
    []
  );

  // Check if point is on resize handle
  const getResizeHandle = useCallback(
    (point: Point, obj: DrawingObject): string | null => {
      if (obj.type !== "rectangle" && obj.type !== "circle") return null;

      const handleSize = 8 / state.scale;
      const x = obj.x;
      const y = obj.y;
      const w = obj.width || 0;
      const h = obj.height || 0;

      // Check corners and edges
      const handles = [
        { name: "nw", x: x - handleSize / 2, y: y - handleSize / 2 },
        { name: "ne", x: x + w - handleSize / 2, y: y - handleSize / 2 },
        { name: "sw", x: x - handleSize / 2, y: y + h - handleSize / 2 },
        { name: "se", x: x + w - handleSize / 2, y: y + h - handleSize / 2 },
      ];

      for (const handle of handles) {
        if (
          point.x >= handle.x &&
          point.x <= handle.x + handleSize &&
          point.y >= handle.y &&
          point.y <= handle.y + handleSize
        ) {
          return handle.name;
        }
      }

      return null;
    },
    [state.scale]
  );

  // Draw functions
  const drawObject = useCallback(
    (ctx: CanvasRenderingContext2D, obj: DrawingObject, isPreview = false) => {
      ctx.save();
      ctx.strokeStyle = obj.stroke;
      ctx.fillStyle = obj.fill === "transparent" ? "rgba(0,0,0,0)" : obj.fill;
      ctx.lineWidth = obj.strokeWidth;

      if (isPreview) {
        ctx.globalAlpha = 0.7;
        ctx.setLineDash([5, 5]);
      }

      switch (obj.type) {
        case "rectangle":
          if (obj.fill !== "transparent") {
            ctx.fillRect(obj.x, obj.y, obj.width || 0, obj.height || 0);
          }
          ctx.strokeRect(obj.x, obj.y, obj.width || 0, obj.height || 0);
          break;

        case "circle":
          const radius = (obj.width || 0) / 2;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, radius, 0, 2 * Math.PI);
          if (obj.fill !== "transparent") {
            ctx.fill();
          }
          ctx.stroke();
          break;

        case "line":
          if (obj.points && obj.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(obj.points[0].x, obj.points[0].y);
            ctx.lineTo(obj.points[1].x, obj.points[1].y);
            ctx.stroke();
          }
          break;

        case "arrow":
          if (obj.points && obj.points.length >= 2) {
            const start = obj.points[0];
            const end = obj.points[1];
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const arrowLength = 10;

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - Math.PI / 6),
              end.y - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + Math.PI / 6),
              end.y - arrowLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.stroke();
          }
          break;

        case "pencil":
          if (obj.points && obj.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(obj.points[0].x, obj.points[0].y);
            for (let i = 1; i < obj.points.length; i++) {
              ctx.lineTo(obj.points[i].x, obj.points[i].y);
            }
            ctx.stroke();
          }
          break;

        case "text":
          // Don't draw text if it's currently being edited
          if (state.isEditingText && state.editingTextId === obj.id) {
            break;
          }
          ctx.font = `${obj.fontSize || 16}px Arial`;
          ctx.fillStyle = obj.stroke;
          ctx.fillText(obj.text || "", obj.x, obj.y + (obj.fontSize || 16));
          break;
      }

      ctx.restore();
    },
    [state.isEditingText, state.editingTextId]
  );

  // Draw selection handles for text objects
  const drawTextSelectionHandles = useCallback(
    (ctx: CanvasRenderingContext2D, obj: DrawingObject) => {
      if (obj.type !== "text") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Measure text to get bounds
      ctx.font = `${obj.fontSize || 16}px Arial`;
      const textWidth = ctx.measureText(obj.text || "").width;
      const textHeight = obj.fontSize || 16;

      const handleSize = 6 / state.scale;
      const x = obj.x;
      const y = obj.y - textHeight;
      const w = textWidth;
      const h = textHeight;

      ctx.save();
      ctx.fillStyle = "#007bff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1 / state.scale;

      // Draw corner handles for text
      const handles = [
        { x: x - handleSize / 2, y: y - handleSize / 2 },
        { x: x + w - handleSize / 2, y: y - handleSize / 2 },
        { x: x - handleSize / 2, y: y + h - handleSize / 2 },
        { x: x + w - handleSize / 2, y: y + h - handleSize / 2 },
      ];

      handles.forEach((handle) => {
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
      });

      ctx.restore();
    },
    [state.scale]
  );

  // Draw selection handles
  const drawSelectionHandles = useCallback(
    (ctx: CanvasRenderingContext2D, obj: DrawingObject) => {
      if (obj.type === "text") {
        drawTextSelectionHandles(ctx, obj);
        return;
      }

      if (obj.type !== "rectangle" && obj.type !== "circle") return;

      const handleSize = 8 / state.scale;
      const x = obj.x;
      const y = obj.y;
      const w = obj.width || 0;
      const h = obj.height || 0;

      ctx.save();
      ctx.fillStyle = "#007bff";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1 / state.scale;

      // Draw corner handles
      const handles = [
        { x: x - handleSize / 2, y: y - handleSize / 2 },
        { x: x + w - handleSize / 2, y: y - handleSize / 2 },
        { x: x - handleSize / 2, y: y + h - handleSize / 2 },
        { x: x + w - handleSize / 2, y: y + h - handleSize / 2 },
      ];

      handles.forEach((handle) => {
        ctx.fillRect(handle.x, handle.y, handleSize, handleSize);
        ctx.strokeRect(handle.x, handle.y, handleSize, handleSize);
      });

      ctx.restore();
    },
    [state.scale, drawTextSelectionHandles]
  );

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply transform
    ctx.save();
    ctx.translate(state.panX, state.panY);
    ctx.scale(state.scale, state.scale);

    // Draw all objects
    state.objects.forEach((obj) => {
      drawObject(ctx, obj);

      // Draw selection outline and handles
      if (state.selectedIds.includes(obj.id)) {
        ctx.save();
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2 / state.scale;
        ctx.setLineDash([5 / state.scale, 5 / state.scale]);

        switch (obj.type) {
          case "rectangle":
            ctx.strokeRect(
              obj.x - 2,
              obj.y - 2,
              (obj.width || 0) + 4,
              (obj.height || 0) + 4
            );
            break;
          case "circle":
            const radius = (obj.width || 0) / 2;
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, radius + 2, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case "text":
            const textWidth = ctx.measureText(obj.text || "").width;
            const textHeight = obj.fontSize || 16;
            ctx.strokeRect(
              obj.x - 2,
              obj.y - textHeight - 2,
              textWidth + 4,
              textHeight + 4
            );
            break;
          case "line":
          case "arrow":
            // Draw selection outline for lines/arrows
            if (obj.points && obj.points.length >= 2) {
              ctx.beginPath();
              ctx.moveTo(obj.points[0].x, obj.points[0].y);
              ctx.lineTo(obj.points[1].x, obj.points[1].y);
              ctx.stroke();
            }
            break;
          case "pencil":
            // Draw selection outline for pencil paths
            if (obj.points && obj.points.length > 1) {
              ctx.beginPath();
              ctx.moveTo(obj.points[0].x, obj.points[0].y);
              for (let i = 1; i < obj.points.length; i++) {
                ctx.lineTo(obj.points[i].x, obj.points[i].y);
              }
              ctx.stroke();
            }
            break;
        }

        ctx.restore();

        // Draw resize handles
        drawSelectionHandles(ctx, obj);
      }
    });

    // Draw preview shape while creating
    if (state.previewShape) {
      drawObject(ctx, state.previewShape, true);
    }

    // Draw current path while drawing
    if (state.isDrawing && state.currentPath.length > 1) {
      ctx.save();
      ctx.strokeStyle = state.strokeColor;
      ctx.lineWidth = state.strokeWidth;
      ctx.beginPath();
      ctx.moveTo(state.currentPath[0].x, state.currentPath[0].y);
      for (let i = 1; i < state.currentPath.length; i++) {
        ctx.lineTo(state.currentPath[i].x, state.currentPath[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [state, drawObject, drawSelectionHandles]);

  // Handle text input events
  const handleTextInputKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    // Prevent event from bubbling to document
    e.stopPropagation();

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      finishTextEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      dispatch({ type: "CANCEL_TEXT_EDITING" });
    }
  };

  const finishTextEditing = () => {
    if (textInputValue.trim()) {
      dispatch({ type: "FINISH_TEXT_EDITING", text: textInputValue });
      dispatch({ type: "SAVE_TO_HISTORY" });
    } else {
      dispatch({ type: "CANCEL_TEXT_EDITING" });
    }
  };

  // Handle clicks outside the text input
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    // If we're editing text and clicking outside the text input, finish editing
    if (
      state.isEditingText &&
      textInputRef.current &&
      !textInputRef.current.contains(e.target as Node)
    ) {
      finishTextEditing();
      return;
    }

    // Continue with normal canvas mouse handling
    handleCanvasMouseDown(e);
  };

  // Separate canvas mouse down handler
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    const point = screenToCanvas(e.clientX, e.clientY);

    if (state.tool === "hand") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - state.panX, y: e.clientY - state.panY });
      return;
    }

    if (state.tool === "select") {
      // Check for resize handles first
      const selectedObject = state.objects.find((obj) =>
        state.selectedIds.includes(obj.id)
      );
      if (selectedObject) {
        const handle = getResizeHandle(point, selectedObject);
        if (handle) {
          dispatch({
            type: "START_DRAG",
            mode: "resize",
            point,
            offset: { x: 0, y: 0 },
          });
          return;
        }
      }

      // Check if clicking on an object
      const clickedObject = state.objects
        .slice()
        .reverse()
        .find((obj) => isPointInObject(point, obj));

      if (clickedObject) {
        // Double-click on text to edit
        if (clickedObject.type === "text" && e.detail === 2) {
          dispatch({
            type: "START_TEXT_EDITING",
            point: { x: clickedObject.x, y: clickedObject.y },
            textId: clickedObject.id,
          });
          return;
        }

        if (e.ctrlKey || e.metaKey) {
          const newSelection = state.selectedIds.includes(clickedObject.id)
            ? state.selectedIds.filter((id) => id !== clickedObject.id)
            : [...state.selectedIds, clickedObject.id];
          dispatch({ type: "SELECT_MULTIPLE", ids: newSelection });
        } else {
          dispatch({ type: "SELECT_OBJECT", id: clickedObject.id });
        }

        // Start drag for moving - calculate proper offset for text objects
        let dragOffset = {
          x: point.x - clickedObject.x,
          y: point.y - clickedObject.y,
        };

        // For text objects, adjust the offset to account for text baseline
        if (clickedObject.type === "text") {
          dragOffset = {
            x: point.x - clickedObject.x,
            y: point.y - (clickedObject.y - (clickedObject.fontSize || 16)),
          };
        }

        dispatch({
          type: "START_DRAG",
          mode: "move",
          point,
          offset: dragOffset,
        });
      } else {
        dispatch({ type: "CLEAR_SELECTION" });
      }
      return;
    }

    if (state.tool === "eraser") {
      const objectToErase = state.objects
        .slice()
        .reverse()
        .find((obj) => isPointInObject(point, obj));

      if (objectToErase) {
        dispatch({ type: "DELETE_OBJECT", id: objectToErase.id });
        dispatch({ type: "SAVE_TO_HISTORY" });
      }
      return;
    }

    if (state.tool === "pencil") {
      dispatch({ type: "START_DRAWING", point });
      return;
    }

    if (state.tool === "text") {
      // Start new text editing
      dispatch({ type: "START_TEXT_EDITING", point });
      return;
    }

    if (["rectangle", "circle", "line", "arrow"].includes(state.tool)) {
      dispatch({ type: "START_SHAPE_CREATION", point, shapeType: state.tool });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const point = screenToCanvas(e.clientX, e.clientY);

    if (isDragging && state.tool === "hand") {
      dispatch({
        type: "SET_PAN",
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    if (state.dragMode !== "none") {
      dispatch({ type: "UPDATE_DRAG", point });
      return;
    }

    if (state.isDrawing && state.tool === "pencil") {
      dispatch({ type: "CONTINUE_DRAWING", point });
      return;
    }

    if (state.isCreatingShape) {
      dispatch({ type: "UPDATE_SHAPE_PREVIEW", point });
      return;
    }

    // Update cursor based on hover state
    const canvas = canvasRef.current;
    if (canvas && state.tool === "select") {
      const selectedObject = state.objects.find((obj) =>
        state.selectedIds.includes(obj.id)
      );
      if (selectedObject && getResizeHandle(point, selectedObject)) {
        canvas.style.cursor = "nw-resize";
      } else if (state.objects.some((obj) => isPointInObject(point, obj))) {
        canvas.style.cursor = "move";
      } else {
        canvas.style.cursor = "default";
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (state.dragMode !== "none") {
      dispatch({ type: "FINISH_DRAG" });
      dispatch({ type: "SAVE_TO_HISTORY" });
      return;
    }

    if (state.isDrawing && state.tool === "pencil") {
      dispatch({ type: "FINISH_DRAWING" });
      dispatch({ type: "SAVE_TO_HISTORY" });
      return;
    }

    if (state.isCreatingShape) {
      dispatch({ type: "FINISH_SHAPE_CREATION" });
      dispatch({ type: "SAVE_TO_HISTORY" });
      return;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = state.scale * scaleFactor;

    // Zoom towards mouse position
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - state.panX) * scaleFactor;
      const newPanY = mouseY - (mouseY - state.panY) * scaleFactor;

      dispatch({ type: "SET_SCALE", scale: newScale });
      dispatch({ type: "SET_PAN", x: newPanX, y: newPanY });
    }
  };

  // Calculate text input position and style
  const getTextInputStyle = (): React.CSSProperties => {
    if (!state.textInputPosition) return { display: "none" };

    const screenPos = canvasToScreen(
      state.textInputPosition.x,
      state.textInputPosition.y
    );
    const fontSize = Math.max(14, state.fontSize * state.scale);

    return {
      position: "absolute",
      left: `${screenPos.x}px`,
      top: `${screenPos.y - fontSize}px`,
      fontSize: `${fontSize}px`,
      color: state.strokeColor,
      border: "2px solid #007bff",
      background: "white",
      padding: "4px 8px",
      outline: "none",
      fontFamily: "Arial, sans-serif",
      minWidth: "100px",
      minHeight: `${fontSize + 8}px`,
      zIndex: 1000,
      borderRadius: "4px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      resize: "none",
      overflow: "hidden",
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onMouseDown={handleContainerMouseDown}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="cursor-crosshair bg-white"
        style={{
          cursor:
            state.tool === "hand"
              ? "grab"
              : state.tool === "select"
                ? "default"
                : state.tool === "eraser"
                  ? "crosshair"
                  : "crosshair",
        }}
      />

      {/* Text input overlay */}
      {state.isEditingText && state.textInputPosition && (
        <textarea
          ref={textInputRef}
          value={textInputValue}
          onChange={(e) => setTextInputValue(e.target.value)}
          onKeyDown={handleTextInputKeyDown}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={getTextInputStyle()}
          placeholder="Type your text..."
          rows={1}
          autoFocus
        />
      )}
    </div>
  );
}

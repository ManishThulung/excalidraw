"use client";

import { getShapes } from "@/config/http-request";
import {
  displayText,
  drawArrow,
  drawCircle,
  drawRectangle,
  handleResize,
  isOnEdge,
} from "@/lib/canvas-draw";
import { cn } from "@/lib/utils";
import { ContentType } from "@/types";
import { Tools } from "@/types/enums";
import {
  Circle,
  MousePointer,
  MoveDownRight,
  Square,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatSheet } from "./chat/ChatSheet";

type ShapeType = {
  content: any;
  type: Tools;
  roomId: number;
  userId: number;
  id: string;
};

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools>(Tools.Select);
  const [existingShapes, setExistingShapes] = useState<ShapeType[]>([]);
  const [cursor, setCursor] = useState("default");
  const existingShapesRef = useRef<ShapeType[]>([]);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });

  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });
  const spacePressed = { current: false }; // Ref to track spacebar + mouse drag for panning

  const selectedShapeRef = useRef<number | null>(null);
  const isDraggingShapeRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const selectedShapesRef = useRef<Set<number>>(new Set()); // Ref to track multiple selected shapes
  const resizeHandleRef = useRef<string | null>(null); // track which shape is being used for resizing

  const [textEditor, setTextEditor] = useState<{
    x: number;
    y: number;
    shapeIndex?: number;
  } | null>(null);

  const [textValue, setTextValue] = useState("");

  const LINEHEIGHT = 18;

  function getClickedShape(x: number, y: number) {
    for (let i = existingShapesRef.current.length - 1; i >= 0; i--) {
      const s = existingShapesRef.current[i];

      const data = JSON.parse(s.content);
      if (
        x >= data.x &&
        x <= data.x + data.width &&
        y >= data.y &&
        y <= data.y + data.height
      ) {
        return i;
      }
    }
    return null;
  }

  function drawSelectionBox(
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

  function getResizeHandle(x: number, y: number) {
    if (selectedShapeRef.current === null) return null;

    const shape = existingShapesRef.current[selectedShapeRef.current];
    const data = JSON.parse(shape.content);

    const size = 12;

    const handles = [
      { name: "nw", x: data.x, y: data.y },
      { name: "ne", x: data.x + data.width, y: data.y },
      { name: "sw", x: data.x, y: data.y + data.height },
      { name: "se", x: data.x + data.width, y: data.y + data.height },
    ];

    for (const h of handles) {
      if (Math.abs(x - h.x) < size && Math.abs(y - h.y) < size) {
        return h.name;
      }
    }

    return null;
  }

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
    ctx: CanvasRenderingContext2D,
  ) {
    shapes &&
      shapes?.map((shape: any, i: number) => {
        const data = JSON.parse(shape.content);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";

        if (data.type === Tools.Rectangle) {
          drawRectangle(ctx, data);
        }

        if (data.type === Tools.Circle) {
          drawCircle(ctx, data);
        }

        if (data.type === Tools.Text) {
          displayText(ctx, data, LINEHEIGHT);
        }

        if (data.type === Tools.Arrow && data.points) {
          drawArrow(ctx, data);
        }

        // SELECTION
        if (selectedShapesRef.current.has(i)) {
          if (data.type === Tools.Text) {
            const lines = data.text.split("\n");
            drawSelectionBox(
              ctx,
              data.x,
              data.y - 16,
              data.width,
              lines.length * LINEHEIGHT,
            );
          } else {
            drawSelectionBox(ctx, data.x, data.y, data.width, data.height);
          }
        }
      });
  }

  function drawEvent(
    socket: WebSocket,
    roomId: string,
    content: ContentType,
    toolType: Tools,
    id?: string,
  ) {
    console.log(`socket ${toolType} toolType send.`);
    socket.send(
      JSON.stringify({
        id: id ?? crypto.randomUUID(),
        action: id ? "update" : "draw",
        room: roomId,
        content,
        type: toolType,
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

    ctx.translate(offsetRef.current.x, offsetRef.current.y);
    ctx.scale(scaleRef.current, scaleRef.current);

    drawExistingShapes(existingShapesRef.current, ctx);
  };

  function saveText() {
    if (!textEditor) return;

    if (!textValue.trim()) {
      setTextEditor(null);
      return;
    }

    // editing existing text
    if (textEditor.shapeIndex !== undefined) {
      const shapes = existingShapesRef.current;

      const shape = shapes[textEditor.shapeIndex];
      const data = JSON.parse(shape.content);

      data.text = textValue;

      shape.content = JSON.stringify(data);

      redraw();
    } else {
      // creating new text
      drawEvent(
        socket,
        roomId,
        {
          type: Tools.Text,
          x: textEditor.x,
          y: textEditor.y,
          text: textValue,
          width: textValue.length * 10,
          height: 20,
        },
        Tools.Text,
      );
    }

    setTextEditor(null);
    setTextValue("");
  }

  function getMousePos(e: MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();

    return {
      x: (e.clientX - rect.left - offsetRef.current.x) / scaleRef.current,
      y: (e.clientY - rect.top - offsetRef.current.y) / scaleRef.current,
    };
  }

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

      redraw();

      // listening to incoming events and drawing on canvas
      socket.onmessage = (event) => {
        const data = event && JSON?.parse(event.data || "");
        console.log(data, "data socket event");

        const newShape = {
          id: data.id,
          type: data.type,
          userId: data.userId,
          content: data.content,
          roomId: data.roomId,
        };

        if (data.action === "draw") {
          setExistingShapes((prev) => [...prev, newShape]);
        }

        if (data.action === "update") {
          setExistingShapes((prev) =>
            prev.map((shape) => (shape.id === data.id ? newShape : shape)),
          );
        }
      };

      let click = false;
      let startX = 0;
      let startY = 0;

      const mouseDownHandler = (e: MouseEvent) => {
        if (spacePressed.current) {
          isPanningRef.current = true;
          panStartRef.current = { x: e.clientX, y: e.clientY };
          return;
        }
        click = true;

        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;

        // selecting the shape
        if (drawType === Tools.Select) {
          const shapeIndex = getClickedShape(pos.x, pos.y);
          if (shapeIndex !== null) {
            selectedShapeRef.current = shapeIndex;

            const handle = getResizeHandle(pos.x, pos.y);

            //  FIRST: check resize
            if (handle) {
              resizeHandleRef.current = handle;
              isDraggingShapeRef.current = false; // important
              return;
            }

            // if shift key is pressed, add the shape to the selection, otherwise select only the clicked shape
            if (e.shiftKey) {
              selectedShapesRef.current.add(shapeIndex);
            } else {
              selectedShapesRef.current.clear();
              selectedShapesRef.current.add(shapeIndex);
            } //

            isDraggingShapeRef.current = true;
            dragStartRef.current = pos;

            return;
          }
        }

        // text
        if (drawType === Tools.Text) {
          setTextEditor({
            x: pos.x,
            y: pos.y,
          });
          setTextValue("");
          e.stopPropagation();
          e.preventDefault();
          return;
        }
      };

      const mouseUpHandler = (e: MouseEvent) => {
        const pos = getMousePos(e);

        if (isPanningRef.current) {
          isPanningRef.current = false;
          return;
        }

        // release the selected shape
        if (drawType === Tools.Select && isDraggingShapeRef.current) {
          if (selectedShapeRef.current !== null) {
            const dx = pos.x - dragStartRef.current.x;
            const dy = pos.y - dragStartRef.current.y;

            // multiple shape movement
            selectedShapesRef.current.forEach((index) => {
              const shape = existingShapesRef.current[index];
              const data = JSON.parse(shape.content);

              const updatedShape = {
                ...data,
                x: (data.x += dx),
                y: (data.y += dy),
              };
              drawEvent(socket, roomId, updatedShape, data.type, shape.id);
            });
          }
          isDraggingShapeRef.current = false;
          selectedShapeRef.current = null;
          return;
        }

        if (resizeHandleRef.current && selectedShapeRef.current !== null) {
          const shape = existingShapesRef.current[selectedShapeRef.current];
          const data = JSON.parse(shape.content);

          const handle = resizeHandleRef.current;

          const updatedData = handleResize(data, handle, pos);

          drawEvent(socket, roomId, updatedData, data.type, shape.id);

          resizeHandleRef.current = null; // release the resize handle
          return;
        }

        click = false;
        const w = pos.x - startX;
        const h = pos.y - startY;

        let shape: ContentType = {
          type: Tools.Select,
          x: startX,
          y: startY,
          width: w,
          height: h,
        };

        switch (drawType) {
          case Tools.Rectangle:
            shape = {
              ...shape,
              type: Tools.Rectangle,
            };
            break;
          case Tools.Circle:
            shape = {
              ...shape,
              type: Tools.Circle,
            };
            break;
          case Tools.Arrow:
            shape = {
              type: Tools.Arrow,
              x: Math.min(startX, pos.x),
              y: Math.min(startY, pos.y),
              width: Math.abs(w),
              height: Math.abs(h),
              points: [
                {
                  x: startX - Math.min(startX, pos.x),
                  y: startY - Math.min(startY, pos.y),
                },
                {
                  x: pos.x - Math.min(startX, pos.x),
                  y: pos.y - Math.min(startY, pos.y),
                },
              ],
            };
            break;
        }

        if (
          shape &&
          drawType !== Tools.Select &&
          Math.abs(w) > 0 &&
          Math.abs(h) > 0
        ) {
          drawEvent(socket, roomId, shape, drawType);
        }
        redraw(); // Redraw after drawing the new shape
      };

      const mouseMoveHandler = (e: MouseEvent) => {
        const pos = getMousePos(e);

        /////// mouse move handler
        // 1. Resize cursor
        const handle = getResizeHandle(pos.x, pos.y);
        console.log(handle, "handlehandlehandle");
        if (handle) {
          // setCursor("nwse-resize");
          if (handle === "nw" || handle === "se") setCursor("nwse-resize");
          else setCursor("nesw-resize");
        } else {
          const shapeIndex = getClickedShape(pos.x, pos.y);
          console.log(shapeIndex, "shapeIndexshapeIndex");

          if (shapeIndex !== null) {
            const shape = existingShapesRef.current[shapeIndex];
            const data = JSON.parse(shape.content);

            if (isOnEdge(pos.x, pos.y, data)) {
              setCursor("move");
            } else {
              setCursor("default");
            }
          } else {
            setCursor("default");
          }
        }
        ////
        if (isPanningRef.current) {
          const dx = e.clientX - panStartRef.current.x;
          const dy = e.clientY - panStartRef.current.y;

          offsetRef.current.x += dx;
          offsetRef.current.y += dy;

          panStartRef.current = { x: e.clientX, y: e.clientY };

          redraw();
          return;
        }

        // dragging the selected shape
        if (
          drawType === Tools.Select &&
          isDraggingShapeRef.current &&
          selectedShapeRef.current !== null
        ) {
          const dx = pos.x - dragStartRef.current.x;
          const dy = pos.y - dragStartRef.current.y;

          // multiple shape movement
          selectedShapesRef.current.forEach((index) => {
            const shape = existingShapesRef.current[index];
            const data = JSON.parse(shape.content);

            data.x += dx;
            data.y += dy;

            shape.content = JSON.stringify(data);
          });
          dragStartRef.current = pos;
          redraw();
          return;
        }

        // resizing the selected shape
        if (resizeHandleRef.current && selectedShapeRef.current !== null) {
          const shape = existingShapesRef.current[selectedShapeRef.current];
          const data = JSON.parse(shape.content);

          const handle = resizeHandleRef.current;

          const updatedData = handleResize(data, handle, pos);

          shape.content = JSON.stringify(updatedData);
          redraw();
          return;
        }

        if (!click) return;

        const width = pos.x - startX;
        const height = pos.y - startY;

        const toolData = {
          x: Math.min(startX, pos.x),
          y: Math.min(startY, pos.y),
          width: Math.abs(width),
          height: Math.abs(height),
          points: [
            {
              x: startX - Math.min(startX, pos.x),
              y: startY - Math.min(startY, pos.y),
            },
            {
              x: pos.x - Math.min(startX, pos.x),
              y: pos.y - Math.min(startY, pos.y),
            },
          ],
        };

        redraw();

        switch (drawType) {
          case Tools.Rectangle:
            drawRectangle(context, toolData);

            break;
          case Tools.Circle:
            drawCircle(context, toolData);

            break;
          case Tools.Arrow:
            drawArrow(context, toolData);
            break;
        }
      };

      const wheelHandler = (e: WheelEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const zoomIntensity = 0.1;

        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        const zoom = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

        const newScale = Math.min(Math.max(scaleRef.current * zoom, 0.2), 5);

        const worldX = (mouseX - offsetRef.current.x) / scaleRef.current;
        const worldY = (mouseY - offsetRef.current.y) / scaleRef.current;

        offsetRef.current.x = mouseX - worldX * newScale;
        offsetRef.current.y = mouseY - worldY * newScale;

        scaleRef.current = newScale;

        redraw();
      };

      const doubleClickHandler = (e: MouseEvent) => {
        const pos = getMousePos(e);

        const shapeIndex = getClickedShape(pos.x, pos.y);

        if (shapeIndex === null) return;

        const shape = existingShapesRef.current[shapeIndex];

        if (shape.type !== Tools.Text) return;

        const data = JSON.parse(shape.content);

        setTextEditor({
          x: data.x,
          y: data.y,
          shapeIndex,
        });

        setTextValue(data.text);
        requestAnimationFrame(() => redraw());
      };

      // Add event listeners
      canvas.addEventListener("mousedown", mouseDownHandler);
      canvas.addEventListener("mouseup", mouseUpHandler);
      canvas.addEventListener("mousemove", mouseMoveHandler);
      canvas.addEventListener("wheel", wheelHandler, { passive: false });
      canvas.addEventListener("dblclick", doubleClickHandler);

      window.addEventListener("keydown", (e) => {
        if (e.code === "Space") spacePressed.current = true;
      });
      window.addEventListener("keyup", (e) => {
        if (e.code === "Space") spacePressed.current = false;
      });

      //  Cleanup
      return () => {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("wheel", wheelHandler);
        canvas.removeEventListener("dblclick", doubleClickHandler);
      };
    }
  }, [roomId, drawType]);

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{ cursor }}
        className="bg-gray-100"
      />
      <div className="fixed bg-white shadow-lg border top-5 left-[40%] flex gap-2 px-4 py-2 rounded-md">
        <button
          className={cn(
            "text-black hover:bg-gray-300 p-2 rounded-sm",
            drawType === Tools.Select && "bg-gray-300",
          )}
          onClick={() => handleClick(Tools.Select)}
        >
          <MousePointer className="h-5 w-5" />
        </button>
        <button
          className={cn(
            "text-black hover:bg-gray-300 p-2 rounded-sm",
            drawType === Tools.Rectangle && "bg-gray-300",
          )}
          onClick={() => handleClick(Tools.Rectangle)}
        >
          <Square className="h-5 w-5" />
        </button>
        <button
          className={cn(
            "text-black hover:bg-gray-300 p-2 rounded-sm",
            drawType === Tools.Circle && "bg-gray-300",
          )}
          onClick={() => handleClick(Tools.Circle)}
        >
          <Circle className="h-5 w-5" />
        </button>
        <button
          className={cn(
            "text-black hover:bg-gray-300 p-2 rounded-sm",
            drawType === Tools.Arrow && "bg-gray-300",
          )}
          onClick={() => handleClick(Tools.Arrow)}
        >
          <MoveDownRight className="h-5 w-5" />
        </button>

        <button
          className={cn(
            "text-black hover:bg-gray-300 p-2 rounded-sm",
            drawType === Tools.Text && "bg-gray-300",
          )}
          onClick={() => handleClick(Tools.Text)}
        >
          <Type className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute right-6 top-4">
        <ChatSheet roomId={Number(roomId)} />
      </div>

      {textEditor && (
        <textarea
          autoFocus
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              saveText();
            }
          }}
          onBlur={saveText}
          style={{
            position: "absolute",
            left: textEditor.x * scaleRef.current + offsetRef.current.x,
            top: textEditor.y * scaleRef.current + offsetRef.current.y,
            fontSize: 16 * scaleRef.current,
            fontFamily: "sans-serif",
            color: "black",
            border: "1px solid #666",
            background: "transparent",
            padding: "4px",
            outline: "none",
            zIndex: 1000,
            resize: "none",
            minWidth: "100px",
            minHeight: "20px",
          }}
        />
      )}
    </div>
  );
};

export default Canvas;

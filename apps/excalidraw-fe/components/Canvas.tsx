"use client";

import { getShapes } from "@/config/http-request";
import { cn } from "@/lib/utils";
import { Tools } from "@/types/enums";
import {
  Circle,
  MousePointer,
  MoveDownRight,
  Square,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type ShapeType = {
  content: string;
  type: Tools;
  roomId: number;
  userId: number;
  // id: number;
};

const Canvas = ({ roomId, socket }: { roomId: string; socket: WebSocket }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawType, setDrawType] = useState<Tools>(Tools.Select);
  const [existingShapes, setExistingShapes] = useState<ShapeType[]>([]);
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
    // width: number;
    // height: number;
    shapeIndex?: number;
  } | null>(null);

  const [textValue, setTextValue] = useState("");

  function getClickedShape(x: number, y: number) {
    const shapes = existingShapesRef.current;

    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      const data = JSON.parse(shape.content);

      if (shape.type === Tools.Rectangle) {
        if (
          x >= data.startX &&
          x <= data.startX + data.width &&
          y >= data.startY &&
          y <= data.startY + data.height
        ) {
          return i;
        }
      }

      if (shape.type === Tools.Circle) {
        const dx = x - data.centerX;
        const dy = y - data.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= data.radius) {
          return i;
        }
      }
      if (shape.type === Tools.Text) {
        const lines = data.text.split("\n");
        const lineHeight = 18;

        const height = lines.length * lineHeight;

        if (
          x >= data.x &&
          x <= data.x + data.width &&
          y >= data.y - lineHeight &&
          y <= data.y + height - lineHeight
        ) {
          return i;
        }
      }

      if (shape.type === Tools.Arrow) {
        const dist =
          Math.abs(
            (data.endY - data.startY) * x -
              (data.endX - data.startX) * y +
              data.endX * data.startY -
              data.endY * data.startX,
          ) /
          Math.sqrt(
            (data.endY - data.startY) ** 2 + (data.endX - data.startX) ** 2,
          );

        if (dist < 5) return i;
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
    ctx.save();

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(x, y, w, h);

    ctx.setLineDash([]);

    const size = 8;

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

    ctx.restore();
  }

  function getResizeHandle(x: number, y: number) {
    if (selectedShapeRef.current === null) return null;

    const shape = existingShapesRef.current[selectedShapeRef.current];
    const data = JSON.parse(shape.content);

    const size = 10;

    const corners = [
      { name: "tl", x: data.startX, y: data.startY },
      { name: "tr", x: data.startX + data.width, y: data.startY },
      { name: "bl", x: data.startX, y: data.startY + data.height },
      {
        name: "br",
        x: data.startX + data.width,
        y: data.startY + data.height,
      },
    ];

    for (const c of corners) {
      if (Math.abs(x - c.x) < size && Math.abs(y - c.y) < size) {
        return c.name;
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
    context: CanvasRenderingContext2D,
  ) {
    shapes &&
      shapes?.map((shape: any, i: number) => {
        const data = JSON.parse(shape.content);

        context.lineWidth = 2;
        context.strokeStyle = "black";

        if (shape.type == Tools.Rectangle) {
          context.strokeRect(
            data?.startX,
            data?.startY,
            data?.width,
            data?.height,
          );

          if (selectedShapesRef.current.has(i)) {
            drawSelectionBox(
              context,
              data.startX,
              data.startY,
              data.width,
              data.height,
            );
          }
        }
        if (shape.type == Tools.Circle) {
          context.beginPath();
          context.arc(
            data.centerX,
            data.centerY,
            Math.abs(data.radius),
            0,
            2 * Math.PI,
          );
          context.stroke();

          if (selectedShapesRef.current.has(i)) {
            console.log("first dircleeeeeeeeeeeeeeeeeee");
            drawSelectionBox(
              context,
              data.centerX - data.radius,
              data.centerY - data.radius,
              data.radius * 2,
              data.radius * 2,
            );
          }
        }

        if (shape.type === Tools.Arrow) {
          context.beginPath();
          context.moveTo(data.startX, data.startY);
          context.lineTo(data.endX, data.endY);
          context.stroke();

          context.beginPath();
          context.moveTo(data.endX, data.endY);
          context.lineTo(data.rightX, data.rightY);
          context.moveTo(data.endX, data.endY);
          context.lineTo(data.leftX, data.leftY);
          context.stroke();

          if (selectedShapesRef.current.has(i)) {
            const box = getArrowBoundingBox(data);
            drawSelectionBox(context, box.x, box.y, box.width, box.height);
          }
        }

        if (shape.type === Tools.Text) {
          // //  Don't draw text if it's being edited
          // if (textEditor?.shapeIndex === i) return;

          context.font = "16px sans-serif";
          context.fillStyle = "black";

          const lines = data.text.split("\n");
          const lineHeight = 18;

          lines.forEach((line: string, index: number) => {
            context.fillText(line, data.x, data.y + index * lineHeight);
          });

          if (selectedShapesRef.current.has(i)) {
            drawSelectionBox(
              context,
              data.x,
              data.y - 16,
              data.width,
              lines.length * lineHeight,
            );
          }
        }
      });
  }

  function startDraw(
    socket: WebSocket,
    roomId: string,
    content: Record<string, string | number>,
    type: Tools,
  ) {
    console.log(`socket ${type} type send.`);
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
      startDraw(
        socket,
        roomId,
        {
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
          x: (e.clientX - rect.left - offsetRef.current.x) / scaleRef.current,
          y: (e.clientY - rect.top - offsetRef.current.y) / scaleRef.current,
        };
      };

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
          console.log(shapeIndex, "shapeIndexshapeIndexshapeIndex");
          if (shapeIndex !== null) {
            // if shift key is pressed, add the shape to the selection, otherwise select only the clicked shape
            if (e.shiftKey) {
              selectedShapesRef.current.add(shapeIndex);
            } else {
              selectedShapesRef.current.clear();
              selectedShapesRef.current.add(shapeIndex);
            } //

            selectedShapeRef.current = shapeIndex;
            isDraggingShapeRef.current = true;

            dragStartRef.current = pos;
            return;
          }
        }

        // resize
        const handle = getResizeHandle(pos.x, pos.y);
        if (handle) {
          resizeHandleRef.current = handle;
          return;
        }

        // text
        if (drawType === Tools.Text) {
          const pos = getMousePos(e);

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
        if (isPanningRef.current) {
          isPanningRef.current = false;
          return;
        }
        // release the selected shape
        if (drawType === Tools.Select && isDraggingShapeRef.current) {
          isDraggingShapeRef.current = false;
          selectedShapeRef.current = null;
        }

        resizeHandleRef.current = null; // release the resize handle

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
        } else if (drawType === Tools.Arrow) {
          const headLength = 10;
          const angle = Math.atan2(pos.y - startY, pos.x - startX);
          const rightX = pos.x - headLength * Math.cos(angle - Math.PI / 5);
          const rightY = pos.y - headLength * Math.sin(angle - Math.PI / 5);
          const leftX = pos.x - headLength * Math.cos(angle + Math.PI / 5);
          const leftY = pos.y - headLength * Math.sin(angle + Math.PI / 5);

          shape = {
            startX,
            startY,
            endX: pos.x,
            endY: pos.y,
            rightX,
            rightY,
            leftX,
            leftY,
          };
        }

        if (shape && drawType !== Tools.Select) {
          startDraw(socket, roomId, shape, drawType);
        }
        redraw(); // Redraw after drawing the new shape
      };

      const mouseMoveHandler = (e: MouseEvent) => {
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
          const pos = getMousePos(e);

          const dx = pos.x - dragStartRef.current.x;
          const dy = pos.y - dragStartRef.current.y;

          const shapes = existingShapesRef.current;
          // single shape movement
          // const shape = shapes[selectedShapeRef.current];
          // const data = JSON.parse(shape.content);
          // if (shape.type === Tools.Rectangle) {
          //   data.startX += dx;
          //   data.startY += dy;
          // }
          // if (shape.type === Tools.Circle) {
          //   data.centerX += dx;
          //   data.centerY += dy;
          // }
          // shape.content = JSON.stringify(data);

          // multiple shape movement
          selectedShapesRef.current.forEach((index) => {
            const shape = shapes[index];
            const data = JSON.parse(shape.content);
            if (shape.type === Tools.Rectangle) {
              data.startX += dx;
              data.startY += dy;
            }
            if (shape.type === Tools.Circle) {
              data.centerX += dx;
              data.centerY += dy;
            }
            if (shape.type === Tools.Arrow) {
              data.startX += dx;
              data.startY += dy;
              data.endX += dx;
              data.endY += dy;
              data.leftX += dx;
              data.leftY += dy;
              data.rightX += dx;
              data.rightY += dy;
            }
            if (shape.type === Tools.Text) {
              data.x += dx;
              data.y += dy;
            }
            shape.content = JSON.stringify(data);
          });

          dragStartRef.current = pos;

          redraw();

          return;
        }

        // resizing the selected shape
        if (resizeHandleRef.current && selectedShapeRef.current !== null) {
          const pos = getMousePos(e);
          const shape = existingShapesRef.current[selectedShapeRef.current];
          const data = JSON.parse(shape.content);

          if (resizeHandleRef.current === "br") {
            data.width = pos.x - data.startX;
            data.height = pos.y - data.startY;
          }

          if (resizeHandleRef.current === "tr") {
            data.width = pos.x - data.startX;
            data.startY = pos.y;
          }

          if (resizeHandleRef.current === "bl") {
            data.startX = pos.x;
            data.height = pos.y - data.startY;
          }

          shape.content = JSON.stringify(data);

          redraw();
          return;
        }

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
            const headLength = 10;
            const angle = Math.atan2(pos.y - startY, pos.x - startX);

            context.beginPath();
            context.moveTo(startX, startY);
            context.lineTo(pos.x, pos.y);
            context.stroke();

            context.beginPath();
            context.moveTo(pos.x, pos.y);
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
          // width: data.width,
          // height: data.height,
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

            // width: textEditor.width * scaleRef.current,
            // height: textEditor.height * scaleRef.current,

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

function getArrowBoundingBox(data: any) {
  const minX = Math.min(data.startX, data.endX);
  const minY = Math.min(data.startY, data.endY);
  const maxX = Math.max(data.startX, data.endX);
  const maxY = Math.max(data.startY, data.endY);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

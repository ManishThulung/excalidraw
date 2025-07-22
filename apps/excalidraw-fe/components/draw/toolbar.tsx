"use client";

import type React from "react";

import { useDrawing } from "@/contexts/drawing-context";
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
import {
  MousePointer2,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Pencil,
  Type,
  Eraser,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Download,
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export function Toolbar() {
  const { state, dispatch, exportToJSON, importFromJSON } = useDrawing();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tools = [
    { id: "select", icon: MousePointer2, label: "Select (V)" },
    { id: "rectangle", icon: Square, label: "Rectangle (R)" },
    { id: "circle", icon: Circle, label: "Circle (C)" },
    { id: "line", icon: Minus, label: "Line (L)" },
    { id: "arrow", icon: ArrowRight, label: "Arrow (A)" },
    { id: "pencil", icon: Pencil, label: "Pencil (P)" },
    { id: "text", icon: Type, label: "Text (T)" },
    { id: "eraser", icon: Eraser, label: "Eraser (E)" },
    { id: "hand", icon: Hand, label: "Hand (H)" },
  ];

  const handleExport = () => {
    const json = exportToJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        importFromJSON(json);
      };
      reader.readAsText(file);
    }
  };

  const zoomIn = () => {
    dispatch({ type: "SET_SCALE", scale: state.scale * 1.2 });
  };

  const zoomOut = () => {
    dispatch({ type: "SET_SCALE", scale: state.scale / 1.2 });
  };

  const resetZoom = () => {
    dispatch({ type: "SET_SCALE", scale: 1 });
    dispatch({ type: "SET_PAN", x: 0, y: 0 });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-2 flex items-center gap-2 flex-wrap">
      {/* Tools */}
      <div className="flex items-center gap-1">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            // variant={state.tool === id ? "default" : "ghost"}
            // size="sm"
            onClick={() => dispatch({ type: "SET_TOOL", tool: id as any })}
            title={label}
            className={cn(
              "w-8 h-8 p-0",
              state.tool === id && "bg-blue-100 text-blue-700 border-blue-300"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* <Separator orientation="vertical" className="h-6" /> */}

      {/* Colors */}
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="stroke-color" className="text-xs">
            Stroke
          </label>
          <input
            id="stroke-color"
            type="color"
            value={state.strokeColor}
            onChange={(e) =>
              dispatch({ type: "SET_STROKE_COLOR", color: e.target.value })
            }
            className="w-8 h-6 p-0 border-0 rounded cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="fill-color" className="text-xs">
            Fill
          </label>
          <div className="relative">
            <input
              id="fill-color"
              type="color"
              value={
                state.fillColor === "transparent" ? "#ffffff" : state.fillColor
              }
              onChange={(e) =>
                dispatch({ type: "SET_FILL_COLOR", color: e.target.value })
              }
              className="w-8 h-6 p-0 border-0 rounded cursor-pointer"
            />
            {state.fillColor === "transparent" && (
              <div className="absolute inset-0 bg-white bg-opacity-50 rounded pointer-events-none" />
            )}
          </div>
        </div>
        <button
          // variant="ghost"
          // size="sm"
          onClick={() =>
            dispatch({
              type: "SET_FILL_COLOR",
              color:
                state.fillColor === "transparent" ? "#ffffff" : "transparent",
            })
          }
          className="text-xs px-2"
        >
          {state.fillColor === "transparent" ? "No Fill" : "Fill"}
        </button>
      </div>

      {/* <Separator orientation="vertical" className="h-6" /> */}

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <label htmlFor="stroke-width" className="text-xs">
          Width
        </label>
        <input
          id="stroke-width"
          type="range"
          min="1"
          max="20"
          value={state.strokeWidth}
          onChange={(e) =>
            dispatch({
              type: "SET_STROKE_WIDTH",
              width: Number(e.target.value),
            })
          }
          className="w-16"
        />
        <span className="text-xs w-6">{state.strokeWidth}</span>
      </div>

      {/* Font Size */}
      {state.tool === "text" && (
        <>
          {/* <Separator orientation="vertical" className="h-6" /> */}
          <div className="flex items-center gap-2">
            <label htmlFor="font-size" className="text-xs">
              Size
            </label>
            <input
              id="font-size"
              type="number"
              min="8"
              max="72"
              value={state.fontSize}
              onChange={(e) =>
                dispatch({
                  type: "SET_FONT_SIZE",
                  size: Number(e.target.value),
                })
              }
              className="w-16 h-6 text-xs"
            />
          </div>
        </>
      )}

      {/* <Separator orientation="vertical" className="h-6" /> */}

      {/* Zoom */}
      <div className="flex items-center gap-1">
        <button
          // variant="ghost"
          //  size="sm"
          onClick={zoomOut}
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs w-12 text-center">
          {Math.round(state.scale * 100)}%
        </span>
        <button
          // variant="ghost"
          //  size="sm"
          onClick={zoomIn}
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          // variant="ghost"
          //  size="sm"
          onClick={resetZoom}
          title="Reset Zoom"
          className="text-xs px-2"
        >
          Reset
        </button>
      </div>

      {/* <Separator orientation="vertical" className="h-6" /> */}

      {/* History */}
      <div className="flex items-center gap-1">
        <button
          // variant="ghost"
          // size="sm"
          onClick={() => dispatch({ type: "UNDO" })}
          title="Undo (Ctrl+Z)"
          disabled={state.historyIndex <= 0}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          // variant="ghost"
          // size="sm"
          onClick={() => dispatch({ type: "REDO" })}
          title="Redo (Ctrl+Y)"
          disabled={state.historyIndex >= state.history.length - 1}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* <Separator orientation="vertical" className="h-6" /> */}

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          // variant="ghost"
          // size="sm"
          onClick={() => {
            dispatch({ type: "DELETE_SELECTED" });
            dispatch({ type: "SAVE_TO_HISTORY" });
          }}
          title="Delete Selected"
          disabled={state.selectedIds.length === 0}
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          // variant="ghost" size="sm"
          onClick={handleExport}
          title="Export JSON"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          // variant="ghost" size="sm"
          onClick={() => fileInputRef.current?.click()}
          title="Import JSON"
        >
          <Upload className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>
    </div>
  );
}

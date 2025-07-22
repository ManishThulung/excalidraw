"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";

export type Tool =
  | "select"
  | "rectangle"
  | "circle"
  | "line"
  | "arrow"
  | "pencil"
  | "text"
  | "eraser"
  | "hand";

export interface Point {
  x: number;
  y: number;
}

export interface DrawingObject {
  id: string;
  type: "rectangle" | "circle" | "line" | "arrow" | "pencil" | "text";
  x: number;
  y: number;
  width?: number;
  height?: number;
  points?: Point[];
  text?: string;
  fontSize?: number;
  stroke: string;
  fill: string;
  strokeWidth: number;
  rotation?: number;
}

interface DrawingState {
  tool: Tool;
  objects: DrawingObject[];
  selectedIds: string[];
  history: DrawingObject[][];
  historyIndex: number;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  fontSize: number;
  scale: number;
  panX: number;
  panY: number;
  isDrawing: boolean;
  currentPath: Point[];
  // New states for shape creation preview
  isCreatingShape: boolean;
  previewShape: DrawingObject | null;
  dragMode: "none" | "move" | "resize" | "rotate";
  dragStart: Point;
  dragOffset: Point;
}

type DrawingAction =
  | { type: "SET_TOOL"; tool: Tool }
  | { type: "ADD_OBJECT"; object: DrawingObject }
  | { type: "UPDATE_OBJECT"; id: string; updates: Partial<DrawingObject> }
  | { type: "DELETE_OBJECT"; id: string }
  | { type: "DELETE_SELECTED" }
  | { type: "SELECT_OBJECT"; id: string }
  | { type: "SELECT_MULTIPLE"; ids: string[] }
  | { type: "CLEAR_SELECTION" }
  | { type: "SET_STROKE_COLOR"; color: string }
  | { type: "SET_FILL_COLOR"; color: string }
  | { type: "SET_STROKE_WIDTH"; width: number }
  | { type: "SET_FONT_SIZE"; size: number }
  | { type: "SET_SCALE"; scale: number }
  | { type: "SET_PAN"; x: number; y: number }
  | { type: "START_DRAWING"; point: Point }
  | { type: "CONTINUE_DRAWING"; point: Point }
  | { type: "FINISH_DRAWING" }
  | { type: "START_SHAPE_CREATION"; point: Point; shapeType: string }
  | { type: "UPDATE_SHAPE_PREVIEW"; point: Point }
  | { type: "FINISH_SHAPE_CREATION" }
  | {
      type: "START_DRAG";
      mode: "move" | "resize" | "rotate";
      point: Point;
      offset: Point;
    }
  | { type: "UPDATE_DRAG"; point: Point }
  | { type: "FINISH_DRAG" }
  | { type: "SAVE_TO_HISTORY" }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD_STATE"; state: Partial<DrawingState> };

const initialState: DrawingState = {
  tool: "select",
  objects: [],
  selectedIds: [],
  history: [[]],
  historyIndex: 0,
  strokeColor: "#000000",
  // fillColor: "transparent",
  fillColor: "#FFB3B3",
  strokeWidth: 2,
  fontSize: 16,
  scale: 1,
  panX: 0,
  panY: 0,
  isDrawing: false,
  currentPath: [],
  isCreatingShape: false,
  previewShape: null,
  dragMode: "none",
  dragStart: { x: 0, y: 0 },
  dragOffset: { x: 0, y: 0 },
};

const generateId = () => Math.random().toString(36).substr(2, 9);

function drawingReducer(
  state: DrawingState,
  action: DrawingAction
): DrawingState {
  switch (action.type) {
    case "SET_TOOL":
      return {
        ...state,
        tool: action.tool,
        isCreatingShape: false,
        previewShape: null,
        dragMode: "none",
      };

    case "ADD_OBJECT":
      const newObjects = [...state.objects, action.object];
      return {
        ...state,
        objects: newObjects,
      };

    case "UPDATE_OBJECT":
      return {
        ...state,
        objects: state.objects.map((obj) =>
          obj.id === action.id ? { ...obj, ...action.updates } : obj
        ),
      };

    case "DELETE_OBJECT":
      return {
        ...state,
        objects: state.objects.filter((obj) => obj.id !== action.id),
        selectedIds: state.selectedIds.filter((id) => id !== action.id),
      };

    case "DELETE_SELECTED":
      return {
        ...state,
        objects: state.objects.filter(
          (obj) => !state.selectedIds.includes(obj.id)
        ),
        selectedIds: [],
      };

    case "SELECT_OBJECT":
      return { ...state, selectedIds: [action.id] };

    case "SELECT_MULTIPLE":
      return { ...state, selectedIds: action.ids };

    case "CLEAR_SELECTION":
      return { ...state, selectedIds: [] };

    case "SET_STROKE_COLOR":
      return { ...state, strokeColor: action.color };

    case "SET_FILL_COLOR":
      return { ...state, fillColor: action.color };

    case "SET_STROKE_WIDTH":
      return { ...state, strokeWidth: action.width };

    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.size };

    case "SET_SCALE":
      return { ...state, scale: Math.max(0.1, Math.min(5, action.scale)) };

    case "SET_PAN":
      return { ...state, panX: action.x, panY: action.y };

    case "START_DRAWING":
      return { ...state, isDrawing: true, currentPath: [action.point] };

    case "CONTINUE_DRAWING":
      return { ...state, currentPath: [...state.currentPath, action.point] };

    case "FINISH_DRAWING":
      if (state.currentPath.length > 1) {
        const pencilObject: DrawingObject = {
          id: generateId(),
          type: "pencil",
          x: 0,
          y: 0,
          points: state.currentPath,
          stroke: state.strokeColor,
          fill: "transparent",
          strokeWidth: state.strokeWidth,
        };
        return {
          ...state,
          objects: [...state.objects, pencilObject],
          isDrawing: false,
          currentPath: [],
        };
      }
      return { ...state, isDrawing: false, currentPath: [] };

    case "START_SHAPE_CREATION":
      const previewShape: DrawingObject = {
        id: "preview",
        type: action.shapeType as any,
        x: action.point.x,
        y: action.point.y,
        width: 0,
        height: 0,
        points:
          action.shapeType === "line" || action.shapeType === "arrow"
            ? [action.point, action.point]
            : undefined,
        stroke: state.strokeColor,
        fill: state.fillColor,
        strokeWidth: state.strokeWidth,
      };
      return {
        ...state,
        isCreatingShape: true,
        previewShape,
        dragStart: action.point,
      };

    case "UPDATE_SHAPE_PREVIEW":
      if (!state.previewShape) return state;

      const updatedShape = { ...state.previewShape };

      switch (state.previewShape.type) {
        case "rectangle":
          updatedShape.x = Math.min(state.dragStart.x, action.point.x);
          updatedShape.y = Math.min(state.dragStart.y, action.point.y);
          updatedShape.width = Math.abs(action.point.x - state.dragStart.x);
          updatedShape.height = Math.abs(action.point.y - state.dragStart.y);
          break;
        case "circle":
          const radius =
            Math.sqrt(
              Math.pow(action.point.x - state.dragStart.x, 2) +
                Math.pow(action.point.y - state.dragStart.y, 2)
            ) / 2;
          updatedShape.x = (state.dragStart.x + action.point.x) / 2;
          updatedShape.y = (state.dragStart.y + action.point.y) / 2;
          updatedShape.width = radius * 2;
          updatedShape.height = radius * 2;
          break;
        case "line":
        case "arrow":
          updatedShape.points = [state.dragStart, action.point];
          break;
      }

      return {
        ...state,
        previewShape: updatedShape,
      };

    case "FINISH_SHAPE_CREATION":
      if (!state.previewShape) return state;

      const finalShape = {
        ...state.previewShape,
        id: generateId(),
      };

      // Only add if shape has meaningful size
      const shouldAdd =
        ((finalShape.type === "rectangle" || finalShape.type === "circle") &&
          (finalShape.width || 0) > 5 &&
          (finalShape.height || 0) > 5) ||
        ((finalShape.type === "line" || finalShape.type === "arrow") &&
          finalShape.points &&
          finalShape.points.length === 2 &&
          Math.sqrt(
            Math.pow(finalShape.points[1].x - finalShape.points[0].x, 2) +
              Math.pow(finalShape.points[1].y - finalShape.points[0].y, 2)
          ) > 5);

      return {
        ...state,
        objects: shouldAdd ? [...state.objects, finalShape] : state.objects,
        isCreatingShape: false,
        previewShape: null,
      };

    case "START_DRAG":
      return {
        ...state,
        dragMode: action.mode,
        dragStart: action.point,
        dragOffset: action.offset,
      };

    case "UPDATE_DRAG":
      if (state.dragMode === "none" || state.selectedIds.length === 0)
        return state;

      const deltaX = action.point.x - state.dragStart.x;
      const deltaY = action.point.y - state.dragStart.y;

      return {
        ...state,
        objects: state.objects.map((obj) => {
          if (!state.selectedIds.includes(obj.id)) return obj;

          if (state.dragMode === "move") {
            return {
              ...obj,
              x: obj.x + deltaX,
              y: obj.y + deltaY,
              points: obj.points?.map((p) => ({
                x: p.x + deltaX,
                y: p.y + deltaY,
              })),
            };
          } else if (state.dragMode === "resize") {
            // Simple resize - adjust width/height based on drag
            const newWidth = Math.max(10, (obj.width || 0) + deltaX);
            const newHeight = Math.max(10, (obj.height || 0) + deltaY);
            return {
              ...obj,
              width: newWidth,
              height: newHeight,
            };
          }

          return obj;
        }),
        dragStart: action.point, // Update drag start for continuous dragging
      };

    case "FINISH_DRAG":
      return {
        ...state,
        dragMode: "none",
      };

    case "SAVE_TO_HISTORY":
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.objects]);
      return {
        ...state,
        history: newHistory.slice(-50),
        historyIndex: newHistory.length - 1,
      };

    case "UNDO":
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state,
          objects: [...state.history[newIndex]],
          historyIndex: newIndex,
          selectedIds: [],
        };
      }
      return state;

    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state,
          objects: [...state.history[newIndex]],
          historyIndex: newIndex,
          selectedIds: [],
        };
      }
      return state;

    case "LOAD_STATE":
      return { ...state, ...action.state };

    default:
      return state;
  }
}

interface DrawingContextType {
  state: DrawingState;
  dispatch: React.Dispatch<DrawingAction>;
  saveToStorage: () => void;
  loadFromStorage: () => void;
  exportToJSON: () => string;
  importFromJSON: (json: string) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export function DrawingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(drawingReducer, initialState);

  const saveToStorage = useCallback(() => {
    const dataToSave = {
      objects: state.objects,
      strokeColor: state.strokeColor,
      fillColor: state.fillColor,
      strokeWidth: state.strokeWidth,
      fontSize: state.fontSize,
    };
    localStorage.setItem("drawing-tool-data", JSON.stringify(dataToSave));
  }, [state]);

  const loadFromStorage = useCallback(() => {
    try {
      const data = localStorage.getItem("drawing-tool-data");
      if (data) {
        const parsed = JSON.parse(data);
        dispatch({ type: "LOAD_STATE", state: parsed });
      }
    } catch (error) {
      console.error("Failed to load from storage:", error);
    }
  }, []);

  const exportToJSON = useCallback(() => {
    return JSON.stringify({ objects: state.objects }, null, 2);
  }, [state.objects]);

  const importFromJSON = useCallback((json: string) => {
    try {
      const data = JSON.parse(json);
      dispatch({ type: "LOAD_STATE", state: { objects: data.objects || [] } });
    } catch (error) {
      console.error("Failed to import JSON:", error);
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      saveToStorage();
    }, 1000);
    return () => clearTimeout(timer);
  }, [state.objects, saveToStorage]);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ["z", "y", "s"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (state.selectedIds.length > 0) {
          e.preventDefault();
          dispatch({ type: "DELETE_SELECTED" });
          dispatch({ type: "SAVE_TO_HISTORY" });
        }
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            if (e.shiftKey) {
              dispatch({ type: "REDO" });
            } else {
              dispatch({ type: "UNDO" });
            }
            break;
          case "y":
            dispatch({ type: "REDO" });
            break;
          case "s":
            saveToStorage();
            break;
        }
      }

      // Tool shortcuts
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "v":
            dispatch({ type: "SET_TOOL", tool: "select" });
            break;
          case "r":
            dispatch({ type: "SET_TOOL", tool: "rectangle" });
            break;
          case "c":
            dispatch({ type: "SET_TOOL", tool: "circle" });
            break;
          case "l":
            dispatch({ type: "SET_TOOL", tool: "line" });
            break;
          case "a":
            dispatch({ type: "SET_TOOL", tool: "arrow" });
            break;
          case "p":
            dispatch({ type: "SET_TOOL", tool: "pencil" });
            break;
          case "t":
            dispatch({ type: "SET_TOOL", tool: "text" });
            break;
          case "e":
            dispatch({ type: "SET_TOOL", tool: "eraser" });
            break;
          case "h":
            dispatch({ type: "SET_TOOL", tool: "hand" });
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [state.selectedIds, saveToStorage]);

  return (
    <DrawingContext.Provider
      value={{
        state,
        dispatch,
        saveToStorage,
        loadFromStorage,
        exportToJSON,
        importFromJSON,
      }}
    >
      {children}
    </DrawingContext.Provider>
  );
}

export function useDrawing() {
  const context = useContext(DrawingContext);
  if (context === undefined) {
    throw new Error("useDrawing must be used within a DrawingProvider");
  }
  return context;
}

import { Tools } from "./enums";

export type ContentType = {
  type: Tools;
  x: number;
  y: number;
  width: number;
  height: number;

  points?: Record<string, number>[];
  text?: string;
};

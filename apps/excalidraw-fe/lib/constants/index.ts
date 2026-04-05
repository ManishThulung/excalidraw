import { Tools } from "@/types/enums";
import {
  Circle,
  Diamond,
  MousePointer,
  MoveDownRight,
  Square,
  Type,
} from "lucide-react";

export const availableTools = [
  { type: Tools.Select, icon: MousePointer },
  { type: Tools.Rectangle, icon: Square },
  { type: Tools.Circle, icon: Circle },
  { type: Tools.Arrow, icon: MoveDownRight },
  { type: Tools.Diamond, icon: Diamond },
  { type: Tools.Text, icon: Type },
];

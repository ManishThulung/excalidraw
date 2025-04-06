import axios from "axios";

// export async function getShapes(roomId: string) {
//   const res = await fetch(`http://localhost:4000/api/shapes/${roomId}`, {
//     method: "GET",
//     headers: {
//       Authorization:
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6InJhbUBnbWFpbC5jb20iLCJuYW1lIjoicmFtIiwicGhvdG8iOm51bGx9LCJpYXQiOjE3MzgzNDQ4MDR9.5OFre7DsdWq68iesr0ZSwrycqodBV1l_P2GxjxwKVMc",
//       "Content-Type": "application/json",
//     },
//   });
//   const data = await res.json();
//   return data;
// }

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

export async function getShapes(roomId: string) {
  const res = await api.get(`http://localhost:4000/api/shapes/${roomId}`);
  return res.data;
}

// import { Tools } from "@/components/Canvas";
// import { getShapes } from "@/config/http-request";

// type Shape =
//   | {
//       type: "rect";
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     }
//   | {
//       type: "circle";
//       x: number;
//       y: number;
//       width: number;
//       height: number;
//     };

// export const initDraw = async (
//   canvas: HTMLCanvasElement,
//   tool: Tools | null,
//   roomId: string,
//   socket: WebSocket,
//   existingShapes: any
// ) => {
//   const context = canvas.getContext("2d");

//   if (!context || !tool) {
//     return;
//   }

//   drawExistingShapes(existingShapes, context);

//   let click = false;
//   let startY = 0;
//   let startX = 0;

//   canvas.addEventListener("mousedown", (e) => {
//     click = true;
//     startX = e.clientX;
//     startY = e.clientY;
//   });
//   canvas.addEventListener("mouseup", (e) => {
//     click = false;
//     const width = e.clientX - startX;
//     const height = e.clientY - startY;
//     let shape;
//     // switch (tool) {
//     //   case "Rect":
//     //     shape = {
//     //       startX,
//     //       startY,
//     //       width,
//     //       height,
//     //     };
//     //     break;

//     //   case "Circle":
//     //     const radius = Math.max(height, width) / 2;
//     //     shape = {
//     //       centerX: startX + radius,
//     //       centerY: startY + radius,
//     //       radius,
//     //     };
//     //     break;

//     //   case "Arrow":
//     //     break;

//     //   default:
//     //     break;
//     // }
//     console.log(tool, "tool");
//     if (tool === "Rect") {
//       console.log("Rect");
//       shape = {
//         startX,
//         startY,
//         width,
//         height,
//       };
//       startDraw(socket, roomId, { ...shape }, tool);
//     } else if (tool === "Circle") {
//       console.log("Circle");

//       const radius = Math.max(height, width) / 2;
//       shape = {
//         centerX: startX + radius,
//         centerY: startY + radius,
//         radius,
//       };
//       startDraw(socket, roomId, { ...shape }, tool);
//     }
//     existingShapes.shapes.push({
//       type: tool,
//       content: JSON.stringify(shape),
//       roomId,
//     });
//   });

//   canvas.addEventListener("mousemove", (e) => {
//     if (click) {
//       const width = e.clientX - startX;
//       const height = e.clientY - startY;

//       context.clearRect(0, 0, canvas.width, canvas.height);

//       drawExistingShapes(existingShapes, context);

//       switch (tool) {
//         case "Rect":
//           context.strokeRect(startX, startY, width, height);
//           break;

//         case "Circle":
//           const radius = Math.max(height, width) / 2;
//           context.beginPath();
//           context.arc(
//             startX + radius,
//             startY + radius,
//             Math.abs(radius),
//             0,
//             2 * Math.PI
//           );
//           context.stroke();
//           context.closePath();
//           break;

//         case "Arrow":
//           const startCoordinate = { x: startX, y: startY };
//           const endCoordinate = { x: e.clientX, y: e.clientY };
//           const headLength = 15;
//           const PI = Math.PI;
//           const degreesInRadians225 = (225 * PI) / 180;
//           const degreesInRadians135 = (135 * PI) / 180;
//           const dx = endCoordinate.x - startCoordinate.x;
//           const dy = endCoordinate.y - startCoordinate.y;
//           const angle = Math.atan2(dy, dx);
//           const x225 =
//             endCoordinate.x +
//             headLength * Math.cos(angle + degreesInRadians225);
//           const y225 =
//             endCoordinate.y +
//             headLength * Math.sin(angle + degreesInRadians225);
//           const x135 =
//             endCoordinate.x +
//             headLength * Math.cos(angle + degreesInRadians135);
//           const y135 =
//             endCoordinate.y +
//             headLength * Math.sin(angle + degreesInRadians135);

//           context.beginPath();
//           context.moveTo(startCoordinate.x, startCoordinate.y);
//           context.lineTo(endCoordinate.x, endCoordinate.y);
//           context.moveTo(endCoordinate.x, endCoordinate.y);
//           context.lineTo(x225, y225);
//           context.moveTo(endCoordinate.x, endCoordinate.y);
//           context.lineTo(x135, y135);
//           context.stroke();
//           break;

//         default:
//           break;
//       }
//     }
//   });
// };

// async function drawExistingShapes(
//   existingShapes: any,
//   context: CanvasRenderingContext2D
// ) {
//   existingShapes &&
//     existingShapes?.shapes?.map((shape: any) => {
//       if (shape.type == "Rect") {
//         const parsedData = JSON.parse(shape.content);
//         context.strokeRect(
//           parsedData?.startX,
//           parsedData?.startY,
//           parsedData?.width,
//           parsedData?.height
//         );
//       }
//       if (shape.type == "Circle") {
//         const parsedData = JSON.parse(shape.content);
//         context.beginPath();
//         context.arc(
//           parsedData.centerX,
//           parsedData.centerY,
//           Math.abs(parsedData.radius),
//           0,
//           2 * Math.PI
//         );
//         context.stroke();
//         context.closePath();
//       }
//     });
// }

// function startDraw(
//   socket: WebSocket,
//   roomId: string,
//   content: Record<string, string | number>,
//   type: string
// ) {
//   socket.send(
//     JSON.stringify({
//       type: "draw",
//       room: roomId,
//       content,
//       toolType: type,
//     })
//   );
// }

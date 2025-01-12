import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8009 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET);

  // @ts-ignore
  if (!decoded && !decoded.payload.id) {
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: [],
    userId: decoded.payload.id,
  });

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type == "join_room") {
      const user = users.filter((user) => user.ws === ws);
      user?.rooms?.push(parsedData.roomId);
    }

    if (parsedData.type == "leave_room") {
      const user = users.filter((user) => user.ws === ws);
      if (!user) {
        return;
      }
      user?.rooms = user?.rooms?.filter((user) => user.ws === ws);
    }
    if (parsedData.type == "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

      users.forEach((user) => {
        const part = user.rooms.includes(roomId);
        part && user.ws.send(message);
      });

      const user = users.filter((user) => user.ws === ws);
      if (!user) {
        return;
      }
      user?.rooms = user?.rooms?.filter((user) => user.ws === ws);
    }
  });

  ws.send("something");
});

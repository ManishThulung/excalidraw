import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8009 });

interface Room {
  ws: WebSocket;
  userId: string;
}

let users: Record<string, Room[]> = {};

wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    ws.close();
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET);

  // @ts-ignore 
  const userId = decoded.paylod.id;

  // @ts-ignore
  if (!decoded && !decoded.paylod.id) {
    ws.close();
    return;
  }

  // users.push({
  //   ws,
  //   rooms: [],
  //   // @ts-ignore
  //   userId: decoded.payload.id,
  // });

  // users.

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type == "join_room") {
      console.log(`join room ${userId}`)
      const { room } = parsedData;
      if (!users[room]) {
        users[room] = [];
      }
      users[room]?.push({ ws, userId });
    }

    if (parsedData.type == "leave_room") {
      console.log(`leave room ${userId}`)
      const { room } = parsedData;

      if (!users[room]) {
        ws.close();
        return;
      }

      const index = users[room]?.findIndex((user) => user.ws === ws);
      if (index === -1) {
        ws.close();
        return; 
      }

      users[room]?.splice(index, 1);
    }

    if (parsedData.type == "chat") {
      console.log(`chat sent by ${userId}`)
      const { room, message } = parsedData;
      if (!users[room]) {
        ws.close();
        return;
      }
      users[room]?.forEach((user) => {
        user && user.ws.send(message);
      });

      // const user = users.filter((user) => user.ws === ws);
      // if (!user) {
      //   return;
      // }
      // user?.rooms = user?.rooms?.filter((user) => user.ws === ws);
    }
  });

  ws.send("socket connection successful");
});

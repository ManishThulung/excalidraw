import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/prisma";

const wss = new WebSocketServer({ port: 8090 });

interface Room {
  ws: WebSocket;
  userId: string;
}

let users: Record<string, Room[]> = {};

wss.on("connection", function connection(ws, req) {
  // console.log(req.headers.cookie?.split(" token=")[1], "sfasfda");
  // const url = req.url;
  // if (!url) {
  //   ws.close();
  //   return;
  // }

  // const queryParams = new URLSearchParams(url.split("?")[1]);
  // const token = queryParams.get("token") || "";
  const token =
    req.headers.cookie?.split(" token=")[1] ||
    req.headers.cookie?.split("token=")[1] ||
    "";
  console.log(token, "tokentokentokentoken");
  let userId: string;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // @ts-ignore
    userId = decoded.payload.id;

    // @ts-ignore
    if (!decoded && !decoded.payload.id) {
      ws.close();
      return;
    }
  } catch (error) {
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

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type == "join_room") {
      const { room } = parsedData;
      console.log(`user: ${userId} joined room ${room}`);
      if (!users[room]) {
        users[room] = [];
      }
      users[room]?.push({ ws, userId });
    }

    if (parsedData.type == "leave_room") {
      const { room } = parsedData;
      console.log(`user: ${userId} left room ${room}`);

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
      console.log(`chat sent by ${userId}`);
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

    if (parsedData.type == "draw") {
      const { room, content, toolType } = parsedData;
      console.log(`drawn ${toolType} by user: ${userId} in room: ${room}`);
      if (!users[room]) {
        ws.close();
        return;
      }

      const contentData = JSON.stringify(content);
      const payload = {
        data: contentData,
        type: toolType,
        roomId: room,
        userId,
        isDraw: true,
      };

      users[room]?.forEach((user) => {
        user && user.ws.send(JSON.stringify(payload));
      });

      try {
        await prisma.shape.create({
          data: {
            type: toolType,
            content: contentData,
            roomId: Number(room),
            userId: Number(userId),
          },
        });
      } catch (error) {
        console.error("Error saving shape to database:", error);
      }
    }
  });

  ws.send("socket connection successful");
});

function shutdown() {
  console.log("Shutting down WebSocket server...");

  wss.clients.forEach((client) => {
    client.close();
  });

  wss.close(() => {
    console.log("WebSocket server closed");
    process.exit(0);
  });
}

process.on("SIGINT", shutdown); // Ctrl + C
process.on("SIGTERM", shutdown); // kill command
process.on("exit", shutdown);

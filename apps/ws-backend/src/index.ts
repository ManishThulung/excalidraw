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
const wsRoomMap = new Map<WebSocket, string>();

wss.on("connection", function connection(ws, req) {
  const token =
    req.headers.cookie?.split(" token=")[1] ||
    req.headers.cookie?.split("token=")[1] ||
    "";
  console.log(token, "tokentokentokentoken");
  let userId: string;
  let username: string;
  let photo: string | null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    userId = (decoded as any).payload.id;
    username = (decoded as any).payload.username;
    photo = (decoded as any).payload.photo;

    // @ts-ignore
    if (!decoded && !decoded.payload.id) {
      ws.close();
      return;
    }
  } catch (error) {
    ws.close();
    return;
  }

  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.event == "join_room") {
      const { room } = parsedData;
      console.log(`user: ${userId} joined room ${room}`);
      if (!users[room]) {
        users[room] = [];
      }
      // prevent duplicate ws
      const exists = users[room].some((user) => user.ws === ws);

      if (!exists) {
        users[room].push({ ws, userId });
        wsRoomMap.set(ws, room);
      }
    }

    if (parsedData.event == "leave_room") {
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

    if (parsedData.event == "chat") {
      console.log(`chat sent by ${userId}`);
      const { room, message } = parsedData;

      if (!users[room]) {
        ws.close();
        return;
      }
      const payload = {
        event: parsedData.event,
        message,
        roomId: room,
        createdAt: new Date(),
        user: {
          username,
          id: userId,
          photo,
        },
      };
      // console.log(users[room], "roooooom users");
      users[room]?.forEach((user) => {
        user && user.ws.send(JSON.stringify(payload));
      });

      try {
        await prisma.chat.create({
          data: {
            message,
            roomId: Number(room),
            userId: Number(userId),
          },
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (parsedData.event == "draw" || parsedData.event == "update") {
      const { room, content, type, id, event } = parsedData;
      console.log(`${event} ${type} by user: ${userId} in room: ${room}`);
      if (!users[room]) {
        ws.close();
        return;
      }

      const contentData = JSON.stringify(content);
      const payload = {
        event,
        id,
        content: contentData,
        type: type,
        roomId: room,
        userId,
        isDraw: true,
      };

      users[room]?.forEach((user) => {
        user && user.ws.send(JSON.stringify(payload));
      });

      try {
        event === "draw" &&
          (await prisma.shape.create({
            data: {
              id,
              type,
              content: contentData,
              roomId: Number(room),
              userId: Number(userId),
            },
          }));
        event === "update" &&
          (await prisma.shape.update({
            where: { id },
            data: {
              content: contentData,
            },
          }));
      } catch (error) {
        console.error("Error saving shape to database:", error);
      }
    }
  });

  ws.on("close", () => {
    const room = wsRoomMap.get(ws);
    if (!room) return;

    users[room] = (users[room] || []).filter((user) => user.ws !== ws);

    wsRoomMap.delete(ws);

    console.log(`user ${userId} disconnected from room ${room}`);
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

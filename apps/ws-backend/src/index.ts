import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8070 });

wss.on("connection", function connection(ws, req) {
  const url = req.url;
  if (!url) {
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const decoded = jwt.verify(token, JWT_SECRET);

  // @ts-ignore
  if (!decoded && !decoded.userId) {
    ws.close();
    return;
  }
  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});

export const JWT_SECRET = "123333";

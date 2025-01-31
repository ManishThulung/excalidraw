import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8080?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6InJhbUBnbWFpbC5jb20iLCJuYW1lIjoicmFtIiwicGhvdG8iOm51bGx9LCJpYXQiOjE3MzgzNDQ4MDR9.5OFre7DsdWq68iesr0ZSwrycqodBV1l_P2GxjxwKVMc`
    );
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", room: roomId }));
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { loading, socket };
};

import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `ws://localhost:8009?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2QiOnsiaWQiOjIsInVzZXJuYW1lIjoicmFtdUBnbWFpbC5jb20iLCJuYW1lIjoicmFtdSIsInBob3RvIjpudWxsfSwiaWF0IjoxNzM2Njk4MTE3fQ.Hk4PhkC68hugGF9G3iF_c1YpYZ5Rq5eV_xz0R68llvQ`
    );
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", room: roomId }));
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { loading, socket };
};

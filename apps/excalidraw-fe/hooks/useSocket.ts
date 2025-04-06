import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", room: roomId }));
      setLoading(false);
      setSocket(ws);
    };
  }, []);

  return { loading, socket };
};

import { useEffect, useState } from "react";

export const useSocket = (roomId: string) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8090`);
    ws.onopen = () => {
      ws.send(JSON.stringify({ event: "join_room", room: roomId }));
      setLoading(false);
      setSocket(ws);
    };
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setLoading(false);
    };

    return () => {
      console.log("cleanup socket");

      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            event: "leave_room",
            room: roomId,
          }),
        );
      }

      ws.close(); // IMPORTANT
    };
  }, [roomId]);

  return { loading, socket };
};

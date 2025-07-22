"use client";

import { useSocket } from "@/hooks/useSocket";
import React, { useEffect } from "react";
import Canvas from "./Canvas";

const CanvasRoom = ({ roomId }: { roomId: string }) => {
  const { loading, socket } = useSocket(roomId);

  if (loading || !socket) {
    return <div>Connecting to room</div>;
  }
  return <Canvas roomId={roomId} socket={socket} />;
};

export default CanvasRoom;

// function Canvas({ socket }: { socket: any }) {
//   useEffect(() => {
//     socket.onmessage = (e) => {
//       console.log(e, "eee");
//     };
//   }, [socket]);

//   /// rest of the code
//   return <div>hello</div>;
// }

// Socket.onmessage is not listining incoming messages

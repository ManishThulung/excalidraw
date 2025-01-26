"use client";

import { useSocket } from "@/hooks/useSocket";
import React from "react";
import Canvas from "./Canvas";

const CanvasRoom = ({ roomId }: { roomId: string }) => {
  const { loading, socket } = useSocket(roomId);

  if (loading || !socket) {
    return <div>Connecting to room</div>;
  }
  return (
    <>
      <Canvas roomId={roomId} socket={socket} />
    </>
  );
};

export default CanvasRoom;

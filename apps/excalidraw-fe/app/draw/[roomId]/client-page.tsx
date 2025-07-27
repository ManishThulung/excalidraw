"use client";

import { Canvas } from "@/components/draw/canvas";
import { useSocket } from "@/hooks/useSocket";

const ClientPage = ({ roomId }: { roomId: string }) => {
  const { loading, socket } = useSocket(roomId);

  if (loading || !socket) return <>loading.....</>;
  return <Canvas socket={socket} roomId={roomId} />;
};

export default ClientPage;

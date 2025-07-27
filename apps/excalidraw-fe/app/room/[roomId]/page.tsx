import CanvasRoom from "@/components/CanvasRoom";

const page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const roomId = (await params).roomId;
  return <CanvasRoom roomId={roomId} />;
};

export default page;

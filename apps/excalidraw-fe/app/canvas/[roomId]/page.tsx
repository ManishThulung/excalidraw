import Canvas from "@/components/Canvas";

const page = async ({ params }: { params: { roomId: string } }) => {
  const roomId = (await params).roomId;
  return <Canvas roomId={roomId} />;
};

export default page;

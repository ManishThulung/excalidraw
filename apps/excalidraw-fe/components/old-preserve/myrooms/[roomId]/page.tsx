import ClientPage from "./client-page";

const page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const { roomId } = await params;
  return <ClientPage roomId={roomId} />;
};

export default page;

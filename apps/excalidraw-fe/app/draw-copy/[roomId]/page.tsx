import { Canvas } from "@/components/draw/canvas";

const page = () => {
  return <Canvas />;
  // return (
  //   <DrawingProvider>
  //     <div className="h-screen w-full flex flex-col bg-black">
  //       <Toolbar />
  //       <div className="flex-1 relative overflow-hidden">
  //         <Canvas />
  //       </div>
  //     </div>
  //   </DrawingProvider>
  // );
};

export default page;

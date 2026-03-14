import { Toolbar } from "@/components/draw/toolbar";
import { DrawingProvider } from "@/contexts/drawing-context-copy";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DrawingProvider>
      <div className="h-screen w-full flex flex-col bg-black">
        <Toolbar />
        <div className="flex-1 relative overflow-hidden">{children}</div>
      </div>
    </DrawingProvider>
  );
}

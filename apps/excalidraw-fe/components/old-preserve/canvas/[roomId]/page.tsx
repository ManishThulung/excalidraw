import CanvasRoom from "@/components/CanvasRoom";

const page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
  const roomId = (await params).roomId;
  return <CanvasRoom roomId={roomId} />;
};

export default page;

// case Tools.Arrow:
//             const startCoordinate = { x: startX, y: startY };
//             const endCoordinate = { x: e.clientX, y: e.clientY };
//             const headLength = 15;
//             const PI = Math.PI;
//             const degreesInRadians225 = (225 * PI) / 180;
//             const degreesInRadians135 = (135 * PI) / 180;
//             const dx = endCoordinate.x - startCoordinate.x;
//             const dy = endCoordinate.y - startCoordinate.y;
//             const angle = Math.atan2(dy, dx);
//             const x225 =
//               endCoordinate.x +
//               headLength * Math.cos(angle + degreesInRadians225);
//             const y225 =
//               endCoordinate.y +
//               headLength * Math.sin(angle + degreesInRadians225);
//             const x135 =
//               endCoordinate.x +
//               headLength * Math.cos(angle + degreesInRadians135);
//             const y135 =
//               endCoordinate.y +
//               headLength * Math.sin(angle + degreesInRadians135);

//             context.beginPath();
//             context.moveTo(startCoordinate.x, startCoordinate.y);
//             context.lineTo(endCoordinate.x, endCoordinate.y);
//             context.moveTo(endCoordinate.x, endCoordinate.y);
//             context.lineTo(x225, y225);
//             context.moveTo(endCoordinate.x, endCoordinate.y);
//             context.lineTo(x135, y135);
//             context.stroke();
//             break;

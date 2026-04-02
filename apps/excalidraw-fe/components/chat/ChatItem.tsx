import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItemProps {
  chat: { message: string; createdAt: Date };
  sender: {
    username: string;
    id: string;
    photo: string | null;
  };
}

function formatHourMinuteWithAmPm(timestamp: string | Date) {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function MessageItem({ chat, sender }: MessageItemProps) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-10 w-10 ">
        <AvatarImage
          src={sender.photo || "/placeholder.svg"}
          alt={sender.username}
        />
        <AvatarFallback className="bg-gray-700">
          {sender?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{sender?.username}</span>
          <span className="text-xs text-gray-300">
            {formatHourMinuteWithAmPm(chat.createdAt)}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-line text-wrap text-sm text-gray-100 [overflow-wrap:anywhere]">
          {chat.message}
        </p>
      </div>
    </div>
  );
}

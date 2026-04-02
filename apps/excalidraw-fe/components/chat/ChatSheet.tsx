"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/config/http-request";
import { useSocket } from "@/hooks/useSocket";
import { PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatInputForm } from "./ChatInput";
import MessageItem from "./ChatItem";

export function ChatSheet({ roomId }: { roomId: number }) {
  const { socket } = useSocket(roomId.toString());
  const [chats, setChats] = useState<any>([]);

  const getChats = async () => {
    const res = await api.get(`/chats/${roomId}`);
    setChats(res.data.chats);
  };
  useEffect(() => {
    getChats();
  }, [roomId]);
  console.log(chats, "dhssss");

  useEffect(() => {
    if (!socket) return;
    socket.onmessage = (event) => {
      const data = event && JSON?.parse(event.data || "");
      console.log(data, "dataaaaaaaaaaaaa");
      if (data?.action !== "chat") return;
      const transformedData = {
        id: Math.random(),
        message: data.message,
        createdAt: data.createdAt,
        user: data.user,
      };
      setChats((prev) => [...prev, transformedData]);
    };
  }, [roomId, socket]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <PanelLeftOpen className="text-black cursor-pointer" />
      </SheetTrigger>

      <SheetContent className="flex justify-between flex-col">
        <div className="flex gap-4 flex-col">
          <SheetHeader>
            <SheetTitle>Start chatting with teams.</SheetTitle>
            {/* <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription> */}
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            {chats.length <= 0 ? (
              <>no chats</>
            ) : (
              <>
                {chats?.map((chat) => (
                  <MessageItem
                    key={chat.id}
                    chat={{ message: chat.message, createdAt: chat.createdAt }}
                    sender={{
                      username: chat.user.username,
                      id: chat.user.id,
                      photo: chat.user.photo,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <SheetFooter>
          <ChatInputForm roomId={roomId} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

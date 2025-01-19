"use client";

import React, { useEffect, useState } from "react";

const page = ({ params }: { params: { slug: string } }) => {
  const [ws, setWs] = useState<WebSocket>();
  const [messages, setMessages] = useState<string[]>([]);
  const [value, setValue] = useState<string>("");

  const resolvedParams = React.use(params as any);
  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8009?token=${resolvedParams?.slug}`
    );
    socket && setWs(socket);
    console.log(socket, "socket");
    if (socket) {
      socket.onopen = () => {
        socket.send(JSON.stringify({ type: "join_room", room: "room-1" }));
      };
      socket.onmessage = (message) => {
        console.log(message, "msg");
        setMessages((prev) => [...prev, message.data]);
      };
    }

    // return () => {
    //   socket?.close();
    // };
  }, []);

  const handleSend = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "chat", room: "room-1", message: value }));
      setValue("");
    }
  };

  // useEffect(() => {
  //   if (ws) {
  //     ws.onmessage = (message) => {
  //       console.log(message, "msg");
  //       setMessages((prev) => [...prev, message.data]);
  //     };
  //   }
  // }, [ws, handleSend]);

  const handleLeave = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: "leave_room", room: "room-1" }));
      ws.close();
    }
  };

  return (
    <div>
      <div className="w-1/2 h-9">
        {messages.map((message, i) => (
          <p key={message + i}>{message}</p>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Type your message"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <button onClick={handleLeave}>Leave room</button>
    </div>
  );
};

export default page;

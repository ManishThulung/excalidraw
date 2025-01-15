"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();

  const [value, setValue] = useState<string>("");
  const handleJoin = async () => {
    const res = await fetch("http://localhost:8000/api/room", {
      method: "POST",
      body: JSON.stringify({ slug: value }),
      headers: {
        authorization: `bearer toeknlksdfsaf`,
      },
    });
    const data = await res.json();

    router.push(`room/${data?.data?.room?.slug}`);
  };
  return (
    <div className="flex gap-8 text-center mt-10">
      <input
        className="py-3 px-4"
        type="text"
        placeholder="Join a room"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleJoin} className="py-3 px-10 bg-slate-600 rounded">
        Join
      </button>
    </div>
  );
}

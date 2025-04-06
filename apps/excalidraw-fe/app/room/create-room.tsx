"use client";

import { api } from "@/config/http-request";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateRoom = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const slug = formData.get("name");

    try {
      const res = await api.post("/room", { slug });

      if (res.data.success) {
        router.push(`/room/${res.data.room.slug}`);
      }
    } catch (err: any) {
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Create a New Room</h1>
      <form
        className="mt-4 flex flex-col justify-start w-[500px]"
        onSubmit={submitHandler}
      >
        <div className="flex gap-6 items-center">
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Room Name"
            className="block px-4 w-[350px] h-[39px] rounded-md border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default CreateRoom;

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
    const name = formData.get("name");

    try {
      const res = await api.post("/api/room", { name });

      if (res.data.success) {
        router.push("/room");
      } else {
        setError("Signin failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Create a New Room</h1>
      <form
        className="mt-4 flex justify-between items-center w-[500px]"
        onSubmit={submitHandler}
      >
        <div className="flex flex-col">
          {/* <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Room Name
          </label> */}
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Room Name"
            className="block px-4 w-[370px] h-[39px] rounded-md border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? "Creating..." : "Create Room"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoom;

"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function Home() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // @ts-ignore: content is valid for user messages
    await sendMessage({ role: "user", content: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-black text-green-500 font-mono p-4">
      <div className="flex-1 overflow-y-auto mb-4 border border-green-900 p-4 rounded">
        {messages.length === 0 && (
          <div className="text-center mt-10 text-green-700">
            Genesis Architect Online. Awaiting Instructions.
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <span className="font-bold">{m.role === "user" ? "> " : "# "}</span>
            {/* @ts-ignore: content exists on message usually */}
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          className="flex-1 bg-black border border-green-700 p-2 text-green-500 focus:outline-none focus:border-green-500"
          value={input}
          onChange={handleInputChange}
          placeholder="Enter command..."
          disabled={status === "streaming" || status === "submitted"}
        />
        <button
          type="submit"
          className="bg-green-900 text-black px-4 py-2 font-bold hover:bg-green-700 disabled:opacity-50"
          disabled={status === "streaming" || status === "submitted"}
        >
          EXECUTE
        </button>
      </form>
    </div>
  );
}

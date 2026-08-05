"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex flex-col h-full">
      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">AI Workspace</h2>
              <p>开始一段新的对话</p>
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2">
              <div className="animate-pulse">思考中...</div>
            </div>
          </div>
        )}
      </div>

      {/* 输入区域 */}
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="输入消息..."
            className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          <Button type="submit" disabled={isLoading}>
            发送
          </Button>
        </form>
      </div>
    </div>
  );
}

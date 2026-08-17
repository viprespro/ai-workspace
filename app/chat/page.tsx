"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat/chat-input";
import { MessageList } from "@/components/chat/message-list";
import { Sidebar } from "@/components/chat/sidebar";
import type { LocalSession } from "@/types/chat";

const STORAGE_KEY = "ai-workspace:chat-sessions";

function loadSessions(): LocalSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalSession[]) : [];
  } catch {
    return [];
  }
}

export default function ChatPage() {
  const { messages, sendMessage, status, error, setMessages } = useChat();
  const [sessions, setSessions] = useState<LocalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastSyncedKeyRef = useRef("");

  const isLoading = status === "submitted" || status === "streaming";
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 首次渲染后从 localStorage 恢复会话（只在客户端执行，避免 hydration 首屏不一致）
  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  // 会话列表变更时持久化到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch {
      // 忽略存储配额等异常
    }
  }, [sessions]);

  // 流式输出期间消息持续变化，用内容签名判断真正变化后才写回会话，防止循环更新
  useEffect(() => {
    if (!activeSessionId) return;
    const last = messages[messages.length - 1];
    const signature = `${messages.length}:${last?.id ?? ""}:${last?.parts?.length ?? 0}`;
    if (signature === lastSyncedKeyRef.current) return;
    lastSyncedKeyRef.current = signature;
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages, updatedAt: Date.now() }
          : s
      )
    );
  }, [messages, activeSessionId]);

  const handleSend = (text: string) => {
    const content = text.trim();
    if (!content || isLoading) return;
    if (!activeSessionId) {
      const session: LocalSession = {
        id: crypto.randomUUID(),
        title: content.length > 30 ? `${content.slice(0, 30)}…` : content,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
    }
    sendMessage({ text: content });
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    if (!session) return;
    setActiveSessionId(id);
    setMessages(session.messages);
    setSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* 左侧边栏 */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* 右侧主区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶部栏 */}
        <header className="flex items-center gap-2 border-b px-3 py-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="打开侧边栏"
          >
            <PanelLeft />
          </Button>
          <h1 className="truncate text-sm font-medium">
            {activeSession?.title ?? "新对话"}
          </h1>
        </header>

        {/* 消息区 + 底部输入框 */}
        <main className="flex min-h-0 flex-1 flex-col">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSend={handleSend}
          />
          <ChatInput disabled={isLoading} onSend={handleSend} />
        </main>
      </div>
    </div>
  );
}

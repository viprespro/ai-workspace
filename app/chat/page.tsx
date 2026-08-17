"use client";

import { useChat } from "@ai-sdk/react";
import { isTextUIPart } from "ai";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

// —— 外部存储封装：会话列表统一读写 localStorage，供 useSyncExternalStore 订阅 ——
let cachedSessions: LocalSession[] | null = null;
const sessionListeners = new Set<() => void>();

function readSessions(): LocalSession[] {
  if (cachedSessions === null) cachedSessions = loadSessions();
  return cachedSessions;
}

function notifySessionChange() {
  cachedSessions = null; // 使缓存失效，触发订阅者重新读取
  sessionListeners.forEach((listener) => listener());
}

function updateSessions(updater: (prev: LocalSession[]) => LocalSession[]) {
  const next = updater(readSessions());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 忽略存储配额等异常
  }
  notifySessionChange();
}

function subscribeSessions(callback: () => void): () => void {
  sessionListeners.add(callback);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) notifySessionChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sessionListeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

// hydration / SSR 阶段的服务端快照：必须是稳定引用（模块级常量），否则 React 判定快照持续变化而告警
const EMPTY_SESSIONS: LocalSession[] = [];

export default function ChatPage() {
  const { messages, sendMessage, status, error, setMessages } = useChat();
  // 订阅外部存储读取会话列表：hydration 阶段用服务端快照（空），挂载后再读 localStorage，避免首屏不一致
  const sessions = useSyncExternalStore(subscribeSessions, readSessions, () => EMPTY_SESSIONS);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lastSyncedKeyRef = useRef("");

  const isLoading = status === "submitted" || status === "streaming";
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // 流式输出期间消息持续变化，用内容签名判断真正变化后才写回会话，防止循环更新
  useEffect(() => {
    if (!activeSessionId) return;
    const last = messages[messages.length - 1];
    // 签名要能反映流式追加的文本：流式期间 messages.length / id / parts 长度都不变，只有文本在增长
    const lastText =
      last?.parts?.filter(isTextUIPart).map((part) => part.text).join("") ?? "";
    const signature = `${messages.length}:${last?.id ?? ""}:${lastText.length}:${lastText.slice(-64)}`;
    if (signature === lastSyncedKeyRef.current) return;
    lastSyncedKeyRef.current = signature;
    updateSessions((prev) =>
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
      updateSessions((prev) => [session, ...prev]);
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
    updateSessions((prev) => prev.filter((s) => s.id !== id));
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

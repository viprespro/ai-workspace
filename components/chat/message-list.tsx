"use client";

import { useEffect, useRef } from "react";
import { isTextUIPart, type UIMessage } from "ai";
import { Markdown } from "./markdown";

const SUGGESTIONS = [
  "用通俗的语言解释 RAG 检索增强生成",
  "帮我写一份产品需求文档（PRD）大纲",
  "写一个 Python 脚本批量重命名文件",
  "分析这段代码的性能瓶颈",
];

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  error: Error | undefined;
  onSend: (text: string) => void;
}

function messageText(message: UIMessage): string {
  // ai@6 的 UIMessage 以 parts 为准，用类型守卫收窄出文本部分
  const partsText =
    message.parts
      ?.filter(isTextUIPart)
      .map((part) => part.text)
      .join("") ?? "";
  // 兜底兼容仅存 content 的旧会话数据（ai@6 类型未声明 content，但运行时的历史数据里可能存在）
  return partsText || (message as { content?: string }).content || "";
}

export function MessageList({
  messages,
  isLoading,
  error,
  onSend,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新消息或流式输出时自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  // 空状态：欢迎语 + 建议提示词
  if (messages.length === 0 && !isLoading) {
    return (
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex h-full flex-col items-center justify-center px-4 pb-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            AI Workspace
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            今天想聊点什么？
          </p>
          <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSend(suggestion)}
                className="rounded-xl border bg-card p-3 text-left text-sm transition-colors hover:bg-muted"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
        {messages.map((message) =>
          message.role === "user" ? (
            <div key={message.id} className="flex justify-end">
              <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-muted px-4 py-2.5 text-[15px] leading-relaxed">
                {messageText(message)}
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex justify-start">
              <div className="w-full text-[15px] leading-relaxed">
                <Markdown content={messageText(message)} />
              </div>
            </div>
          )
        )}
        {isLoading && (
          <div className="flex items-center gap-1 py-1.5">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2.5 text-sm text-destructive">
            发送失败：{error.message}
          </div>
        )}
      </div>
    </div>
  );
}

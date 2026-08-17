"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, Paperclip } from "lucide-react";

interface ChatInputProps {
  disabled?: boolean;
  onSend: (text: string) => void;
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleSubmit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
    const el = textareaRef.current;
    if (el) el.style.height = "auto";
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-3 pt-1">
      <div
        className={cn(
          "rounded-[26px] border border-input bg-background shadow-sm transition-shadow",
          "focus-within:border-ring focus-within:shadow-md"
        )}
      >
        <div className="flex items-end gap-2 px-2.5 pt-2">
          <button
            className="mb-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
            aria-label="添加附件"
          >
            <Paperclip className="size-4" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onInput={autoResize}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="给 AI 发送消息"
            className="max-h-[200px] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSubmit}
            disabled={!canSend}
            className={cn(
              "mb-1 flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
              canSend
                ? "bg-primary text-primary-foreground hover:opacity-80"
                : "bg-muted text-muted-foreground"
            )}
            aria-label="发送"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        AI 可能会出错，请核实重要信息
      </p>
    </div>
  );
}

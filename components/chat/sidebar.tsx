"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CircleUserRound,
  MessageSquare,
  Plus,
  Trash2,
} from "lucide-react";
import type { LocalSession } from "@/types/chat";

interface SidebarProps {
  sessions: LocalSession[];
  activeSessionId: string | null;
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  open,
  onClose,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}: SidebarProps) {
  return (
    <>
      {/* 移动端遮罩 */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* 新建对话 */}
        <div className="p-2.5">
          <Button
            variant="secondary"
            size="lg"
            className="w-full justify-start gap-2 rounded-xl"
            onClick={onNewChat}
          >
            <Plus className="size-4" />
            新建对话
          </Button>
        </div>

        {/* 历史会话 */}
        <div className="flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-2.5">
          {sessions.length === 0 && (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground">
              暂无历史会话
            </p>
          )}
          {sessions.map((session) => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectSession(session.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelectSession(session.id);
              }}
              className={cn(
                "group flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                session.id === activeSessionId
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/60"
              )}
            >
              <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{session.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="hidden size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted group-hover:flex"
                aria-label="删除会话"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* 用户区 */}
        <div className="border-t border-sidebar-border p-2.5">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <CircleUserRound className="size-8 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">游客</p>
              <p className="truncate text-xs text-muted-foreground">未登录</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

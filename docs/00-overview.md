# 项目概览

## 项目名称
AI Workspace — 企业级 AI Agent 平台

## 项目定位
面向企业场景的 AI 工作台系统，提供类似 ChatGPT 的聊天体验，支持知识库问答（RAG）、Agent Tool Calling、异步任务中心等功能。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Next.js 16 (App Router) + React 19 |
| 语言 | TypeScript |
| 样式 | TailwindCSS 4 + shadcn/ui |
| 状态管理 | Zustand |
| 数据请求 | React Query (TanStack) |
| AI SDK | Vercel AI SDK (`ai`) + OpenAI SDK |
| 数据库 | PostgreSQL + Prisma ORM |
| 向量数据库 | pgvector (Prisma `Unsupported("vector(1536)")`) |
| 认证 | NextAuth v5 (beta) |
| 校验 | Zod |
| 部署 | Docker + docker-compose |
| 包管理 | pnpm |

## 目录结构

```
ai-workspace/
├── app/                    # Next.js App Router
│   ├── api/                # Route Handlers (后端 API)
│   │   ├── auth/           # NextAuth 认证
│   │   ├── chat/           # AI 聊天 (SSE 流式)
│   │   ├── config/         # 系统配置
│   │   ├── knowledge/      # 知识库 (上传/检索)
│   │   ├── sessions/       # 会话管理
│   │   └── tasks/          # Agent 任务中心
│   ├── chat/               # 聊天页面
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页 (重定向到 /chat)
├── components/             # UI 组件
│   ├── ui/                 # shadcn/ui 基础组件
│   └── providers.tsx       # 全局 Provider
├── lib/                    # 工具库
│   ├── auth.ts             # NextAuth 配置
│   ├── prisma.ts           # Prisma Client 单例
│   └── utils.ts            # 通用工具函数
├── prisma/
│   └── schema.prisma       # 数据库 Schema
├── stores/                 # Zustand 状态
│   ├── app-store.ts
│   └── chat-store.ts
├── types/
│   └── index.ts            # 全局类型定义
├── public/                 # 静态资源
├── Dockerfile
├── docker-compose.yml
└── ai-workspace-prd.md                  # 产品需求文档
```

## 入口点

- **前端入口**: `app/layout.tsx` → `app/page.tsx` (重定向到 `/chat`)
- **API 入口**: `app/api/**/route.ts` (Next.js Route Handlers)
- **数据库入口**: `prisma/schema.prisma` → `lib/prisma.ts`
- **认证入口**: `lib/auth.ts` + `app/api/auth/`

## 核心功能模块

1. **AI 聊天** — 流式输出 (SSE)、Markdown 渲染、代码高亮、上下文记忆
2. **会话管理** — 创建/删除会话、消息持久化
3. **知识库 (RAG)** — 文档上传、切片、Embedding、向量检索、引用来源
4. **文件分析** — PDF/Excel/Word/图片分析
5. **Agent 工具调用** — Function Calling、多工具、Agent 循环
6. **任务中心** — 异步任务、状态跟踪 (pending → running → success/failed)
7. **用户系统** — 登录注册、角色权限 (user/admin)
8. **系统配置** — 模型管理、Prompt 管理、API Key 管理
9. **MCP 扩展** — 预留 MCP Server 接口

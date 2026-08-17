# What U Can Learn — AI Workspace 学习清单

> 从这个项目可以学到的知识点清单。掌握一项后，把 `[ ]` 改为 `[x]` 即可勾选。
> 每个知识点附「在哪学」（对应代码文件）和「掌握标准」（自测方法）。

@Author: Ares

---

## 一、Next.js App Router 全栈架构

- [ ] **Route Handlers（API 端点）**
  - 在哪学：`app/api/chat/route.ts`、`app/api/sessions/route.ts`
  - 要学：`export async function POST(req: Request)` 的写法、GET/POST 约定、为什么本项目禁止 `pages/api`
  - 掌握标准：能自己新建一个 `app/api/xxx/route.ts` 并正确返回 JSON

- [ ] **动态路由与路由参数**
  - 在哪学：`app/api/sessions/[id]/route.ts`（若存在）
  - 要学：`context.params` 的解构方式（Next.js 16 中为 Promise，需 await）
  - 掌握标准：能说明动态路由参数在 Next 15+ 中的异步特性

- [ ] **页面路由与重定向**
  - 在哪学：`app/page.tsx` → `/chat` 的跳转逻辑、`app/layout.tsx` 根布局
  - 掌握标准：能说明 App Router 中 layout / page 的嵌套渲染机制

- [ ] **前端→API→数据库的完整链路**
  - 在哪学：`app/chat/` → `stores/chat-store.ts` → `app/api/chat/route.ts` → `lib/prisma.ts`
  - 掌握标准：能口述一条聊天消息从前端发起到落库的完整路径

## 二、AI 流式输出（Vercel AI SDK）

- [ ] **streamText() 与 SSE**
  - 在哪学：`app/api/chat/route.ts`
  - 要学：`streamText()` 生成流、`toDataStreamResponse()` 返回 `text/event-stream`
  - 掌握标准：能解释为什么流式输出不能用普通 JSON 一次返回，SSE 协议长什么样

- [ ] **前端消费流式响应**
  - 在哪学：`stores/chat-store.ts` 或 `app/chat/` 页面
  - 要学：AI SDK 的 `useChat()` / `useCompletion()` 或手动 fetch stream 的增量解析
  - 掌握标准：能手动 fetch 一个 SSE 接口并逐段渲染文本

- [ ] **上下文记忆（多轮对话）**
  - 在哪学：`app/api/chat/route.ts` 中消息数组的组装
  - 要学：如何把历史 `ChatMessage` 拼进 messages 传给 LLM
  - 掌握标准：能说明 system/user/assistant 三种角色的作用与顺序

## 三、RAG 知识库

- [ ] **文档处理链路**
  - 在哪学：`app/api/knowledge/`、`KnowledgeFile` 模型
  - 要学：上传 → 解析（PDF/DOCX/TXT/MD）→ 状态流转 processing/completed/failed
  - 掌握标准：能说明一个文件从上传到可检索经历了哪些步骤

- [ ] **切片与向量化**
  - 在哪学：`KnowledgeChunk` 模型（content + chunkIndex + embedding）
  - 要学：为什么文档要切片、Embedding 是什么、1536 维的含义
  - 掌握标准：能解释切片大小对检索质量的影响

- [ ] **pgvector 向量检索**
  - 在哪学：`prisma/schema.prisma` 的 `Unsupported("vector(1536)")`、`docker-compose.yml`
  - 要学：PostgreSQL 向量扩展、为什么镜像必须是 `pgvector/pgvector`
  - 掌握标准：能写出基本的余弦相似度检索 SQL 概念

## 四、Prisma 高级用法

- [ ] **PrismaPg adapter 驱动**
  - 在哪学：`lib/prisma.ts`
  - 要学：`new PrismaPg({ connectionString })` + `new PrismaClient({ adapter })` 的写法
  - 掌握标准：能说明 adapter 模式与默认驱动模式的区别

- [ ] **自定义 Client 输出路径**
  - 在哪学：`prisma/schema.prisma` 的 `output = "../lib/generated/prisma"`
  - 要学：为什么生成到项目内而非 node_modules、改动 schema 后必须 `pnpm prisma generate`
  - 掌握标准：能独立完成 schema 改动 → generate → 使用新字段

- [ ] **prisma.config.ts 配置**
  - 在哪学：`prisma.config.ts`
  - 要学：Prisma 7 中配置迁移路径与 datasource url 的新方式（dotenv）
  - 掌握标准：能说明迁移命令在哪里读取 DATABASE_URL

- [ ] **模型关系与级联删除**
  - 在哪学：`prisma/schema.prisma`（User → ChatSession → ChatMessage 等）
  - 要学：`@relation`、`onDelete: Cascade`、`@@index`、`@default(cuid())`
  - 掌握标准：能画出 6 个核心模型的关联图并说明删除行为

## 五、NextAuth v5 认证

- [ ] **Credentials Provider + bcryptjs**
  - 在哪学：`lib/auth.ts`
  - 要学：authorize 回调、密码哈希与 `bcrypt.compare` 验证
  - 掌握标准：能说明为什么不能存明文密码

- [ ] **JWT Session 与角色注入**
  - 在哪学：`lib/auth.ts` 的 jwt / session 回调
  - 要学：如何把 `role`、`id` 写入 token 并在 session 中读取
  - 掌握标准：能解释 jwt 回调与 session 回调的执行时机

- [ ] **API 层权限保护**
  - 在哪学：`app/api/config/` 等需要 admin 的接口
  - 要学：`auth()` 取会话、按 `role === "admin"` 拦截
  - 掌握标准：能给一个现有接口加上仅管理员可访问的校验

## 六、状态管理分工

- [ ] **Zustand vs React Query**
  - 在哪学：`stores/chat-store.ts`（Zustand）、`components/providers.tsx`（React Query）
  - 要学：客户端即时状态用 Zustand、服务端数据用 React Query 的边界原则
  - 掌握标准：能判断一个新状态应该放哪个库，并说明理由

## 七、UI 与校验

- [ ] **TailwindCSS 4 + shadcn/ui + Base UI**
  - 在哪学：`components/ui/`、`components.json`、`app/globals.css`
  - 要学：组件组织方式、为什么基础组件用 `@base-ui/react`
  - 掌握标准：能新增一个 shadcn 风格组件并接入

- [ ] **Zod 参数校验**
  - 在哪学：`app/api/` 各 route 的入参解析
  - 要学：用 zod schema parse request body，失败返回 400
  - 掌握标准：能给新接口加上入参校验

## 八、Agent 与任务系统

- [ ] **异步任务状态机**
  - 在哪学：`AgentTask` 模型、`app/api/tasks/`
  - 要学：pending → running → success/failed 的流转、input/output JSON 设计
  - 掌握标准：能说明异步任务与同步请求的区别，为什么需要任务中心

- [ ] **Tool Calling（工具调用）**
  - 在哪学：`docs/00-overview.md` 中 Agent 模块描述（若代码已实现，看 `app/api/tasks/`）
  - 要学：LLM 如何通过 Function Calling 调用外部工具、Agent 循环
  - 掌握标准：能描述一次"LLM 决定调用工具→执行→结果回填"的完整循环

## 九、部署与工程化

- [ ] **Docker Compose 部署**
  - 在哪学：`docker-compose.yml`、`Dockerfile`
  - 要学：app 等待 db 健康检查（`condition: service_healthy`）、环境变量注入
  - 掌握标准：能解释 `depends_on` 的 condition 与普通 depends_on 的区别

- [ ] **Conventional Commits**
  - 在哪学：`docs/conventions.md`、`AGENTS.md` 的 Git SOP
  - 要学：`type(scope): summary` 规范、scope 使用模块名
  - 掌握标准：能给自己的改动写出规范 commit message

---

## 使用建议

- 建议按章节顺序学习：先架构 → 再 AI 流式 → RAG → Prisma → 认证
- 每个知识点动手改一次代码、跑通一次，再勾选
- 勾选后如果想复习，可随时取消勾选回到该知识点

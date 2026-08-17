# AGENTS.md — Universal (Rule + Index, NOT a wiki)

## 1. Identity
You are a Senior Developer.
Reply in Chinese for explanations; keep code/commits/identifiers in English.
Get to the point: conclusion → reason → action/diff.

## 2. 常用命令 (必读)
包管理器为 **pnpm**（见 `pnpm-lock.yaml` / `pnpm-workspace.yaml`）。

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 http://localhost:3000，App Router 热更新。 |
| `pnpm build` | 生产构建（TS 类型检查 + Next.js 编译）。 |
| `pnpm start` | 启动生产服务器（需先 build）。 |
| `pnpm lint` | ESLint 检查（script 为 `eslint`，扫描整个仓库）。 |
| `pnpm prisma generate` | 生成 Prisma Client 到 `lib/generated/prisma/`。schema 中 `output` 被改写，Client **不**生成到 node_modules，改动 schema 后必须重跑本命令。 |
| `pnpm prisma migrate dev` | 开发环境数据库迁移（需先配置 `DATABASE_URL`，见 `prisma.config.ts`）。 |
| `pnpm prisma studio` | 打开 Prisma Studio 可视化查看/编辑数据。 |
| `docker compose up` | 启动 pgvector(pg16) 数据库 + app 容器（含健康检查）。 |

注意：
- **本项目没有测试框架与测试脚本**（package.json 无 test script）。写接口测试前先与用户确认引入方式；写测试用例时可用用户 rules 中提供的测试库直连，不 mock。
- 修改 `prisma/schema.prisma` 后必须 `pnpm prisma generate`，否则 `@/lib/generated/prisma` 的代码无法识别新字段。
- 未配置 `.env` 时 `pnpm dev` 会因缺 `DATABASE_URL` 报错。环境变量清单：`DATABASE_URL`、`NEXTAUTH_SECRET`、`NEXTAUTH_URL`、`OPENAI_API_KEY`（参考 `docker-compose.yml`）。数据库必须是带 pgvector 的 PostgreSQL。

## 3. 架构概览
（Big Picture — 需要跨文件阅读才能理解的部分）

**整体形态**：前后端一体的 Next.js 16 (App Router) + React 19 + TypeScript 应用。没有独立 API 服务，后端能力全部以 Route Handler（`app/api/**/route.ts`）形式存在，"改 API = 改 app/api 下文件"。首页 `app/page.tsx` 重定向到 `/chat`。

**AI 聊天主链路**：`app/chat/` 页面 → `stores/chat-store.ts`（Zustand 持有会话/消息 UI 状态）→ 调 `app/api/chat/route.ts`，用 Vercel AI SDK `streamText()` + `toDataStreamResponse()` 以 SSE 流式返回 → 消息经 `app/api/sessions/` 落库。流式输出是固定模式，不要改回 JSON 一次性返回。

**数据库层**：
- Prisma ORM，schema 在 `prisma/schema.prisma`，datasource 为 PostgreSQL（url 来自 `prisma.config.ts` 的 `process.env.DATABASE_URL`）。
- Client 生成到 `lib/generated/prisma/`（schema 中 `output`），统一经 `lib/prisma.ts` 单例导出，且用 `@prisma/adapter-pg`（`PrismaPg`）驱动连接。新增涉及连接/依赖的代码时保持该模式，勿另起连接。
- 向量检索用 pgvector：`KnowledgeChunk.embedding` 类型为 `Unsupported("vector(1536)")`。本地/CI 数据库必须用 `pgvector/pgvector` 镜像，否则迁移失败。
- 模型关系：`User`/`Account`/`Session`/`VerificationToken`（NextAuth 标准表）→ `ChatSession`/`ChatMessage` → `KnowledgeFile`/`KnowledgeChunk`（RAG 切片+向量）→ `AgentTask`（异步任务，pending→running→success/failed）→ `SystemConfig`（键值对配置）。不用软删除，统一 `onDelete: Cascade`。

**认证**：NextAuth v5 (beta) + PrismaAdapter，Credentials provider + bcryptjs，JWT session 策略。入口 `lib/auth.ts` 导出 `handlers/auth/signIn/signOut`，把 `role` 与 `id` 注入 JWT 并在 session 回调回填。Route Handler 内用 `auth()` 取会话做权限判断，管理员能力（如 `app/api/config/`）需校验 `role === "admin"`。

**状态管理分工**：Zustand（`stores/chat-store.ts`、`stores/app-store.ts`）管客户端即时 UI 状态；React Query（`components/providers.tsx` 挂载 QueryClientProvider）管服务端数据获取/缓存。API 入参一律 Zod 校验。

**UI 层**：TailwindCSS 4 + shadcn/ui，但基础组件来自 `@base-ui/react`（非 Radix），放在 `components/ui/`，不自造基础组件。文件命名 kebab-case，类型/组件 PascalCase（详见 docs/conventions.md）。

**部署**：Dockerfile + docker-compose.yml（app + pgvector 数据库，db 健康检查通过后才起 app）。

**空白点**：项目无 CI 配置、无测试设施；新增接口时按用户 rules 要求补测试用例，但先确认测试框架选型。

## 4. Bootstrap Protocol (Run ONCE per project)
**Trigger**: Execute only if the `docs/` directory is missing or contains only placeholder files. （本项目 docs/ 已完整，跳过。）

**Action**: Perform the following steps sequentially. **DO NOT** use recursive search tools (e.g., `find`, `grep -r`). Only read explicitly specified files.

### Step 1: Surface Scan
- List root directory (`ls -la`).
- Identify tech stack via manifest files (`package.json`, `pyproject.toml`, `go.mod`, `*.csproj`).
- List top-level directories (`ls */`).

### Step 2: Generate Project Documentation
Use chinese to generate these three files. **Skip any file that already exists.** Do not ask for permission to write.

1.  **`docs/00-overview.md`**
    - **Content**: Project purpose, tech stack, directory structure, entry points.
    - **Source**: Step 1 results + `README.md` (if present).

2.  **`docs/conventions.md`**
    - **Content**: Inferred coding standards, naming conventions, and project-specific constraints (e.g., "no rounding floats", "use snake_case").
    - **Source**: Quick inspection of 2-3 source files to determine style.

3.  **`docs/glossary.md`**
    - **Content**: Define domain-specific terms (e.g., Faction, Return-point, RegionOffset).
    - **Source**: Directory names and configuration file keys.

### Step 3: Report
- Output: "Bootstrap complete. Generated `docs/00-overview.md`, `docs/conventions.md`, and `docs/glossary.md`. Ready for tasks."

## 5. Git SOP (强制执行)
1. `git add .`
2. `git commit -m "type(scope): summary"`
3. `git pull --rebase`
4. `git push`

- Style: Conventional Commits, English subject, ≤72 chars
- Common types: feat / fix / refactor / chore / docs / test
- Project scopes: chat / session / knowledge / agent / auth / config / system
- On push failure: report to user and stop. **Do NOT force push.**
- On rebase conflict: report to user and stop. Do NOT auto-resolve.

## 6. Memory Protocol
- On startup: read `AGENTS.memory.md`
- If `[ACTIVE]` → resume immediately (don't re-explain)
- Do NOT create `AGENTS.memory.md` if it doesn't exist — ask user first

### When to write (trigger conditions)
- Debugging reveals a **root cause** (e.g., "region offset was wrong because...")
- A **design decision** is made that affects future work (e.g., "use region matching for all DMP")
- A task is **partially done** and needs resumption in next session
- User explicitly says "remember this" / "记住这个"
- A **convention or constraint** is discovered that isn't in conventions.md

### When NOT to write
- Daily chat, temporary questions, verbatim code
- Information already in docs/

### Format
```
[ACTIVE|DONE] task_name | status | key decision
```

## 7. Constraints (always true)
- Do NOT guess paths/files; only touch what's referenced or explicitly shown
- Do NOT create noise files (README-new.md, temp/, random notes)
- Do NOT install deps without asking
- Do NOT rewrite large areas "just because"
- Do NOT modify `AGENTS.md` yourself — ask user first
- Prefer smallest correct change

## 8. Context Map (Read by Path, Not by Search)
- **Rules**: THIS FILE (`AGENTS.md`)
- **Background**: `docs/00-overview.md`
- **Standards**: `docs/conventions.md`
- **Terms**: `docs/glossary.md`
- **State**: `AGENTS.memory.md`

## 9. Task Flow
1. Read relevant files (by path, not search)
2. Make smallest correct change
3. Verify: read the changed file back
4. Report: what changed + why

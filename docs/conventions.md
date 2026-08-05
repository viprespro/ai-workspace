# 编码规范

## 通用

- 语言：TypeScript 严格模式
- 缩进：2 空格
- 引号：单引号（import 语句中）
- 分号：不使用
- 行尾逗号：多行时尾随逗号

## 命名

- 文件名：kebab-case（`chat-store.ts`、`app-store.ts`）
- 组件文件：kebab-case（`button.tsx`）
- React 组件：PascalCase 导出（`export default function Home()`）
- 变量/函数：camelCase
- 类型/接口：PascalCase（`ChatState`、`Message`）
- 常量：UPPER_SNAKE_CASE
- Prisma Model：PascalCase（`ChatSession`、`KnowledgeChunk`）
- API 路由目录：kebab-case 或复数名词（`sessions/`、`knowledge/`）

## 项目特定约束

- **禁止使用 `pages/api`**：所有后端 API 必须使用 App Router 的 Route Handlers (`app/api/**/route.ts`)
- **AI 流式输出**：使用 Vercel AI SDK 的 `streamText()` + `toDataStreamResponse()`，返回 `text/event-stream`
- **数据库字段**：Prisma Schema 中向量字段使用 `Unsupported("vector(1536)")` 类型
- **状态管理**：全局状态使用 Zustand，服务端数据使用 React Query
- **UI 组件**：使用 shadcn/ui + Base UI，不自行实现基础组件
- **校验**：API 入参使用 Zod 校验
- **认证**：NextAuth v5 beta，使用 Credentials Provider + bcryptjs 密码哈希

## API 设计

- RESTful 风格
- Route Handler 导出具名 HTTP 方法：`export async function POST(req: Request)`
- 响应格式：JSON 或 SSE stream
- 路由参数：Next.js 动态路由 (`[id]`)

## 数据库

- ORM：Prisma
- ID 生成：`@default(cuid())`
- 软删除：未使用，采用级联删除 (`onDelete: Cascade`)
- 时间戳：`createdAt @default(now())` + `updatedAt @updatedAt`

## Git

- Conventional Commits：`type(scope): summary`
- 常用 type：feat / fix / refactor / chore / docs / test
- scope：模块名（chat / session / knowledge / agent / auth / config）

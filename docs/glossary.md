# 术语表

## 业务术语

| 术语 | 说明 |
|------|------|
| ChatSession | 聊天会话，一次完整的对话上下文 |
| ChatMessage | 聊天消息，属于某个 Session，角色为 user/assistant/system |
| KnowledgeFile | 知识库文件，用户上传的文档（PDF/DOCX/TXT/MD） |
| KnowledgeChunk | 知识切片，文档被分割后的片段，可附带 Embedding 向量 |
| Embedding | 文本向量化表示，维度 1536，用于语义检索 |
| RAG | Retrieval-Augmented Generation，检索增强生成，即先检索知识库再让 LLM 回答 |
| AgentTask | Agent 异步任务，包含状态流转：pending → running → success/failed |
| Tool Calling | LLM 通过 Function Calling 调用外部工具的能力 |
| MCP | Model Context Protocol，模型上下文协议，用于扩展 LLM 的工具接入能力 |
| SystemConfig | 系统配置项，键值对形式存储（模型管理、Prompt、API Key 等） |

## 技术术语

| 术语 | 说明 |
|------|------|
| Route Handler | Next.js App Router 中的 API 端点，位于 `app/api/**/route.ts` |
| SSE | Server-Sent Events，服务端推送事件流，用于 AI 流式输出 |
| streamText | Vercel AI SDK 的流式文本生成函数 |
| pgvector | PostgreSQL 的向量检索扩展 |
| NextAuth | Next.js 认证库，本项目使用 v5 beta |
| Zustand | 轻量级 React 状态管理库 |
| shadcn/ui | 基于 Radix UI 的可定制组件库 |
| CUID | Collision-resistant Unique Identifier，用于数据库主键生成 |

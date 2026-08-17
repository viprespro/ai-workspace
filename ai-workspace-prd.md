# AI Workspace 产品需求文档（PRD）

## 一、项目背景

开发一个面向企业场景的 AI 工作台系统。

系统核心目标：

* 提供类似 ChatGPT 的聊天体验
* 支持流式输出
* 支持知识库问答（RAG）
* 支持文件上传分析
* 支持 Agent Tool Calling
* 支持多工具调用
* 支持未来接入 MCP Server
* 支持用户管理

项目定位：

企业级 AI Agent 平台。

---

# 二、技术栈要求

## Frontend

* Next.js 15+
* App Router
* TypeScript
* TailwindCSS
* shadcn/ui
* React Query
* Zustand

## Backend

使用 Next.js Route Handlers

目录结构：

app/api/**/route.ts

禁止使用 pages/api

---

## AI

* OpenAI SDK
* Vercel AI SDK
* DeepSeek
* OpenAI
* Claude

支持模型切换

---

## Database

PostgreSQL

ORM：

Prisma

---

## Vector Database

第一阶段：

pgvector

第二阶段可扩展：

Pinecone

---

## Validation

Zod

---

## Authentication

NextAuth

---

## Deployment

Docker

---

# 三、核心功能模块

## 模块1：AI聊天

### 功能

用户发送消息

AI实时回复

支持Markdown渲染

支持代码高亮

支持上下文记忆

---

### 技术要求

使用：

streamText()

实现：

ReadableStream

SSE

---

### API

POST

/api/chat

请求：

{
"message":"你好"
}

响应：

text/event-stream

---

# 模块2：会话管理

## 功能

创建会话

删除会话

历史记录

消息持久化

---

## 数据表

chat_sessions

chat_messages

---

# 模块3：知识库（RAG）

## 功能

上传文档

知识切片

Embedding

向量存储

相似度检索

引用来源

---

## 支持文件

pdf

docx

txt

md

---

## RAG流程

上传文件

↓

文档解析

↓

Chunk

↓

Embedding

↓

pgvector

↓

Similarity Search

↓

Prompt增强

↓

LLM回答

---

## API

POST

/api/knowledge/upload

POST

/api/knowledge/search

---

# 模块4：文件分析

## 功能

上传文件

AI分析内容

总结文件

提取关键信息

---

## 支持

PDF

Excel

Word

图片

---

# 模块5：Agent工具调用

## 功能

支持Function Calling

支持多工具调用

支持Agent循环

---

## Tool列表

查询天气

查询数据库

查询知识库

发送通知

获取系统时间

---

## Agent执行流程

用户提问

↓

LLM分析

↓

决定调用Tool

↓

执行Tool

↓

返回结果

↓

LLM总结

↓

输出答案

---

# 模块6：任务中心

## 功能

异步执行Agent任务

长任务处理

任务状态跟踪

---

## 流程

提交任务

↓

生成TaskId

↓

后台执行

↓

轮询状态

↓

获取结果

---

## 状态

pending

running

success

failed

---

# 模块7：用户系统

## 功能

登录

注册

退出

个人信息

---

## 权限

普通用户

管理员

---

# 模块8：系统配置

## 功能

模型管理

Prompt管理

API Key管理

系统参数配置

---

# 模块9：MCP扩展

## 目标

预留MCP接口能力

---

## MCP Server示例

员工查询

项目查询

知识库查询

工单查询

---

# 四、数据库设计

users

chat_sessions

chat_messages

knowledge_files

knowledge_chunks

agent_tasks

system_configs

---

# 五、学习目标

完成项目后应掌握：

1. Next.js App Router
2. Route Handlers
3. Streaming
4. ReadableStream
5. SSE
6. Vercel AI SDK
7. PostgreSQL
8. Prisma
9. pgvector
10. RAG
11. Tool Calling
12. Agent
13. Zod
14. NextAuth
15. Docker
16. MCP

---

# 六、第一阶段开发顺序

Week1

聊天页面
流式输出
会话管理

Week2

Prisma
PostgreSQL
消息存储

Week3

文件上传
RAG

Week4

向量检索

Week5

Agent

Week6

Tool Calling

Week7

任务中心

Week8

MCP扩展
Docker部署

---

# 七、项目验收标准

能够完成：

1. ChatGPT式聊天
2. 流式输出
3. 上传PDF问答
4. 引用知识来源
5. Tool Calling
6. Agent执行
7. 异步任务
8. 用户登录
9. Docker部署
10. 一键切换模型

达到AI应用开发工程师中级项目水平。

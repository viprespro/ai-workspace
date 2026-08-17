import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

// DeepSeek 兼容 OpenAI API，通过 createOpenAI 指向其端点
const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  baseURL: "https://api.deepseek.com",
});

// 将 v6 UI 消息（{ role, parts }）转换为 streamText 所需的 ModelMessage（{ role, content }）
function toModelMessages(
  messages: Array<{ role: string; content?: string; parts?: Array<{ type: string; text?: string }> }>
) {
  return messages.map((message) => ({
    role: message.role,
    content:
      message.parts
        ?.filter((part) => part.type === "text")
        .map((part) => part.text ?? "")
        .join("") ?? message.content ?? "",
  }));
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      { error: "未配置 DEEPSEEK_API_KEY，请在 .env 中设置后重启服务" },
      { status: 500 }
    );
  }

  const result = streamText({
    model: deepseek("deepseek-chat"),
    messages: toModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

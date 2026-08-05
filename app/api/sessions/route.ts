import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  return NextResponse.json({ sessions });
}

export async function POST(req: Request) {
  try {
    const { userId, title, model } = await req.json();

    const session = await prisma.chatSession.create({
      data: {
        userId,
        title: title || "新对话",
        model: model || "gpt-4o",
      },
    });

    return NextResponse.json({ session });
  } catch (error) {
    return NextResponse.json(
      { error: "创建会话失败" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "缺少 userId" }, { status: 400 });
  }

  const tasks = await prisma.agentTask.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ tasks });
}

export async function POST(req: Request) {
  try {
    const { userId, type, input } = await req.json();

    const task = await prisma.agentTask.create({
      data: {
        userId,
        type,
        input: JSON.stringify(input),
        status: "pending",
      },
    });

    // TODO: 后台执行 Agent 任务

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: "创建任务失败" },
      { status: 500 }
    );
  }
}

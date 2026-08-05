import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const configs = await prisma.systemConfig.findMany();
  return NextResponse.json({ configs });
}

export async function POST(req: Request) {
  try {
    const { key, value, desc } = await req.json();

    const config = await prisma.systemConfig.upsert({
      where: { key },
      update: { value, desc },
      create: { key, value, desc },
    });

    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json(
      { error: "配置更新失败" },
      { status: 500 }
    );
  }
}

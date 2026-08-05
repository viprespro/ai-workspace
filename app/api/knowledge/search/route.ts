import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "未提供查询内容" }, { status: 400 });
    }

    // TODO: 实现向量相似度检索
    // 1. 将 query 进行 Embedding
    // 2. 在 pgvector 中进行相似度搜索
    // 3. 返回相关文档片段

    return NextResponse.json({
      query,
      results: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "检索失败" },
      { status: 500 }
    );
  }
}

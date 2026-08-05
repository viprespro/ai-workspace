import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "未提供文件" }, { status: 400 });
    }

    // TODO: 实现文件解析、切片、Embedding、存储到 pgvector
    return NextResponse.json({
      message: "文件上传成功",
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "文件上传失败" },
      { status: 500 }
    );
  }
}

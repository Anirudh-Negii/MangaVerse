import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ chapterId: string }> }
) {
  const { chapterId } = await context.params;

  const res = await fetch(
    `https://api.mangadex.org/at-home/server/${chapterId}`
  );

  const data = await res.json();

  if (!data.chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const baseUrl = data.baseUrl;
  const hash = data.chapter.hash;

  const pages = data.chapter.data.map(
    (fileName: string) =>
      `${baseUrl}/data/${hash}/${fileName}`
  );

  return NextResponse.json(pages);
}

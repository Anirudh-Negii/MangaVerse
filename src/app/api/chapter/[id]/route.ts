import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const res = await fetch(
    `https://api.mangadex.org/chapter?manga=${id}&translatedLanguage[]=en&order[chapter]=desc&limit=100`
  );

  const data = await res.json();

  if (!data.data) {
    return NextResponse.json([], { status: 200 });
  }

  const chapters = data.data.map((c: any) => ({
    id: c.id,
    chapterNumber: c.attributes.chapter,
    title: c.attributes.title || "",
  }));

  return NextResponse.json(chapters);
}

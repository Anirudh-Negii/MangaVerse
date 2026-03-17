import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `https://api.mangadex.org/manga?title=${query}&limit=20&includes[]=cover_art`
  );

  const data = await res.json();

  const formatted = data.data.map((m: any) => {
    const cover = m.relationships.find(
      (r: any) => r.type === "cover_art"
    );

    return {
      id: m.id,
      title:
        m.attributes.title.en ||
        Object.values(m.attributes.title)[0],
      coverImage: cover
        ? `https://uploads.mangadex.org/covers/${m.id}/${cover.attributes.fileName}`
        : "",
    };
  });

  return NextResponse.json(formatted);
}

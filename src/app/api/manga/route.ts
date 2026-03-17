import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(
    "https://api.mangadex.org/manga?limit=12&order[followedCount]=desc&includes[]=cover_art"
  );

  const data = await res.json();

  const formatted = data.data.map((m: any) => {
    const cover = m.relationships.find((r: any) => r.type === "cover_art");

    return {
      id: m.id,
      title: m.attributes.title.en || Object.values(m.attributes.title)[0],
      description: m.attributes.description?.en || "",
      coverImage: cover
        ? `https://uploads.mangadex.org/covers/${m.id}/${cover.attributes.fileName}`
        : "",
    };
  });

  return NextResponse.json(formatted);
}

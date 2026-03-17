import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const res = await fetch(
    `https://api.mangadex.org/manga/${id}?includes[]=cover_art`
  );

  const data = await res.json();

  if (!data.data) {
    return NextResponse.json({ error: "Manga not found" }, { status: 404 });
  }

  const manga = data.data;

  const cover = manga.relationships?.find(
    (r: any) => r.type === "cover_art"
  );

  const formatted = {
    id: manga.id,
    title:
      manga.attributes.title.en ||
      Object.values(manga.attributes.title)[0],
    description: manga.attributes.description?.en || "",
    coverImage: cover
      ? `https://uploads.mangadex.org/covers/${manga.id}/${cover.attributes.fileName}`
      : "",
  };

  return NextResponse.json(formatted);
}

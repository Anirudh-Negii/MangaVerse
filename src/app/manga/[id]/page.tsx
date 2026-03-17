"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMangaDetails, fetchChapters } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function MangaDetail() {
  const params = useParams();
  const id = params.id as string;

  const [manga, setManga] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    fetchMangaDetails(id).then(setManga);
    fetchChapters(id).then(setChapters);
  }, [id]);

  if (!manga)
    return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          width={300}
          height={400}
          className="rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">
            {manga.title}
          </h1>

          <p className="text-gray-400 max-w-2xl">
            {manga.description}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Chapters
      </h2>

      <div className="space-y-3">
        {chapters.map((c) => (
          <Link
            key={c.id}
            href={`/reader/${c.id}`}
            className="block bg-gray-800 p-3 rounded hover:bg-gray-700 transition"
          >
            Chapter {c.chapterNumber} {c.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

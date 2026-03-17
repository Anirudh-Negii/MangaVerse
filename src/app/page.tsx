"use client";

import { useEffect, useState } from "react";
import MangaCard from "@/components/MangaCard";
import { Manga } from "@/types/manga";

export default function Home() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [latest, setLatest] = useState<Manga[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/manga").then((res) =>
      res.json().then(setManga)
    );

    fetch(
      "https://api.mangadex.org/manga?limit=12&order[latestUploadedChapter]=desc&includes[]=cover_art"
    )
      .then((res) => res.json())
      .then((data) => {
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

        setLatest(formatted);
      });
  }, []);

  const handleSearch = () => {
    if (!query) return;

    fetch(`/api/search?q=${query}`)
      .then((res) => res.json())
      .then(setManga);
  };

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">
        Manga Reader
      </h1>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search manga..."
          className="flex-1 p-2 rounded bg-gray-800"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 px-4 rounded"
        >
          Search
        </button>
      </div>

      {/* Trending */}
      <h2 className="text-xl font-semibold mb-4">
        Trending
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-10">
        {manga.map((m) => (
          <MangaCard key={m.id} manga={m} />
        ))}
      </div>

      {/* Latest */}
      <h2 className="text-xl font-semibold mb-4">
        Latest Updates
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {latest.map((m) => (
          <MangaCard key={m.id} manga={m} />
        ))}
      </div>
    </main>
  );
}

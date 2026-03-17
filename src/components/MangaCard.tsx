"use client";

import Link from "next/link";
import Image from "next/image";
import { Manga } from "@/types/manga";

export default function MangaCard({ manga }: { manga: Manga }) {
  return (
    <Link href={`/manga/${manga.id}`}>
      <div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-105 transition">
        <Image
          src={manga.coverImage}
          alt={manga.title}
          width={300}
          height={400}
          className="object-cover w-full h-80"
        />
        <div className="p-3 text-white font-semibold text-sm">
          {manga.title}
        </div>
      </div>
    </Link>
  );
}

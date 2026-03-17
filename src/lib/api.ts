export async function fetchManga() {
  const res = await fetch("/api/manga");
  return res.json();
}
export async function fetchMangaDetails(id: string) {
  const res = await fetch(`/api/manga/${id}`);
  return res.json();
}

export async function fetchChapters(id: string) {
  const res = await fetch(`/api/chapter/${id}`);
  return res.json();
}

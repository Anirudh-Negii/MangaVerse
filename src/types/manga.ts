export interface Manga {
  id: string;
  title: string;
  description?: string;
  coverImage: string;
}

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: string;
}

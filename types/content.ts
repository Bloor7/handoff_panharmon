export type ArticleSection =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; text: string };

export type Article = {
  slug: string;
  title: string;
  symbol: string;
  eyebrow: string;
  excerpt: string;
  readTime: number;
  tags: string[];
  accent: string;
  glyph: "wave" | "snake" | "bird" | "tooth" | "fish" | "flame" | "moon" | "compass";
  image?: string;
  imageAlt?: string;
  content?: unknown;
  sections?: ArticleSection[];
};

export type DreamResult = {
  title: string;
  essence: string;
  symbols: string[];
  emotion: string;
  advice: string;
};

export type LibraryTag = {
  key: string;
  vi: string;
  en?: string;
  color: string;
};

export type LibraryEntry = {
  t: string;
  v?: string | null;
  l: string;
  d: string;
  d_en?: string;
  g: string[];
  source?: "tagged" | "untagged" | "vietnamese";
  cultural_source?: string | null;
  reviewed?: boolean;
};

export type LibraryData = {
  source?: string;
  original_total?: number;
  tagged_total?: number;
  untagged_total?: number;
  vietnamese_total?: number;
  vietnamese_sources?: string[];
  total?: number;
  tags: LibraryTag[];
  entries: LibraryEntry[];
};

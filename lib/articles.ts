import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Article } from "@/types/content";

type DbPost = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  published_at: string | null;
  scheduled_at: string | null;
  categories?: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

const DEFAULT_ACCENTS = ["#6fb9a0", "#a98bcd", "#e8c98a", "#c97b9b", "#8ca8c9", "#e8a86c"];

function textFromTipTap(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const record = node as { text?: unknown; content?: unknown };
  const ownText = typeof record.text === "string" ? record.text : "";
  const children = Array.isArray(record.content) ? record.content.map(textFromTipTap).join(" ") : "";
  return `${ownText} ${children}`.trim();
}

function estimateReadTime(content: unknown) {
  const words = textFromTipTap(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function dbPostToArticle(post: DbPost, index: number): Article {
  const category = Array.isArray(post.categories) ? post.categories[0] : post.categories;
  const categoryName = category?.name || "Giải mã giấc mơ";
  return {
    slug: post.slug,
    title: post.title,
    symbol: post.title,
    eyebrow: categoryName,
    excerpt: post.excerpt || textFromTipTap(post.content).slice(0, 180),
    readTime: estimateReadTime(post.content),
    tags: category?.name ? [category.name] : [],
    accent: DEFAULT_ACCENTS[index % DEFAULT_ACCENTS.length],
    glyph: "compass",
    image: "",
    imageAlt: post.title,
    content: post.content
  };
}

export async function getAllArticles(): Promise<Article[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("posts")
    .select("title, slug, excerpt, content, published_at, scheduled_at, categories(name, slug)")
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .or(`published_at.is.null,published_at.lte.${now}`)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return (data as DbPost[]).map(dbPostToArticle);
}

export async function getArticle(slug: string) {
  const articles = await getAllArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getPublishedArticles() {
  return getAllArticles();
}

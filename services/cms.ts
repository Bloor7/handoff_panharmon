import "server-only";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase-admin";

export type CmsStatus = "draft" | "published" | "scheduled";

export type CmsCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export type CmsTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type CmsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: unknown;
  status: CmsStatus;
  category_id: string | null;
  published_at: string | null;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
  categories?: { name: string; slug: string } | null;
};

export type CmsMedia = {
  id: string;
  bucket: string;
  path: string;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
};

export type CmsSeo = {
  id: string;
  entity_type: string;
  entity_id: string | null;
  path: string | null;
  title: string | null;
  description: string | null;
  canonical_url: string | null;
  noindex: boolean;
  created_at: string;
};

export type CmsSetting = {
  key: string;
  value: unknown;
  updated_at: string;
};

export type CmsList<T> = {
  configured: boolean;
  rows: T[];
  error?: string;
};

function empty<T>(): CmsList<T> {
  return { configured: isSupabaseConfigured(), rows: [] };
}

export async function listCategories(search = ""): Promise<CmsList<CmsCategory>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  let query = supabase.from("categories").select("*").order("created_at", { ascending: false }).limit(100);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsCategory[], error: error?.message };
}

export async function listTags(search = ""): Promise<CmsList<CmsTag>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  let query = supabase.from("tags").select("*").order("created_at", { ascending: false }).limit(100);
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsTag[], error: error?.message };
}

export async function listPosts(search = "", status = ""): Promise<CmsList<CmsPost>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  const statusFilter = ["draft", "published", "scheduled"].includes(status) ? status : "";
  let query = supabase
    .from("posts")
    .select("*, categories(name, slug)")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (search) query = query.ilike("title", `%${search}%`);
  if (statusFilter) query = query.eq("status", statusFilter);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsPost[], error: error?.message };
}

export async function getPost(id?: string | null): Promise<CmsPost | null> {
  if (!id) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data } = await supabase.from("posts").select("*").eq("id", id).single();
  return data as CmsPost | null;
}

export async function listMedia(search = ""): Promise<CmsList<CmsMedia>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  let query = supabase.from("media").select("*").order("created_at", { ascending: false }).limit(100);
  if (search) query = query.or(`path.ilike.%${search}%,alt.ilike.%${search}%`);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsMedia[], error: error?.message };
}

export async function listSeo(search = ""): Promise<CmsList<CmsSeo>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  let query = supabase.from("seo_metadata").select("*").order("created_at", { ascending: false }).limit(100);
  if (search) query = query.or(`path.ilike.%${search}%,title.ilike.%${search}%`);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsSeo[], error: error?.message };
}

export async function listSettings(search = ""): Promise<CmsList<CmsSetting>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return empty();
  let query = supabase.from("settings").select("*").order("updated_at", { ascending: false }).limit(100);
  if (search) query = query.ilike("key", `%${search}%`);
  const { data, error } = await query;
  return { configured: true, rows: (data || []) as CmsSetting[], error: error?.message };
}

export async function dashboardCounts() {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { configured: false, posts: 0, categories: 0, tags: 0, media: 0 };
  const [posts, categories, tags, media] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("tags").select("id", { count: "exact", head: true }),
    supabase.from("media").select("id", { count: "exact", head: true })
  ]);
  return {
    configured: true,
    posts: posts.count || 0,
    categories: categories.count || 0,
    tags: tags.count || 0,
    media: media.count || 0
  };
}

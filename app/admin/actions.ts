"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { slugify } from "@/lib/slugify";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function adminRedirect(path: string, status: string): never {
  revalidatePath(path);
  redirect(`${path}?notice=${encodeURIComponent(status)}`);
}

function revalidatePostPaths(slug?: string) {
  revalidatePath("/giai-ma");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) {
    revalidatePath(`/giai-ma/${slug}`);
    revalidatePath(`/blog/${slug}`);
  }
}

function requireSupabase(path: string): SupabaseClient {
  const supabase = getSupabaseAdmin();
  if (!supabase) adminRedirect(path, "missing-supabase-env");
  return supabase;
}

const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional()
});

export async function saveCategory(formData: FormData) {
  const supabase = requireSupabase("/admin/categories");
  const input = categorySchema.parse(Object.fromEntries(formData));
  const payload = {
    name: input.name,
    slug: input.slug ? slugify(input.slug) : slugify(input.name),
    description: input.description || null
  };
  const result = input.id
    ? await supabase.from("categories").update(payload).eq("id", input.id)
    : await supabase.from("categories").insert(payload);
  if (result.error) adminRedirect("/admin/categories", result.error.message);
  adminRedirect("/admin/categories", input.id ? "updated" : "created");
}

export async function deleteCategory(formData: FormData) {
  const supabase = requireSupabase("/admin/categories");
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) adminRedirect("/admin/categories", error.message);
  adminRedirect("/admin/categories", "deleted");
}

const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  slug: z.string().optional()
});

export async function saveTag(formData: FormData) {
  const supabase = requireSupabase("/admin/tags");
  const input = tagSchema.parse(Object.fromEntries(formData));
  const payload = { name: input.name, slug: input.slug ? slugify(input.slug) : slugify(input.name) };
  const result = input.id ? await supabase.from("tags").update(payload).eq("id", input.id) : await supabase.from("tags").insert(payload);
  if (result.error) adminRedirect("/admin/tags", result.error.message);
  adminRedirect("/admin/tags", input.id ? "updated" : "created");
}

export async function deleteTag(formData: FormData) {
  const supabase = requireSupabase("/admin/tags");
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("tags").delete().eq("id", id);
  if (error) adminRedirect("/admin/tags", error.message);
  adminRedirect("/admin/tags", "deleted");
}

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published", "scheduled"]),
  category_id: z.string().optional(),
  published_at: z.string().optional(),
  scheduled_at: z.string().optional()
});

function parseDateTimeLocal(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function savePost(formData: FormData) {
  const supabase = requireSupabase("/admin/posts");
  const input = postSchema.parse(Object.fromEntries(formData));
  const existing = input.id ? await supabase.from("posts").select("slug").eq("id", input.id).single() : null;
  let content: unknown = {};
  try {
    content = input.content ? JSON.parse(input.content) : {};
  } catch {
    content = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: input.content || "" }] }] };
  }
  const slug = input.slug ? slugify(input.slug) : slugify(input.title);
  const now = new Date().toISOString();
  const publishedAt = parseDateTimeLocal(input.published_at) || now;
  const scheduledAt = parseDateTimeLocal(input.scheduled_at);
  const payload = {
    title: input.title,
    slug,
    excerpt: input.excerpt || null,
    content,
    status: input.status,
    category_id: input.category_id || null,
    published_at: input.status === "published" ? publishedAt : null,
    scheduled_at: input.status === "scheduled" ? scheduledAt : null,
    updated_at: new Date().toISOString()
  };
  const result = input.id ? await supabase.from("posts").update(payload).eq("id", input.id) : await supabase.from("posts").insert(payload);
  if (result.error) adminRedirect("/admin/posts", result.error.message);
  revalidatePostPaths(slug);
  if (existing?.data?.slug && existing.data.slug !== slug) revalidatePostPaths(existing.data.slug);
  adminRedirect("/admin/posts", input.id ? "updated" : "created");
}

export async function deletePost(formData: FormData) {
  const supabase = requireSupabase("/admin/posts");
  const id = String(formData.get("id") || "");
  const existing = await supabase.from("posts").select("slug").eq("id", id).single();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) adminRedirect("/admin/posts", error.message);
  revalidatePostPaths(existing.data?.slug);
  adminRedirect("/admin/posts", "deleted");
}

const seoSchema = z.object({
  id: z.string().optional(),
  entity_type: z.string().min(1),
  path: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  canonical_url: z.string().optional(),
  noindex: z.string().optional()
});

export async function saveSeo(formData: FormData) {
  const supabase = requireSupabase("/admin/seo");
  const input = seoSchema.parse(Object.fromEntries(formData));
  const payload = {
    entity_type: input.entity_type,
    path: input.path || null,
    title: input.title || null,
    description: input.description || null,
    canonical_url: input.canonical_url || null,
    noindex: input.noindex === "on",
    updated_at: new Date().toISOString()
  };
  const result = input.id ? await supabase.from("seo_metadata").update(payload).eq("id", input.id) : await supabase.from("seo_metadata").insert(payload);
  if (result.error) adminRedirect("/admin/seo", result.error.message);
  adminRedirect("/admin/seo", input.id ? "updated" : "created");
}

export async function deleteSeo(formData: FormData) {
  const supabase = requireSupabase("/admin/seo");
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("seo_metadata").delete().eq("id", id);
  if (error) adminRedirect("/admin/seo", error.message);
  adminRedirect("/admin/seo", "deleted");
}

export async function saveSetting(formData: FormData) {
  const supabase = requireSupabase("/admin/settings");
  const key = String(formData.get("key") || "").trim();
  const raw = String(formData.get("value") || "{}");
  if (!key) adminRedirect("/admin/settings", "missing-key");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    value = raw;
  }
  const { error } = await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) adminRedirect("/admin/settings", error.message);
  adminRedirect("/admin/settings", "saved");
}

export async function deleteSetting(formData: FormData) {
  const supabase = requireSupabase("/admin/settings");
  const key = String(formData.get("key") || "");
  const { error } = await supabase.from("settings").delete().eq("key", key);
  if (error) adminRedirect("/admin/settings", error.message);
  adminRedirect("/admin/settings", "deleted");
}

export async function uploadMedia(formData: FormData) {
  const supabase = requireSupabase("/admin/media");
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "");
  if (!(file instanceof File) || file.size === 0) adminRedirect("/admin/media", "missing-file");
  const safeName = `${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop() || "bin"}`;
  const path = `uploads/${safeName}`;
  const upload = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upload.error) adminRedirect("/admin/media", upload.error.message);
  const { error } = await supabase.from("media").insert({
    bucket: "media",
    path,
    alt: alt || null,
    mime_type: file.type || null,
    size_bytes: file.size
  });
  if (error) adminRedirect("/admin/media", error.message);
  adminRedirect("/admin/media", "uploaded");
}

export async function deleteMedia(formData: FormData) {
  const supabase = requireSupabase("/admin/media");
  const id = String(formData.get("id") || "");
  const path = String(formData.get("path") || "");
  if (path) await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) adminRedirect("/admin/media", error.message);
  adminRedirect("/admin/media", "deleted");
}

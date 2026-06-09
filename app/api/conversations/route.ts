import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000)
});

const saveSchema = z.object({
  messages: z.array(messageSchema).max(30)
});

async function getUserId(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { error: "Supabase is not configured", status: 503 as const };
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return { error: "Unauthorized", status: 401 as const };
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return { error: "Unauthorized", status: 401 as const };
  return { supabase, userId: data.user.id };
}

export async function GET(request: Request) {
  const auth = await getUserId(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data: conversation, error: conversationError } = await auth.supabase
    .from("conversations")
    .select("id")
    .eq("user_id", auth.userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (conversationError) return NextResponse.json({ error: conversationError.message }, { status: 500 });
  if (!conversation) return NextResponse.json({ messages: [] });

  const { data: messages, error: messagesError } = await auth.supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversation.id)
    .eq("user_id", auth.userId)
    .order("created_at", { ascending: true })
    .limit(30);

  if (messagesError) return NextResponse.json({ error: messagesError.message }, { status: 500 });
  return NextResponse.json({ messages: messages || [] });
}

export async function PUT(request: Request) {
  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const auth = await getUserId(request);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { data: existing, error: findError } = await auth.supabase
    .from("conversations")
    .select("id")
    .eq("user_id", auth.userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) return NextResponse.json({ error: findError.message }, { status: 500 });

  const conversation = existing || (await auth.supabase
    .from("conversations")
    .insert({ user_id: auth.userId, title: "Iris" })
    .select("id")
    .single()).data;

  if (!conversation) return NextResponse.json({ error: "Could not create conversation" }, { status: 500 });

  const { error: deleteError } = await auth.supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversation.id)
    .eq("user_id", auth.userId);

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  const rows = parsed.data.messages.slice(-30).map((message) => ({
    conversation_id: conversation.id,
    user_id: auth.userId,
    role: message.role,
    content: message.content
  }));

  if (rows.length) {
    const { error: insertError } = await auth.supabase.from("messages").insert(rows);
    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { error } = await auth.supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversation.id)
    .eq("user_id", auth.userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

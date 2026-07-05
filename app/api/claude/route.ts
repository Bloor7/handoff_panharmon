import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { IRIS_SYSTEM_PROMPT } from "@/lib/iris-prompt";
import { estimateCost } from "@/lib/credit-cost";

// ==== /api/claude — cổng giải mơ ĐÃ KHOÁ ====
// Trước: ai POST cũng được Claude trả lời, tiền của admin, system prompt do client gửi (ghi đè được).
// Giờ: bắt đăng nhập -> tính credit -> trừ atomic trong Supabase -> mới gọi Claude
//      với system prompt giữ ở server. Claude lỗi thì HOÀN credit.

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000)
      })
    )
    .min(1)
    .max(24)
});

type Msg = { role: "user" | "assistant"; content: string };

// Chuẩn hoá cho hợp lệ với Anthropic: bỏ các tin assistant ở đầu (câu chào),
// gộp các tin cùng vai liên tiếp -> đảm bảo bắt đầu bằng user và xen kẽ.
function normalize(msgs: Msg[]): Msg[] {
  const start = msgs.findIndex((m) => m.role === "user");
  if (start < 0) return [];
  const out: Msg[] = [];
  for (const m of msgs.slice(start)) {
    const last = out[out.length - 1];
    if (last && last.role === m.role) last.content += "\n\n" + m.content;
    else out.push({ role: m.role, content: m.content });
  }
  return out;
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase chưa cấu hình" }, { status: 503 });
  }

  // 1) Bắt đăng nhập — token Supabase trong header Authorization
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json({ error: "Cần đăng nhập để giải mơ" }, { status: 401 });
  }
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) {
    return NextResponse.json({ error: "Phiên đăng nhập không hợp lệ" }, { status: 401 });
  }
  const userId = userData.user.id;

  // 2) Đọc nội dung
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Nội dung không hợp lệ" }, { status: 400 });
  }
  const messages = normalize(parsed.data.messages);
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Chưa có nội dung để giải" }, { status: 400 });
  }
  const lastUser = messages[messages.length - 1].content;

  // 3) Tính credit (server chốt, độc lập với client)
  const cost = estimateCost(lastUser);

  // 4) Trừ credit atomic — hàm spend_credits khoá hàng, kiểm đủ, ghi sổ cái
  const { data: balanceAfter, error: spendErr } = await supabase.rpc("spend_credits", {
    p_user_id: userId,
    p_amount: cost,
    p_reason: "giai_mo",
    p_meta: {}
  });
  if (spendErr) {
    const insufficient = String(spendErr.message || "").includes("INSUFFICIENT_CREDITS");
    if (insufficient) {
      const { data: cur } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
      return NextResponse.json(
        { error: "INSUFFICIENT_CREDITS", cost, balance: cur?.balance ?? 0 },
        { status: 402 }
      );
    }
    return NextResponse.json({ error: "Không trừ được credit" }, { status: 500 });
  }

  // 5) Gọi Claude với system prompt Ở SERVER
  if (!process.env.ANTHROPIC_API_KEY) {
    await supabase.rpc("grant_credits", { p_user_id: userId, p_amount: cost, p_reason: "refund", p_meta: {} });
    return NextResponse.json({ error: "Missing ANTHROPIC_API_KEY" }, { status: 500 });
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      system: IRIS_SYSTEM_PROMPT,
      messages
    });
    const text =
      response.content.find((block) => block.type === "text")?.text?.trim() || "";
    if (!text) throw new Error("empty response");

    // Ghi nhật ký AI (không chặn phản hồi nếu ghi lỗi)
    void supabase.from("ai_logs").insert({
      user_id: userId,
      feature: "giai_mo",
      prompt: lastUser.slice(0, 2000),
      response: text.slice(0, 4000),
      model: "claude-haiku-4-5",
      tokens: (response.usage?.input_tokens ?? 0) + (response.usage?.output_tokens ?? 0)
    });

    return NextResponse.json({ text, cost, balance: balanceAfter });
  } catch {
    // Claude lỗi -> HOÀN credit đã trừ
    await supabase.rpc("grant_credits", { p_user_id: userId, p_amount: cost, p_reason: "refund", p_meta: {} });
    return NextResponse.json({ error: "Iris đang lặng, bạn thử lại sau một chút nhé" }, { status: 502 });
  }
}

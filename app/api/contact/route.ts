import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email().max(320),
  topic: z.string().min(1).max(200),
  message: z.string().min(10).max(5000)
});

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Khong cau hinh duoc DB -> KHONG gia vo thanh cong (tranh nuot lead).
    console.error("[contact] Supabase admin chua cau hinh, khong luu duoc lead");
    return NextResponse.json(
      { error: "Hệ thống liên hệ tạm thời gián đoạn. Vui lòng thử lại sau." },
      { status: 503 }
    );
  }

  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    topic: parsed.data.topic,
    message: parsed.data.message,
    meta: {
      ip: getClientIp(request),
      ua: request.headers.get("user-agent") ?? ""
    }
  });

  if (error) {
    // Fail-closed: bao that de khach thu lai, khong tra ok:true roi mat lead.
    console.error("[contact] Luu lead that bai:", error.message);
    return NextResponse.json(
      { error: "Không gửi được liên hệ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
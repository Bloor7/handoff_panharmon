import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
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

function getResend() {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid contact payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
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
    console.error("[contact] Luu lead that bai:", error.message);
    return NextResponse.json(
      { error: "Không gửi được liên hệ. Vui lòng thử lại sau." },
      { status: 500 }
    );
  }

  // Gửi email thông báo — không block thành công nếu Resend chưa cấu hình.
  const resend = getResend();
  if (resend) {
    const fromDomain = process.env.RESEND_FROM ?? "noreply@panharmon.com";
    const { error: mailError } = await resend.emails.send({
      from: `Panharmon Contact <${fromDomain}>`,
      to: "panharmon@gmail.com",
      replyTo: parsed.data.email,
      subject: `[Liên hệ] ${parsed.data.topic} — ${parsed.data.name}`,
      text: [
        `Tên: ${parsed.data.name}`,
        `Email: ${parsed.data.email}`,
        `Chủ đề: ${parsed.data.topic}`,
        "",
        parsed.data.message
      ].join("\n")
    });
    if (mailError) {
      console.error("[contact] Gui email that bai:", mailError);
    }
  } else {
    console.warn("[contact] RESEND_API_KEY chua dat — bo qua gui email");
  }

  return NextResponse.json({ ok: true });
}

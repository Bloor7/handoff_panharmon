import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_SESSION_COOKIE, createAdminSession, isAllowedAdmin } from "@/lib/admin-session";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Nguong khoa: sai qua 5 lan trong 15 phut -> khoa 15 phut (dem theo IP).
const MAX_FAILS = 5;
const WINDOW_SECS = 15 * 60;
const LOCKOUT_SECS = 15 * 60;

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function lockedResponse(retryAfter: number) {
  return NextResponse.json(
    { error: "Quá nhiều lần thử. Vui lòng đợi một lát rồi thử lại." },
    { status: 429, headers: { "Retry-After": String(Math.max(1, retryAfter)) } }
  );
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Missing ADMIN_PASSWORD" }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const throttleKey = `ip:${getClientIp(request)}`;

  // 1) Dang bi khoa? -> chan truoc khi cham toi mat khau.
  if (supabase) {
    const { data, error } = await supabase.rpc("admin_login_status", { p_key: throttleKey });
    if (!error && data?.[0]?.locked) {
      return lockedResponse(data[0].retry_after);
    }
  }

  // 2) Kiem thong tin dang nhap (constant-time).
  const allowed = await isAllowedAdmin(parsed.data.email, parsed.data.password);

  if (!allowed) {
    // 3) Ghi 1 lan that bai; neu vuot nguong -> khoa + tra 429.
    if (supabase) {
      const { data } = await supabase.rpc("admin_login_fail", {
        p_key: throttleKey,
        p_max: MAX_FAILS,
        p_window_secs: WINDOW_SECS,
        p_lockout_secs: LOCKOUT_SECS
      });
      if (data?.[0]?.locked) {
        return lockedResponse(data[0].retry_after);
      }
    }
    return NextResponse.json({ error: "Email hoặc mật khẩu admin không đúng." }, { status: 401 });
  }

  // 4) Dang nhap dung -> xoa bo dem + cap ve.
  if (supabase) {
    await supabase.rpc("admin_login_reset", { p_key: throttleKey });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSession(parsed.data.email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  return response;
}
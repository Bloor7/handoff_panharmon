export const ADMIN_SESSION_COOKIE = "panharmon_admin";

const encoder = new TextEncoder();

function toBase64Url(input: string) {
  if (typeof btoa === "function") {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof atob === "function") return atob(normalized);
  return Buffer.from(input, "base64url").toString("utf8");
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const binary = Array.from(new Uint8Array(signature), (byte) => String.fromCharCode(byte)).join("");
  return toBase64Url(binary);
}

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function getAllowedAdminEmails() {
  const emails = [process.env.ADMIN_EMAIL, ...(process.env.ADMIN_EMAILS || "").split(",")]
    .map((email) => email?.trim().toLowerCase())
    .filter(Boolean) as string[];
  return Array.from(new Set(emails));
}

async function timingSafeEqualStr(a: string, b: string) {
  // Bam SHA-256 ca hai chuoi -> do dai luon 32 byte, roi so tung byte bang XOR.
  // Vong lap co dinh, khong phu thuoc noi dung/do dai mat khau -> chong timing attack.
  const digest = async (value: string) =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
  const [ha, hb] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i += 1) diff |= ha[i] ^ hb[i];
  return diff === 0;
}

export async function isAllowedAdmin(email: string, password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const emailOk = getAllowedAdminEmails().includes(email.trim().toLowerCase());
  // Luon chay so mat khau du email dung hay sai, de khong lo qua thoi gian
  // "email nao la admin" (chong email enumeration).
  const passwordOk = await timingSafeEqualStr(password, expected);
  return emailOk && passwordOk;
}

export async function createAdminSession(email: string) {
  const secret = getAdminSecret();
  if (!secret) throw new Error("Missing ADMIN_SESSION_SECRET or ADMIN_PASSWORD");
  const payload = {
    email: email.trim().toLowerCase(),
    exp: Date.now() + 1000 * 60 * 60 * 8
  };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${await sign(encodedPayload, secret)}`;
}

export async function verifyAdminSession(session?: string) {
  const secret = getAdminSecret();
  if (!session || !secret) return false;
  const [encodedPayload, signature] = session.split(".");
  if (!encodedPayload || !signature) return false;
  if (signature !== await sign(encodedPayload, secret)) return false;

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as { email?: string; exp?: number };
    if (!payload.email || !payload.exp || payload.exp < Date.now()) return false;
    return getAllowedAdminEmails().includes(payload.email);
  } catch {
    return false;
  }
}
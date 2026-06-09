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

export function isAllowedAdmin(email: string, password: string) {
  const allowedEmails = getAllowedAdminEmails();
  return allowedEmails.includes(email.trim().toLowerCase()) && password === process.env.ADMIN_PASSWORD;
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

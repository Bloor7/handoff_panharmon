"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const next = searchParams.get("next") || "/admin/dashboard";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Không đăng nhập được.");
      return;
    }
    router.push(next.startsWith("/admin") ? next : "/admin/dashboard");
    router.refresh();
  };

  return (
    <form className="contact-form" style={{ maxWidth: 460, margin: "0 auto" }} onSubmit={submit}>
      <div className="field">
        <label htmlFor="admin-email">Email admin</label>
        <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="admin-password">Mật khẩu admin</label>
        <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </div>
      {error && <p className="drawer-error">{error}</p>}
      <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: "100%", justifyContent: "center" }}>
        {loading ? "Đang đăng nhập..." : "Đăng nhập admin"}
      </button>
    </form>
  );
}

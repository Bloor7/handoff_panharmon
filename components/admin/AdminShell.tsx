import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["Dashboard", "/admin/dashboard"],
  ["Posts", "/admin/posts"],
  ["Categories", "/admin/categories"],
  ["Tags", "/admin/tags"],
  ["Media", "/admin/media"],
  ["SEO", "/admin/seo"],
  ["Settings", "/admin/settings"]
];

export function AdminShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" href="/admin/dashboard">
          <span className="brand-name">Panharmon <em>CMS</em></span>
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <Link className="btn btn-ghost" href="/" style={{ justifyContent: "center" }}>Về website</Link>
      </aside>
      <section className="admin-main">
        <header className="admin-head">
          <div>
            <div className="eyebrow"><span className="dot" />Admin</div>
            <h1 className="page-title">{title}</h1>
            {subtitle && <p className="page-sub">{subtitle}</p>}
          </div>
        </header>
        {children}
      </section>
    </div>
  );
}

export function AdminNotice({ configured, error, status }: { configured: boolean; error?: string; status?: string }) {
  if (!configured) {
    return (
      <div className="admin-notice">
        Supabase chưa được cấu hình. Thêm `NEXT_PUBLIC_SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` vào `.env.local`, chạy `supabase/schema.sql`, rồi refresh trang.
      </div>
    );
  }
  if (error || status) return <div className="admin-notice">{error || `Trạng thái: ${status}`}</div>;
  return null;
}

export function AdminSearch({ placeholder = "Tìm kiếm..." }: { placeholder?: string }) {
  return (
    <form className="admin-search">
      <input name="q" placeholder={placeholder} />
      <button className="btn btn-ghost" type="submit">Tìm</button>
    </form>
  );
}

export function DeleteButton({ action, id, extra }: { action: (formData: FormData) => Promise<void>; id: string; extra?: Record<string, string> }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {extra && Object.entries(extra).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
      <button className="admin-danger" type="submit">Xóa</button>
    </form>
  );
}

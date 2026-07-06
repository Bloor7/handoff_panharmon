"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { ArrowIcon, BrandMark } from "@/components/patterns";
import { createClient } from "@/lib/supabase";

const navItems = [
  { path: "/giai-ma", label: "Giải mã" },
  { path: "/san-pham", label: "Sản phẩm" },
  { path: "/thu-vien", label: "Thư viện" },
  { path: "/lien-he", label: "Liên hệ" }
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    if (!authConfigured) return;
    const supabase = createClient();
    supabaseRef.current = supabase;

    const loadCredits = (userId: string) => {
      void supabase.from("credits").select("balance").eq("user_id", userId).maybeSingle().then(({ data }) => setCredits(data?.balance ?? 0));
    };
    const applySession = (session: Session | null) => {
      if (session?.user) {
        setUserName(session.user.user_metadata?.full_name || session.user.email || "Bạn");
        loadCredits(session.user.id);
      } else {
        setUserName(null);
        setCredits(null);
      }
    };

    void supabase.auth.getSession().then(({ data }) => applySession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => applySession(session));

    const onCredits = (event: Event) => {
      const balance = (event as CustomEvent).detail?.balance;
      if (typeof balance === "number") setCredits(balance);
    };
    window.addEventListener("credits:updated", onCredits);

    return () => {
      sub.subscription.unsubscribe();
      window.removeEventListener("credits:updated", onCredits);
    };
  }, []);

  // Dong menu khi bam ra ngoai.
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const scrollToInterpreter = () => {
    if (pathname === "/") {
      document.getElementById("giai-ma")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#giai-ma");
  };

  const openAuth = () => window.dispatchEvent(new CustomEvent("iris:open-auth"));
  const openTopup = () => window.dispatchEvent(new CustomEvent("topup:open"));
  const signOut = async () => {
    await supabaseRef.current?.auth.signOut();
  };

  const initial = (userName?.trim()?.[0] || "B").toUpperCase();

  return (
    <header className="nav">
      <nav className="shell nav-inner" aria-label="Điều hướng chính">
        <Link href="/" className="brand">
          <BrandMark className="brand-mark" />
          <span className="brand-name">
            Panharmon <em></em>
          </span>
        </Link>
        <div className="nav-links">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} className={`nav-link ${pathname === item.path || pathname.startsWith(`${item.path}/`) ? "active" : ""}`}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="nav-actions">
          {userName ? (
            <div className="nav-account" ref={menuRef}>
              <button
                type="button"
                className="nav-avatar"
                onClick={() => setMenuOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                title={userName}
              >
                {initial}
              </button>
              {menuOpen && (
                <div className="nav-menu" role="menu">
                  <div className="nav-menu-head">
                    <span className="nav-menu-name">{userName}</span>
                    <span className="nav-menu-credit">{credits ?? 0} credit</span>
                  </div>
                  <button type="button" role="menuitem" className="nav-menu-item" onClick={() => { setMenuOpen(false); openTopup(); }}>
                    Nạp credit
                  </button>
                  <button type="button" role="menuitem" className="nav-menu-item danger" onClick={() => { setMenuOpen(false); void signOut(); }}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button type="button" className="nav-login" onClick={openAuth}>Đăng nhập</button>
          )}
          <button className="btn btn-primary nav-cta" type="button" onClick={scrollToInterpreter}>
            <span className="nav-cta-label">Giải mã ngay</span>
            <ArrowIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}

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

const pill: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#eae3d2", borderRadius: 999, padding: "5px 12px", fontSize: 13, cursor: "pointer"
};

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {userName ? (
            <>
              <button type="button" style={{ ...pill, color: "#d4a857" }} onClick={openTopup} title="Nạp credit">
                {credits ?? 0} credit +
              </button>
              <span style={{ fontSize: 13, opacity: 0.8, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</span>
              <button type="button" style={pill} onClick={() => void signOut()}>Đăng xuất</button>
            </>
          ) : (
            <button type="button" style={pill} onClick={openAuth}>Đăng nhập</button>
          )}
          <button className="btn btn-primary" type="button" onClick={scrollToInterpreter}>
            Giải mã ngay
            <ArrowIcon />
          </button>
        </div>
      </nav>
    </header>
  );
}

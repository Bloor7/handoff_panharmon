"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function svgNum(value: number) {
  return value.toFixed(4);
}

function Icon({ type }: { type: "home" | "book" | "tree" | "chat" }) {
  if (type === "book") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 4h12v14H4z" />
        <path d="M4 4c0 7 0 11 0 14 4-1 8-1 12 0V4" opacity="0.6" />
      </svg>
    );
  }
  if (type === "tree") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="11" cy="11" r="9" opacity="0.4" />
        <circle cx="11" cy="11" r="5" opacity="0.7" />
        <circle cx="11" cy="11" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (type === "chat") {
    return (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M3 8c0-2 1-4 4-4h8c3 0 4 2 4 4v6c0 2-1 4-4 4h-3l-4 3v-3c-3 0-5-2-5-4V8z" />
        <circle cx="8" cy="11" r="0.8" fill="currentColor" />
        <circle cx="11" cy="11" r="0.8" fill="currentColor" />
        <circle cx="14" cy="11" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="9" opacity="0.45" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={svgNum(11 + Math.cos(a) * 3)} y1={svgNum(11 + Math.sin(a) * 3)} x2={svgNum(11 + Math.cos(a) * 6)} y2={svgNum(11 + Math.sin(a) * 6)} />;
      })}
      <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MobileTabBar() {
  const pathname = usePathname();
  const tabs = [
    { href: "/", id: "home", label: "Trang chủ", icon: "home" as const, active: pathname === "/" },
    { href: "/giai-ma", id: "blog", label: "Tủ sách", icon: "book" as const, active: pathname.startsWith("/giai-ma") || pathname.startsWith("/blog") },
    { href: "/thu-vien", id: "tree", label: "Thư viện", icon: "tree" as const, active: pathname.startsWith("/thu-vien") },
    { href: "#iris", id: "iris", label: "Iris", icon: "chat" as const, active: false }
  ];

  return (
    <div className="m-tabbar site-mobile-tabbar" aria-label="Điều hướng mobile">
      {tabs.map((tab) => (
        <Link key={tab.id} href={tab.href} className={`m-tab ${tab.active ? "active" : ""}`}>
          <Icon type={tab.icon} />
          <span>{tab.label}</span>
          <div className="m-tab-dot" style={{ opacity: tab.active ? 1 : 0 }} />
        </Link>
      ))}
    </div>
  );
}

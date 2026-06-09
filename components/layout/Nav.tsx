"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowIcon, BrandMark } from "@/components/patterns";

const navItems = [
  { path: "/giai-ma", label: "Giải mã" },
  { path: "/san-pham", label: "Sản phẩm" },
  { path: "/thu-vien", label: "Thư viện" },
  { path: "/lien-he", label: "Liên hệ" }
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToInterpreter = () => {
    if (pathname === "/") {
      document.getElementById("giai-ma")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#giai-ma");
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
        <button className="btn btn-primary" type="button" onClick={scrollToInterpreter}>
          Giải mã ngay
          <ArrowIcon />
        </button>
      </nav>
    </header>
  );
}

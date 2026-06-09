import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="foot-inner">
        <div>© 2026 Panharmon - Giải mã bí ẩn giấc mơ.</div>
        <div className="foot-links">
          <Link href="/giai-ma">Giải mã</Link>
          <Link href="/san-pham">Sản phẩm</Link>
          <Link href="/thu-vien">Thư viện</Link>
          <Link href="/lien-he">Liên hệ</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

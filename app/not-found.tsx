import Link from "next/link";
import type { Metadata } from "next";
import { DrumRing } from "@/components/patterns";

export const metadata: Metadata = {
  title: "404 - Không tìm thấy trang",
  description: "Trang bạn đang tìm không còn ở đây hoặc đã đổi đường dẫn."
};

export default function NotFound() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-orbit" aria-hidden="true">
        <DrumRing />
        <span>404</span>
      </div>
      <div className="eyebrow"><span className="dot" />Lạc khỏi bản đồ mộng</div>
      <h1 id="not-found-title" className="page-title">
        Trang này đã <em>rời khỏi vòng trống</em>
      </h1>
      <p className="page-sub">
        Đường dẫn có thể đã thay đổi, hoặc biểu tượng bạn tìm không còn tồn tại. Hãy quay về trang chính hoặc mở thư viện để tiếp tục tra cứu.
      </p>
      <div className="not-found-actions" aria-label="Điều hướng 404">
        <Link className="btn btn-primary" href="/">Về trang chủ</Link>
        <Link className="btn btn-ghost" href="/thu-vien">Mở thư viện</Link>
      </div>
    </section>
  );
}

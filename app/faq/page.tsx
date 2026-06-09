import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Câu hỏi thường gặp về Panharmon."
};

export default function PageFAQ() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: []
  };

  return (
    <PageShell eyebrow="FAQ" title={<>Câu hỏi <em>thường gặp</em></>} sub="Trang này đang được biên soạn - nội dung sẽ sớm có mặt.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="empty-state large">
        <div className="empty-mark">?</div>
        <h2>Đang được biên soạn</h2>
        <p>Trong khi chờ, bạn có thể thử giải mã một giấc mơ - hoặc gửi câu hỏi qua trang Liên hệ, chúng tôi rất vui được trả lời.</p>
      </div>
    </PageShell>
  );
}

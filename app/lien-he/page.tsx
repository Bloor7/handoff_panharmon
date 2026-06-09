import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Gửi một cánh chim Lạc tới Panharmon."
};

export default function PageLienHe() {
  return (
    <PageShell eyebrow="Liên hệ" title={<>Gửi một <em>cánh chim Lạc</em> tới chúng tôi</>} sub="Chúng tôi đọc mọi lời nhắn và thường trả lời trong vòng 24 giờ.">
      <div className="contact-wrap">
        <aside className="contact-info">
          <h2>Vẫn còn câu hỏi?</h2>
          <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: 15 }}>Chúng tôi luôn lắng nghe. Gửi lời nhắn, hoặc tìm chúng tôi qua các kênh dưới đây.</p>
          <div className="contact-row"><div className="ic">✉</div><div><b>Email</b><span>panharmon@gmail.com</span></div></div>
          <div className="contact-row"><div className="ic">☎</div><div><b>Hotline</b><span>0000000 - 8h đến 22h</span></div></div>
          <div className="contact-row"><div className="ic">⌖</div><div><b>Trụ sở</b><span>Xuân Hương, Đà Lạt</span></div></div>
        </aside>
        <ContactForm />
      </div>
    </PageShell>
  );
}

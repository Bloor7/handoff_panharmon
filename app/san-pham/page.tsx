import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";
import { ArrowIcon } from "@/components/patterns";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Các gói Panharmon và vật phẩm đồng hành với giấc ngủ, giấc mơ rõ nét."
};

const tiers = [
  {
    name: "Sương Sớm",
    price: "Miễn phí",
    sub: "",
    desc: "Cho người mơ thử nghiệm, làm quen với giải mã giấc mơ.",
    features: ["3 lượt giải mã / ngày", "50 biểu tượng cơ bản", "Nhật ký 7 ngày"],
    cta: "Bắt đầu miễn phí",
    featured: false
  },
  {
    name: "Trăng Tròn",
    price: "99k",
    sub: "/tháng",
    desc: "Cho người mơ thường xuyên, muốn hiểu sâu hơn về chính mình.",
    features: ["Giải mã không giới hạn", "Phân tích ngũ hành, can chi", "Nhật ký trọn đời", "Xu hướng giấc mơ tuần", "Cộng đồng kín"],
    cta: "Chọn Trăng Tròn",
    featured: true
  },
  {
    name: "Vạn Tinh",
    price: "299k",
    sub: "/tháng",
    desc: "Trải nghiệm trọn vẹn - kèm phiên tư vấn với người giải mơ thật.",
    features: ["Tất cả tính năng Trăng Tròn", "1 phiên 1:1 mỗi tháng", "Báo cáo in ấn riêng", "Ưu tiên trả lời 1h"],
    cta: "Liên hệ tư vấn",
    featured: false
  }
];

const sleepGoods = [
  ["Sổ Mộng", "Bìa da · Giấy mộc", "Sổ ghi giấc mơ ngay khi vừa tỉnh dậy. Bìa da bò thật, ruột giấy mộc 80 trang, có dải đánh dấu lụa và bút chì gỗ.", "320k"],
  ["Tinh Dầu Đêm Nguyệt", "Hoa oải hương · Tuyết tùng", "Nhỏ hai giọt lên gối hoặc trong máy khuếch tán trước khi nằm. Hương dịu, thuần - không cồn, không chất bảo quản.", "180k"],
  ["Gối Thảo Mộc Bạch Tâm", "Hoa nhài · Bạc hà · Tía tô", "Ruột gối nhồi thảo mộc khô - đặt cạnh gối thường khi ngủ. Mùi nhẹ, lan dần qua giấc ngủ.", "260k"],
  ["Trà Tâm An", "Hoa cúc · Tâm sen · Cam thảo", "Một ấm nhỏ uống trước khi nằm 30 phút. Êm bao tử, đưa nhịp tim chậm lại để giấc ngủ tự đến.", "140k"],
  ["Đèn Trăng Mật", "Ánh hổ phách · 2200K", "Bóng LED bước sóng ấm - giảm ánh xanh, không phá melatonin. Một vầng trăng nhỏ canh giấc.", "490k"],
  ["Mặt Nạ Lụa Mộng", "Lụa tơ tằm Bảo Lộc", "Bịt mắt lụa 100% tơ tằm thật, khâu tay. Mềm, thoáng, không để lại nếp da.", "220k"]
];

export default function PageSanPham() {
  const productJsonLd = tiers.map((tier) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Panharmon ${tier.name}`,
    description: tier.desc,
    url: absoluteUrl("/san-pham")
  }));

  return (
    <PageShell eyebrow="Sản phẩm" title={<>Chọn hành trình <em>phù hợp với bạn</em></>} sub="Từ thử nghiệm miễn phí, đến phiên tư vấn 1:1 với người giải mơ - luôn có một cánh cửa dành cho bạn.">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <div className="product-grid">
        {tiers.map((tier) => (
          <article key={tier.name} className={`product-card ${tier.featured ? "featured" : ""}`}>
            {tier.featured && <span className="product-tag">Phổ biến</span>}
            <h2>{tier.name}</h2>
            <p>{tier.desc}</p>
            <div className="price">
              {tier.price} <small>{tier.sub}</small>
            </div>
            <ul>{tier.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            <Link className={`btn ${tier.featured ? "btn-primary" : "btn-ghost"}`} href="/lien-he">
              {tier.cta}
              <ArrowIcon />
            </Link>
          </article>
        ))}
      </div>

      <div className="compare">
        <h2 className="compare-title">So sánh nhanh</h2>
        <table className="compare-table">
          <thead>
            <tr><th></th><th>Sương Sớm</th><th>Trăng Tròn</th><th>Vạn Tinh</th></tr>
          </thead>
          <tbody>
            <tr><td>Giải mã / ngày</td><td>3</td><td>Không giới hạn</td><td>Không giới hạn</td></tr>
            <tr><td>Thư viện biểu tượng</td><td>50</td><td>500+</td><td>500+</td></tr>
            <tr><td>Phân tích ngũ hành</td><td>-</td><td>✓</td><td>✓</td></tr>
            <tr><td>Phiên tư vấn 1:1</td><td>-</td><td>-</td><td>1 / tháng</td></tr>
            <tr><td>Báo cáo in</td><td>-</td><td>-</td><td>✓</td></tr>
          </tbody>
        </table>
      </div>

      <div className="sleep-goods">
        <div className="section-head sleep-head">
          <div className="eyebrow"><span className="dot"></span>Vật phẩm đồng hành</div>
          <h2>Cùng với giấc ngủ - <em>và những giấc mơ rõ nét</em></h2>
          <p>Một giấc mơ trong trẻo bắt đầu từ một giấc ngủ sâu. Chúng tôi chọn lọc những vật phẩm thủ công Việt giúp bạn nghỉ ngơi đúng nghĩa.</p>
        </div>
        <div className="sleep-grid">
          {sleepGoods.map(([name, eyebrow, desc, price]) => (
            <article key={name} className="sleep-card">
              <div className="sleep-glyph">
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <circle cx="40" cy="40" r="24" />
                  <circle cx="40" cy="40" r="8" />
                </svg>
              </div>
              <div className="sleep-body">
                <div className="sleep-eyebrow">{eyebrow}</div>
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
              <div className="sleep-foot">
                <div className="sleep-price">{price}<small>VND</small></div>
                <Link className="btn btn-ghost sleep-buy" href="/lien-he">Đặt hàng<ArrowIcon /></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

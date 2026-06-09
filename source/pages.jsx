// === Page: San Pham (Products) ===
const PageSanPham = ({ go }) => {
  const tiers = [
    {
      name: "Sương Sớm", price: "Miễn phí", sub: "",
      desc: "Cho người mơ thử nghiệm, làm quen với giải mã giấc mơ.",
      features: ["3 lượt giải mã / ngày", "50 biểu tượng cơ bản", "Nhật ký 7 ngày"],
      cta: "Bắt đầu miễn phí", featured: false,
      image: "", // e.g. "uploads/tier-suong-som.jpg" — leave empty for no cover image
      imageAlt: "Gói Sương Sớm",
    },
    {
      name: "Trăng Tròn", price: "99k", sub: "/tháng",
      desc: "Cho người mơ thường xuyên, muốn hiểu sâu hơn về chính mình.",
      features: ["Giải mã không giới hạn", "Phân tích ngũ hành, can chi", "Nhật ký trọn đời", "Xu hướng giấc mơ tuần", "Cộng đồng kín"],
      cta: "Chọn Trăng Tròn", featured: true,
      image: "",
      imageAlt: "Gói Trăng Tròn",
    },
    {
      name: "Vạn Tinh", price: "299k", sub: "/tháng",
      desc: "Trải nghiệm trọn vẹn — kèm phiên tư vấn với người giải mơ thật.",
      features: ["Tất cả tính năng Trăng Tròn", "1 phiên 1:1 mỗi tháng", "Báo cáo in ấn riêng", "Ưu tiên trả lời 1h"],
      cta: "Liên hệ tư vấn", featured: false,
      image: "",
      imageAlt: "Gói Vạn Tinh",
    },
  ];

  return (
    <PageShell
      eyebrow="Sản phẩm"
      title={<>Chọn hành trình <em>phù hợp với bạn</em></>}
      sub="Từ thử nghiệm miễn phí, đến phiên tư vấn 1:1 với người giải mơ — luôn có một cánh cửa dành cho bạn."
    >
      <div className="product-grid">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 60}>
            <div className={`product-card ${t.featured ? "featured" : ""}`}>
              {t.featured && <span className="product-tag">Phổ biến</span>}
              {t.image && (
                <div className="product-cover has-image">
                  <img src={t.image} alt={t.imageAlt || t.name} loading="lazy" />
                </div>
              )}
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <div className="price">{t.price} <small>{t.sub}</small></div>
              <ul>{t.features.map((f) => <li key={f}>{f}</li>)}</ul>
              <button className={`btn ${t.featured ? "btn-primary" : "btn-ghost"}`} type="button" onClick={() => go("/lien-he")}>
                {t.cta}
                <ArrowIcon />
              </button>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Comparison + FAQ teaser */}
      <Reveal delay={200}>
        <div className="compare">
          <h3 className="compare-title">So sánh nhanh</h3>
          <table className="compare-table">
            <thead>
              <tr><th></th><th>Sương Sớm</th><th>Trăng Tròn</th><th>Vạn Tinh</th></tr>
            </thead>
            <tbody>
              <tr><td>Giải mã / ngày</td><td>3</td><td>Không giới hạn</td><td>Không giới hạn</td></tr>
              <tr><td>Thư viện biểu tượng</td><td>50</td><td>500+</td><td>500+</td></tr>
              <tr><td>Phân tích ngũ hành</td><td>—</td><td>✓</td><td>✓</td></tr>
              <tr><td>Phiên tư vấn 1:1</td><td>—</td><td>—</td><td>1 / tháng</td></tr>
              <tr><td>Báo cáo in</td><td>—</td><td>—</td><td>✓</td></tr>
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal delay={250}>
        <div className="cta-strip">
          <div>
            <h3>Chưa chắc chọn gói nào?</h3>
            <p>Bắt đầu miễn phí với Sương Sớm — nâng cấp bất cứ khi nào bạn muốn.</p>
          </div>
          <button className="btn btn-primary" type="button" onClick={() => go("/")}>
            Thử ngay với một giấc mơ
            <ArrowIcon />
          </button>
        </div>
      </Reveal>

      {/* ===== Vật phẩm đồng hành với giấc ngủ ===== */}
      <SleepGoods />
    </PageShell>
  );
};

// === Sleep wellness companion products ===
const SleepGoods = () => {
  const items = [
    {
      name: "Sổ Mộng",
      eyebrow: "Bìa da · Giấy mộc",
      desc: "Sổ ghi giấc mơ ngay khi vừa tỉnh dậy. Bìa da bò thật, ruột giấy mộc 80 trang, có dải đánh dấu lụa và bút chì gỗ — đủ để bạn không quên giấc mộng trước khi ánh sáng đến.",
      price: "320k",
      image: "", // e.g. "uploads/sleep-so-mong.jpg"
      imageAlt: "Sổ Mộng bìa da",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="20" y="14" width="40" height="52" rx="2" />
          <line x1="28" y1="26" x2="52" y2="26" opacity="0.5" />
          <line x1="28" y1="34" x2="52" y2="34" opacity="0.5" />
          <line x1="28" y1="42" x2="46" y2="42" opacity="0.5" />
          <line x1="40" y1="14" x2="40" y2="66" opacity="0.7" strokeDasharray="1 2" />
        </svg>
      ),
    },
    {
      name: "Tinh Dầu Đêm Nguyệt",
      eyebrow: "Hoa oải hương · Tuyết tùng",
      desc: "Nhỏ hai giọt lên gối hoặc trong máy khuếch tán trước khi nằm. Hương dịu, thuần — pha bởi tinh dầu lavender Đà Lạt và tuyết tùng Atlas, không cồn, không chất bảo quản.",
      price: "180k",
      image: "",
      imageAlt: "Tinh Dầu Đêm Nguyệt",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <rect x="32" y="20" width="16" height="44" rx="2" />
          <rect x="36" y="14" width="8" height="6" rx="1" />
          <path d="M28 38 Q24 36 24 30" strokeLinecap="round" opacity="0.6" />
          <path d="M52 38 Q56 36 56 30" strokeLinecap="round" opacity="0.6" />
          <line x1="36" y1="44" x2="44" y2="44" opacity="0.6" />
          <line x1="36" y1="52" x2="44" y2="52" opacity="0.6" />
        </svg>
      ),
    },
    {
      name: "Gối Thảo Mộc Bạch Tâm",
      eyebrow: "Hoa nhài · Bạc hà · Tía tô",
      desc: "Ruột gối nhồi thảo mộc khô — đặt cạnh gối thường khi ngủ. Mùi nhẹ, lan dần qua giấc ngủ, giúp sâu hơn ở pha REM nơi giấc mơ thường rõ nét nhất.",
      price: "260k",
      image: "",
      imageAlt: "Gối Thảo Mộc Bạch Tâm",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M16 30 Q16 22 28 22 L52 22 Q64 22 64 30 L64 50 Q64 58 52 58 L28 58 Q16 58 16 50 Z" />
          <path d="M30 36 Q34 30 40 36 Q46 30 50 36" strokeLinecap="round" opacity="0.7" />
          <circle cx="32" cy="44" r="1.4" fill="currentColor" stroke="none" opacity="0.6" />
          <circle cx="48" cy="44" r="1.4" fill="currentColor" stroke="none" opacity="0.6" />
        </svg>
      ),
    },
    {
      name: "Trà Tâm An",
      eyebrow: "Hoa cúc · Tâm sen · Cam thảo",
      desc: "Một ấm nhỏ uống trước khi nằm 30 phút. Tâm sen bóc tay, cúc Hưng Yên, cam thảo — êm bao tử, đưa nhịp tim chậm lại để giấc ngủ tự đến.",
      price: "140k",
      image: "",
      imageAlt: "Trà Tâm An",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M22 34 L22 52 Q22 60 30 60 L46 60 Q54 60 54 52 L54 34 Z" />
          <path d="M54 38 Q62 38 62 46 Q62 54 54 54" strokeLinecap="round" />
          <path d="M30 26 Q32 22 30 18 M38 26 Q40 22 38 18 M46 26 Q48 22 46 18" strokeLinecap="round" opacity="0.6" />
        </svg>
      ),
    },
    {
      name: "Đèn Trăng Mật",
      eyebrow: "Ánh hổ phách · 2200K",
      desc: "Bóng LED bước sóng ấm — giảm ánh xanh, không phá melatonin. Bật vào giờ thiền tối, hoặc để đầu giường suốt đêm như một vầng trăng nhỏ canh giấc.",
      price: "490k",
      image: "",
      imageAlt: "Đèn Trăng Mật",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <circle cx="40" cy="30" r="14" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={40 + Math.cos(a) * 18}
                y1={30 + Math.sin(a) * 18}
                x2={40 + Math.cos(a) * 24}
                y2={30 + Math.sin(a) * 24}
                opacity="0.5"
              />
            );
          })}
          <path d="M32 50 L48 50 L52 64 L28 64 Z" />
          <line x1="34" y1="56" x2="46" y2="56" opacity="0.5" />
        </svg>
      ),
    },
    {
      name: "Mặt Nạ Lụa Mộng",
      eyebrow: "Lụa tơ tằm Bảo Lộc",
      desc: "Bịt mắt lụa 100% tơ tằm thật, khâu tay. Mềm, thoáng, không để lại nếp da. Hộp đựng có thêm túi vải lụa nhỏ — tiện mang khi đi đường dài.",
      price: "220k",
      image: "",
      imageAlt: "Mặt Nạ Lụa Mộng",
      glyph: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M14 36 Q14 28 24 28 L56 28 Q66 28 66 36 L66 44 Q66 52 56 52 L24 52 Q14 52 14 44 Z" />
          <path d="M24 40 Q30 36 36 40" strokeLinecap="round" opacity="0.6" />
          <path d="M44 40 Q50 36 56 40" strokeLinecap="round" opacity="0.6" />
          <line x1="14" y1="40" x2="6" y2="42" strokeLinecap="round" />
          <line x1="66" y1="40" x2="74" y2="42" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div className="sleep-goods">
      <div className="section-head sleep-head">
        <Reveal><div className="eyebrow"><span className="dot"></span>Vật phẩm đồng hành</div></Reveal>
        <Reveal delay={80}>
          <h2>Cùng với giấc ngủ — <em>và những giấc mơ rõ nét</em></h2>
        </Reveal>
        <Reveal delay={160}>
          <p>Một giấc mơ trong trẻo bắt đầu từ một giấc ngủ sâu. Chúng tôi chọn lọc những vật phẩm thủ công Việt — tinh dầu, gối thảo, sổ ghi mộng — giúp bạn nghỉ ngơi đúng nghĩa, và lắng nghe vô thức của chính mình.</p>
        </Reveal>
      </div>

      <div className="sleep-grid">
        {items.map((g, i) => (
          <Reveal key={g.name} delay={i * 50}>
            <div className="sleep-card">
              {g.image ? (
                <div className="sleep-cover has-image">
                  <img src={g.image} alt={g.imageAlt || g.name} loading="lazy" />
                </div>
              ) : (
                <div className="sleep-glyph">{g.glyph}</div>
              )}
              <div className="sleep-body">
                <div className="sleep-eyebrow">{g.eyebrow}</div>
                <h3>{g.name}</h3>
                <p>{g.desc}</p>
              </div>
              <div className="sleep-foot">
                <div className="sleep-price">{g.price}<small>VND</small></div>
                <button className="btn btn-ghost sleep-buy" type="button">
                  Đặt hàng
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={300}>
        <div className="sleep-note">
          <div>
            <div className="eyebrow"><span className="dot"></span>Cam kết</div>
            <p>Tất cả vật phẩm được làm thủ công tại Việt Nam, không hương liệu tổng hợp, không nhựa dùng một lần. Giao trong 3 ngày tại TP.HCM và Hà Nội — 5–7 ngày các tỉnh khác.</p>
          </div>
        </div>
      </Reveal>
    </div>
  );
};

// === Page: Thu Vien (Library) ===
const PageThuVien = ({ go }) => {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState("Tất cả");
  const tabs = ["Tất cả", "Tích cực", "Cảnh báo", "Lưỡng cực", "Đại cát"];

  const filtered = SYMBOLS.filter((s) => {
    const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.short.toLowerCase().includes(query.toLowerCase());
    const matchF = filter === "Tất cả" || s.badge === filter;
    return matchQ && matchF;
  });

  return (
    <PageShell
      eyebrow="Thư viện biểu tượng"
      title={<>Từ điển <em>giấc mộng Việt</em></>}
      sub="Hơn 500 biểu tượng truyền thống — đây là những điều thường gặp nhất. Bấm vào để dùng làm gợi ý giải mã."
    >
      <Reveal>
        <div className="lib-tools">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="7" r="5" />
              <path d="M14 14L11 11" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Tìm biểu tượng — nước, rắn, bay..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="tab-row">
            {tabs.map((t) => (
              <button
                key={t}
                className={`tab-pill ${filter === t ? "on" : ""}`}
                onClick={() => setFilter(t)}
                type="button"
              >{t}</button>
            ))}
          </div>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>Chưa tìm thấy biểu tượng nào khớp. Thử từ khoá khác?</p>
        </div>
      ) : (
        <div className="lib-grid">
          {filtered.map((s, i) => (
            <Reveal key={s.key} delay={i * 25}>
              <div className="symbol-card" onClick={() => {
                sessionStorage.setItem("prefillDream", `Tôi mơ thấy ${s.name.toLowerCase()}... `);
                go("/");
              }}>
                <span className="badge">{s.badge}</span>
                <div className="symbol-icon">{sym[s.icon]}</div>
                <h3>{s.name}</h3>
                <p>{s.short}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </PageShell>
  );
};

// === Page: Lien He (Contact) ===
const PageLienHe = () => (
  <PageShell
    eyebrow="Liên hệ"
    title={<>Gửi một <em>cánh chim Lạc</em> tới chúng tôi</>}
    sub="Chúng tôi đọc mọi lời nhắn và thường trả lời trong vòng 24 giờ."
  >
    <ContactBlock />
  </PageShell>
);

// === Page: FAQ ===
const PageFAQ = () => (
  <PageShell
    eyebrow="FAQ"
    title={<>Câu hỏi <em>thường gặp</em></>}
    sub="Trang này đang được biên soạn — nội dung sẽ sớm có mặt."
  >
    <div className="empty-state large">
      <div className="empty-mark">
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="28" cy="28" r="22" />
          <path d="M22 22c0-4 3-6 6-6s6 2 6 6c0 3-3 4-5 6s-1 4-1 5" strokeLinecap="round" />
          <circle cx="28" cy="40" r="1.4" fill="currentColor" />
        </svg>
      </div>
      <h3>Đang được biên soạn</h3>
      <p>Trong khi chờ, bạn có thể thử giải mã một giấc mơ — hoặc gửi câu hỏi qua trang Liên hệ, chúng tôi rất vui được trả lời.</p>
    </div>
  </PageShell>
);

// === Shared page shell — eyebrow + title + content ===
const PageShell = ({ eyebrow, title, sub, children }) => (
  <div className="page-shell">
    <div className="page-head">
      <Reveal>
        <div className="eyebrow">
          <span className="dot"></span>
          {eyebrow}
        </div>
      </Reveal>
      <Reveal delay={80}><h1 className="page-title">{title}</h1></Reveal>
      {sub && <Reveal delay={160}><p className="page-sub">{sub}</p></Reveal>}
    </div>
    <Reveal delay={220}>{children}</Reveal>
  </div>
);

const ArrowIcon = () => (
  <span className="arrow">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

Object.assign(window, { PageSanPham, PageThuVien, PageLienHe, PageFAQ, PageShell, ArrowIcon, SleepGoods });

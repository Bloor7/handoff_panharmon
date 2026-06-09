// === Panharmon — Mobile screens (6 views) ===

// ─── 1. Trang chủ (Home) ───────────────────────────────────────
const MobileHome = () => (
  <div className="m-screen">
    <MTopBrand unread />
    <div className="m-content">
      {/* Hero */}
      <div style={{ padding: "32px 18px 24px", textAlign: "center", position: "relative" }}>
        {/* faint chim Lạc behind */}
        <svg
          viewBox="-80 -80 160 160"
          width="220"
          height="220"
          style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", opacity: 0.08, pointerEvents: "none" }}
          stroke="#e8c98a"
          strokeWidth="0.5"
          fill="none"
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return (
              <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 56} y2={Math.sin(a) * 56} />
            );
          })}
          <circle cx="0" cy="0" r="38" />
        </svg>

        <div style={{ position: "relative" }}>
          <span className="m-eyebrow">
            <span className="m-dot"></span>
            Tri thức Việt · Tâm lý hiện đại
          </span>
          <h1 className="m-h1">
            Lời thì thầm <br />
            từ <em>giấc mộng đêm qua</em>
          </h1>
          <p className="m-sub">
            Kể lại giấc mơ của bạn — Panharmon đọc nó qua ba lăng kính: dân gian Việt, tâm lý học Jung, và khoa học giấc ngủ.
          </p>
          <button className="m-btn m-btn-primary m-btn-full" type="button">
            Giải mã ngay
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {[
            ["120k+", "giấc mơ"],
            ["500+", "biểu tượng"],
            ["4.9★", "đánh giá"],
          ].map(([n, s]) => (
            <div key={s} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 500, color: "#e8c98a" }}>
                {n}
              </div>
              <div className="m-mute" style={{ marginTop: 2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div style={{ padding: "0 18px 24px" }}>
        <div className="m-section-h">Cách Panharmon lắng nghe</div>
        {[
          { n: "01", t: "Bạn kể lại", d: "Chi tiết bao nhiêu, lời giải chạm đúng bấy nhiêu." },
          { n: "02", t: "Ba lăng kính giao thoa", d: "Dân gian · Jung · Khoa học giấc ngủ." },
          { n: "03", t: "Lời giải về bạn", d: "Không bói. Là một cuộc trò chuyện với chính mình." },
        ].map((s, i) => (
          <div key={s.n} className="m-card" style={{ marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
              fontSize: 22, color: "#d4a857", lineHeight: 1, marginTop: 2,
            }}>
              {s.n}
            </div>
            <div>
              <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 500, color: "#f4ecd8", marginBottom: 4 }}>
                {s.t}
              </div>
              <div style={{ color: "#c9c1b0", fontSize: 13.5, lineHeight: 1.5 }}>{s.d}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured article teaser */}
      <div style={{ padding: "0 18px 32px" }}>
        <div className="m-section-h">Đọc tuần này</div>
        <div className="m-card m-card-emph" style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "radial-gradient(circle, rgba(111,185,160,0.22), transparent 70%)", display: "grid", placeItems: "center" }}>
            <svg width="44" height="44" viewBox="0 0 60 60" fill="none" stroke="#6fb9a0" strokeWidth="1.2" strokeLinecap="round">
              <path d="M6 26q9-6 18 0t18 0t18 0" />
              <path d="M0 36q12-6 18 0t18 0t18 0t18 0" opacity="0.7" />
              <path d="M6 46q9-6 18 0t18 0t18 0" opacity="0.45" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 11, letterSpacing: "0.14em", color: "#6fb9a0", textTransform: "uppercase" }}>
              Ngũ hành · Thuỷ
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 16, fontWeight: 500, lineHeight: 1.2, marginTop: 2 }}>
              Nước trong mơ — dòng chảy cảm xúc
            </div>
            <div className="m-mute" style={{ marginTop: 4 }}>7 phút đọc →</div>
          </div>
        </div>
      </div>
    </div>
    <MTabBar active="home" />
  </div>
);

// ─── 2. Giải mã — Input ────────────────────────────────────────
const MobileGiaiMa = () => (
  <div className="m-screen">
    <MTopTitle title="Kể giấc mơ" />
    <div className="m-content">
      <div style={{ padding: "20px 18px 16px" }}>
        <h2 className="m-h2" style={{ marginBottom: 10 }}>Đêm qua bạn mơ thấy gì?</h2>
        <p className="m-sub" style={{ fontSize: 13.5 }}>
          Kể tự nhiên như đang nhắn cho người bạn thân — màu sắc, người xuất hiện, cảm xúc đọng lại lúc tỉnh dậy.
        </p>
      </div>

      {/* Textarea */}
      <div style={{ padding: "0 18px" }}>
        <div style={{
          background: "rgba(17,22,52,0.65)",
          border: "1px solid rgba(212,168,87,0.22)",
          borderRadius: 14,
          padding: "16px",
          minHeight: 160,
          color: "#f4ecd8",
          fontSize: 15,
          lineHeight: 1.55,
        }}>
          <span>Tôi mơ thấy mình đứng bên một dòng sông rất rộng. Trời chạng vạng. Nước chảy ngược lên cao, và có một con cá chép màu vàng bơi qua…</span>
          <span style={{ display: "inline-block", width: 2, height: 18, background: "#d4a857", marginLeft: 2, verticalAlign: -3, animation: "blink 1s steps(2) infinite" }} />
        </div>
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span className="m-mute">132 / 800 ký tự</span>
          <button type="button" style={{
            background: "transparent", border: "none", color: "#e8c98a",
            fontSize: 12.5, letterSpacing: "0.08em", padding: 0,
          }}>
            Thử mẫu giấc mơ →
          </button>
        </div>
      </div>

      {/* Quick tags */}
      <div style={{ marginTop: 20 }}>
        <div className="m-section-h" style={{ padding: "0 18px" }}>Gợi ý biểu tượng</div>
        <div className="m-chip-row">
          {["Nước", "Cá chép", "Bay lượn", "Người đã mất", "Rắn", "Lửa", "Rụng răng", "Mê cung"].map((t, i) => (
            <span key={t} className={`m-chip ${i === 0 || i === 1 ? "on" : ""}`}>
              {(i === 0 || i === 1) && <span style={{ fontSize: 10 }}>✓</span>}
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div style={{ padding: "0 18px", marginTop: 8 }}>
        <div className="m-section-h">Cảm giác khi tỉnh dậy</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
          {[
            { label: "Yên bình", c: "#6fb9a0" },
            { label: "Lo âu", c: "#c97b9b", on: true },
            { label: "Hồi hộp", c: "#e8a86c" },
            { label: "Buồn", c: "#8ca8c9" },
            { label: "Vui", c: "#e8c98a" },
            { label: "Khác", c: "#8c8676" },
          ].map((m) => (
            <button key={m.label} type="button" className="m-chip" style={{
              justifyContent: "flex-start", padding: "10px 12px",
              background: m.on ? `${m.c}24` : undefined,
              borderColor: m.on ? m.c : undefined,
              color: m.on ? "#f4ecd8" : "#c9c1b0",
            }}>
              <span className="m-chip-dot" style={{ background: m.c }} />
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: 24 }} />
    </div>

    {/* Sticky bottom CTA */}
    <div style={{
      position: "absolute", bottom: 84, left: 0, right: 0,
      padding: "12px 18px",
      background: "linear-gradient(to top, rgba(10,14,31,0.95) 70%, transparent)",
      pointerEvents: "auto",
    }}>
      <button className="m-btn m-btn-primary m-btn-full" type="button">
        Giải mã giấc mơ
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>

    <MTabBar active="home" />
  </div>
);

// ─── 3. Kết quả ────────────────────────────────────────────────
const MobileKetQua = () => (
  <div className="m-screen">
    <MTopTitle title="Lời giải"
      action={<button className="m-iconbtn" type="button">{MIcon.bookmark}</button>}
    />
    <div className="m-content" style={{ padding: "18px 18px 24px" }}>
      {/* Title */}
      <div style={{ marginBottom: 18 }}>
        <span className="m-eyebrow">
          <span className="m-dot"></span>
          Lo âu · Chuyển hoá
        </span>
        <h1 className="m-h1" style={{ fontSize: 28, marginTop: 12 }}>
          Dòng nước cuộn — <em>và một con cá chép</em>
        </h1>
        <p className="m-sub" style={{ fontSize: 14 }}>
          Một giấc mơ kép — vừa nói về cảm xúc đang dâng cao, vừa báo một sự kiên nhẫn sắp ra hoa.
        </p>
      </div>

      {/* Section: Cốt lõi */}
      <div className="m-card m-card-emph" style={{ marginBottom: 12 }}>
        <div className="m-section-h" style={{ margin: 0, marginBottom: 8 }}>Cốt lõi</div>
        <p style={{ margin: 0, color: "#f4ecd8", fontSize: 14.5, lineHeight: 1.65 }}>
          Tâm bạn đang ở giai đoạn nhiều xáo trộn — dòng nước cuộn báo cảm xúc chưa được đặt tên. Nhưng cá chép vàng bơi qua nói rằng phần sâu trong bạn vẫn biết hướng về điều đáng — chỉ cần một chút kiên nhẫn nữa.
        </p>
      </div>

      {/* Section: Biểu tượng */}
      <div className="m-section-h">Biểu tượng trong giấc mơ</div>
      {[
        { name: "Nước cuộn", side: "Cảm xúc", c: "#6fb9a0", d: "Dấu hiệu một cảm xúc lớn (lo, mong, giận) chưa được bạn thừa nhận đủ." },
        { name: "Cá chép vàng", side: "Phước lành", c: "#e8a86c", d: "Sự kiên nhẫn, vượt vũ môn. Điều bạn đang chờ sắp ra hình." },
        { name: "Trời chạng vạng", side: "Chuyển giao", c: "#a98bcd", d: "Một chương đang khép — chương mới đang mở." },
      ].map((s) => (
        <div key={s.name} className="m-card" style={{ marginBottom: 8, display: "flex", gap: 12 }}>
          <div style={{
            width: 8, alignSelf: "stretch", borderRadius: 2,
            background: s.c, opacity: 0.7, flexShrink: 0,
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 500, color: "#f4ecd8" }}>
                {s.name}
              </span>
              <span style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: s.c }}>
                {s.side}
              </span>
            </div>
            <div style={{ color: "#c9c1b0", fontSize: 13.5, lineHeight: 1.55 }}>{s.d}</div>
          </div>
        </div>
      ))}

      {/* Section: Lời khuyên */}
      <div className="m-section-h">Lời khuyên dịu dàng</div>
      <div className="m-card" style={{ borderLeft: "2px solid #e8c98a", paddingLeft: 16 }}>
        <p style={{
          margin: 0,
          fontFamily: "Cormorant Garamond, serif",
          fontStyle: "italic",
          fontSize: 17,
          lineHeight: 1.45,
          color: "#f4ecd8",
        }}>
          Tuần này, hãy cho mình một buổi tối yên — viết ra một cảm xúc bạn vẫn chưa dám đặt tên. Đặt tên cho nước, thì nước biết đường về biển.
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button className="m-btn m-btn-ghost" type="button" style={{ flex: 1 }}>
          {MIcon.bookmark} Lưu nhật ký
        </button>
        <button className="m-btn m-btn-ghost" type="button" style={{ width: 46, padding: 0 }} aria-label="Chia sẻ">
          {MIcon.share}
        </button>
      </div>
    </div>
    <MTabBar active="home" />
  </div>
);

// ─── 4. Tủ sách (Blog) ─────────────────────────────────────────
const MobileTuSach = () => {
  const articles = [
    { eyebrow: "Ngũ hành · Thuỷ", title: "Nước trong mơ — dòng chảy cảm xúc", time: "7 phút", c: "#6fb9a0", glyph: "wave" },
    { eyebrow: "Linh vật · Chuyển hoá", title: "Rắn — kẻ canh giữ ngưỡng biến chuyển", time: "8 phút", c: "#a98bcd", glyph: "snake" },
    { eyebrow: "Tự do · Khát vọng", title: "Bay lượn — khi linh hồn rộng hơn cơ thể", time: "6 phút", c: "#e8c98a", glyph: "bird" },
    { eyebrow: "Lo âu · Cơ thể", title: "Rụng răng — nỗi sợ mất kiểm soát", time: "7 phút", c: "#c97b9b", glyph: "tooth" },
  ];

  const Glyph = ({ kind, c }) => {
    const common = { width: 48, height: 48, fill: "none", stroke: c, strokeWidth: 1.3, strokeLinecap: "round" };
    if (kind === "wave") return (
      <svg viewBox="0 0 60 60" {...common}>
        <path d="M6 22q12-10 24 0t24 0" /><path d="M2 32q14-10 28 0t28 0" opacity="0.7" /><path d="M6 42q12-10 24 0t24 0" opacity="0.45" />
      </svg>
    );
    if (kind === "snake") return (
      <svg viewBox="0 0 60 60" {...common}>
        <path d="M14 14C30 14, 14 30, 30 30 C46 30, 30 46, 46 46" />
        <circle cx="14" cy="14" r="1.6" fill={c} />
        <path d="M46 46 l4 -1 M46 46 l4 1" />
      </svg>
    );
    if (kind === "bird") return (
      <svg viewBox="0 0 60 60" {...common}>
        <path d="M12 36q8-12 18-2 q10-10 18 2" /><path d="M30 34 v9" />
      </svg>
    );
    if (kind === "tooth") return (
      <svg viewBox="0 0 60 60" {...common} strokeLinejoin="round">
        <path d="M18 16q0-6 8-6 q5 0 6 4 q1-4 6-4 q8 0 8 6 q0 18-6 30 q-3 4-5-4 q-2-8-3 0 q-2 8-5 4 q-6-12-9-30Z" />
      </svg>
    );
    return null;
  };

  return (
    <div className="m-screen">
      <MTopTitle title="Tủ sách giải mã"
        action={<button className="m-iconbtn" type="button">{MIcon.search}</button>}
      />
      <div className="m-content">
        {/* Filter chips */}
        <div className="m-chip-row" style={{ paddingTop: 16 }}>
          {["Tất cả", "Lo âu", "Mất mát", "Tự do", "Tình yêu", "Chuyển hoá"].map((t, i) => (
            <span key={t} className={`m-chip ${i === 0 ? "on" : ""}`}>{t}</span>
          ))}
        </div>

        <div style={{ padding: "4px 18px 28px" }}>
          {articles.map((a, i) => (
            <article key={a.title} className="m-card" style={{
              marginBottom: 12,
              display: "grid",
              gridTemplateColumns: "72px 1fr",
              gap: 14,
              padding: 16,
              borderLeft: `2px solid ${a.c}66`,
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: 50,
                background: `radial-gradient(circle, ${a.c}26, transparent 70%)`,
                display: "grid", placeItems: "center",
              }}>
                <Glyph kind={a.glyph} c={a.c} />
              </div>
              <div>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: 11, letterSpacing: "0.14em", color: a.c, textTransform: "uppercase",
                }}>{a.eyebrow}</div>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontSize: 18, fontWeight: 500,
                  lineHeight: 1.18, color: "#f4ecd8", marginTop: 4,
                  textWrap: "balance",
                }}>{a.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span className="m-mute">{a.time} đọc</span>
                  <span style={{ color: "#e8c98a", fontSize: 11.5 }}>Đọc →</span>
                </div>
              </div>
            </article>
          ))}

          {/* End-of-list note */}
          <div style={{
            textAlign: "center", padding: "20px 10px", color: "#8c8676",
            fontFamily: "Cormorant Garamond, serif", fontStyle: "italic", fontSize: 13,
          }}>
            — Tuần sau: Cá chép vượt vũ môn —
          </div>
        </div>
      </div>

      <button className="m-iris-fab" type="button" aria-label="Hỏi Iris">{MIcon.chat}</button>
      <MTabBar active="blog" />
    </div>
  );
};

// ─── 5. Thư viện (Library) — emotion wheel + bàn rút thẻ ──────
// Shared mock data used by the 3 library screens below.
const MTAGS = [
  { key: "lo-au",    vi: "Lo âu",     c: "#c97b9b", n: 394, ang: -110 },
  { key: "tinh-yeu", vi: "Tình yêu",  c: "#d995b5", n: 312, ang: -50 },
  { key: "tu-do",    vi: "Tự do",     c: "#e8c98a", n: 265, ang: 10 },
  { key: "chuyen",   vi: "Chuyển hoá",c: "#a98bcd", n: 220, ang: 70 },
  { key: "mat-mat",  vi: "Mất mát",   c: "#8ca8c9", n: 289, ang: 130 },
  { key: "suc-khoe", vi: "Sức khoẻ",  c: "#6fb9a0", n: 150, ang: -170 },
];

const MENTRIES = [
  { vi: "Sự bỏ rơi",   en: "Abandonment", l: "A", placed: false },
  { vi: "Vực sâu",     en: "Abyss",       l: "A", placed: true  },
  { vi: "Cô đơn",      en: "Alone",       l: "A", placed: false },
  { vi: "Lo lắng",     en: "Anxiety",     l: "A", placed: false },
  { vi: "Bị săn đuổi", en: "Being chased",l: "B", placed: false },
  { vi: "Bị mắc kẹt",  en: "Trapped",     l: "T", placed: true  },
  { vi: "Đêm tối",     en: "Darkness",    l: "D", placed: false },
  { vi: "Mê cung",     en: "Maze",        l: "M", placed: false },
];

// Compact emotion wheel preview (trống đồng) for mobile header
const MWheel = ({ activeKey, onTag, size = 220 }) => {
  const r = size / 2;
  const ringR = r * 0.78;
  const tagR = r * 0.92;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      {/* outer dots */}
      {Array.from({ length: 36 }).map((_, i) => {
        const a = (i / 36) * Math.PI * 2;
        return <circle key={i} cx={r + Math.cos(a) * r * 0.96} cy={r + Math.sin(a) * r * 0.96} r="1" fill="rgba(212,168,87,0.4)" />;
      })}
      {/* rings */}
      <circle cx={r} cy={r} r={ringR} fill="none" stroke="rgba(212,168,87,0.22)" />
      <circle cx={r} cy={r} r={ringR - 14} fill="none" stroke="rgba(212,168,87,0.14)" strokeDasharray="1 4" />
      {/* sun */}
      <circle cx={r} cy={r} r="22" fill="rgba(17,22,52,0.7)" stroke="rgba(212,168,87,0.5)" />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <line key={i}
          x1={r + Math.cos(a) * 22} y1={r + Math.sin(a) * 22}
          x2={r + Math.cos(a) * 30} y2={r + Math.sin(a) * 30}
          stroke="rgba(212,168,87,0.55)" strokeWidth="0.8"
        />;
      })}
      <text x={r} y={r - 1} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="11" fill="#e8c98a">Mộng</text>
      <text x={r} y={r + 11} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize="11" fill="#e8c98a">Triệu</text>
      {/* tags */}
      {MTAGS.map((t) => {
        const a = (t.ang * Math.PI) / 180;
        const x = r + Math.cos(a) * tagR * 0.62;
        const y = r + Math.sin(a) * tagR * 0.62;
        const isActive = t.key === activeKey;
        return (
          <g key={t.key} onClick={() => onTag && onTag(t)} style={{ cursor: "pointer" }}>
            <line x1={r} y1={r} x2={x} y2={y} stroke={t.c} strokeWidth={isActive ? 1.4 : 0.6} strokeOpacity={isActive ? 0.8 : 0.32} />
            <circle cx={x} cy={y} r={isActive ? 12 : 9} fill="rgba(10,14,31,0.85)" stroke={t.c} strokeWidth={isActive ? 1.6 : 1} />
            <circle cx={x} cy={y} r="2.6" fill={t.c} opacity={isActive ? 1 : 0.7} />
            <text
              x={x} y={y + (Math.sin(a) > 0 ? 24 : -16)} textAnchor="middle"
              fontSize="9.5" fontFamily="Be Vietnam Pro, sans-serif"
              fill={isActive ? t.c : "#c9c1b0"} fontWeight={isActive ? 600 : 400}
              letterSpacing="0.04em"
            >{t.vi}</text>
          </g>
        );
      })}
    </svg>
  );
};

// Mini placed card for mobile strip
const MPlacedCard = ({ vi, en, c, l }) => (
  <div style={{
    position: "relative",
    width: 96, height: 132,
    flexShrink: 0,
    padding: "10px 8px 28px",
    background: "linear-gradient(180deg, rgba(248,243,230,0.04) 0%, rgba(248,243,230,0.015) 100%)",
    border: `1px solid ${c}66`,
    borderRadius: 10,
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
    boxShadow: `0 8px 18px -10px ${c}77`,
  }}>
    <span style={{
      position: "absolute", top: 6, left: 8,
      fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
      fontSize: 11, color: c, opacity: 0.85,
    }}>{l}</span>
    <span style={{
      position: "absolute", bottom: 6, right: 8, transform: "rotate(180deg)",
      fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
      fontSize: 11, color: c, opacity: 0.85,
    }}>{l}</span>
    <span style={{ width: 6, height: 6, borderRadius: 50, background: c, boxShadow: `0 0 6px ${c}`, marginTop: 12 }} />
    <div style={{
      fontFamily: "Cormorant Garamond, serif", fontWeight: 500,
      fontSize: 14, color: "#f4ecd8", lineHeight: 1.15, marginTop: 6,
      textWrap: "balance",
    }}>{vi}</div>
    <div style={{
      position: "absolute", bottom: 6, left: 6, right: 6,
      padding: "5px 4px",
      background: `${c}22`,
      border: `1px solid ${c}55`,
      borderRadius: 5,
      color: "#e8c98a", fontSize: 8.5, letterSpacing: "0.06em",
    }}>Giải mã →</div>
  </div>
);

const MobileThuVien = () => {
  const placed = MENTRIES.filter(e => e.placed);
  const limit = 5;
  return (
    <div className="m-screen">
      <MTopTitle title="Thư viện biểu tượng"
        action={
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 10px",
            background: "rgba(212,168,87,0.08)",
            border: "1px solid rgba(212,168,87,0.22)",
            borderRadius: 999,
            fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#8c8676",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 50, background: "#d4a857", boxShadow: "0 0 6px #d4a857" }} />
            Bàn <strong style={{ color: "#e8c98a", fontFamily: "Cormorant Garamond, serif", fontSize: 13, fontWeight: 500 }}>{placed.length}</strong>/{limit}
          </span>
        }
      />
      <div className="m-content">
        {/* Intro */}
        <div style={{ padding: "12px 18px 6px", textAlign: "center" }}>
          <span className="m-eyebrow"><span className="m-dot" /> 6,302 biểu tượng · 18 nhánh</span>
          <p style={{ margin: "10px 0 0", color: "#c9c1b0", fontSize: 13, lineHeight: 1.55 }}>
            Chạm vào một nhánh trên trống đồng để mở danh sách thẻ.
          </p>
        </div>

        {/* Wheel */}
        <div style={{ display: "grid", placeItems: "center", padding: "4px 0 8px" }}>
          <MWheel activeKey="lo-au" />
        </div>

        {/* Bàn rút thẻ */}
        <div style={{ padding: "10px 16px 22px" }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            marginBottom: 10, padding: "0 2px",
          }}>
            <div>
              <div style={{
                fontSize: 10, letterSpacing: "0.22em", color: "#8c8676",
                textTransform: "uppercase",
              }}>
                <span style={{
                  display: "inline-block", width: 5, height: 5, marginRight: 6, verticalAlign: 1,
                  background: "#d4a857", borderRadius: 50, boxShadow: "0 0 6px #d4a857",
                }} />
                Bàn rút thẻ
              </div>
              <div style={{
                fontFamily: "Cormorant Garamond, serif", fontSize: 18,
                color: "#f4ecd8", fontWeight: 500, marginTop: 4,
              }}>
                {placed.length === 0 ? "Bàn còn trống" : `${placed.length} lá đã đặt`}
              </div>
            </div>
            {placed.length > 0 && (
              <span style={{ fontSize: 11, color: "#8c8676" }}>
                <em style={{ fontFamily: "Cormorant Garamond, serif" }}>vuốt ngang →</em>
              </span>
            )}
          </div>

          {placed.length === 0 ? (
            <div style={{
              padding: "20px 18px",
              border: "1px dashed rgba(212,168,87,0.2)",
              borderRadius: 12,
              textAlign: "center",
              color: "#8c8676",
              fontSize: 12.5, lineHeight: 1.55,
              fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
            }}>
              Chờ lá đầu tiên rơi xuống bàn.
            </div>
          ) : (
            <div style={{
              display: "flex", gap: 10,
              overflowX: "auto",
              padding: "4px 2px 10px",
              scrollbarWidth: "none",
            }}>
              {placed.map((e) => (
                <MPlacedCard key={e.en} vi={e.vi} en={e.en} l={e.l}
                  c={e.en === "Abyss" ? "#c97b9b" : "#8ca8c9"}
                />
              ))}
              {/* Ghost slots */}
              {Array.from({ length: limit - placed.length }).map((_, i) => (
                <div key={i} style={{
                  width: 96, height: 132, flexShrink: 0,
                  border: "1px dashed rgba(212,168,87,0.18)",
                  borderRadius: 10,
                  display: "grid", placeItems: "center",
                  color: "#5a5443",
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: 22,
                  opacity: 0.5,
                }}>{placed.length + i + 1}</div>
              ))}
            </div>
          )}

          {placed.length > 0 && (
            <button type="button" className="m-btn m-btn-primary m-btn-full" style={{ marginTop: 14 }}>
              Giải mã với {placed.length} lá
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <MTabBar active="tree" />
    </div>
  );
};

// ─── 5b. Thư viện — popup mở (grid thẻ) ────────────────────────
const MobileThuVienPopup = () => {
  const tag = MTAGS[0]; // Lo âu
  return (
    <div className="m-screen">
      {/* Dimmed wheel still faintly visible behind */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.18, display: "grid", placeItems: "center", pointerEvents: "none" }}>
        <MWheel activeKey={tag.key} size={280} />
      </div>
      {/* Backdrop tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(400px 240px at 50% 25%, ${tag.c}15, rgba(10,14,31,0.92) 70%)`,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }} />

      {/* Popup modal */}
      <div style={{
        position: "absolute", left: 12, right: 12, top: 56, bottom: 88,
        background: "linear-gradient(180deg, rgba(26,32,73,0.96) 0%, rgba(17,22,52,0.94) 100%)",
        border: `1px solid ${tag.c}55`,
        borderRadius: 20,
        boxShadow: `0 30px 50px -16px rgba(0,0,0,0.6), 0 0 50px -10px ${tag.c}44`,
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* Decorative corners */}
        {[
          { top: 8, left: 8, borderRight: 0, borderBottom: 0, borderTopLeftRadius: 12 },
          { bottom: 8, right: 8, borderLeft: 0, borderTop: 0, borderBottomRightRadius: 12 },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: 22, height: 22,
            border: `1px solid ${tag.c}66`, ...s,
          }} />
        ))}

        {/* Header */}
        <div style={{
          padding: "16px 16px 14px",
          borderBottom: "1px solid rgba(212,168,87,0.15)",
          display: "flex", alignItems: "center", gap: 12,
          background: `radial-gradient(180px 40px at 50% 0%, ${tag.c}1a, transparent 70%)`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 50,
            border: `1.5px solid ${tag.c}`, color: tag.c,
            display: "grid", placeItems: "center",
            fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
            fontSize: 18, fontWeight: 500,
          }}>{tag.vi.charAt(0)}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.22em", color: "#8c8676", textTransform: "uppercase" }}>
              <span style={{ display: "inline-block", width: 5, height: 5, background: tag.c, borderRadius: 50, marginRight: 5, verticalAlign: 1, boxShadow: `0 0 6px ${tag.c}` }} />
              Nhánh cảm xúc
            </div>
            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 500, lineHeight: 1, marginTop: 4 }}>
              {tag.vi}
            </div>
            <div style={{ fontSize: 11, color: "#8c8676", marginTop: 3 }}>
              <strong style={{ color: "#e8c98a", fontWeight: 500 }}>{tag.n}</strong> biểu tượng
            </div>
          </div>
          <button type="button" style={{
            width: 30, height: 30, borderRadius: 50,
            background: "transparent",
            border: "1px solid rgba(212,168,87,0.18)",
            color: "#c9c1b0",
            display: "grid", placeItems: "center",
            flexShrink: 0,
          }} aria-label="Đóng">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4L12 12M12 4L4 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 14px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px",
            background: "rgba(10,14,31,0.55)",
            border: "1px solid rgba(212,168,87,0.18)",
            borderRadius: 999,
            color: "#8c8676",
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.6" />
              <path d="M14 14L10.5 10.5" />
            </svg>
            <span style={{ fontSize: 12.5 }}>Tìm trong "{tag.vi}"…</span>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "12px 14px 16px",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {MENTRIES.map((e, i) => (
              <div key={e.en} style={{
                position: "relative",
                padding: "14px 12px 12px",
                background: e.placed
                  ? `linear-gradient(180deg, ${tag.c}1a 0%, transparent 100%)`
                  : "linear-gradient(180deg, rgba(248,243,230,0.025) 0%, rgba(248,243,230,0.01) 100%)",
                border: `1px solid ${e.placed ? `${tag.c}66` : "rgba(212,168,87,0.18)"}`,
                borderRadius: 10,
                display: "flex", flexDirection: "column", gap: 4,
                minHeight: 92,
              }}>
                <span style={{
                  fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
                  fontSize: 18, color: tag.c, opacity: 0.85, lineHeight: 1,
                }}>{e.l}</span>
                <div style={{
                  fontFamily: "Cormorant Garamond, serif", fontWeight: 500,
                  fontSize: 15.5, color: "#f4ecd8", lineHeight: 1.15,
                  marginTop: 2,
                }}>{e.vi}</div>
                <div style={{
                  fontSize: 9, letterSpacing: "0.16em", color: "#8c8676",
                  textTransform: "uppercase", marginTop: "auto",
                }}>{e.en}</div>
                {e.placed && (
                  <span style={{
                    position: "absolute", top: 6, right: 6,
                    display: "inline-flex", alignItems: "center", gap: 3,
                    padding: "2px 6px 2px 4px",
                    background: `${tag.c}33`,
                    border: `1px solid ${tag.c}77`,
                    borderRadius: 999,
                    color: "#e8c98a",
                    fontSize: 8.5, letterSpacing: "0.04em",
                  }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 6.5l2.5 2.5 4.5-6" />
                    </svg>
                    Đã đặt
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MTabBar active="tree" />
    </div>
  );
};

// ─── 5c. Thư viện — thẻ được phóng to ──────────────────────────
const MobileThuVienZoom = () => {
  const tag = MTAGS[0];
  const entry = { vi: "Bị mắc kẹt", en: "Trapped", l: "T",
    def: "Cảm giác không có lựa chọn — thường đến trước một quyết định lớn. Một phần trong bạn đang đợi sự cho phép để bước qua ngưỡng cửa."
  };
  return (
    <div className="m-screen">
      {/* Deep dimmed background */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.08, display: "grid", placeItems: "center", pointerEvents: "none" }}>
        <MWheel activeKey={tag.key} size={280} />
      </div>
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(400px 320px at 50% 40%, ${tag.c}14, rgba(10,14,31,0.96) 75%)`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20, gap: 16,
      }}>
        {/* Zoomed tarot card */}
        <div style={{
          position: "relative",
          width: 280,
          padding: "20px 22px 22px",
          background: "linear-gradient(180deg, rgba(26,32,73,0.96) 0%, rgba(17,22,52,0.92) 100%)",
          border: `1px solid ${tag.c}`,
          borderRadius: 16,
          boxShadow: `0 30px 50px -16px rgba(0,0,0,0.7), 0 0 50px -8px ${tag.c}77`,
          color: "#f4ecd8",
          textAlign: "center",
        }}>
          {/* Inner gold frame */}
          <div style={{
            position: "absolute", inset: 8,
            border: `1px solid ${tag.c}44`,
            borderRadius: 10,
            pointerEvents: "none",
          }} />
          {/* Top arch */}
          <svg viewBox="0 0 200 18" preserveAspectRatio="none" style={{ width: "100%", height: 14, marginBottom: 8 }}>
            <path d="M 0 18 L 0 9 Q 100 -3 200 9 L 200 18" fill="none" stroke={tag.c} strokeWidth="0.6" strokeOpacity="0.5" />
            <circle cx="100" cy="7" r="2.5" fill="none" stroke={tag.c} strokeWidth="0.7" />
            <circle cx="100" cy="7" r="0.8" fill={tag.c} />
          </svg>

          <span style={{
            position: "absolute", top: 14, left: 14,
            fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
            fontSize: 16, color: tag.c, opacity: 0.85,
          }}>{entry.l}</span>
          <span style={{
            position: "absolute", bottom: 14, right: 14, transform: "rotate(180deg)",
            fontFamily: "Cormorant Garamond, serif", fontStyle: "italic",
            fontSize: 16, color: tag.c, opacity: 0.85,
          }}>{entry.l}</span>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 9.5, letterSpacing: "0.22em", color: "#8c8676",
            textTransform: "uppercase",
          }}>
            <span style={{ width: 5, height: 5, background: tag.c, borderRadius: 50, boxShadow: `0 0 6px ${tag.c}` }} />
            {tag.vi}
          </div>
          <h3 style={{
            fontFamily: "Cormorant Garamond, serif", fontWeight: 500,
            fontSize: 28, margin: "6px 0 0", lineHeight: 1.05,
            color: "#f4ecd8",
          }}>{entry.vi}</h3>
          <p style={{
            margin: "2px 0 8px",
            fontSize: 10, letterSpacing: "0.22em", color: "#8c8676",
            textTransform: "uppercase",
          }}>{entry.en}</p>
          <div style={{
            display: "flex", justifyContent: "center", gap: 4, flexWrap: "wrap",
            margin: "4px 0 10px",
          }}>
            {[tag, MTAGS[3]].map(t => (
              <span key={t.key} style={{
                fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "2px 8px",
                border: `1px solid ${t.c}55`,
                color: t.c, borderRadius: 999,
              }}>{t.vi}</span>
            ))}
          </div>
          <p style={{
            margin: 0,
            fontSize: 13, lineHeight: 1.6,
            color: "#c9c1b0",
            textWrap: "pretty",
          }}>{entry.def}</p>

          {/* Bottom arch */}
          <svg viewBox="0 0 200 18" preserveAspectRatio="none" style={{ width: "100%", height: 14, marginTop: 12 }}>
            <path d="M 0 0 L 0 9 Q 100 21 200 9 L 200 0" fill="none" stroke={tag.c} strokeWidth="0.6" strokeOpacity="0.5" />
            <circle cx="100" cy="11" r="2.5" fill="none" stroke={tag.c} strokeWidth="0.7" />
            <circle cx="100" cy="11" r="0.8" fill={tag.c} />
          </svg>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 280 }}>
          <button type="button" className="m-btn m-btn-primary m-btn-full">
            Đặt vào bàn
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v8m-4-4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="m-btn m-btn-ghost m-btn-full">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Xem thẻ khác
          </button>
        </div>
      </div>

      <MTabBar active="tree" />
    </div>
  );
};

// ─── 6. Iris (Chat) ────────────────────────────────────────────
const MobileIris = () => (
  <div className="m-screen">
    <div className="m-top">
      <button className="m-back" type="button">{MIcon.back}</button>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 50,
          background: "linear-gradient(135deg, #d4a857, #e8c98a)",
          display: "grid", placeItems: "center", color: "#2a1f08",
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="10" cy="10" r="4" />
            <circle cx="10" cy="10" r="8" opacity="0.45" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 17, fontWeight: 500, color: "#f4ecd8", lineHeight: 1.1 }}>
            Iris
          </div>
          <div style={{ fontSize: 10.5, color: "#6fb9a0", letterSpacing: "0.08em", marginTop: 1 }}>
            ● Đang trực tuyến
          </div>
        </div>
      </div>
      <button className="m-iconbtn" type="button" aria-label="Thêm">{MIcon.plus}</button>
    </div>

    <div className="m-content" style={{ padding: "16px 14px 100px" }}>
      {/* Day separator */}
      <div style={{ textAlign: "center", margin: "0 0 18px" }}>
        <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "#8c8676", padding: "4px 12px", background: "rgba(212,168,87,0.06)", borderRadius: 999 }}>
          Hôm nay · 6:42 sáng
        </span>
      </div>

      {/* Iris greeting */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 50, background: "linear-gradient(135deg, #d4a857, #e8c98a)", flexShrink: 0, marginTop: 4 }} />
        <div style={{
          maxWidth: "78%",
          background: "rgba(17,22,52,0.7)",
          border: "1px solid rgba(212,168,87,0.18)",
          borderRadius: "14px 14px 14px 4px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.5,
          color: "#f4ecd8",
        }}>
          Chào bạn. Vừa thức dậy à? Mình ngồi đây sẵn — kể mình nghe giấc mơ đêm qua nhé.
        </div>
      </div>

      {/* User message */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <div style={{
          maxWidth: "78%",
          background: "linear-gradient(135deg, #d4a857, #e8c98a)",
          color: "#2a1f08",
          borderRadius: "14px 14px 4px 14px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.5,
          fontWeight: 400,
        }}>
          Mình mơ thấy bay lượn trên biển… nhưng cứ rơi xuống rồi lại bay lên. Cảm giác mệt nhưng đẹp.
        </div>
      </div>

      {/* Iris reply */}
      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 28, height: 28, borderRadius: 50, background: "linear-gradient(135deg, #d4a857, #e8c98a)", flexShrink: 0, marginTop: 4 }} />
        <div style={{
          maxWidth: "78%",
          background: "rgba(17,22,52,0.7)",
          border: "1px solid rgba(212,168,87,0.18)",
          borderRadius: "14px 14px 14px 4px",
          padding: "10px 14px",
          fontSize: 14,
          lineHeight: 1.55,
          color: "#f4ecd8",
        }}>
          Bay rồi rơi — rồi bay lại. Tâm bạn đang có một khát vọng đẹp nhưng có gì đó kéo bạn xuống nửa chừng. Bạn có muốn mình hỏi sâu hơn một chút không?
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            <span className="m-chip" style={{ fontSize: 12, padding: "6px 10px" }}>Có, hỏi mình đi</span>
            <span className="m-chip" style={{ fontSize: 12, padding: "6px 10px" }}>Giải mã đầy đủ</span>
          </div>
        </div>
      </div>

      {/* Typing indicator */}
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 50, background: "linear-gradient(135deg, #d4a857, #e8c98a)", flexShrink: 0, marginTop: 4, opacity: 0.7 }} />
        <div style={{
          background: "rgba(17,22,52,0.7)",
          border: "1px solid rgba(212,168,87,0.18)",
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 50, background: "#e8c98a", animation: "irisDot 1.2s infinite", animationDelay: "0s" }} />
          <span style={{ width: 6, height: 6, borderRadius: 50, background: "#e8c98a", animation: "irisDot 1.2s infinite", animationDelay: "0.2s" }} />
          <span style={{ width: 6, height: 6, borderRadius: 50, background: "#e8c98a", animation: "irisDot 1.2s infinite", animationDelay: "0.4s" }} />
        </div>
      </div>
      <style>{`@keyframes irisDot { 0%, 60%, 100% { opacity: 0.3; } 30% { opacity: 1; } }`}</style>
    </div>

    {/* Input bar */}
    <div style={{
      position: "absolute", bottom: 84, left: 0, right: 0,
      padding: "10px 14px 12px",
      background: "linear-gradient(to top, rgba(10,14,31,0.96) 70%, transparent)",
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
    }}>
      <button className="m-iconbtn" type="button" aria-label="Thêm" style={{ flexShrink: 0 }}>{MIcon.plus}</button>
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "rgba(17,22,52,0.8)",
        border: "1px solid rgba(212,168,87,0.22)",
        borderRadius: 22,
        padding: "10px 14px",
        gap: 10,
      }}>
        <span style={{ color: "#8c8676", flex: 1, fontSize: 14 }}>Nhắn cho Iris…</span>
        <button type="button" style={{ background: "none", border: 0, color: "#8c8676", padding: 0, display: "grid", placeItems: "center" }}>{MIcon.mic}</button>
      </div>
      <button type="button" style={{
        width: 42, height: 42, borderRadius: 50,
        background: "linear-gradient(135deg, #d4a857, #e8c98a)",
        color: "#2a1f08", border: "none",
        display: "grid", placeItems: "center",
        flexShrink: 0,
      }} aria-label="Gửi">{MIcon.send}</button>
    </div>

    <MTabBar active="iris" />
  </div>
);

Object.assign(window, {
  MobileHome, MobileGiaiMa, MobileKetQua,
  MobileTuSach, MobileThuVien, MobileThuVienPopup, MobileThuVienZoom,
  MobileIris,
});

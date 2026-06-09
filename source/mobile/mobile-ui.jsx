// === Panharmon — Mobile UI components ===
// 6 screens for the iOS frame: Home, Giải mã (input), Kết quả,
// Tủ sách (blog), Thư viện (library), Iris (chat).
// All screens share a top bar + sticky bottom tab bar.

// One-time CSS injection — scoped under .m-screen so it can't leak
// into the host design canvas styles.
if (typeof document !== "undefined" && !document.getElementById("m-styles")) {
  const s = document.createElement("style");
  s.id = "m-styles";
  s.textContent = `
    .m-screen {
      height: 100%;
      width: 100%;
      background:
        radial-gradient(800px 600px at 50% -20%, rgba(212,168,87,0.10), transparent 60%),
        radial-gradient(700px 600px at 100% 110%, rgba(138,90,140,0.18), transparent 60%),
        #0a0e1f;
      color: #f4ecd8;
      font-family: "Be Vietnam Pro", -apple-system, system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .m-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      scrollbar-width: none;
    }
    .m-content::-webkit-scrollbar { display: none; }

    /* === Top bar === */
    .m-top {
      padding: 64px 18px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: rgba(10,14,31,0.78);
      backdrop-filter: blur(14px) saturate(140%);
      -webkit-backdrop-filter: blur(14px) saturate(140%);
      position: relative;
      z-index: 5;
      border-bottom: 1px solid rgba(212,168,87,0.12);
      flex-shrink: 0;
    }
    .m-top-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: "Cormorant Garamond", serif;
      font-size: 20px;
      letter-spacing: 0.01em;
      color: #f4ecd8;
    }
    .m-top-brand em { color: #e8c98a; font-style: normal; }
    .m-top-title {
      font-family: "Cormorant Garamond", serif;
      font-weight: 500;
      font-size: 19px;
      color: #f4ecd8;
      letter-spacing: 0.005em;
    }
    .m-top-actions {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .m-iconbtn {
      width: 38px; height: 38px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #c9c1b0;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(212,168,87,0.14);
      position: relative;
    }
    .m-iconbtn:active { background: rgba(255,255,255,0.08); }
    .m-iconbtn .m-badge {
      position: absolute;
      top: 6px; right: 6px;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #e6a3a3;
      border: 2px solid #0a0e1f;
    }
    .m-back {
      width: 38px; height: 38px;
      display: grid;
      place-items: center;
      border-radius: 50%;
      color: #c9c1b0;
      background: rgba(255,255,255,0.05);
    }

    /* === Tab bar === */
    .m-tabbar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: rgba(10,14,31,0.88);
      backdrop-filter: blur(20px) saturate(160%);
      -webkit-backdrop-filter: blur(20px) saturate(160%);
      border-top: 1px solid rgba(212,168,87,0.18);
      padding: 10px 0 32px;
      flex-shrink: 0;
    }
    .m-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 4px 2px;
      color: #8c8676;
      font-size: 10.5px;
      letter-spacing: 0.04em;
      font-weight: 400;
      min-height: 48px;
      transition: color 0.15s ease;
    }
    .m-tab.active { color: #e8c98a; }
    .m-tab.active .m-tab-dot {
      width: 4px; height: 4px;
      border-radius: 50%;
      background: #d4a857;
      box-shadow: 0 0 6px #d4a857;
      margin-top: 1px;
    }
    .m-tab svg { display: block; }
    .m-tab-dot { width: 4px; height: 4px; }

    /* === Common text === */
    .m-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 10.5px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: #e8c98a;
      padding: 5px 12px;
      border: 1px solid rgba(212,168,87,0.32);
      border-radius: 999px;
      background: rgba(212,168,87,0.04);
    }
    .m-eyebrow .m-dot {
      width: 5px; height: 5px; background: #d4a857;
      border-radius: 50%; box-shadow: 0 0 8px #d4a857;
    }
    .m-h1 {
      font-family: "Cormorant Garamond", serif;
      font-weight: 400;
      font-size: 36px;
      line-height: 1.05;
      letter-spacing: -0.01em;
      color: #f4ecd8;
      margin: 14px 0 12px;
      text-wrap: balance;
    }
    .m-h1 em {
      font-style: italic;
      background: linear-gradient(135deg, #e8c98a 0%, #f3dca8 50%, #d4a857 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .m-h2 {
      font-family: "Cormorant Garamond", serif;
      font-weight: 500;
      font-size: 22px;
      line-height: 1.15;
      margin: 0;
      color: #f4ecd8;
      text-wrap: balance;
    }
    .m-sub {
      color: #c9c1b0;
      font-size: 14.5px;
      line-height: 1.55;
      text-wrap: pretty;
      margin: 0 0 18px;
    }
    .m-mute { color: #8c8676; font-size: 12.5px; }

    /* === Cards === */
    .m-card {
      background: rgba(17, 22, 52, 0.6);
      border: 1px solid rgba(212,168,87,0.14);
      border-radius: 12px;
      padding: 16px 18px;
    }
    .m-card-emph {
      background: linear-gradient(180deg, rgba(212,168,87,0.08), rgba(17,22,52,0.6));
      border-color: rgba(212,168,87,0.32);
    }

    /* === Buttons === */
    .m-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 18px;
      border-radius: 999px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid transparent;
      min-height: 46px;
      transition: transform 0.15s ease;
    }
    .m-btn:active { transform: scale(0.98); }
    .m-btn-primary {
      background: linear-gradient(135deg, #d4a857 0%, #e8c98a 100%);
      color: #2a1f08;
      box-shadow: 0 4px 18px -4px rgba(212,168,87,0.5);
    }
    .m-btn-ghost {
      background: rgba(212,168,87,0.06);
      color: #f4ecd8;
      border-color: rgba(212,168,87,0.32);
    }
    .m-btn-full { width: 100%; }

    /* === Chip === */
    .m-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 999px;
      font-size: 12.5px;
      color: #c9c1b0;
      background: rgba(212,168,87,0.05);
      border: 1px solid rgba(212,168,87,0.18);
      white-space: nowrap;
    }
    .m-chip.on {
      color: #2a1f08;
      background: linear-gradient(135deg, #d4a857, #e8c98a);
      border-color: transparent;
    }
    .m-chip-dot {
      width: 6px; height: 6px; border-radius: 50%;
    }

    /* === Scrollable chip row === */
    .m-chip-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 18px 12px;
      margin: 0 -18px;
      scrollbar-width: none;
    }
    .m-chip-row::-webkit-scrollbar { display: none; }
    .m-chip-row::after { content: ""; flex: 0 0 4px; }

    /* === Section heading === */
    .m-section-h {
      font-family: "Cormorant Garamond", serif;
      font-weight: 500;
      font-size: 13px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #e8c98a;
      margin: 24px 0 12px;
    }

    /* === Floating Iris === */
    .m-iris-fab {
      position: absolute;
      bottom: 92px;
      right: 16px;
      width: 52px; height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d4a857 0%, #e8c98a 100%);
      color: #2a1f08;
      display: grid;
      place-items: center;
      box-shadow: 0 8px 24px -6px rgba(212,168,87,0.55), 0 0 0 1px rgba(232,201,138,0.3) inset;
      z-index: 8;
    }
  `;
  document.head.appendChild(s);
}

// === Iconography (drum-inspired, minimal stroke) ===
const MIcon = {
  home: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="9" opacity="0.45" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={11 + Math.cos(a) * 3}
            y1={11 + Math.sin(a) * 3}
            x2={11 + Math.cos(a) * 6}
            y2={11 + Math.sin(a) * 6}
          />
        );
      })}
      <circle cx="11" cy="11" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  book: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M4 4h12v14H4z" />
      <path d="M4 4c0 7 0 11 0 14 4-1 8-1 12 0V4" opacity="0.6" />
      <line x1="7" y1="8" x2="13" y2="8" opacity="0.5" />
      <line x1="7" y1="11" x2="13" y2="11" opacity="0.5" />
    </svg>
  ),
  tree: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="11" cy="11" r="9" opacity="0.4" />
      <circle cx="11" cy="11" r="5" opacity="0.7" />
      <circle cx="11" cy="11" r="1.6" fill="currentColor" stroke="none" />
      <line x1="11" y1="2" x2="11" y2="20" opacity="0.25" />
      <line x1="2" y1="11" x2="20" y2="11" opacity="0.25" />
    </svg>
  ),
  chat: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 8c0-2 1-4 4-4h8c3 0 4 2 4 4v6c0 2-1 4-4 4h-3l-4 3v-3c-3 0-5-2-5-4V8z" strokeLinejoin="round" />
      <circle cx="8" cy="11" r="0.8" fill="currentColor" />
      <circle cx="11" cy="11" r="0.8" fill="currentColor" />
      <circle cx="14" cy="11" r="0.8" fill="currentColor" />
    </svg>
  ),
  back: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l-6 6 6 6" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="8" r="5.5" />
      <path d="M16 16l-3.5-3.5" />
    </svg>
  ),
  send: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 9L15.5 3 12 16l-3-6-6.5-1z" />
    </svg>
  ),
  mic: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
      <path d="M3 9c0 3.5 2.5 6 6 6s6-2.5 6-6M9 15v2" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M9 2v1M4 9c0-3 2-5 5-5s5 2 5 5c0 4 2 5 2 5H2s2-1 2-5zM7 16c0 1 1 1.5 2 1.5s2-0.5 2-1.5" strokeLinecap="round" />
    </svg>
  ),
  plus: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M9 4v10M4 9h10" />
    </svg>
  ),
  share: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 1.5v9M5.5 5L9 1.5 12.5 5M3 11v3.5h12V11" />
    </svg>
  ),
  bookmark: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
      <path d="M4 2h10v14l-5-3-5 3z" />
    </svg>
  ),
};

// === Mini brand mark (drum sun) ===
const MBrandMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" stroke="#d4a857" strokeWidth="0.9" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={16 + Math.cos(a) * 6}
          y1={16 + Math.sin(a) * 6}
          x2={16 + Math.cos(a) * 10}
          y2={16 + Math.sin(a) * 10}
          stroke="#d4a857"
          strokeWidth="0.7"
        />
      );
    })}
    <circle cx="16" cy="16" r="4.5" stroke="#e8c98a" strokeWidth="0.8" />
    <circle cx="16" cy="16" r="1.6" fill="#e8c98a" />
  </svg>
);

// === Tab bar ===
const MTabBar = ({ active = "home" }) => {
  const tabs = [
    { id: "home", label: "Trang chủ", icon: MIcon.home },
    { id: "blog", label: "Tủ sách", icon: MIcon.book },
    { id: "tree", label: "Thư viện", icon: MIcon.tree },
    { id: "iris", label: "Iris", icon: MIcon.chat },
  ];
  return (
    <div className="m-tabbar">
      {tabs.map((t) => (
        <button key={t.id} className={`m-tab ${active === t.id ? "active" : ""}`} type="button">
          {t.icon}
          <span>{t.label}</span>
          <div className="m-tab-dot" style={{ opacity: active === t.id ? 1 : 0 }} />
        </button>
      ))}
    </div>
  );
};

// === Top bar variants ===
const MTopBrand = ({ unread = true }) => (
  <div className="m-top">
    <div className="m-top-brand">
      <MBrandMark size={28} />
      <span>Panharmon <em>·</em></span>
    </div>
    <div className="m-top-actions">
      <button className="m-iconbtn" type="button" aria-label="Tìm">{MIcon.search}</button>
      <button className="m-iconbtn" type="button" aria-label="Thông báo">
        {MIcon.bell}
        {unread && <span className="m-badge" />}
      </button>
    </div>
  </div>
);

const MTopTitle = ({ title, action }) => (
  <div className="m-top">
    <button className="m-back" type="button" aria-label="Quay lại">{MIcon.back}</button>
    <span className="m-top-title">{title}</span>
    <div className="m-top-actions">
      {action || <span style={{ width: 38, height: 38 }} />}
    </div>
  </div>
);

Object.assign(window, { MIcon, MBrandMark, MTabBar, MTopBrand, MTopTitle });

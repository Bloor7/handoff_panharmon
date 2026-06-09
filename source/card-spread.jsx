// === Mộng Triệu — Card Spread + Search ===
// Replace the old right-side drawer with a tarot-style spread that slides
// in BELOW the tree. One hero card for the picked symbol + 4 related
// symbols laid out with subtle tilts.

// ─────────────────────────────────────────────────────────────
// Small search button → popover with live filter
// ─────────────────────────────────────────────────────────────
const LibrarySearch = ({ data, onPick }) => {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState("");
  const inputRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
    else setQ("");
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Filter — match VN name (cached) or EN name. Top 10.
  const results = React.useMemo(() => {
    if (!q || q.length < 1) return [];
    const cache = loadCache();
    const needle = q.toLowerCase().trim();
    const out = [];
    for (const e of data.entries) {
      const vn = (cache[e.t]?.name || e.v || "").toLowerCase();
      const en = e.t.toLowerCase();
      if (vn.includes(needle) || en.includes(needle)) {
        out.push({ entry: e, name: cache[e.t]?.name || e.v || e.t });
        if (out.length >= 12) break;
      }
    }
    return out;
  }, [q, data]);

  const tagLabel = (key) => (window.libTagsByKey || {})[key]?.vi || key;
  const tagColor = (key) => (window.libTagsByKey || {})[key]?.color || "#d4a857";

  return (
    <div className="lib-search" ref={popoverRef}>
      <button
        type="button"
        className={`lib-search-btn ${open ? "on" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Tìm biểu tượng"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="7" cy="7" r="4.6" />
          <path d="M14 14L10.5 10.5" />
        </svg>
        <span>Tìm biểu tượng</span>
      </button>

      {open && (
        <div className="lib-search-pop" role="dialog">
          <div className="lib-search-input-wrap">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.6" />
              <path d="M14 14L10.5 10.5" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Gõ tên biểu tượng — nước, cá chép, người đã mất…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q && (
              <button type="button" className="lib-search-clear" onClick={() => setQ("")} aria-label="Xoá">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M3 3L9 9M9 3L3 9" />
                </svg>
              </button>
            )}
          </div>

          <div className="lib-search-results">
            {q && results.length === 0 && (
              <div className="lib-search-empty">Chưa có biểu tượng nào khớp.</div>
            )}
            {!q && (
              <div className="lib-search-hint">
                <em>Đang chờ một cái tên…</em>
                <span>Thử: "rắn", "lửa", "bay lượn", "rụng răng"</span>
              </div>
            )}
            {results.map(({ entry, name }) => (
              <button
                key={entry.t}
                className="lib-search-row"
                type="button"
                onClick={() => { onPick(entry); setOpen(false); }}
              >
                <span className="lib-search-letter">{entry.l}</span>
                <span className="lib-search-name">
                  <strong>{name}</strong>
                  {name !== entry.t && <em>{entry.t}</em>}
                </span>
                <span className="lib-search-tags">
                  {entry.g.slice(0, 2).map((g) => (
                    <span key={g} style={{ borderColor: tagColor(g), color: tagColor(g) }}>
                      {tagLabel(g)}
                    </span>
                  ))}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// One tarot-style card
// ─────────────────────────────────────────────────────────────
const TarotCard = ({ entry, role, tilt, onClick, accent, namesRef }) => {
  // role: "hero" | "side"
  // tilt: degrees
  const [vname, setVname] = React.useState(namesRef.current[entry.t]?.name || entry.v || null);
  const [vdef, setVdef] = React.useState(namesRef.current[entry.t]?.def || null);
  const [loading, setLoading] = React.useState(!namesRef.current[entry.t]?.def);

  React.useEffect(() => {
    if (namesRef.current[entry.t]?.def) {
      setVname(namesRef.current[entry.t].name);
      setVdef(namesRef.current[entry.t].def);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    queueTranslation([entry], (results) => {
      if (cancelled) return;
      const r = results[entry.t];
      if (r) {
        setVname(r.name);
        setVdef(r.def);
        namesRef.current[entry.t] = r;
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [entry.t]);

  const tagLabel = (key) => (window.libTagsByKey || {})[key]?.vi || key;
  const tagColor = (key) => (window.libTagsByKey || {})[key]?.color || "#d4a857";

  return (
    <div
      className={`tarot-card tarot-${role}`}
      style={{ "--tilt": `${tilt}deg`, "--accent": accent }}
      onClick={onClick}
    >
      {/* Top arch ornament */}
      <div className="tarot-arch" aria-hidden="true">
        <svg viewBox="0 0 200 24" preserveAspectRatio="none">
          <path d="M 0 24 L 0 12 Q 100 -4 200 12 L 200 24" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
          <path d="M 0 24 L 0 16 Q 100 4 200 16 L 200 24" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <circle cx="100" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="100" cy="9" r="1" fill="currentColor" />
        </svg>
      </div>

      {/* Corner letter — tarot style */}
      <span className="tarot-letter top-left">{entry.l}</span>
      <span className="tarot-letter bottom-right">{entry.l}</span>

      {/* Body */}
      <div className="tarot-body">
        <div className="tarot-eye">
          <span className="tarot-dot" style={{ background: accent }} />
          {entry.g.slice(0, 1).map((g) => tagLabel(g)).join(" · ") || "—"}
        </div>
        <h3 className="tarot-name">
          {vname || <em className="muted">đang dịch…</em>}
        </h3>
        <p className="tarot-en">{entry.t}</p>
        <div className="tarot-tags">
          {entry.g.slice(0, 3).map((g) => (
            <span key={g} className="tarot-tag" style={{ borderColor: tagColor(g), color: tagColor(g) }}>
              {tagLabel(g)}
            </span>
          ))}
        </div>
        <div className="tarot-def">
          {loading && !vdef ? (
            <span className="loading-dots"><span></span><span></span><span></span></span>
          ) : (
            <p>{vdef || "Lời giải đang trên đường về…"}</p>
          )}
        </div>
      </div>

      {/* Bottom mirror ornament */}
      <div className="tarot-arch bottom" aria-hidden="true">
        <svg viewBox="0 0 200 24" preserveAspectRatio="none">
          <path d="M 0 0 L 0 12 Q 100 28 200 12 L 200 0" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
          <path d="M 0 0 L 0 8 Q 100 20 200 8 L 200 0" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
          <circle cx="100" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <circle cx="100" cy="15" r="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Card spread — picks 4 related entries from the same tags
// ─────────────────────────────────────────────────────────────
const CardSpread = ({ entry, data, onClose }) => {
  const namesRef = React.useRef({});
  const spreadRef = React.useRef(null);

  // Pre-seed names cache from localStorage
  React.useEffect(() => {
    namesRef.current = { ...loadCache() };
  }, []);

  // Scroll spread into view smoothly (no scrollIntoView — use scrollTo)
  React.useEffect(() => {
    if (!entry || !spreadRef.current) return;
    const t = setTimeout(() => {
      const el = spreadRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      window.scrollTo({ top: window.scrollY + r.top - 60, behavior: "smooth" });
    }, 120);
    return () => clearTimeout(t);
  }, [entry?.t]);

  // Esc to close
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!entry) return null;

  // Find related entries: same primary tag, sorted by shared-tag count, take 4
  const primaryTag = entry.g[0];
  const primaryColor = (window.libTagsByKey || {})[primaryTag]?.color || "#d4a857";
  const entrySet = new Set(entry.g);

  const related = data.entries
    .filter((e) => e.t !== entry.t && e.g.includes(primaryTag))
    .map((e) => ({ e, score: e.g.filter((g) => entrySet.has(g)).length }))
    .sort((a, b) => b.score - a.score || a.e.t.localeCompare(b.e.t))
    .slice(0, 4)
    .map((x) => x.e);

  // Arrange: [side, side, hero, side, side]
  const tilts = [-6, -3, 0, 3, 6];
  const order = [related[0], related[1], entry, related[2], related[3]].filter(Boolean);

  return (
    <div className="card-spread" ref={spreadRef}>
      <div className="card-spread-header">
        <div className="card-spread-titles">
          <div className="eyebrow">
            <span className="dot" style={{ background: primaryColor, boxShadow: `0 0 10px ${primaryColor}` }} />
            Đã rút thẻ — đặt xuống bàn
          </div>
          <h2 className="card-spread-title">
            <em>{namesRef.current[entry.t]?.name || entry.v || entry.t}</em> — &amp; bốn bạn đồng hành
          </h2>
          <p className="card-spread-sub">
            Lá ở giữa là biểu tượng bạn vừa chọn. Bốn lá bên là những biểu tượng cùng nhánh cảm xúc — thường xuất hiện cùng nhau trong giấc mơ.
          </p>
        </div>
        <button className="card-spread-close" onClick={onClose} aria-label="Gấp thẻ lại">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M3 3L13 13M13 3L3 13" />
          </svg>
          <span>Gấp lại</span>
        </button>
      </div>

      <div className="card-spread-stage">
        {order.map((e, i) => {
          const isHero = e.t === entry.t;
          return (
            <TarotCard
              key={e.t}
              entry={e}
              role={isHero ? "hero" : "side"}
              tilt={tilts[i] || 0}
              accent={primaryColor}
              namesRef={namesRef}
              onClick={isHero ? undefined : () => {
                // clicking a side card promotes it to hero (re-spread)
                const evt = new CustomEvent("ms-pick-entry", { detail: e });
                window.dispatchEvent(evt);
              }}
            />
          );
        })}
      </div>

      <div className="card-spread-foot">
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => {
            const name = namesRef.current[entry.t]?.name || entry.v || entry.t;
            sessionStorage.setItem("prefillDream", `Tôi mơ thấy ${name.toLowerCase()}... `);
            window.location.hash = "/";
          }}
        >
          Dùng lá này để giải mã
          <ArrowIcon />
        </button>
        <button
          className="btn btn-ghost"
          type="button"
          onClick={onClose}
        >
          Tiếp tục dạo thư viện
        </button>
      </div>
    </div>
  );
};

Object.assign(window, { LibrarySearch, CardSpread, TarotCard });

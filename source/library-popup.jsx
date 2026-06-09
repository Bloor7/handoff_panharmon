// === Panharmon — Library popup flow ===
// New library UX: tag click → full-screen popup with grid of symbol cards
// → click a card → it zooms to center with 2 buttons (Đặt vào bàn / Quay lại)
// → "Đặt vào bàn" adds it to the persistent <PlacedTable>, closes popup, shows toast.
// Placed cards live in localStorage so they survive reloads.

const PLACED_KEY = "panharmon.placedCards.v1";
const PLACED_LIMIT = 5;

// ─────────────────────────────────────────────────────────────
// usePlacedCards — persistent hand of cards on the table
// ─────────────────────────────────────────────────────────────
function usePlacedCards() {
  const [keys, setKeys] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(PLACED_KEY) || "[]"); } catch { return []; }
  });
  // Re-hydrate on storage change (other tabs)
  React.useEffect(() => {
    const on = (e) => {
      if (e.key === PLACED_KEY) {
        try { setKeys(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", on);
    return () => window.removeEventListener("storage", on);
  }, []);
  const persist = (next) => {
    setKeys(next);
    try { localStorage.setItem(PLACED_KEY, JSON.stringify(next)); } catch {}
  };
  return {
    keys,
    add: (key) => {
      if (keys.includes(key)) return false;
      if (keys.length >= PLACED_LIMIT) return false;
      persist([...keys, key]);
      return true;
    },
    remove: (key) => persist(keys.filter(k => k !== key)),
    clear: () => persist([]),
    has: (key) => keys.includes(key),
    isFull: keys.length >= PLACED_LIMIT,
    count: keys.length,
    limit: PLACED_LIMIT,
  };
}

// ─────────────────────────────────────────────────────────────
// Toast (global) — fires via dispatchEvent("panharmon-toast", {detail:"msg"})
// ─────────────────────────────────────────────────────────────
const Toast = () => {
  const [msg, setMsg] = React.useState(null);
  const timer = React.useRef(null);
  React.useEffect(() => {
    const onToast = (e) => {
      setMsg(e.detail);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMsg(null), 2400);
    };
    window.addEventListener("panharmon-toast", onToast);
    return () => {
      window.removeEventListener("panharmon-toast", onToast);
      clearTimeout(timer.current);
    };
  }, []);
  if (!msg) return null;
  return (
    <div className="ph-toast" role="status" aria-live="polite">
      <span className="ph-toast-dot" />
      <span>{msg}</span>
    </div>
  );
};
function showToast(msg) {
  window.dispatchEvent(new CustomEvent("panharmon-toast", { detail: msg }));
}

// ─────────────────────────────────────────────────────────────
// PopupCard — small card in the branch popup grid
// ─────────────────────────────────────────────────────────────
const PopupCard = ({ entry, index, accent, namesRef, placed, onClick }) => {
  const ref = React.useRef(null);
  const startCache = namesRef.current[entry.t];
  const [name, setName] = React.useState((startCache && startCache.name) || entry.v || null);
  const [seen, setSeen] = React.useState(false);

  React.useEffect(() => {
    if (name || seen || !ref.current) return;
    const io = new IntersectionObserver((ents) => {
      for (const x of ents) if (x.isIntersecting) { setSeen(true); io.disconnect(); }
    }, { rootMargin: "300px 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [name, seen]);

  React.useEffect(() => {
    if (!seen || name) return;
    queueTranslation([entry], (results) => {
      const r = results[entry.t];
      if (r) {
        setName(r.name);
        namesRef.current[entry.t] = r;
      } else {
        setName(entry.t);
      }
    });
  }, [seen]);

  return (
    <button
      ref={ref}
      type="button"
      className={`bp-card ${placed ? "is-placed" : ""}`}
      style={{
        "--accent": accent,
        animationDelay: `${Math.min(index, 30) * 16}ms`,
      }}
      onClick={onClick}
    >
      <span className="bp-card-letter">{entry.l}</span>
      <span className="bp-card-name">
        {name || <em className="muted">…</em>}
      </span>
      <span className="bp-card-en">{entry.t}</span>
      {placed && (
        <span className="bp-card-placed-pill" aria-label="Đã trên bàn">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.5l2.5 2.5 4.5-6" />
          </svg>
          Đã đặt
        </span>
      )}
    </button>
  );
};

// ─────────────────────────────────────────────────────────────
// SymbolZoom — the lifted/flipped tarot card overlay
// ─────────────────────────────────────────────────────────────
const SymbolZoom = ({ entry, accent, namesRef, placed, isFull, onPlace, onBack }) => {
  const startCache = namesRef.current[entry.t];
  const [vname, setVname] = React.useState((startCache && startCache.name) || entry.v || null);
  const [vdef, setVdef] = React.useState(startCache?.def || null);
  const [loading, setLoading] = React.useState(!(startCache && startCache.def));

  React.useEffect(() => {
    if (startCache?.def) return;
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

  const tagLabel = (k) => (window.libTagsByKey || {})[k]?.vi || k;
  const tagColor = (k) => (window.libTagsByKey || {})[k]?.color || "#d4a857";

  return (
    <div
      className="bp-zoom-layer"
      onClick={(e) => { if (e.currentTarget === e.target) onBack(); }}
    >
      <div className="bp-zoom-card" style={{ "--accent": accent }}>
        {/* Top ornament */}
        <div className="tarot-arch" aria-hidden="true">
          <svg viewBox="0 0 200 24" preserveAspectRatio="none">
            <path d="M 0 24 L 0 12 Q 100 -4 200 12 L 200 24" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
            <path d="M 0 24 L 0 16 Q 100 4 200 16 L 200 24" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
            <circle cx="100" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="9" r="1" fill="currentColor" />
          </svg>
        </div>

        <span className="tarot-letter top-left">{entry.l}</span>
        <span className="tarot-letter bottom-right">{entry.l}</span>

        <div className="bp-zoom-body">
          <div className="tarot-eye">
            <span className="tarot-dot" style={{ background: accent }} />
            {entry.g.slice(0, 1).map((g) => tagLabel(g)).join(" · ") || "—"}
          </div>
          <h3 className="bp-zoom-name">
            {vname || <em className="muted">đang dịch…</em>}
          </h3>
          <p className="bp-zoom-en">{entry.t}</p>
          <div className="tarot-tags">
            {entry.g.slice(0, 3).map((g) => (
              <span key={g} className="tarot-tag" style={{ borderColor: tagColor(g), color: tagColor(g) }}>
                {tagLabel(g)}
              </span>
            ))}
          </div>
          <div className="bp-zoom-def">
            {loading && !vdef ? (
              <span className="loading-dots"><span></span><span></span><span></span></span>
            ) : (
              <p>{vdef || "Lời giải đang trên đường về…"}</p>
            )}
          </div>
        </div>

        {/* Bottom ornament */}
        <div className="tarot-arch bottom" aria-hidden="true">
          <svg viewBox="0 0 200 24" preserveAspectRatio="none">
            <path d="M 0 0 L 0 12 Q 100 28 200 12 L 200 0" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" />
            <path d="M 0 0 L 0 8 Q 100 20 200 8 L 200 0" fill="none" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" />
            <circle cx="100" cy="15" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="100" cy="15" r="1" fill="currentColor" />
          </svg>
        </div>
      </div>

      <div className="bp-zoom-actions">
        <button
          type="button"
          className="btn btn-primary bp-action-place"
          disabled={placed || (isFull && !placed)}
          onClick={onPlace}
        >
          {placed ? "✓ Lá này đã trên bàn" : isFull ? "Bàn đã đầy (5/5)" : "Đặt vào bàn"}
          {!placed && !isFull && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v8m-4-4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
        <button type="button" className="btn btn-ghost bp-action-back" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Xem thẻ khác
        </button>
      </div>

      {isFull && !placed && (
        <p className="bp-zoom-note">
          Bàn rút đã đủ {PLACED_LIMIT} lá — mở thêm chỗ với gói thành viên (sắp ra mắt).
        </p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// BranchPopup — full-screen modal: grid of symbols under a tag
// ─────────────────────────────────────────────────────────────
const BranchPopup = ({ tag, entries, totalCount, onClose, onPlace, isPlaced, isFull }) => {
  const [zoomed, setZoomed] = React.useState(null);
  const [query, setQuery] = React.useState("");
  const namesRef = React.useRef({});

  React.useEffect(() => { namesRef.current = { ...loadCache() }; }, []);

  // Lock scroll + handle Esc (zoom first, then popup)
  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (zoomed) setZoomed(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [zoomed, onClose]);

  // Filter entries by query (matches VN cached name or EN term)
  const visible = React.useMemo(() => {
    if (!query.trim()) return entries;
    const needle = query.toLowerCase().trim();
    const cache = loadCache();
    return entries.filter((e) => {
      const vn = (cache[e.t]?.name || e.v || "").toLowerCase();
      const en = e.t.toLowerCase();
      return vn.includes(needle) || en.includes(needle);
    });
  }, [query, entries]);

  return (
    <div
      className="bp-backdrop"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div className="bp-modal" style={{ "--accent": tag.color }}>
        <header className="bp-head">
          <div className="bp-head-mark" style={{ borderColor: tag.color, color: tag.color }}>
            {tag.vi.charAt(0)}
          </div>
          <div className="bp-head-titles">
            <div className="bp-eyebrow">
              <span className="bp-dot" style={{ background: tag.color, boxShadow: `0 0 10px ${tag.color}` }} />
              Nhánh cảm xúc
            </div>
            <h2 className="bp-title">{tag.vi}</h2>
            <p className="bp-meta">
              <strong>{totalCount.toLocaleString("vi-VN")}</strong> biểu tượng — chạm vào một thẻ để mở rộng
            </p>
          </div>

          <div className="bp-head-search">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="7" cy="7" r="4.6" />
              <path d="M14 14L10.5 10.5" />
            </svg>
            <input
              type="text"
              placeholder={`Tìm trong "${tag.vi}"…`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <button className="bp-close" onClick={onClose} aria-label="Đóng">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M4 4L14 14M14 4L4 14" />
            </svg>
          </button>
        </header>

        <div className="bp-grid-wrap">
          {visible.length === 0 ? (
            <div className="bp-empty">Không có biểu tượng nào khớp "{query}".</div>
          ) : (
            <div className="bp-grid">
              {visible.map((e, i) => (
                <PopupCard
                  key={e.t}
                  entry={e}
                  index={i}
                  accent={tag.color}
                  namesRef={namesRef}
                  placed={isPlaced(e.t)}
                  onClick={() => setZoomed(e)}
                />
              ))}
            </div>
          )}
        </div>

        {zoomed && (
          <SymbolZoom
            entry={zoomed}
            accent={tag.color}
            namesRef={namesRef}
            placed={isPlaced(zoomed.t)}
            isFull={isFull}
            onPlace={() => { onPlace(zoomed); setZoomed(null); }}
            onBack={() => setZoomed(null)}
          />
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PlacedCard — single card sitting on the table
// ─────────────────────────────────────────────────────────────
const PlacedCard = ({ entry, tilt, onRemove, onDecode }) => {
  const cache = loadCache()[entry.t];
  const accent = (window.libTagsByKey || {})[entry.g[0]]?.color || "#d4a857";
  const name = cache?.name || entry.v || entry.t;
  return (
    <div className="placed-card" style={{ "--accent": accent, "--tilt": `${tilt}deg` }}>
      <button type="button" className="placed-card-remove" onClick={onRemove} aria-label="Bỏ lá khỏi bàn">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 3L9 9M9 3L3 9" />
        </svg>
      </button>
      <span className="tarot-letter top-left">{entry.l}</span>
      <span className="tarot-letter bottom-right">{entry.l}</span>
      <div className="placed-card-body">
        <span className="placed-card-eye" style={{ background: accent }} />
        <h4 className="placed-card-name">{name}</h4>
        <p className="placed-card-en">{entry.t}</p>
      </div>
      <button type="button" className="placed-card-decode" onClick={onDecode}>
        Dùng lá này giải mã
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// PlacedTable — area below wheel showing the placed cards
// ─────────────────────────────────────────────────────────────
const PlacedTable = ({ entries, limit, onRemove, onDecodeOne, onDecodeAll, onClear }) => {
  const tableRef = React.useRef(null);

  // When a card lands, gently nudge scroll to the table the first time
  const lastCountRef = React.useRef(entries.length);
  React.useEffect(() => {
    if (entries.length > lastCountRef.current && tableRef.current) {
      const r = tableRef.current.getBoundingClientRect();
      if (r.top > window.innerHeight - 100 || r.bottom < 60) {
        window.scrollTo({ top: window.scrollY + r.top - 100, behavior: "smooth" });
      }
    }
    lastCountRef.current = entries.length;
  }, [entries.length]);

  return (
    <section className="placed-table" ref={tableRef}>
      <div className="placed-head">
        <div className="placed-head-titles">
          <div className="eyebrow">
            <span className="dot" />
            Bàn rút thẻ — <strong>{entries.length}</strong> / {limit} lá
          </div>
          <h2 className="placed-title">
            {entries.length === 0
              ? <>Bàn còn trống — <em>chờ lá đầu tiên</em></>
              : <>Những lá bài <em>giấc mộng</em> của bạn</>}
          </h2>
        </div>
        {entries.length > 0 && (
          <button type="button" className="placed-clear" onClick={onClear}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 3L9 9M9 3L3 9" />
            </svg>
            Dọn bàn
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="placed-empty">
          <div className="placed-empty-ornament" aria-hidden="true">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="placed-slot-ghost" style={{ animationDelay: `${i * 80}ms` }}>
                <span>{i + 1}</span>
              </div>
            ))}
          </div>
          <p className="placed-empty-text">
            Chạm vào một <em>nhánh cảm xúc</em> trên trống đồng để mở danh sách — rồi chọn lá để đặt vào bàn.
          </p>
        </div>
      ) : (
        <>
          <div className="placed-row" data-count={entries.length}>
            {entries.map((e, i) => (
              <PlacedCard
                key={e.t}
                entry={e}
                tilt={(i - (entries.length - 1) / 2) * 3.2}
                onRemove={() => onRemove(e.t)}
                onDecode={() => onDecodeOne(e)}
              />
            ))}
            {/* Ghost placeholders for unused slots */}
            {[...Array(Math.max(0, limit - entries.length))].map((_, i) => (
              <div key={`ghost-${i}`} className="placed-slot-ghost dim" aria-hidden="true">
                <span>{entries.length + i + 1}</span>
              </div>
            ))}
          </div>

          <div className="placed-foot">
            <button type="button" className="btn btn-primary placed-decode-all" onClick={onDecodeAll}>
              Giải mã với {entries.length === 1 ? "lá này" : `${entries.length} lá`}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="placed-foot-hint">
              Iris sẽ đọc cả bộ lá như một câu chuyện — đặt thêm lá để câu chuyện đầy đặn hơn.
            </span>
          </div>
        </>
      )}
    </section>
  );
};

Object.assign(window, {
  BranchPopup, SymbolZoom, PopupCard, PlacedTable, PlacedCard,
  Toast, showToast, usePlacedCards, PLACED_LIMIT,
});

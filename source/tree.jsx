// === Mộng Triệu — interactive tag tree library ===
// Loads library-data.json (tags + 6302 entries), shows a radial tag tree,
// lazy-translates entry names + definitions via window.claude with localStorage cache.

const CACHE_KEY = "mongtrieu.tx.v1";

function loadCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
}
function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

const useLibData = () => {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    fetch("library-data.json")
      .then(r => r.json())
      .then(setData)
      .catch(e => setError(String(e)));
  }, []);
  return { data, error };
};

// Translate a batch of entries via Claude. Returns { [enTerm]: { name, def } }
async function translateBatch(entries) {
  if (!entries.length) return {};
  const list = entries.map((e, i) => `${i + 1}. TỪ: ${e.t}\n   NGHĨA EN: ${e.d.slice(0, 380)}`).join("\n\n");
  const prompt = `Bạn là dịch giả tiếng Việt chuyên về tâm linh và giấc mơ. Hãy dịch danh sách ${entries.length} biểu tượng giấc mơ sau sang tiếng Việt. Mỗi mục cần 2 trường: "name" (tên biểu tượng — 1-3 từ, tự nhiên, dùng từ thuần Việt khi có thể) và "def" (giải nghĩa giấc mơ — 2-3 câu, ấm áp, sát ý gốc, văn phong giải mộng Việt).

${list}

Trả về CHÍNH XÁC một mảng JSON, không markdown, không giải thích. Mỗi phần tử: { "i": <số thứ tự>, "name": "<tên VN>", "def": "<định nghĩa VN>" }`;

  const raw = await window.claude.complete(prompt);
  // Extract JSON array
  const m = raw.match(/\[[\s\S]*\]/);
  if (!m) throw new Error("bad response");
  const arr = JSON.parse(m[0]);
  const out = {};
  for (const item of arr) {
    const idx = (item.i | 0) - 1;
    if (idx >= 0 && idx < entries.length) {
      out[entries[idx].t] = { name: item.name, def: item.def };
    }
  }
  return out;
}

// === Radial tree component — Trống Đồng layout ===
const MongTrieuTree = ({ data, onOpenBranch, activeKey }) => {
  const [hover, setHover] = React.useState(null);
  const active = activeKey || null;
  const tags = data.tags;

  // Canvas — wider/taller for more breathing room
  const W = 1240, H = 880;
  const cx = W / 2, cy = H / 2;

  // Drum ring radii (inner → outer) — bumped up for less label crowding
  const R = {
    sun: 64,
    sunRays: 86,
    band1: 108,
    sawtooth: 128,
    sawtoothOuter: 146,
    spiral: 178,
    midDots: 204,
    tagRing: 258,        // larger ring → wider tag spacing (~90px)
    tagOuter: 292,
    lac: 334,
    finalDots: 370,
  };

  const tagCounts = React.useMemo(() => {
    const c = {};
    for (const t of tags) c[t.key] = 0;
    for (const e of data.entries) for (const g of e.g) if (c[g] !== undefined) c[g]++;
    return c;
  }, [data, tags]);

  function seededRng(seed) {
    let s = seed;
    return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  const tagPositions = tags.map((tag, i) => {
    const angle = (i / tags.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...tag,
      x: cx + Math.cos(angle) * R.tagRing,
      y: cy + Math.sin(angle) * R.tagRing,
      angle,
      count: tagCounts[tag.key] || 0,
    };
  });

  const activeTag = active ? tagPositions.find(t => t.key === active) : null;
  const allEntriesForTag = React.useMemo(() => {
    if (!active) return [];
    return data.entries
      .filter(e => e.g.includes(active))
      .sort((a, b) => (b.d || "").length - (a.d || "").length);
  }, [active, data]);

  // Click outside active tag/panel → close. Esc also closes.
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e) => { if (e.key === "Escape") onOpenBranch(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, onOpenBranch]);

  // ===== Drum ornament generators =====

  // Sun rays — 14 rays, classic Dong Son count
  const sunRays = React.useMemo(() => {
    const N = 14;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return {
        x1: cx + Math.cos(a) * R.sun,
        y1: cy + Math.sin(a) * R.sun,
        x2: cx + Math.cos(a) * R.sunRays,
        y2: cy + Math.sin(a) * R.sunRays,
      };
    });
  }, []);

  // Inner dot band
  const innerDots = React.useMemo(() => {
    const N = 48;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return { x: cx + Math.cos(a) * R.band1, y: cy + Math.sin(a) * R.band1 };
    });
  }, []);

  // Sawtooth band — alternating triangles
  const sawtooth = React.useMemo(() => {
    const N = 36;
    const inner = R.sawtooth, outer = R.sawtoothOuter;
    let path = "";
    for (let i = 0; i < N; i++) {
      const a1 = (i / N) * Math.PI * 2;
      const a2 = ((i + 0.5) / N) * Math.PI * 2;
      const a3 = ((i + 1) / N) * Math.PI * 2;
      const x1 = cx + Math.cos(a1) * inner;
      const y1 = cy + Math.sin(a1) * inner;
      const x2 = cx + Math.cos(a2) * outer;
      const y2 = cy + Math.sin(a2) * outer;
      const x3 = cx + Math.cos(a3) * inner;
      const y3 = cy + Math.sin(a3) * inner;
      path += `${i === 0 ? "M" : "L"} ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${x3.toFixed(1)} ${y3.toFixed(1)} `;
    }
    return path + "Z";
  }, []);

  // S-spiral motif band — small S curves around the ring
  const spirals = React.useMemo(() => {
    const N = 24;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return {
        cx: cx + Math.cos(a) * R.spiral,
        cy: cy + Math.sin(a) * R.spiral,
        rot: (a * 180) / Math.PI + 90,
      };
    });
  }, []);

  // Mid dot band
  const midDots = React.useMemo(() => {
    const N = 60;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return { x: cx + Math.cos(a) * R.midDots, y: cy + Math.sin(a) * R.midDots };
    });
  }, []);

  // Lac bird positions — 12 birds flying in a circle
  const lacBirds = React.useMemo(() => {
    const N = 12;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      return {
        cx: cx + Math.cos(a) * R.lac,
        cy: cy + Math.sin(a) * R.lac,
        rot: (a * 180) / Math.PI + 90,
      };
    });
  }, []);

  // Final outer dots
  const finalDots = React.useMemo(() => {
    const N = 80;
    return Array.from({ length: N }, (_, i) => {
      const a = (i / N) * Math.PI * 2;
      return { x: cx + Math.cos(a) * R.finalDots, y: cy + Math.sin(a) * R.finalDots };
    });
  }, []);

  return (
    <div className={`mt-tree-wrap drum ${activeTag ? "has-active" : ""}`}>
      <svg className="mt-tree-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          {activeTag && (
            <radialGradient id="mt-aurora" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={activeTag.color} stopOpacity="0.14" />
              <stop offset="60%" stopColor={activeTag.color} stopOpacity="0.04" />
              <stop offset="100%" stopColor={activeTag.color} stopOpacity="0" />
            </radialGradient>
          )}
        </defs>

        {/* Aurora veil */}
        {activeTag && <rect x="0" y="0" width={W} height={H} fill="url(#mt-aurora)" className="mt-aurora-rect" />}

        {/* === Drum surface, outer → inner === */}

        {/* Outermost ring + final dots */}
        <g className="drum-band outer">
          <circle cx={cx} cy={cy} r={R.finalDots + 18} fill="none" stroke="rgba(212,168,87,0.18)" strokeWidth="0.6" />
          <circle cx={cx} cy={cy} r={R.finalDots + 6} fill="none" stroke="rgba(212,168,87,0.14)" strokeWidth="0.6" />
          {finalDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="1.1" fill="rgba(212,168,87,0.45)" />
          ))}
        </g>

        {/* Lac bird band — slowly rotates */}
        <g className="drum-band lac-band">
          <circle cx={cx} cy={cy} r={R.lac + 24} fill="none" stroke="rgba(212,168,87,0.12)" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx={cx} cy={cy} r={R.lac - 24} fill="none" stroke="rgba(212,168,87,0.12)" strokeWidth="0.5" strokeDasharray="2 4" />
          <g className="lac-rotate">
            {lacBirds.map((b, i) => (
              <g key={i} transform={`translate(${b.cx}, ${b.cy}) rotate(${b.rot}) scale(0.55)`}>
                <LacBirdPath />
              </g>
            ))}
          </g>
        </g>

        {/* Tag outer ring + bg band */}
        <g className="drum-band tag-band">
          <circle cx={cx} cy={cy} r={R.tagOuter} fill="none" stroke="rgba(212,168,87,0.22)" strokeWidth="0.8" />
          <circle cx={cx} cy={cy} r={R.tagRing - 30} fill="none" stroke="rgba(212,168,87,0.16)" strokeWidth="0.6" />
          <circle cx={cx} cy={cy} r={R.tagRing - 18} fill="none" stroke="rgba(212,168,87,0.08)" strokeWidth="0.4" strokeDasharray="1 5" />
        </g>

        {/* Trunks from center to tags */}
        <g className="mt-trunks">
          {tagPositions.map((t) => (
            <line
              key={t.key}
              x1={cx} y1={cy}
              x2={t.x} y2={t.y}
              className={`mt-trunk ${active === t.key ? "on" : ""} ${hover === t.key ? "hover" : ""} ${active && active !== t.key ? "dim" : ""}`}
              style={{ stroke: t.color }}
            />
          ))}
        </g>

        {/* Mid dot band */}
        <g className="drum-band">
          {midDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="0.9" fill="rgba(212,168,87,0.42)" />
          ))}
        </g>

        {/* S-spiral band */}
        <g className="drum-band spiral-band">
          <circle cx={cx} cy={cy} r={R.spiral + 16} fill="none" stroke="rgba(212,168,87,0.14)" strokeWidth="0.5" />
          <circle cx={cx} cy={cy} r={R.spiral - 16} fill="none" stroke="rgba(212,168,87,0.14)" strokeWidth="0.5" />
          {spirals.map((s, i) => (
            <g key={i} transform={`translate(${s.cx}, ${s.cy}) rotate(${s.rot})`}>
              <path
                d="M -8 0 C -8 -5, -3 -5, -3 0 C -3 5, 3 5, 3 0 C 3 -5, 8 -5, 8 0"
                fill="none"
                stroke="rgba(212,168,87,0.55)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>

        {/* Sawtooth band */}
        <g className="drum-band sawtooth-band">
          <circle cx={cx} cy={cy} r={R.sawtooth} fill="none" stroke="rgba(212,168,87,0.32)" strokeWidth="0.6" />
          <circle cx={cx} cy={cy} r={R.sawtoothOuter} fill="none" stroke="rgba(212,168,87,0.32)" strokeWidth="0.6" />
          <path d={sawtooth} fill="none" stroke="rgba(212,168,87,0.55)" strokeWidth="0.7" strokeLinejoin="round" />
        </g>

        {/* Inner dot band */}
        <g className="drum-band">
          {innerDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="1" fill="rgba(212,168,87,0.55)" />
          ))}
        </g>

        {/* === Center sun === */}
        <g className="mt-center">
          <circle cx={cx} cy={cy} r={R.sunRays + 6} fill="none" stroke="rgba(212,168,87,0.3)" strokeWidth="0.7" />
          {sunRays.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} className="mt-center-ray" />
          ))}
          <circle cx={cx} cy={cy} r={R.sun} className="mt-center-outer" />
          <circle cx={cx} cy={cy} r={R.sun - 14} className="mt-center-mid" />
          <circle cx={cx} cy={cy} r={R.sun - 28} className="mt-center-inner" />
          <text x={cx} y={cy - 8} textAnchor="middle" className="mt-center-text">Mộng</text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="mt-center-text">Triệu</text>
          <text x={cx} y={cy + 28} textAnchor="middle" className="mt-center-total">{data.entries.length.toLocaleString("vi-VN")}</text>
        </g>

        {/* === Tag nodes === */}
        <g className="mt-tags">
          {tagPositions.map((t) => {
            const isActive = active === t.key;
            const isHover = hover === t.key;
            const isDim = active && !isActive;
            // Label angle for radial typography (flip text on lower half so it's readable)
            const labelOnTop = t.y < cy;
            const labelOffsetY = labelOnTop ? -54 : 54;
            return (
              <g
                key={t.key}
                className={`mt-tag-node ${isActive ? "on" : ""} ${isHover ? "hover" : ""} ${isDim ? "dim" : ""}`}
                onClick={() => {
                  if (isActive) {
                    onOpenBranch(null);
                    return;
                  }
                  onOpenBranch(t);
                }}
                onMouseEnter={() => setHover(t.key)}
                onMouseLeave={() => setHover(null)}
              >
                <circle cx={t.x} cy={t.y} r="38" className="mt-tag-halo" style={{ fill: t.color }} />
                <circle cx={t.x} cy={t.y} r="26" className="mt-tag-bg" />
                <circle cx={t.x} cy={t.y} r="26" className="mt-tag-ring" style={{ stroke: t.color }} />
                <circle cx={t.x} cy={t.y} r="5" fill={t.color} className="mt-tag-gem" />
                <text x={t.x} y={t.y + labelOffsetY} textAnchor="middle" className="mt-tag-text">
                  {t.vi}
                </text>
                <text x={t.x} y={t.y + labelOffsetY + 16} textAnchor="middle" className="mt-tag-count">
                  {t.count}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="mt-hint">
        {active
          ? `${activeTag.count.toLocaleString("vi-VN")} biểu tượng trong "${activeTag.vi}" — đang mở danh sách`
          : `${data.entries.length.toLocaleString("vi-VN")} biểu tượng • 18 nhánh cảm xúc — chạm nhánh để mở danh sách thẻ`}
      </div>
    </div>
  );
};

// === Scroll panel — typographic list of symbols under a tag ===
function toRoman(n) {
  const map = [
    [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

const MongTrieuPanel = ({ tag, entries, totalCount, onPick, onClose }) => {
  return (
    <aside className="mt-panel" key={tag.key /* re-mount on tag change for animation */}>
      <div className="mt-panel-ornament-top" aria-hidden="true">
        <svg viewBox="0 0 280 18" preserveAspectRatio="none">
          <line x1="0" y1="9" x2="280" y2="9" stroke={tag.color} strokeWidth="0.8" strokeOpacity="0.5" />
          <line x1="0" y1="6" x2="280" y2="6" stroke={tag.color} strokeWidth="0.4" strokeOpacity="0.3" />
          <circle cx="140" cy="9" r="4" fill="none" stroke={tag.color} strokeWidth="1" />
          <circle cx="140" cy="9" r="1.4" fill={tag.color} />
        </svg>
      </div>

      <header className="mt-panel-head">
        <div className="mt-panel-eye" style={{ borderColor: tag.color, color: tag.color }}>
          {tag.vi.charAt(0)}
        </div>
        <div className="mt-panel-titles">
          <h3 className="mt-panel-title">{tag.vi}</h3>
          <p className="mt-panel-meta">
            <strong>{totalCount.toLocaleString("vi-VN")}</strong> biểu tượng dưới nhánh này
          </p>
        </div>
        <button className="mt-panel-close" onClick={onClose} aria-label="Đóng">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M3 3L13 13M13 3L3 13" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <ol className="mt-panel-list">
        {entries.map((e, i) => (
          <PanelRow key={e.t} entry={e} index={i} onPick={onPick} tagColor={tag.color} />
        ))}
      </ol>

      <div className="mt-panel-foot">
        <span>—</span>
        <em>cuối cuộn thư</em>
        <span>—</span>
      </div>
    </aside>
  );
};

// Single row — lazy-translate only when scrolled into view
const PanelRow = ({ entry, index, onPick, tagColor }) => {
  const rowRef = React.useRef(null);
  const cacheRef = React.useRef(loadCache());
  const cached = cacheRef.current[entry.t];
  const initialName = (cached && cached.name) || entry.v || null;
  const hasFullCache = !!(cached && cached.def);
  const [name, setName] = React.useState(initialName);
  const [pending, setPending] = React.useState(!initialName);
  const [seen, setSeen] = React.useState(false);

  // Watch for the row entering the viewport — only then request translation
  React.useEffect(() => {
    if (hasFullCache || seen || !rowRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (en.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    io.observe(rowRef.current);
    return () => io.disconnect();
  }, [hasFullCache, seen]);

  // Pre-warm BOTH name + def so clicking the row opens the drawer instantly,
  // even when entry.v already provides the name.
  React.useEffect(() => {
    if (!seen || hasFullCache) return;
    let cancelled = false;
    queueTranslation([entry], (results) => {
      if (cancelled) return;
      const r = results[entry.t];
      if (r) { setName(r.name); setPending(false); }
      else if (!name) { setName("…"); setPending(false); }
      else { setPending(false); }
    });
    return () => { cancelled = true; };
  }, [seen]);

  const otherTagsLabels = entry.g.slice(1, 3).map(k => {
    const t = (window.libTagsByKey || {})[k];
    return t ? t.vi : null;
  }).filter(Boolean);

  return (
    <li
      ref={rowRef}
      className={`mt-panel-row ${pending ? "pending" : ""}`}
      onClick={() => onPick(entry)}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <span className="mt-panel-num" style={{ color: tagColor }}>{toRoman(index + 1)}</span>
      <span className="mt-panel-name">
        {pending ? <em className="muted">đang dịch…</em> : name}
      </span>
      {otherTagsLabels.length > 0 && (
        <span className="mt-panel-cross">{otherTagsLabels.join(" · ")}</span>
      )}
      <span className="mt-panel-arrow" aria-hidden="true">→</span>
    </li>
  );
};

Object.assign(window, { MongTrieuTree, MongTrieuPanel, PanelRow, loadCache, saveCache, translateBatch, queueTranslation });

// === Translation queue — collects requests and flushes in batches ===
const _queue = [];
let _flushTimer = null;
function queueTranslation(entries, cb) {
  _queue.push({ entries, cb });
  if (_flushTimer) clearTimeout(_flushTimer);
  _flushTimer = setTimeout(flushQueue, 80);
}

async function flushQueue() {
  _flushTimer = null;
  const jobs = _queue.splice(0);
  if (!jobs.length) return;
  // Collect unique entries needing translation
  const seen = new Set();
  const needs = [];
  for (const job of jobs) for (const e of job.entries) {
    if (!seen.has(e.t)) { seen.add(e.t); needs.push(e); }
  }
  // Filter out anything already cached
  const cache = loadCache();
  const toFetch = needs.filter(e => !cache[e.t]);
  // Pre-resolve cached entries
  const resolved = {};
  for (const e of needs) if (cache[e.t]) resolved[e.t] = cache[e.t];

  // Batch in groups of 10
  for (let i = 0; i < toFetch.length; i += 10) {
    const batch = toFetch.slice(i, i + 10);
    try {
      const out = await translateBatch(batch);
      Object.assign(resolved, out);
      Object.assign(cache, out);
      saveCache(cache);
    } catch (e) {
      console.warn("translate batch failed", e);
    }
  }

  // Deliver to all callbacks
  for (const job of jobs) job.cb(resolved);
}

Object.assign(window, { MongTrieuTree, loadCache, saveCache, translateBatch, queueTranslation });

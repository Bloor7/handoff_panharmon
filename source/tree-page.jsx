// Entry detail drawer — translates definition on-demand
const EntryDrawer = ({ entry, onClose }) => {
  // Re-read cache on every entry change so a freshly-translated row opens instantly.
  const cached = entry ? loadCache()[entry.t] : null;
  const [vname, setVname] = React.useState((cached && cached.name) || entry?.v || null);
  const [vdef, setVdef] = React.useState(cached?.def || null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!entry) return;
    const cache = loadCache();
    const c = cache[entry.t];
    if (c) {
      setVname(c.name);
      setVdef(c.def);
      setLoading(false);
      setError(null);
      return;
    }
    setVname(entry.v || null);
    setVdef(null);
    setLoading(true);
    setError(null);
    translateBatch([entry])
      .then((res) => {
        const r = res[entry.t];
        if (r) {
          setVname(r.name);
          setVdef(r.def);
          const cc = loadCache();
          cc[entry.t] = r;
          saveCache(cc);
        } else {
          throw new Error("no result");
        }
      })
      .catch((e) => setError("Không dịch được lúc này. Bạn thử lại sau nhé."))
      .finally(() => setLoading(false));
  }, [entry?.t]);

  React.useEffect(() => {
    if (!entry) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entry, onClose]);

  if (!entry) return null;
  const tagLabel = (key) => {
    const t = (window.libTagsByKey || {})[key];
    return t ? t.vi : key;
  };
  const tagColor = (key) => {
    const t = (window.libTagsByKey || {})[key];
    return t ? t.color : "#d4a857";
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="drawer-close" onClick={onClose} aria-label="Đóng">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 4L14 14M14 4L4 14" />
          </svg>
        </button>
        <div className="drawer-eye">{entry.l}</div>
        <h2 className="drawer-title">
          {loading && !vname ? <em className="muted">Đang dịch tên…</em> : (vname || entry.t)}
        </h2>
        <div className="drawer-tags">
          {entry.g.map((g) => (
            <span key={g} className="drawer-tag" style={{ borderColor: tagColor(g), color: tagColor(g) }}>
              {tagLabel(g)}
            </span>
          ))}
          {entry.g.length === 0 && <span className="drawer-tag muted">Chưa phân loại</span>}
        </div>

        <div className="drawer-body">
          {loading && !vdef ? (
            <div className="drawer-loading">
              <span className="loading-dots"><span></span><span></span><span></span></span>
              <p>Đang dịch sang tiếng Việt…</p>
            </div>
          ) : error ? (
            <p className="drawer-error">{error}</p>
          ) : (
            <p className="drawer-def">{vdef}</p>
          )}
        </div>

        <div className="drawer-foot">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              sessionStorage.setItem("prefillDream", `Tôi mơ thấy ${(vname || entry.t).toLowerCase()}... `);
              window.location.hash = "/";
            }}
          >
            Dùng để giải mã
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

// === Page: Thư viện — new popup flow ===
const PageThuVienTree = () => {
  const { data, error } = useLibData();
  const [activeTag, setActiveTag] = React.useState(null);
  const placed = usePlacedCards();

  // Expose tag lookup for child components
  React.useEffect(() => {
    if (!data) return;
    const m = {};
    for (const t of data.tags) m[t.key] = t;
    window.libTagsByKey = m;
  }, [data]);

  // Hydrate placed entries from keys (look up in data.entries)
  const placedEntries = React.useMemo(() => {
    if (!data) return [];
    const byKey = {};
    for (const e of data.entries) byKey[e.t] = e;
    return placed.keys.map((k) => byKey[k]).filter(Boolean);
  }, [data, placed.keys]);

  // Active tag's entries (only computed when a tag is open)
  const activeEntries = React.useMemo(() => {
    if (!data || !activeTag) return [];
    return data.entries
      .filter((e) => e.g.includes(activeTag.key))
      .sort((a, b) => (b.d || "").length - (a.d || "").length);
  }, [data, activeTag]);

  // Pre-warm: translate first ~20 visible entries so the grid is meaningful immediately
  React.useEffect(() => {
    if (!activeTag || !activeEntries.length) return;
    const cache = loadCache();
    const needs = activeEntries.slice(0, 20).filter((e) => !cache[e.t]);
    if (needs.length === 0) return;
    queueTranslation(needs, () => {/* updates flow through cache + per-card re-render */});
  }, [activeTag?.key]);

  const placeCard = (entry) => {
    if (placed.has(entry.t)) {
      showToast(`"${loadCache()[entry.t]?.name || entry.v || entry.t}" đã ở trên bàn`);
      return;
    }
    if (placed.isFull) {
      showToast(`Bàn đã có ${PLACED_LIMIT} lá — bỏ một lá để đặt thêm`);
      return;
    }
    const ok = placed.add(entry.t);
    if (ok) {
      const name = loadCache()[entry.t]?.name || entry.v || entry.t;
      showToast(`Đã đặt "${name}" vào bàn`);
      setActiveTag(null); // close popup after placing
    }
  };

  const decodeOne = (entry) => {
    const name = loadCache()[entry.t]?.name || entry.v || entry.t;
    sessionStorage.setItem("prefillDream", `Tôi mơ thấy ${name.toLowerCase()}... `);
    window.location.hash = "/";
  };

  const decodeAll = () => {
    if (placedEntries.length === 0) return;
    const names = placedEntries.map((e) => {
      const n = loadCache()[e.t]?.name || e.v || e.t;
      return n.toLowerCase();
    });
    const text = names.length === 1
      ? `Tôi mơ thấy ${names[0]}... `
      : `Trong giấc mơ của tôi xuất hiện ${names.slice(0, -1).join(", ")} và ${names[names.length - 1]}. `;
    sessionStorage.setItem("prefillDream", text);
    window.location.hash = "/";
  };

  return (
    <PageShell
      eyebrow="Thư viện"
      title={<>Mộng <em>Triệu</em></>}
      sub="Hơn 6000 biểu tượng giấc mơ liên kết qua các nhánh cảm xúc. Chạm vào một nhánh để mở danh sách thẻ — chọn lá để đặt vào bàn, rồi để Iris đọc cả bộ."
    >
      {!data && !error && (
        <div className="empty-state">
          <span className="loading-dots"><span></span><span></span><span></span></span>
          <p style={{ marginTop: 14 }}>Đang gọi cõi mộng về…</p>
        </div>
      )}
      {error && <div className="empty-state"><p>Không tải được thư viện: {error}</p></div>}

      {data && (
        <div className="lib-toolbar">
          <LibrarySearch data={data} onPick={(entry) => {
            // Direct search → place immediately
            placeCard(entry);
          }} />
          <div className="lib-toolbar-status">
            <span className="lib-toolbar-eye">
              <span className="lib-toolbar-dot" />
              Bàn rút <strong>{placed.count}</strong>/{PLACED_LIMIT}
            </span>
          </div>
        </div>
      )}

      {data && (
        <MongTrieuTree
          data={data}
          onOpenBranch={setActiveTag}
          activeKey={activeTag?.key || null}
        />
      )}

      {data && (
        <PlacedTable
          entries={placedEntries}
          limit={PLACED_LIMIT}
          onRemove={placed.remove}
          onDecodeOne={decodeOne}
          onDecodeAll={decodeAll}
          onClear={() => {
            placed.clear();
            showToast("Đã dọn bàn");
          }}
        />
      )}

      {data && activeTag && (
        <BranchPopup
          tag={activeTag}
          entries={activeEntries}
          totalCount={activeEntries.length}
          onClose={() => setActiveTag(null)}
          onPlace={placeCard}
          isPlaced={(t) => placed.has(t)}
          isFull={placed.isFull}
        />
      )}

      <Toast />
    </PageShell>
  );
};

Object.assign(window, { EntryDrawer, PageThuVienTree });

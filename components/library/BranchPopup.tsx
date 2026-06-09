"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LibraryEntry, LibraryTag } from "@/types/content";

type Props = {
  tag: LibraryTag;
  entries: LibraryEntry[];
  onClose: () => void;
  onPlace: (entry: LibraryEntry) => void;
  isPlaced: (key: string) => boolean;
  isFull: boolean;
  tagMap: Record<string, LibraryTag>;
};

function entryName(entry: LibraryEntry) {
  return entry.v || entry.t;
}

function PopupCard({ entry, tag, placed, onClick }: { entry: LibraryEntry; tag: LibraryTag; placed: boolean; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [name, setName] = useState(() => entryName(entry));
  const [seen, setSeen] = useState(Boolean(entry.v));

  useEffect(() => {
    if (seen || !ref.current) return;
    const io = new IntersectionObserver((items) => {
      if (items.some((item) => item.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    }, { rootMargin: "300px 0px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen) return;
    setName(entryName(entry));
  }, [seen, entry]);

  return (
    <button ref={ref} type="button" className={`bp-card ${placed ? "is-placed" : ""}`} style={{ "--accent": tag.color } as React.CSSProperties} onClick={onClick}>
      <span className="bp-card-letter">{entry.l}</span>
      <span className="bp-card-name">{name}</span>
      <span className="bp-card-en">{entry.t}</span>
      {placed && <span className="bp-card-placed-pill">✓ Đã đặt</span>}
    </button>
  );
}

export function SymbolZoom({ entry, tag, tagMap, placed, isFull, onPlace, onBack }: { entry: LibraryEntry; tag: LibraryTag; tagMap: Record<string, LibraryTag>; placed: boolean; isFull: boolean; onPlace: () => void; onBack: () => void }) {
  const [name, setName] = useState(() => entryName(entry));
  const [definition, setDefinition] = useState(() => entry.d || "");
  const loading = false;

  useEffect(() => {
    setName(entryName(entry));
    setDefinition(entry.d || "");
  }, [entry]);

  return (
    <div className="bp-zoom-layer" onClick={(event) => { if (event.currentTarget === event.target) onBack(); }}>
      <div className="bp-zoom-card" style={{ "--accent": tag.color } as React.CSSProperties}>
        <div className="tarot-arch" aria-hidden="true">
          <svg viewBox="0 0 200 24" preserveAspectRatio="none"><path d="M 0 24 L 0 12 Q 100 -4 200 12 L 200 24" fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.5" /><circle cx="100" cy="9" r="3" fill="none" stroke="currentColor" strokeWidth="0.8" /></svg>
        </div>
        <span className="tarot-letter top-left">{entry.l}</span>
        <span className="tarot-letter bottom-right">{entry.l}</span>
        <div className="bp-zoom-body">
          <div className="tarot-eye"><span className="tarot-dot" style={{ background: tag.color }} />{tag.vi}</div>
          <h3 className="bp-zoom-name">{name}</h3>
          <p className="bp-zoom-en">{entry.t}</p>
          <div className="tarot-tags">{entry.g.slice(0, 3).map((key) => <span key={key} className="tarot-tag" style={{ borderColor: tagMap[key]?.color || "#d4a857", color: tagMap[key]?.color || "#d4a857" }}>{tagMap[key]?.vi || key}</span>)}</div>
          <div className="bp-zoom-def">{loading ? <span className="loading-dots"><span></span><span></span><span></span></span> : <p>{definition || "Lời giải đang trên đường về..."}</p>}</div>
        </div>
      </div>
      <div className="bp-zoom-actions">
        <button type="button" className="btn btn-primary bp-action-place" disabled={placed || (isFull && !placed)} onClick={onPlace}>
          {placed ? "✓ Lá này đã trên bàn" : isFull ? "Bàn đã đầy (5/5)" : "Đặt vào bàn"}
        </button>
        <button type="button" className="btn btn-ghost bp-action-back" onClick={onBack}>Xem thẻ khác</button>
      </div>
      {isFull && !placed && <p className="bp-zoom-note">Bàn rút đã đủ 5 lá - mở thêm chỗ với gói thành viên (sắp ra mắt).</p>}
    </div>
  );
}

export function BranchPopup({ tag, entries, onClose, onPlace, isPlaced, isFull, tagMap }: Props) {
  const [query, setQuery] = useState("");
  const [zoomed, setZoomed] = useState<LibraryEntry | null>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (zoomed) setZoomed(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [zoomed, onClose]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) => (entry.v || "").toLowerCase().includes(needle) || entry.t.toLowerCase().includes(needle));
  }, [entries, query]);

  return (
    <div className="bp-backdrop" onClick={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div className="bp-modal" style={{ "--accent": tag.color } as React.CSSProperties}>
        <header className="bp-head">
          <div className="bp-head-mark" style={{ borderColor: tag.color, color: tag.color }}>{tag.vi.charAt(0)}</div>
          <div className="bp-head-titles">
            <div className="bp-eyebrow"><span className="bp-dot" style={{ background: tag.color, boxShadow: `0 0 10px ${tag.color}` }} />Nhánh cảm xúc</div>
            <h2 className="bp-title">{tag.vi}</h2>
            <p className="bp-meta"><strong>{entries.length.toLocaleString("vi-VN")}</strong> biểu tượng - chạm vào một thẻ để mở rộng</p>
          </div>
          <div className="bp-head-search">
            <span>⌕</span>
            <input type="text" placeholder={`Tìm trong "${tag.vi}"...`} value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <button className="bp-close" onClick={onClose} aria-label="Đóng">×</button>
        </header>
        <div className="bp-grid-wrap">
          {visible.length === 0 ? <div className="bp-empty">Không có biểu tượng nào khớp "{query}".</div> : (
            <div className="bp-grid">
              {visible.map((entry) => <PopupCard key={entry.t} entry={entry} tag={tag} placed={isPlaced(entry.t)} onClick={() => setZoomed(entry)} />)}
            </div>
          )}
        </div>
        {zoomed && <SymbolZoom entry={zoomed} tag={tag} tagMap={tagMap} placed={isPlaced(zoomed.t)} isFull={isFull} onPlace={() => { onPlace(zoomed); setZoomed(null); }} onBack={() => setZoomed(null)} />}
      </div>
    </div>
  );
}

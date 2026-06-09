"use client";

import { useEffect, useMemo, useState } from "react";
import { usePlacedCards, PLACED_LIMIT } from "@/hooks/usePlacedCards";
import type { LibraryData, LibraryEntry, LibraryTag } from "@/types/content";
import { BranchPopup, SymbolZoom } from "@/components/library/BranchPopup";
import { MongTrieuTree } from "@/components/library/MongTrieuTree";
import { PlacedTable } from "@/components/library/PlacedTable";
import { showToast, Toast } from "@/components/library/Toast";

function LibrarySearch({ entries, onPick }: { entries: LibraryEntry[]; onPick: (entry: LibraryEntry) => void }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return entries
      .filter((entry) => {
        const vn = (entry.v || "").toLowerCase();
        return entry.t.toLowerCase().includes(needle) || vn.includes(needle);
      })
      .slice(0, 18);
  }, [entries, query]);

  return (
    <div className="library-search-full">
      <label>
        <span>Tìm trong {entries.length.toLocaleString("vi-VN")} biểu tượng</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Trống đồng, Chim Lạc, nước, máy bay..." />
      </label>
      {query && (
        <div className="library-search-results">
          {results.length === 0 ? (
            <p>Chưa có biểu tượng nào khớp.</p>
          ) : results.map((entry) => (
            <button key={entry.t} type="button" onClick={() => onPick(entry)}>
              <strong>{entry.v || entry.t}</strong>
              <span>{entry.t}</span>
              <em>{entry.g.length ? `${entry.g.length} nhánh` : "Alphabet gốc"}</em>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LibraryClient() {
  const [data, setData] = useState<LibraryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<LibraryTag | null>(null);
  const [searchZoomed, setSearchZoomed] = useState<LibraryEntry | null>(null);
  const placed = usePlacedCards();

  useEffect(() => {
    fetch("/library-data.json").then((response) => response.json()).then(setData).catch((err) => setError(String(err)));
  }, []);

  const tagMap = useMemo(() => data ? Object.fromEntries(data.tags.map((tag) => [tag.key, tag])) : {}, [data]) as Record<string, LibraryTag>;
  const placedEntries = useMemo(() => {
    if (!data) return [];
    const byKey = Object.fromEntries(data.entries.map((entry) => [entry.t, entry]));
    return placed.keys.map((key) => byKey[key]).filter(Boolean) as LibraryEntry[];
  }, [data, placed.keys]);
  const activeEntries = useMemo(() => data && activeTag ? data.entries.filter((entry) => entry.g.includes(activeTag.key)).sort((a, b) => (b.d || "").length - (a.d || "").length) : [], [data, activeTag]);
  const searchTag = useMemo(() => {
    if (!data || !searchZoomed) return null;
    return tagMap[searchZoomed.g[0]] || data.tags[0];
  }, [data, searchZoomed, tagMap]);

  useEffect(() => {
    if (!searchZoomed) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchZoomed(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [searchZoomed]);

  const placeCard = (entry: LibraryEntry) => {
    if (placed.has(entry.t)) {
      showToast(`"${entry.v || entry.t}" đã ở trên bàn`);
      return;
    }
    if (placed.isFull) {
      showToast(`Bàn đã có ${PLACED_LIMIT} lá - bỏ một lá để đặt thêm`);
      return;
    }
    if (placed.add(entry.t)) {
      showToast(`Đã đặt "${entry.v || entry.t}" vào bàn`);
      setActiveTag(null);
    }
  };

  return (
    <>
      {!data && !error && <div className="empty-state"><span className="loading-dots"><span></span><span></span><span></span></span><p style={{ marginTop: 14 }}>Đang gọi cõi mộng về...</p></div>}
      {error && <div className="empty-state"><p>Không tải được thư viện: {error}</p></div>}
      {data && (
        <>
          <div className="lib-toolbar">
            <LibrarySearch entries={data.entries} onPick={setSearchZoomed} />
            <div className="lib-toolbar-status">
              <span className="lib-toolbar-eye"><span className="lib-toolbar-dot" />Bàn rút <strong>{placed.count}</strong>/{PLACED_LIMIT}</span>
            </div>
          </div>
          <MongTrieuTree data={data} activeKey={activeTag?.key || null} onOpenBranch={setActiveTag} />
          <PlacedTable entries={placedEntries} limit={PLACED_LIMIT} tagMap={tagMap} onRemove={placed.remove} onClear={() => { placed.clear(); showToast("Đã dọn bàn"); }} />
          {activeTag && <BranchPopup tag={activeTag} entries={activeEntries} tagMap={tagMap} onClose={() => setActiveTag(null)} onPlace={placeCard} isPlaced={placed.has} isFull={placed.isFull} />}
          {searchZoomed && searchTag && (
            <div className="bp-backdrop" onClick={(event) => { if (event.currentTarget === event.target) setSearchZoomed(null); }}>
              <div className="bp-modal bp-search-zoom-modal" style={{ "--accent": searchTag.color } as React.CSSProperties}>
                <SymbolZoom
                  entry={searchZoomed}
                  tag={searchTag}
                  tagMap={tagMap}
                  placed={placed.has(searchZoomed.t)}
                  isFull={placed.isFull}
                  onPlace={() => {
                    placeCard(searchZoomed);
                    setSearchZoomed(null);
                  }}
                  onBack={() => setSearchZoomed(null)}
                />
              </div>
            </div>
          )}
        </>
      )}
      <Toast />
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import type { LibraryEntry, LibraryTag } from "@/types/content";

export function PlacedTable({ entries, limit, tagMap, onRemove, onClear }: { entries: LibraryEntry[]; limit: number; tagMap: Record<string, LibraryTag>; onRemove: (key: string) => void; onClear: () => void }) {
  const router = useRouter();

  const decodeOne = (entry: LibraryEntry) => {
    const name = entry.v || entry.t;
    sessionStorage.setItem("prefillDream", `Tôi mơ thấy ${name.toLowerCase()}... `);
    router.push("/#giai-ma");
  };

  const decodeAll = () => {
    const names = entries.map((entry) => (entry.v || entry.t).toLowerCase());
    const text = names.length === 1 ? `Tôi mơ thấy ${names[0]}... ` : `Trong giấc mơ của tôi xuất hiện ${names.slice(0, -1).join(", ")} và ${names[names.length - 1]}. `;
    sessionStorage.setItem("prefillDream", text);
    router.push("/#giai-ma");
  };

  return (
    <section className="placed-table">
      <div className="placed-head">
        <div className="placed-head-titles">
          <div className="eyebrow"><span className="dot" />Bàn rút thẻ - <strong>{entries.length}</strong> / {limit} lá</div>
          <h2 className="placed-title">{entries.length === 0 ? <>Bàn còn trống - <em>chờ lá đầu tiên</em></> : <>Những lá bài <em>giấc mộng</em> của bạn</>}</h2>
        </div>
        {entries.length > 0 && <button type="button" className="placed-clear" onClick={onClear}>Dọn bàn</button>}
      </div>
      {entries.length === 0 ? (
        <div className="placed-empty">
          <div className="placed-empty-ornament">{Array.from({ length: limit }).map((_, i) => <div key={i} className="placed-slot-ghost"><span>{i + 1}</span></div>)}</div>
          <p className="placed-empty-text">Chạm vào một <em>nhánh cảm xúc</em> trên trống đồng để mở danh sách - rồi chọn lá để đặt vào bàn.</p>
        </div>
      ) : (
        <>
          <div className="placed-row">
            {entries.map((entry, i) => {
              const accent = tagMap[entry.g[0]]?.color || "#d4a857";
              const name = entry.v || entry.t;
              return (
                <div key={entry.t} className="placed-card" style={{ "--accent": accent, "--tilt": `${(i - (entries.length - 1) / 2) * 3.2}deg` } as React.CSSProperties}>
                  <button type="button" className="placed-card-remove" onClick={() => onRemove(entry.t)} aria-label="Bỏ lá khỏi bàn">×</button>
                  <span className="tarot-letter top-left">{entry.l}</span>
                  <span className="tarot-letter bottom-right">{entry.l}</span>
                  <div className="placed-card-body">
                    <span className="placed-card-eye" style={{ background: accent }} />
                    <h3 className="placed-card-name">{name}</h3>
                    <p className="placed-card-en">{entry.t}</p>
                  </div>
                  <button type="button" className="placed-card-decode" onClick={() => decodeOne(entry)}>Dùng lá này giải mã</button>
                </div>
              );
            })}
            {Array.from({ length: Math.max(0, limit - entries.length) }).map((_, i) => <div key={i} className="placed-slot-ghost dim"><span>{entries.length + i + 1}</span></div>)}
          </div>
          <div className="placed-foot">
            <button type="button" className="btn btn-primary placed-decode-all" onClick={decodeAll}>Giải mã với {entries.length === 1 ? "lá này" : `${entries.length} lá`}</button>
            <span className="placed-foot-hint">Iris sẽ đọc cả bộ lá như một câu chuyện - đặt thêm lá để câu chuyện đầy đặn hơn.</span>
          </div>
        </>
      )}
    </section>
  );
}

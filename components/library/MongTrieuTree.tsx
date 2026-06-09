"use client";

import type { ReactNode } from "react";
import { LacBirdPath } from "@/components/patterns";
import type { LibraryData, LibraryTag } from "@/types/content";

function svgNum(value: number) {
  return value.toFixed(4);
}

function EmotionIcon({ type, x, y }: { type: string; x: number; y: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.55, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const icons: Record<string, ReactNode> = {
    "lo-au": <><path {...common} d="M12 4 C7 8 5 13 7 17 C9 21 15 21 17 17 C19 13 17 8 12 4Z" /><path {...common} d="M9 14 C11 12 13 12 15 14" /></>,
    "mat-mat": <><path {...common} d="M7 5 H17 V19 L12 15 L7 19Z" /><path {...common} d="M9 8 H15" /></>,
    "ket-thuc": <><path {...common} d="M6 6 L18 18" /><path {...common} d="M18 6 L6 18" /><circle {...common} cx="12" cy="12" r="8" /></>,
    "tinh-yeu": <path {...common} d="M12 20 C8 16.5 5 14 5 10.5 C5 8.2 6.8 6.5 9 6.5 C10.4 6.5 11.3 7.2 12 8.2 C12.7 7.2 13.6 6.5 15 6.5 C17.2 6.5 19 8.2 19 10.5 C19 14 16 16.5 12 20Z" />,
    "gia-dinh": <><path {...common} d="M5 12 L12 6 L19 12" /><path {...common} d="M7 11 V19 H17 V11" /><path {...common} d="M10 19 V14 H14 V19" /></>,
    "tu-do": <><path {...common} d="M5 14 C8 8 13 7 19 7" /><path {...common} d="M8 14 C11 14 14 12 17 8" /><path {...common} d="M8 14 L5 19" /></>,
    "quyen-luc": <><path {...common} d="M7 10 L10 6 L12 10 L15 6 L18 10 L17 18 H8Z" /><path {...common} d="M8 14 H17" /></>,
    "xung-dot": <><path {...common} d="M5 19 L19 5" /><path {...common} d="M8 5 L19 16" /><path {...common} d="M15 5 L19 5 L19 9" /></>,
    "tien-bac": <><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M12 7 V17" /><path {...common} d="M15 9 C13 8 10 8.5 10 10.5 C10 13.5 15 11.5 15 14.5 C15 16.5 12 17 9.5 15.5" /></>,
    "suc-khoe": <><path {...common} d="M12 20 C8 16.5 5 14 5 10.5 C5 8.2 6.8 6.5 9 6.5 C10.4 6.5 11.3 7.2 12 8.2 C12.7 7.2 13.6 6.5 15 6.5 C17.2 6.5 19 8.2 19 10.5 C19 14 16 16.5 12 20Z" /><path {...common} d="M12 10 V15" /><path {...common} d="M9.5 12.5 H14.5" /></>,
    "du-hanh": <><path {...common} d="M5 12 H19" /><path {...common} d="M14 7 L19 12 L14 17" /><path {...common} d="M6 17 C8 20 15 20 18 14" /></>,
    "bi-an": <><path {...common} d="M12 5 C8 5 5.5 8 5 12 C7 16 9 19 12 19 C15 19 17 16 19 12 C18.5 8 16 5 12 5Z" /><circle {...common} cx="12" cy="12" r="2.8" /></>,
    "thay-doi": <><path {...common} d="M7 8 H16 L13 5" /><path {...common} d="M17 16 H8 L11 19" /><path {...common} d="M16 8 C18 10 18 14 17 16" /><path {...common} d="M8 16 C6 14 6 10 7 8" /></>,
    "ban-nga": <><circle {...common} cx="12" cy="9" r="3" /><path {...common} d="M6 19 C7.5 15 16.5 15 18 19" /><path {...common} d="M8 6 C10 3.5 14 3.5 16 6" /></>,
    "tu-nhien": <><path {...common} d="M12 20 V10" /><path {...common} d="M12 10 C8 10 6 8 6 5 C10 5 12 7 12 10Z" /><path {...common} d="M12 12 C16 12 18 10 18 7 C14 7 12 9 12 12Z" /></>,
    "tam-linh": <><path {...common} d="M12 4 V20" /><path {...common} d="M5 12 H19" /><circle {...common} cx="12" cy="12" r="5" /></>,
    "duc-vong": <><path {...common} d="M12 4 C15 8 18 10 18 14 C18 17 15.5 20 12 20 C8.5 20 6 17 6 14 C6 10 9 8 12 4Z" /><path {...common} d="M10 15 C11 16 13 16 14 15" /></>,
    "thanh-cong": <><path {...common} d="M12 5 L14.2 9.5 L19 10.2 L15.5 13.6 L16.3 18.5 L12 16.2 L7.7 18.5 L8.5 13.6 L5 10.2 L9.8 9.5Z" /></>
  };

  return (
    <g className="mt-tag-icon" transform={`translate(${svgNum(x - 12)} ${svgNum(y - 12)})`} aria-hidden="true">
      {icons[type] || icons["bi-an"]}
    </g>
  );
}

export function MongTrieuTree({ data, activeKey, onOpenBranch }: { data: LibraryData; activeKey: string | null; onOpenBranch: (tag: LibraryTag | null) => void }) {
  const W = 1240;
  const H = 880;
  const cx = W / 2;
  const cy = H / 2;
  const R = { sun: 64, sunRays: 86, band1: 108, sawtooth: 128, sawtoothOuter: 146, spiral: 178, midDots: 204, tagRing: 258, tagOuter: 292, lac: 334, finalDots: 370 };
  const counts = Object.fromEntries(data.tags.map((tag) => [tag.key, data.entries.filter((entry) => entry.g.includes(tag.key)).length]));
  const tagPositions = data.tags.map((tag, i) => {
    const angle = (i / data.tags.length) * Math.PI * 2 - Math.PI / 2;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const labelOffset = Math.abs(cos) > 0.72 ? 64 : 58;
    const anchor: "start" | "middle" | "end" = cos > 0.72 ? "start" : cos < -0.72 ? "end" : "middle";
    return {
      ...tag,
      x: cx + cos * R.tagRing,
      y: cy + sin * R.tagRing,
      labelX: cx + cos * (R.tagRing + labelOffset),
      labelY: cy + sin * (R.tagRing + labelOffset),
      anchor,
      count: counts[tag.key] || 0
    };
  });
  const activeTag = activeKey ? tagPositions.find((tag) => tag.key === activeKey) : null;

  const dots = (n: number, radius: number, size: number) =>
    Array.from({ length: n }).map((_, i) => {
      const a = (i / n) * Math.PI * 2;
      return <circle key={`${n}-${i}`} cx={svgNum(cx + Math.cos(a) * radius)} cy={svgNum(cy + Math.sin(a) * radius)} r={size} fill="rgba(212,168,87,0.45)" />;
    });

  const sawtooth = (() => {
    let path = "";
    for (let i = 0; i < 36; i += 1) {
      const a1 = (i / 36) * Math.PI * 2;
      const a2 = ((i + 0.5) / 36) * Math.PI * 2;
      const a3 = ((i + 1) / 36) * Math.PI * 2;
      path += `${i === 0 ? "M" : "L"} ${svgNum(cx + Math.cos(a1) * R.sawtooth)} ${svgNum(cy + Math.sin(a1) * R.sawtooth)} L ${svgNum(cx + Math.cos(a2) * R.sawtoothOuter)} ${svgNum(cy + Math.sin(a2) * R.sawtoothOuter)} L ${svgNum(cx + Math.cos(a3) * R.sawtooth)} ${svgNum(cy + Math.sin(a3) * R.sawtooth)} `;
    }
    return path + "Z";
  })();

  return (
    <div className={`mt-tree-wrap drum ${activeTag ? "has-active" : ""}`}>
      <svg className="mt-tree-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
        <g className="drum-band outer">
          <circle cx={cx} cy={cy} r={R.finalDots + 18} fill="none" stroke="rgba(212,168,87,0.18)" strokeWidth="0.6" />
          {dots(80, R.finalDots, 1.1)}
        </g>
        <g className="drum-band lac-band">
          <g className="lac-rotate">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
              return <g key={i} transform={`translate(${svgNum(cx + Math.cos(a) * R.lac)}, ${svgNum(cy + Math.sin(a) * R.lac)}) rotate(${svgNum((a * 180) / Math.PI + 90)}) scale(0.55)`}><LacBirdPath /></g>;
            })}
          </g>
        </g>
        <g className="drum-band tag-band">
          <circle cx={cx} cy={cy} r={R.tagOuter} fill="none" stroke="rgba(212,168,87,0.22)" strokeWidth="0.8" />
        </g>
        <g className="mt-trunks">
          {tagPositions.map((tag) => <line key={tag.key} x1={svgNum(cx)} y1={svgNum(cy)} x2={svgNum(tag.x)} y2={svgNum(tag.y)} className={`mt-trunk ${activeKey === tag.key ? "on" : ""} ${activeKey && activeKey !== tag.key ? "dim" : ""}`} style={{ stroke: tag.color }} />)}
        </g>
        <g className="drum-band">{dots(60, R.midDots, 0.9)}</g>
        <g className="drum-band spiral-band">
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <g key={i} transform={`translate(${svgNum(cx + Math.cos(a) * R.spiral)}, ${svgNum(cy + Math.sin(a) * R.spiral)}) rotate(${svgNum((a * 180) / Math.PI + 90)})`}><path d="M -8 0 C -8 -5, -3 -5, -3 0 C -3 5, 3 5, 3 0 C 3 -5, 8 -5, 8 0" fill="none" stroke="rgba(212,168,87,0.55)" strokeWidth="1" strokeLinecap="round" /></g>;
          })}
        </g>
        <g className="drum-band sawtooth-band"><path d={sawtooth} fill="none" stroke="rgba(212,168,87,0.55)" strokeWidth="0.7" /></g>
        <g className="drum-band">{dots(48, R.band1, 1)}</g>
        <g className="mt-center">
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            return <line key={i} x1={svgNum(cx + Math.cos(a) * R.sun)} y1={svgNum(cy + Math.sin(a) * R.sun)} x2={svgNum(cx + Math.cos(a) * R.sunRays)} y2={svgNum(cy + Math.sin(a) * R.sunRays)} className="mt-center-ray" />;
          })}
          <circle cx={cx} cy={cy} r={R.sun} className="mt-center-outer" />
          <circle cx={cx} cy={cy} r={R.sun - 14} className="mt-center-mid" />
          <circle cx={cx} cy={cy} r={R.sun - 28} className="mt-center-inner" />
          <text x={cx} y={cy - 8} textAnchor="middle" className="mt-center-text">Mộng</text>
          <text x={cx} y={cy + 10} textAnchor="middle" className="mt-center-text">Triệu</text>
          <text x={cx} y={cy + 28} textAnchor="middle" className="mt-center-total">{data.entries.length.toLocaleString("vi-VN")}</text>
        </g>
        <g className="mt-tags">
          {tagPositions.map((tag) => (
            <g key={tag.key} className={`mt-tag-node ${activeKey === tag.key ? "on" : ""} ${activeKey && activeKey !== tag.key ? "dim" : ""}`} onClick={() => onOpenBranch(activeKey === tag.key ? null : tag)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onOpenBranch(activeKey === tag.key ? null : tag); }} role="button" tabIndex={0}>
              <circle cx={svgNum(tag.x)} cy={svgNum(tag.y)} r="38" className="mt-tag-halo" style={{ fill: tag.color }} />
              <circle cx={svgNum(tag.x)} cy={svgNum(tag.y)} r="26" className="mt-tag-bg" />
              <circle cx={svgNum(tag.x)} cy={svgNum(tag.y)} r="26" className="mt-tag-ring" style={{ stroke: tag.color }} />
              <circle cx={svgNum(tag.x)} cy={svgNum(tag.y)} r="14" fill={tag.color} className="mt-tag-gem" />
              <EmotionIcon type={tag.key} x={tag.x} y={tag.y} />
              <text x={svgNum(tag.labelX)} y={svgNum(tag.labelY - 2)} textAnchor={tag.anchor} className="mt-tag-text">{tag.vi}</text>
              <text x={svgNum(tag.labelX)} y={svgNum(tag.labelY + 14)} textAnchor={tag.anchor} className="mt-tag-count">{tag.count}</text>
            </g>
          ))}
        </g>
      </svg>
      <div className="mt-hint">{activeTag ? `${activeTag.count.toLocaleString("vi-VN")} biểu tượng trong "${activeTag.vi}" - đang mở danh sách` : `${data.entries.length.toLocaleString("vi-VN")} biểu tượng · 18 nhánh cảm xúc - chạm nhánh để mở danh sách thẻ`}</div>
    </div>
  );
}

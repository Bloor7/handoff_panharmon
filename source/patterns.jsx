// Đông Sơn / chim Lạc / sao — hoa văn SVG nguyên gốc lấy cảm hứng từ trống đồng

const DrumRing = ({ className }) => (
  <svg className={className} viewBox="0 0 600 600" fill="none" stroke="#d4a857" strokeWidth="0.8">
    {/* Outer ring */}
    <circle cx="300" cy="300" r="290" />
    <circle cx="300" cy="300" r="282" />
    {/* Sawtooth band */}
    {Array.from({ length: 72 }).map((_, i) => {
      const a = (i / 72) * Math.PI * 2;
      const x1 = 300 + Math.cos(a) * 270;
      const y1 = 300 + Math.sin(a) * 270;
      const x2 = 300 + Math.cos(a) * 258;
      const y2 = 300 + Math.sin(a) * 258;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
    })}
    <circle cx="300" cy="300" r="258" />
    <circle cx="300" cy="300" r="248" />
    {/* Concentric circles */}
    {[230, 218, 206, 190, 170].map((r) => (
      <circle key={r} cx="300" cy="300" r={r} />
    ))}
    {/* Dot dot band */}
    {Array.from({ length: 48 }).map((_, i) => {
      const a = (i / 48) * Math.PI * 2;
      const x = 300 + Math.cos(a) * 199;
      const y = 300 + Math.sin(a) * 199;
      return <circle key={i} cx={x} cy={y} r="1.6" fill="#d4a857" stroke="none" />;
    })}
    {/* Spiral S-band */}
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const cx = 300 + Math.cos(a) * 150;
      const cy = 300 + Math.sin(a) * 150;
      return (
        <g key={i} transform={`translate(${cx}, ${cy}) rotate(${(a * 180) / Math.PI + 90})`}>
          <path d="M -10 0 C -10 -6, -4 -6, -4 0 C -4 6, 4 6, 4 0 C 4 -6, 10 -6, 10 0" />
        </g>
      );
    })}
    {/* Lac birds — 6 of them flying in a circle */}
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const cx = 300 + Math.cos(a) * 118;
      const cy = 300 + Math.sin(a) * 118;
      return (
        <g key={i} transform={`translate(${cx}, ${cy}) rotate(${(a * 180) / Math.PI + 90}) scale(0.7)`}>
          <LacBirdPath />
        </g>
      );
    })}
    {/* Center sun-star */}
    {Array.from({ length: 14 }).map((_, i) => {
      const a = (i / 14) * Math.PI * 2;
      const x1 = 300 + Math.cos(a) * 40;
      const y1 = 300 + Math.sin(a) * 40;
      const x2 = 300 + Math.cos(a) * 70;
      const y2 = 300 + Math.sin(a) * 70;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.4" />;
    })}
    <circle cx="300" cy="300" r="40" />
    <circle cx="300" cy="300" r="36" />
    <circle cx="300" cy="300" r="20" />
  </svg>
);

const LacBirdPath = () => (
  // Stylised long-beaked, long-tail crane (chim Lạc) — silhouette built from arcs
  <g>
    {/* body */}
    <ellipse cx="0" cy="0" rx="14" ry="4" />
    {/* neck + head */}
    <path d="M 10 -1 C 18 -8, 22 -16, 24 -22 L 28 -24" />
    {/* beak */}
    <path d="M 28 -24 L 38 -28" />
    {/* tail (long feathers, signature trait) */}
    <path d="M -14 0 C -26 -2, -38 -6, -48 -10" />
    <path d="M -14 2 C -28 4, -42 6, -54 6" />
    <path d="M -14 4 C -26 8, -36 12, -44 16" />
    {/* legs */}
    <path d="M -2 4 L -4 14" />
    <path d="M 4 4 L 6 14" />
    {/* wing */}
    <path d="M -4 -3 C 0 -10, 8 -12, 12 -10" />
  </g>
);

const HeroBird = ({ className }) => (
  <svg className={className} viewBox="-80 -80 160 160" fill="none" stroke="#e8c98a" strokeWidth="0.6">
    <g>
      <LacBirdPath />
    </g>
    {/* radiating sun behind */}
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={Math.cos(a) * 50}
          y1={Math.sin(a) * 50}
          x2={Math.cos(a) * 70}
          y2={Math.sin(a) * 70}
          strokeWidth="0.4"
        />
      );
    })}
    <circle cx="0" cy="0" r="50" strokeWidth="0.4" />
  </svg>
);

const BrandMark = ({ className }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    {/* Outer drum-inspired circle with sun rays */}
    <circle cx="20" cy="20" r="18" stroke="#d4a857" strokeWidth="1" />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return (
        <line
          key={i}
          x1={20 + Math.cos(a) * 8}
          y1={20 + Math.sin(a) * 8}
          x2={20 + Math.cos(a) * 14}
          y2={20 + Math.sin(a) * 14}
          stroke="#d4a857"
          strokeWidth="0.8"
        />
      );
    })}
    <circle cx="20" cy="20" r="6" stroke="#e8c98a" strokeWidth="1" />
    <circle cx="20" cy="20" r="2" fill="#e8c98a" />
  </svg>
);

// Symbol library icons — each a tiny abstract glyph
const sym = {
  water: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M8 22c4-3 8-3 12 0s8 3 12 0 8-3 12 0 4 3 4 3" />
      <path d="M8 32c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
      <path d="M8 42c4-3 8-3 12 0s8 3 12 0 8-3 12 0" />
    </svg>
  ),
  flying: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M6 30c4-6 10-6 14 0M22 28c4-6 10-6 14 0M38 30c4-6 10-6 14 0" />
      <circle cx="28" cy="14" r="2" />
    </svg>
  ),
  snake: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M10 14c6 0 6 8 12 8s6-8 12-8 6 8 12 8" />
      <path d="M10 30c6 0 6 8 12 8s6-8 12-8 6 8 12 8" />
    </svg>
  ),
  fish: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M10 28c6-8 18-12 28-6l8-4-2 10 2 10-8-4c-10 6-22 2-28-6z" />
      <circle cx="40" cy="26" r="1.2" fill="currentColor" />
    </svg>
  ),
  fire: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M28 8c4 8 12 12 12 22 0 8-6 14-12 14s-12-6-12-14c0-6 4-8 6-14 2 6 6 4 6-8z" />
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M36 12c-10 2-16 10-16 20s8 16 16 16C24 50 14 40 14 28S24 8 36 12z" />
      <circle cx="44" cy="18" r="0.8" fill="currentColor" />
      <circle cx="48" cy="26" r="0.8" fill="currentColor" />
    </svg>
  ),
  mountain: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M6 42L20 22l8 10 8-14 14 24z" />
      <path d="M14 42l6-8M30 32l4-6" />
    </svg>
  ),
  tooth: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M18 12c-6 0-8 6-6 14l4 18c1 3 5 3 6 0l2-10c1-3 5-3 6 0l2 10c1 3 5 3 6 0l4-18c2-8 0-14-6-14-4 0-6 2-9 2s-5-2-9-2z" />
    </svg>
  ),
  baby: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="28" cy="22" r="8" />
      <path d="M14 46c2-8 8-12 14-12s12 4 14 12" />
      <circle cx="25" cy="22" r="0.8" fill="currentColor" />
      <circle cx="31" cy="22" r="0.8" fill="currentColor" />
    </svg>
  ),
  house: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M8 28L28 12l20 16v18H8z" />
      <path d="M24 46V34h8v12" />
    </svg>
  ),
  money: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="10" y="16" width="36" height="24" rx="2" />
      <circle cx="28" cy="28" r="6" />
      <path d="M14 22h4M38 34h4" />
    </svg>
  ),
  dragon: (
    <svg viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 36c4-2 8-2 10-6s2-10 8-10 8 6 14 6 10-4 12-2" />
      <path d="M40 24c2 0 4 2 4 4M44 28l4-2" />
      <path d="M18 30c2 4 6 4 8 2" />
    </svg>
  ),
};

Object.assign(window, { DrumRing, HeroBird, BrandMark, LacBirdPath, sym });

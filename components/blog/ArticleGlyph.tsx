import type { Article } from "@/types/content";

export function ArticleGlyph({ kind, accent = "var(--gold)" }: { kind: Article["glyph"]; accent?: string }) {
  const common = { width: 120, height: 120, fill: "none", stroke: accent, strokeWidth: 1.4, strokeLinecap: "round" as const };
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 120 120" {...common} aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 12 50 Q 30 38 48 50 T 84 50 T 120 50" />
        <path d="M 0 66 Q 24 54 48 66 T 96 66 T 144 66" opacity="0.7" />
        <path d="M 12 82 Q 30 70 48 82 T 84 82 T 120 82" opacity="0.45" />
      </svg>
    );
  }
  if (kind === "snake") {
    return (
      <svg viewBox="0 0 120 120" {...common} aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 30 30 C 60 30, 30 60, 60 60 C 90 60, 60 90, 90 90" />
        <circle cx="30" cy="30" r="3" fill={accent} />
        <path d="M 90 90 L 96 88 M 90 90 L 96 92" />
      </svg>
    );
  }
  if (kind === "bird") {
    return (
      <svg viewBox="0 0 120 120" {...common} aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 30 70 Q 45 50 60 65 Q 75 50 90 70" />
        <path d="M 60 65 L 60 80" />
      </svg>
    );
  }
  if (kind === "tooth") {
    return (
      <svg viewBox="0 0 120 120" {...common} strokeLinejoin="round" aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 42 40 Q 42 32 52 32 Q 60 32 60 38 Q 60 32 68 32 Q 78 32 78 40 Q 78 64 70 84 Q 66 90 62 76 Q 60 64 58 76 Q 54 90 50 84 Q 42 64 42 40 Z" />
      </svg>
    );
  }
  if (kind === "fish") {
    return (
      <svg viewBox="0 0 120 120" {...common} strokeLinejoin="round" aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 30 60 Q 50 40 80 60 Q 50 80 30 60 Z" />
        <path d="M 80 60 L 96 48 L 96 72 Z" />
      </svg>
    );
  }
  if (kind === "flame") {
    return (
      <svg viewBox="0 0 120 120" {...common} strokeLinejoin="round" aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 60 24 Q 50 44 56 56 Q 44 50 46 70 Q 48 88 60 92 Q 72 88 74 70 Q 76 50 64 56 Q 70 44 60 24 Z" />
      </svg>
    );
  }
  if (kind === "moon") {
    return (
      <svg viewBox="0 0 120 120" {...common} aria-hidden="true">
        <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
        <path d="M 76 36 A 30 30 0 1 0 76 84 A 24 24 0 1 1 76 36 Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 120" {...common} aria-hidden="true">
      <circle cx="60" cy="60" r="40" />
      <circle cx="60" cy="60" r="56" strokeWidth="0.6" opacity="0.5" />
      <path d="M 60 28 L 66 60 L 60 92 L 54 60 Z" strokeLinejoin="round" />
      <circle cx="60" cy="60" r="3" fill={accent} />
    </svg>
  );
}

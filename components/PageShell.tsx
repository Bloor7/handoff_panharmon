import type { ReactNode } from "react";

export function PageShell({ eyebrow, title, sub, children }: { eyebrow: string; title: ReactNode; sub?: string; children: ReactNode }) {
  return (
    <div className="page-shell">
      <div className="page-head">
        <div className="eyebrow">
          <span className="dot"></span>
          {eyebrow}
        </div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-sub">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

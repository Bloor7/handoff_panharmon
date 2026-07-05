"use client";

import { useEffect, useState } from "react";

// Modal nạp credit. Mount một lần ở layout, mở bằng event "topup:open"
// (Nav bấm "Nạp" hoặc chat Iris hết credit đều dispatch event này).
// PHƯƠNG THỨC THANH TOÁN THẬT (QR ngân hàng...) để SAU — hiện chỉ dựng khung + dẫn liên hệ admin.

const PACKAGES = [
  { credits: 50, price: "50.000đ" },
  { credits: 120, price: "100.000đ" },
  { credits: 300, price: "200.000đ" }
];

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(4,6,16,0.72)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 16, backdropFilter: "blur(4px)"
};
const card: React.CSSProperties = {
  width: "min(420px, 100%)", background: "#0c1226",
  border: "1px solid rgba(212,168,87,0.28)", borderRadius: 18,
  padding: "22px 22px 20px", color: "#eae3d2", position: "relative",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
};

export function TopUpModal() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const onOpen = () => { setOpen(true); setSelected(null); };
    window.addEventListener("topup:open", onOpen);
    return () => window.removeEventListener("topup:open", onOpen);
  }, []);

  if (!open) return null;

  return (
    <div style={overlay} role="presentation" onMouseDown={() => setOpen(false)}>
      <div style={card} role="dialog" aria-modal="true" aria-label="Nạp credit" onMouseDown={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Đóng"
          style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", color: "#eae3d2", cursor: "pointer", opacity: 0.7 }}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M5 5L15 15M15 5L5 15" />
          </svg>
        </button>

        <h3 style={{ margin: "0 0 4px", fontSize: 18 }}>Nạp credit</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, opacity: 0.7 }}>
          Chọn một gói. Mỗi lượt giải mơ tốn từ 1 đến 3 credit tuỳ độ dài.
        </p>

        <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
          {PACKAGES.map((p) => (
            <button
              key={p.credits}
              type="button"
              onClick={() => setSelected(p.credits)}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", borderRadius: 12, cursor: "pointer",
                background: selected === p.credits ? "rgba(212,168,87,0.16)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${selected === p.credits ? "rgba(212,168,87,0.6)" : "rgba(255,255,255,0.08)"}`,
                color: "#eae3d2", fontSize: 14
              }}
            >
              <span>{p.credits} credit</span>
              <span style={{ color: "#d4a857", fontWeight: 600 }}>{p.price}</span>
            </button>
          ))}
        </div>

        {selected !== null && (
          <div style={{ padding: 14, borderRadius: 12, border: "1px dashed rgba(212,168,87,0.4)", textAlign: "center", marginBottom: 14 }}>
            <div style={{ width: 120, height: 120, margin: "0 auto 10px", borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, opacity: 0.55 }}>
              QR sắp có
            </div>
            <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
              Cổng thanh toán đang được hoàn thiện. Tạm thời bạn liên hệ admin để nạp {selected} credit nhé.
            </p>
          </div>
        )}

        <a
          href="/lien-he"
          style={{ display: "block", textAlign: "center", padding: "11px 14px", borderRadius: 12, background: "#d4a857", color: "#1a1408", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
        >
          Liên hệ admin để nạp
        </a>
      </div>
    </div>
  );
}

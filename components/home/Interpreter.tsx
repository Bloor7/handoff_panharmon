"use client";

import { useEffect, useRef, useState } from "react";

const QUICK_TAGS = ["Nước", "Bay lượn", "Rắn", "Cá chép", "Rụng răng", "Người đã khuất", "Lạc đường", "Em bé", "Lửa cháy", "Trăng tròn"];
const SAMPLE_DREAMS = [
  "Tôi mơ thấy mình đang bơi trong một dòng sông trong vắt, có đàn cá chép vàng bơi quanh chân.",
  "Tôi bay lên giữa trời sao, phía dưới là cánh đồng lúa và một ngôi làng nhỏ.",
  "Tôi đứng trước một ngôi nhà cũ của bà nội, cửa mở sẵn nhưng tôi không dám bước vào."
];

// Form trang chủ giờ là CỬA VÀO Iris (Hướng 1): bấm giải -> đẩy giấc mơ sang khung chat Iris,
// Iris trả lời trong đó và tự lưu lịch sử. Không tự gọi API, không parse JSON như trước.
export function Interpreter() {
  const [text, setText] = useState("");
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      const prefill = sessionStorage.getItem("prefillDream");
      if (prefill) {
        sessionStorage.removeItem("prefillDream");
        setText(prefill);
        setTimeout(() => {
          taRef.current?.focus();
          taRef.current?.setSelectionRange(prefill.length, prefill.length);
        }, 80);
      }
    } catch {}
  }, []);

  const insertTag = (tag: string) => {
    const current = text.trim();
    setText(current ? `${current} ${tag.toLowerCase()}` : tag);
    taRef.current?.focus();
  };

  const useSample = () => {
    setText(SAMPLE_DREAMS[Math.floor(Math.random() * SAMPLE_DREAMS.length)]);
  };

  // Đẩy giấc mơ sang Iris. Iris (ở layout) lắng nghe event này.
  const askIris = () => {
    const dream = text.trim();
    if (!dream) return;
    window.dispatchEvent(new CustomEvent("iris:ask", { detail: { dream } }));
  };

  return (
    <div className="interp-card">
      <div className="interp-label">
        <span>Kể lại giấc mơ của bạn</span>
        <span className="chip">● Sẵn sàng lắng nghe</span>
      </div>
      <textarea
        ref={taRef}
        className="interp-input"
        placeholder="Đêm qua tôi mơ thấy..."
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") askIris();
        }}
      />
      <div className="interp-tags">
        {QUICK_TAGS.map((tag) => (
          <button key={tag} className="tag" onClick={() => insertTag(tag)} type="button">
            + {tag}
          </button>
        ))}
      </div>
      <div className="interp-foot">
        <div className="hint">{text.length > 0 ? `${text.length} ký tự - Ctrl/⌘ + Enter để giải mã` : "Càng chi tiết, lời giải càng rõ ràng"}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost" type="button" onClick={useSample}>
            Lấy ví dụ
          </button>
          <button className="btn btn-primary" type="button" onClick={askIris} disabled={!text.trim()}>
            Giải mã ngay
            <span className="arrow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { DreamResult } from "@/types/content";

const QUICK_TAGS = ["Nước", "Bay lượn", "Rắn", "Cá chép", "Rụng răng", "Người đã khuất", "Lạc đường", "Em bé", "Lửa cháy", "Trăng tròn"];
const SAMPLE_DREAMS = [
  "Tôi mơ thấy mình đang bơi trong một dòng sông trong vắt, có đàn cá chép vàng bơi quanh chân.",
  "Tôi bay lên giữa trời sao, phía dưới là cánh đồng lúa và một ngôi làng nhỏ.",
  "Tôi đứng trước một ngôi nhà cũ của bà nội, cửa mở sẵn nhưng tôi không dám bước vào."
];

const dreamResultSchema = z.object({
  title: z.string(),
  essence: z.string(),
  symbols: z.array(z.string()).default([]),
  emotion: z.string(),
  advice: z.string()
});

export function Interpreter() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DreamResult | null>(null);
  const [error, setError] = useState<string | null>(null);
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
    setResult(null);
    setError(null);
  };

  const interpret = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    const prompt = `Bạn là một nhà giải mã giấc mơ am hiểu văn hóa Việt Nam, kết hợp tri thức dân gian Việt (chim Lạc, trống đồng, Mẫu, ngũ hành) với tâm lý học giấc mơ hiện đại. Hãy phân tích giấc mơ sau một cách ngắn gọn, ấm áp, không mê tín thái quá.

Giấc mơ: "${text.trim()}"

Trả lời CHÍNH XÁC theo định dạng JSON sau, không thêm gì khác:
{
  "title": "Một câu chủ đề ngắn (tối đa 8 từ) gợi đúng tinh thần giấc mơ",
  "essence": "1 đoạn 2-3 câu giải thích ý nghĩa cốt lõi, ấm áp",
  "symbols": ["3 biểu tượng chính trong giấc mơ, mỗi cái 1-2 từ"],
  "emotion": "Cảm xúc chủ đạo (1-3 từ)",
  "advice": "1 câu khuyên nhẹ nhàng, gần gũi cuộc sống thực"
}`;
    try {
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Claude error");
      const match = String(data.text || "").match(/\{[\s\S]*\}/);
      if (!match) throw new Error("Không phân tích được phản hồi");
      setResult(dreamResultSchema.parse(JSON.parse(match[0])));
    } catch (err) {
      console.error(err);
      setError("Có chút mây mù che mặt trăng. Bạn thử lại sau một chút nhé.");
    } finally {
      setLoading(false);
    }
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
          if ((event.metaKey || event.ctrlKey) && event.key === "Enter") void interpret();
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
          <button className="btn btn-primary" type="button" onClick={() => void interpret()} disabled={!text.trim() || loading}>
            {loading ? (
              <>
                Đang giải mã
                <span className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </>
            ) : (
              <>
                Giải mã ngay
                <span className="arrow">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="interp-result" style={{ borderColor: "rgba(200, 100, 100, 0.3)" }}>
          <p style={{ margin: 0, color: "#e6a3a3" }}>{error}</p>
        </div>
      )}

      {result && (
        <div className="interp-result">
          <h4>{result.title}</h4>
          <p>{result.essence}</p>
          {result.advice && <p style={{ borderLeft: "2px solid rgba(212,168,87,0.5)", paddingLeft: 14, fontStyle: "italic", color: "var(--ink)" }}>{result.advice}</p>}
          <div className="meta-row">
            <div>
              <b>Biểu tượng:</b> {result.symbols.join(" · ")}
            </div>
            <div>
              <b>Cảm xúc:</b> {result.emotion}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

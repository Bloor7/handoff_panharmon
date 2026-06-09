"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  return (
    <form
      className="contact-form"
      onSubmit={async (event) => {
        event.preventDefault();
        setStatus("loading");
        const form = new FormData(event.currentTarget);
        const response = await fetch("/api/contact", {
          method: "POST",
          body: JSON.stringify(Object.fromEntries(form)),
          headers: { "Content-Type": "application/json" }
        });
        setStatus(response.ok ? "success" : "error");
        if (response.ok) event.currentTarget.reset();
        setTimeout(() => setStatus("idle"), 4000);
      }}
    >
      <div className="field">
        <label htmlFor="cf-name">Tên bạn</label>
        <input id="cf-name" name="name" type="text" placeholder="Nguyễn Văn A" required minLength={2} />
      </div>
      <div className="field">
        <label htmlFor="cf-email">Email</label>
        <input id="cf-email" name="email" type="email" placeholder="ban@email.com" required />
      </div>
      <div className="field">
        <label htmlFor="cf-topic">Chủ đề</label>
        <select id="cf-topic" name="topic" defaultValue="" required>
          <option value="" disabled>Chọn một chủ đề</option>
          <option>Hỏi về dịch vụ</option>
          <option>Hợp tác</option>
          <option>Báo lỗi</option>
          <option>Khác</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="cf-msg">Lời nhắn</label>
        <textarea id="cf-msg" name="message" placeholder="Chia sẻ điều bạn muốn..." required minLength={10}></textarea>
      </div>
      {status === "error" && <p className="drawer-error">Chưa gửi được. Bạn thử lại sau một chút nhé.</p>}
      <button className="btn btn-primary" type="submit" disabled={status === "loading"} style={{ width: "100%", justifyContent: "center" }}>
        {status === "loading" ? "Đang gửi..." : status === "success" ? "Đã gửi - cảm ơn bạn ✿" : "Gửi lời nhắn"}
      </button>
    </form>
  );
}

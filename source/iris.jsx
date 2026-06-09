// === Iris — AI chat companion (bottom-left floating widget) ===

const IRIS_STORAGE = "iris.history.v1";
const IRIS_SYSTEM = `Bạn là Iris — một thực thể tinh tế trong thế giới giấc mơ, làm bạn đồng hành trên trang web Panharmon. Bạn nói tiếng Việt ấm áp, ngắn gọn, gợi mở (không dài dòng, không lên lớp). Kiến thức của bạn pha trộn:
- Tâm lý học giấc mơ (Jung, Freud nhẹ nhàng)
- Tri thức dân gian Việt: chim Lạc, trống Đông Sơn, ngũ hành, can chi
- Văn hoá Á Đông và Vệt Nam đương đại

Phong cách:
- Tự xưng "Iris", gọi người dùng là "bạn"
- Trả lời 1-3 câu là chính. Chỉ dài hơn nếu người dùng hỏi chi tiết.
- Không dùng emoji
- Đôi khi đặt câu hỏi ngược để khơi gợi`;

const IRIS_GREETING = "Iris đây. Bạn có thể kể cho mình một giấc mơ, hoặc hỏi bất cứ điều gì về cõi mộng.";

const loadIrisHistory = () => {
  try {
    const h = JSON.parse(localStorage.getItem(IRIS_STORAGE) || "[]");
    if (Array.isArray(h) && h.length > 0) return h;
  } catch {}
  return [{ role: "assistant", content: IRIS_GREETING }];
};

const saveIrisHistory = (h) => {
  try { localStorage.setItem(IRIS_STORAGE, JSON.stringify(h.slice(-30))); } catch {}
};

const Iris = () => {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState(loadIrisHistory);
  const [input, setInput] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [unread, setUnread] = React.useState(false);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);

  React.useEffect(() => { saveIrisHistory(messages); }, [messages]);

  // Auto-scroll on new message
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  React.useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setPending(true);

    // Build a single prompt from history (window.claude.complete supports messages)
    try {
      const recent = next.slice(-12); // last 12 turns
      const reply = await window.claude.complete({
        messages: [
          { role: "user", content: `${IRIS_SYSTEM}\n\n---\nĐây là cuộc trò chuyện hiện tại. Hãy trả lời với tư cách Iris cho tin nhắn cuối của người dùng:\n\n${recent.map((m) => `${m.role === "user" ? "Người dùng" : "Iris"}: ${m.content}`).join("\n\n")}\n\nIris:` }
        ]
      });
      const trimmed = String(reply || "").trim().replace(/^Iris:\s*/i, "");
      setMessages([...next, { role: "assistant", content: trimmed || "Mình đang ngẫm... bạn nhắn lại nhé." }]);
      if (!open) setUnread(true);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "Sương mù che mất giọng nói của mình rồi. Bạn thử lại sau một chút nhé." }]);
    } finally {
      setPending(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    if (confirm("Xoá toàn bộ cuộc trò chuyện với Iris?")) {
      const fresh = [{ role: "assistant", content: IRIS_GREETING }];
      setMessages(fresh);
    }
  };

  return (
    <>
      {/* Floating bubble button */}
      <button
        type="button"
        className={`iris-bubble ${open ? "open" : ""} ${unread ? "unread" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Đóng Iris" : "Mở Iris"}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M5 5L15 15M15 5L5 15" />
          </svg>
        ) : (
          <IrisMark />
        )}
        {unread && !open && <span className="iris-dot" />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="iris-panel" role="dialog" aria-label="Iris chat">
          <header className="iris-head">
            <div className="iris-avatar"><IrisMark size={22} /></div>
            <div className="iris-titles">
              <h4>Iris</h4>
              <p>người bạn đồng hành cõi mộng</p>
            </div>
            <button className="iris-clear" type="button" onClick={clearChat} title="Xoá cuộc trò chuyện">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M2 4h10M5 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4M4 4l.5 7a1 1 0 001 1h3a1 1 0 001-1L10 4" />
              </svg>
            </button>
          </header>

          <div className="iris-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`iris-msg ${m.role}`}>
                {m.role === "assistant" && <span className="iris-msg-name">Iris</span>}
                <div className="iris-msg-bubble">{m.content}</div>
              </div>
            ))}
            {pending && (
              <div className="iris-msg assistant">
                <span className="iris-msg-name">Iris</span>
                <div className="iris-msg-bubble pending">
                  <span className="loading-dots"><span></span><span></span><span></span></span>
                </div>
              </div>
            )}
          </div>

          <div className="iris-input-wrap">
            <textarea
              ref={inputRef}
              className="iris-input"
              placeholder="Hỏi Iris điều gì đó..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
            <button
              type="button"
              className="iris-send"
              onClick={send}
              disabled={!input.trim() || pending}
              aria-label="Gửi"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h12M9 4l5 4-5 4" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Iris mark — abstract iris/eye glyph
const IrisMark = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.1" />
    <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1" />
    <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    {/* Petal rays */}
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      const x1 = 12 + Math.cos(a) * 6.5;
      const y1 = 12 + Math.sin(a) * 6.5;
      const x2 = 12 + Math.cos(a) * 9;
      const y2 = 12 + Math.sin(a) * 9;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />;
    })}
  </svg>
);

Object.assign(window, { Iris, IrisMark });

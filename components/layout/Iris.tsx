"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";

type Message = { role: "user" | "assistant"; content: string };

const IRIS_STORAGE = "iris.history.v1";
const IRIS_GREETING = "Iris đây. Bạn có thể kể cho mình một giấc mơ, hoặc hỏi bất cứ điều gì về cõi mộng.";
const IRIS_SYSTEM = `Bạn là Iris - một thực thể tinh tế trong thế giới giấc mơ, làm bạn đồng hành trên trang web Panharmon. Bạn nói tiếng Việt ấm áp, ngắn gọn, gợi mở.
- Tự xưng "Iris", gọi người dùng là "bạn"
- Trả lời 1-3 câu là chính
- Không dùng emoji
- Kiến thức pha trộn Jung, tri thức dân gian Việt, trống Đông Sơn, ngũ hành, văn hoá Á Đông
- Đôi khi đặt câu hỏi ngược để khơi gợi`;

function svgNum(value: number) {
  return value.toFixed(4);
}

function loadHistory(): Message[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(IRIS_STORAGE) || "[]");
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return [{ role: "assistant", content: IRIS_GREETING }];
}

function saveHistory(messages: Message[]) {
  try {
    localStorage.setItem(IRIS_STORAGE, JSON.stringify(messages.slice(-30)));
  } catch {}
}

async function loadConversation(token: string): Promise<Message[] | null> {
  try {
    const response = await fetch("/api/conversations", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { messages?: Message[] };
    if (Array.isArray(data.messages) && data.messages.length > 0) return data.messages;
  } catch {}
  return null;
}

async function saveConversation(token: string, messages: Message[]) {
  try {
    await fetch("/api/conversations", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messages: messages.slice(-30) })
    });
  } catch {}
}

export function IrisMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="12" cy="12" r="6.2" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return <line key={i} x1={svgNum(12 + Math.cos(a) * 6.5)} y1={svgNum(12 + Math.sin(a) * 6.5)} x2={svgNum(12 + Math.cos(a) * 9)} y2={svgNum(12 + Math.sin(a) * 9)} stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />;
      })}
    </svg>
  );
}

export function Iris() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: IRIS_GREETING }]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [unread, setUnread] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUserEmail, setAuthUserEmail] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const accessTokenRef = useRef("");
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  const authConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  useEffect(() => {
    let cancelled = false;
    setMessages(loadHistory());

    if (!authConfigured) {
      setMounted(true);
      return () => {
        cancelled = true;
      };
    }

    const supabase = createClient();
    supabaseRef.current = supabase;

    void supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      const session = data.session;
      if (session) {
        accessTokenRef.current = session.access_token;
        setAuthUserEmail(session.user.email || "");
        const serverMessages = await loadConversation(session.access_token);
        if (!cancelled && serverMessages) setMessages(serverMessages);
      }
      setMounted(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      accessTokenRef.current = session?.access_token || "";
      setAuthUserEmail(session?.user.email || "");
      if (session?.access_token) {
        void loadConversation(session.access_token).then((serverMessages) => {
          if (serverMessages) setMessages(serverMessages);
        });
      }
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [authConfigured]);

  useEffect(() => {
    if (!mounted) return;
    saveHistory(messages);
    if (accessTokenRef.current) void saveConversation(accessTokenRef.current, messages);
  }, [messages, mounted]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, pending]);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 220);
    }
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const recent = next.slice(-12);
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `${IRIS_SYSTEM}\n\n---\nĐây là cuộc trò chuyện hiện tại. Hãy trả lời với tư cách Iris cho tin nhắn cuối của người dùng:\n\n${recent.map((m) => `${m.role === "user" ? "Người dùng" : "Iris"}: ${m.content}`).join("\n\n")}\n\nIris:`
            }
          ]
        })
      });
      const data = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Claude error");
      const reply = String(data.text || "").trim().replace(/^Iris:\s*/i, "") || "Mình đang ngẫm... bạn nhắn lại nhé.";
      setMessages([...next, { role: "assistant", content: reply }]);
      if (!open) setUnread(true);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sương mù che mất giọng nói của mình rồi. Bạn thử lại sau một chút nhé." }]);
    } finally {
      setPending(false);
    }
  };

  const clearChat = () => {
    if (confirm("Xoá toàn bộ cuộc trò chuyện với Iris?")) {
      setMessages([{ role: "assistant", content: IRIS_GREETING }]);
    }
  };

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = supabaseRef.current;
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError("");
    const result = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword })
      : await supabase.auth.signUp({
          email: authEmail,
          password: authPassword,
          options: {
            data: {
              full_name: authName.trim(),
              username: authName.trim()
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });
    setAuthLoading(false);
    if (result.error) {
      setAuthError(result.error.message);
      return;
    }
    setAuthPassword("");
    if (authMode === "register" && !result.data.session) {
      setAuthError("Tài khoản đã tạo. Kiểm tra email để xác nhận trước khi đăng nhập.");
    } else {
      setAuthOpen(false);
    }
  };

  const signInWithGoogle = async () => {
    const supabase = supabaseRef.current;
    if (!supabase) return;
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    setAuthLoading(false);
    if (error) setAuthError(error.message);
  };

  const signOut = async () => {
    await supabaseRef.current?.auth.signOut();
    accessTokenRef.current = "";
    setAuthUserEmail("");
  };

  return (
    <>
      <button type="button" id="iris" className={`iris-bubble ${open ? "open" : ""} ${unread ? "unread" : ""}`} onClick={() => setOpen((value) => !value)} aria-label={open ? "Đóng Iris" : "Mở Iris"}>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M5 5L15 15M15 5L5 15" />
          </svg>
        ) : (
          <IrisMark />
        )}
        {unread && !open && <span className="iris-dot" />}
      </button>

      {open && (
        <div className="iris-panel" role="dialog" aria-label="Iris chat">
          <header className="iris-head">
            <div className="iris-avatar">
              <IrisMark size={22} />
            </div>
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
          {authConfigured && (
            <div className="iris-auth">
              {authUserEmail ? (
                <>
                  <span>{authUserEmail}</span>
                  <button type="button" onClick={() => void signOut()}>Đăng xuất</button>
                </>
              ) : (
                <button type="button" className="iris-auth-open" onClick={() => setAuthOpen(true)}>Đăng nhập / Đăng ký</button>
              )}
              {authError && <p>{authError}</p>}
            </div>
          )}
          <div className="iris-body" ref={scrollRef}>
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`iris-msg ${message.role}`}>
                {message.role === "assistant" && <span className="iris-msg-name">Iris</span>}
                <div className="iris-msg-bubble">{message.content}</div>
              </div>
            ))}
            {pending && (
              <div className="iris-msg assistant">
                <span className="iris-msg-name">Iris</span>
                <div className="iris-msg-bubble pending">
                  <span className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="iris-input-wrap">
            <textarea ref={inputRef} className="iris-input" placeholder="Hỏi Iris điều gì đó..." value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }} rows={1} />
            <button type="button" className="iris-send" onClick={() => void send()} disabled={!input.trim() || pending} aria-label="Gửi">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 8h12M9 4l5 4-5 4" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {authOpen && authConfigured && !authUserEmail && (
        <div className="iris-auth-modal-backdrop" role="presentation" onMouseDown={() => setAuthOpen(false)}>
          <div className="iris-auth-modal" role="dialog" aria-modal="true" aria-label="Đăng nhập Iris" onMouseDown={(event) => event.stopPropagation()}>
            <button className="iris-auth-close" type="button" onClick={() => setAuthOpen(false)} aria-label="Đóng">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M5 5L15 15M15 5L5 15" />
              </svg>
            </button>
            <div className="iris-auth-modal-head">
              <div className="iris-avatar"><IrisMark size={22} /></div>
              <div>
                <h3>{authMode === "login" ? "Đăng nhập Iris" : "Tạo tài khoản Iris"}</h3>
                <p>Lưu lịch sử trò chuyện và tiếp tục cuộc trò chuyện ở lần sau.</p>
              </div>
            </div>
            <div className="iris-auth-tabs">
              <button type="button" className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setAuthError(""); }}>Đăng nhập</button>
              <button type="button" className={authMode === "register" ? "active" : ""} onClick={() => { setAuthMode("register"); setAuthError(""); }}>Đăng ký</button>
            </div>
            <form className="iris-auth-form" onSubmit={submitAuth}>
              {authMode === "register" && (
                <label>
                  Username
                  <input type="text" value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="Tên của bạn" autoComplete="name" required />
                </label>
              )}
              <label>
                Email
                <input type="email" value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} placeholder="ban@email.com" autoComplete="email" required />
              </label>
              <label>
                Password
                <input type="password" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} placeholder="Mật khẩu" autoComplete={authMode === "login" ? "current-password" : "new-password"} required minLength={6} />
              </label>
              <button className="iris-auth-primary" type="submit" disabled={authLoading}>{authLoading ? "Đang xử lý..." : authMode === "login" ? "Đăng nhập" : "Đăng ký bằng email"}</button>
            </form>
            <div className="iris-auth-divider"><span>hoặc</span></div>
            <button className="iris-auth-google" type="button" onClick={() => void signInWithGoogle()} disabled={authLoading}>
              <span>G</span>
              Tiếp tục với Google
            </button>
            {authError && <p className="iris-auth-modal-error">{authError}</p>}
          </div>
        </div>
      )}
    </>
  );
}

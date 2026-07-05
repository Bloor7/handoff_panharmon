"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { estimateCost } from "@/lib/credit-cost";

type Message = { role: "user" | "assistant"; content: string };

const IRIS_STORAGE = "iris.history.v1";
const IRIS_GREETING = "Iris đây. Bạn có thể kể cho mình một giấc mơ, hoặc hỏi bất cứ điều gì về cõi mộng.";

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
  const [credits, setCredits] = useState<number | null>(null);
  const [unread, setUnread] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authName, setAuthName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUserEmail, setAuthUserEmail] = useState("");
  const [authUserName, setAuthUserName] = useState("");
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
        void supabase.from("credits").select("balance").eq("user_id", session.user.id).maybeSingle().then(({ data }) => { if (!cancelled) setCredits(data?.balance ?? 0); });
        setAuthUserEmail(session.user.email || "");
        setAuthUserName(session.user.user_metadata?.full_name || "");
        const serverMessages = await loadConversation(session.access_token);
        if (!cancelled && serverMessages) setMessages(serverMessages);
      }
      setMounted(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      accessTokenRef.current = session?.access_token || "";
      if (session?.user) { void supabase.from("credits").select("balance").eq("user_id", session.user.id).maybeSingle().then(({ data }) => setCredits(data?.balance ?? 0)); } else { setCredits(null); }
      setAuthUserEmail(session?.user.email || "");
      setAuthUserName(session?.user?.user_metadata?.full_name || "");
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

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || pending) return;
    if (!accessTokenRef.current) {
      setAuthOpen(true);
      return;
    }
    const cost = estimateCost(text);
    if (credits !== null && credits < cost) {
      setMessages([
        ...messages,
        { role: "user" as const, content: text },
        { role: "assistant" as const, content: `Lượt này cần ${cost} credit nhưng bạn chỉ còn ${credits}. Bạn nạp thêm để Iris tiếp tục nhé.` }
      ]);
      setInput("");
      return;
    }
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const recent = next.slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/claude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessTokenRef.current}`
        },
        body: JSON.stringify({ messages: recent })
      });
      const data = (await response.json()) as { text?: string; error?: string; cost?: number; balance?: number };
      if (response.status === 402) {
        if (typeof data.balance === "number") setCredits(data.balance);
        setMessages([...next, { role: "assistant" as const, content: `Lượt này cần ${data.cost ?? cost} credit nhưng bạn chỉ còn ${data.balance ?? credits ?? 0}. Bạn nạp thêm nhé.` }]);
        return;
      }
      if (response.status === 401) {
        setAuthOpen(true);
        setMessages([...next, { role: "assistant" as const, content: "Bạn cần đăng nhập lại để Iris tiếp tục nhé." }]);
        return;
      }
      if (!response.ok) throw new Error(data.error || "Claude error");
      const reply = String(data.text || "").trim() || "Iris đang ngẫm... bạn nhắn lại nhé.";
      setMessages([...next, { role: "assistant" as const, content: reply }]);
      if (typeof data.balance === "number") setCredits(data.balance);
      if (!open) setUnread(true);
    } catch {
      setMessages([...next, { role: "assistant" as const, content: "Sương mù che mất giọng nói của Iris rồi. Bạn thử lại sau một chút nhé." }]);
    } finally {
      setPending(false);
    }
  };

  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    if (credits !== null) window.dispatchEvent(new CustomEvent("credits:updated", { detail: { balance: credits } }));
  }, [credits]);

  useEffect(() => {
    const onAsk = (event: Event) => {
      const dream = (event as CustomEvent).detail?.dream;
      if (!dream) return;
      setOpen(true);
      if (accessTokenRef.current) void sendRef.current(dream);
      else { setInput(dream); setAuthOpen(true); }
    };
    const onOpenAuth = () => { setOpen(true); setAuthOpen(true); };
    window.addEventListener("iris:ask", onAsk);
    window.addEventListener("iris:open-auth", onOpenAuth);
    return () => {
      window.removeEventListener("iris:ask", onAsk);
      window.removeEventListener("iris:open-auth", onOpenAuth);
    };
  }, []);

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
    setAuthUserName("");
    setCredits(null);
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
                  <span>{authUserName || authUserEmail}{credits !== null ? ` · ${credits} credit` : ""}</span>
                  <button type="button" className="iris-auth-open" onClick={() => window.dispatchEvent(new CustomEvent("topup:open"))}>Nạp</button>
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
          {authUserEmail && input.trim() && (
              <div style={{ padding: "2px 16px 0", fontSize: 11, opacity: 0.55 }}>
                Lượt này ước {estimateCost(input)} credit{credits !== null ? ` · còn ${credits}` : ""}
              </div>
            )}
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

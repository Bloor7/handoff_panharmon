"use client";

import { useEffect, useRef, useState } from "react";

export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent("panharmon-toast", { detail: message }));
}

export function Toast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onToast = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setMessage(custom.detail);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), 2400);
    };
    window.addEventListener("panharmon-toast", onToast);
    return () => {
      window.removeEventListener("panharmon-toast", onToast);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!message) return null;
  return (
    <div className="ph-toast" role="status" aria-live="polite">
      <span className="ph-toast-dot" />
      <span>{message}</span>
    </div>
  );
}

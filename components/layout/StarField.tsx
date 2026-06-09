"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  phase: number;
  speed: number;
  vx: number;
  vy: number;
  color: string;
};

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let mouseX = 0;
    let mouseY = 0;
    const ratio = window.devicePixelRatio || 1;

    const resize = () => {
      w = canvas.width = window.innerWidth * ratio;
      h = canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const stars: Star[] = [];
    const count = Math.min(180, Math.floor((window.innerWidth * window.innerHeight) / 9000));
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0008 + 0.0004,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        color: Math.random() > 0.85 ? "#e8c98a" : Math.random() > 0.6 ? "#c9c1b0" : "#ffffff"
      });
    }

    const onMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = () => {
      t += 16;
      ctx.clearRect(0, 0, w, h);
      const px = mouseX * 8 * ratio;
      const py = mouseY * 6 * ratio;

      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x += w;
        if (star.x > w) star.x -= w;
        if (star.y < 0) star.y += h;
        if (star.y > h) star.y -= h;

        const alpha = Math.max(0, Math.min(1, star.baseAlpha + Math.sin(t * star.speed + star.phase) * 0.3));
        ctx.beginPath();
        ctx.arc(star.x + px * (star.r / 1.4), star.y + py * (star.r / 1.4), star.r * ratio, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-canvas" />;
}

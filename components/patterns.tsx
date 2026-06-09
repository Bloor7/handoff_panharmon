"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

function svgNum(value: number) {
  return value.toFixed(4);
}

export function LacBirdPath() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="14" ry="4" />
      <path d="M 10 -1 C 18 -8, 22 -16, 24 -22 L 28 -24" />
      <path d="M 28 -24 L 38 -28" />
      <path d="M -14 0 C -26 -2, -38 -6, -48 -10" />
      <path d="M -14 2 C -28 4, -42 6, -54 6" />
      <path d="M -14 4 C -26 8, -36 12, -44 16" />
      <path d="M -2 4 L -4 14" />
      <path d="M 4 4 L 6 14" />
      <path d="M -4 -3 C 0 -10, 8 -12, 12 -10" />
    </g>
  );
}

export function DrumRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" fill="none" stroke="#d4a857" strokeWidth="0.8" aria-hidden="true">
      <circle cx="300" cy="300" r="290" />
      <circle cx="300" cy="300" r="282" />
      {Array.from({ length: 72 }).map((_, i) => {
        const a = (i / 72) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={svgNum(300 + Math.cos(a) * 270)}
            y1={svgNum(300 + Math.sin(a) * 270)}
            x2={svgNum(300 + Math.cos(a) * 258)}
            y2={svgNum(300 + Math.sin(a) * 258)}
          />
        );
      })}
      <circle cx="300" cy="300" r="258" />
      <circle cx="300" cy="300" r="248" />
      {[230, 218, 206, 190, 170].map((r) => <circle key={r} cx="300" cy="300" r={r} />)}
      {Array.from({ length: 48 }).map((_, i) => {
        const a = (i / 48) * Math.PI * 2;
        return <circle key={i} cx={svgNum(300 + Math.cos(a) * 199)} cy={svgNum(300 + Math.sin(a) * 199)} r="1.6" fill="#d4a857" stroke="none" />;
      })}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <g key={i} transform={`translate(${svgNum(300 + Math.cos(a) * 150)}, ${svgNum(300 + Math.sin(a) * 150)}) rotate(${svgNum((a * 180) / Math.PI + 90)})`}>
            <path d="M -10 0 C -10 -6, -4 -6, -4 0 C -4 6, 4 6, 4 0 C 4 -6, 10 -6, 10 0" />
          </g>
        );
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return (
          <g key={i} transform={`translate(${svgNum(300 + Math.cos(a) * 118)}, ${svgNum(300 + Math.sin(a) * 118)}) rotate(${svgNum((a * 180) / Math.PI + 90)}) scale(0.7)`}>
            <LacBirdPath />
          </g>
        );
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <line key={i} x1={svgNum(300 + Math.cos(a) * 40)} y1={svgNum(300 + Math.sin(a) * 40)} x2={svgNum(300 + Math.cos(a) * 70)} y2={svgNum(300 + Math.sin(a) * 70)} strokeWidth="1.4" />;
      })}
      <circle cx="300" cy="300" r="40" />
      <circle cx="300" cy="300" r="36" />
      <circle cx="300" cy="300" r="20" />
    </svg>
  );
}

export function HeroBird({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-80 -80 160 160" fill="none" stroke="#e8c98a" strokeWidth="0.6" aria-hidden="true">
      <LacBirdPath />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <line key={i} x1={svgNum(Math.cos(a) * 50)} y1={svgNum(Math.sin(a) * 50)} x2={svgNum(Math.cos(a) * 70)} y2={svgNum(Math.sin(a) * 70)} strokeWidth="0.4" />;
      })}
      <circle cx="0" cy="0" r="50" strokeWidth="0.4" />
    </svg>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" stroke="#d4a857" strokeWidth="1" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={svgNum(20 + Math.cos(a) * 8)} y1={svgNum(20 + Math.sin(a) * 8)} x2={svgNum(20 + Math.cos(a) * 14)} y2={svgNum(20 + Math.sin(a) * 14)} stroke="#d4a857" strokeWidth="0.8" />;
      })}
      <circle cx="20" cy="20" r="6" stroke="#e8c98a" strokeWidth="1" />
      <circle cx="20" cy="20" r="2" fill="#e8c98a" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <span className="arrow" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      className="reveal in"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

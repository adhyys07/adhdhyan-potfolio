"use client";

import { useEffect, useMemo, useRef } from "react";
import styles from "./ascii-field.module.css";

const COLS = 180;
const ROWS = 46;
const LENS_W = 260;
const LENS_H = 300;

const GLYPHS = [".", ":", "-", "-", "-", "=", "=", "+", "+", "*", "#",
                "0", "o", "/", "\\", "|", "<", ">", "[", "]", "_", ";", "~"];
const SPARKS = ["*", "+", "!"];

function buildField(seed: number) {
  let s = seed;
  const rnd = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let field = "";
  let sparks = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      field += rnd() < 0.54 ? " " : GLYPHS[(rnd() * GLYPHS.length) | 0];
      sparks += rnd() < 0.035 ? SPARKS[(rnd() * 3) | 0] : " ";
    }
    field += "\n";
    sparks += "\n";
  }
  return { field, sparks };
}

export default function AsciiField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const { field, sparks } = useMemo(() => buildField(1337), []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const lx = px - LENS_W / 2;
        const ly = py - LENS_H / 2;
        if (lensRef.current)  lensRef.current.style.transform  = `translate3d(${lx}px, ${ly}px, 0)`;
        if (innerRef.current) innerRef.current.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
      });
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className={styles.field}>
      <pre className={styles.dim}>{field}</pre>
      <div ref={lensRef} className={styles.lens}>
        <div ref={innerRef} className={styles.inner}>
          <pre className={styles.bright}>{field}</pre>
          <pre className={styles.sparks}>{sparks}</pre>
        </div>
      </div>
      <div className={styles.scrim} />
    </div>
  );
}
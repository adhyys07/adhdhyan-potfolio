"use client";

import { useEffect } from "react";
import styles from "./portfolio-index.module.css";

export default function PortfolioIndexClient() {
  useEffect(() => {
    const root = document.getElementById("portfolio-root");
    if (!root) return;

    const cursor = root.querySelector<HTMLElement>("[data-cursor]");
    if (!cursor) return;

    const moveCursor = (event: MouseEvent) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    const hoverTargets = root.querySelectorAll<HTMLElement>("a, [data-hover]");
    const onEnter = () => cursor.classList.add(styles.big);
    const onLeave = () => cursor.classList.remove(styles.big);

    hoverTargets.forEach((target) => {
      target.addEventListener("mouseenter", onEnter);
      target.addEventListener("mouseleave", onLeave);
    });

    document.addEventListener("mousemove", moveCursor);

    root.classList.remove(styles.noJs);
    root.classList.add(styles.jsReady);

    const revealTargets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealTargets.forEach((node) => observer.observe(node));

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      hoverTargets.forEach((target) => {
        target.removeEventListener("mouseenter", onEnter);
        target.removeEventListener("mouseleave", onLeave);
      });
      observer.disconnect();
    };
  }, []);

  return null;
}

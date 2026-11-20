"use client";

import { useState } from "react";
import styles from "./faq-block.module.css";

type Item = {
  id: string;
  q: string;
  a: React.ReactNode;
};

const items: Item[] = [
  {
    id: "building",
    q: "what are you building right now?",
    a: (
      <>
        a physics-based puzzle game, <a href="https://cucumbu.com" target="_blank" rel="noreferrer noopener">cucumbu</a>{" "}
        (an AI workspace assistant, still in R&amp;D), and custom firmware plus an OS for a dedicated game console.
      </>
    ),
  },
  {
    id: "code",
    q: "can i use your code?",
    a: (
      <>
        most of it is public on <a href="https://github.com/adhyys07" target="_blank" rel="noreferrer noopener">github</a> —
        this site included. fork it, break it, send me the fork.
      </>
    ),
  },
  {
    id: "reach",
    q: "how do i reach you?",
    a: (
      <>
        email is best — <a href="mailto:me@adhyys.cc">me@adhyys.cc</a>. i&apos;m also around the hack club slack most days.
      </>
    ),
  },
];

export default function FaqBlock() {
  const [open, setOpen] = useState<string | null>(items[0].id);

  return (
    <div className={styles.list}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className={styles.row}>
            <button
              type="button"
              className={styles.q}
              aria-expanded={isOpen}
              aria-controls={`faq-${item.id}`}
              onClick={() => setOpen(isOpen ? null : item.id)}
            >
              <span aria-hidden className={styles.mark}>{isOpen ? "−" : "+"}</span>
              <span>{item.q}</span>
            </button>
            {isOpen && (
              <p id={`faq-${item.id}`} className={styles.a}>
                {item.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

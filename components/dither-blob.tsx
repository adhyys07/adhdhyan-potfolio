"use client";

import { useEffect, useRef } from "react";
import styles from "./dither-blob.module.css";

export default function DitherBlob() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    svg.querySelectorAll<SVGAnimationElement>("[data-morph]").forEach((n) => n.beginElement?.());
  }, []);
  return (
    <svg ref={ref} aria-hidden className={styles.blob}
         viewBox="0 0 1200 320" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="blob-dither" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect className={styles.ink} x="0" y="0" width="4" height="4" />
          <rect className={styles.ink} x="4" y="4" width="4" height="4" />
          <animateTransform data-morph attributeName="patternTransform" type="translate"
                            values="0 0; 8 -8; 0 0" dur="2.4s"
                            begin="indefinite" repeatCount="indefinite" />
        </pattern>

        <filter id="blob-warp" x="-25%" y="-40%" width="150%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018"
                        numOctaves={2} seed={7} result="noise">
            <animate data-morph attributeName="baseFrequency"
                     values="0.009 0.018; 0.015 0.012; 0.011 0.024; 0.009 0.018"
                     dur="24s" begin="indefinite" repeatCount="indefinite"
                     calcMode="spline" keyTimes="0; 0.33; 0.66; 1"
                     keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={58}
                             xChannelSelector="R" yChannelSelector="G">
            <animate data-morph attributeName="scale" values="58; 72; 50; 58"
                     dur="17s" begin="indefinite" repeatCount="indefinite" />
          </feDisplacementMap>
        </filter>
        </defs>

        <g filter="url(#blob-warp)" opacity={0.4}>
        <ellipse cx="600" cy="150" rx="416" ry="106"
                 fill="none" stroke="url(#blob-dither)" strokeWidth="56" />
      </g>
    </svg>
  );
}



import styles from "./panda-footer.module.css";

export default function PandaFooter() {
  return (
    <svg aria-hidden className={styles.scene} viewBox="0 0 1200 380">
      <defs>
        <filter id="coast-warp" x="-8%" y="-20%" width="116%" height="150%">
          <feTurbulence type="fractalNoise" baseFrequency="0.014" numOctaves={3} seed={4} result="cn" />
          <feDisplacementMap in="SourceGraphic" in2="cn" scale={17} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <linearGradient id="pf-fade" x1="0" y1="72" x2="0" y2="160" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="pf-land" maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="380">
          <rect width="1200" height="380" fill="url(#pf-fade)" />
        </mask>
      </defs>

      <g className={styles.spark}>
        <path d="M120 44 l2.6 7.4 7.4 2.6 -7.4 2.6 -2.6 7.4 -2.6 -7.4 -7.4 -2.6 7.4 -2.6 Z" />
        <path d="M430 28 l2 5.6 5.6 2 -5.6 2 -2 5.6 -2 -5.6 -5.6 -2 5.6 -2 Z" />
        <path d="M1050 34 l2.3 6.5 6.5 2.3 -6.5 2.3 -2.3 6.5 -2.3 -6.5 -6.5 -2.3 6.5 -2.3 Z" />
        <circle cx="260" cy="76" r="2" /><circle cx="900" cy="86" r="2.2" />
      </g>

      <g mask="url(#pf-land)">
        <path className={styles.water} d="M0 118 H1200 V380 H0 Z" />
        <g filter="url(#coast-warp)">
          <path className={styles.grass} d="M330 118 L1200 86 L1200 380 L760 380 Z" />
        </g>
      </g>

      <g>
        <circle className={styles.c1} cx="430" cy="152" r="4" />
        <circle className={styles.c2} cx="530" cy="202" r="3.4" />
        <circle className={styles.c3} cx="636" cy="264" r="4.2" />
        <circle className={styles.c1} cx="712" cy="316" r="3.6" />
        <circle className={styles.c2} cx="880" cy="146" r="3.6" />
        <circle className={styles.c3} cx="1012" cy="330" r="4.2" />
        <circle className={styles.c1} cx="1082" cy="150" r="3.4" />
        <circle className={styles.c2} cx="1136" cy="258" r="4" />
        <circle className={styles.c3} cx="1170" cy="120" r="3" />
      </g>

      <g className={styles.bamboo}>
        <rect x="836" y="236" width="8" height="86" rx="3" />
        <path d="M844 248 q26 -12 40 -2 q-20 12 -40 2 Z" />
        <path d="M836 276 q-26 -12 -40 -2 q20 12 40 2 Z" />
        <rect x="874" y="268" width="7" height="60" rx="3" />
      </g>

      <g>
        <ellipse className={styles.grassDark} cx="1040" cy="206" rx="54" ry="20" />
        <ellipse className={styles.fur} cx="1012" cy="276" rx="24" ry="15" />
        <ellipse className={styles.fur} cx="1068" cy="276" rx="24" ry="15" />
        <ellipse className={styles.body} cx="1040" cy="240" rx="50" ry="46" />
        <ellipse className={styles.fur} cx="994" cy="248" rx="17" ry="26" />
        <ellipse className={styles.fur} cx="1086" cy="248" rx="17" ry="26" />
        <circle className={styles.fur} cx="1012" cy="152" r="14" />
        <circle className={styles.fur} cx="1068" cy="152" r="14" />
        <circle className={styles.body} cx="1040" cy="180" r="40" />
        <ellipse className={styles.fur} cx="1025" cy="180" rx="11" ry="14" transform="rotate(-16 1025 180)" />
        <ellipse className={styles.fur} cx="1055" cy="180" rx="11" ry="14" transform="rotate(16 1055 180)" />
        <circle className={styles.body} cx="1025" cy="179" r="4" />
        <circle className={styles.body} cx="1055" cy="179" r="4" />
        <ellipse className={styles.fur} cx="1040" cy="196" rx="7" ry="5" />
        <path className={styles.smile} d="M1040 201 q-7 8 -14 2" />
        <path className={styles.smile} d="M1040 201 q7 8 14 2" />
        <path className={styles.cap} d="M1002 152 q38 -52 78 -8 Z" />
        <rect className={styles.capBand} x="998" y="146" width="86" height="13" rx="6.5" />
        <path className={styles.capTail} d="M1068 124 q22 -16 30 -2" />
        <circle className={styles.body} cx="1102" cy="124" r="11" />
      </g>

      <g>
        <ellipse className={styles.waterDark} cx="214" cy="332" rx="128" ry="18" />
        <ellipse className={styles.tube} cx="214" cy="306" rx="116" ry="54" />
        <ellipse className={styles.water} cx="214" cy="306" rx="54" ry="22" />
        <ellipse className={styles.body} cx="236" cy="288" rx="62" ry="34" />
        <ellipse className={styles.fur} cx="292" cy="302" rx="28" ry="14" transform="rotate(10 292 302)" />
        <ellipse className={styles.fur} cx="258" cy="262" rx="31" ry="13" transform="rotate(-14 258 262)" />
        <circle className={styles.fur} cx="152" cy="256" r="11" />
        <circle className={styles.fur} cx="188" cy="250" r="11" />
        <circle className={styles.body} cx="170" cy="276" r="31" />
        <ellipse className={styles.fur} cx="159" cy="274" rx="8.5" ry="11" transform="rotate(-14 159 274)" />
        <ellipse className={styles.fur} cx="182" cy="272" rx="8.5" ry="11" transform="rotate(14 182 272)" />
        <ellipse className={styles.fur} cx="170" cy="288" rx="5.5" ry="4" />
        <path className={styles.smile} d="M170 292 q-6 6 -11 1" />
        <path className={styles.smile} d="M170 292 q6 6 11 1" />
      </g>

      <g className={styles.ripple}>
        <path d="M60 348 q18 -7 36 0" /><path d="M380 342 q18 -7 36 0" />
        <path d="M470 368 q18 -7 36 0" /><path d="M150 372 q18 -7 36 0" />
      </g>
    </svg>
  );
}
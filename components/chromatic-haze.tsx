import styles from "./chromatic-haze.module.css";

export default function ChromaticHaze() {
  return (
    <div aria-hidden className={styles.haze}>
      <span className={`${styles.pool} ${styles.lime}`} />
      <span className={`${styles.pool} ${styles.cyan}`} />
      <span className={`${styles.pool} ${styles.pink}`} />
      <span className={`${styles.pool} ${styles.red}`} />
      <svg className={styles.grain} width="100%" height="100%">
        <filter id="haze-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#haze-grain)" opacity="0.17" />
      </svg>
    </div>
  );
}
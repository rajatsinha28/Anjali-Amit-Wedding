import styles from "./PlaceholderArt.module.css";

export interface PlaceholderArtProps {
  readonly label?: string;
  readonly className?: string;
  readonly aspectRatio?: string;
}

export function PlaceholderArt({
  label = "Artwork pending",
  className = "",
  aspectRatio = "4 / 5",
}: PlaceholderArtProps) {
  return (
    <div
      className={`${styles.frame} ${className}`.trim()}
      style={{ aspectRatio }}
      aria-hidden="true"
      data-testid="placeholder-art"
    >
      <span className={styles.label}>ASSET PENDING — {label}</span>
    </div>
  );
}

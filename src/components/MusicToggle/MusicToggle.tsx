import styles from "./MusicToggle.module.css";

interface MusicToggleProps {
  readonly playing: boolean;
  readonly pulse: boolean;
  readonly onToggle: () => void;
}

export function MusicToggle({ playing, pulse, onToggle }: MusicToggleProps) {
  const label = playing ? "Music on" : "Music off";
  return (
    <button
      type="button"
      className={`${styles.toggle} ${pulse ? styles.pulse : ""}`}
      aria-label={label}
      aria-pressed={playing}
      onClick={onToggle}
    >
      <span aria-hidden="true">{playing ? "♪" : "♩"}</span>
    </button>
  );
}

import { useEffect, useRef } from "react";
import styles from "./DateReveal.module.css";

interface Point {
  x: number;
  y: number;
}

const REVEAL_THRESHOLD = 0.5;

export function ScratchCanvas({ onReveal }: { readonly onReveal: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strokes = useRef<Point[][]>([]);
  const current = useRef<Point[] | null>(null);
  const grid = useRef(new Set<string>());
  const revealed = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const drawCover = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const gradient = context.createLinearGradient(0, 0, bounds.width, bounds.height);
      gradient.addColorStop(0, "#f3dfa7");
      gradient.addColorStop(0.45, "#bd9141");
      gradient.addColorStop(0.7, "#f5e3ad");
      gradient.addColorStop(1, "#a8762d");
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);
      context.strokeStyle = "rgba(92,57,14,.72)";
      context.lineWidth = 1;
      context.strokeRect(9, 9, bounds.width - 18, bounds.height - 18);
      context.strokeRect(14, 14, bounds.width - 28, bounds.height - 28);
      context.fillStyle = "#603d18";
      context.textAlign = "center";
      context.font = `italic 26px Georgia`;
      context.fillText("Our big day", bounds.width / 2, bounds.height / 2 - 5);
      context.font = `600 13px Georgia`;
      context.fillText("Scratch here to reveal", bounds.width / 2, bounds.height / 2 + 24);
      for (const stroke of strokes.current) erase(stroke);
    };
    const erase = (points: Point[]) => {
      if (points.length === 0) return;
      const bounds = canvas.getBoundingClientRect();
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = Math.max(28, bounds.width * 0.085);
      context.beginPath();
      context.moveTo(points[0]!.x * bounds.width, points[0]!.y * bounds.height);
      for (const point of points.slice(1))
        context.lineTo(point.x * bounds.width, point.y * bounds.height);
      context.stroke();
      context.restore();
    };
    const mark = (point: Point) => {
      const columns = 28;
      const rows = 16;
      const cx = Math.floor(point.x * columns);
      const cy = Math.floor(point.y * rows);
      for (let y = cy - 1; y <= cy + 1; y += 1)
        for (let x = cx - 1; x <= cx + 1; x += 1)
          if (x >= 0 && y >= 0 && x < columns && y < rows) grid.current.add(`${x}:${y}`);
      if (!revealed.current && grid.current.size / (columns * rows) >= REVEAL_THRESHOLD) {
        revealed.current = true;
        onReveal();
      }
    };
    const pointFromEvent = (event: PointerEvent): Point => {
      const box = canvas.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
        y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)),
      };
    };
    const down = (event: PointerEvent) => {
      current.current = [pointFromEvent(event)];
      strokes.current.push(current.current);
      canvas.setPointerCapture(event.pointerId);
      mark(current.current[0]!);
    };
    const move = (event: PointerEvent) => {
      if (!current.current) return;
      const point = pointFromEvent(event);
      const previous = current.current.at(-1) ?? point;
      current.current.push(point);
      erase(current.current.slice(-2));
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot((point.x - previous.x) * 28, (point.y - previous.y) * 16) * 2),
      );
      for (let index = 1; index <= steps; index += 1) {
        const progress = index / steps;
        mark({
          x: previous.x + (point.x - previous.x) * progress,
          y: previous.y + (point.y - previous.y) * progress,
        });
      }
    };
    const up = (event: PointerEvent) => {
      current.current = null;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    };
    drawCover();
    const observer = new ResizeObserver(drawCover);
    observer.observe(canvas);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      observer.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [onReveal]);

  return (
    <canvas
      ref={ref}
      className={styles.scratchCanvas}
      aria-label="Scratch the gold to reveal the wedding date"
    />
  );
}

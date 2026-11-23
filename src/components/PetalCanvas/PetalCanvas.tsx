import { useEffect, useRef } from "react";
import { assets } from "../../config/assets";
import { prefersReducedMotion } from "../../lib/motion";
import styles from "./PetalCanvas.module.css";

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  rotation: number;
  rotationSpeed: number;
}

export function PetalCanvas({
  active,
  foreground = false,
}: {
  readonly active: boolean;
  readonly foreground?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active || prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const source = assets.petal?.fallback;
    if (!canvas || !source) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const image = new Image();
    image.decoding = "async";
    image.src = source;
    let frame = 0;
    let lastTime = performance.now();
    let visible = true;
    let particles: Petal[] = [];

    const resetParticle = (petal: Petal, above = false) => {
      petal.x = Math.random() * window.innerWidth;
      petal.y = above ? -petal.size - Math.random() * 80 : Math.random() * window.innerHeight;
      petal.size = (foreground ? 9 : 11) + Math.random() * (foreground ? 7 : 12);
      petal.speed = 18 + Math.random() * 14;
      petal.sway = 10 + Math.random() * 20;
      petal.phase = Math.random() * Math.PI * 2;
      petal.rotation = Math.random() * Math.PI * 2;
      petal.rotationSpeed = (Math.random() - 0.5) * 0.7;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = foreground ? 2 : window.innerWidth >= 768 ? 12 : 8;
      particles = Array.from({ length: count }, () => {
        const petal = {} as Petal;
        resetParticle(petal);
        return petal;
      });
    };

    const draw = (now: number) => {
      const delta = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (visible && !document.hidden && image.complete) {
        for (const petal of particles) {
          petal.y += petal.speed * delta;
          petal.phase += delta * 1.15;
          petal.rotation += petal.rotationSpeed * delta;
          if (petal.y > window.innerHeight + petal.size) resetParticle(petal, true);
          context.save();
          context.translate(petal.x + Math.sin(petal.phase) * petal.sway, petal.y);
          context.rotate(petal.rotation);
          context.drawImage(image, -petal.size / 2, -petal.size / 3, petal.size, petal.size * 0.67);
          context.restore();
        }
      }
      frame = requestAnimationFrame(draw);
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            visible = entry?.isIntersecting ?? false;
          })
        : null;
    observer?.observe(canvas);
    window.addEventListener("resize", resize, { passive: true });
    resize();
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [active, foreground]);

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.canvas} ${foreground ? styles.foreground : ""}`}
      aria-hidden="true"
    />
  );
}

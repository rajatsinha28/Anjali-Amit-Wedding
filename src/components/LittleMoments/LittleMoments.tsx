import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { assets } from "../../config/assets";
import { copy } from "../../config/copy";
import { albumSpreads, type AlbumPhoto } from "../../config/gallery";
import { loadGsap, prefersReducedMotion } from "../../lib/motion";
import { Img } from "../Img/Img";
import styles from "./LittleMoments.module.css";

type AlbumState = "closed" | "opening" | "idle" | "turning";
type TurnDirection = "forward" | "backward";
interface PendingTurn {
  readonly direction: TurnDirection;
  readonly targetIndex: number;
}

export function LittleMoments() {
  const [albumState, setAlbumState] = useState<AlbumState>("closed");
  const [index, setIndex] = useState(0);
  const [pending, setPending] = useState<PendingTurn | null>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<{ kill: () => void } | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const current = albumSpreads[index]!;
  const target = pending ? albumSpreads[pending.targetIndex]! : null;
  const open = albumState !== "closed";
  const busy = albumState === "opening" || albumState === "turning";

  useEffect(() => () => animationRef.current?.kill(), []);
  useEffect(() => {
    if (!open) return;
    for (const spread of [albumSpreads[index - 1], albumSpreads[index + 1]].filter(Boolean)) {
      for (const photo of [spread!.left, spread!.right]) {
        const src = assets[photo.assetId]?.fallback;
        if (src) new Image().src = src;
      }
    }
  }, [index, open]);

  const openAlbum = () => {
    if (albumState !== "closed") return;
    if (prefersReducedMotion()) {
      setAlbumState("idle");
      return;
    }
    setAlbumState("opening");
    requestAnimationFrame(() => {
      void loadGsap().then((gsap) => {
        if (!coverRef.current) return;
        animationRef.current = gsap
          .timeline({
            onComplete: () => {
              animationRef.current = null;
              setAlbumState("idle");
            },
          })
          .to(coverRef.current, { rotationY: -176, duration: 1.2, ease: "power2.inOut" })
          .to(coverRef.current, { opacity: 0, duration: 0.12 }, 1.04);
      });
    });
  };

  const turnTo = (targetIndex: number) => {
    if (albumState !== "idle" || targetIndex < 0 || targetIndex >= albumSpreads.length) return;
    const direction: TurnDirection = targetIndex > index ? "forward" : "backward";
    if (prefersReducedMotion()) {
      setIndex(targetIndex);
      return;
    }
    setPending({ direction, targetIndex });
    setAlbumState("turning");
    requestAnimationFrame(() => {
      void loadGsap().then((gsap) => {
        if (!sheetRef.current) return;
        const timeline = gsap.timeline({
          onComplete: () => {
            setIndex(targetIndex);
            setPending(null);
            setAlbumState("idle");
            animationRef.current = null;
          },
        });
        animationRef.current = timeline;
        timeline
          .fromTo(
            sheetRef.current,
            { rotationY: 0, z: 1 },
            {
              rotationY: direction === "forward" ? -180 : 180,
              z: 1,
              duration: 0.95,
              ease: "power2.inOut",
            },
          )
          .fromTo(
            shadowRef.current,
            { opacity: 0, scaleX: 0.35 },
            { opacity: 0.72, scaleX: 1, duration: 0.44, ease: "power2.in" },
            0.04,
          )
          .to(
            shadowRef.current,
            { opacity: 0, scaleX: 0.4, duration: 0.44, ease: "power2.out" },
            0.48,
          )
          .fromTo(
            sheetRef.current.querySelector("[data-paper-highlight]"),
            { opacity: 0.08 },
            { opacity: 0.58, duration: 0.42, yoyo: true, repeat: 1 },
            0.08,
          );
      });
    });
  };

  const restart = () => {
    if (albumState !== "idle" || index !== albumSpreads.length - 1) return;
    if (prefersReducedMotion() || !pagesRef.current) {
      setIndex(0);
      return;
    }
    setAlbumState("turning");
    void loadGsap().then((gsap) => {
      if (!pagesRef.current) return;
      animationRef.current = gsap
        .timeline({
          onComplete: () => {
            setAlbumState("idle");
            animationRef.current = null;
          },
        })
        .to(pagesRef.current, { opacity: 0, duration: 0.16, onComplete: () => setIndex(0) })
        .to(pagesRef.current, { opacity: 1, duration: 0.22 });
    });
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (albumState === "idle") {
      swipeStart.current = { x: event.clientX, y: event.clientY };
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Synthetic pointer events used by browser automation do not own an active pointer.
      }
    }
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (!start || albumState !== "idle") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 42 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0 && index < albumSpreads.length - 1) turnTo(index + 1);
    if (dx > 0 && index > 0) turnTo(index - 1);
  };

  const visibleLeft = pending?.direction === "backward" && target ? target.left : current.left;
  const visibleRight = pending?.direction === "forward" && target ? target.right : current.right;
  const sheetFront = pending?.direction === "forward" ? current.right : current.left;
  const sheetBack = pending?.direction === "forward" ? target?.left : target?.right;

  return (
    <section
      className={styles.section}
      aria-labelledby="moments-heading"
      data-testid="little-moments"
    >
      <h2 id="moments-heading">{copy.album.heading}</h2>
      <p className={styles.subtitle}>{copy.album.subtitle}</p>
      <div
        className={styles.stage}
        data-testid="album-stage"
        data-album-state={albumState}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (swipeStart.current = null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" && index < albumSpreads.length - 1) turnTo(index + 1);
          if (event.key === "ArrowLeft" && index > 0) turnTo(index - 1);
        }}
        tabIndex={open ? 0 : -1}
        aria-label={
          open ? `Photo album spread ${index + 1} of ${albumSpreads.length}` : "Closed photo album"
        }
      >
        <div className={styles.book} data-testid={open ? "album-open" : "album-closed"}>
          <div className={styles.paperEdges} aria-hidden="true" />
          <div className={styles.pages} ref={pagesRef}>
            <PhotoLeaf photo={visibleLeft} side="left" />
            <PhotoLeaf photo={visibleRight} side="right" />
          </div>
          {pending && target && sheetBack ? (
            <div
              ref={sheetRef}
              className={`${styles.turningSheet} ${pending.direction === "forward" ? styles.forward : styles.backward}`}
              data-testid="turning-sheet"
              aria-hidden="true"
            >
              <div className={`${styles.sheetFace} ${styles.sheetFront}`}>
                <PhotoLeaf
                  photo={sheetFront}
                  side={pending.direction === "forward" ? "right" : "left"}
                  decorative
                />
              </div>
              <div className={`${styles.sheetFace} ${styles.sheetBack}`}>
                <PhotoLeaf
                  photo={sheetBack}
                  side={pending.direction === "forward" ? "left" : "right"}
                  decorative
                />
              </div>
              <div className={styles.paperHighlight} data-paper-highlight />
            </div>
          ) : null}
          <div ref={shadowRef} className={styles.movingShadow} aria-hidden="true" />
          {albumState === "closed" || albumState === "opening" ? (
            <div ref={coverRef} className={styles.cover} data-testid="album-cover">
              <span className={styles.coverTexture} aria-hidden="true" />
              <span className={`${styles.coverFlourish} ${styles.flourishTop}`} aria-hidden="true">
                <i />
                <b>◆</b>
                <i />
              </span>
              <span className={styles.crest} aria-label="Anjali and Amit monogram">
                <span className={styles.crestHalo} aria-hidden="true" />
                <span className={styles.crestRing} aria-hidden="true" />
                <span className={styles.monogram} aria-hidden="true">
                  <b>A</b>
                  <i>&amp;</i>
                  <b>A</b>
                </span>
              </span>
              <strong className={styles.wordmark} data-testid="album-cover-wordmark">
                LOVIT
              </strong>
              <span className={styles.coverDivider} aria-hidden="true">
                <i />
              </span>
              <small className={styles.coverDate}>10 · 12 · 2026</small>
              <span
                className={`${styles.coverFlourish} ${styles.flourishBottom}`}
                aria-hidden="true"
              >
                <i />
                <b>◆</b>
                <i />
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles.controlDock}>
        {!open ? (
          <button type="button" className={styles.openButton} onClick={openAlbum}>
            {copy.album.open}
          </button>
        ) : (
          <div className={styles.controls}>
            <button type="button" onClick={() => turnTo(index - 1)} disabled={index === 0 || busy}>
              {copy.album.previous}
            </button>
            <span aria-live="polite">
              {index + 1} / {albumSpreads.length}
            </span>
            <button
              type="button"
              onClick={() => (index === albumSpreads.length - 1 ? restart() : turnTo(index + 1))}
              disabled={busy}
            >
              {index === albumSpreads.length - 1 ? copy.album.restart : copy.album.next}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function PhotoLeaf({
  photo,
  side,
  decorative = false,
}: {
  readonly photo: AlbumPhoto;
  readonly side: "left" | "right";
  readonly decorative?: boolean;
}) {
  const focal = photo.focalPosition;
  return (
    <article className={`${styles.leaf} ${styles[side]}`} data-photo-slot={photo.id}>
      <span className={styles.corner} aria-hidden="true" />
      <div
        className={styles.photoMount}
        style={{ transform: `translateY(-3%) rotate(${photo.rotation}deg)` }}
      >
        <Img
          asset={assets[photo.assetId] ?? null}
          fallbackLabel={photo.assetId}
          alt={decorative ? "" : photo.alt}
          sizes="(max-width: 767px) 42vw, 330px"
          style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
        />
      </div>
    </article>
  );
}

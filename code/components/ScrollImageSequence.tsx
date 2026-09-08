"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import ScrollCue from "@/components/ScrollCue";

type ScrollImageSequenceProps = {
  src: string;
  title: string;
  subtitle: string;
  align?: "left" | "right";
};

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

/**
 * Scroll-scrubbed frame sequence decoded from a single animated AVIF via the
 * WebCodecs ImageDecoder API (Chromium only — see liquid-glass.md ยง4 on
 * Chromium-only techniques). Falls back to the AVIF playing as a normal
 * autoplaying image, with a static (non scroll-linked) text reveal.
 */
export default function ScrollImageSequence({
  src,
  title,
  subtitle,
  align = "right",
}: ScrollImageSequenceProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function detectSupport() {
      if (typeof window === "undefined" || !("ImageDecoder" in window)) {
        if (!cancelled) setSupported(false);
        return;
      }
      try {
        const ok = await window.ImageDecoder.isTypeSupported("image/avif");
        if (!cancelled) setSupported(ok);
      } catch {
        if (!cancelled) setSupported(false);
      }
    }

    void detectSupport();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!supported || reducedMotion) return;

    let cancelled = false;
    let decoder: ImageDecoder | null = null;
    let currentFrame = -1;
    let pendingFrame: number | null = null;
    let decoding = false;
    let trigger: ScrollTrigger | null = null;

    async function decodeFrame(index: number) {
      if (!decoder) return;
      if (decoding) {
        pendingFrame = index;
        return;
      }
      if (index === currentFrame) return;
      decoding = true;
      try {
        const result = await decoder.decode({ frameIndex: index });
        if (cancelled) {
          result.image.close();
          return;
        }
        const canvas = canvasRef.current;
        if (canvas) {
          if (canvas.width !== result.image.displayWidth) {
            canvas.width = result.image.displayWidth;
          }
          if (canvas.height !== result.image.displayHeight) {
            canvas.height = result.image.displayHeight;
          }
          canvas.getContext("2d")?.drawImage(result.image, 0, 0);
        }
        result.image.close();
        currentFrame = index;
      } catch {
        // decode aborted or out of range — safe to ignore
      } finally {
        decoding = false;
        if (pendingFrame !== null) {
          const next = pendingFrame;
          pendingFrame = null;
          void decodeFrame(next);
        }
      }
    }

    void (async () => {
      const response = await fetch(src);
      const buffer = await response.arrayBuffer();
      if (cancelled) return;

      decoder = new window.ImageDecoder({ data: buffer, type: "image/avif" });
      await decoder.tracks.ready;
      if (cancelled || !pinRef.current) return;

      const frameCount = decoder.tracks.selectedTrack?.frameCount ?? 1;
      await decodeFrame(0);

      trigger = ScrollTrigger.create({
        trigger: pinRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 0.4,
        pin: true,
        pinType: "fixed",
        onUpdate: (self) => {
          const idx = Math.min(
            frameCount - 1,
            Math.round(self.progress * (frameCount - 1))
          );
          void decodeFrame(idx);

          if (textRef.current) {
            const reveal = clamp01((self.progress - 0.6) / 0.32);
            textRef.current.style.opacity = String(reveal);
            textRef.current.style.transform = `translateY(${(1 - reveal) * 24}px)`;
          }
          if (pinRef.current) {
            const fade = 1 - clamp01((self.progress - 0.88) / 0.12) * 0.4;
            pinRef.current.style.opacity = String(fade);
          }
        },
      });

      // Each ScrollImageSequence pins itself only once its frames finish
      // decoding, asynchronously and in no guaranteed order. A pin created
      // later inserts a spacer that shifts the document position of every
      // trigger below it, so every existing trigger's own start/end must be
      // recomputed — not just this one. ScrollTrigger.refresh() (the static,
      // batched version) can no-op if a refresh is already in flight from a
      // sibling instance resolving around the same time, so refresh each
      // live instance directly instead.
      ScrollTrigger.getAll().forEach((instance) => instance.refresh());
    })();

    return () => {
      cancelled = true;
      trigger?.kill();
      decoder?.close();
    };
  }, [supported, src, reducedMotion]);

  const useCanvas = supported && !reducedMotion;

  return (
    <section className="relative">
      {useCanvas ? (
        <div
          ref={pinRef}
          className="relative flex h-screen items-center overflow-hidden px-6 sm:px-16"
        >
          <div
            className={`flex w-full flex-col items-center gap-10 sm:gap-16 ${
              align === "left" ? "sm:flex-row-reverse" : "sm:flex-row"
            }`}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[68vh] w-full max-w-2xl rounded-[28px] object-contain sm:w-1/2"
            />
            <div
              ref={textRef}
              className="w-full max-w-md opacity-0 sm:w-1/2"
              style={{ transform: "translateY(24px)" }}
            >
              <p className="font-display text-4xl tracking-tight sm:text-5xl">
                {title}
              </p>
              <p className="mt-4 font-body text-noah-ink-dim sm:text-lg">
                {subtitle}
              </p>
            </div>
          </div>
          <ScrollCue />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10 px-6 py-28 sm:flex-row sm:gap-16 sm:px-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="w-full max-w-2xl rounded-[28px] sm:w-1/2"
          />
          <div className="w-full max-w-md sm:w-1/2">
            <p className="font-display text-4xl tracking-tight sm:text-5xl">
              {title}
            </p>
            <p className="mt-4 font-body text-noah-ink-dim sm:text-lg">
              {subtitle}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

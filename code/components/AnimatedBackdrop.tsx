"use client";

import { useEffect, useRef } from "react";

type AnimatedBackdropProps = {
  poster: string;
  motion: string;
  animate: boolean;
  alt: string;
  className?: string;
  onReady?: () => void;
};

/**
 * Static JPG underneath. Motion plays only when asked, and only as a video
 * so the GPU decodes it. An animated image on top of a full-bleed shelf
 * stays on the CPU for as long as the page is open.
 */
export default function AnimatedBackdrop({
  poster,
  motion,
  animate,
  alt,
  className = "absolute inset-0 h-full w-full object-cover",
  onReady,
}: AnimatedBackdropProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = /\.(mp4|webm)$/i.test(motion);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    function onVis() {
      const node = videoRef.current;
      if (!node) return;
      if (document.hidden) node.pause();
      else void node.play();
    }

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [animate, motion]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={alt}
        aria-hidden
        decoding="async"
        className={className}
        onLoad={onReady}
        onError={onReady}
      />
      {animate && video ? (
        <video
          ref={videoRef}
          src={motion}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          disablePictureInPicture
          aria-hidden
          className={className}
        />
      ) : null}
      {animate && !video ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={motion}
          alt={alt}
          aria-hidden
          decoding="async"
          className={className}
        />
      ) : null}
    </>
  );
}

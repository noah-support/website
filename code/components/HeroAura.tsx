"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Aura, type AgentState } from "@/components/Aura";

const AUDIO_SRC = "/noah-opening-message.mp3";

type HeroAuraProps = {
  /** Flips true once the reader has opened the page. */
  speak: boolean;
};

/**
 * The interview aura, dead centre in the hero. On the reader's first click
 * it plays Noah's opening message and drives the aura from the actual
 * output waveform, so the shape moves with the voice rather than on a
 * timer.
 */
export default function HeroAura({ speak }: HeroAuraProps) {
  const [state, setState] = useState<AgentState>("connecting");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const startedRef = useRef(false);

  const getOutputVolume = useCallback(() => {
    const analyser = analyserRef.current;
    const data = dataRef.current;
    if (!analyser || !data) return 0;
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i += 1) {
      const v = ((data[i] ?? 128) - 128) / 128;
      sum += v * v;
    }
    // RMS, lifted so speech at normal levels reads as a strong signal
    // rather than a barely-there wobble.
    return Math.min(1, Math.sqrt(sum / data.length) * 3.2);
  }, []);

  useEffect(() => {
    if (!speak || startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;

    async function start() {
      const audio = new Audio(AUDIO_SRC);
      audio.preload = "auto";
      audioRef.current = audio;

      try {
        const Ctor =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (Ctor) {
          const ctx = new Ctor();
          const source = ctx.createMediaElementSource(audio);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 1024;
          source.connect(analyser);
          analyser.connect(ctx.destination);
          ctxRef.current = ctx;
          analyserRef.current = analyser;
          dataRef.current = new Uint8Array(new ArrayBuffer(analyser.fftSize));
          await ctx.resume();
        }
      } catch {
        // No Web Audio — playback still works, the aura just idles.
      }

      audio.addEventListener("ended", () => {
        if (!cancelled) setState("listening");
      });

      try {
        await audio.play();
        if (!cancelled) setState("talking");
      } catch {
        // Autoplay refused (e.g. the reader scrolled past instead of
        // clicking, so there's no gesture to spend).
        if (!cancelled) setState("listening");
      }
    }

    void start();
    return () => {
      cancelled = true;
    };
  }, [speak]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      void ctxRef.current?.close();
    };
  }, []);

  return (
    <div className="pointer-events-none relative mx-auto lg:absolute lg:left-1/2 lg:top-1/2 lg:z-[5] lg:-translate-x-1/2 lg:-translate-y-1/2">
      <Aura
        agentState={state}
        getOutputVolume={getOutputVolume}
        className="h-[min(72vw,17rem)] w-[min(72vw,17rem)] lg:h-[min(92vw,86vh)] lg:w-[min(92vw,86vh)]"
      />
    </div>
  );
}

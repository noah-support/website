"use client";

/**
 * Shader-based agent aura — the same one used in the Noah interview.
 * Visual language ported from the Unicorn Studio / LiveKit agents-ui aura
 * (Polyform Non-Resale 1.0.0, © 2026 UNCRN LLC), with a duotone ramp and a
 * raw WebGL1 renderer. Volume is supplied by the caller.
 */

import { useEffect, useRef } from "react";

export type AgentState =
  | null
  | "connecting"
  | "thinking"
  | "listening"
  | "talking";

type AuraProps = {
  agentState?: AgentState;
  getInputVolume?: () => number;
  getOutputVolume?: () => number;
  className?: string;
};

type ShaderState = "connecting" | "listening" | "thinking" | "speaking";

type ParamSet = {
  speed: number;
  amplitude: number;
  frequency: number;
  scale: number;
  brightness: number;
};

const COLOR_A = "#2e2d8b";
const COLOR_B = "#eb5c1c";

const STATES: Record<ShaderState, ParamSet> = {
  connecting: {
    speed: 0.28,
    amplitude: 0.26,
    frequency: 0.26,
    scale: 0.15,
    brightness: 0.45,
  },
  listening: {
    speed: 0.4,
    amplitude: 0.38,
    frequency: 0.28,
    scale: 0.2,
    brightness: 0.85,
  },
  thinking: {
    speed: 0.55,
    amplitude: 0.62,
    frequency: 0.36,
    scale: 0.12,
    brightness: 0.95,
  },
  speaking: {
    speed: 0.6,
    amplitude: 0.66,
    frequency: 0.36,
    scale: 0.21,
    brightness: 0.95,
  },
};

const AUTO_KEYS: (keyof ParamSet)[] = [
  "speed",
  "amplitude",
  "frequency",
  "scale",
  "brightness",
];

const UNIFORM_NAMES = [
  "iResolution",
  "iTime",
  "uSpeed",
  "uBlur",
  "uScale",
  "uShape",
  "uFrequency",
  "uAmplitude",
  "uBloom",
  "uMix",
  "uSpacing",
  "uVariance",
  "uSmoothing",
  "uMode",
  "uColorShift",
  "uDuotone",
  "uColorA",
  "uColorB",
] as const;

const VS = `attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FS = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3  iResolution;
uniform float iTime;

uniform float uSpeed;
uniform float uBlur;
uniform float uScale;
uniform float uShape;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uBloom;
uniform float uMix;
uniform float uSpacing;
uniform float uVariance;
uniform float uSmoothing;
uniform float uMode;
uniform float uColorShift;
uniform float uDuotone;
uniform vec3  uColorA;
uniform vec3  uColorB;

const float TAU = 6.283185;
const float ITERATIONS = 36.0;

vec2 randFibo(vec2 p){
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.xx + p.yx) * p.xy);
}

vec3 Tonemap(vec3 x){ x *= 4.0; return x / (1.0 + x); }

float luma(vec3 c){ return dot(c, vec3(0.299, 0.587, 0.114)); }

vec3 rgb2hsv(vec3 c){
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float sdCircle(vec2 st, float r){ return length(st) - r; }
float sdLine(vec2 p, float r){
  float halfLen = r * 2.0;
  vec2 a = vec2(-halfLen, 0.0), b = vec2(halfLen, 0.0);
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}
float getSdf(vec2 st){
  if(uShape == 2.0) return sdLine(st, uScale);
  return sdCircle(st, uScale);
}

vec2 turb(vec2 pos, float t, float it){
  mat2 rotation      = mat2(0.6, -0.25, 0.25, 0.9);
  mat2 layerRotation = mat2(0.6, -0.8,  0.8,  0.6);

  float frequency = mix(2.0, 15.0, uFrequency);
  float amplitude = uAmplitude;
  float frequencyGrowth = 1.4;
  float animTime = t * 0.2 * uSpeed;

  for(int i = 0; i < 4; i++){
    vec2 rotatedPos = pos * rotation;
    vec2 wave = sin(frequency * rotatedPos + float(i) * animTime + it);
    pos += (amplitude / frequency) * rotation[0] * wave;
    rotation *= layerRotation;
    amplitude *= mix(1.0, max(wave.x, wave.y), uVariance);
    frequency *= frequencyGrowth;
  }
  return pos;
}

void main(){
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / iResolution.xy;

  vec3 pp = vec3(0.0);
  vec3 bloom = vec3(0.0);
  float t = iTime * 0.5;

  vec2 pos = uv - 0.5;
  pos.x *= iResolution.x / iResolution.y;

  vec2 prevPos = turb(pos, t, 0.0 - 1.0 / ITERATIONS);
  float spacing = mix(1.0, TAU, uSpacing);

  for(int i = 1; i <= 36; i++){
    float iter = float(i) / ITERATIONS;

    vec2 st = turb(pos, t, iter * spacing);
    float d  = abs(getSdf(st));
    float pd = distance(st, prevPos);
    prevPos = st;

    float dynamicBlur = exp2(pd * 2.0 * 1.4426950408889634) - 1.0;
    float ds = smoothstep(0.0, uBlur * 0.05 + max(dynamicBlur * uSmoothing, 0.001), d);

    vec3 color = mix(uColorA, uColorB, clamp(pow(1.0 - iter, 1.4) * uDuotone * 1.35, 0.0, 1.0));
    if(uColorShift > 0.01){
      vec3 hsv = rgb2hsv(color);
      hsv.x = fract(hsv.x + (1.0 - iter) * uColorShift * 0.3);
      color = hsv2rgb(hsv);
    }

    float invd = 1.0 / max(d + dynamicBlur, 0.001);
    pp    += (ds - 1.0) * color;
    bloom += clamp(invd, 0.0, 250.0) * color;
  }

  pp *= 1.0 / ITERATIONS;
  vec3 color;

  if(uMode < 0.5){
    bloom = bloom / (bloom + 2e4);
    color = (-pp + bloom * 3.0 * uBloom) * 1.2;
    color += (randFibo(fragCoord).x - 0.5) / 255.0;
    color = Tonemap(color);
    float alpha = luma(color) * uMix;
    gl_FragColor = vec4(color * uMix, alpha);
  } else {
    color = -pp;
    color += (randFibo(fragCoord).x - 0.5) / 255.0;
    float brightness = length(color);
    vec3 direction = brightness > 0.0 ? color / brightness : color;
    float factor = 2.0;
    float mappedBrightness = (brightness * factor) / (1.0 + brightness * factor);
    color = direction * mappedBrightness;
    float gray = dot(color, vec3(0.2, 0.5, 0.1));
    color = mix(vec3(gray), color, 3.0);
    color = clamp(color, 0.0, 1.0);
    float alpha = mappedBrightness * clamp(uMix, 1.0, 2.0);
    gl_FragColor = vec4(color, alpha);
  }
}`;

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) return [0, 0.7, 1];
  return [1, 2, 3].map((i) => parseInt(m[i]!, 16) / 255) as [
    number,
    number,
    number,
  ];
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function safeVolume(fn?: () => number) {
  try {
    return clamp01(fn?.() ?? 0);
  } catch {
    return 0;
  }
}

function toShaderState(state: AgentState): ShaderState {
  if (state === "talking") return "speaking";
  if (state === "listening") return "listening";
  if (state === "thinking") return "thinking";
  return "connecting";
}

function targetsFor(state: ShaderState, vol: number): ParamSet {
  const s = { ...STATES[state] };
  if (state === "speaking") {
    // Clearly voice-driven without thrashing — the shape should breathe
    // with the speech, not fight it.
    s.speed += vol * 0.55;
    s.amplitude += vol * 0.95;
    s.frequency += vol * 0.17;
    s.scale += vol * 0.12;
    s.brightness += vol * 0.68;
  } else if (state === "listening") {
    s.amplitude += vol * 0.12;
    s.brightness += vol * 0.15;
  }
  return s;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Failed to create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const kind = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
    const log = gl.getShaderInfoLog(shader)?.trim();
    gl.deleteShader(shader);
    throw new Error(
      log ? `${kind} shader: ${log}` : `${kind} shader compile failed`
    );
  }
  return shader;
}

function isDarkTheme() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
  );
}

export function Aura({
  agentState = "connecting",
  getInputVolume,
  getOutputVolume,
  className = "",
}: AuraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const agentStateRef = useRef(agentState);
  const getInputVolumeRef = useRef(getInputVolume);
  const getOutputVolumeRef = useRef(getOutputVolume);

  // Kept in refs so the render loop below always reads the current props
  // without having to be torn down and rebuilt when they change.
  useEffect(() => {
    agentStateRef.current = agentState;
    getInputVolumeRef.current = getInputVolume;
    getOutputVolumeRef.current = getOutputVolume;
  }, [agentState, getInputVolume, getOutputVolume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
    });
    if (!gl || gl.isContextLost()) return;

    let program: WebGLProgram | null = null;
    let buf: WebGLBuffer | null = null;
    let raf = 0;
    let running = true;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    try {
      program = gl.createProgram();
      if (!program) throw new Error("Failed to create program");
      const vs = compile(gl, gl.VERTEX_SHADER, VS);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Program link failed");
      }
      gl.useProgram(program);

      buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    } catch (err) {
      console.error("Aura shader failed to initialize", err);
      return;
    }

    const U: Record<
      (typeof UNIFORM_NAMES)[number],
      WebGLUniformLocation | null
    > = {} as Record<
      (typeof UNIFORM_NAMES)[number],
      WebGLUniformLocation | null
    >;
    for (const name of UNIFORM_NAMES) {
      U[name] = gl.getUniformLocation(program, name);
    }

    const colorA = hexToRgb(COLOR_A);
    const colorB = hexToRgb(COLOR_B);
    const params: ParamSet = { ...STATES.listening };
    let vol = 0;
    let clock = 0;
    let last = performance.now();
    let fpsAcc = 0;
    let fpsN = 0;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const ease = (a: number, b: number, k: number) =>
      a + (b - a) * Math.min(1, k);

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) clock += dt;

      const shaderState = toShaderState(agentStateRef.current);
      const output = safeVolume(getOutputVolumeRef.current);
      const input = safeVolume(getInputVolumeRef.current);
      const volTarget =
        shaderState === "speaking"
          ? output
          : shaderState === "listening"
            ? input
            : 0;
      // Faster attack than release, so syllables read individually instead
      // of smearing into an average — but not so fast that it jitters.
      vol = ease(vol, volTarget, dt * (volTarget > vol ? 14 : 6));

      const tgt = targetsFor(shaderState, vol);
      // While speaking, track the targets more closely — the slow easing
      // used for state changes would flatten the voice out entirely.
      const follow = shaderState === "speaking" ? 5.5 : 1.6;
      for (const key of AUTO_KEYS) {
        params[key] = ease(params[key], tgt[key], dt * follow);
      }

      const mode = isDarkTheme() ? 0 : 1;
      gl.uniform3f(U.iResolution, canvas.width, canvas.height, 1);
      gl.uniform1f(U.iTime, clock);
      gl.uniform1f(U.uSpeed, params.speed);
      gl.uniform1f(U.uAmplitude, params.amplitude);
      gl.uniform1f(U.uFrequency, params.frequency);
      gl.uniform1f(U.uScale, params.scale);
      gl.uniform1f(U.uMix, params.brightness);
      gl.uniform1f(U.uBlur, 0.2);
      gl.uniform1f(U.uDuotone, 0.6);
      gl.uniform1f(U.uBloom, 0.55);
      gl.uniform1f(U.uSpacing, 0.5);
      gl.uniform1f(U.uShape, 1);
      gl.uniform1f(U.uVariance, 0.1);
      gl.uniform1f(U.uSmoothing, 1.0);
      gl.uniform1f(U.uColorShift, 0.04);
      gl.uniform1f(U.uMode, mode);
      gl.uniform3fv(U.uColorA, colorA);
      gl.uniform3fv(U.uColorB, colorB);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      fpsAcc += dt;
      fpsN += 1;
      if (fpsAcc > 0.5) {
        const fps = Math.round(fpsN / fpsAcc);
        if (fps < 32 && dpr > 1) {
          dpr = 1;
          resize();
        }
        fpsAcc = 0;
        fpsN = 0;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame((now) => {
      last = now;
      frame(now);
    });

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      if (buf) gl.deleteBuffer(buf);
      if (program) gl.deleteProgram(program);
    };
  }, []);

  return (
    <div className={`relative ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="aura-canvas block h-full w-full" />
    </div>
  );
}

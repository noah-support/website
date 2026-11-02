(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/Aura.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Aura",
    ()=>Aura
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Shader-based agent aura — the same one used in the Noah interview.
 * Visual language ported from the Unicorn Studio / LiveKit agents-ui aura
 * (Polyform Non-Resale 1.0.0, © 2026 UNCRN LLC), with a duotone ramp and a
 * raw WebGL1 renderer. Volume is supplied by the caller.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const COLOR_A = "#2e2d8b";
const COLOR_B = "#eb5c1c";
const STATES = {
    connecting: {
        speed: 0.28,
        amplitude: 0.26,
        frequency: 0.26,
        scale: 0.15,
        brightness: 0.45
    },
    listening: {
        speed: 0.4,
        amplitude: 0.38,
        frequency: 0.28,
        scale: 0.2,
        brightness: 0.85
    },
    thinking: {
        speed: 0.55,
        amplitude: 0.62,
        frequency: 0.36,
        scale: 0.12,
        brightness: 0.95
    },
    speaking: {
        speed: 0.6,
        amplitude: 0.66,
        frequency: 0.36,
        scale: 0.21,
        brightness: 0.95
    }
};
const AUTO_KEYS = [
    "speed",
    "amplitude",
    "frequency",
    "scale",
    "brightness"
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
    "uColorB"
];
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
function hexToRgb(hex) {
    const m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
    if (!m) return [
        0,
        0.7,
        1
    ];
    return [
        1,
        2,
        3
    ].map((i)=>parseInt(m[i], 16) / 255);
}
function clamp01(n) {
    if (!Number.isFinite(n)) return 0;
    return Math.min(1, Math.max(0, n));
}
function safeVolume(fn) {
    try {
        return clamp01(fn?.() ?? 0);
    } catch  {
        return 0;
    }
}
function toShaderState(state) {
    if (state === "talking") return "speaking";
    if (state === "listening") return "listening";
    if (state === "thinking") return "thinking";
    return "connecting";
}
function targetsFor(state, vol) {
    const s = {
        ...STATES[state]
    };
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
function compile(gl, type, src) {
    const shader = gl.createShader(type);
    if (!shader) throw new Error("Failed to create shader");
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const kind = type === gl.VERTEX_SHADER ? "vertex" : "fragment";
        const log = gl.getShaderInfoLog(shader)?.trim();
        gl.deleteShader(shader);
        throw new Error(log ? `${kind} shader: ${log}` : `${kind} shader compile failed`);
    }
    return shader;
}
function isDarkTheme() {
    return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
}
function Aura({ agentState = "connecting", getInputVolume, getOutputVolume, className = "" }) {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const agentStateRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(agentState);
    const getInputVolumeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(getInputVolume);
    const getOutputVolumeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(getOutputVolume);
    // Kept in refs so the render loop below always reads the current props
    // without having to be torn down and rebuilt when they change.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Aura.useEffect": ()=>{
            agentStateRef.current = agentState;
            getInputVolumeRef.current = getInputVolume;
            getOutputVolumeRef.current = getOutputVolume;
        }
    }["Aura.useEffect"], [
        agentState,
        getInputVolume,
        getOutputVolume
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Aura.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const gl = canvas.getContext("webgl", {
                alpha: true,
                premultipliedAlpha: false,
                antialias: false,
                depth: false,
                powerPreference: "high-performance"
            });
            if (!gl || gl.isContextLost()) return;
            let program = null;
            let buf = null;
            let raf = 0;
            let running = true;
            let dpr = Math.min(window.devicePixelRatio || 1, 2);
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    -1,
                    -1,
                    3,
                    -1,
                    -1,
                    3
                ]), gl.STATIC_DRAW);
                const aPos = gl.getAttribLocation(program, "aPos");
                gl.enableVertexAttribArray(aPos);
                gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
            } catch (err) {
                console.error("Aura shader failed to initialize", err);
                return;
            }
            const U = {};
            for (const name of UNIFORM_NAMES){
                U[name] = gl.getUniformLocation(program, name);
            }
            const colorA = hexToRgb(COLOR_A);
            const colorB = hexToRgb(COLOR_B);
            const params = {
                ...STATES.listening
            };
            let vol = 0;
            let clock = 0;
            let last = performance.now();
            let fpsAcc = 0;
            let fpsN = 0;
            const resize = {
                "Aura.useEffect.resize": ()=>{
                    const r = canvas.getBoundingClientRect();
                    const w = Math.max(1, Math.round(r.width * dpr));
                    const h = Math.max(1, Math.round(r.height * dpr));
                    if (canvas.width !== w || canvas.height !== h) {
                        canvas.width = w;
                        canvas.height = h;
                        gl.viewport(0, 0, w, h);
                    }
                }
            }["Aura.useEffect.resize"];
            const observer = new ResizeObserver(resize);
            observer.observe(canvas);
            resize();
            const ease = {
                "Aura.useEffect.ease": (a, b, k)=>a + (b - a) * Math.min(1, k)
            }["Aura.useEffect.ease"];
            const frame = {
                "Aura.useEffect.frame": (now)=>{
                    if (!running) return;
                    const dt = Math.min(0.05, (now - last) / 1000);
                    last = now;
                    if (!reduced) clock += dt;
                    const shaderState = toShaderState(agentStateRef.current);
                    const output = safeVolume(getOutputVolumeRef.current);
                    const input = safeVolume(getInputVolumeRef.current);
                    const volTarget = shaderState === "speaking" ? output : shaderState === "listening" ? input : 0;
                    // Faster attack than release, so syllables read individually instead
                    // of smearing into an average — but not so fast that it jitters.
                    vol = ease(vol, volTarget, dt * (volTarget > vol ? 14 : 6));
                    const tgt = targetsFor(shaderState, vol);
                    // While speaking, track the targets more closely — the slow easing
                    // used for state changes would flatten the voice out entirely.
                    const follow = shaderState === "speaking" ? 5.5 : 1.6;
                    for (const key of AUTO_KEYS){
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
                }
            }["Aura.useEffect.frame"];
            raf = requestAnimationFrame({
                "Aura.useEffect": (now)=>{
                    last = now;
                    frame(now);
                }
            }["Aura.useEffect"]);
            return ({
                "Aura.useEffect": ()=>{
                    running = false;
                    cancelAnimationFrame(raf);
                    observer.disconnect();
                    if (buf) gl.deleteBuffer(buf);
                    if (program) gl.deleteProgram(program);
                }
            })["Aura.useEffect"];
        }
    }["Aura.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative ${className}`,
        "aria-hidden": true,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            className: "aura-canvas block h-full w-full"
        }, void 0, false, {
            fileName: "[project]/components/Aura.tsx",
            lineNumber: 512,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/Aura.tsx",
        lineNumber: 511,
        columnNumber: 5
    }, this);
}
_s(Aura, "zIfF4BwJh4TbID+Aa+XoesGtkPA=");
_c = Aura;
var _c;
__turbopack_context__.k.register(_c, "Aura");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/GlassPane.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlassPane
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function GlassPane({ children, className = "", as = "div", tilt = false, onClick, style }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    function handlePointerMove(event) {
        if (!tilt || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        ref.current.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
        ref.current.style.setProperty("--tilt-y", `${(px * 10).toFixed(2)}deg`);
        ref.current.style.setProperty("--glow-x", `${(px * 0.5 + 0.5) * 100}%`);
        ref.current.style.setProperty("--glow-y", `${(py * 0.5 + 0.5) * 100}%`);
    }
    function handlePointerLeave() {
        if (!tilt || !ref.current) return;
        ref.current.style.setProperty("--tilt-x", "0deg");
        ref.current.style.setProperty("--tilt-y", "0deg");
    }
    const Comp = as;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        ref: ref,
        onClick: onClick,
        onPointerMove: handlePointerMove,
        onPointerLeave: handlePointerLeave,
        className: `glass ${tilt ? "glass-tilt" : ""} ${className}`,
        style: style,
        children: [
            tilt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "glass-glow",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/components/GlassPane.tsx",
                lineNumber: 57,
                columnNumber: 16
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/components/GlassPane.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(GlassPane, "QMBuJFIdzLIeqBcFwhMf246mjOM=");
_c = GlassPane;
var _c;
__turbopack_context__.k.register(_c, "GlassPane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HeroAura.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroAura
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Aura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Aura.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const AUDIO_SRC = "/noah-opening-message.mp3";
function HeroAura({ speak = false }) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("listening");
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ctxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const analyserRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const dataRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const startedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const getOutputVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "HeroAura.useCallback[getOutputVolume]": ()=>{
            const analyser = analyserRef.current;
            const data = dataRef.current;
            if (!analyser || !data) return 0;
            analyser.getByteTimeDomainData(data);
            let sum = 0;
            for(let i = 0; i < data.length; i += 1){
                const v = ((data[i] ?? 128) - 128) / 128;
                sum += v * v;
            }
            // RMS, lifted so speech at normal levels reads as a strong signal
            // rather than a barely-there wobble.
            return Math.min(1, Math.sqrt(sum / data.length) * 3.2);
        }
    }["HeroAura.useCallback[getOutputVolume]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroAura.useEffect": ()=>{
            if (!speak || startedRef.current) return;
            startedRef.current = true;
            let cancelled = false;
            async function start() {
                const audio = new Audio(AUDIO_SRC);
                audio.preload = "auto";
                audioRef.current = audio;
                try {
                    const Ctor = window.AudioContext ?? window.webkitAudioContext;
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
                } catch  {
                // No Web Audio — playback still works, the aura just idles.
                }
                audio.addEventListener("ended", {
                    "HeroAura.useEffect.start": ()=>{
                        if (!cancelled) setState("listening");
                    }
                }["HeroAura.useEffect.start"]);
                try {
                    await audio.play();
                    if (!cancelled) setState("talking");
                } catch  {
                    // Autoplay refused (e.g. the reader scrolled past instead of
                    // clicking, so there's no gesture to spend).
                    if (!cancelled) setState("listening");
                }
            }
            void start();
            return ({
                "HeroAura.useEffect": ()=>{
                    cancelled = true;
                }
            })["HeroAura.useEffect"];
        }
    }["HeroAura.useEffect"], [
        speak
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroAura.useEffect": ()=>{
            return ({
                "HeroAura.useEffect": ()=>{
                    audioRef.current?.pause();
                    void ctxRef.current?.close();
                }
            })["HeroAura.useEffect"];
        }
    }["HeroAura.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-none relative mx-auto lg:absolute lg:left-1/2 lg:top-1/2 lg:z-[5] lg:-translate-x-1/2 lg:-translate-y-1/2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Aura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Aura"], {
            agentState: state,
            getOutputVolume: getOutputVolume,
            className: "h-[min(72vw,17rem)] w-[min(72vw,17rem)] lg:h-[min(92vw,86vh)] lg:w-[min(92vw,86vh)]"
        }, void 0, false, {
            fileName: "[project]/components/HeroAura.tsx",
            lineNumber: 102,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HeroAura.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_s(HeroAura, "BjJFD6abOq8/9CwIQVdT/OO71L0=");
_c = HeroAura;
var _c;
__turbopack_context__.k.register(_c, "HeroAura");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/HeroKpi.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroKpi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useLiveCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useLiveCounter.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const ALERTS = [
    "New bottleneck flagged in Finance approvals queue",
    "Onboarding hand-off delay detected — Support, EU team",
    "Duplicate process found in Procurement and Legal"
];
function formatCurrency(value) {
    if (value >= 1_000_000) {
        return `€${(value / 1_000_000).toFixed(3)} M`;
    }
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0
    }).format(value);
}
function formatHours(value) {
    return `${Math.round(value).toLocaleString("en-US")} hrs`;
}
function KpiCard({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        as: "div",
        className: "flex flex-col gap-2 p-4 sm:p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-[10px] leading-snug text-noah-ink-dim sm:text-[11px]",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/HeroKpi.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-xl font-semibold tabular-nums whitespace-nowrap text-noah-ink sm:text-3xl",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/HeroKpi.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-[10px] text-noah-orange sm:text-[11px]",
                children: "▲ live, updating"
            }, void 0, false, {
                fileName: "[project]/components/HeroKpi.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/HeroKpi.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_c = KpiCard;
function HeroKpi({ moneyStart = 482000, hoursStart = 1240, alerts = ALERTS }) {
    _s();
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const money = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useLiveCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveCounter"])(moneyStart, {
        reduced: reducedMotion
    });
    const hours = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useLiveCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveCounter"])(hoursStart, {
        reduced: reducedMotion
    });
    const [alertIndex, setAlertIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroKpi.useEffect": ()=>{
            if (reducedMotion) return;
            const id = window.setInterval({
                "HeroKpi.useEffect.id": ()=>{
                    setAlertIndex({
                        "HeroKpi.useEffect.id": (i)=>(i + 1) % alerts.length
                    }["HeroKpi.useEffect.id"]);
                }
            }["HeroKpi.useEffect.id"], 4800);
            return ({
                "HeroKpi.useEffect": ()=>window.clearInterval(id)
            })["HeroKpi.useEffect"];
        }
    }["HeroKpi.useEffect"], [
        reducedMotion,
        alerts.length
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex w-full max-w-md flex-col gap-3 sm:gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 gap-3 sm:gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                        label: "Potential money savings identified",
                        value: formatCurrency(money)
                    }, void 0, false, {
                        fileName: "[project]/components/HeroKpi.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiCard, {
                        label: "Potential time savings identified",
                        value: formatHours(hours)
                    }, void 0, false, {
                        fileName: "[project]/components/HeroKpi.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HeroKpi.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                as: "div",
                className: "flex items-center gap-3 p-4 sm:p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "relative flex h-2 w-2 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-noah-orange opacity-60"
                            }, void 0, false, {
                                fileName: "[project]/components/HeroKpi.tsx",
                                lineNumber: 84,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "relative inline-flex h-2 w-2 rounded-full bg-noah-orange"
                            }, void 0, false, {
                                fileName: "[project]/components/HeroKpi.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/HeroKpi.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "alert-fade-in font-body text-xs leading-snug text-noah-ink sm:text-[13px]",
                        children: alerts[alertIndex]
                    }, alertIndex, false, {
                        fileName: "[project]/components/HeroKpi.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/HeroKpi.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/HeroKpi.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_s(HeroKpi, "SgGK/XSrEqXQeFrRem2ZPcVzZLA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useLiveCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveCounter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useLiveCounter$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLiveCounter"]
    ];
});
_c1 = HeroKpi;
var _c, _c1;
__turbopack_context__.k.register(_c, "KpiCard");
__turbopack_context__.k.register(_c1, "HeroKpi");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/PartSlider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PartSlider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PartSlider({ nextPart, forceActive }) {
    _s();
    const sentinelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [observedActive, setObservedActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const active = (forceActive ?? observedActive) && !reducedMotion;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PartSlider.useEffect": ()=>{
            if (forceActive !== undefined) return;
            const el = sentinelRef.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "PartSlider.useEffect": ([entry])=>setObservedActive(entry.isIntersecting)
            }["PartSlider.useEffect"], {
                threshold: 0
            });
            io.observe(el);
            return ({
                "PartSlider.useEffect": ()=>io.disconnect()
            })["PartSlider.useEffect"];
        }
    }["PartSlider.useEffect"], [
        forceActive
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: sentinelRef,
                className: "pointer-events-none absolute bottom-0 left-0 h-px w-full",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/components/PartSlider.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `pointer-events-none fixed bottom-6 left-5 z-30 transition-all duration-300 sm:bottom-10 sm:left-8 ${active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`,
                "aria-hidden": !active,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "part-slider glass glass-pill flex h-14 items-center gap-4 pl-2 pr-7 sm:h-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "part-slider-circle part-slider-circle--locked",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                className: "h-4 w-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M5 12h14M13 6l6 6-6 6",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    fill: "none",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/PartSlider.tsx",
                                    lineNumber: 55,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/PartSlider.tsx",
                                lineNumber: 54,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/PartSlider.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "relative z-10 flex flex-col leading-tight",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "whitespace-nowrap font-body text-sm font-semibold tracking-[0.01em] text-noah-ink sm:text-base",
                                    children: [
                                        "Go to part ",
                                        nextPart
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/PartSlider.tsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "whitespace-nowrap font-body text-[10px] uppercase tracking-[0.16em] text-noah-ink-dim",
                                    children: "Keep scrolling"
                                }, void 0, false, {
                                    fileName: "[project]/components/PartSlider.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/PartSlider.tsx",
                            lineNumber: 65,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/PartSlider.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/PartSlider.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/PartSlider.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(PartSlider, "3uXNeouKiJcO2isO396M6ZHlBJA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = PartSlider;
var _c;
__turbopack_context__.k.register(_c, "PartSlider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ScrollCue.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ScrollCue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scrollToHash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scrollToHash.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ScrollCue({ label = "Keep scrolling", tone = "light", className = "" }) {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dominant, setDominant] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dismissed, setDismissed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollCue.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "ScrollCue.useEffect": ([entry])=>{
                    setDominant(entry.intersectionRatio > 0.6);
                    if (entry.intersectionRatio <= 0.6) setDismissed(false);
                }
            }["ScrollCue.useEffect"], {
                threshold: [
                    0,
                    0.6,
                    1
                ]
            });
            io.observe(el);
            return ({
                "ScrollCue.useEffect": ()=>io.disconnect()
            })["ScrollCue.useEffect"];
        }
    }["ScrollCue.useEffect"], []);
    // Only scrolling *down* takes the hint — it dismissed on any input
    // before, which meant scrolling back up to the hero dismissed the cue on
    // the way in and it never reappeared. Coming back up makes it relevant
    // again, so it un-dismisses. Measured from scroll position rather than
    // wheel events so it behaves the same for trackpad, keyboard and
    // scrollbar, and inside pinned sections where the cue never leaves view.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollCue.useEffect": ()=>{
            if (!dominant) return;
            let last = window.scrollY;
            let downward = 0;
            function onScroll() {
                const y = window.scrollY;
                const delta = y - last;
                last = y;
                // A menu jump is a long downward scroll. Counting it would hide the
                // cue on the empty first frame of a pin, which is when it is needed.
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scrollToHash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isProgrammaticScroll"])()) {
                    downward = 0;
                    setDismissed(false);
                    return;
                }
                if (delta > 0) {
                    downward += delta;
                    if (downward > 24) setDismissed(true);
                } else if (delta < -24) {
                    downward = 0;
                    setDismissed(false);
                }
            }
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            return ({
                "ScrollCue.useEffect": ()=>window.removeEventListener("scroll", onScroll)
            })["ScrollCue.useEffect"];
        }
    }["ScrollCue.useEffect"], [
        dominant
    ]);
    const visible = dominant && !dismissed;
    const color = tone === "dark" ? "text-noah-fog/70" : "text-noah-ink/45";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        "aria-hidden": true,
        className: `pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `font-body text-[10px] uppercase tracking-[0.18em] ${color}`,
                children: label
            }, void 0, false, {
                fileName: "[project]/components/ScrollCue.tsx",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                viewBox: "0 0 24 24",
                className: `scroll-cue-chevron h-4 w-4 ${color}`,
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M6 9l6 6 6-6",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/components/ScrollCue.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ScrollCue.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ScrollCue.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(ScrollCue, "6yYjbMvzJ1RxeTC6OIEbZ+0gkck=");
_c = ScrollCue;
var _c;
__turbopack_context__.k.register(_c, "ScrollCue");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/BusinessCases.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BusinessCases
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
;
;
const CASES = [
    {
        rank: "01",
        title: "Invoice reconciliation",
        time: "−65%",
        timeLabel: "processing time",
        money: "€120k",
        moneyLabel: "saved per year",
        explanation: "Purchase orders are matched to invoices automatically instead of checked line by line."
    },
    {
        rank: "02",
        title: "Customer onboarding",
        time: "−40%",
        timeLabel: "time to first value",
        money: "€85k",
        moneyLabel: "saved per year",
        explanation: "Six handoffs across four systems become one guided intake flow."
    },
    {
        rank: "03",
        title: "Support ticket triage",
        time: "−30%",
        timeLabel: "resolution time",
        money: "€54k",
        moneyLabel: "saved per year",
        explanation: "Tickets route themselves by intent instead of waiting on a human dispatcher."
    }
];
function BusinessCases() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "relative flex w-full flex-col items-center justify-center gap-8 px-6 py-16 sm:gap-12 sm:px-16 sm:py-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "industry-how-copy max-w-2xl text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                        children: "What you get"
                    }, void 0, false, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl",
                        children: "Business cases, ready for implementation."
                    }, void 0, false, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "industry-in mt-5 font-body text-noah-ink-dim sm:text-lg",
                        children: "Finally, every business case is ranked and traced straight back to your team's feedback"
                    }, void 0, false, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid w-full max-w-md grid-cols-1 gap-8 sm:max-w-6xl sm:grid-cols-3",
                style: {
                    perspective: "1400px"
                },
                children: CASES.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-case": true,
                        className: "h-full",
                        style: {
                            "--i": index,
                            zIndex: index + 1
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BusinessCaseCard, {
                            ...item
                        }, void 0, false, {
                            fileName: "[project]/components/sections/BusinessCases.tsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, this)
                    }, item.rank, false, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 57,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/BusinessCases.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
_c = BusinessCases;
function BusinessCaseCard({ rank, title, time, timeLabel, money, moneyLabel, explanation }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        tilt: true,
        className: "flex h-full flex-col p-8 text-left sm:p-9",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-display text-sm text-noah-orange",
                children: rank
            }, void 0, false, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 font-display text-2xl tracking-tight",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-3xl text-noah-ink",
                                children: time
                            }, void 0, false, {
                                fileName: "[project]/components/sections/BusinessCases.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-body text-xs text-noah-ink-dim",
                                children: timeLabel
                            }, void 0, false, {
                                fileName: "[project]/components/sections/BusinessCases.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-3xl text-noah-ink",
                                children: money
                            }, void 0, false, {
                                fileName: "[project]/components/sections/BusinessCases.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-body text-xs text-noah-ink-dim",
                                children: moneyLabel
                            }, void 0, false, {
                                fileName: "[project]/components/sections/BusinessCases.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/BusinessCases.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 font-body text-sm leading-relaxed text-noah-ink-dim",
                children: explanation
            }, void 0, false, {
                fileName: "[project]/components/sections/BusinessCases.tsx",
                lineNumber: 100,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/BusinessCases.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
_c1 = BusinessCaseCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "BusinessCases");
__turbopack_context__.k.register(_c1, "BusinessCaseCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/Clients.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Clients
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const TESTIMONIALS = [
    {
        company: "ADB Safegate",
        figure: "1 week",
        label: "to executive buy-in",
        quote: "Production teams used noah's insights to convince management and kick off high-ROI AI builds within 2 weeks."
    },
    {
        company: "UCB",
        figure: "€250k+",
        label: "consulting saved",
        quote: "QA team identified top AI opportunities in 1 week, replacing months of external consulting. Moving forward with other teams."
    },
    {
        company: "Vekoma",
        figure: "€350k+",
        label: "consulting saved",
        quote: "20 interviews in 1 day. Clear AI roadmap delivered the next day. Now company wide roll-out."
    },
    {
        company: "Credendo",
        figure: "€100k+",
        label: "consulting saved",
        quote: "AI opportunities mapped across teams in under a week. Straight into execution."
    }
];
const COPIES = 3;
function Clients({ id = "clients", eyebrow = "Clients", title = "Teams already changing how they work.", testimonials = TESTIMONIALS }) {
    _s();
    const scrollerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cardRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const wrappingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Clients.useEffect": ()=>{
            const scrollerNode = scrollerRef.current;
            if (!scrollerNode) return;
            const scroller = scrollerNode;
            function stride() {
                const first = cardRefs.current[0];
                if (!first) return 0;
                const gap = parseFloat(getComputedStyle(scroller).columnGap);
                return first.offsetWidth + (Number.isFinite(gap) ? gap : 0);
            }
            function setWidth() {
                return stride() * testimonials.length;
            }
            function wrap() {
                const w = setWidth();
                if (!w) return;
                const x = scroller.scrollLeft;
                if (x < w) {
                    wrappingRef.current = true;
                    scroller.scrollLeft = x + w;
                    wrappingRef.current = false;
                } else if (x >= w * 2) {
                    wrappingRef.current = true;
                    scroller.scrollLeft = x - w;
                    wrappingRef.current = false;
                }
            }
            function paint() {
                const track = scrollerRef.current;
                if (!track) return;
                const trackRect = track.getBoundingClientRect();
                const mid = trackRect.left + trackRect.width / 2;
                for (const card of cardRefs.current){
                    if (!card) continue;
                    const rect = card.getBoundingClientRect();
                    const cardMid = rect.left + rect.width / 2;
                    const t = Math.max(-1.15, Math.min(1.15, (cardMid - mid) / Math.max(rect.width, 1)));
                    const abs = Math.abs(t);
                    if (reducedMotion) {
                        card.style.transform = "none";
                        card.style.opacity = String(1 - Math.min(0.35, abs * 0.28));
                        continue;
                    }
                    const compact = window.matchMedia("(max-width: 639px)").matches;
                    const rotate = t * (compact ? -10 : -28);
                    const rise = (1 - abs) * (compact ? 8 : 36);
                    const scale = 1 - abs * (compact ? 0.04 : 0.06);
                    card.style.transform = `perspective(1100px) rotateY(${rotate}deg) translateZ(${rise}px) scale(${scale})`;
                    card.style.opacity = String(1 - Math.min(0.18, abs * 0.16));
                }
            }
            function onScroll() {
                paint();
                if (!wrappingRef.current) wrap();
            }
            wrappingRef.current = true;
            scroller.scrollLeft = setWidth();
            wrappingRef.current = false;
            paint();
            scroller.addEventListener("scroll", onScroll, {
                passive: true
            });
            const ro = new ResizeObserver({
                "Clients.useEffect": ()=>{
                    const w = setWidth();
                    if (!w) return;
                    const n = testimonials.length;
                    const index = Math.round(scroller.scrollLeft / stride()) % n;
                    wrappingRef.current = true;
                    scroller.scrollLeft = w + (index + n) % n * stride();
                    wrappingRef.current = false;
                    paint();
                }
            }["Clients.useEffect"]);
            ro.observe(scroller);
            let drag = null;
            function settle() {
                const step = stride();
                if (!step) return;
                const index = Math.round(scroller.scrollLeft / step);
                scroller.scrollTo({
                    left: index * step,
                    behavior: reducedMotion ? "auto" : "smooth"
                });
            }
            function onPointerDown(event) {
                if (event.button !== 0) return;
                drag = {
                    id: event.pointerId,
                    x: event.clientX,
                    left: scroller.scrollLeft,
                    moved: false
                };
                try {
                    scroller.setPointerCapture(event.pointerId);
                } catch  {
                /* capture isn't available on every pointer type */ }
                scroller.classList.add("quote-carousel--dragging");
            }
            function onPointerMove(event) {
                if (!drag) return;
                if (event.pointerId && event.pointerId !== drag.id) return;
                const dx = event.clientX - drag.x;
                if (!drag.moved && Math.abs(dx) < 3) return;
                event.preventDefault();
                drag.moved = true;
                scroller.scrollLeft = drag.left - dx;
                wrap();
                paint();
            }
            function onPointerUp(event) {
                if (!drag) return;
                if (event.pointerId && event.pointerId !== drag.id) return;
                const moved = drag.moved;
                drag = null;
                scroller.classList.remove("quote-carousel--dragging");
                if (moved) settle();
            }
            function onScrollEnd() {
                if (wrappingRef.current) return;
                wrap();
            }
            scroller.addEventListener("pointerdown", onPointerDown);
            window.addEventListener("pointermove", onPointerMove, {
                passive: false
            });
            window.addEventListener("pointerup", onPointerUp);
            window.addEventListener("pointercancel", onPointerUp);
            scroller.addEventListener("scrollend", onScrollEnd);
            return ({
                "Clients.useEffect": ()=>{
                    scroller.removeEventListener("scroll", onScroll);
                    scroller.removeEventListener("pointerdown", onPointerDown);
                    window.removeEventListener("pointermove", onPointerMove);
                    window.removeEventListener("pointerup", onPointerUp);
                    window.removeEventListener("pointercancel", onPointerUp);
                    scroller.removeEventListener("scrollend", onScrollEnd);
                    ro.disconnect();
                }
            })["Clients.useEffect"];
        }
    }["Clients.useEffect"], [
        reducedMotion,
        testimonials
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: id,
        className: "relative px-0 py-16 sm:py-28",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto max-w-3xl px-6 text-center sm:px-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                        children: eyebrow
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Clients.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-4 font-display text-4xl tracking-tight sm:text-5xl",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Clients.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Clients.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollerRef,
                className: "quote-carousel mt-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-16 [&::-webkit-scrollbar]:hidden",
                children: Array.from({
                    length: COPIES
                }, (_, copy)=>testimonials.map((item, index)=>({
                            ...item,
                            key: `${copy}-${index}`
                        }))).flat().map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: (el)=>{
                            cardRefs.current[index] = el;
                        },
                        className: "quote-carousel-card",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            className: "flex h-full min-h-[16rem] flex-col justify-between gap-6 px-6 py-6 sm:min-h-[18rem] sm:px-8 sm:py-7",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display text-4xl tracking-tight sm:text-5xl",
                                            children: item.figure
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Clients.tsx",
                                            lineNumber: 249,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                                            children: item.label
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Clients.tsx",
                                            lineNumber: 252,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-5 font-body text-base leading-snug sm:text-lg",
                                            children: item.quote
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Clients.tsx",
                                            lineNumber: 255,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/sections/Clients.tsx",
                                    lineNumber: 248,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-display text-lg tracking-tight sm:text-xl",
                                    children: item.company
                                }, void 0, false, {
                                    fileName: "[project]/components/sections/Clients.tsx",
                                    lineNumber: 259,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/sections/Clients.tsx",
                            lineNumber: 247,
                            columnNumber: 15
                        }, this)
                    }, item.key, false, {
                        fileName: "[project]/components/sections/Clients.tsx",
                        lineNumber: 240,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/Clients.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Clients.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
_s(Clients, "W3mlrbeNDGzFDT42xZQq64NISG8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = Clients;
var _c;
__turbopack_context__.k.register(_c, "Clients");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/FinalCTA.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FinalCTA
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useInView.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const PANES = [
    {
        className: "left-[3%] top-24 w-[8.75rem] sm:left-[4%] sm:top-[9%] sm:w-56",
        style: {
            "--dx": "34vw",
            "--dy": "52vh",
            "--from-rot": "22deg",
            "--rest": "-8deg",
            "--i": 0
        },
        node: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiPane, {
            label: "Potential money savings identified",
            value: "€482,000"
        }, void 0, false, {
            fileName: "[project]/components/sections/FinalCTA.tsx",
            lineNumber: 28,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        className: "right-[3%] bottom-6 w-[8.75rem] sm:right-[5%] sm:top-[12%] sm:bottom-auto sm:w-56",
        style: {
            "--dx": "-32vw",
            "--dy": "46vh",
            "--from-rot": "-18deg",
            "--rest": "7deg",
            "--i": 1
        },
        node: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(KpiPane, {
            label: "Potential time saved identified",
            value: "1,240 hrs"
        }, void 0, false, {
            fileName: "[project]/components/sections/FinalCTA.tsx",
            lineNumber: 41,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        className: "bottom-[6%] left-[1%] hidden w-[15.5rem] md:block md:bottom-[8%] md:left-[3.5%] md:w-[19rem]",
        style: {
            "--dx": "28vw",
            "--dy": "22vh",
            "--from-rot": "14deg",
            "--rest": "-5deg",
            "--i": 2
        },
        node: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CasePane, {
            rank: "01",
            title: "Invoice reconciliation",
            time: "−65%",
            timeLabel: "processing time",
            money: "€120k",
            moneyLabel: "saved per year"
        }, void 0, false, {
            fileName: "[project]/components/sections/FinalCTA.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    },
    {
        className: "bottom-[9%] right-[1%] hidden w-[15.5rem] md:right-[4%] md:bottom-[11%] md:block md:w-[18rem]",
        style: {
            "--dx": "-26vw",
            "--dy": "26vh",
            "--from-rot": "-16deg",
            "--rest": "6deg",
            "--i": 3
        },
        node: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CasePane, {
            rank: "02",
            title: "Customer onboarding",
            time: "−40%",
            timeLabel: "time to first value",
            money: "€85k",
            moneyLabel: "saved per year"
        }, void 0, false, {
            fileName: "[project]/components/sections/FinalCTA.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }
];
function FinalCTA({ eyebrow = "Ready when you are", title = "One department. Twenty-four hours. No guesswork." }) {
    _s();
    const { ref, inView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"])(0.35, "0px 0px -10% 0px");
    const { ref: bottomRef, inView: burst } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"])(0);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: ref,
        className: "cta-stage relative flex min-h-[80vh] flex-col items-center justify-center gap-10 overflow-hidden bg-noah-ink/5 px-6 text-center",
        "data-visible": inView || reducedMotion ? "" : undefined,
        "data-burst": burst || reducedMotion ? "" : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: bottomRef,
                className: "pointer-events-none absolute inset-x-0 bottom-8 h-8",
                "aria-hidden": true
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pointer-events-none absolute inset-0",
                "aria-hidden": true,
                children: PANES.map((pane)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `cta-burst absolute ${pane.className}`,
                        style: pane.style,
                        children: pane.node
                    }, pane.className, false, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 112,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 110,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "cta-glow absolute inset-0",
                style: {
                    background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(235,92,28,0.16), transparent 65%)"
                }
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "cta-reveal font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                        children: eyebrow
                    }, void 0, false, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 129,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "cta-reveal mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/book",
                        className: "cta-reveal glass glass-orange glass-pill mt-10 inline-flex h-14 w-fit items-center justify-center px-9 text-center text-sm font-medium tracking-[0.01em] text-white transition-colors",
                        children: "Book a call"
                    }, void 0, false, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/FinalCTA.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
}
_s(FinalCTA, "LEGy/nlBPko/+aFFSOCPo6Ts15o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = FinalCTA;
function KpiPane({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        as: "div",
        className: "flex flex-col gap-1.5 p-3 text-left sm:gap-2 sm:p-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-[10px] leading-snug text-noah-ink-dim sm:text-[11px]",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-base font-semibold tabular-nums whitespace-nowrap text-noah-ink sm:text-3xl",
                children: value
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-[10px] text-noah-orange sm:text-[11px]",
                children: "▲ live, updating"
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/FinalCTA.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c1 = KpiPane;
function CasePane({ rank, title, time, timeLabel, money, moneyLabel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        as: "div",
        className: "flex flex-col p-4 text-left sm:p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-display text-xs text-noah-orange sm:text-sm",
                children: rank
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 font-display text-lg tracking-tight sm:text-2xl",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 flex gap-4 sm:mt-5 sm:gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-xl text-noah-ink sm:text-3xl",
                                children: time
                            }, void 0, false, {
                                fileName: "[project]/components/sections/FinalCTA.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-body text-[10px] text-noah-ink-dim sm:text-xs",
                                children: timeLabel
                            }, void 0, false, {
                                fileName: "[project]/components/sections/FinalCTA.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-xl text-noah-ink sm:text-3xl",
                                children: money
                            }, void 0, false, {
                                fileName: "[project]/components/sections/FinalCTA.tsx",
                                lineNumber: 198,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 font-body text-[10px] text-noah-ink-dim sm:text-xs",
                                children: moneyLabel
                            }, void 0, false, {
                                fileName: "[project]/components/sections/FinalCTA.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/FinalCTA.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/FinalCTA.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/FinalCTA.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_c2 = CasePane;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "FinalCTA");
__turbopack_context__.k.register(_c1, "KpiPane");
__turbopack_context__.k.register(_c2, "CasePane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/InnovationMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>InnovationMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const VIEW_W = 1000;
const VIEW_H = 300;
const PAD_X = 28;
const BASE_Y = 228;
const AMP = 160;
const BANDS = [
    {
        name: "Innovator",
        from: 0,
        to: 0.1,
        fill: "rgba(20, 23, 42, 0.05)"
    },
    {
        name: "Early Adopter",
        from: 0.1,
        to: 0.27,
        fill: "rgba(46, 45, 139, 0.1)"
    },
    {
        name: "Early Majority",
        from: 0.27,
        to: 0.58,
        fill: "rgba(235, 92, 28, 0.1)"
    },
    {
        name: "Late Majority",
        from: 0.58,
        to: 0.82,
        fill: "rgba(20, 23, 42, 0.07)"
    },
    {
        name: "Laggard",
        from: 0.82,
        to: 1,
        fill: "rgba(235, 92, 28, 0.14)"
    }
];
const CHASM = 0.27;
const MARKERS = [
    {
        name: "Luis",
        t: 0.05,
        lift: 40
    },
    {
        name: "Sarah",
        t: 0.18,
        lift: 44
    },
    {
        name: "Cesar",
        t: 0.34,
        lift: 36
    },
    {
        name: "Anna",
        t: 0.46,
        lift: 40
    },
    {
        name: "Emmy",
        t: 0.66,
        lift: 36
    },
    {
        name: "Denis",
        t: 0.9,
        lift: 32
    }
];
function bell(t) {
    const z = (t - 0.46) / 0.175;
    return Math.exp(-0.5 * z * z);
}
// Node and the browser disagree on Math.exp in the last digit. One decimal
// keeps the curve identical and the server HTML equal to the client.
function round1(n) {
    return Math.round(n * 10) / 10;
}
function gx(t) {
    return round1(PAD_X + t * (VIEW_W - PAD_X * 2));
}
function gy(t) {
    return round1(BASE_Y - bell(t) * AMP);
}
function curvePath() {
    const steps = 80;
    let d = "";
    for(let i = 0; i <= steps; i += 1){
        const t = i / steps;
        d += `${i === 0 ? "M" : "L"}${gx(t).toFixed(1)} ${gy(t).toFixed(1)}`;
    }
    return d;
}
function bandPath(from, to) {
    const steps = 28;
    let d = `M${gx(from).toFixed(1)} ${BASE_Y}`;
    for(let i = 0; i <= steps; i += 1){
        const t = from + (to - from) * i / steps;
        d += `L${gx(t).toFixed(1)} ${gy(t).toFixed(1)}`;
    }
    d += `L${gx(to).toFixed(1)} ${BASE_Y}Z`;
    return d;
}
const CURVE = curvePath();
function InnovationMap() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "flex w-full flex-col items-center px-6 pb-20 sm:px-16",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-6xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px flex-1 bg-noah-ink-hairline"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/InnovationMap.tsx",
                            lineNumber: 80,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "shrink-0 font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                            children: "Innovation map"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/InnovationMap.tsx",
                            lineNumber: 81,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-px flex-1 bg-noah-ink-hairline"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/InnovationMap.tsx",
                            lineNumber: 84,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/InnovationMap.tsx",
                    lineNumber: 79,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-8 w-full",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
                        className: "h-auto w-full",
                        role: "img",
                        "aria-label": "Innovation adoption curve with the team placed from innovators through the early majority",
                        children: [
                            BANDS.map((band)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: bandPath(band.from, band.to),
                                    fill: band.fill
                                }, band.name, false, {
                                    fileName: "[project]/components/sections/InnovationMap.tsx",
                                    lineNumber: 95,
                                    columnNumber: 11
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: PAD_X,
                                x2: VIEW_W - PAD_X,
                                y1: BASE_Y,
                                y2: BASE_Y,
                                stroke: "rgba(20, 23, 42, 0.16)",
                                strokeWidth: "1.25"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/InnovationMap.tsx",
                                lineNumber: 98,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: CURVE,
                                fill: "none",
                                stroke: "#14172a",
                                strokeWidth: "2.25",
                                strokeLinejoin: "round",
                                strokeLinecap: "round"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/InnovationMap.tsx",
                                lineNumber: 107,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                x1: gx(CHASM),
                                x2: gx(CHASM),
                                y1: round1(gy(CHASM) - 8),
                                y2: BASE_Y,
                                stroke: "#eb5c1c",
                                strokeWidth: "1.5",
                                strokeDasharray: "5 5"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/InnovationMap.tsx",
                                lineNumber: 116,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                x: round1(gx(CHASM) + 8),
                                y: round1(gy(CHASM) + 18),
                                fill: "#eb5c1c",
                                fontSize: "13",
                                fontFamily: "var(--font-fraunces), serif",
                                children: "The chasm"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/InnovationMap.tsx",
                                lineNumber: 125,
                                columnNumber: 9
                            }, this),
                            BANDS.map((band)=>{
                                const mid = (band.from + band.to) / 2;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: gx(mid),
                                    y: BASE_Y + 28,
                                    textAnchor: "middle",
                                    fill: "rgba(20, 23, 42, 0.55)",
                                    fontSize: "12",
                                    fontFamily: "var(--font-merriweather-sans), sans-serif",
                                    children: band.name
                                }, band.name, false, {
                                    fileName: "[project]/components/sections/InnovationMap.tsx",
                                    lineNumber: 138,
                                    columnNumber: 13
                                }, this);
                            }),
                            MARKERS.map((marker)=>{
                                const x = gx(marker.t);
                                const y = gy(marker.t);
                                const lift = marker.lift;
                                const labelX = round1(x + (marker.dx ?? 0));
                                const stemTop = round1(y - 7);
                                const labelY = round1(y - lift);
                                const stemEnd = round1(labelY + 4);
                                const early = marker.t < CHASM;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: x,
                                            x2: labelX,
                                            y1: stemTop,
                                            y2: stemEnd,
                                            stroke: "rgba(20, 23, 42, 0.28)",
                                            strokeWidth: "1"
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/InnovationMap.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: x,
                                            cy: y,
                                            r: "6.5",
                                            fill: "rgba(246, 243, 236, 0.92)",
                                            stroke: early ? "#2e2d8b" : "#eb5c1c",
                                            strokeWidth: "2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/InnovationMap.tsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                            x: labelX,
                                            y: labelY,
                                            textAnchor: "middle",
                                            fill: "#14172a",
                                            fontSize: "13",
                                            fontFamily: "var(--font-merriweather-sans), sans-serif",
                                            children: marker.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/InnovationMap.tsx",
                                            lineNumber: 179,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, marker.name, true, {
                                    fileName: "[project]/components/sections/InnovationMap.tsx",
                                    lineNumber: 162,
                                    columnNumber: 13
                                }, this);
                            })
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/InnovationMap.tsx",
                        lineNumber: 88,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/sections/InnovationMap.tsx",
                    lineNumber: 87,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/sections/InnovationMap.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/sections/InnovationMap.tsx",
        lineNumber: 77,
        columnNumber: 5
    }, this);
}
_c = InnovationMap;
var _c;
__turbopack_context__.k.register(_c, "InnovationMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/OpeningHero.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OpeningHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroKpi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroKpi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroAura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroAura.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollCue$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScrollCue.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scrollToHash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/scrollToHash.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function OpeningHero() {
    _s();
    const [ready, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpeningHero.useEffect": ()=>{
            let cancelled = false;
            let cap = 0;
            const finish = {
                "OpeningHero.useEffect.finish": ()=>{
                    if (cancelled) return;
                    window.clearTimeout(cap);
                    setReady(true);
                }
            }["OpeningHero.useEffect.finish"];
            cap = window.setTimeout(finish, 1600);
            void (document.fonts?.ready ?? Promise.resolve()).then(finish);
            return ({
                "OpeningHero.useEffect": ()=>{
                    cancelled = true;
                    window.clearTimeout(cap);
                }
            })["OpeningHero.useEffect"];
        }
    }["OpeningHero.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OpeningHero.useEffect": ()=>{
            if (!ready) return;
            const hash = window.location.hash;
            if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scrollToHash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isHomeSectionHash"])(hash)) return;
            const id = window.setTimeout({
                "OpeningHero.useEffect.id": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$scrollToHash$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scrollToHash"])(hash)
            }["OpeningHero.useEffect.id"], 80);
            return ({
                "OpeningHero.useEffect": ()=>window.clearTimeout(id)
            })["OpeningHero.useEffect"];
        }
    }["OpeningHero.useEffect"], [
        ready
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `industry-loader ${ready ? "industry-loader--done" : ""}`,
                role: "status",
                "aria-hidden": ready,
                "aria-label": ready ? undefined : "Loading",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "industry-loader-track",
                        "aria-hidden": true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "industry-loader-bar"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/OpeningHero.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/sections/OpeningHero.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-5 font-body text-[11px] uppercase tracking-[0.2em] text-noah-ink-dim",
                        children: "Loading"
                    }, void 0, false, {
                        fileName: "[project]/components/sections/OpeningHero.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/OpeningHero.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "top",
                className: "relative flex min-h-[100dvh] w-full flex-col lg:h-[100dvh] lg:items-end lg:overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex min-h-[100dvh] flex-col lg:absolute lg:inset-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex shrink-0 justify-center pt-24 lg:contents",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroAura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                speak: ready
                            }, void 0, false, {
                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/sections/OpeningHero.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative z-10 flex w-full flex-col px-6 pb-16 pt-6 sm:px-16 sm:pb-20 lg:h-full lg:justify-end lg:pt-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-w-xl text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim",
                                                children: "Process intelligence, within 24 hours."
                                            }, void 0, false, {
                                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                                lineNumber: 64,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "mt-6 font-display text-4xl leading-[1.05] tracking-tight text-noah-ink sm:text-6xl",
                                                children: "Noah, the right hand of every transformation manager."
                                            }, void 0, false, {
                                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                                lineNumber: 67,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg",
                                                children: "Noah interviews your teams to identify pain points, suggests tailored solutions, and guides you towards implementation."
                                            }, void 0, false, {
                                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                                lineNumber: 70,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/book",
                                                        className: "glass glass-orange glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium transition-colors text-white",
                                                        children: "Book a demo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/OpeningHero.tsx",
                                                        lineNumber: 75,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "/why-noah",
                                                        className: "glass glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange",
                                                        children: "Why Noah?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/OpeningHero.tsx",
                                                        lineNumber: 81,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                                lineNumber: 74,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/sections/OpeningHero.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroKpi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/components/sections/OpeningHero.tsx",
                                        lineNumber: 90,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sections/OpeningHero.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/sections/OpeningHero.tsx",
                            lineNumber: 61,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollCue$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            label: "Let us explain"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/OpeningHero.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/OpeningHero.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/OpeningHero.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/OpeningHero.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(OpeningHero, "gv+w1B3gMJTuTz/25fmlsaub194=");
_c = OpeningHero;
var _c;
__turbopack_context__.k.register(_c, "OpeningHero");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/Pricing.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pricing
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gsap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/gsap.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals> <export default as gsap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$company$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/company.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const PLANS = [
    {
        name: "One-time",
        price: "Single fee",
        audience: "For single departments",
        features: [
            "~10 personalised AI opportunities",
            "Results within 24 hours",
            "Max 20 employee interviews"
        ],
        cta: "Get started now",
        href: "/book",
        highlighted: false
    },
    {
        name: "Enterprise",
        price: "Custom Pricing",
        audience: "For organisations going all in on AI",
        features: [
            "Continuously updated AI opportunities",
            "Unlimited employee interviews",
            "Real-world examples from 10,000+ proven cases"
        ],
        cta: "Get started now",
        href: "/book",
        highlighted: true
    },
    {
        name: "Partner",
        price: "Pay/project",
        audience: "For consultants and agencies",
        features: [
            "Run AI discovery at your clients in hours, not months",
            "White-labeled environment per client",
            "Customizable interviews & output"
        ],
        cta: "Contact us",
        href: "/industry/agencies",
        highlighted: false
    }
];
function Pricing() {
    _s();
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "Pricing.useLayoutEffect": ()=>{
            if (reducedMotion || !sectionRef.current) return;
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].context({
                "Pricing.useLayoutEffect.ctx": ()=>{
                    const cards = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].utils.toArray("[data-plan]");
                    cards.forEach({
                        "Pricing.useLayoutEffect.ctx": (card, i)=>{
                            const fromLeft = i % 2 === 0;
                            const side = fromLeft ? -1 : 1;
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].set(card, {
                                opacity: 0,
                                x: 34 * side,
                                y: -200,
                                rotate: 18 * side,
                                rotateY: 22 * side,
                                scale: 0.86
                            });
                            const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].timeline({
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 86%",
                                    toggleActions: "play none none none"
                                }
                            });
                            tl.to(card, {
                                opacity: 1,
                                y: -46,
                                x: -14 * side,
                                rotate: -6 * side,
                                duration: 0.35,
                                ease: "power1.out"
                            }).to(card, {
                                x: 0,
                                y: 0,
                                rotate: 0,
                                rotateY: 0,
                                scale: 1,
                                duration: 0.55,
                                ease: "power2.out"
                            });
                        }
                    }["Pricing.useLayoutEffect.ctx"]);
                }
            }["Pricing.useLayoutEffect.ctx"], sectionRef);
            return ({
                "Pricing.useLayoutEffect": ()=>ctx.revert()
            })["Pricing.useLayoutEffect"];
        }
    }["Pricing.useLayoutEffect"], [
        reducedMotion
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "pricing",
        ref: sectionRef,
        className: "relative flex flex-col items-center justify-center gap-12 px-6 py-28 sm:px-16",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-2xl text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                        children: "Pricing"
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Pricing.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "mt-4 font-display text-4xl tracking-tight sm:text-5xl",
                        children: "Three ways to start."
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Pricing.tsx",
                        lineNumber: 111,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-5 font-body text-noah-ink-dim sm:text-lg",
                        children: "One department, the whole organisation, or the work you run for clients."
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Pricing.tsx",
                        lineNumber: 114,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 107,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3",
                style: {
                    perspective: "1400px"
                },
                children: PLANS.map((plan, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "data-plan": true,
                        className: `h-full ${index === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PricingCard, {
                            ...plan
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Pricing.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, this)
                    }, plan.name, false, {
                        fileName: "[project]/components/sections/Pricing.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$company$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPANY"].demoUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "font-body text-sm text-noah-ink underline decoration-noah-ink-hairline underline-offset-4 transition-colors hover:text-noah-orange hover:decoration-noah-orange",
                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$company$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPANY"].demoLabel
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Pricing.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
_s(Pricing, "G/KNGtM/PIhbYq7C/TvrCops/2w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = Pricing;
function PricingCard({ name, price, audience, features, cta, href, highlighted }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        tilt: true,
        className: "flex h-full flex-col p-8 text-left sm:p-9",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-display text-sm text-noah-orange",
                children: name
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 156,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 font-display text-3xl tracking-tight text-noah-ink",
                children: price
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 font-body text-xs text-noah-ink-dim",
                children: audience
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 160,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-6 flex flex-col gap-3",
                children: features.map((feature)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-start gap-3 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Pricing.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            feature
                        ]
                    }, feature, true, {
                        fileName: "[project]/components/sections/Pricing.tsx",
                        lineNumber: 163,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-auto pt-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: href,
                    className: highlighted ? "glass glass-pill glass-orange flex h-12 w-full items-center justify-center text-sm font-medium tracking-[0.01em] text-noah-cream" : "glass glass-pill flex h-12 w-full items-center justify-center text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange",
                    children: cta
                }, void 0, false, {
                    fileName: "[project]/components/sections/Pricing.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Pricing.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Pricing.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_c1 = PricingCard;
var _c, _c1;
__turbopack_context__.k.register(_c, "Pricing");
__turbopack_context__.k.register(_c1, "PricingCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/Problem.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Problem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PartSlider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useInView.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const DIY_CONS = [
    "Manual interviews that take weeks",
    "No data to prove a problem matters",
    "Zero alignment on which department to optimize first",
    "Result: Six months go by with zero results"
];
const CONSULTANT_CONS = [
    "Static advice that is instantly outdated",
    "Generic frameworks disguised as custom advice",
    "Advice shaped to sell you their next project",
    "Result: a 500K invoice with only theories"
];
const STAGE_TITLE = "Big organisations only have two options for transformation.";
function ScrollBlock({ className, children }) {
    _s();
    const { ref, inView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"])(0.28, "0px 0px -10% 0px");
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `industry-how-block ${className ?? ""}`,
        "data-visible": inView || reducedMotion ? "" : undefined,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/sections/Problem.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
_s(ScrollBlock, "Ei1msMCqAkog1FHbTmi9A6yqZ14=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = ScrollBlock;
function Problem() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "problem",
        className: "relative flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBlock, {
                className: "flex flex-col items-center justify-center gap-8 px-6 py-24 sm:gap-10 sm:px-16 sm:py-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "industry-in max-w-4xl text-center font-display text-3xl leading-[1.08] tracking-tight sm:text-5xl",
                        children: STAGE_TITLE
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Problem.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid w-full max-w-5xl gap-4 sm:grid-cols-2 sm:gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-case": true,
                                style: {
                                    "--i": 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OptionPane, {
                                    title: "In-house",
                                    cons: DIY_CONS
                                }, void 0, false, {
                                    fileName: "[project]/components/sections/Problem.tsx",
                                    lineNumber: 56,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Problem.tsx",
                                lineNumber: 55,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                "data-case": true,
                                style: {
                                    "--i": 1
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OptionPane, {
                                    title: "Consultants",
                                    cons: CONSULTANT_CONS
                                }, void 0, false, {
                                    fileName: "[project]/components/sections/Problem.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Problem.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/Problem.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Problem.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                nextPart: 2
            }, void 0, false, {
                fileName: "[project]/components/sections/Problem.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Problem.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_c1 = Problem;
function OptionPane({ title, cons }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        tilt: true,
        className: "h-full p-5 text-left sm:p-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-display text-xl tracking-tight sm:text-3xl",
                children: title
            }, void 0, false, {
                fileName: "[project]/components/sections/Problem.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "mt-3 flex flex-col gap-1.5 sm:mt-6 sm:gap-3",
                children: cons.map((con)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-start gap-2 font-body text-[13px] leading-snug text-noah-ink-dim sm:gap-3 sm:text-base",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange"
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Problem.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this),
                            con
                        ]
                    }, con, true, {
                        fileName: "[project]/components/sections/Problem.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/sections/Problem.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Problem.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c2 = OptionPane;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ScrollBlock");
__turbopack_context__.k.register(_c1, "Problem");
__turbopack_context__.k.register(_c2, "OptionPane");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/Solution.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Solution
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlassPane.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PartSlider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sections$2f$BusinessCases$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/sections/BusinessCases.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sections$2f$InnovationMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/sections/InnovationMap.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useInView.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const INTRO_TITLE = "Introducing a third option: Noah.";
const INTRO_SUBLINE = "A digital transformation agent that does the heavy lifting for you. Noah interviews your teams, maps workflows, and uncovers innovation opportunities. Then, you receive a prioritised, ready-to-execute roadmap, with Noah right by your side to help build the fixes.";
/** One mapped process, step by step. */ const PROCESS_STEPS = [
    {
        label: "Invoice received"
    },
    {
        label: "Manual check"
    },
    {
        label: "Payment approved"
    }
];
function ScrollBlock({ className, children }) {
    _s();
    const { ref, inView } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"])(0.28, "0px 0px -10% 0px");
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: `industry-how-block ${className ?? ""}`,
        "data-visible": inView || reducedMotion ? "" : undefined,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, this);
}
_s(ScrollBlock, "Ei1msMCqAkog1FHbTmi9A6yqZ14=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useInView$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInView"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = ScrollBlock;
function SolutionSplit({ title, subtitle, media, reverse = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBlock, {
        className: `flex min-h-[80vh] flex-col ${reverse ? "sm:flex-row-reverse" : "sm:flex-row"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full items-center px-6 py-16 sm:w-1/2 sm:px-16 sm:py-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `industry-how-copy max-w-lg ${reverse ? "" : "ml-auto"}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "industry-in font-display text-4xl tracking-tight sm:text-5xl",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "industry-in mt-4 font-body text-noah-ink-dim sm:text-lg",
                            children: subtitle
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 66,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "industry-how-media relative w-full sm:w-1/2",
                children: media
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
_c1 = SolutionSplit;
/**
 * Coded phone, rather than a picture of one: a liquid-glass shell held at a
 * fixed 3D angle with a dynamic island, wrapping the interviewer screenshot.
 *
 * The screen keeps the screenshot's own 998×1648 ratio instead of a real
 * iPhone's 19.5:9 — that shot has the "noah." mark and "Logout" hard against
 * its left and right edges, and any crop tight enough to make the silhouette
 * properly phone-shaped clips them both.
 *
 * The 3D tilt stays on the outer element. The entrance rotation lives on
 * the inner one, so the two transforms never overwrite each other.
 */ function InterviewPhone() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full items-center justify-center px-6 py-20 sm:justify-start sm:pl-4 sm:pr-12",
        style: {
            perspective: "1100px"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-[270px] sm:max-w-[320px]",
            style: {
                transformStyle: "preserve-3d",
                transform: "rotateY(-19deg) rotateX(5deg)"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                "data-phone": true,
                className: "relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -left-px top-[23%] h-11 w-[2px] rounded-l-full bg-noah-ink/40",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -left-px top-[34%] h-16 w-[2px] rounded-l-full bg-noah-ink/40",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -right-px top-[29%] h-14 w-[2px] rounded-r-full bg-noah-ink/40",
                        "aria-hidden": true
                    }, void 0, false, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "glass relative rounded-[2.75rem] p-[10px] shadow-[0_40px_80px_-20px_rgba(20,23,42,0.45)]",
                        style: {
                            "--glass-tint-top": "rgba(18, 20, 34, 0.88)",
                            "--glass-tint-bottom": "rgba(10, 12, 22, 0.95)",
                            "--glass-border": "rgba(8, 10, 18, 0.9)",
                            "--glass-rim": "rgba(255, 255, 255, 0.32)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative aspect-[998/1648] overflow-hidden rounded-[2.15rem] bg-noah-cream",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/interviewer-screenshot.png",
                                        alt: "Noah conducting an interview session",
                                        className: "absolute inset-0 h-full w-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Solution.tsx",
                                        lineNumber: 132,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "absolute left-1/2 top-[10px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-noah-navy-deep",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Solution.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "pointer-events-none absolute inset-0",
                                        style: {
                                            background: "linear-gradient(115deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 26%, transparent 46%)"
                                        },
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Solution.tsx",
                                        lineNumber: 145,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sections/Solution.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "pointer-events-none absolute inset-0 rounded-[2.75rem]",
                                style: {
                                    background: "linear-gradient(135deg, rgba(255,255,255,0.55), transparent 34%)",
                                    mixBlendMode: "overlay"
                                },
                                "aria-hidden": true
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Solution.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 118,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 101,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/sections/Solution.tsx",
            lineNumber: 94,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 90,
        columnNumber: 5
    }, this);
}
_c2 = InterviewPhone;
function StepArrow({ index }) {
    const marked = index === 1;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex w-full flex-col items-center py-2 sm:py-3",
        style: {
            "--i": index
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                "data-arrow": true,
                viewBox: "0 0 24 128",
                className: "h-16 w-6 text-noah-ink-faint sm:h-20",
                fill: "none",
                "aria-hidden": true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 2v112m0 0-7-8m7 8 7-8",
                    stroke: "currentColor",
                    strokeWidth: "1.75",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, void 0, false, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            marked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    "data-pain": true,
                    className: "flex items-center gap-2.5 rounded-full border border-noah-orange/20 bg-noah-cream py-1.5 pl-1.5 pr-4 shadow-[0_10px_28px_-14px_rgba(20,23,42,0.45)]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-noah-orange/10 text-noah-orange",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                viewBox: "0 0 24 24",
                                className: "h-4 w-4",
                                "aria-hidden": true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    d: "M6 6l12 12M18 6 6 18",
                                    stroke: "currentColor",
                                    strokeWidth: "2.4",
                                    strokeLinecap: "round"
                                }, void 0, false, {
                                    fileName: "[project]/components/sections/Solution.tsx",
                                    lineNumber: 202,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Solution.tsx",
                                lineNumber: 201,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "whitespace-nowrap font-body text-xs font-semibold uppercase tracking-[0.16em] text-noah-orange",
                            children: "Painpoint found"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 210,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 196,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 195,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
_c3 = StepArrow;
function ProcessDiagram() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full items-center justify-center px-6 py-16",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex w-full max-w-md flex-col items-center",
            children: PROCESS_STEPS.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            "data-step": true,
                            className: "w-full",
                            style: {
                                "--i": index
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlassPane$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                className: "flex w-full items-center justify-center gap-3.5 px-10 py-7 sm:py-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        "data-dot": true,
                                        className: "h-3 w-3 shrink-0 rounded-full bg-noah-orange",
                                        "aria-hidden": true
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Solution.tsx",
                                        lineNumber: 232,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-body text-lg font-medium tracking-[0.01em] text-noah-ink sm:text-xl",
                                        children: step.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Solution.tsx",
                                        lineNumber: 237,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sections/Solution.tsx",
                                lineNumber: 231,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this),
                        index < PROCESS_STEPS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StepArrow, {
                            index: index
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 242,
                            columnNumber: 50
                        }, this)
                    ]
                }, step.label, true, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 225,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/sections/Solution.tsx",
            lineNumber: 223,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_c4 = ProcessDiagram;
function Solution() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "solution",
        className: "relative flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBlock, {
                className: "flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "industry-how-copy max-w-4xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "industry-in font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl",
                            children: INTRO_TITLE
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 255,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "industry-in mt-6 font-body text-noah-ink-dim sm:text-lg",
                            children: INTRO_SUBLINE
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Solution.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 254,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SolutionSplit, {
                title: "Interviews",
                subtitle: "First, Noah interviews an entire department in 24 hours, surfacing the day-to-day operational insights from the people on the workfloor.",
                media: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InterviewPhone, {}, void 0, false, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 267,
                    columnNumber: 16
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SolutionSplit, {
                reverse: true,
                title: "Mapping",
                subtitle: "Next, Noah maps those interviews across your entire workflow, highlighting the exact friction points slowing you down.",
                media: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProcessDiagram, {}, void 0, false, {
                    fileName: "[project]/components/sections/Solution.tsx",
                    lineNumber: 273,
                    columnNumber: 16
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ScrollBlock, {
                className: "flex min-h-[80vh] flex-col items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sections$2f$BusinessCases$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$sections$2f$InnovationMap$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/sections/Solution.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 276,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                nextPart: 3
            }, void 0, false, {
                fileName: "[project]/components/sections/Solution.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Solution.tsx",
        lineNumber: 252,
        columnNumber: 5
    }, this);
}
_c5 = Solution;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ScrollBlock");
__turbopack_context__.k.register(_c1, "SolutionSplit");
__turbopack_context__.k.register(_c2, "InterviewPhone");
__turbopack_context__.k.register(_c3, "StepArrow");
__turbopack_context__.k.register(_c4, "ProcessDiagram");
__turbopack_context__.k.register(_c5, "Solution");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/sections/Vision.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Vision
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$gsap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/gsap.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals> <export default as gsap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/useReducedMotion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Aura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Aura.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollCue$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ScrollCue.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PartSlider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const QUOTE_TITLE = "Real change doesn't end with a few business cases";
const PAYOFF_TITLE = "Noah takes the work of transformation and does it for you.";
const PAYOFF_SUBLINE = "Noah is taking charge of everything. From discovery and building the first MVP to management and support of the final build.";
const AVAILABILITY_NOTE = "Coming end of 2026";
const STAGES = [
    {
        title: "Discovery",
        description: "Noah interviews a whole department to surface real operational insights. Turning them into actionable business cases instantly.",
        available: true
    },
    {
        title: "Scoping",
        description: "We prepare your business to act, identifying who will lead the change, who needs convincing, what questions to ask, and exactly what to test first.",
        available: true
    },
    {
        title: "MVP experiment",
        description: "We build and run a live proof of concept, measuring both the numbers and how the team experiences the change.",
        available: true
    },
    {
        title: "Evaluate",
        description: "Once the results are in, Noah presents the insights and gives you a clear choice: build the fix, or improve the business case.",
        available: true
    }
];
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PARTICLE_COUNT = 26;
/**
 * Pin length in viewport heights. The first PLAY share is quote → circle →
 * spin → morph; the remainder is the held zone the part gate sits in, so
 * the pin does not release the moment the payoff arrives.
 */ const PIN_VH = 11;
const PLAY = 9 / PIN_VH;
function beat(start, end) {
    return [
        start * PLAY,
        end * PLAY
    ];
}
/**
 * Scroll progress breakpoints inside the pin. Written in the original 9vh
 * play units, then scaled by PLAY so extra pin length lands after the morph
 * instead of stretching every beat.
 */ const CIRCLE_IN = beat(0.26, 0.32);
const CIRCLE_RUN = beat(0.32, 0.64);
const SPIN = beat(0.64, 0.95);
const TEXT_OUT = beat(0.64, 0.71);
const CIRCLE_OUT = beat(0.88, 0.96);
// The morph only starts once the circle has been spinning for most of the
// spin beat, so the reader has to keep scrolling through the spin-up before
// the shape gives way to the aura.
const AURA_IN = beat(0.84, 0.96);
const PAYOFF_IN = beat(0.94, 0.99);
/**
 * The opening line scrolls away on its own. The pin starts once the circle
 * is fully in, and maps its own 0–1 onto the rest of the original scene.
 */ const SCENE_START = CIRCLE_IN[1];
const PIN_SCROLL_VH = PIN_VH * (1 - SCENE_START);
function sceneProgress(pinProgress) {
    return SCENE_START + pinProgress * (1 - SCENE_START);
}
/** How much wider the circle throws itself at full spin. */ const SWELL = 1.1;
/** How far the aura lifts off centre to make room for the payoff copy. */ const AURA_LIFT_VH = 13;
/** Rate at which the eased scalars below chase their scroll-driven target. */ const FOLLOW = 12;
/** Faster on the way back: the reset should read as a snap, not a fade. */ const RESET_FOLLOW = 26;
/** Sustained backward scroll, in pixels, that counts as turning back. */ const REVERSE_PX = 120;
/**
 * Forward scroll needed to re-arm the spin after the reader has turned back
 * into it — enough that nudging the page cannot restart the spin.
 */ const RE_ARM_PX = 200;
function clamp01(n) {
    return Math.min(1, Math.max(0, n));
}
/**
 * Eased chase that actually arrives: an exponential ease alone leaves a
 * couple of percent hanging around, which on display type reads as a ghost
 * of the beat that was supposed to be gone.
 */ function approach(value, target, k) {
    const next = value + (target - value) * k;
    return Math.abs(target - next) < 0.002 ? target : next;
}
/** Progress within a [start, end] window, clamped outside it. */ function span(p, range) {
    return clamp01((p - range[0]) / (range[1] - range[0]));
}
function dotPosition(index) {
    const angle = (-90 + index * 90) * (Math.PI / 180);
    return {
        x: 100 + RADIUS * Math.cos(angle),
        y: 100 + RADIUS * Math.sin(angle)
    };
}
/** Fixed per-particle character, so the spray isn't a uniform starburst. */ const PARTICLES = Array.from({
    length: PARTICLE_COUNT
}, (_, i)=>{
    const golden = i * 137.508 * Math.PI / 180;
    return {
        angle: golden,
        // Staggered so they leave in waves rather than all at once.
        delay: i % 7 / 7 * 0.3,
        distance: 260 + i * 53 % 420,
        drift: (i * 31 % 100 / 100 - 0.5) * 1.4,
        size: 2 + i * 17 % 5 * 0.7,
        warm: i % 3 !== 0
    };
});
function Vision() {
    _s();
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const circleLayerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const circleBoxRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stageTextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stageNumberRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const stageDotsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const progressCircleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const auraRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const payoffTextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const titleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const particleRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [auraOn, setAuraOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hintActive, setHintActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "Vision.useLayoutEffect": ()=>{
            if (reducedMotion || !wrapperRef.current) return;
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].context({
                "Vision.useLayoutEffect.ctx": ()=>{
                    // Distance from the circle's resting spot to the middle of the pinned
                    // stage. Measured against the wrapper rather than the viewport so the
                    // number is the same whether or not the section is currently pinned.
                    let centerDx = 0;
                    let centerDy = 0;
                    function measure() {
                        const box = circleBoxRef.current;
                        const wrap = wrapperRef.current;
                        if (!box || !wrap) return;
                        const prev = box.style.transform;
                        box.style.transform = "";
                        const b = box.getBoundingClientRect();
                        const w = wrap.getBoundingClientRect();
                        centerDx = w.width / 2 - (b.left - w.left + b.width / 2);
                        centerDy = w.height / 2 - (b.top - w.top + b.height / 2);
                        box.style.transform = prev;
                    }
                    // Everything below is written by the rAF loop from an eased copy of
                    // the scroll-driven target, so the reset on reverse reads as a snap
                    // back rather than a teleport.
                    let progress = SCENE_START;
                    let lastScroll = 0;
                    let forwardPx = 0;
                    let backwardPx = 0;
                    // Scrolling back up does not play the spin backwards — the circle
                    // snaps back to its resting, unrotated state and the scene is just the
                    // circle again (a reversed spin left the stage dots at a random angle).
                    let reversed = false;
                    let spinTarget = 0;
                    let spinVisual = 0;
                    let travel = 0;
                    let rotation = 0;
                    let auraValue = 0;
                    let liftValue = 0;
                    let circleValue = 1;
                    let stageTextValue = 1;
                    let payoffValue = 0;
                    let last = null;
                    let running = false;
                    let raf = 0;
                    // The spin is integrated over time rather than mapped straight from
                    // scroll: scroll position sets the *speed*, so the circle keeps
                    // accelerating away even while the reader holds still on the beat.
                    function frame(now) {
                        if (last == null) last = now;
                        const dt = Math.min(0.05, (now - last) / 1000);
                        last = now;
                        const k = Math.min(1, dt * (reversed ? RESET_FOLLOW : FOLLOW));
                        spinVisual = approach(spinVisual, reversed ? 0 : spinTarget, k);
                        if (reversed) {
                            // Unwind to the nearest whole turn: the stage dots have to land
                            // back on 12/3/6/9 o'clock, not wherever the spin left them.
                            const settled = Math.round(rotation / 360) * 360;
                            rotation = Math.abs(settled - rotation) < 0.2 ? settled : rotation + (settled - rotation) * k;
                        } else {
                            const ramp = spinVisual * spinVisual;
                            // Once the aura owns the frame, stop adding speed so the hold
                            // isn't a blender behind the copy.
                            rotation += dt * (spinVisual * 90 + ramp * 1500) * (1 - auraValue);
                        }
                        // The travel to centre finishes early in the spin, so the circle is
                        // already sitting exactly where the aura appears while it is still
                        // winding up — otherwise the two shapes never overlap.
                        const t = clamp01(spinVisual / 0.35);
                        travel = approach(travel, 1 - Math.pow(1 - t, 3), k);
                        // It grows as it winds up: the faster it turns, the wider it throws
                        // itself out, which is what hands the frame over to the aura.
                        const swell = 1 + SWELL * spinVisual * spinVisual;
                        const box = circleBoxRef.current;
                        if (box) {
                            box.style.transform = `translate3d(${centerDx * travel}px, ${centerDy * travel}px, 0) scale(${swell}) rotate(${rotation}deg)`;
                        }
                        for(let i = 0; i < PARTICLES.length; i += 1){
                            const el = particleRefs.current[i];
                            const cfg = PARTICLES[i];
                            if (!el || !cfg) continue;
                            const local = clamp01((spinVisual - cfg.delay) / (1 - cfg.delay));
                            if (local <= 0) {
                                el.style.opacity = "0";
                                continue;
                            }
                            const flight = local * local;
                            const angle = cfg.angle + rotation * Math.PI / 180 * 0.15 + flight * cfg.drift;
                            const r = RADIUS + flight * cfg.distance;
                            el.style.transform = `translate3d(${Math.cos(angle) * r}px, ${Math.sin(angle) * r}px, 0)`;
                            // In quickly, then gone before the aura has fully taken over.
                            el.style.opacity = String(Math.min(1, local * 5) * (1 - clamp01((local - 0.55) / 0.45)));
                        }
                        // On the way back the circle scene is whole again: it neither fades
                        // out nor loses its stage copy, and the aura and payoff are gone.
                        const auraTarget = reversed ? 0 : span(progress, AURA_IN);
                        const payoffTarget = reversed ? 0 : span(progress, PAYOFF_IN);
                        const circleTarget = reversed ? span(progress, CIRCLE_IN) : span(progress, CIRCLE_IN) * (1 - span(progress, CIRCLE_OUT));
                        const stageTextTarget = reversed ? 1 : 1 - span(progress, TEXT_OUT);
                        auraValue = approach(auraValue, auraTarget, k);
                        payoffValue = approach(payoffValue, payoffTarget, k);
                        liftValue = approach(liftValue, payoffTarget, k);
                        circleValue = approach(circleValue, circleTarget, k);
                        stageTextValue = approach(stageTextValue, stageTextTarget, k);
                        if (auraRef.current) {
                            auraRef.current.style.opacity = String(auraValue);
                            auraRef.current.style.transform = `translateY(${-AURA_LIFT_VH * liftValue}vh) scale(${0.35 + 0.65 * auraValue})`;
                        }
                        if (payoffTextRef.current) {
                            payoffTextRef.current.style.opacity = String(payoffValue);
                        }
                        if (circleLayerRef.current) {
                            circleLayerRef.current.style.opacity = String(circleValue);
                        }
                        if (stageTextRef.current) {
                            stageTextRef.current.style.opacity = String(stageTextValue);
                        }
                        if (titleRef.current) {
                            titleRef.current.style.opacity = String(stageTextValue);
                        }
                        // The stage number and the stage dots ride inside the circle, so
                        // they swell with it — both have to be gone before that reads as a
                        // typo the size of a fist. The ring is the only thing left turning.
                        const stageMarks = String(clamp01(1 - spinVisual * 3));
                        if (stageNumberRef.current) {
                            stageNumberRef.current.style.opacity = stageMarks;
                        }
                        if (stageDotsRef.current) {
                            stageDotsRef.current.style.opacity = stageMarks;
                        }
                        raf = requestAnimationFrame(frame);
                    }
                    function start() {
                        if (running) return;
                        running = true;
                        last = null;
                        raf = requestAnimationFrame(frame);
                    }
                    function stop() {
                        running = false;
                        cancelAnimationFrame(raf);
                    }
                    const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__default__as__gsap$3e$__["gsap"].timeline({
                        scrollTrigger: {
                            trigger: wrapperRef.current,
                            start: "top top",
                            end: `+=${PIN_SCROLL_VH * 100}%`,
                            scrub: 0.5,
                            pin: true,
                            pinType: "fixed",
                            anticipatePin: 1,
                            onRefresh: measure,
                            onUpdate: {
                                "Vision.useLayoutEffect.ctx.tl": (self)=>{
                                    const p = sceneProgress(self.progress);
                                    progress = p;
                                    // Direction comes from the raw scroll position, not from
                                    // progress: with a smoothed scrub, progress keeps drifting after
                                    // the reader has stopped, and reading that as a reversal made
                                    // the reset flicker on and off. Both edges need sustained
                                    // travel, so a touchpad bounce settles nothing.
                                    const y = self.scroll();
                                    if (y < lastScroll - 1) {
                                        backwardPx += lastScroll - y;
                                        forwardPx = 0;
                                        if (backwardPx > REVERSE_PX) reversed = true;
                                    } else if (y > lastScroll + 1) {
                                        backwardPx = 0;
                                        forwardPx += y - lastScroll;
                                        if (forwardPx > RE_ARM_PX) reversed = false;
                                    }
                                    if (p <= SPIN[0]) {
                                        reversed = false;
                                        forwardPx = 0;
                                        backwardPx = 0;
                                    }
                                    lastScroll = y;
                                    const t = span(p, CIRCLE_RUN);
                                    const index = Math.min(STAGES.length - 1, Math.floor(t * 4));
                                    setActiveIndex({
                                        "Vision.useLayoutEffect.ctx.tl": (prev)=>prev === index ? prev : index
                                    }["Vision.useLayoutEffect.ctx.tl"]);
                                    if (progressCircleRef.current) {
                                        progressCircleRef.current.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - t));
                                    }
                                    spinTarget = span(p, SPIN);
                                    setAuraOn({
                                        "Vision.useLayoutEffect.ctx.tl": (prev)=>prev || p > AURA_IN[0] - 0.1
                                    }["Vision.useLayoutEffect.ctx.tl"]);
                                    const showHint = p >= PAYOFF_IN[0] && p < 1;
                                    setHintActive({
                                        "Vision.useLayoutEffect.ctx.tl": (prev)=>prev === showHint ? prev : showHint
                                    }["Vision.useLayoutEffect.ctx.tl"]);
                                }
                            }["Vision.useLayoutEffect.ctx.tl"]
                        }
                    });
                    // ScrollTrigger is attached to the timeline, so it needs a tween.
                    // The scene itself is driven from onUpdate, not from this tween.
                    tl.to({}, {
                        duration: 1
                    });
                    measure();
                    // The loop runs for as long as the section is mounted. Gating it on
                    // visibility (or on the trigger's active state) left the scene frozen
                    // mid-transition whenever the gate missed an edge, and the loop itself
                    // is a handful of sums per frame.
                    start();
                    return stop;
                }
            }["Vision.useLayoutEffect.ctx"], wrapperRef);
            return ({
                "Vision.useLayoutEffect": ()=>ctx.revert()
            })["Vision.useLayoutEffect"];
        }
    }["Vision.useLayoutEffect"], [
        reducedMotion
    ]);
    if (reducedMotion) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            id: "vision",
            className: "flex flex-col gap-10 px-6 py-28 sm:px-16",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-3xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                            children: "What you get"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 418,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl",
                            children: "Business cases, ready to implement."
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 421,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 font-display text-2xl tracking-tight sm:text-3xl",
                            children: "Our way of working"
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 424,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/Vision.tsx",
                    lineNumber: 417,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex w-full max-w-2xl flex-col gap-10",
                    children: STAGES.map((stage, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex gap-5 ${stage.available ? "" : "opacity-55"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `font-display text-xl ${stage.available ? "text-noah-orange" : "text-noah-ink-faint"}`,
                                    children: [
                                        "0",
                                        index + 1
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/sections/Vision.tsx",
                                    lineNumber: 434,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display text-xl tracking-tight",
                                            children: stage.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Vision.tsx",
                                            lineNumber: 442,
                                            columnNumber: 17
                                        }, this),
                                        !stage.available && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 font-body text-xs uppercase tracking-[0.16em] text-noah-ink-faint",
                                            children: AVAILABILITY_NOTE
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Vision.tsx",
                                            lineNumber: 446,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 font-body text-noah-ink-dim",
                                            children: stage.description
                                        }, void 0, false, {
                                            fileName: "[project]/components/sections/Vision.tsx",
                                            lineNumber: 450,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/sections/Vision.tsx",
                                    lineNumber: 441,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, stage.title, true, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 430,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/sections/Vision.tsx",
                    lineNumber: 428,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-2xl text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-display text-3xl leading-tight tracking-tight sm:text-4xl",
                            children: PAYOFF_TITLE
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 458,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-5 font-body text-noah-ink-dim sm:text-lg",
                            children: PAYOFF_SUBLINE
                        }, void 0, false, {
                            fileName: "[project]/components/sections/Vision.tsx",
                            lineNumber: 461,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/sections/Vision.tsx",
                    lineNumber: 457,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/sections/Vision.tsx",
            lineNumber: 416,
            columnNumber: 7
        }, this);
    }
    const stage = STAGES[activeIndex];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        id: "vision",
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: wrapperRef,
                className: "relative h-screen overflow-hidden px-6 sm:px-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: circleLayerRef,
                        className: "absolute inset-0 flex flex-col items-center justify-start px-6 pt-24 sm:pt-28",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-body pb-4 text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                                children: "but Noah doesn't stop there."
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Vision.tsx",
                                lineNumber: 482,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                ref: titleRef,
                                className: "max-w-4xl text-center font-display text-3xl leading-[1.08] tracking-tight sm:text-5xl",
                                children: QUOTE_TITLE
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Vision.tsx",
                                lineNumber: 485,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-4 flex w-full flex-col items-center justify-center gap-6 sm:mt-6 sm:flex-row sm:gap-16",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: circleBoxRef,
                                        className: "relative h-52 w-52 shrink-0 will-change-transform sm:h-72 sm:w-72",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                viewBox: "0 0 200 200",
                                                className: "h-full w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "100",
                                                        cy: "100",
                                                        r: RADIUS,
                                                        fill: "none",
                                                        stroke: "rgba(20,23,42,0.12)",
                                                        strokeWidth: "1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        ref: progressCircleRef,
                                                        cx: "100",
                                                        cy: "100",
                                                        r: RADIUS,
                                                        fill: "none",
                                                        stroke: "var(--noah-orange)",
                                                        strokeWidth: "1.5",
                                                        strokeLinecap: "round",
                                                        strokeDasharray: CIRCUMFERENCE,
                                                        strokeDashoffset: CIRCUMFERENCE,
                                                        transform: "rotate(-90 100 100)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                        ref: stageDotsRef,
                                                        children: STAGES.map((item, index)=>{
                                                            const { x, y } = dotPosition(index);
                                                            const visible = activeIndex >= index;
                                                            const current = activeIndex === index;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                cx: x,
                                                                cy: y,
                                                                r: current ? 6 : 4,
                                                                fill: current ? item.available ? "var(--noah-orange)" : "var(--noah-ink-faint)" : item.available ? "var(--noah-ink)" : "var(--noah-ink-faint)",
                                                                style: {
                                                                    opacity: visible ? 1 : 0,
                                                                    transition: "opacity 400ms ease, r 300ms ease"
                                                                }
                                                            }, item.title, false, {
                                                                fileName: "[project]/components/sections/Vision.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 23
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 518,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/sections/Vision.tsx",
                                                lineNumber: 496,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                ref: stageNumberRef,
                                                className: "pointer-events-none absolute inset-0 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `font-display text-3xl ${stage.available ? "text-noah-ink" : "text-noah-ink-faint"}`,
                                                    children: [
                                                        "0",
                                                        activeIndex + 1
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/sections/Vision.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/sections/Vision.tsx",
                                                lineNumber: 547,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pointer-events-none absolute inset-0 flex items-center justify-center",
                                                children: PARTICLES.map((particle, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        ref: (el)=>{
                                                            particleRefs.current[index] = el;
                                                        },
                                                        "aria-hidden": true,
                                                        className: "absolute rounded-full opacity-0 will-change-transform",
                                                        style: {
                                                            width: particle.size,
                                                            height: particle.size,
                                                            background: particle.warm ? "var(--noah-orange)" : "var(--noah-indigo)"
                                                        }
                                                    }, index, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 563,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/components/sections/Vision.tsx",
                                                lineNumber: 561,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/sections/Vision.tsx",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        ref: stageTextRef,
                                        className: "w-full max-w-md text-center sm:text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mt-2 font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                                                children: [
                                                    activeIndex + 1,
                                                    " of ",
                                                    STAGES.length,
                                                    " ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Our way of working"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 588,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/sections/Vision.tsx",
                                                lineNumber: 586,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: stage.available ? "" : "opacity-60 transition-opacity duration-500",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mt-3 font-display text-xl tracking-tight sm:text-2xl",
                                                        children: stage.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 597,
                                                        columnNumber: 17
                                                    }, this),
                                                    !stage.available && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-4 inline-flex items-center gap-2 rounded-full border border-noah-ink-hairline px-3 py-1 font-body text-[10px] uppercase tracking-[0.16em] text-noah-ink-faint",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "h-1 w-1 rounded-full bg-noah-ink-faint"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/sections/Vision.tsx",
                                                                lineNumber: 602,
                                                                columnNumber: 21
                                                            }, this),
                                                            AVAILABILITY_NOTE
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 601,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-3 font-body text-sm text-noah-ink-dim sm:text-base",
                                                        children: stage.description
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/sections/Vision.tsx",
                                                        lineNumber: 606,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/sections/Vision.tsx",
                                                lineNumber: 590,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/sections/Vision.tsx",
                                        lineNumber: 582,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sections/Vision.tsx",
                                lineNumber: 491,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/Vision.tsx",
                        lineNumber: 478,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pointer-events-none absolute inset-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: auraRef,
                                    className: "h-[min(120vw,82vh)] w-[min(120vw,82vh)] opacity-0 will-change-transform",
                                    children: auraOn && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Aura$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Aura"], {
                                        agentState: "thinking",
                                        className: "h-full w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Vision.tsx",
                                        lineNumber: 625,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/sections/Vision.tsx",
                                    lineNumber: 620,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/sections/Vision.tsx",
                                lineNumber: 619,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                ref: payoffTextRef,
                                className: "absolute inset-x-0 top-[58%] mx-auto max-w-2xl px-6 text-center opacity-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl",
                                        children: PAYOFF_TITLE
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Vision.tsx",
                                        lineNumber: 635,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-5 font-body text-noah-ink-dim sm:text-lg",
                                        children: PAYOFF_SUBLINE
                                    }, void 0, false, {
                                        fileName: "[project]/components/sections/Vision.tsx",
                                        lineNumber: 638,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/sections/Vision.tsx",
                                lineNumber: 631,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/sections/Vision.tsx",
                        lineNumber: 615,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ScrollCue$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/sections/Vision.tsx",
                        lineNumber: 644,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/sections/Vision.tsx",
                lineNumber: 473,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PartSlider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                nextPart: 4,
                forceActive: hintActive
            }, void 0, false, {
                fileName: "[project]/components/sections/Vision.tsx",
                lineNumber: 647,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/sections/Vision.tsx",
        lineNumber: 472,
        columnNumber: 5
    }, this);
}
_s(Vision, "H9KTbOesS9I/Kkp9hjifBoHLSW4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$useReducedMotion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c = Vision;
var _c;
__turbopack_context__.k.register(_c, "Vision");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/useInView.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInView",
    ()=>useInView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useInView(threshold = 0.2, rootMargin = "0px") {
    _s();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [inView, setInView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInView.useEffect": ()=>{
            const el = ref.current;
            if (!el) return;
            const io = new IntersectionObserver({
                "useInView.useEffect": ([entry])=>{
                    if (entry.isIntersecting) {
                        setInView(true);
                        io.disconnect();
                    }
                }
            }["useInView.useEffect"], {
                threshold,
                rootMargin
            });
            io.observe(el);
            return ({
                "useInView.useEffect": ()=>io.disconnect()
            })["useInView.useEffect"];
        }
    }["useInView.useEffect"], [
        threshold,
        rootMargin
    ]);
    return {
        ref,
        inView
    };
}
_s(useInView, "K+dCFMkCcTyPMHOI0MxAWPXS6Js=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/useLiveCounter.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLiveCounter",
    ()=>useLiveCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function useLiveCounter(start, options = {}) {
    _s();
    const { minDelay = 1800, maxDelay = 4200, minStep = 0.004, maxStep = 0.018, reduced = false } = options;
    const [value, setValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(start);
    const displayRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(start);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLiveCounter.useEffect": ()=>{
            if (reduced) return;
            let cancelled = false;
            let raf = 0;
            let timeout;
            function scheduleNext() {
                const delay = minDelay + Math.random() * (maxDelay - minDelay);
                timeout = window.setTimeout(tick, delay);
            }
            function tick() {
                if (cancelled) return;
                const from = displayRef.current;
                const step = minStep + Math.random() * (maxStep - minStep);
                const to = from * (1 + step);
                const duration = 900;
                const startTs = performance.now();
                function animate(ts) {
                    if (cancelled) return;
                    const p = Math.min(1, (ts - startTs) / duration);
                    const eased = 1 - Math.pow(1 - p, 3);
                    const current = from + (to - from) * eased;
                    displayRef.current = current;
                    setValue(current);
                    if (p < 1) {
                        raf = requestAnimationFrame(animate);
                    } else {
                        scheduleNext();
                    }
                }
                raf = requestAnimationFrame(animate);
            }
            scheduleNext();
            return ({
                "useLiveCounter.useEffect": ()=>{
                    cancelled = true;
                    window.clearTimeout(timeout);
                    cancelAnimationFrame(raf);
                }
            })["useLiveCounter.useEffect"];
        }
    }["useLiveCounter.useEffect"], [
        reduced,
        minDelay,
        maxDelay,
        minStep,
        maxStep
    ]);
    return value;
}
_s(useLiveCounter, "hLM3wpO7W4Cru9CLzr26XnH9CrQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/useReducedMotion.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReducedMotion",
    ()=>useReducedMotion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(callback) {
    const mql = window.matchMedia(QUERY);
    mql.addEventListener("change", callback);
    return ()=>mql.removeEventListener("change", callback);
}
function getSnapshot() {
    return window.matchMedia(QUERY).matches;
}
function getServerSnapshot() {
    return false;
}
function useReducedMotion() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getServerSnapshot);
}
_s(useReducedMotion, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0bfvcd2._.js.map
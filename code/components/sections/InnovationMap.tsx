const VIEW_W = 1000;
const VIEW_H = 300;
const PAD_X = 28;
const BASE_Y = 228;
const AMP = 160;

const BANDS = [
  { name: "Innovator", from: 0, to: 0.1, fill: "rgba(20, 23, 42, 0.05)" },
  { name: "Early Adopter", from: 0.1, to: 0.27, fill: "rgba(46, 45, 139, 0.1)" },
  { name: "Early Majority", from: 0.27, to: 0.58, fill: "rgba(235, 92, 28, 0.1)" },
  { name: "Late Majority", from: 0.58, to: 0.82, fill: "rgba(20, 23, 42, 0.07)" },
  { name: "Laggard", from: 0.82, to: 1, fill: "rgba(235, 92, 28, 0.14)" },
] as const;

const CHASM = 0.27;

const MARKERS = [
  { name: "Luis", t: 0.05, lift: 40 },
  { name: "Sarah", t: 0.18, lift: 44 },
  { name: "Cesar", t: 0.34, lift: 36 },
  { name: "Anna", t: 0.46, lift: 40 },
  { name: "Emmy", t: 0.66, lift: 36 },
  { name: "Denis", t: 0.9, lift: 32 },
] as const;

function bell(t: number) {
  const z = (t - 0.46) / 0.175;
  return Math.exp(-0.5 * z * z);
}

// Node and the browser disagree on Math.exp in the last digit. One decimal
// keeps the curve identical and the server HTML equal to the client.
function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function gx(t: number) {
  return round1(PAD_X + t * (VIEW_W - PAD_X * 2));
}

function gy(t: number) {
  return round1(BASE_Y - bell(t) * AMP);
}

function curvePath() {
  const steps = 80;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    d += `${i === 0 ? "M" : "L"}${gx(t).toFixed(1)} ${gy(t).toFixed(1)}`;
  }
  return d;
}

function bandPath(from: number, to: number) {
  const steps = 28;
  let d = `M${gx(from).toFixed(1)} ${BASE_Y}`;
  for (let i = 0; i <= steps; i += 1) {
    const t = from + ((to - from) * i) / steps;
    d += `L${gx(t).toFixed(1)} ${gy(t).toFixed(1)}`;
  }
  d += `L${gx(to).toFixed(1)} ${BASE_Y}Z`;
  return d;
}

const CURVE = curvePath();

export default function InnovationMap() {
  return (
    <section className="flex w-full flex-col items-center px-6 pb-20 sm:px-16">
      <div className="w-full max-w-6xl">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-noah-ink-hairline" />
        <p className="shrink-0 font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          Innovation map
        </p>
        <div className="h-px flex-1 bg-noah-ink-hairline" />
      </div>

      <div className="mt-8 w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Innovation adoption curve with the team placed from innovators through the early majority"
      >
        {BANDS.map((band) => (
          <path key={band.name} d={bandPath(band.from, band.to)} fill={band.fill} />
        ))}

        <line
          x1={PAD_X}
          x2={VIEW_W - PAD_X}
          y1={BASE_Y}
          y2={BASE_Y}
          stroke="rgba(20, 23, 42, 0.16)"
          strokeWidth="1.25"
        />

        <path
          d={CURVE}
          fill="none"
          stroke="#14172a"
          strokeWidth="2.25"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <line
          x1={gx(CHASM)}
          x2={gx(CHASM)}
          y1={round1(gy(CHASM) - 8)}
          y2={BASE_Y}
          stroke="#eb5c1c"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
        <text
          x={round1(gx(CHASM) + 8)}
          y={round1(gy(CHASM) + 18)}
          fill="#eb5c1c"
          fontSize="13"
          fontFamily="var(--font-fraunces), serif"
        >
          The chasm
        </text>

        {BANDS.map((band) => {
          const mid = (band.from + band.to) / 2;
          return (
            <text
              key={band.name}
              x={gx(mid)}
              y={BASE_Y + 28}
              textAnchor="middle"
              fill="rgba(20, 23, 42, 0.55)"
              fontSize="12"
              fontFamily="var(--font-merriweather-sans), sans-serif"
            >
              {band.name}
            </text>
          );
        })}

        {MARKERS.map((marker) => {
          const x = gx(marker.t);
          const y = gy(marker.t);
          const lift = marker.lift;
          const labelX = round1(x + ("dx" in marker ? marker.dx : 0));
          const stemTop = round1(y - 7);
          const labelY = round1(y - lift);
          const stemEnd = round1(labelY + 4);
          const early = marker.t < CHASM;
          return (
            <g key={marker.name}>
              <line
                x1={x}
                x2={labelX}
                y1={stemTop}
                y2={stemEnd}
                stroke="rgba(20, 23, 42, 0.28)"
                strokeWidth="1"
              />
              <circle
                cx={x}
                cy={y}
                r="6.5"
                fill="rgba(246, 243, 236, 0.92)"
                stroke={early ? "#2e2d8b" : "#eb5c1c"}
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                fill="#14172a"
                fontSize="13"
                fontFamily="var(--font-merriweather-sans), sans-serif"
              >
                {marker.name}
              </text>
            </g>
          );
        })}
      </svg>
      </div>
      </div>
    </section>
  );
}

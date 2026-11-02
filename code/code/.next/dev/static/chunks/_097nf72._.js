(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/components/builder/PageBuilder.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PageBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$BlockBody$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/BlockBody.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blocks.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const INSERTS = [
    {
        type: "heading",
        label: "Heading"
    },
    {
        type: "text",
        label: "Text"
    },
    {
        type: "image",
        label: "Image"
    },
    {
        type: "button",
        label: "Button"
    },
    {
        type: "pdf",
        label: "PDF"
    },
    {
        type: "form",
        label: "Form"
    }
];
function PageBuilder({ flowId, pageId, flowSlug, pageSlug, isEntry, published, initialTitle, initialBlocks, pages }) {
    _s();
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialTitle);
    const [blocks, setBlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialBlocks);
    const [selectedId, setSelectedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialBlocks[0]?.id ?? "");
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [prompt, setPrompt] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [busy, setBusy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dirty, setDirty] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [addOpen, setAddOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editOpen, setEditOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const selected = blocks.find((block)=>block.id === selectedId) ?? null;
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"], {
        activationConstraint: {
            distance: 6
        }
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardSensor"], {
        coordinateGetter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortableKeyboardCoordinates"]
    }));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PageBuilder.useEffect": ()=>{
            function onLeave(event) {
                if (!dirty) return;
                event.preventDefault();
            }
            window.addEventListener("beforeunload", onLeave);
            return ({
                "PageBuilder.useEffect": ()=>window.removeEventListener("beforeunload", onLeave)
            })["PageBuilder.useEffect"];
        }
    }["PageBuilder.useEffect"], [
        dirty
    ]);
    function updateBlocks(next) {
        setBlocks(next);
        setDirty(true);
        setStatus("");
    }
    function updateSelected(next) {
        updateBlocks(blocks.map((block)=>block.id === next.id ? next : block));
    }
    function addBlock(type) {
        if (type === "form" && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formBlock"])(blocks)) return;
        const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBlock"])(type);
        if (!block) return;
        updateBlocks([
            ...blocks,
            block
        ]);
        setSelectedId(block.id);
        setEditOpen(true);
    }
    function addSection(template) {
        const block = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSection"])(template);
        updateBlocks([
            ...blocks,
            block
        ]);
        setSelectedId(block.id);
        setEditOpen(true);
    }
    function onDragEnd(event) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const from = blocks.findIndex((block)=>block.id === active.id);
        const to = blocks.findIndex((block)=>block.id === over.id);
        if (from < 0 || to < 0) return;
        updateBlocks((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(blocks, from, to));
    }
    async function save(nextBlocks = blocks, nextTitle = title) {
        setBusy(true);
        setStatus("");
        const response = await fetch(`/api/admin/pages/${pageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: nextTitle,
                blocks: nextBlocks
            })
        });
        const body = await response.json();
        setBusy(false);
        if (!response.ok) {
            setStatus(body.error || "Could not save.");
            return false;
        }
        setDirty(false);
        setStatus("Saved");
        return true;
    }
    async function askAi() {
        const text = prompt.trim();
        if (!text || busy) return;
        setBusy(true);
        setStatus("");
        const response = await fetch("/api/admin/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pageId,
                title,
                prompt: text,
                blocks
            })
        });
        const body = await response.json();
        setBusy(false);
        if (!response.ok || !body.blocks) {
            setStatus(body.error || "The model did not return a section.");
            return;
        }
        setBlocks(body.blocks);
        setDirty(false);
        setPrompt("");
        setStatus(body.notice || "Added to the page");
        const added = body.blocks[body.blocks.length - 1];
        if (added) setSelectedId(added.id);
    }
    const publicPath = isEntry ? `/f/${flowSlug}` : `/f/${flowSlug}/${pageSlug}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-[calc(100dvh-4.5rem)] flex-col overflow-hidden lg:flex-row",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `flex min-h-0 shrink-0 flex-col border-b border-noah-ink-hairline bg-noah-cream lg:h-full lg:border-r lg:border-b-0 ${addOpen ? "max-h-[42%] lg:max-h-none lg:w-72" : "h-12 lg:h-full lg:w-12"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setAddOpen((open)=>!open),
                        "aria-expanded": addOpen,
                        className: "flex h-12 shrink-0 items-center justify-between px-3 text-xs tracking-wide text-noah-ink-dim uppercase",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: addOpen ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180",
                                children: "Add"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                children: addOpen ? "−" : "+"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 187,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    addOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-y-auto px-4 pb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-2 font-body text-xs text-noah-ink-dim",
                                children: "Elements"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 191,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: INSERTS.map((item)=>{
                                    const disabled = item.type === "form" && Boolean((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formBlock"])(blocks));
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        disabled: disabled,
                                        onClick: ()=>addBlock(item.type),
                                        className: "rounded-2xl border border-noah-ink-hairline px-3 py-2 text-left text-sm text-noah-ink hover:border-noah-ink disabled:opacity-40",
                                        children: item.label
                                    }, item.type, false, {
                                        fileName: "[project]/components/builder/PageBuilder.tsx",
                                        lineNumber: 196,
                                        columnNumber: 19
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-6 mb-1 font-body text-xs text-noah-ink-dim",
                                children: "Sections"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mb-3 font-body text-xs leading-relaxed text-noah-ink-dim",
                                children: "These keep the site style. Change the words and the image from the edit panel."
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 209,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECTION_CATALOG"].map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>addSection(item.template),
                                        className: "rounded-2xl border border-noah-ink-hairline px-3 py-3 text-left hover:border-noah-ink",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "block text-sm text-noah-ink",
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                                lineNumber: 220,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 block font-body text-xs text-noah-ink-dim",
                                                children: item.detail
                                            }, void 0, false, {
                                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.template, true, {
                                        fileName: "[project]/components/builder/PageBuilder.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 212,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 190,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto flex max-w-5xl flex-col gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/admin/flows/${flowId}`,
                            onClick: (event)=>{
                                if (!dirty) return;
                                if (!window.confirm("This page has unsaved changes. Leave without saving?")) event.preventDefault();
                            },
                            className: "w-fit font-body text-sm text-noah-ink-dim hover:text-noah-ink",
                            children: "← Back to flow"
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 231,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap items-center justify-between gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: title,
                                    onChange: (event)=>{
                                        setTitle(event.target.value);
                                        setDirty(true);
                                        setStatus("");
                                    },
                                    "aria-label": "Page title",
                                    className: "min-w-0 flex-1 bg-transparent font-display text-3xl text-noah-ink outline-none"
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 242,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>save(),
                                    disabled: busy,
                                    className: "h-10 rounded-full bg-noah-ink px-4 text-sm text-noah-cream disabled:opacity-60",
                                    children: busy ? "Saving" : "Save"
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 252,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 241,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-body text-xs text-noah-ink-dim",
                            children: [
                                published ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: publicPath,
                                    className: "underline underline-offset-2",
                                    children: publicPath
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 263,
                                    columnNumber: 15
                                }, this) : "Publish the flow to open this page.",
                                status ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "ml-3 text-noah-ink",
                                    children: status
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 269,
                                    columnNumber: 23
                                }, this) : null
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 261,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    value: prompt,
                                    onChange: (event)=>setPrompt(event.target.value),
                                    placeholder: "Ask AI to build a section",
                                    className: "contact-input",
                                    maxLength: 2000
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 272,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: askAi,
                                    disabled: busy || !prompt.trim(),
                                    className: "h-12 shrink-0 rounded-full border border-noah-ink px-4 text-sm text-noah-ink disabled:opacity-40",
                                    children: "Build"
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 279,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
                            sensors: sensors,
                            collisionDetection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closestCenter"],
                            onDragEnd: onDragEnd,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                                items: blocks.map((block)=>block.id),
                                strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4",
                                    children: blocks.map((block)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableBlock, {
                                            block: block,
                                            selected: block.id === selectedId,
                                            onSelect: ()=>setSelectedId(block.id),
                                            flowSlug: flowSlug,
                                            pageId: pageId,
                                            pages: pages,
                                            form: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formBlock"])(blocks),
                                            formEmbedded: block.type === "form" && blocks.some((item)=>item.type === "section" && item.template === "hero" && item.heroMedia === "form")
                                        }, block.id, false, {
                                            fileName: "[project]/components/builder/PageBuilder.tsx",
                                            lineNumber: 293,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/builder/PageBuilder.tsx",
                                    lineNumber: 291,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 290,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/builder/PageBuilder.tsx",
                    lineNumber: 230,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: `flex min-h-0 shrink-0 flex-col border-t border-noah-ink-hairline bg-noah-cream lg:h-full lg:border-t-0 lg:border-l ${editOpen ? "max-h-[46%] lg:max-h-none lg:w-80" : "h-12 lg:h-full lg:w-12"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setEditOpen((open)=>!open),
                        "aria-expanded": editOpen,
                        className: "flex h-12 shrink-0 items-center justify-between px-3 text-xs tracking-wide text-noah-ink-dim uppercase",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: editOpen ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180",
                                children: "Edit"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                "aria-hidden": true,
                                children: editOpen ? "−" : "+"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 326,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 319,
                        columnNumber: 9
                    }, this),
                    editOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "min-h-0 flex-1 overflow-y-auto p-4",
                        children: selected ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Inspector, {
                            block: selected,
                            pages: pages.filter((page)=>page.id !== pageId),
                            onChange: updateSelected,
                            onRemove: ()=>{
                                updateBlocks(blocks.filter((block)=>block.id !== selected.id));
                                setSelectedId(blocks.find((block)=>block.id !== selected.id)?.id ?? "");
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 331,
                            columnNumber: 15
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-body text-sm text-noah-ink-dim",
                            children: "Select a block to edit it."
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 341,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 329,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 314,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 174,
        columnNumber: 5
    }, this);
}
_s(PageBuilder, "ES/9etJqvMtWcz+pAobhKZG2KEc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c = PageBuilder;
function SortableBlock({ block, selected, onSelect, flowSlug, pageId, pages, form, formEmbedded }) {
    _s1();
    const { attributes, listeners, setNodeRef, transform, transition } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
        id: block.id
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: setNodeRef,
        style: {
            transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
            transition
        },
        className: `rounded-3xl p-3 ${selected ? "ring-2 ring-noah-orange" : "ring-1 ring-transparent hover:ring-noah-ink-hairline"}`,
        onClick: onSelect,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "mb-2 cursor-grab font-body text-xs text-noah-ink-dim",
                "aria-label": "Drag to reorder",
                ...attributes,
                ...listeners,
                children: "Drag"
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 377,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$BlockBody$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BlockBody"], {
                block: block,
                flowSlug: flowSlug,
                pageId: pageId,
                pages: pages,
                preview: true,
                recaptchaSiteKey: "",
                form: form,
                formEmbedded: formEmbedded
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 371,
        columnNumber: 5
    }, this);
}
_s1(SortableBlock, "FTUh0JV0KNM2MI3tYtLrQh0rr1U=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
    ];
});
_c1 = SortableBlock;
function Inspector({ block, pages, onChange, onRemove }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-body text-xs tracking-wide text-noah-ink-dim uppercase",
                        children: block.type === "section" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECTION_CATALOG"].find((item)=>item.template === block.template)?.name ?? "Section" : block.type
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 414,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onRemove,
                        className: "text-sm text-noah-orange",
                        children: "Remove"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 413,
                columnNumber: 7
            }, this),
            block.type === "heading" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "flex flex-col gap-2 text-sm",
                        children: [
                            "Size",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                className: "contact-input contact-select",
                                value: block.level,
                                onChange: (event)=>onChange({
                                        ...block,
                                        level: Number(event.target.value)
                                    }),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 1,
                                        children: "Large"
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/PageBuilder.tsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 2,
                                        children: "Medium"
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/PageBuilder.tsx",
                                        lineNumber: 431,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: 3,
                                        children: "Small"
                                    }, void 0, false, {
                                        fileName: "[project]/components/builder/PageBuilder.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 425,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                        label: "Text",
                        value: block.text,
                        onChange: (text)=>onChange({
                                ...block,
                                text
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 435,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 422,
                columnNumber: 9
            }, this) : null,
            block.type === "text" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Text",
                value: block.text,
                rows: 8,
                onChange: (text)=>onChange({
                        ...block,
                        text
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 439,
                columnNumber: 9
            }, this) : null,
            block.type === "image" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileField, {
                        accept: "image/jpeg,image/png,image/webp,image/gif",
                        label: block.assetId ? "Replace image" : "Upload image",
                        onUploaded: (assetId)=>onChange({
                                ...block,
                                assetId
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 443,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                        label: "Alt text",
                        value: block.alt,
                        onChange: (alt)=>onChange({
                                ...block,
                                alt
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 448,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 442,
                columnNumber: 9
            }, this) : null,
            block.type === "pdf" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileField, {
                accept: "application/pdf",
                label: block.assetId ? "Replace PDF" : "Upload PDF",
                onUploaded: (assetId)=>onChange({
                        ...block,
                        assetId
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 452,
                columnNumber: 9
            }, this) : null,
            block.type === "button" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                        label: "Button text",
                        value: block.label,
                        onChange: (label)=>onChange({
                                ...block,
                                label
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 460,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageSelect, {
                        label: "Opens",
                        value: block.targetPageId,
                        pages: pages,
                        onChange: (targetPageId)=>onChange({
                                ...block,
                                targetPageId
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 461,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 459,
                columnNumber: 9
            }, this) : null,
            block.type === "form" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInspector, {
                block: block,
                pages: pages,
                onChange: onChange
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 470,
                columnNumber: 9
            }, this) : null,
            block.type === "section" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionInspector, {
                block: block,
                onChange: onChange
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 472,
                columnNumber: 35
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 412,
        columnNumber: 5
    }, this);
}
_c2 = Inspector;
function SectionInspector({ block, onChange }) {
    const fields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sectionFields"])(block.template);
    const labels = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sectionItemLabels"])(block.template);
    const name = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SECTION_CATALOG"].find((item)=>item.template === block.template)?.name ?? "Section";
    function updateItem(id, next) {
        onChange({
            ...block,
            items: block.items.map((item)=>item.id === id ? next : item)
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-sm text-noah-ink",
                children: name
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-xs leading-relaxed text-noah-ink-dim",
                children: "The layout stays as it is. Button fields change the words on the button."
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 489,
                columnNumber: 7
            }, this),
            fields.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Eyebrow",
                value: block.eyebrow,
                onChange: (eyebrow)=>onChange({
                        ...block,
                        eyebrow
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 493,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Heading",
                value: block.title,
                onChange: (title)=>onChange({
                        ...block,
                        title
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 495,
                columnNumber: 7
            }, this),
            fields.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Text",
                rows: 5,
                value: block.body,
                onChange: (body)=>onChange({
                        ...block,
                        body
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 497,
                columnNumber: 9
            }, this) : null,
            fields.heroChoice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex flex-col gap-2 text-sm",
                children: [
                    "Right side",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "contact-input contact-select",
                        value: block.heroMedia,
                        onChange: (event)=>onChange({
                                ...block,
                                heroMedia: event.target.value === "form" ? "form" : "kpi"
                            }),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "kpi",
                                children: "KPI"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 507,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "form",
                                children: "Form"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 508,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 502,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 500,
                columnNumber: 9
            }, this) : null,
            fields.button ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Button text",
                value: block.buttonLabel,
                onChange: (buttonLabel)=>onChange({
                        ...block,
                        buttonLabel
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 513,
                columnNumber: 9
            }, this) : null,
            fields.secondaryButton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Second button text",
                value: block.secondaryButtonLabel,
                onChange: (secondaryButtonLabel)=>onChange({
                        ...block,
                        secondaryButtonLabel
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 516,
                columnNumber: 9
            }, this) : null,
            fields.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FileField, {
                        accept: "image/jpeg,image/png,image/webp,image/gif",
                        label: block.imageAssetId ? "Replace image" : "Upload image",
                        onUploaded: (imageAssetId)=>onChange({
                                ...block,
                                imageAssetId
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 524,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                        label: "Image description",
                        value: block.imageAlt,
                        onChange: (imageAlt)=>onChange({
                                ...block,
                                imageAlt
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 529,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 523,
                columnNumber: 9
            }, this) : null,
            fields.items ? block.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                    className: "flex flex-col gap-3 border-t border-noah-ink-hairline pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                            className: "font-body text-sm",
                            children: [
                                labels.title,
                                " ",
                                index + 1
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 535,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                            label: labels.title,
                            value: item.title,
                            onChange: (title)=>updateItem(item.id, {
                                    ...item,
                                    title
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 538,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                            label: labels.body,
                            rows: 4,
                            value: item.body,
                            onChange: (body)=>updateItem(item.id, {
                                    ...item,
                                    body
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 539,
                            columnNumber: 15
                        }, this),
                        fields.itemButton ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                            label: "Button text",
                            value: item.button,
                            onChange: (button)=>updateItem(item.id, {
                                    ...item,
                                    button
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 541,
                            columnNumber: 17
                        }, this) : null,
                        block.items.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "text-left text-sm text-noah-orange",
                            onClick: ()=>onChange({
                                    ...block,
                                    items: block.items.filter((entry)=>entry.id !== item.id)
                                }),
                            children: "Remove"
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 544,
                            columnNumber: 17
                        }, this) : null
                    ]
                }, item.id, true, {
                    fileName: "[project]/components/builder/PageBuilder.tsx",
                    lineNumber: 534,
                    columnNumber: 13
                }, this)) : null,
            fields.items && block.items.length < 8 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "rounded-full border border-noah-ink-hairline px-4 py-2 text-sm",
                onClick: ()=>onChange({
                        ...block,
                        items: [
                            ...block.items,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(),
                                title: "",
                                body: "",
                                button: ""
                            }
                        ]
                    }),
                children: [
                    "Add ",
                    labels.title.toLowerCase()
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 556,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 487,
        columnNumber: 5
    }, this);
}
_c3 = SectionInspector;
function FormInspector({ block, pages, onChange }) {
    function updateStep(stepId, next) {
        onChange({
            ...block,
            steps: block.steps.map((step)=>step.id === stepId ? next : step)
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PageSelect, {
                label: "After submit, open",
                value: block.targetPageId,
                pages: pages,
                onChange: (targetPageId)=>onChange({
                        ...block,
                        targetPageId
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 583,
                columnNumber: 7
            }, this),
            block.steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("fieldset", {
                    className: "flex flex-col gap-3 border-t border-noah-ink-hairline pt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("legend", {
                            className: "font-body text-sm text-noah-ink",
                            children: [
                                "Step ",
                                index + 1
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 591,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                            label: "Step title",
                            value: step.title,
                            onChange: (title)=>updateStep(step.id, {
                                    ...step,
                                    title
                                })
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 592,
                            columnNumber: 11
                        }, this),
                        step.fields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldEditor, {
                                field: field,
                                onChange: (next)=>updateStep(step.id, {
                                        ...step,
                                        fields: step.fields.map((item)=>item.id === field.id ? next : item)
                                    }),
                                onRemove: step.fields.length > 1 ? ()=>updateStep(step.id, {
                                        ...step,
                                        fields: step.fields.filter((item)=>item.id !== field.id)
                                    }) : undefined
                            }, field.id, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 594,
                                columnNumber: 13
                            }, this)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "text-left text-sm text-noah-ink",
                            onClick: ()=>updateStep(step.id, {
                                    ...step,
                                    fields: [
                                        ...step.fields,
                                        {
                                            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(),
                                            type: "text",
                                            label: "New field",
                                            required: false,
                                            options: []
                                        }
                                    ]
                                }),
                            children: "Add field"
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 607,
                            columnNumber: 11
                        }, this),
                        block.steps.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            className: "text-left text-sm text-noah-orange",
                            onClick: ()=>onChange({
                                    ...block,
                                    steps: block.steps.filter((item)=>item.id !== step.id)
                                }),
                            children: "Remove step"
                        }, void 0, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 620,
                            columnNumber: 13
                        }, this) : null
                    ]
                }, step.id, true, {
                    fileName: "[project]/components/builder/PageBuilder.tsx",
                    lineNumber: 590,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "rounded-full border border-noah-ink-hairline px-4 py-2 text-sm",
                onClick: ()=>onChange({
                        ...block,
                        steps: [
                            ...block.steps,
                            {
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(),
                                title: `Step ${block.steps.length + 1}`,
                                fields: [
                                    {
                                        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["newId"])(),
                                        type: "text",
                                        label: "New field",
                                        required: false,
                                        options: []
                                    }
                                ]
                            }
                        ]
                    }),
                children: "Add step"
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 630,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 582,
        columnNumber: 5
    }, this);
}
_c4 = FormInspector;
function FieldEditor({ field, onChange, onRemove }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-2 rounded-2xl bg-white/40 p-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Label",
                value: field.label,
                onChange: (label)=>onChange({
                        ...field,
                        label
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 664,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex flex-col gap-2 text-sm",
                children: [
                    "Type",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        className: "contact-input contact-select",
                        value: field.type,
                        onChange: (event)=>{
                            const type = event.target.value;
                            onChange({
                                ...field,
                                type,
                                options: type === "select" && field.options.length === 0 ? [
                                    "Option 1",
                                    "Option 2"
                                ] : field.options
                            });
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "text",
                                children: "Text"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 679,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "email",
                                children: "Email"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 680,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "phone",
                                children: "Phone"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 681,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "textarea",
                                children: "Long text"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 682,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "select",
                                children: "Dropdown"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 683,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "checkbox",
                                children: "Checkbox"
                            }, void 0, false, {
                                fileName: "[project]/components/builder/PageBuilder.tsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 665,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "flex items-center gap-2 text-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        checked: field.required,
                        onChange: (event)=>onChange({
                                ...field,
                                required: event.target.checked
                            })
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 688,
                        columnNumber: 9
                    }, this),
                    "Required"
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 687,
                columnNumber: 7
            }, this),
            field.type === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextLabel, {
                label: "Options, one per line",
                rows: 4,
                value: field.options.join("\n"),
                onChange: (value)=>onChange({
                        ...field,
                        options: value.split("\n").map((item)=>item.trim()).filter(Boolean)
                    })
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 696,
                columnNumber: 9
            }, this) : null,
            onRemove ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onRemove,
                className: "text-left text-sm text-noah-orange",
                children: "Remove field"
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 704,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 663,
        columnNumber: 5
    }, this);
}
_c5 = FieldEditor;
function PageSelect({ label, value, pages, onChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex flex-col gap-2 text-sm",
        children: [
            label,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                className: "contact-input contact-select",
                value: value,
                onChange: (event)=>onChange(event.target.value),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                        value: "",
                        children: "Choose a page"
                    }, void 0, false, {
                        fileName: "[project]/components/builder/PageBuilder.tsx",
                        lineNumber: 727,
                        columnNumber: 9
                    }, this),
                    pages.map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: page.id,
                            children: page.title
                        }, page.id, false, {
                            fileName: "[project]/components/builder/PageBuilder.tsx",
                            lineNumber: 729,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 726,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 724,
        columnNumber: 5
    }, this);
}
_c6 = PageSelect;
function TextLabel({ label, value, onChange, rows }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex flex-col gap-2 text-sm",
        children: [
            label,
            rows ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: "contact-input contact-textarea",
                rows: rows,
                value: value,
                onChange: (event)=>onChange(event.target.value)
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 753,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                className: "contact-input",
                value: value,
                onChange: (event)=>onChange(event.target.value)
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 755,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 750,
        columnNumber: 5
    }, this);
}
_c7 = TextLabel;
function FileField({ accept, label, onUploaded }) {
    _s2();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: "flex flex-col gap-2 text-sm",
        children: [
            label,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "file",
                accept: accept,
                disabled: uploading,
                className: "text-sm",
                onChange: async (event)=>{
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (!file) return;
                    setUploading(true);
                    setError("");
                    const body = new FormData();
                    body.set("file", file);
                    const response = await fetch("/api/admin/assets", {
                        method: "POST",
                        body
                    });
                    const payload = await response.json();
                    setUploading(false);
                    if (!response.ok || !payload.id) {
                        setError(payload.error || "Upload failed.");
                        return;
                    }
                    onUploaded(payload.id);
                }
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 776,
                columnNumber: 7
            }, this),
            uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-noah-ink-dim",
                children: "Uploading"
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 799,
                columnNumber: 20
            }, this) : null,
            error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-noah-orange",
                children: error
            }, void 0, false, {
                fileName: "[project]/components/builder/PageBuilder.tsx",
                lineNumber: 800,
                columnNumber: 16
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/builder/PageBuilder.tsx",
        lineNumber: 774,
        columnNumber: 5
    }, this);
}
_s2(FileField, "nQKHV4WWU0v+yItIb+9/o3XnNVo=");
_c8 = FileField;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "PageBuilder");
__turbopack_context__.k.register(_c1, "SortableBlock");
__turbopack_context__.k.register(_c2, "Inspector");
__turbopack_context__.k.register(_c3, "SectionInspector");
__turbopack_context__.k.register(_c4, "FormInspector");
__turbopack_context__.k.register(_c5, "FieldEditor");
__turbopack_context__.k.register(_c6, "PageSelect");
__turbopack_context__.k.register(_c7, "TextLabel");
__turbopack_context__.k.register(_c8, "FileField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/BlockBody.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BlockBody",
    ()=>BlockBody
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/LandingForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$SectionView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/SectionView.tsx [app-client] (ecmascript)");
;
;
;
;
function BlockBody({ block, flowSlug, pageId, pages, preview, recaptchaSiteKey, form = null, formEmbedded = false }) {
    if (block.type === "section") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$SectionView$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            block: block,
            preview: preview,
            form: form,
            flowSlug: flowSlug,
            pageId: pageId,
            recaptchaSiteKey: recaptchaSiteKey
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    if (block.type === "form" && formEmbedded) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "font-body text-sm text-noah-ink-dim",
            children: "This form is shown in the hero. Select this block to edit its fields."
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this);
    }
    if (block.type === "heading") {
        if (!block.text && !preview) return null;
        const className = block.level === 1 ? "font-display text-4xl leading-tight text-noah-ink sm:text-5xl" : block.level === 2 ? "font-display text-3xl leading-tight text-noah-ink" : "font-display text-2xl leading-tight text-noah-ink";
        const Tag = `h${block.level}`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tag, {
            className: className,
            children: block.text || "Heading"
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 57,
            columnNumber: 12
        }, this);
    }
    if (block.type === "text") {
        if (!block.text && !preview) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
            className: "whitespace-pre-wrap font-body text-base leading-relaxed text-noah-ink-dim",
            children: block.text || "Text"
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this);
    }
    if (block.type === "image") {
        if (!block.assetId) {
            return preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim",
                children: "Add an image"
            }, void 0, false, {
                fileName: "[project]/components/landing/BlockBody.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this) : null;
        }
        return(// Files are served by our own asset route, not the image optimizer.
        // eslint-disable-next-line @next/next/no-img-element
        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: `/api/assets/${block.assetId}`,
            alt: block.alt,
            className: "w-full rounded-3xl"
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this));
    }
    if (block.type === "pdf") {
        if (!block.assetId) {
            return preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim",
                children: "Add a PDF"
            }, void 0, false, {
                fileName: "[project]/components/landing/BlockBody.tsx",
                lineNumber: 87,
                columnNumber: 9
            }, this) : null;
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
            title: "Document",
            src: `/api/assets/${block.assetId}`,
            className: "h-[75vh] w-full rounded-3xl border border-noah-ink-hairline bg-white"
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 93,
            columnNumber: 7
        }, this);
    }
    if (block.type === "button") {
        const target = pages.find((page)=>page.id === block.targetPageId);
        if (!target || !block.label) {
            return preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex h-12 items-center rounded-full bg-noah-ink/10 px-6 text-sm text-noah-ink-dim",
                children: block.label || "Button"
            }, void 0, false, {
                fileName: "[project]/components/landing/BlockBody.tsx",
                lineNumber: 105,
                columnNumber: 9
            }, this) : null;
        }
        const href = `/f/${flowSlug}/${target.slug}`;
        if (preview) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "contact-submit glass glass-pill glass-orange inline-flex h-12 items-center px-6 text-sm font-medium text-noah-cream",
                children: block.label
            }, void 0, false, {
                fileName: "[project]/components/landing/BlockBody.tsx",
                lineNumber: 113,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "contact-submit glass glass-pill glass-orange inline-flex h-12 items-center px-6 text-sm font-medium text-noah-cream",
            children: block.label
        }, void 0, false, {
            fileName: "[project]/components/landing/BlockBody.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        flowSlug: flowSlug,
        pageId: pageId,
        form: block,
        recaptchaSiteKey: recaptchaSiteKey,
        preview: preview
    }, void 0, false, {
        fileName: "[project]/components/landing/BlockBody.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_c = BlockBody;
var _c;
__turbopack_context__.k.register(_c, "BlockBody");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/LandingForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LandingForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/blocks.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utm.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function recaptchaApi() {
    return window.grecaptcha;
}
async function waitForRecaptcha() {
    const started = Date.now();
    while(!recaptchaApi()?.ready){
        if (Date.now() - started > 8000) throw new Error("Captcha could not load. Refresh and try again.");
        await new Promise((resolve)=>window.setTimeout(resolve, 80));
    }
    return new Promise((resolve)=>{
        recaptchaApi().ready(()=>resolve(recaptchaApi()));
    });
}
function LandingForm({ flowSlug, pageId, form, recaptchaSiteKey, preview = false }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [values, setValues] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [fieldErrors, setFieldErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [sending, setSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const current = form.steps[step] ?? form.steps[0];
    const last = step >= form.steps.length - 1;
    function setValue(id, value) {
        setValues((prev)=>({
                ...prev,
                [id]: value
            }));
        setFieldErrors((prev)=>{
            if (!prev[id]) return prev;
            const next = {
                ...prev
            };
            delete next[id];
            return next;
        });
    }
    function currentErrors() {
        const errors = {};
        for (const field of current.fields){
            const value = values[field.id] ?? "";
            if (field.required && (field.type === "checkbox" ? value !== "yes" : !value.trim())) {
                errors[field.id] = "This is required.";
            } else if (field.type === "email" && value.trim()) {
                const message = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$blocks$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["emailFieldError"])(value);
                if (message) errors[field.id] = message;
            }
        }
        return errors;
    }
    async function onSubmit(event) {
        event.preventDefault();
        if (sending) return;
        const errors = currentErrors();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        if (!last) {
            setStep((value)=>value + 1);
            return;
        }
        if (preview) {
            setFormError("This is a preview. Publish the flow to collect answers.");
            return;
        }
        const formElement = event.currentTarget;
        setSending(true);
        setFormError("");
        try {
            let recaptchaToken = "";
            if (recaptchaSiteKey) {
                const recaptcha = await waitForRecaptcha();
                recaptchaToken = await recaptcha.execute(recaptchaSiteKey, {
                    action: "landing"
                });
            }
            const data = new FormData(formElement);
            const response = await fetch(`/api/f/${flowSlug}/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pageId,
                    website: String(data.get("website") ?? ""),
                    recaptchaToken,
                    utm: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["readUtm"])(),
                    answers: form.steps.flatMap((item)=>item.fields.map((field)=>({
                                fieldId: field.id,
                                value: values[field.id] ?? ""
                            })))
                })
            });
            const body = await response.json();
            if (!response.ok || !body.next) {
                if (body.fieldErrors) {
                    setFieldErrors(body.fieldErrors);
                    const stepIndex = form.steps.findIndex((item)=>item.fields.some((field)=>body.fieldErrors?.[field.id]));
                    if (stepIndex >= 0) setStep(stepIndex);
                }
                setFormError(body.error || "We could not send that. Try again.");
                setSending(false);
                return;
            }
            router.push(body.next);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "We could not send that. Try again.");
            setSending(false);
        }
    }
    if (!current) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            recaptchaSiteKey && !preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "landing-recaptcha",
                src: `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`,
                strategy: "afterInteractive"
            }, void 0, false, {
                fileName: "[project]/components/landing/LandingForm.tsx",
                lineNumber: 144,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: onSubmit,
                noValidate: true,
                className: "relative flex flex-col gap-5 rounded-3xl border border-noah-ink-hairline bg-white/40 p-6 sm:p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "contact-honeypot",
                        "aria-hidden": "true",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: `${form.id}-website`,
                                children: "Website"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: `${form.id}-website`,
                                name: "website",
                                type: "text",
                                tabIndex: -1,
                                autoComplete: "off"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-baseline justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-display text-2xl text-noah-ink",
                                children: current.title
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            form.steps.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-body text-xs text-noah-ink-dim",
                                children: [
                                    "Step ",
                                    step + 1,
                                    " of ",
                                    form.steps.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    formError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "font-body text-sm text-noah-orange",
                        children: formError
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 160,
                        columnNumber: 11
                    }, this) : null,
                    current.fields.map((field)=>{
                        const inputId = `${form.id}-${field.id}`;
                        const error = fieldErrors[field.id];
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-2",
                            children: [
                                field.type === "checkbox" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    htmlFor: inputId,
                                    className: "flex items-start gap-3 font-body text-sm text-noah-ink",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: inputId,
                                            type: "checkbox",
                                            className: "mt-1",
                                            checked: values[field.id] === "yes",
                                            onChange: (event)=>setValue(field.id, event.target.checked ? "yes" : "")
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 171,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                field.label,
                                                field.required ? " *" : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 178,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 170,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            htmlFor: inputId,
                                            className: "font-body text-sm text-noah-ink",
                                            children: [
                                                field.label,
                                                field.required ? " *" : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 185,
                                            columnNumber: 19
                                        }, this),
                                        field.type === "textarea" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            id: inputId,
                                            className: "contact-input contact-textarea",
                                            value: values[field.id] ?? "",
                                            onChange: (event)=>setValue(field.id, event.target.value),
                                            "aria-invalid": Boolean(error)
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 190,
                                            columnNumber: 21
                                        }, this) : field.type === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            id: inputId,
                                            className: "contact-input contact-select",
                                            value: values[field.id] ?? "",
                                            onChange: (event)=>setValue(field.id, event.target.value),
                                            "aria-invalid": Boolean(error),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "Select one"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                                    lineNumber: 205,
                                                    columnNumber: 23
                                                }, this),
                                                field.options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: option,
                                                        children: option
                                                    }, option, false, {
                                                        fileName: "[project]/components/landing/LandingForm.tsx",
                                                        lineNumber: 207,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 198,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            id: inputId,
                                            className: "contact-input",
                                            type: field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text",
                                            value: values[field.id] ?? "",
                                            onChange: (event)=>setValue(field.id, event.target.value),
                                            "aria-invalid": Boolean(error)
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 213,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 184,
                                    columnNumber: 17
                                }, this),
                                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-body text-xs text-noah-orange",
                                    role: "alert",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 225,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, field.id, true, {
                            fileName: "[project]/components/landing/LandingForm.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this);
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            step > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                className: "h-12 flex-1 rounded-full border border-noah-ink-hairline text-sm text-noah-ink",
                                onClick: ()=>setStep((value)=>value - 1),
                                children: "Back"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 234,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: sending,
                                className: "contact-submit glass glass-pill glass-orange flex h-12 flex-1 items-center justify-center text-sm font-medium text-noah-cream disabled:opacity-60",
                                children: sending ? "Sending" : last ? "Continue" : "Next"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 242,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    recaptchaSiteKey && !preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-body text-[11px] leading-relaxed text-noah-ink-faint",
                        children: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 251,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/LandingForm.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/LandingForm.tsx",
        lineNumber: 142,
        columnNumber: 5
    }, this);
}
_s(LandingForm, "pgjvV57IuhyvCvrBXXB6noMJbPs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = LandingForm;
var _c;
__turbopack_context__.k.register(_c, "LandingForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/landing/SectionView.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SectionView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroKpi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroKpi.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/LandingForm.tsx [app-client] (ecmascript)");
;
;
;
function lines(value) {
    return value.split("\n").map((line)=>line.trim()).filter(Boolean);
}
function SlotImage({ assetId, alt, preview, className }) {
    if (!assetId) {
        if (!preview) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `flex items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim ${className}`,
            children: "Image"
        }, void 0, false, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    return(// Files are served by our own asset route, not the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
        src: `/api/assets/${assetId}`,
        alt: alt,
        className: `w-full rounded-3xl object-cover ${className}`
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this));
}
_c = SlotImage;
function OrangeButton({ label }) {
    if (!label) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: "glass glass-orange glass-pill inline-flex h-12 items-center px-7 text-sm font-medium text-white",
        children: label
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_c1 = OrangeButton;
function Hero({ block, preview, form, flowSlug, pageId, recaptchaSiteKey }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-16 sm:px-12 sm:py-24",
        children: [
            block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim",
                children: block.eyebrow
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "font-display text-4xl leading-[1.05] tracking-tight text-noah-ink sm:text-6xl",
                                children: block.title
                            }, void 0, false, {
                                fileName: "[project]/components/landing/SectionView.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            block.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg",
                                children: block.body
                            }, void 0, false, {
                                fileName: "[project]/components/landing/SectionView.tsx",
                                lineNumber: 70,
                                columnNumber: 25
                            }, this) : null,
                            block.buttonLabel || block.secondaryButtonLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-10 flex flex-wrap gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrangeButton, {
                                        label: block.buttonLabel
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/SectionView.tsx",
                                        lineNumber: 73,
                                        columnNumber: 15
                                    }, this),
                                    block.secondaryButtonLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "glass glass-pill inline-flex h-12 items-center px-7 text-sm font-medium text-noah-ink",
                                        children: block.secondaryButtonLabel
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/SectionView.tsx",
                                        lineNumber: 75,
                                        columnNumber: 17
                                    }, this) : null
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/SectionView.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/SectionView.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full max-w-md",
                        children: block.heroMedia === "form" ? form ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            flowSlug: flowSlug,
                            pageId: pageId,
                            form: form,
                            recaptchaSiteKey: recaptchaSiteKey,
                            preview: preview
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 85,
                            columnNumber: 15
                        }, this) : preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline px-6 text-center text-sm text-noah-ink-dim",
                            children: "Add a form to show it here"
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 93,
                            columnNumber: 15
                        }, this) : null : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroKpi$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/SectionView.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
_c2 = Hero;
function Feature({ block, preview }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "grid grid-cols-1 border-y border-noah-ink-hairline lg:grid-cols-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center px-6 py-16 sm:px-12 lg:border-r lg:border-noah-ink-hairline",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-lg",
                    children: [
                        block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                            children: block.eyebrow
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-4 font-display text-4xl leading-tight tracking-tight text-noah-ink sm:text-5xl",
                            children: block.title
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 114,
                            columnNumber: 11
                        }, this),
                        block.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-5 font-body text-noah-ink-dim sm:text-lg",
                            children: block.body
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 115,
                            columnNumber: 25
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 109,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center px-6 py-10 sm:px-12",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SlotImage, {
                    assetId: block.imageAssetId,
                    alt: block.imageAlt,
                    preview: preview,
                    className: "min-h-64"
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 119,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 108,
        columnNumber: 5
    }, this);
}
_c3 = Feature;
function Compare({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-20 sm:px-12",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mx-auto max-w-4xl text-center font-display text-3xl leading-[1.08] tracking-tight text-noah-ink sm:text-5xl",
                children: block.title
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-2 sm:gap-8",
                children: block.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "glass h-full rounded-[1.75rem] p-6 text-left sm:p-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-display text-2xl tracking-tight sm:text-3xl",
                                children: item.title
                            }, void 0, false, {
                                fileName: "[project]/components/landing/SectionView.tsx",
                                lineNumber: 134,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "mt-5 flex flex-col gap-3",
                                children: lines(item.body).map((line, lineIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: "flex items-start gap-3 font-body text-sm text-noah-ink-dim sm:text-base",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/SectionView.tsx",
                                                lineNumber: 138,
                                                columnNumber: 19
                                            }, this),
                                            line
                                        ]
                                    }, `${item.id}-${lineIndex}`, true, {
                                        fileName: "[project]/components/landing/SectionView.tsx",
                                        lineNumber: 137,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/landing/SectionView.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        ]
                    }, item.id, true, {
                        fileName: "[project]/components/landing/SectionView.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c4 = Compare;
function Process({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-20 sm:px-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                            children: block.eyebrow
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl",
                            children: block.title
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        block.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-4 font-body text-noah-ink-dim sm:text-lg",
                            children: block.body
                        }, void 0, false, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 159,
                            columnNumber: 25
                        }, this) : null
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 154,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
                    className: "flex flex-col",
                    children: block.items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                            className: "grid grid-cols-[3rem_1fr] gap-4 border-t border-noah-ink-hairline py-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-display text-xl text-noah-orange",
                                    children: String(index + 1).padStart(2, "0")
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "font-display text-2xl tracking-tight",
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/SectionView.tsx",
                                            lineNumber: 166,
                                            columnNumber: 17
                                        }, this),
                                        item.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mt-2 font-body text-sm text-noah-ink-dim",
                                            children: item.body
                                        }, void 0, false, {
                                            fileName: "[project]/components/landing/SectionView.tsx",
                                            lineNumber: 167,
                                            columnNumber: 30
                                        }, this) : null
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 153,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 152,
        columnNumber: 5
    }, this);
}
_c5 = Process;
function Faq({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-20 sm:px-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-3xl",
            children: [
                block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                    children: block.eyebrow
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 182,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-4 text-center font-display text-4xl tracking-tight text-noah-ink sm:text-5xl",
                    children: block.title
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10",
                    children: block.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("details", {
                            className: "group border-t border-noah-ink-hairline py-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("summary", {
                                    className: "cursor-pointer list-none font-display text-xl tracking-tight sm:text-2xl [&::-webkit-details-marker]:hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center justify-between gap-6",
                                        children: [
                                            item.title,
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-noah-orange group-open:hidden",
                                                children: "+"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/SectionView.tsx",
                                                lineNumber: 191,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden text-noah-orange group-open:inline",
                                                children: "−"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/SectionView.tsx",
                                                lineNumber: 192,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/SectionView.tsx",
                                        lineNumber: 189,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 188,
                                    columnNumber: 15
                                }, this),
                                item.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 max-w-2xl font-body text-noah-ink-dim sm:text-lg",
                                    children: item.body
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 195,
                                    columnNumber: 28
                                }, this) : null
                            ]
                        }, item.id, true, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_c6 = Faq;
function planParts(item) {
    const [price = "", audience = "", ...features] = lines(item.body);
    return {
        price,
        audience,
        features
    };
}
function Pricing({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-20 sm:px-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl text-center",
            children: [
                block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                    children: block.eyebrow
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 214,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl",
                    children: block.title
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 216,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 grid gap-4 text-left md:grid-cols-2",
                    children: block.items.map((item, index)=>{
                        const parts = planParts(item);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: `glass h-full rounded-[1.75rem] p-6 sm:p-8 ${index === 1 ? "ring-1 ring-noah-orange" : ""}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-display text-2xl tracking-tight",
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 font-display text-3xl",
                                    children: parts.price
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this),
                                parts.audience ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 font-body text-sm text-noah-ink-dim",
                                    children: parts.audience
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 227,
                                    columnNumber: 33
                                }, this) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "mt-6 flex flex-col gap-2",
                                    children: parts.features.map((feature, featureIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            className: "flex items-start gap-3 font-body text-sm text-noah-ink-dim",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/SectionView.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 21
                                                }, this),
                                                feature
                                            ]
                                        }, `${item.id}-${featureIndex}`, true, {
                                            fileName: "[project]/components/landing/SectionView.tsx",
                                            lineNumber: 230,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                item.button ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `glass glass-pill mt-8 flex h-12 items-center justify-center text-sm font-medium ${index === 1 ? "glass-orange text-noah-cream" : "text-noah-ink"}`,
                                    children: item.button
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 237,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, item.id, true, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 217,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 212,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 211,
        columnNumber: 5
    }, this);
}
_c7 = Pricing;
function proofParts(item) {
    const [figure = "", label = "", ...quote] = lines(item.body);
    return {
        figure,
        label,
        quote: quote.join(" ")
    };
}
function Proof({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-20 sm:px-12",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto max-w-5xl",
            children: [
                block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                    children: block.eyebrow
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 264,
                    columnNumber: 11
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl",
                    children: block.title
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 266,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-10 grid gap-4 md:grid-cols-2",
                    children: block.items.map((item)=>{
                        const parts = proofParts(item);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                            className: "glass flex h-full flex-col rounded-[1.75rem] p-6 sm:p-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-display text-4xl tracking-tight text-noah-ink",
                                    children: parts.figure
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 272,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-2 font-body text-sm text-noah-ink-dim",
                                    children: parts.label
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 273,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-6 font-display text-2xl tracking-tight",
                                    children: item.title
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 274,
                                    columnNumber: 17
                                }, this),
                                parts.quote ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-3 font-body text-sm leading-relaxed text-noah-ink-dim",
                                    children: parts.quote
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/SectionView.tsx",
                                    lineNumber: 275,
                                    columnNumber: 32
                                }, this) : null
                            ]
                        }, item.id, true, {
                            fileName: "[project]/components/landing/SectionView.tsx",
                            lineNumber: 271,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 267,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 262,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 261,
        columnNumber: 5
    }, this);
}
_c8 = Proof;
function Cta({ block }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-6 py-24 text-center sm:px-12 sm:py-32",
        children: [
            block.eyebrow ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim",
                children: block.eyebrow
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 289,
                columnNumber: 9
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "mx-auto mt-4 max-w-3xl font-display text-4xl tracking-tight text-noah-ink sm:text-6xl",
                children: block.title
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            block.body ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mx-auto mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg",
                children: block.body
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 292,
                columnNumber: 21
            }, this) : null,
            block.buttonLabel ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(OrangeButton, {
                    label: block.buttonLabel
                }, void 0, false, {
                    fileName: "[project]/components/landing/SectionView.tsx",
                    lineNumber: 293,
                    columnNumber: 52
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/landing/SectionView.tsx",
                lineNumber: 293,
                columnNumber: 28
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 287,
        columnNumber: 5
    }, this);
}
_c9 = Cta;
function SectionView({ block, preview, form = null, flowSlug = "", pageId = "", recaptchaSiteKey = "" }) {
    if (block.template === "hero") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Hero, {
            block: block,
            preview: preview,
            form: form,
            flowSlug: flowSlug,
            pageId: pageId,
            recaptchaSiteKey: recaptchaSiteKey
        }, void 0, false, {
            fileName: "[project]/components/landing/SectionView.tsx",
            lineNumber: 315,
            columnNumber: 7
        }, this);
    }
    if (block.template === "feature") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Feature, {
        block: block,
        preview: preview
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 325,
        columnNumber: 44
    }, this);
    if (block.template === "compare") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Compare, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 326,
        columnNumber: 44
    }, this);
    if (block.template === "process") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Process, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 327,
        columnNumber: 44
    }, this);
    if (block.template === "faq") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Faq, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 328,
        columnNumber: 40
    }, this);
    if (block.template === "pricing") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pricing, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 329,
        columnNumber: 44
    }, this);
    if (block.template === "proof") return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Proof, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 330,
        columnNumber: 42
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Cta, {
        block: block
    }, void 0, false, {
        fileName: "[project]/components/landing/SectionView.tsx",
        lineNumber: 331,
        columnNumber: 10
    }, this);
}
_c10 = SectionView;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10;
__turbopack_context__.k.register(_c, "SlotImage");
__turbopack_context__.k.register(_c1, "OrangeButton");
__turbopack_context__.k.register(_c2, "Hero");
__turbopack_context__.k.register(_c3, "Feature");
__turbopack_context__.k.register(_c4, "Compare");
__turbopack_context__.k.register(_c5, "Process");
__turbopack_context__.k.register(_c6, "Faq");
__turbopack_context__.k.register(_c7, "Pricing");
__turbopack_context__.k.register(_c8, "Proof");
__turbopack_context__.k.register(_c9, "Cta");
__turbopack_context__.k.register(_c10, "SectionView");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/blocks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FIELD_TYPES",
    ()=>FIELD_TYPES,
    "SECTION_CATALOG",
    ()=>SECTION_CATALOG,
    "SECTION_TEMPLATES",
    ()=>SECTION_TEMPLATES,
    "assignEmptyFormTarget",
    ()=>assignEmptyFormTarget,
    "blankBlocks",
    ()=>blankBlocks,
    "blocksFromAi",
    ()=>blocksFromAi,
    "clearPageTargets",
    ()=>clearPageTargets,
    "createBlock",
    ()=>createBlock,
    "createSection",
    ()=>createSection,
    "emailFieldError",
    ()=>emailFieldError,
    "formBlock",
    ()=>formBlock,
    "isFlowSlug",
    ()=>isFlowSlug,
    "newId",
    ()=>newId,
    "parseBlocks",
    ()=>parseBlocks,
    "pdfBlocks",
    ()=>pdfBlocks,
    "sectionFields",
    ()=>sectionFields,
    "sectionItemLabels",
    ()=>sectionItemLabels,
    "slugify",
    ()=>slugify,
    "starterBlocks",
    ()=>starterBlocks,
    "thankYouBlocks",
    ()=>thankYouBlocks,
    "validateAnswers",
    ()=>validateAnswers,
    "withFormTarget",
    ()=>withFormTarget
]);
const FIELD_TYPES = [
    "text",
    "email",
    "phone",
    "textarea",
    "select",
    "checkbox"
];
const SECTION_TEMPLATES = [
    "hero",
    "feature",
    "compare",
    "process",
    "faq",
    "pricing",
    "proof",
    "cta"
];
const BLOCK_TYPES = [
    "heading",
    "text",
    "image",
    "button",
    "pdf",
    "form",
    "section"
];
const MAX_BLOCKS = 40;
const MAX_SECTION_ITEMS = 8;
const MAX_STEPS = 8;
const MAX_FIELDS = 20;
const MAX_OPTIONS = 30;
function newId() {
    return globalThis.crypto.randomUUID();
}
function slugify(name) {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
    return base || "flow";
}
function isFlowSlug(value) {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 60;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function cleanText(value, max) {
    return String(value ?? "").replace(/\s+\n/g, "\n").trim().slice(0, max);
}
function field(type, label, options = []) {
    return {
        id: newId(),
        type,
        label,
        required: type !== "checkbox",
        options
    };
}
function starterBlocks() {
    return [
        {
            id: newId(),
            type: "heading",
            level: 1,
            text: "Start here"
        },
        {
            id: newId(),
            type: "form",
            targetPageId: "",
            steps: [
                {
                    id: newId(),
                    title: "Your details",
                    fields: [
                        field("text", "Name"),
                        field("email", "Email")
                    ]
                }
            ]
        },
        {
            id: newId(),
            type: "text",
            text: "Explain what the reader gets, and what happens after they send the form."
        }
    ];
}
function thankYouBlocks() {
    return [
        {
            id: newId(),
            type: "heading",
            level: 1,
            text: "Thank you"
        },
        {
            id: newId(),
            type: "text",
            text: "We have what we need. We'll be in touch."
        }
    ];
}
function pdfBlocks() {
    return [
        {
            id: newId(),
            type: "heading",
            level: 1,
            text: "Your document"
        },
        {
            id: newId(),
            type: "pdf",
            assetId: ""
        }
    ];
}
function blankBlocks() {
    return [
        {
            id: newId(),
            type: "heading",
            level: 2,
            text: "New page"
        },
        {
            id: newId(),
            type: "text",
            text: ""
        }
    ];
}
function item(title, body, button = "") {
    return {
        id: newId(),
        title,
        body,
        button
    };
}
function createSection(template) {
    const base = {
        id: newId(),
        type: "section",
        template,
        eyebrow: "",
        title: "",
        body: "",
        buttonLabel: "",
        secondaryButtonLabel: "",
        heroMedia: "kpi",
        imageAssetId: "",
        imageAlt: "",
        items: []
    };
    if (template === "hero") {
        return {
            ...base,
            eyebrow: "Process intelligence, within 24 hours.",
            title: "Noah, the right hand of every transformation manager.",
            body: "Noah interviews your teams to identify pain points, suggests tailored solutions, and guides you towards implementation.",
            buttonLabel: "Book a demo",
            secondaryButtonLabel: "Why Noah?"
        };
    }
    if (template === "feature") {
        return {
            ...base,
            eyebrow: "AI-based interviews",
            title: "Grounded in reality",
            body: "Every recommendation traces back to something a real person on your team said. Not a generic template."
        };
    }
    if (template === "compare") {
        return {
            ...base,
            title: "Big organisations only have two options for transformation.",
            items: [
                item("In-house", "Manual interviews that take weeks\nNo data to prove a problem matters\nMonths go by with nothing shipped"),
                item("Consultants", "Static advice that is outdated on arrival\nGeneric frameworks sold as custom work\nA large invoice and a slide deck")
            ]
        };
    }
    if (template === "process") {
        return {
            ...base,
            eyebrow: "A third option",
            title: "Introducing Noah.",
            body: "Noah interviews the team, maps the work, and hands back a priced roadmap.",
            items: [
                item("Interview", "The team talks through how the work actually happens."),
                item("Map", "Pain points and workarounds land on one picture."),
                item("Roadmap", "Each fix comes back with time, money, and a rank.")
            ]
        };
    }
    if (template === "faq") {
        return {
            ...base,
            eyebrow: "FAQ",
            title: "Questions, answered.",
            items: [
                item("How is this different from hiring a consultant?", "We interview the team directly and hand back priced cases. No deck, no retainer."),
                item("What does the first day look like?", "A department is interviewed in a day. By the end, the map of how it works has started."),
                item("Do you build the fix?", "We map it, price it, and rank it. You decide who builds it.")
            ]
        };
    }
    if (template === "pricing") {
        return {
            ...base,
            eyebrow: "Pricing",
            title: "Start with one department.",
            items: [
                item("One-time", "Single fee\nFor a single department\nResults within 24 hours\nUp to 20 interviews", "Get started now"),
                item("Enterprise", "Custom pricing\nFor an organisation going all in\nContinuously updated opportunities\nUnlimited interviews", "Get started now")
            ]
        };
    }
    if (template === "proof") {
        return {
            ...base,
            eyebrow: "Teams",
            title: "What came back.",
            items: [
                item("UCB", "€250k+\nconsulting saved\nThe QA team found its top opportunities in a week, instead of months with an outside firm."),
                item("Vekoma", "€350k+\nconsulting saved\nTwenty interviews in a day. A clear roadmap the next morning.")
            ]
        };
    }
    return {
        ...base,
        title: "See it on your own process.",
        body: "One department. A day of interviews. A priced roadmap the next morning.",
        buttonLabel: "Book a demo"
    };
}
function createBlock(type) {
    switch(type){
        case "heading":
            return {
                id: newId(),
                type,
                level: 2,
                text: "Heading"
            };
        case "text":
            return {
                id: newId(),
                type,
                text: ""
            };
        case "image":
            return {
                id: newId(),
                type,
                assetId: "",
                alt: ""
            };
        case "button":
            return {
                id: newId(),
                type,
                label: "Continue",
                targetPageId: ""
            };
        case "pdf":
            return {
                id: newId(),
                type,
                assetId: ""
            };
        case "form":
            return {
                id: newId(),
                type,
                targetPageId: "",
                steps: [
                    {
                        id: newId(),
                        title: "Your details",
                        fields: [
                            field("email", "Email")
                        ]
                    }
                ]
            };
        default:
            return null;
    }
}
function sectionFields(template) {
    return {
        eyebrow: template !== "compare",
        body: template === "hero" || template === "feature" || template === "process" || template === "cta",
        button: template === "hero" || template === "cta",
        secondaryButton: template === "hero",
        heroChoice: template === "hero",
        itemButton: template === "pricing",
        image: template === "feature",
        items: template === "compare" || template === "process" || template === "faq" || template === "pricing" || template === "proof"
    };
}
function sectionItemLabels(template) {
    if (template === "faq") return {
        title: "Question",
        body: "Answer"
    };
    if (template === "pricing") return {
        title: "Plan",
        body: "Price on the first line, then one point per line"
    };
    if (template === "proof") return {
        title: "Company",
        body: "Figure, then the label, then the quote"
    };
    if (template === "compare") return {
        title: "Option",
        body: "Points, one per line"
    };
    return {
        title: "Step",
        body: "Detail"
    };
}
const SECTION_CATALOG = [
    {
        template: "hero",
        name: "Hero",
        detail: "Opening line, button text, and the KPI or a form."
    },
    {
        template: "feature",
        name: "Feature",
        detail: "Text beside an image."
    },
    {
        template: "compare",
        name: "Two options",
        detail: "A heading and two glass cards."
    },
    {
        template: "process",
        name: "Process",
        detail: "Numbered steps under a heading."
    },
    {
        template: "faq",
        name: "FAQ",
        detail: "Questions that open to an answer."
    },
    {
        template: "pricing",
        name: "Pricing",
        detail: "Plan cards with a price and a list."
    },
    {
        template: "proof",
        name: "Proof",
        detail: "A company, a figure, and a quote."
    },
    {
        template: "cta",
        name: "Closing",
        detail: "A last heading and a button."
    }
];
function formBlock(blocks) {
    return blocks.find((block)=>block.type === "form") ?? null;
}
function clearPageTargets(blocks, pageId) {
    return blocks.map((block)=>{
        if ((block.type === "button" || block.type === "form") && block.targetPageId === pageId) {
            return {
                ...block,
                targetPageId: ""
            };
        }
        return block;
    });
}
function withFormTarget(blocks, targetPageId) {
    return blocks.map((block)=>block.type === "form" ? {
            ...block,
            targetPageId
        } : block);
}
function assignEmptyFormTarget(blocks, targetPageId) {
    let changed = false;
    const next = blocks.map((block)=>{
        if (!changed && block.type === "form" && !block.targetPageId) {
            changed = true;
            return {
                ...block,
                targetPageId
            };
        }
        return block;
    });
    return {
        blocks: next,
        changed
    };
}
function parseBlocks(input) {
    if (!Array.isArray(input)) return {
        ok: false,
        error: "Page content must be a list of blocks."
    };
    if (input.length > MAX_BLOCKS) return {
        ok: false,
        error: "A page can have at most 40 blocks."
    };
    const blocks = [];
    const ids = new Set();
    let forms = 0;
    for (const raw of input){
        if (!isRecord(raw) || typeof raw.type !== "string") {
            return {
                ok: false,
                error: "A block is missing its type."
            };
        }
        if (!BLOCK_TYPES.includes(raw.type)) {
            return {
                ok: false,
                error: "That block type is not supported."
            };
        }
        const id = typeof raw.id === "string" && raw.id.length > 0 && raw.id.length <= 80 ? raw.id : "";
        if (!id || ids.has(id)) return {
            ok: false,
            error: "Each block needs its own id."
        };
        ids.add(id);
        if (raw.type === "heading") {
            const level = Number(raw.level);
            if (level !== 1 && level !== 2 && level !== 3) {
                return {
                    ok: false,
                    error: "A heading needs a level from 1 to 3."
                };
            }
            blocks.push({
                id,
                type: "heading",
                level,
                text: cleanText(raw.text, 200)
            });
            continue;
        }
        if (raw.type === "text") {
            blocks.push({
                id,
                type: "text",
                text: cleanText(raw.text, 5000)
            });
            continue;
        }
        if (raw.type === "image") {
            blocks.push({
                id,
                type: "image",
                assetId: cleanText(raw.assetId, 80),
                alt: cleanText(raw.alt, 180)
            });
            continue;
        }
        if (raw.type === "button") {
            blocks.push({
                id,
                type: "button",
                label: cleanText(raw.label, 80),
                targetPageId: cleanText(raw.targetPageId, 80)
            });
            continue;
        }
        if (raw.type === "pdf") {
            blocks.push({
                id,
                type: "pdf",
                assetId: cleanText(raw.assetId, 80)
            });
            continue;
        }
        if (raw.type === "section") {
            const parsed = parseSection(raw, ids);
            if (!parsed.ok) return parsed;
            blocks.push(parsed.block);
            continue;
        }
        forms += 1;
        if (forms > 1) return {
            ok: false,
            error: "A page can have one form."
        };
        const parsed = parseForm(raw, ids);
        if (!parsed.ok) return parsed;
        blocks.push({
            id,
            type: "form",
            targetPageId: cleanText(raw.targetPageId, 80),
            steps: parsed.steps
        });
    }
    return {
        ok: true,
        blocks
    };
}
function parseSection(raw, ids) {
    if (!SECTION_TEMPLATES.includes(raw.template)) {
        return {
            ok: false,
            error: "That section template is not supported."
        };
    }
    if (!Array.isArray(raw.items)) return {
        ok: false,
        error: "A section is missing its items."
    };
    if (raw.items.length > MAX_SECTION_ITEMS) {
        return {
            ok: false,
            error: "A section can have at most 8 items."
        };
    }
    const items = [];
    for (const itemRaw of raw.items){
        if (!isRecord(itemRaw)) return {
            ok: false,
            error: "A section item is incomplete."
        };
        const id = typeof itemRaw.id === "string" ? itemRaw.id : "";
        if (!id || id.length > 80 || ids.has(id)) return {
            ok: false,
            error: "Each section item needs its own id."
        };
        ids.add(id);
        items.push({
            id,
            title: cleanText(itemRaw.title, 160),
            body: cleanText(itemRaw.body, 2000),
            button: cleanText(itemRaw.button, 80)
        });
    }
    const id = typeof raw.id === "string" ? raw.id : "";
    return {
        ok: true,
        block: {
            id,
            type: "section",
            template: raw.template,
            eyebrow: cleanText(raw.eyebrow, 160),
            title: cleanText(raw.title, 240),
            body: cleanText(raw.body, 2000),
            buttonLabel: cleanText(raw.buttonLabel, 80),
            secondaryButtonLabel: cleanText(raw.secondaryButtonLabel, 80),
            heroMedia: raw.heroMedia === "form" ? "form" : "kpi",
            imageAssetId: cleanText(raw.imageAssetId, 80),
            imageAlt: cleanText(raw.imageAlt, 180),
            items
        }
    };
}
function parseForm(raw, ids) {
    if (!Array.isArray(raw.steps) || raw.steps.length === 0) {
        return {
            ok: false,
            error: "A form needs at least one step."
        };
    }
    if (raw.steps.length > MAX_STEPS) return {
        ok: false,
        error: "A form can have at most 8 steps."
    };
    const steps = [];
    for (const stepRaw of raw.steps){
        if (!isRecord(stepRaw)) return {
            ok: false,
            error: "A form step is incomplete."
        };
        const id = typeof stepRaw.id === "string" ? stepRaw.id : "";
        if (!id || id.length > 80 || ids.has(id)) return {
            ok: false,
            error: "Each form step needs its own id."
        };
        ids.add(id);
        if (!Array.isArray(stepRaw.fields) || stepRaw.fields.length === 0) {
            return {
                ok: false,
                error: "Each form step needs a field."
            };
        }
        if (stepRaw.fields.length > MAX_FIELDS) {
            return {
                ok: false,
                error: "A form step can have at most 20 fields."
            };
        }
        const fields = [];
        for (const fieldRaw of stepRaw.fields){
            const parsed = parseField(fieldRaw, ids);
            if (!parsed.ok) return parsed;
            fields.push(parsed.field);
        }
        steps.push({
            id,
            title: cleanText(stepRaw.title, 120) || "Step",
            fields
        });
    }
    return {
        ok: true,
        steps
    };
}
function parseField(raw, ids) {
    if (!isRecord(raw)) return {
        ok: false,
        error: "A form field is incomplete."
    };
    const id = typeof raw.id === "string" ? raw.id : "";
    if (!id || id.length > 80 || ids.has(id)) return {
        ok: false,
        error: "Each form field needs its own id."
    };
    ids.add(id);
    if (!FIELD_TYPES.includes(raw.type)) {
        return {
            ok: false,
            error: "That field type is not supported."
        };
    }
    const type = raw.type;
    const label = cleanText(raw.label, 120);
    if (!label) return {
        ok: false,
        error: "Every field needs a label."
    };
    let options = [];
    if (type === "select") {
        if (!Array.isArray(raw.options)) return {
            ok: false,
            error: "A dropdown needs options."
        };
        options = raw.options.map((option)=>cleanText(option, 80)).filter(Boolean);
        if (options.length === 0 || options.length > MAX_OPTIONS) {
            return {
                ok: false,
                error: "A dropdown needs between 1 and 30 options."
            };
        }
    }
    return {
        ok: true,
        field: {
            id,
            type,
            label,
            required: raw.required === true,
            options
        }
    };
}
function blocksFromAi(input) {
    let raw = input;
    if (typeof raw === "string") {
        const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
        try {
            raw = JSON.parse(trimmed);
        } catch  {
            return {
                ok: false,
                error: "The model did not return blocks."
            };
        }
    }
    const list = Array.isArray(raw) ? raw : isRecord(raw) && Array.isArray(raw.blocks) ? raw.blocks : null;
    if (!list) return {
        ok: false,
        error: "The model did not return blocks."
    };
    const prepared = list.slice(0, 8).flatMap((item)=>{
        if (!isRecord(item) || typeof item.type !== "string") return [];
        if (item.type === "image" || item.type === "pdf" || item.type === "section") return [];
        if (!BLOCK_TYPES.includes(item.type)) return [];
        return [
            stampIds(item)
        ];
    });
    if (prepared.length === 0) {
        return {
            ok: false,
            error: "Ask for headings, text, a button, or a form. Images and PDFs are added from the insert panel."
        };
    }
    return parseBlocks(prepared);
}
function stampIds(block) {
    const next = {
        ...block,
        id: newId()
    };
    if (block.type !== "form" || !Array.isArray(block.steps)) return next;
    next.steps = block.steps.map((step)=>{
        if (!isRecord(step)) return step;
        const fields = Array.isArray(step.fields) ? step.fields : [];
        return {
            ...step,
            id: newId(),
            fields: fields.map((item)=>isRecord(item) ? {
                    ...item,
                    id: newId()
                } : item)
        };
    });
    return next;
}
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_EMAIL_DOMAINS = new Set([
    "gmail.com",
    "googlemail.com",
    "yahoo.com",
    "yahoo.co.uk",
    "yahoo.fr",
    "ymail.com",
    "hotmail.com",
    "hotmail.co.uk",
    "outlook.com",
    "live.com",
    "msn.com",
    "icloud.com",
    "me.com",
    "mac.com",
    "aol.com",
    "proton.me",
    "protonmail.com",
    "pm.me",
    "gmx.com",
    "gmx.net",
    "mail.com",
    "zoho.com",
    "yandex.com",
    "yandex.ru",
    "qq.com",
    "163.com",
    "fastmail.com",
    "tutanota.com",
    "tuta.com",
    "hey.com",
    "duck.com"
]);
function emailFieldError(value) {
    const email = value.trim().toLowerCase();
    if (!email) return "";
    if (!EMAIL.test(email)) return "Enter a valid email.";
    if (email.includes("test")) return "Use a business email. A test address cannot continue.";
    const domain = email.slice(email.lastIndexOf("@") + 1);
    if (PUBLIC_EMAIL_DOMAINS.has(domain)) return "Use a business email, not a public one.";
    return "";
}
function validateAnswers(form, input) {
    const provided = new Map();
    if (Array.isArray(input)) {
        for (const item of input){
            if (!isRecord(item) || typeof item.fieldId !== "string") continue;
            provided.set(item.fieldId, cleanText(item.value, 4000));
        }
    }
    const fieldErrors = {};
    const answers = [];
    for (const step of form.steps){
        for (const item of step.fields){
            const value = provided.get(item.id) ?? "";
            if (item.type === "checkbox") {
                const checked = value === "yes";
                if (item.required && !checked) fieldErrors[item.id] = "This is required.";
                answers.push({
                    fieldId: item.id,
                    label: item.label,
                    value: checked ? "yes" : ""
                });
                continue;
            }
            if (item.required && !value) {
                fieldErrors[item.id] = "This is required.";
            } else if (value && item.type === "email") {
                const message = emailFieldError(value);
                if (message) fieldErrors[item.id] = message;
            } else if (value && item.type === "phone" && value.replace(/\D/g, "").length < 6) {
                fieldErrors[item.id] = "Enter a phone number.";
            } else if (value && item.type === "select" && !item.options.includes(value)) {
                fieldErrors[item.id] = "Choose one of the options.";
            }
            answers.push({
                fieldId: item.id,
                label: item.label,
                value
            });
        }
    }
    if (Object.keys(fieldErrors).length > 0) {
        return {
            ok: false,
            error: "Check the highlighted fields.",
            fieldErrors
        };
    }
    return {
        ok: true,
        answers
    };
}
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

//# sourceMappingURL=_097nf72._.js.map
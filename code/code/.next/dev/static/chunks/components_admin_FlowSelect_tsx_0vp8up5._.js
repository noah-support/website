(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/admin/FlowSelect.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FlowSelect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function FlowSelect({ flows, value }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const listId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"])();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "FlowSelect.useMemo[options]": ()=>{
            const all = [
                {
                    id: "",
                    name: "All flows"
                },
                ...flows
            ];
            const needle = query.trim().toLowerCase();
            if (!needle) return all;
            return all.filter({
                "FlowSelect.useMemo[options]": (flow)=>flow.name.toLowerCase().includes(needle)
            }["FlowSelect.useMemo[options]"]);
        }
    }["FlowSelect.useMemo[options]"], [
        flows,
        query
    ]);
    const current = flows.find((flow)=>flow.id === value)?.name ?? "All flows";
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FlowSelect.useEffect": ()=>{
            function onPointer(event) {
                if (!rootRef.current?.contains(event.target)) setOpen(false);
            }
            window.addEventListener("pointerdown", onPointer);
            return ({
                "FlowSelect.useEffect": ()=>window.removeEventListener("pointerdown", onPointer)
            })["FlowSelect.useEffect"];
        }
    }["FlowSelect.useEffect"], []);
    function choose(id) {
        setOpen(false);
        setQuery("");
        const href = id ? `/admin/submissions?flow=${id}` : "/admin/submissions";
        router.push(href);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: "relative w-full max-w-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "mb-2 block font-body text-xs tracking-wide text-noah-ink-dim uppercase",
                htmlFor: `${listId}-input`,
                children: "Flow"
            }, void 0, false, {
                fileName: "[project]/components/admin/FlowSelect.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: `${listId}-input`,
                role: "combobox",
                "aria-expanded": open,
                "aria-controls": listId,
                "aria-autocomplete": "list",
                value: open ? query : current,
                placeholder: "Search flows",
                onFocus: ()=>{
                    setOpen(true);
                    setQuery("");
                },
                onChange: (event)=>{
                    setQuery(event.target.value);
                    setOpen(true);
                },
                onKeyDown: (event)=>{
                    if (event.key === "Escape") setOpen(false);
                    if (event.key === "Enter" && options[0]) {
                        event.preventDefault();
                        choose(options[0].id);
                    }
                },
                className: "contact-input"
            }, void 0, false, {
                fileName: "[project]/components/admin/FlowSelect.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: listId,
                role: "listbox",
                className: "absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-noah-ink-hairline bg-noah-cream py-1 shadow-lg",
                children: options.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "px-3 py-2 font-body text-sm text-noah-ink-dim",
                    children: "No matching flow"
                }, void 0, false, {
                    fileName: "[project]/components/admin/FlowSelect.tsx",
                    lineNumber: 74,
                    columnNumber: 13
                }, this) : options.map((flow)=>{
                    const selected = flow.id === value;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "option",
                        "aria-selected": selected,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>choose(flow.id),
                            className: `w-full px-3 py-2 text-left text-sm ${selected ? "text-noah-ink" : "text-noah-ink-dim hover:text-noah-ink"}`,
                            children: flow.name
                        }, void 0, false, {
                            fileName: "[project]/components/admin/FlowSelect.tsx",
                            lineNumber: 80,
                            columnNumber: 19
                        }, this)
                    }, flow.id || "all", false, {
                        fileName: "[project]/components/admin/FlowSelect.tsx",
                        lineNumber: 79,
                        columnNumber: 17
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/components/admin/FlowSelect.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this) : null
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin/FlowSelect.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
}
_s(FlowSelect, "r07WfA5Q4rDnDeFLDk9IWKdi7VY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]
    ];
});
_c = FlowSelect;
var _c;
__turbopack_context__.k.register(_c, "FlowSelect");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_admin_FlowSelect_tsx_0vp8up5._.js.map
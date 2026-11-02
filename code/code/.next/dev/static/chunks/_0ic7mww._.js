(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
]);

//# sourceMappingURL=_0ic7mww._.js.map
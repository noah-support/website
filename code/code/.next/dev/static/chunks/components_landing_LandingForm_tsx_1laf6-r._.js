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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utm$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utm.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
                lineNumber: 141,
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
                                lineNumber: 145,
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
                                lineNumber: 146,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 144,
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
                                lineNumber: 149,
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
                                lineNumber: 151,
                                columnNumber: 13
                            }, this) : null
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    formError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        role: "alert",
                        className: "font-body text-sm text-noah-orange",
                        children: formError
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 157,
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
                                            lineNumber: 168,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: [
                                                field.label,
                                                field.required ? " *" : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 175,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 167,
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
                                            lineNumber: 182,
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
                                            lineNumber: 187,
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
                                                    lineNumber: 202,
                                                    columnNumber: 23
                                                }, this),
                                                field.options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: option,
                                                        children: option
                                                    }, option, false, {
                                                        fileName: "[project]/components/landing/LandingForm.tsx",
                                                        lineNumber: 204,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingForm.tsx",
                                            lineNumber: 195,
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
                                            lineNumber: 210,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 181,
                                    columnNumber: 17
                                }, this),
                                error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-body text-xs text-noah-orange",
                                    role: "alert",
                                    children: error
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/LandingForm.tsx",
                                    lineNumber: 222,
                                    columnNumber: 17
                                }, this) : null
                            ]
                        }, field.id, true, {
                            fileName: "[project]/components/landing/LandingForm.tsx",
                            lineNumber: 165,
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
                                lineNumber: 231,
                                columnNumber: 13
                            }, this) : null,
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: sending,
                                className: "contact-submit glass glass-pill glass-orange flex h-12 flex-1 items-center justify-center text-sm font-medium text-noah-cream disabled:opacity-60",
                                children: sending ? "Sending" : last ? "Continue" : "Next"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingForm.tsx",
                                lineNumber: 239,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    recaptchaSiteKey && !preview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-body text-[11px] leading-relaxed text-noah-ink-faint",
                        children: "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply."
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingForm.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this) : null
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/LandingForm.tsx",
                lineNumber: 143,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/LandingForm.tsx",
        lineNumber: 139,
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
]);

//# sourceMappingURL=components_landing_LandingForm_tsx_1laf6-r._.js.map
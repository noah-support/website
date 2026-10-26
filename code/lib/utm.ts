// Keeps UTM tags for the browser session so a visitor can land on one page
// and submit a form on another.

const STORAGE_KEY = "utm_params";

export function captureUtm() {
  const found: Record<string, string> = {};
  new URLSearchParams(window.location.search).forEach((value, key) => {
    if (key.startsWith("utm_")) found[key] = value;
  });
  if (Object.keys(found).length === 0) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
  } catch {
    // Storage blocked: the submit falls back to {}.
  }
}

export function readUtm(): Record<string, string> {
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? "{}");
    return typeof stored === "object" && stored !== null && !Array.isArray(stored)
      ? stored
      : {};
  } catch {
    return {};
  }
}

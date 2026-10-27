// Sends errors that happen in users' browsers to the logClientError function
// (Cloud Logging), so a failure someone hits in production can be diagnosed
// without asking them for screenshots. Only active in real deployed builds —
// local dev and the emulator just keep logging to the console.
// In the Android app the same errors also go to Firebase Crashlytics as
// non-fatal reports.
import { FirebaseCrashlytics } from "@capacitor-firebase/crashlytics";
import { callFunction, firebaseReady } from "./firebase";
import { isNativeApp } from "./platform";

const enabled = import.meta.env.PROD && import.meta.env.VITE_USE_EMULATORS !== "1" && firebaseReady;
const MAX_PER_SESSION = 20;
const sent = new Set();

/** Reports an error once per session per distinct message; never throws. */
export function reportError(err, where = "") {
  console.error(`[${where || "error"}]`, err);
  if (!enabled || sent.size >= MAX_PER_SESSION) return;
  const message = err?.message || String(err);
  const key = `${where}|${err?.code || ""}|${message}`;
  if (sent.has(key)) return;
  sent.add(key);
  callFunction("logClientError", {
    where,
    message,
    name: err?.name,
    code: err?.code,
    stack: err?.stack,
    url: window.location.pathname,
    userAgent: navigator.userAgent,
    release: __APP_RELEASE__,
  }).catch(() => {});
  if (isNativeApp) recordNativeException(message, where, err?.stack);
}

/** Turns a V8 (Android WebView) stack string into the StackFrame[] shape the
 * Crashlytics plugin expects: "at fn (file:line:col)" or "at file:line:col". */
function parseStack(stack) {
  if (typeof stack !== "string") return undefined;
  const frames = [];
  for (const line of stack.split("\n")) {
    const m = line.match(/^\s*at (?:(.+?) \()?(.+?):(\d+):\d+\)?\s*$/);
    if (m) frames.push({ functionName: m[1] || "<anonymous>", fileName: m[2], lineNumber: Number(m[3]) });
  }
  return frames.length ? frames : undefined;
}

/** Best-effort: a Crashlytics failure must never break or re-enter reportError. */
function recordNativeException(message, where, stack) {
  try {
    const options = { message, keysAndValues: [{ key: "where", value: where || "error", type: "string" }] };
    const stacktrace = parseStack(stack);
    if (stacktrace) options.stacktrace = stacktrace;
    FirebaseCrashlytics.recordException(options).catch(() => {});
  } catch {
    // ignore
  }
}

/** Catches anything nobody else handled — uncaught errors and rejected
 * promises — anywhere in the app. */
export function installGlobalErrorHandlers() {
  window.addEventListener("error", (e) => reportError(e.error || e.message, "window.onerror"));
  window.addEventListener("unhandledrejection", (e) => reportError(e.reason, "unhandledrejection"));
}

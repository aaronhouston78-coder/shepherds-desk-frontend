import { useState } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { Logo, Field, ErrorBanner } from "../components/ui.jsx";
import { C } from "../lib/tokens.js";

export function AuthScreen({ onSuccess, notice }) {
  const [mode, setMode]               = useState("login");
  const [form, setForm]               = useState({ name: "", email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading]         = useState(false);
  // After successful registration — show "check your email" instead of transitioning
  const [registered, setRegistered]   = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const { login, register } = useAuth();

  const set = (field) => (val) => {
    setForm((f) => ({ ...f, [field]: val }));
    if (fieldErrors[field]) setFieldErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    setGlobalError("");
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.password) {
      e.password = "Password is required.";
    } else if (mode === "signup" && form.password.length < 8) {
      e.password = "Password must be at least 8 characters.";
    }
    return e;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setLoading(true);
    setGlobalError("");

    try {
      if (mode === "login") {
        // Login: go straight to the app
        await login(form.email, form.password);
        onSuccess();
      } else {
        // Register: show verification confirmation — do NOT call onSuccess() yet
        await register(form.name, form.email, form.password);
        setRegisteredEmail(form.email);
        setRegistered(true);
      }
    } catch (err) {
      setGlobalError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setFieldErrors({});
    setGlobalError("");
    setRegistered(false);
    setRegisteredEmail("");
  };

  // ── Post-registration: check your email ─────────────────────────────────────
  if (registered) {
    return (
      <div style={{ minHeight: "100vh", background: C.navy, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "24px 40px", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
          <Logo light />
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
          <div className="fade-in" style={{ background: C.white, borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 440, boxShadow: "0 24px 80px rgba(0,0,0,0.3)", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, background: C.goldPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>
              ✉
            </div>
            <h2 className="serif" style={{ fontSize: 28, fontWeight: 700, color: C.navy, marginBottom: 10 }}>
              Check your email
            </h2>
            <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 8, lineHeight: 1.6 }}>
              Your account has been created. We sent a verification link to:
            </p>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 24 }}>
              {registeredEmail}
            </p>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 28, lineHeight: 1.6 }}>
              Click the link in that email to verify your address, then sign in to choose your plan and get started.
            </p>
            <button
              className="sd-btn-primary"
              onClick={() => { setRegistered(false); setMode("login"); setForm({ name: "", email: registeredEmail, password: "" }); }}
              style={{ width: "100%", padding: "13px", fontSize: 15 }}
            >
              Go to Sign In
            </button>
            <p style={{ marginTop: 16, fontSize: 13, color: C.textMuted }}>
              Didn't receive it?{" "}
              <span
                onClick={async () => {
                  // Trigger a resend — user is already registered so token exists
                  // We redirect them to login and they can use "resend" from the banner
                  setRegistered(false);
                  setMode("login");
                  setForm({ name: "", email: registeredEmail, password: "" });
                }}
                style={{ color: C.gold, cursor: "pointer", fontWeight: 500 }}
              >
                Sign in to resend
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Login / signup form ───────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.navy, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "24px 40px", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <Logo light />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div
          className="fade-in"
          style={{ background: C.white, borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 440, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}
        >
          {notice && (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "10px 14px", marginBottom: 24 }}>
              <p style={{ color: "#92400E", fontSize: 13, lineHeight: 1.5 }}>{notice}</p>
            </div>
          )}

          <h2 className="serif" style={{ fontSize: 30, fontWeight: 700, color: C.navy, marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>
            {mode === "login"
              ? "Sign in to your Shepherd's Desk account."
              : "Create your account and choose a plan to get started."}
          </p>

          <ErrorBanner message={globalError} onDismiss={() => setGlobalError("")} />

          {mode === "signup" && (
            <Field
              label="Full Name" id="name" value={form.name}
              onChange={set("name")} placeholder="Pastor John Smith"
              required error={fieldErrors.name}
            />
          )}
          <Field
            label="Email Address" id="email" type="email" value={form.email}
            onChange={set("email")} placeholder="you@yourchurch.org"
            required error={fieldErrors.email}
          />
          <Field
            label="Password" id="password" type="password" value={form.password}
            onChange={set("password")} placeholder="..."
            required error={fieldErrors.password}
          />

          <button
            className="sd-btn-primary"
            onClick={handleSubmit}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={loading}
            style={{ width: "100%", padding: "14px", fontSize: 15, marginTop: 8 }}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: C.textMuted }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={switchMode} style={{ color: C.gold, fontWeight: 500, cursor: "pointer" }}>
              {mode === "login" ? "Create one" : "Sign in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./hooks/useAuth.jsx";
import { api, SessionExpiredError } from "./lib/api.js";
import { Homepage }      from "./pages/Homepage.jsx";
import { AuthScreen }    from "./pages/AuthScreen.jsx";
import { Dashboard }     from "./pages/Dashboard.jsx";
import { GeneratorPage } from "./pages/GeneratorPage.jsx";
import { SavedPage }     from "./pages/SavedPage.jsx";
import { TemplatesPage } from "./pages/TemplatesPage.jsx";
import { SettingsPage }  from "./pages/SettingsPage.jsx";
import { AppShell }      from "./components/AppShell.jsx";
import { C }             from "./lib/tokens.js";

export function App() {
  const {
    user, loading, sessionMessage, logout,
    pendingVerification, dismissVerification, resendVerification,
  } = useAuth();

  const [screen, setScreen]           = useState("home");
  const [activePage, setActivePage]   = useState("dashboard");
  const [activeTool, setActiveTool]   = useState(null);
  const [prefillForm, setPrefillForm] = useState(null);
  const [savedCount, setSavedCount]   = useState(0);
  const [pendingPlanId, setPendingPlanId] = useState(null);

  // Handle special URL paths on initial load
  useEffect(() => {
    const params   = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;

    // /verify-email?token=xxx — email verification link
    if (pathname === "/verify-email" || (params.has("token") && !pathname.startsWith("/billing"))) {
      const token = params.get("token");
      if (token) {
        api.auth.verifyEmail(token)
          .then(() => {
            window.history.replaceState({}, "", "/");
            setScreen("auth");
          })
          .catch(() => {
            window.history.replaceState({}, "", "/");
            setScreen("auth");
          });
      }
      return;
    }

    // /billing/success — Stripe redirected here after successful checkout
    // The webhook will have already updated the user's plan. Force a session refresh.
    if (pathname === "/billing/success") {
      window.history.replaceState({}, "", "/");
      // If user is logged in, refresh their session to pick up the new plan
      if (localStorage.getItem("sd_token")) {
        api.auth.me()
          .then(({ user: freshUser }) => {
            // Trigger a full re-render by updating user state via a page reload
            // (simpler than threading setUser through this component)
            window.location.href = "/";
          })
          .catch(() => { window.location.href = "/"; });
      }
      return;
    }

    // /billing/cancel — user cancelled checkout, just clean the URL
    if (pathname === "/billing/cancel") {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    if (!loading && user) setScreen("app");
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user && screen === "app") setScreen("auth");
  }, [user, loading, screen]);

  useEffect(() => {
    if (!user) { setSavedCount(0); return; }
    api.generators.getSavedCount()
      .then(({ count }) => setSavedCount(count))
      .catch((err) => {
        if (err instanceof SessionExpiredError) logout("Your session expired. Please sign in again.");
      });
  }, [user, logout]);

  const handleSaved = useCallback(() => {
    api.generators.getSavedCount()
      .then(({ count }) => setSavedCount(count))
      .catch(() => setSavedCount((c) => c + 1));
  }, []);

  const handleSetPage = useCallback((page) => {
    setActivePage(page);
    setActiveTool(null);
    setPrefillForm(null);
    if (page === "saved") {
      api.generators.getSavedCount().then(({ count }) => setSavedCount(count)).catch(() => {});
    }
  }, []);

  // When a plan button is clicked on the Homepage while not logged in:
  // store the plan and send to auth. After login, settings page shows their plan.
  const handleSubscribeFromHome = useCallback((planId) => {
    setPendingPlanId(planId);
    setScreen("auth");
  }, []);

  const handleSelectTool = useCallback((toolId, formData = null) => {
    setActiveTool(toolId);
    setPrefillForm(formData || null);
    setActivePage("tool");
  }, []);

  // ── Loading splash ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: C.navy, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, background: C.gold, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ color: C.navy, fontSize: 18, fontWeight: 700 }}>+</span>
          </div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return <Homepage onGetStarted={() => setScreen("auth")} onSubscribe={handleSubscribeFromHome} />;
  }

  if (screen === "auth" || !user) {
    return <AuthScreen onSuccess={() => setScreen("app")} notice={sessionMessage} />;
  }

  return (
    <>
      {/* Email verification banner — shown until user verifies or dismisses */}
      {pendingVerification && user && !user.emailVerified && (
        <VerificationBanner
          email={user.email}
          onResend={resendVerification}
          onDismiss={dismissVerification}
        />
      )}

      <AppShell activePage={activePage} setPage={handleSetPage} savedCount={savedCount}
        bannerOffset={pendingVerification && user && !user.emailVerified ? 44 : 0}>
        {activePage === "dashboard" && (
          <Dashboard onSelectTool={handleSelectTool} />
        )}
        {activePage === "tool" && activeTool && (
          <GeneratorPage
            key={`${activeTool}-${JSON.stringify(prefillForm)}`}
            toolId={activeTool}
            prefillForm={prefillForm}
            onBack={() => handleSetPage("dashboard")}
            onSaved={handleSaved}
          />
        )}
        {activePage === "saved" && (
          <SavedPage onCountChange={setSavedCount} />
        )}
        {activePage === "templates" && (
          <TemplatesPage onUseTemplate={handleSelectTool} />
        )}
        {activePage === "settings" && (
          <SettingsPage />
        )}
      </AppShell>
    </>
  );
}

// ── Verification banner component ─────────────────────────────────────────────

function VerificationBanner({ email, onResend, onDismiss }) {
  const [resendState, setResendState] = useState("idle"); // idle | sending | sent | error

  const handleResend = async () => {
    setResendState("sending");
    try {
      await onResend();
      setResendState("sent");
    } catch {
      setResendState("error");
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: "#1B2B4B", borderBottom: "2px solid #C9A84C",
      padding: "10px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, flexWrap: "wrap",
    }}>
      <p style={{ margin: 0, fontSize: 13, color: "#F5EDD8", lineHeight: 1.5 }}>
        <strong style={{ color: "#C9A84C" }}>Check your email.</strong>{" "}
        We sent a verification link to <strong>{email}</strong>. Verify your address to secure your account.
      </p>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
        {resendState === "sent" ? (
          <span style={{ fontSize: 12, color: "#C9A84C" }}>Email sent.</span>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendState === "sending"}
            style={{
              background: "transparent", border: "1px solid #C9A84C",
              color: "#C9A84C", borderRadius: 6, padding: "5px 12px",
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {resendState === "sending" ? "Sending..." : resendState === "error" ? "Try again" : "Resend email"}
          </button>
        )}
        <button
          onClick={onDismiss}
          style={{
            background: "transparent", border: "none",
            color: "rgba(255,255,255,0.4)", fontSize: 18, lineHeight: 1,
            cursor: "pointer", padding: "0 4px",
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth.jsx";
import { api } from "../lib/api.js";
import { C } from "../lib/tokens.js";
import { Field, ErrorBanner } from "../components/ui.jsx";

const PLAN_LABELS = {
  pending: "No Active Plan",
  trial:   "No Active Plan",
  starter: "Starter",
  growth:  "Growth",
  team:    "Church Team",
  owner:   "Owner",
};

const PLAN_DESCRIPTIONS = {
  starter: "40 credits per month · All core tools · Saved outputs · Templates",
  growth:  "140 credits per month · All tools · Templates · Priority support",
  team:    "300 credits per month · Full access for ministry teams · 5 seats",
  owner:   "Unlimited access · All tools · All features",
};

const UPGRADE_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || "hello@shepherdsdesk.app";

const TOOL_LABELS = {
  "sermon":       "Sermon Builder",
  "bible-study":  "Bible Study Builder",
  "announcement": "Announcement Builder",
  "caption":      "Caption Builder",
  "follow-up":    "Follow-Up Builder",
};

export function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name:       user?.name       || "",
    churchName: user?.churchName || "",
    role:       user?.role       || "",
  });
  const [saving, setSaving]             = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [profileError, setProfileError] = useState("");

  const [usage, setUsage]               = useState(null);
  const [usageLoading, setUsageLoading] = useState(true);

  const [billingLoading, setBillingLoading] = useState("");
  const [billingError, setBillingError]     = useState("");

  useEffect(() => {
    api.generators.getUsage()
      .then(setUsage)
      .catch(() => {})
      .finally(() => setUsageLoading(false));
  }, []);

  const set = (field) => (val) => {
    setForm(f => ({ ...f, [field]: val }));
    setSaveSuccess(false);
    setProfileError("");
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setProfileError("Name is required."); return; }
    setSaving(true);
    setProfileError("");
    setSaveSuccess(false);
    try {
      await updateProfile({ name: form.name.trim(), church_name: form.churchName, role: form.role });
      setSaveSuccess(true);
    } catch (err) {
      setProfileError(err.message || "Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setBillingLoading(planId);
    setBillingError("");
    try {
      const { url } = await api.billing.checkout(planId);
      window.location.href = url;
    } catch (err) {
      setBillingError(err.message || "Could not start checkout. Please try again.");
      setBillingLoading("");
    }
  };

  const handlePortal = async () => {
    setBillingLoading("portal");
    setBillingError("");
    try {
      const { url } = await api.billing.portal();
      window.location.href = url;
    } catch (err) {
      setBillingError(err.message || "Could not open billing portal. Please try again.");
      setBillingLoading("");
    }
  };

  const planId    = user?.plan ?? "starter";
  const isOwner   = user?.isOwner ?? false;
  const isPaid    = !isOwner && ["starter", "growth", "team"].includes(planId);
  const isTrial   = !isOwner && (planId === "trial" || planId === "pending");
  const allowed   = usage?.creditsAllowed ?? null;
  const used      = usage?.creditsUsed    ?? 0;
  const remaining = usage?.remaining      ?? null;
  const pct       = allowed && allowed < 999999
    ? Math.min(100, Math.round((used / allowed) * 100))
    : 0;

  const PLANS_FOR_DISPLAY = [
    { id: "starter", label: "Starter",     price: "$19/mo", desc: "40 credits per month. All core tools. Saved outputs. Templates." },
    { id: "growth",  label: "Growth",      price: "$49/mo", desc: "140 credits per month. All tools, templates, and priority support." },
    { id: "team",    label: "Church Team", price: "$99/mo", desc: "300 credits per month. Built for ministry teams with 5 seats." },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 640 }} className="fade-in">
      <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 32 }}>
        Account Settings
      </h1>

      <div className="sd-card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Profile</h2>
        <ErrorBanner message={profileError} onDismiss={() => setProfileError("")} />
        <Field label="Full Name"     id="name"       value={form.name}       onChange={set("name")}       required />
        <Field label="Email Address" id="email"      value={user?.email||""} onChange={() => {}} />
        <p style={{ fontSize: 12, color: C.textMuted, marginTop: -10, marginBottom: 16 }}>
          Email address cannot be changed here.
        </p>
        <Field label="Church Name"   id="churchName" value={form.churchName} onChange={set("churchName")} placeholder="Your church name" />
        <Field label="Ministry Role" id="role"       value={form.role}       onChange={set("role")}       placeholder="e.g. Senior Pastor, Youth Director" />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
          <button className="sd-btn-primary" onClick={handleSave} disabled={saving} style={{ padding: "11px 24px" }}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {saveSuccess && <span style={{ fontSize: 13, color: "#166534" }}>Changes saved.</span>}
        </div>
      </div>

      {isPaid && (
        <div className="sd-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Credits This Month</h2>
          {usageLoading ? (
            <div style={{ height: 48, background: C.gray100, borderRadius: 8, animation: "pulse 1.4s ease-in-out infinite" }} />
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: C.text }}>
                  <strong style={{ fontWeight: 600 }}>{remaining !== null ? remaining : "--"}</strong>
                  <span style={{ color: C.textMuted }}>
                    {allowed !== null ? ` of ${allowed} credits remaining` : " credits remaining"}
                  </span>
                </span>
                {allowed !== null && (
                  <span style={{ fontSize: 13, color: pct >= 90 ? "#991B1B" : C.textMuted }}>{pct}% used</span>
                )}
              </div>
              {allowed !== null && (
                <div style={{ background: C.gray200, borderRadius: 100, height: 6, overflow: "hidden" }}>
                  <div style={{
                    background:   pct >= 90 ? "#EF4444" : pct >= 70 ? C.gold : C.navy,
                    width:        `${pct}%`,
                    height:       "100%",
                    borderRadius: 100,
                    transition:   "width 0.4s ease",
                  }} />
                </div>
              )}
              <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>Credits reset on the 1st of each month.</p>

              {usage?.byTool && Object.keys(usage.byTool).length > 0 && (
                <div style={{ marginTop: 16, borderTop: `1px solid ${C.gray200}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 10 }}>
                    Used by Tool
                  </p>
                  {Object.entries(usage.byTool).map(([id, credits]) => (
                    <div key={id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.text, padding: "4px 0", borderBottom: `1px solid ${C.gray100}` }}>
                      <span>{TOOL_LABELS[id] || id}</span>
                      <span style={{ color: C.textMuted, fontWeight: 500 }}>{credits} credit{credits !== 1 ? "s" : ""}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="sd-card">
        <h2 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 16 }}>Plan</h2>

        {billingError && (
          <ErrorBanner message={billingError} onDismiss={() => setBillingError("")} />
        )}

        {isOwner && (
          <div style={{ background: C.goldPale, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Owner Account</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Unlimited access. All tools. All features. No billing required.</div>
          </div>
        )}

        {isTrial && (
          <>
            <p style={{ fontSize: 14, color: C.text, marginBottom: 20, lineHeight: 1.6 }}>
              Choose a plan to activate your account and get started.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PLANS_FOR_DISPLAY.map(plan => (
                <div key={plan.id} style={{
                  border: `1px solid ${plan.id === "growth" ? C.gold : C.gray200}`,
                  borderRadius: 10,
                  padding: "16px 18px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 16, flexWrap: "wrap",
                  background: plan.id === "growth" ? C.goldPale : C.white,
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>{plan.label}</span>
                      {plan.id === "growth" && (
                        <span style={{ fontSize: 11, background: C.gold, color: C.white, borderRadius: 4, padding: "1px 7px", fontWeight: 600 }}>Most Popular</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginTop: 3 }}>{plan.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{plan.price}</span>
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={!!billingLoading}
                      className="sd-btn-primary"
                      style={{ padding: "9px 20px", fontSize: 13, opacity: billingLoading && billingLoading !== plan.id ? 0.5 : 1 }}
                    >
                      {billingLoading === plan.id ? "Opening..." : "Subscribe"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {isPaid && (
          <div style={{
            background: C.goldPale, border: `1px solid ${C.goldLight}`, borderRadius: 8,
            padding: "14px 16px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 16, flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
                {PLAN_LABELS[planId]} Plan
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>
                {PLAN_DESCRIPTIONS[planId]}
              </div>
            </div>
            <button
              onClick={handlePortal}
              disabled={!!billingLoading}
              className="sd-btn-primary"
              style={{ padding: "9px 20px", fontSize: 13 }}
            >
              {billingLoading === "portal" ? "Opening..." : "Manage Billing"}
            </button>
          </div>
        )}

        {isPaid && (
          <p style={{ fontSize: 12, color: C.textMuted, marginTop: 12, lineHeight: 1.6 }}>
            Use Manage Billing to upgrade, downgrade, or cancel your subscription. Changes take effect immediately.
          </p>
        )}
      </div>
    </div>
  );
}



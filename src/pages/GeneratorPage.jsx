import { useState } from "react";
import { api } from "../lib/api.js";
import { TOOL_CONFIGS, validateForm } from "../lib/tools.js";
import { C } from "../lib/tokens.js";
import { Field, SelectField, ErrorBanner, Skeleton } from "../components/ui.jsx";

export function GeneratorPage({ toolId, onBack, onSaved, prefillForm }) {
  const config = TOOL_CONFIGS[toolId];
  const [form, setForm]               = useState(prefillForm || {});
  const [fieldErrors, setFieldErrors] = useState({});
  const [output, setOutput]           = useState("");
  const [loading, setLoading]         = useState(false);
  const [apiError, setApiError]       = useState("");
  const [saveState, setSaveState]     = useState("idle"); // idle | saving | saved | error
  const [tplState, setTplState]       = useState("idle"); // idle | saving | error
  const [showTplModal, setShowTplModal] = useState(false);
  const [tplName, setTplName]         = useState("");

  if (!config) {
    return (
      <div style={{ padding: "40px 48px" }}>
        <p style={{ color: C.textMuted }}>Generator not found.</p>
      </div>
    );
  }

  const setField = (id) => (val) => {
    setForm(f => ({ ...f, [id]: val }));
    if (fieldErrors[id]) setFieldErrors(e => { const n = { ...e }; delete n[id]; return n; });
    setApiError("");
  };

  const handleGenerate = async () => {
    const { valid, errors } = validateForm(toolId, form);
    if (!valid) { setFieldErrors(errors); return; }

    setLoading(true);
    setApiError("");
    setOutput("");
    setSaveState("idle");
    setTplState("idle");

    try {
      const { output: text } = await api.generators.generate(toolId, form);
      setOutput(text);
    } catch (err) {
      setApiError(err.message || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!output || saveState === "saving" || saveState === "saved") return;
    setSaveState("saving");
    try {
      const data = await api.generators.saveGeneration({ toolId, output, formData: form });
      setSaveState("saved");
      if (onSaved) onSaved(data.item);
    } catch {
      setSaveState("error");
    }
  };

  const handleSaveTemplate = async () => {
    if (!tplName.trim()) return;
    setTplState("saving");
    try {
      await api.generators.saveTemplate({ toolId, name: tplName.trim(), formData: form });
      setTplState("idle");
      setShowTplModal(false);
      setTplName("");
    } catch {
      setTplState("error");
    }
  };

  const closeTplModal = () => {
    setShowTplModal(false);
    setTplName("");
    setTplState("idle");
  };

  const saveLabel  = { idle: "Save Output", saving: "Saving...", saved: "Saved", error: "Save Failed — Retry" }[saveState];
  const saveBg     = { idle: C.goldPale, saving: C.gray100, saved: "#DCFCE7", error: "#FEE2E2" }[saveState];
  const saveColor  = { idle: C.navy, saving: C.textMuted, saved: "#166534", error: "#991B1B" }[saveState];
  const saveBorder = { idle: C.gold, saving: C.gray200, saved: "#BBF7D0", error: "#FECACA" }[saveState];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1080 }} className="fade-in">
      <button
        onClick={onBack}
        style={{ background: "none", border: "none", color: C.textMuted, fontSize: 14, marginBottom: 24, padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
      >
        &larr; Back to Dashboard
      </button>

      <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
        {config.label}
      </h1>
      <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 36 }}>{config.tagline}</p>

      <div style={{ display: "grid", gridTemplateColumns: output || loading ? "1fr 1fr" : "minmax(0, 560px)", gap: 28 }}>

        {/* FORM */}
        <div className="sd-card">
          <h2 style={{ fontSize: 15, fontWeight: 600, color: C.navy, marginBottom: 20 }}>Enter Details</h2>

          {config.fields.map(field =>
            field.type === "select" ? (
              <SelectField
                key={field.id}
                id={field.id}
                label={field.label}
                value={form[field.id]}
                onChange={setField(field.id)}
                options={field.options}
                required={field.required}
                error={fieldErrors[field.id]}
              />
            ) : (
              <Field
                key={field.id}
                id={field.id}
                label={field.label}
                type={field.type}
                value={form[field.id]}
                onChange={setField(field.id)}
                placeholder={field.placeholder}
                required={field.required}
                error={fieldErrors[field.id]}
              />
            )
          )}

          {apiError && <ErrorBanner message={apiError} onDismiss={() => setApiError("")} />}

          <button
            className="sd-btn-primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: "100%", padding: "13px", fontSize: 15, marginTop: 8 }}
          >
            {loading ? "Generating..." : "Generate Content"}
          </button>
        </div>

        {/* OUTPUT */}
        {(output || loading) && (
          <div className="sd-card" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: C.navy }}>Generated Output</h2>
              {output && (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowTplModal(true)}
                    style={{ background: "transparent", border: `1px solid ${C.gray200}`, borderRadius: 6, padding: "6px 12px", fontSize: 12, color: C.navy, fontWeight: 500, cursor: "pointer" }}
                  >
                    Save as Template
                  </button>
                  <button
                    onClick={saveState === "error" ? () => setSaveState("idle") : handleSave}
                    disabled={saveState === "saving" || saveState === "saved"}
                    style={{ background: saveBg, color: saveColor, border: `1px solid ${saveBorder}`, borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 500, cursor: saveState === "saved" ? "default" : "pointer" }}
                  >
                    {saveLabel}
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <Skeleton lines={10} />
            ) : (
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.78, whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: 560, flex: 1 }}>
                {output}
              </div>
            )}
          </div>
        )}
      </div>

      {/* TEMPLATE MODAL */}
      {showTplModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tpl-modal-title"
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
          onClick={e => { if (e.target === e.currentTarget) closeTplModal(); }}
        >
          <div style={{ background: C.white, borderRadius: 12, padding: "32px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
            <h3 id="tpl-modal-title" style={{ fontSize: 18, fontWeight: 600, color: C.navy, marginBottom: 6 }}>Save as Template</h3>
            <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
              Give this template a name so you can reuse these settings later.
            </p>
            <input
              className="sd-input"
              value={tplName}
              onChange={e => setTplName(e.target.value)}
              placeholder="e.g. Sunday Morning Sermon"
              autoFocus
              onKeyDown={e => {
                if (e.key === "Enter") handleSaveTemplate();
                if (e.key === "Escape") closeTplModal();
              }}
            />
            {tplState === "error" && (
              <p style={{ color: "#DC2626", fontSize: 12, marginTop: 6 }}>Save failed. Please try again.</p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                className="sd-btn-primary"
                onClick={handleSaveTemplate}
                disabled={tplState === "saving" || !tplName.trim()}
                style={{ flex: 1, padding: "11px" }}
              >
                {tplState === "saving" ? "Saving..." : "Save Template"}
              </button>
              <button
                className="sd-btn-ghost"
                onClick={closeTplModal}
                style={{ flex: 1, padding: "11px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


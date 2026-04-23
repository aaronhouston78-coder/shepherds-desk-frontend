import { useState, useEffect } from "react";
import { api } from "../lib/api.js";
import { C } from "../lib/tokens.js";
import { Badge, ErrorBanner } from "../components/ui.jsx";

const DEFAULT_TEMPLATES = [
  { id: "default-1", toolId: "sermon",       toolLabel: "Sermon Builder",       name: "Sunday Morning Sermon",  description: "General congregation, 3-point expository, pastoral tone.", formData: { tone: "Pastoral", audience: "General congregation", style: "3-point expository" }, isDefault: true },
  { id: "default-2", toolId: "bible-study",  toolLabel: "Bible Study Builder",  name: "Midweek Bible Study",   description: "General adult group, conversational, moderate depth.", formData: { audience: "General adult group", tone: "Conversational", depth: "Moderate" }, isDefault: true },
  { id: "default-3", toolId: "announcement", toolLabel: "Announcement Builder", name: "General Event",          description: "Standard church event copy with social wording.", formData: {}, isDefault: true },
  { id: "default-4", toolId: "follow-up",    toolLabel: "Follow-Up Builder",    name: "First-Time Guest",      description: "Warm welcome message for Sunday visitors.", formData: { recipient: "First-time church guest", tone: "Warm and welcoming" }, isDefault: true },
  { id: "default-5", toolId: "caption",      toolLabel: "Caption Builder",      name: "Sunday Service Caption", description: "Encouraging caption aimed at the general congregation.", formData: { audience: "General church audience", tone: "Encouraging", goal: "Drive Sunday attendance" }, isDefault: true },
];

export function TemplatesPage({ onUseTemplate }) {
  const [saved, setSaved]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.generators.getTemplates()
      .then(({ templates }) => setSaved(templates))
      .catch(() => setError("Could not load templates. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    setDeleting(id);
    try {
      await api.generators.deleteTemplate(id);
      setSaved(prev => prev.filter(t => t.id !== id));
    } catch {
      setError("Delete failed. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const all = [...DEFAULT_TEMPLATES, ...saved];

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }} className="fade-in">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Saved Templates</h1>
          <p style={{ fontSize: 14, color: C.textMuted }}>Reusable starting points. Select a template to pre-fill any generator form.</p>
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ height: 80, background: C.gray100, borderRadius: 12, animation: "pulse 1.4s ease-in-out infinite" }} />
          ))}
        </div>
      )}

      {!loading && (
        <>
          {saved.length > 0 && (
            <h2 style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
              Your Templates
            </h2>
          )}

          {saved.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginBottom: 32 }}>
              {saved.map(t => (
                <TemplateCard key={t.id} template={t} onUse={onUseTemplate} onDelete={handleDelete} deleting={deleting === t.id} />
              ))}
            </div>
          )}

          <h2 style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>
            Starter Templates
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {DEFAULT_TEMPLATES.map(t => (
              <TemplateCard key={t.id} template={t} onUse={onUseTemplate} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TemplateCard({ template: t, onUse, onDelete, deleting }) {
  return (
    <div className="sd-card" style={{ padding: "22px" }}>
      <Badge>{t.toolLabel}</Badge>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: C.navy, margin: "10px 0 6px" }}>{t.name}</h3>
      {t.description && <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55, marginBottom: 18 }}>{t.description}</p>}
      <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
        <button
          onClick={() => onUse && onUse(t.toolId, t.formData)}
          style={{ background: C.navy, color: C.white, border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer" }}
        >
          Use Template
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(t.id)}
            disabled={deleting}
            style={{ background: "transparent", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 6, padding: "7px 12px", fontSize: 12, cursor: "pointer" }}
          >
            {deleting ? "..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}

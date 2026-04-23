import { useState, useEffect } from "react";
import { api, SessionExpiredError } from "../lib/api.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { C } from "../lib/tokens.js";
import { Badge, ErrorBanner } from "../components/ui.jsx";

export function SavedPage({ onCountChange }) {
  const { logout }              = useAuth();
  const [saved, setSaved]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState(null);
  const [copied, setCopied]     = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.generators.getSaved()
      .then(({ saved }) => setSaved(saved))
      .catch((err) => {
        if (err instanceof SessionExpiredError) {
          logout("Your session expired. Please sign in again.");
        } else {
          setError("Could not load saved generations. Please refresh.");
        }
      })
      .finally(() => setLoading(false));
  }, [logout]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this saved generation? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await api.generators.deleteGeneration(id);
      const updated = saved.filter((s) => s.id !== id);
      setSaved(updated);
      if (expanded === id) setExpanded(null);
      if (onCountChange) onCountChange(updated.length);
    } catch (err) {
      if (err instanceof SessionExpiredError) {
        logout("Your session expired. Please sign in again.");
      } else {
        setError("Delete failed. Please try again.");
      }
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = (item) => {
    navigator.clipboard.writeText(item.output).then(() => {
      setCopied(item.id);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {
      setError("Copy failed. Please select and copy the text manually.");
    });
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div style={{ padding: "40px 48px", maxWidth: 900 }} className="fade-in">
      <h1 className="serif" style={{ fontSize: 32, fontWeight: 700, color: C.navy, marginBottom: 8 }}>
        Saved Generations
      </h1>
      <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 32 }}>
        {saved.length > 0
          ? `${saved.length} saved item${saved.length !== 1 ? "s" : ""}`
          : "Your saved outputs will appear here."}
      </p>

      <ErrorBanner message={error} onDismiss={() => setError("")} />

      {loading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{ height: 64, background: C.gray100, borderRadius: 12, animation: "pulse 1.4s ease-in-out infinite" }}
            />
          ))}
        </div>
      )}

      {!loading && saved.length === 0 && !error && (
        <div className="sd-card" style={{ textAlign: "center", padding: "56px 32px" }}>
          <p style={{ color: C.textMuted, fontSize: 15 }}>No saved generations yet.</p>
          <p style={{ color: C.gray400, fontSize: 13, marginTop: 6 }}>
            Generate content in any builder and click Save Output to store it here.
          </p>
        </div>
      )}

      {!loading && saved.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {saved.map((item) => (
            <div
              key={item.id}
              style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, overflow: "hidden" }}
            >
              {/* ROW HEADER */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                onKeyDown={(e) => e.key === "Enter" && setExpanded(expanded === item.id ? null : item.id)}
                style={{ padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", gap: 16 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.gray100)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                  <Badge>{item.toolLabel}</Badge>
                  <p style={{ fontSize: 14, fontWeight: 500, color: C.navy, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.title}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                  <span style={{ fontSize: 12, color: C.textMuted }}>{formatDate(item.createdAt)}</span>
                  <span style={{ color: C.textMuted, fontSize: 12 }}>{expanded === item.id ? "^" : "v"}</span>
                </div>
              </div>

              {/* EXPANDED BODY */}
              {expanded === item.id && (
                <div style={{ borderTop: `1px solid ${C.gray200}`, padding: "20px 22px" }}>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.78, whiteSpace: "pre-wrap", marginBottom: 18, maxHeight: 480, overflowY: "auto" }}>
                    {item.output}
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => handleCopy(item)}
                      style={{
                        background: copied === item.id ? "#DCFCE7" : C.goldPale,
                        color: copied === item.id ? "#166534" : C.navy,
                        border: `1px solid ${copied === item.id ? "#BBF7D0" : C.goldLight}`,
                        borderRadius: 6, padding: "7px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      {copied === item.id ? "Copied!" : "Copy Text"}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      style={{ background: "transparent", border: "1px solid #FECACA", color: "#991B1B", borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer" }}
                    >
                      {deleting === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { C } from "../lib/tokens.js";

export function Logo({ light, compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: compact ? 28 : 32, height: compact ? 28 : 32, background: light ? C.gold : C.navy, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: light ? C.navy : C.white, fontSize: compact ? 12 : 14, fontWeight: 700 }}>+</span>
      </div>
      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: compact ? 17 : 20, fontWeight: 700, color: light ? C.white : C.navy, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
        {"Shepherd's Desk"}
      </span>
    </div>
  );
}

export function Field({ label, id, type = "text", value, onChange, placeholder, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.gray600, marginBottom: 6 }}>
        {label}{required && <span style={{ color: C.gold, marginLeft: 3 }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`sd-input${error ? " error" : ""}`}
        autoComplete={type === "password" ? "current-password" : type === "email" ? "email" : "off"}
      />
      {error && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export function SelectField({ label, id, value, onChange, options, required, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 500, color: C.gray600, marginBottom: 6 }}>
        {label}{required && <span style={{ color: C.gold, marginLeft: 3 }}>*</span>}
      </label>
      <select
        id={id}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        className={`sd-input${error ? " error" : ""}`}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p style={{ color: "#DC2626", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <p style={{ color: "#991B1B", fontSize: 14, lineHeight: 1.5 }}>{message}</p>
      {onDismiss && (
        <button onClick={onDismiss} style={{ background: "none", border: "none", color: "#991B1B", fontSize: 18, lineHeight: 1, padding: 0, flexShrink: 0 }}>x</button>
      )}
    </div>
  );
}

export function Skeleton({ lines = 6 }) {
  const widths = [100, 80, 92, 70, 85, 60, 75, 88, 65, 78];
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 14, background: C.gray100, borderRadius: 4, width: `${widths[i % widths.length]}%`, marginBottom: 10, animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}

export function Badge({ children, variant = "gold" }) {
  const styles = {
    gold: { background: C.goldPale, color: C.gold },
    navy: { background: "rgba(27,43,75,0.08)", color: C.navy },
  };
  return (
    <span style={{ fontSize: 11, fontWeight: 500, borderRadius: 100, padding: "3px 10px", display: "inline-block", ...styles[variant] }}>
      {children}
    </span>
  );
}

// Sidebar nav icons as simple inline SVG
export function NavIcon({ name, active }) {
  const color = active ? C.goldLight : "rgba(255,255,255,0.4)";
  const icons = {
    dashboard: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.2" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.2" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.2" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke={color} strokeWidth="1.2" />
      </svg>
    ),
    saved: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 2h10a1 1 0 0 1 1 1v11l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke={color} strokeWidth="1.2" />
      </svg>
    ),
    templates: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="14" height="3" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="1" y="7" width="6" height="8" rx="1" stroke={color} strokeWidth="1.2" />
        <rect x="9" y="7" width="6" height="8" rx="1" stroke={color} strokeWidth="1.2" />
      </svg>
    ),
    settings: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="1.2" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[name] || null;
}

import { C } from "../lib/tokens.js";
import { Logo, NavIcon } from "./ui.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

export function AppShell({ children, activePage, setPage, savedCount }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "saved", label: "Saved", badge: savedCount },
    { id: "templates", label: "Templates" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: C.cream }}>
      {/* SIDEBAR */}
      <div style={{ width: 220, background: C.navy, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 40 }}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <Logo light compact />
        </div>
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {navItems.map(item => {
            const active = activePage === item.id || (activePage === "tool" && item.id === "dashboard");
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  padding: "9px 12px",
                  background: active ? "rgba(201,168,76,0.15)" : "transparent",
                  border: active ? "1px solid rgba(201,168,76,0.25)" : "1px solid transparent",
                  borderRadius: 8,
                  color: active ? C.goldLight : "rgba(255,255,255,0.5)",
                  fontSize: 14, fontWeight: active ? 500 : 400,
                  marginBottom: 4, transition: "all 0.15s", textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <NavIcon name={item.id === "saved" ? "saved" : item.id === "templates" ? "templates" : item.id === "settings" ? "settings" : "dashboard"} active={active} />
                {item.label}
                {item.badge > 0 && (
                  <span style={{ marginLeft: "auto", background: C.gold, color: C.navy, borderRadius: 100, fontSize: 11, fontWeight: 600, padding: "1px 7px" }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
            <div style={{ width: 32, height: 32, background: C.gold, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, color: C.navy, flexShrink: 0 }}>
              {(user?.name || "?").charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            style={{ width: "100%", padding: "8px 12px", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 13, textAlign: "left", borderRadius: 6, marginTop: 4, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, minWidth: 0, overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
}

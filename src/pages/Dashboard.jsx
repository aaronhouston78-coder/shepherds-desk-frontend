import { C } from "../lib/tokens.js";
import { useAuth } from "../hooks/useAuth.jsx";

const TOOL_COLORS = {
  sermon:        { bg: C.navy,      accent: C.gold },
  "bible-study": { bg: "#1D3A6E",   accent: "#7B9ED9" },
  announcement:  { bg: "#2C3E1F",   accent: "#7BBF5A" },
  caption:       { bg: "#3A1F35",   accent: "#C97BB0" },
  "follow-up":   { bg: "#3A2A0A",   accent: "#D4A943" },
};

const TOOLS = [
  { id: "sermon",        label: "Sermon Builder",       desc: "Framework, movements, application, and altar call." },
  { id: "bible-study",   label: "Bible Study Builder",  desc: "Lesson plan, core points, and discussion prompts." },
  { id: "announcement",  label: "Announcement Builder", desc: "Bulletin copy, flyer text, and social wording." },
  { id: "caption",       label: "Caption Builder",      desc: "Social post options, hooks, and platform variations." },
  { id: "follow-up",     label: "Follow-Up Builder",    desc: "Text, email, and short reminder versions." },
];

export function Dashboard({ onSelectTool }) {
  const { user } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: 1000 }} className="fade-in">
      <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 4 }}>{greeting()},</p>
      <h1 className="serif" style={{ fontSize: 36, fontWeight: 700, color: C.navy, marginBottom: 32 }}>
        {user?.name || "Pastor"}
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {TOOLS.map(tool => {
          const col = TOOL_COLORS[tool.id];
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              style={{
                background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12,
                padding: "24px", textAlign: "left", transition: "border-color 0.2s, box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.gray200; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ width: 40, height: 40, background: col.bg, borderRadius: 8, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: col.accent, fontSize: 16, lineHeight: 1 }}>+</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: C.navy, marginBottom: 6 }}>{tool.label}</h3>
              <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.55 }}>{tool.desc}</p>
              <div style={{ marginTop: 16, fontSize: 12, color: C.gold, fontWeight: 500 }}>Open builder &rarr;</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

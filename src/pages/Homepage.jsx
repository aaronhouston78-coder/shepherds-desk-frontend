import { C } from "../lib/tokens.js";
import { Logo } from "../components/ui.jsx";

export function Homepage({ onGetStarted, onSubscribe }) {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const features = [
    { title: "Sermon Builder", desc: "Generate organized sermon frameworks with scripture, key insights, application points, and altar call language." },
    { title: "Bible Study Builder", desc: "Build structured lesson plans with core teaching points, discussion prompts, and closing reflections." },
    { title: "Announcement Builder", desc: "Create polished church event copy ready for bulletins, flyers, and social media in seconds." },
    { title: "Caption Builder", desc: "Turn sermon themes and scriptures into strong, engaging social posts for every platform." },
    { title: "Follow-Up Builder", desc: "Craft warm, pastoral follow-up messages for guests, members, volunteers, and prayer responses." },
  ];

  const plans = [
    {
      name: "Starter", price: "$19", period: "/mo",
      desc: "For solo pastors and teachers.",
      items: ["25 monthly credits", "Core generators", "Saved outputs"],
      featured: false,
    },
    {
      name: "Growth", price: "$49", period: "/mo",
      desc: "More usage and expanded workflow.",
      items: ["60 monthly credits", "Saved templates", "Higher usage limits", "Priority support"],
      featured: true,
    },
    {
      name: "Church Team", price: "$99", period: "/mo",
      desc: "For multi-user church teams.",
      items: ["125 monthly credits", "Up to 3 users", "Team workspace", "Everything in Growth"],
      featured: false,
    },
  ];

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      {/* NAV */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 50 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <button onClick={() => scrollToSection("features")} style={{ background: "none", border: "none", fontSize: 14, color: C.textMuted, cursor: "pointer" }}>Features</button>
          <button onClick={() => scrollToSection("pricing")} style={{ background: "none", border: "none", fontSize: 14, color: C.textMuted, cursor: "pointer" }}>Pricing</button>
          <button onClick={() => scrollToSection("about")} style={{ background: "none", border: "none", fontSize: 14, color: C.textMuted, cursor: "pointer" }}>About</button>
          <button className="sd-btn-primary" onClick={onGetStarted} style={{ padding: "9px 20px" }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: C.navy, padding: "100px 40px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-block", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 100, padding: "6px 18px", marginBottom: 28 }}>
            <span style={{ color: C.goldLight, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>Ministry Content Platform</span>
          </div>
          <h1 className="serif" style={{ fontSize: 58, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 24 }}>
            Ministry content and communication, built for leaders.
          </h1>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px" }}>
            Create sermons, Bible studies, announcements, captions, and follow-up messages faster with structure, clarity, and excellence.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="sd-btn-gold" onClick={onGetStarted} style={{ padding: "14px 32px", fontSize: 15 }}>Get Started</button>
            <button className="sd-btn-ghost" onClick={() => scrollToSection("features")} style={{ padding: "14px 32px", fontSize: 15, color: C.white, borderColor: "rgba(255,255,255,0.25)" }}>See How It Works</button>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <div id="about" style={{ background: C.navyDark, padding: "64px 40px", borderBottom: "1px solid rgba(201,168,76,0.12)", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: C.goldLight, fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
            About Shepherd’s Desk
          </p>
          <h2 className="serif" style={{ fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1.18, marginBottom: 20 }}>
            Built to help ministry leaders prepare with clarity, structure, and excellence.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 16, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 18px" }}>
            Shepherd’s Desk is a ministry content and communication platform created for pastors, preachers, teachers, and church teams who carry the weight of preparing messages, teaching lessons, communicating announcements, creating social captions, and following up with people consistently.
          </p>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 16, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 18px" }}>
            It is designed to help leaders move from a blank page to a stronger starting point. Whether preparing a sermon, building a Bible study, writing church communication, or crafting a pastoral follow-up message, Shepherd’s Desk gives ministry leaders a structured place to organize thoughts, shape language, and produce content with greater focus.
          </p>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 16, lineHeight: 1.8, maxWidth: 760, margin: "0 auto 28px" }}>
            Shepherd’s Desk is not a replacement for prayer, study, consecration, biblical conviction, or the Holy Spirit. It is a workbench for the shepherd. The burden still belongs to the leader. The calling still requires devotion. The final message still needs the preacher’s voice, discernment, and spiritual responsibility.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginTop: 30 }}>
            {[
              "Prepare sermons with stronger structure.",
              "Build Bible studies with clearer teaching flow.",
              "Create announcements and captions faster.",
              "Follow up with guests and members more consistently."
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "18px", color: "rgba(255,255,255,0.78)", fontSize: 14, lineHeight: 1.55 }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto", scrollMarginTop: 80 }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="serif" style={{ fontSize: 42, fontWeight: 700, color: C.navy, marginBottom: 12 }}>Five tools. One platform.</h2>
          <p style={{ color: C.textMuted, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>Everything a pastor or ministry leader needs to prepare, communicate, and lead.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} className="sd-card">
              <div style={{ width: 36, height: 36, background: C.goldPale, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: C.gold, fontSize: 14 }}>+</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, color: C.navy, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div id="pricing" style={{ background: C.navy, padding: "80px 40px", scrollMarginTop: 80 }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="serif" style={{ fontSize: 42, fontWeight: 700, color: C.white, marginBottom: 12 }}>Simple, honest pricing.</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>Choose the monthly credit plan that fits your ministry workflow.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {plans.map((p, i) => (
              <div key={i} style={{ background: p.featured ? C.gold : "rgba(255,255,255,0.06)", border: `1px solid ${p.featured ? C.gold : "rgba(255,255,255,0.12)"}`, borderRadius: 12, padding: "32px 28px" }}>
                {p.featured && <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: C.navy, marginBottom: 12, textTransform: "uppercase" }}>Most Popular</div>}
                <h3 style={{ fontSize: 20, fontWeight: 600, color: p.featured ? C.navy : C.white, marginBottom: 4 }}>{p.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: p.featured ? C.navy : C.white }}>{p.price}</span>
                  <span style={{ fontSize: 14, color: p.featured ? C.navyLight : "rgba(255,255,255,0.5)" }}>{p.period}</span>
                </div>
                <p style={{ fontSize: 13, color: p.featured ? C.navyLight : "rgba(255,255,255,0.5)", marginBottom: 20 }}>{p.desc}</p>
                <div style={{ marginBottom: 24 }}>
                  {p.items.map((item, j) => (
                    <div key={j} style={{ fontSize: 13, color: p.featured ? C.navy : "rgba(255,255,255,0.7)", padding: "5px 0", borderBottom: `1px solid ${p.featured ? "rgba(27,43,75,0.12)" : "rgba(255,255,255,0.08)"}` }}>{item}</div>
                  ))}
                </div>
                <button onClick={() => onSubscribe ? onSubscribe(p.id) : onGetStarted()} className={p.featured ? "sd-btn-primary" : "sd-btn-ghost"} style={{ width: "100%", padding: "11px", color: p.featured ? C.white : "rgba(255,255,255,0.8)", borderColor: p.featured ? "transparent" : "rgba(255,255,255,0.25)" }}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: C.navyDark, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <Logo light />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{"Shepherd's Desk — A ministry content platform."}</p>
      </div>
    </div>
  );
}

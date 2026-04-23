export const C = {
  navy: "#1B2B4B",
  navyDark: "#111D33",
  navyLight: "#243557",
  gold: "#C9A84C",
  goldLight: "#E2C97E",
  goldPale: "#F5EDD8",
  cream: "#FAF7F2",
  white: "#FFFFFF",
  gray100: "#F4F2EE",
  gray200: "#E8E4DC",
  gray400: "#A09880",
  gray600: "#6B6050",
  gray800: "#3A3228",
  text: "#1C1612",
  textMuted: "#6B6050",
  errorBg: "#FEF2F2",
  errorText: "#991B1B",
  errorBorder: "#FECACA",
};

export const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: 'DM Sans', sans-serif; background: ${C.cream}; color: ${C.text}; min-height: 100vh; -webkit-font-smoothing: antialiased; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  input, select, textarea { font-family: 'DM Sans', sans-serif; }
  textarea { resize: vertical; }
  a { text-decoration: none; color: inherit; }
  .serif { font-family: 'Cormorant Garamond', serif; }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.cream}; }
  ::-webkit-scrollbar-thumb { background: ${C.gray200}; border-radius: 3px; }

  .sd-input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid ${C.gray200};
    border-radius: 8px;
    font-size: 14px;
    color: ${C.text};
    background: ${C.white};
    outline: none;
    transition: border-color 0.15s;
  }
  .sd-input:focus { border-color: ${C.gold}; }
  .sd-input.error { border-color: #F87171; }

  .sd-btn-primary {
    background: ${C.navy};
    color: ${C.white};
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 20px;
    transition: opacity 0.15s, transform 0.1s;
    font-family: 'DM Sans', sans-serif;
  }
  .sd-btn-primary:hover:not(:disabled) { opacity: 0.88; }
  .sd-btn-primary:active:not(:disabled) { transform: scale(0.98); }
  .sd-btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .sd-btn-gold {
    background: ${C.gold};
    color: ${C.navy};
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 20px;
    transition: opacity 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sd-btn-gold:hover:not(:disabled) { opacity: 0.88; }

  .sd-btn-ghost {
    background: transparent;
    color: ${C.textMuted};
    border: 1px solid ${C.gray200};
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    padding: 10px 20px;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .sd-btn-ghost:hover { border-color: ${C.navy}; color: ${C.navy}; }

  .sd-card {
    background: ${C.white};
    border: 1px solid ${C.gray200};
    border-radius: 12px;
    padding: 28px;
  }
`;

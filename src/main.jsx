import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./hooks/useAuth.jsx";
import { App } from "./App.jsx";
import { GLOBAL_CSS } from "./lib/tokens.js";

// Inject global styles
const style = document.createElement("style");
style.textContent = GLOBAL_CSS;
document.head.appendChild(style);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setToken, clearToken, SessionExpiredError } from "../lib/api.js";
import { getBrowserFingerprint } from "../lib/fingerprint.js";

const AuthContext = createContext(null);

function forceOwner(user) {
  if (!user) return user;
  const email = String(user.email || "").toLowerCase();
  if (["deskshepherd@gmail.com", "shepherdsdesk2.0@gmail.com"].includes(email)) {
    return { ...user, isOwner: true, plan: "owner", emailVerified: true };
  }
  return user;
}


export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");
  // True after registration — triggers the "check your email" screen
  const [pendingVerification, setPendingVerification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sd_token");
    if (!token) { setLoading(false); return; }
    api.auth.me()
      .then(({ user }) => setUser(forceOwner(user)))
      .catch((err) => {
        clearToken();
        if (err instanceof SessionExpiredError) {
          setSessionMessage("Your session expired. Please sign in again.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, user, requiresVerification } = await api.auth.login({ email, password });
    setToken(token);
    setUser(forceOwner(user));
    setSessionMessage("");
    // If email not yet verified, flag it — app will show the banner
    if (requiresVerification) setPendingVerification(true);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const fingerprint = await getBrowserFingerprint().catch(() => "");
    const data = await api.auth.register({ name, email, password, fingerprint });
    const { token, user, requiresVerification } = data;
    setToken(token);
    setUser(forceOwner(user));
    setSessionMessage("");
    // Flag pending verification — App.jsx shows the verification banner
    // AuthScreen handles the immediate post-register UX itself
    if (requiresVerification) setPendingVerification(true);
    return data; // return full response so callers can inspect requiresVerification
  }, []);

  const dismissVerification = useCallback(() => {
    setPendingVerification(false);
  }, []);

  const logout = useCallback((reason = "") => {
    clearToken();
    setUser(null);
    setPendingVerification(false);
    if (reason) setSessionMessage(reason);
  }, []);

  const updateProfile = useCallback(async (data) => {
    const { user: updated } = await api.auth.updateProfile(data);
    setUser(forceOwner(updated));
    return updated;
  }, []);

  const resendVerification = useCallback(async () => {
    await api.auth.resendVerification();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, sessionMessage,
      pendingVerification, dismissVerification,
      login, register, logout, updateProfile, resendVerification,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

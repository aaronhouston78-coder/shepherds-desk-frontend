import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, setToken, clearToken, SessionExpiredError } from "../lib/api.js";
import { getBrowserFingerprint } from "../lib/fingerprint.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [sessionMessage, setSessionMessage] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("sd_token");
    if (!token) { setLoading(false); return; }
    api.auth.me()
      .then(({ user }) => setUser(user))
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
    setUser(user);
    setSessionMessage("");
    if (requiresVerification) setPendingVerification(true);
  }, []);

  const register = useCallback(async (name, email, password) => {
    const fingerprint = await getBrowserFingerprint().catch(() => "");
    const data = await api.auth.register({ name, email, password, fingerprint });
    const { token, user, requiresVerification } = data;
    setToken(token);
    setUser(user);
    setSessionMessage("");
    if (requiresVerification) setPendingVerification(true);
    return data;
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
    setUser(updated);
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

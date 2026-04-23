// VITE_API_ORIGIN must be the bare backend origin only.
// Example: https://api.shepherdsdesk.app
// Do NOT include /api or a trailing slash.
// Leave unset for local development — Vite proxies /api/* automatically.
const ORIGIN = "https://shepherds-desk-backend-production.up.railway.app";


function getToken() {
  return localStorage.getItem("sd_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please sign in again.");
    this.name  = "SessionExpiredError";
    this.status = 401;
  }
}

export class ApiError extends Error {
constructor(message, status) {super(message);
    this.status = status;
    this.name   = "ApiError";
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${ORIGIN}/api${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(options.headers || {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new ApiError("Unable to reach the server. Please check your connection.", 0);
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401) {
    clearToken();
    throw new SessionExpiredError();
  }

  if (!res.ok) {
    throw new ApiError(data.error || "An unexpected error occurred.", res.status);
  }

  return data;
}

export const api = {
  auth: {
    register:           (body)    => request("/auth/register", { method: "POST", body }),
    login:              (body)    => request("/auth/login",    { method: "POST", body }),
    me:                 ()        => request("/auth/me"),
    updateProfile:      (body)    => request("/auth/me",       { method: "PATCH", body }),
    verifyEmail:        (token)   => request(`/auth/verify-email?token=${encodeURIComponent(token)}`),
    resendVerification: ()        => request("/auth/resend-verification", { method: "POST", body: {} }),
  },
  billing: {
    // Creates a Stripe Checkout session. Returns { url } — redirect the user to it.
    checkout:  (planId) => request("/billing/checkout", { method: "POST", body: { planId } }),
    // Opens the Stripe Customer Portal for plan changes / cancellation. Returns { url }.
    portal:    ()       => request("/billing/portal",   { method: "POST", body: {} }),
  },
  generators: {
    generate:        (toolId, body) => request(`/generators/generate/${toolId}`, { method: "POST", body }),
    getSaved:        ()             => request("/generators/saved"),
    saveGeneration:  (body)         => request("/generators/saved",         { method: "POST", body }),
    deleteGeneration:(id)           => request(`/generators/saved/${id}`,   { method: "DELETE" }),
    getSavedCount:   ()             => request("/generators/saved/count"),
    getUsage:        ()             => request("/generators/usage"),
    getTemplates:    ()             => request("/generators/templates"),
    saveTemplate:    (body)         => request("/generators/templates",     { method: "POST", body }),
    deleteTemplate:  (id)           => request(`/generators/templates/${id}`, { method: "DELETE" }),
  },
};

export function setToken(t)  { localStorage.setItem("sd_token", t); }
export function clearToken() { localStorage.removeItem("sd_token"); }


import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getToken, getStoredUser } from "../lib/api";

function deriveAvatar(name) {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    avatar: raw.avatar || deriveAvatar(raw.name),
    totalSavedFormatted:
      raw.totalSavedFormatted ||
      (raw.totalSaved ? `₦${Number(raw.totalSaved).toLocaleString()}` : "₦0"),
  };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const storedUser = normalizeUser(getStoredUser());
  const hasToken = !!getToken();

  // Only show loading if a token exists but we don't yet have user data
  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(hasToken && !storedUser);

  useEffect(() => {
    if (!hasToken) return; // no token — don't call the API, render children as-is

    apiFetch("/auth/me")
      .then((data) => setUser(normalizeUser(data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

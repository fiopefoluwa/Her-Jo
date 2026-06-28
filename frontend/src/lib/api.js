/**
 * Central fetch helper for the HerJo API.
 *
 * Automatically:
 *  - Prefixes the base URL:
 *      dev  → "/api"  (proxied to localhost:3001 via Vite)
 *      prod → VITE_API_URL (https://herjo-backend.onrender.com/api)
 *  - Attaches `Authorization: Bearer <token>` from localStorage
 *  - Parses JSON responses
 *  - Throws an error with the API's error message on non-2xx status
 */

const BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "/api" : "https://herjo-backend.onrender.com/api");

export function getToken() {
  return localStorage.getItem("herjo_token");
}

export function setToken(token) {
  localStorage.setItem("herjo_token", token);
}

export function clearToken() {
  localStorage.removeItem("herjo_token");
  localStorage.removeItem("herjo_user");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("herjo_user") || "null");
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem("herjo_user", JSON.stringify(user));
}

/**
 * Make an authenticated API request.
 * @param {string} path  - e.g. "/circles" or "/auth/me"
 * @param {RequestInit} options
 * @returns {Promise<any>} parsed JSON body
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutMs = typeof options.timeoutMs === "number" ? options.timeoutMs : 10000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }


  // Handle 401 — clear auth and redirect to login
  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

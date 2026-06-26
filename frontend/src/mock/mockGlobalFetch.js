import { USE_MOCK_DATA } from "../config/mockMode";
import { mockFetch } from "./mockApi";

let patched = false;

export function patchGlobalFetchForMock() {
  if (patched) return;
  patched = true;

  if (!USE_MOCK_DATA) return;

  // Patch global fetch so no code needs to change.
  // This avoids modifying each page’s fetch calls.
  const originalFetch = window.fetch;

  window.fetch = async (url, options) => {
    try {
      return await mockFetch(url, options);
    } catch (e) {
      // Fallback: if mock has an unknown endpoint, surface a clear error.
      console.error(e);
      // Keep behavior consistent with fetch() returning a Response-like object.
      return originalFetch(url, options);
    }
  };
}


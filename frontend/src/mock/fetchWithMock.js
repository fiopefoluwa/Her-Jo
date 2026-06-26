import { USE_MOCK_DATA } from "../config/mockMode";
import { mockFetch } from "./mockApi";

export async function fetchWithMock(url, options) {
  if (USE_MOCK_DATA) {
    return mockFetch(url, options);
  }

  return fetch(url, options);
}


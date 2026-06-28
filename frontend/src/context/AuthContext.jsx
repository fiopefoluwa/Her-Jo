import { createContext, useContext } from "react";

/**
 * Static authenticated user for the current session.
 * When the backend is connected, replace this with:
 *   const user = await apiFetch("/users/me");
 */
export const mockCurrentUser = {
  id: "user-1",
  name: "Amina Okafor",
  email: "amina@herjo.app",
  avatar: "AO",
  trustScore: 92,
  totalSaved: 250000,
  totalSavedFormatted: "₦250,000",
  activeCycles: 2,
  completedCycles: 12,
};

const AuthContext = createContext(mockCurrentUser);

export function AuthProvider({ children }) {
  return (
    <AuthContext.Provider value={mockCurrentUser}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

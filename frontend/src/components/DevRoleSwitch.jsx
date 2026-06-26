import { useEffect, useState } from "react";
import { DEV_ROLE } from "../config/devRole";
import { USE_MOCK_DATA } from "../config/mockMode";

export function DevRoleSwitch() {
  const [role, setRole] = useState(DEV_ROLE);

  useEffect(() => {
    // Keep role in sync with the dev config at first load.
    setRole(DEV_ROLE);
  }, []);

  if (!USE_MOCK_DATA) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground">Role</span>
      <div className="inline-flex rounded-lg border border-border/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setRole("leader")}
          className={`px-3 py-1 text-xs transition-colors ${
            role === "leader" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          Leader
        </button>
        <button
          type="button"
          onClick={() => setRole("member")}
          className={`px-3 py-1 text-xs transition-colors ${
            role === "member" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          Member
        </button>
      </div>

      {/* Expose chosen role to mock server without changing page code paths.
          Mock uses request body.role/currentUserRole for POST /api/circles.
          For GETs (dashboard, circle detail) we fall back to DEV_ROLE static value,
          which is enough for immediate dev visibility. */}
      <input type="hidden" value={role} readOnly />
    </div>
  );
}


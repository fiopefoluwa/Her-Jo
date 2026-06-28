import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

/**
 * Redirects non-leaders away from leader-only routes.
 * When the backend is connected, `role` will come from circle.currentUserRole
 * returned by GET /api/circles/:id — no UI changes needed.
 */
export function RoleGuard({ role, circleId, children }) {
  const navigate = useNavigate();
  const isLeader = role === "leader";

  useEffect(() => {
    if (!isLeader) {
      toast.error("Access denied. Leader access required.");
      navigate(`/circle/${circleId}`, { replace: true });
    }
  }, [isLeader, circleId, navigate]);

  if (!isLeader) return null;
  return children;
}

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Sparkles, Loader2, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { toast } from "sonner";
import { frequencyAdverb } from "../lib/frequency";

export function JoinCircle() {
  const { id } = useParams();
  const user = useAuth();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [loadingCircle, setLoadingCircle] = useState(!!user);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiFetch(`/circles/${id}`)
      .then(setCircle)
      .catch(() => {})
      .finally(() => setLoadingCircle(false));
  }, [id, user]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await apiFetch(`/circles/${id}/join`, { method: "POST" });
      toast.success("You've joined the circle!");
      navigate(`/circle/${id}`);
    } catch (err) {
      toast.error(err.message || "Failed to join circle");
      setJoining(false);
    }
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warmgray-50 px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="flex items-center gap-2 justify-center mb-8">
            <Sparkles className="w-7 h-7 text-terracotta-500" />
            <span className="text-2xl font-semibold text-terracotta-800">HerJo</span>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-warmgray-200">
            <div className="w-12 h-12 rounded-full bg-terracotta-50 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-terracotta-500" />
            </div>
            <h1 className="text-xl font-bold text-warmgray-900 mb-2">You're invited!</h1>
            <p className="text-warmgray-500 text-sm mb-6">
              You've been invited to join a savings circle on HerJo. Create an account or log in to join.
            </p>
            <div className="space-y-3">
              <Link
                to={`/register?circle=${id}`}
                className="block w-full py-3 rounded-xl font-medium bg-terracotta-600 text-black hover:bg-terracotta-700 transition text-sm text-center"
              >
                Create Account & Join
              </Link>
              <Link
                to={`/login?circle=${id}`}
                className="block w-full py-3 rounded-xl font-medium border border-warmgray-200 text-warmgray-700 hover:bg-warmgray-50 transition text-sm text-center"
              >
                Log In & Join
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Logged in: loading circle details ─────────────────────────────────────
  if (loadingCircle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ── Logged in: show join confirmation ─────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warmgray-50 px-4 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Sparkles className="w-7 h-7 text-terracotta-500" />
          <span className="text-2xl font-semibold text-terracotta-800">HerJo</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-warmgray-200">
          <div className="w-12 h-12 rounded-full bg-terracotta-50 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-terracotta-500" />
          </div>
          <h1 className="text-xl font-bold text-warmgray-900 mb-1">
            {circle?.name ?? "Savings Circle"}
          </h1>
          {circle && (
            <p className="text-warmgray-500 text-sm mt-1">
              {circle.members} member{circle.members !== 1 ? "s" : ""} &middot;{" "}
              {circle.monthlyContributionFormatted ?? `₦${circle.monthlyContribution?.toLocaleString()}`}{" "}
              {frequencyAdverb(circle.frequency)}
            </p>
          )}
          {circle?.description && (
            <p className="text-warmgray-400 text-xs mt-2 mb-4">{circle.description}</p>
          )}
          <div className="mt-6 space-y-3">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-terracotta-600 text-black hover:bg-terracotta-700 transition disabled:opacity-60 text-sm"
            >
              {joining && <Loader2 className="w-4 h-4 animate-spin" />}
              {joining ? "Joining…" : "Join Circle"}
            </button>
            <Link
              to="/dashboard"
              className="block text-sm text-warmgray-400 hover:text-warmgray-600 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

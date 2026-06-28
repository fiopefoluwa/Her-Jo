import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Sparkles, Loader2, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";
import { toast } from "sonner";

export function InvitePage() {
  const { token } = useParams();
  const user = useAuth();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    // GET /api/invites/:token is public — no auth needed
    apiFetch(`/invites/${token}`)
      .then(setInvite)
      .catch((err) => setInviteError(err.message || "Invite not found or expired."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const result = await apiFetch(`/invites/${token}/accept`, { method: "POST" });
      toast.success(result.message || "You've joined the circle!");
      navigate(`/circle/${invite.circle.id}`);
    } catch (err) {
      toast.error(err.message || "Failed to accept invite");
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (inviteError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warmgray-50 px-4 py-12 text-center">
        <div className="flex items-center gap-2 justify-center mb-8">
          <Sparkles className="w-7 h-7 text-terracotta-500" />
          <span className="text-2xl font-semibold text-terracotta-800">HerJo</span>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-warmgray-200 w-full max-w-sm">
          <p className="text-warmgray-700 mb-4">{inviteError}</p>
          <Link to="/" className="text-terracotta-600 hover:underline text-sm">Go to home</Link>
        </div>
      </div>
    );
  }

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

          {invite?.invitedBy && (
            <p className="text-xs text-warmgray-400 mb-1">
              {invite.invitedBy.name} invited you to join
            </p>
          )}

          <h1 className="text-xl font-bold text-warmgray-900 mb-1">
            {invite?.circle?.name}
          </h1>

          {invite?.circle?.description && (
            <p className="text-warmgray-400 text-xs mt-1">{invite.circle.description}</p>
          )}

          {invite?.circle?.monthlyContributionFormatted && (
            <p className="text-warmgray-500 text-sm mt-2">
              {invite.circle.monthlyContributionFormatted} per cycle
            </p>
          )}

          <div className="mt-6 space-y-3">
            {user ? (
              <>
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium bg-terracotta-600 text-black hover:bg-terracotta-700 transition disabled:opacity-60 text-sm"
                >
                  {accepting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {accepting ? "Joining…" : "Join Circle"}
                </button>
                <Link
                  to="/dashboard"
                  className="block text-sm text-warmgray-400 hover:text-warmgray-600 transition"
                >
                  Back to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/register?token=${token}`}
                  className="block w-full py-3 rounded-xl font-medium bg-terracotta-600 text-black hover:bg-terracotta-700 transition text-sm text-center"
                >
                  Create Account & Join
                </Link>
                <Link
                  to={`/login?token=${token}`}
                  className="block w-full py-3 rounded-xl font-medium border border-warmgray-200 text-warmgray-700 hover:bg-warmgray-50 transition text-sm text-center"
                >
                  Log In & Join
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

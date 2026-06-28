import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { TrustScore } from "../components/TrustScore";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  Plus,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export function GroupDetails() {
  const { id } = useParams();
  const { id: userId } = useAuth();

  const [circle, setCircle] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const totalContributed = useMemo(() => {
    return contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  }, [contributions]);

  const fetchCircleDetails = async () => {
    const res = await fetch(`/api/circles/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Circle not found");
    }
    return res.json();
  };

  const fetchContributions = async () => {
    const res = await fetch("/api/contributions");
    if (!res.ok) return [];
    const data = await res.json();
    return data.filter(
      (c) => c.circleId === id && c.userId === userId && c.action?.includes("contributed")
    );
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [circleData, contributionsData] = await Promise.all([
        fetchCircleDetails(),
        fetchContributions(),
      ]);
      setCircle(circleData);
      setContributions(contributionsData);
      setAmount(circleData?.monthlyContribution?.toString?.() || "");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to load group details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRecordContribution = async () => {
    if (!circle) return;

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid contribution amount");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ circleId: circle.id, userId, amount: amountNum }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to record contribution");
      }

      const result = await res.json();
      toast.success(`Contribution recorded! Trust Score: ${result?.user?.trustScore ?? "-"}`);
      await loadAllData();
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to submit contribution");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg">Loading group details...</div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-4">Group Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The savings group you are looking for does not exist.
        </p>
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary/90">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-playfair font-bold text-lg sm:text-xl">H</span>
            </div>
            <span className="font-playfair font-bold text-lg sm:text-xl tracking-tight">HerJo</span>
          </div>

          <ProfileAvatar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
            <div>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-2">{circle.name}</h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">{circle.description}</p>
            </div>

            <div className="flex-shrink-0">
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link to={`/circle/${circle.id}`}>View Circle Page</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Monthly Pool</div>
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {circle.totalPoolFormatted || `₦${circle.totalPool?.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Your Share</div>
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Members</div>
                  <div className="font-semibold text-sm sm:text-base">{circle.members}</div>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current Cycle</div>
                  <div className="font-semibold text-sm sm:text-base">
                    {circle.currentCycle} of {circle.totalCycles}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="p-4 sm:p-6 md:p-8 border-border/40">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList className="w-5 h-5 text-primary flex-shrink-0" />
                <h2 className="font-playfair font-bold text-xl sm:text-2xl">Record Contribution</h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
                <div className="space-y-2 flex-1">
                  <div className="text-sm text-muted-foreground">Contribution amount</div>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                    placeholder="Enter amount"
                  />
                </div>

                <Button
                  className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  disabled={submitting}
                  onClick={handleRecordContribution}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? "Recording..." : "Record"}
                </Button>
              </div>

              <div className="mt-4 sm:mt-6 text-sm text-muted-foreground">
                This will update your Trust Score and add an entry to your contribution history.
              </div>
            </Card>

            <Card className="p-4 sm:p-6 border-border/40">
              <h3 className="font-semibold text-base sm:text-lg mb-4">Contribution History</h3>

              {contributions.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No contributions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {contributions.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-xs sm:text-sm pb-3 border-b border-border/40 last:border-0 last:pb-0 gap-2"
                    >
                      <span className="text-muted-foreground flex-shrink-0">{c.date}</span>
                      <span className="font-semibold text-accent">{c.amountFormatted}</span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/40">
                    <span className="font-medium">Total Contributed</span>
                    <span className="font-bold text-primary">₦{totalContributed.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Group Members</h3>
              <Card className="p-4 sm:p-6 border-border/40">
                <div className="space-y-3 sm:space-y-4">
                  {circle.membersList?.length ? (
                    circle.membersList.map((m) => (
                      <div key={m.id} className="flex items-center gap-3">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 ${
                          m.isYou ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {m.avatar}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm truncate">
                            {m.name}
                            {m.isYou && <span className="text-primary ml-1">(You)</span>}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                            <span>Trust: {m.trustScore}</span>
                            <span>•</span>
                            <span className={`${
                              m.status === "paid" ? "text-accent font-medium" :
                              m.status === "upcoming" ? "text-primary" : "text-muted-foreground"
                            }`}>
                              {m.status === "paid" ? "✓ Paid" : m.status === "upcoming" ? "Next" : "Pending"}
                            </span>
                          </div>
                        </div>

                        <TrustScore score={m.trustScore} size="small" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-6">No members yet.</div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

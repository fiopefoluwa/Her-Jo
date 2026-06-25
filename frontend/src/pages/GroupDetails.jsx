import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { TrustScore } from "../components/TrustScore";
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

  const [circle, setCircle] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const userId = "user-1";

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

    // Filter contributions for this circle + current user
    return data.filter(
      (c) =>
        c.circleId === id &&
        c.userId === userId &&
        c.action === "Contribution received"
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          circleId: circle.id,
          userId,
          amount: amountNum,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to record contribution");
      }

      const result = await res.json();
      toast.success(
        `Contribution recorded! Trust Score: ${result?.user?.trustScore ?? "-"}`
      );
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
        <div className="text-muted-foreground animate-pulse text-lg">
          Loading group details...
        </div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Group Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The savings group you are looking for does not exist.
        </p>
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary/90">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-playfair font-bold text-xl">H</span>
            </div>
            <span className="font-playfair font-bold text-xl tracking-tight">HerJo</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">AO</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="font-playfair font-bold text-4xl mb-2">{circle.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{circle.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link to={`/circle/${circle.id}`}>View Circle Page</Link>
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Pool</div>
                  <div className="font-semibold">
                    {circle.totalPoolFormatted || `₦${circle.totalPool?.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Your Share</div>
                  <div className="font-semibold">
                    {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Members</div>
                  <div className="font-semibold">{circle.members}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Cycle</div>
                  <div className="font-semibold">
                    {circle.currentCycle} of {circle.totalCycles}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-border/40">
              <div className="flex items-center gap-3 mb-4">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h2 className="font-playfair font-bold text-2xl">Record Contribution</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Contribution amount</div>
                  <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="numeric"
                    placeholder="Enter amount"
                  />
                </div>

                <Button
                  className="bg-primary hover:bg-primary/90"
                  disabled={submitting}
                  onClick={handleRecordContribution}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? "Recording..." : "Record"}
                </Button>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                This will update your Trust Score and add an entry to your
                contribution history.
              </div>
            </Card>

            <Card className="p-6 border-border/40">
              <h3 className="font-semibold text-lg mb-4">Contribution History</h3>

              {contributions.length === 0 ? (
                <div className="text-center py-10 text-xs text-muted-foreground">
                  No contributions recorded yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {contributions.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between text-sm pb-3 border-b border-border/40 last:border-0 last:pb-0"
                    >
                      <span className="text-muted-foreground">{c.date}</span>
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

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-semibold text-lg mb-4">Group Members</h3>
              <Card className="p-6 border-border/40">
                <div className="space-y-4">
                  {circle.membersList?.length ? (
                    circle.membersList.map((m) => (
                      <div key={m.id} className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                            m.isYou
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {m.avatar}
                        </div>

                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {m.name}
                            {m.isYou && <span className="text-primary ml-1">(You)</span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Trust: {m.trustScore}</span>
                            <span>•</span>
                            <span
                              className={`${
                                m.status === "paid"
                                  ? "text-accent font-medium"
                                  : m.status === "upcoming"
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {m.status === "paid"
                                ? "✓ Paid"
                                : m.status === "upcoming"
                                ? "Next"
                                : "Pending"}
                            </span>
                          </div>
                        </div>

                        <TrustScore score={m.trustScore} size="small" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-xs text-muted-foreground py-6">
                      No members yet.
                    </div>
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


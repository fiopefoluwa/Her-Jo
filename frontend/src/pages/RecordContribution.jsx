import * as React from "react";
import { useMemo, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { apiFetch } from "../lib/api";
import {
  ArrowLeft,
  DollarSign,
  ClipboardList,
  Plus,
  Users,
} from "lucide-react";

export function RecordContribution() {
  const { id } = useParams();

  const [circle, setCircle] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const totalContributed = useMemo(() => {
    return contributions.reduce((sum, c) => sum + (c.amount || 0), 0);
  }, [contributions]);

  const fetchCircle = async () => apiFetch(`/circles/${id}`);

  const fetchUserContributions = async () => {
    const data = await apiFetch("/contributions");
    return data.filter(
      (c) => c.circleId === id && c.action?.includes("contributed")
    );
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [circleData, contributionData] = await Promise.all([
        fetchCircle(),
        fetchUserContributions(),
      ]);
      setCircle(circleData);
      setContributions(contributionData);
      setAmount(circleData?.monthlyContribution?.toString?.() ?? "");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to load record contribution page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async () => {
    if (!circle) return;

    const amountNum = Number(amount);
    if (!Number.isFinite(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid contribution amount");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiFetch("/contributions", {
        method: "POST",
        body: JSON.stringify({ circleId: circle.id, amount: amountNum }),
      });

      toast.success(`Recorded! Trust Score: ${result?.user?.trustScore ?? "-"}`);
      await loadAll();
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
        <div className="text-muted-foreground animate-pulse text-lg">Loading contribution record...</div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-4">Circle Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The savings group you are trying to contribute to does not exist.
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
            to={`/circle/${circle.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline text-sm">Back to Circle</span>
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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-2">{circle.name}</h1>
              <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">{circle.description}</p>
            </div>
            <div className="flex-shrink-0">
              <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                <Link to={`/group/${circle.id}`}>Group Details</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
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
                  onClick={handleSubmit}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {submitting ? "Recording..." : "Record"}
                </Button>
              </div>

              <div className="mt-4 sm:mt-6 text-sm text-muted-foreground">
                Submitting will update your Trust Score and add a contribution entry.
              </div>
            </Card>

            <Card className="p-4 sm:p-6 border-border/40">
              <h3 className="font-semibold text-base sm:text-lg mb-4">Your Contribution History</h3>

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
            <div className="lg:sticky lg:top-6">
              <Card className="p-4 sm:p-6 border-border/40">
                <h3 className="font-semibold text-base sm:text-lg mb-4">Quick Notes</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Amount should be a positive number.</li>
                  <li>• Records are scoped to this circle and your user.</li>
                  <li>• History updates instantly after submission.</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

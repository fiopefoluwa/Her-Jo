import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrustScore } from "./TrustScore";
import { ProfileAvatar } from "./ProfileAvatar";
import { LeaderActions } from "./LeaderActions";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { frequencyLabel, frequencyAdverb } from "../lib/frequency";
import { HerJoLogo } from "./HerJoLogo";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PaymentModal } from "./payments/PaymentModal";
import { apiFetch } from "../lib/api";

export function CirclePage() {
  const { id } = useParams();
  const user = useAuth();

  const [circle, setCircle] = useState(null);
  const [circleContributions, setCircleContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const fetchCircleDetails = async () => {
    try {
      const data = await apiFetch(`/circles/${id}`);
      setCircle(data);
    } catch (err) {
      console.error("Error fetching circle details:", err);
      toast.error(err.message || "Failed to load circle details");
    }
  };

  const fetchContributions = async () => {
    try {
      const data = await apiFetch("/contributions");
      const filtered = data.filter(
        (c) => c.circleId === id && c.action?.includes("contributed")
      );
      setCircleContributions(filtered);
    } catch (err) {
      console.error("Error fetching contributions:", err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchCircleDetails(), fetchContributions()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, [id]);

  const handleTriggerPayout = async () => {
    try {
      const result = await apiFetch(`/circles/${id}/payout`, { method: "POST" });
      toast.success(result.message || "Payout triggered successfully!");
      loadAllData();
    } catch (err) {
      toast.error(err.message || "Failed to trigger payout");
    }
  };

  const handleMakeContribution = async () => {
    if (!circle) return;
    try {
      const result = await apiFetch("/contributions", {
        method: "POST",
        body: JSON.stringify({
          circleId: circle.id,
          amount: circle.monthlyContribution,
        }),
      });

      toast.success(
        `Contribution of ${circle.monthlyContributionFormatted} recorded! Your Trust Score is now ${result.user.trustScore}.`
      );
      loadAllData();
    } catch (err) {
      toast.error(err.message || "Failed to submit contribution");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg">Loading savings circle details...</div>
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold mb-4">Circle Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The savings circle you are looking for does not exist or has been deleted.
        </p>
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary/90">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isLeader =
    circle.isLeader === true ||
    circle.currentUserRole === "leader" ||
    (user?.id && circle.leaderId === user.id);
  const currentUserMember = circle.membersList?.find((m) => m.isYou);
  const isContributionPending = currentUserMember?.status === "pending";
  const totalContributed = circleContributions.reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        circle={circle}
        amount={circle?.monthlyContribution}
        userId={user.id}
        onPaymentSuccess={async ({ amount }) => {
          // Optimistically add to the contributions list so the total updates immediately
          setCircleContributions((prev) => [
            {
              id: `local-${Date.now()}`,
              circleId: circle.id,
              amount: amount || circle.monthlyContribution,
              amountFormatted: `₦${(amount || circle.monthlyContribution).toLocaleString()}`,
              date: "Just now",
              action: "contributed",
            },
            ...prev,
          ]);
          await handleMakeContribution();
        }}
      />

      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors min-w-0"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            <span className="hidden sm:inline text-sm">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-3">
            <HerJoLogo />
            <ProfileAvatar />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Circle Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 sm:gap-6 mb-6">
            <div>
              <h1 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-2">{circle.name}</h1>
              <p className="text-muted-foreground max-w-2xl text-sm sm:text-base">{circle.description}</p>
            </div>

            <div className="flex flex-col gap-3">
              {isContributionPending && (
                <div>
                  <Button onClick={() => setPaymentOpen(true)} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                    Pay Contribution
                  </Button>
                </div>
              )}

              {isLeader ? (
                <LeaderActions circleId={circle.id} />
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild variant="outline" className="border-border/40" size="sm">
                    <Link to={`/group/${circle.id}`}>Group Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-border/40" size="sm">
                    <Link to={`/record-contribution/${circle.id}`}>Record Contribution</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
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
                  <div className="text-xs text-muted-foreground">{frequencyLabel(circle.frequency)} Contribution</div>
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Current Cycle</div>
                  <div className="font-semibold text-sm sm:text-base">{circle.currentCycle} of {circle.totalCycles}</div>
                </div>
              </div>
            </Card>

            <Card className="p-3 sm:p-4 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">Duration</div>
                  <div className="font-semibold text-xs sm:text-sm truncate">
                    {circle.startDate} - {circle.endDate || "Ongoing"}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Rotation Journey */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair font-bold text-xl sm:text-2xl mb-4 sm:mb-6">The Circle of Continuity</h2>

            <Card className="p-4 sm:p-6 md:p-8 border-border/40">
              <div className="relative">
                {circle.rotationSchedule?.map((rotation, index) => {
                  const isActive = rotation.status === "active";
                  const isCompleted = rotation.status === "completed";
                  const isLast = index === circle.rotationSchedule.length - 1;

                  return (
                    <motion.div
                      key={rotation.position}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className={`flex items-start gap-4 sm:gap-6 pb-6 sm:pb-8 ${!isLast ? "border-l-2 ml-6" : ""} ${
                        isCompleted ? "border-accent" : isActive ? "border-primary" : "border-border/40"
                      }`}>
                        {/* Journey Node */}
                        <div className={`relative -ml-[25px] flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-background flex items-center justify-center z-10 ${
                          isCompleted ? "bg-accent" : isActive ? "bg-primary animate-pulse" : "bg-muted"
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          ) : isActive ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white" />
                          ) : (
                            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">{rotation.position}</span>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pt-2 pb-4 sm:pb-6 px-3 sm:px-6 rounded-xl border transition-all min-w-0 ${
                          isActive
                            ? "bg-primary/5 border-primary/30 shadow-lg"
                            : isCompleted
                            ? "bg-accent/5 border-accent/20"
                            : "bg-card border-border/40"
                        }`}>
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="min-w-0">
                              <div className="font-semibold text-sm sm:text-lg mb-1 break-words">
                                {rotation.name}
                                {rotation.name === user.name && (
                                  <span className="ml-2 text-xs sm:text-sm text-primary">(You)</span>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{rotation.date}</div>
                            </div>

                            <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                              isCompleted
                                ? "bg-accent/20 text-accent"
                                : isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}>
                              {isCompleted ? "Completed" : isActive ? "Active" : "Upcoming"}
                            </div>
                          </div>

                          {isActive && (
                            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between text-xs sm:text-sm mb-2 sm:mb-3">
                                <span className="text-muted-foreground">Contributions collected</span>
                                <span className="font-semibold">
                                  {circle.membersList?.filter((m) => m.status === "paid").length || 0} of {circle.members}
                                </span>
                              </div>
                              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${((circle.membersList?.filter((m) => m.status === "paid").length || 0) / circle.members) * 100}%`,
                                  }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>

                              {isLeader && (
                                <div className="mt-3 sm:mt-4">
                                  <Button
                                    onClick={handleTriggerPayout}
                                    className="w-full bg-primary hover:bg-primary/90 text-sm"
                                  >
                                    Trigger Payout to {rotation.name}
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {isCompleted && (
                            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground">
                              ✓ Payout of {circle.totalPoolFormatted || `₦${circle.totalPool?.toLocaleString()}`} completed
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Members Sidebar */}
          <div className="space-y-6">
            {/* Payment Box */}
            {isContributionPending && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="p-4 sm:p-6 border-primary/30 bg-primary/5 shadow-md">
                  <h4 className="font-playfair font-bold text-base sm:text-lg mb-2 text-foreground">
                    {frequencyLabel(circle.frequency)} Contribution Due
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Your {frequencyAdverb(circle.frequency)} contribution of{" "}
                    {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`} is due
                    for the current cycle.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setPaymentOpen(true)}>
                    Pay {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Circle Members */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Circle Members</h3>
              <Card className="p-4 sm:p-6 border-border/40">
                <div className="space-y-3 sm:space-y-4">
                  {circle.membersList?.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0 ${
                        member.isYou ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {member.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">
                          {member.name}
                          {member.isYou && <span className="text-primary ml-1">(You)</span>}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
                          <span>Trust: {member.trustScore}</span>
                          <span>•</span>
                          <span className={`${
                            member.status === "paid"
                              ? "text-accent font-medium"
                              : member.status === "upcoming"
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}>
                            {member.status === "paid" ? "✓ Paid" : member.status === "upcoming" ? "Next" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <TrustScore score={member.trustScore} size="small" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Contribution History */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Your Contributions</h3>
              <Card className="p-4 sm:p-6 border-border/40">
                <div className="space-y-3">
                  {circleContributions.length === 0 ? (
                    <div className="text-center py-4 text-xs text-muted-foreground">
                      No contributions made by you yet.
                    </div>
                  ) : (
                    circleContributions.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between text-xs sm:text-sm pb-3 border-b border-border/40 last:border-0 last:pb-0 gap-2"
                      >
                        <span className="text-muted-foreground flex-shrink-0">{c.date}</span>
                        <span className="font-semibold text-accent">{c.amountFormatted}</span>
                      </div>
                    ))
                  )}
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-border/40">
                    <span className="font-medium">Total Contributed</span>
                    <span className="font-bold text-primary">₦{totalContributed.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

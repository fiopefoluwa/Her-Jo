import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrustScore } from "./TrustScore";
import { ArrowLeft, Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PaymentModal } from "./payments/PaymentModal";
import { apiFetch } from "../lib/api";

export function CirclePage() {
  const { id } = useParams();
  
  const [circle, setCircle] = useState(null);
  const [circleContributions, setCircleContributions] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // Filter to contributions for this circle
      const filtered = data.filter(
        (c) => c.circleId === id && c.action === "Contribution received"
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
      console.error("Error triggering payout:", err);
      toast.error(err.message || "Failed to trigger payout");
    }
  };

  const [paymentOpen, setPaymentOpen] = useState(false);

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

      toast.success(`Contribution of ${circle.monthlyContributionFormatted} recorded! Your Trust Score is now ${result.user.trustScore}.`);
      
      // Refresh data
      loadAllData();
    } catch (err) {
      console.error("Error making contribution:", err);
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
        <h1 className="font-playfair text-3xl font-bold mb-4">Circle Not Found</h1>
        <p className="text-muted-foreground mb-6">The savings circle you are looking for does not exist or has been deleted.</p>
        <Link to="/dashboard">
          <Button className="bg-primary hover:bg-primary/90">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  // Find if user's status is pending
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
        userId="user-1"
        onPaymentSuccess={async () => {
          await handleMakeContribution();
          // handleMakeContribution already refreshes data.
        }}
      />

      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
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
        {/* Circle Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <h1 className="font-playfair font-bold text-4xl mb-2">
                {circle.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {circle.description}
              </p>
            </div>
            
            <div className="flex gap-3">
              {isContributionPending && (
                <Button onClick={() => setPaymentOpen(true)} className="bg-primary hover:bg-primary/90">
                  Pay Contribution
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  variant="outline"
                >
                  <Link to={`/group/${circle.id}`}>Group Details</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to={`/record-contribution/${circle.id}`}>Record Contribution</Link>
                </Button>
                <Button variant="outline">Circle Settings</Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Monthly Pool</div>
                  <div className="font-semibold">{circle.totalPoolFormatted || `₦${circle.totalPool?.toLocaleString()}`}</div>
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
                  <div className="font-semibold">{circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Cycle</div>
                  <div className="font-semibold">{circle.currentCycle} of {circle.totalCycles}</div>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold text-xs md:text-sm">{circle.startDate} - {circle.endDate || "Ongoing"}</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Rotation Journey */}
          <div className="lg:col-span-2">
            <h2 className="font-playfair font-bold text-2xl mb-6">The Circle of Continuity</h2>
            
            <Card className="p-8 border-border/40">
              {/* Journey Line Visualization */}
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
                      <div className={`flex items-start gap-6 pb-8 ${!isLast ? 'border-l-2 ml-6' : ''} ${
                        isCompleted ? 'border-accent' : isActive ? 'border-primary' : 'border-border/40'
                      }`}>
                        {/* Journey Node */}
                        <div className={`relative -ml-[25px] flex-shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center z-10 ${
                          isCompleted 
                            ? 'bg-accent' 
                            : isActive 
                            ? 'bg-primary animate-pulse' 
                            : 'bg-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : isActive ? (
                            <div className="w-4 h-4 rounded-full bg-white" />
                          ) : (
                            <span className="text-sm font-semibold text-muted-foreground">
                              {rotation.position}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 pt-2 pb-6 px-6 rounded-xl border transition-all ${
                          isActive 
                            ? 'bg-primary/5 border-primary/30 shadow-lg' 
                            : isCompleted
                            ? 'bg-accent/5 border-accent/20'
                            : 'bg-card border-border/40'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="font-semibold text-lg mb-1">
                                {rotation.name}
                                {rotation.name === "Amina Okafor" && (
                                  <span className="ml-2 text-sm text-primary">(You)</span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {rotation.date}
                              </div>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              isCompleted 
                                ? 'bg-accent/20 text-accent' 
                                : isActive 
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {isCompleted ? 'Completed' : isActive ? 'Active - 5 days left' : 'Upcoming'}
                            </div>
                          </div>
                          
                          {isActive && (
                            <div className="mt-4 pt-4 border-t border-border/40">
                              <div className="flex items-center justify-between text-sm mb-3">
                                <span className="text-muted-foreground">Contributions collected</span>
                                <span className="font-semibold">
                                  {circle.membersList?.filter(m => m.status === 'paid').length || 0} of {circle.members}
                                </span>
                              </div>
                              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${((circle.membersList?.filter(m => m.status === 'paid').length || 0) / circle.members) * 100}%` 
                                  }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                              
                              <div className="mt-4">
                                <Button 
                                  onClick={handleTriggerPayout} 
                                  className="w-full bg-primary hover:bg-primary/90"
                                >
                                  Trigger Payout to {rotation.name}
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="mt-3 text-sm text-muted-foreground">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-6 border-primary/30 bg-primary/5 shadow-md">
                  <h4 className="font-playfair font-bold text-lg mb-2 text-foreground">Monthly Contribution Due</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Your monthly contribution of {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`} is due for the current cycle.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => setPaymentOpen(true)}>
                    Pay {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                  </Button>
                </Card>
              </motion.div>
            )}

            {/* Circle Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-lg mb-4">Circle Members</h3>
              <Card className="p-6 border-border/40">
                <div className="space-y-4">
                  {circle.membersList?.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        member.isYou 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {member.avatar}
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {member.name}
                          {member.isYou && <span className="text-primary ml-1">(You)</span>}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Trust: {member.trustScore}</span>
                          <span>•</span>
                          <span className={`${
                            member.status === 'paid' 
                              ? 'text-accent font-medium' 
                              : member.status === 'upcoming' 
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}>
                            {member.status === 'paid' ? '✓ Paid' : member.status === 'upcoming' ? 'Next' : 'Pending'}
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-semibold text-lg mb-4">Your Contributions</h3>
              <Card className="p-6 border-border/40">
                <div className="space-y-3">
                  {circleContributions.length === 0 ? (
                    <div className="text-center py-4 text-xs text-muted-foreground">No contributions made by you yet.</div>
                  ) : (
                    circleContributions.map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-sm pb-3 border-b border-border/40 last:border-0 last:pb-0">
                        <span className="text-muted-foreground">{c.date}</span>
                        <span className="font-semibold text-accent">{c.amountFormatted}</span>
                      </div>
                    ))
                  )}
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border/40">
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

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { ArrowLeft, Users, Zap, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { RoleGuard } from "../components/RoleGuard";
import { InviteSection } from "../components/InviteSection";
import { ProfileAvatar } from "../components/ProfileAvatar";

export function CircleSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [circle, setCircle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch(`/circles/${id}`);
        setCircle(data);
      } catch (err) {
        toast.error(err.message || "Failed to load circle settings.");
        navigate(`/circle/${id}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleTriggerPayout = async () => {
    try {
      const result = await apiFetch(`/circles/${id}/payout`, { method: "POST" });
      toast.success(result.message || "Payout triggered successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to trigger payout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading circle settings...</div>
      </div>
    );
  }

  if (!circle) return null;

  return (
    <RoleGuard role={circle.currentUserRole} circleId={id}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Link
              to={`/circle/${id}`}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 sm:mb-10"
          >
            <h1 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
              Circle Settings
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">{circle.name}</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: General Info + Invite */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* General Information */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="p-4 sm:p-6 md:p-8 border-border/40">
                  <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-6">General Information</h2>
                  <div className="space-y-4 sm:space-y-5">
                    <div className="space-y-2">
                      <Label className="text-foreground">Circle Name</Label>
                      <Input
                        value={circle.name}
                        readOnly
                        className="bg-muted/40 border-border/40"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground">Description</Label>
                      <Textarea
                        value={circle.description || ""}
                        readOnly
                        className="bg-muted/40 border-border/40 min-h-[80px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-foreground">Contribution Amount</Label>
                        <Input
                          value={circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}
                          readOnly
                          className="bg-muted/40 border-border/40"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground">Frequency</Label>
                        <Input
                          value={circle.frequency || "Monthly"}
                          readOnly
                          className="bg-muted/40 border-border/40"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Invite Members */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                id="invite"
              >
                <Card className="p-4 sm:p-6 md:p-8 border-border/40">
                  <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-6">Invite Members</h2>
                  <InviteSection
                    inviteCode={circle.inviteCode}
                    inviteLink={circle.inviteLink}
                  />
                </Card>
              </motion.div>
            </div>

            {/* Right: Leader Tools */}
            <div className="space-y-4 sm:space-y-6">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <Card className="p-4 sm:p-6 border-border/40">
                  <h2 className="font-playfair font-bold text-lg sm:text-xl mb-4 sm:mb-6">Leader Tools</h2>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 justify-start"
                      onClick={() => document.getElementById("invite")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      Invite Members
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-border/40"
                      onClick={() => toast.info("Manage Circle — coming soon")}
                    >
                      <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                      Manage Circle
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start border-border/40"
                      onClick={handleTriggerPayout}
                    >
                      <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                      Trigger Payout
                    </Button>
                  </div>

                  <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-border/40 space-y-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Coming Soon</p>
                    {["Manage Members", "Circle Rules", "Merchant Settings"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 text-sm text-muted-foreground"
                      >
                        <span>{item}</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Soon</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Circle Quick Stats */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <Card className="p-4 sm:p-6 border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
                  <h3 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4 text-muted-foreground uppercase tracking-wider">
                    Circle Overview
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Members</span>
                      <span className="font-medium">{circle.members}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cycle</span>
                      <span className="font-medium">{circle.currentCycle} of {circle.totalCycles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Pool</span>
                      <span className="font-medium">{circle.totalPoolFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium capitalize">{circle.status}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

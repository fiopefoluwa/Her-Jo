import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TrustScore } from "../components/TrustScore";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { MobileNavMenu } from "../components/MobileNavMenu";
import { useAuth } from "../context/AuthContext";
import { Plus, ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";
import { frequencyLabel, frequencyAdverb } from "../lib/frequency";
import { HerJoLogo } from "../components/HerJoLogo";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";

export function Dashboard() {
  const user = useAuth();

  const [savingsCircles, setSavingsCircles] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [members, setMembers] = useState("6");
  const [frequency, setFrequency] = useState("monthly");

  const fetchCircles = async () => {
    try {
      const data = await apiFetch("/circles");
      setSavingsCircles(data);
    } catch (err) {
      console.error("Error fetching circles:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const data = await apiFetch("/contributions");
      setRecentActivity(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchCircles(), fetchActivities()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCircle = async (e) => {
    e?.preventDefault?.();

    if (!name || !monthlyContribution) {
      toast.error("Please enter a Circle Name and Contribution amount");
      return;
    }

    try {
      const newCircle = await apiFetch("/circles", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          monthlyContribution: Number(monthlyContribution),
          members: Number(members),
          frequency,
        }),
      });

      toast.success(`Savings circle "${newCircle.name}" created successfully!`);

      setName("");
      setDescription("");
      setMonthlyContribution("");
      setMembers("6");
      setFrequency("monthly");
      setIsOpen(false);

      loadData();
    } catch (err) {
      console.error("Error creating circle:", err);
      toast.error(err.message || "Failed to create savings circle");
    }
  };

  const mobileNavItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "My Circles", href: "#circles" },
    { label: "Activity", href: "#activity" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left: hamburger on mobile, nav links on desktop */}
          <div className="flex items-center gap-6">
            <MobileNavMenu items={mobileNavItems} />
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-primary">Dashboard</Link>
              <a href="#circles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">My Circles</a>
              <a href="#activity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Activity</a>
            </div>
          </div>

          {/* Right: logo sitting right next to the profile avatar */}
          <div className="flex items-center gap-3">
            <HerJoLogo />
            <ProfileAvatar />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
          <h1 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your savings journey continues to grow stronger with each contribution
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-4 sm:p-6 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Saved</div>
              </div>
              <div className="font-playfair text-xl sm:text-3xl font-bold">{user.totalSavedFormatted}</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-4 sm:p-6 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Circles</div>
              </div>
              <div className="font-playfair text-xl sm:text-3xl font-bold">{user.activeCycles}</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-4 sm:p-6 border-border/40">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="font-playfair text-xl sm:text-3xl font-bold">{user.completedCycles}</div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-4 sm:p-6 border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Trust Score</div>
              <div className="font-playfair text-xl sm:text-3xl font-bold text-primary mb-1">{user.trustScore}</div>
              <div className="text-xs text-muted-foreground">Excellent standing</div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Savings Circles */}
          <div className="lg:col-span-2" id="circles">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="font-playfair font-bold text-xl sm:text-2xl">Your Savings Circles</h2>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90" size="sm">
                    <Plus className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Circle</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[425px] bg-card border-border/40 max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleCreateCircle}>
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-xl sm:text-2xl text-foreground">
                        Create a Savings Circle
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground text-sm">
                        Form a new Esusu/Ajo circle. Set the contribution details and invite members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-foreground">Circle Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Market Women Alliance"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-background border-border/40"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="What is this savings circle for?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="bg-background border-border/40 min-h-[80px]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-foreground">Contribution Frequency</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: "daily", label: "Daily" },
                            { value: "weekly", label: "Weekly" },
                            { value: "monthly", label: "Monthly" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setFrequency(opt.value)}
                              className={[
                                "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                                frequency === opt.value
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border/40 bg-background text-muted-foreground hover:border-border hover:text-foreground",
                              ].join(" ")}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="contribution" className="text-foreground">
                            {frequencyLabel(frequency)} Contribution Amount (₦)
                          </Label>
                          <Input
                            id="contribution"
                            type="number"
                            placeholder="50000"
                            value={monthlyContribution}
                            onChange={(e) => setMonthlyContribution(e.target.value)}
                            className="bg-background border-border/40"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="members" className="text-foreground">Total Members</Label>
                          <Input
                            id="members"
                            type="number"
                            min="2"
                            max="12"
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                            className="bg-background border-border/40"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-2">
                        Start Circle
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading savings circles...</div>
              ) : savingsCircles.length === 0 ? (
                <Card className="p-6 sm:p-8 text-center border-border/40">
                  <div className="text-muted-foreground mb-4">You are not in any savings circles yet.</div>
                  <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90">
                    Create Your First Circle
                  </Button>
                </Card>
              ) : (
                savingsCircles.map((circle, index) => (
                  <motion.div
                    key={circle.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Card className="p-4 sm:p-6 border-border/40 hover:shadow-lg transition-all cursor-pointer group">
                      <Link to={`/circle/${circle.id}`}>
                        <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg mb-1 group-hover:text-primary transition-colors truncate">
                              {circle.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                                {circle.members} members
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>
                                {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}/{frequencyAdverb(circle.frequency)}
                              </span>
                            </div>
                          </div>

                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            circle.nextPayout === "You"
                              ? "bg-accent/20 text-accent"
                              : circle.status === "completed"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-muted text-muted-foreground"
                          }`}>
                            {circle.nextPayout === "You"
                              ? "Your Turn"
                              : circle.status === "completed"
                                ? "Completed"
                                : "Active"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs sm:text-sm text-muted-foreground mb-1">Next Payout</div>
                            <div className="font-medium text-sm sm:text-base">{circle.nextPayout || "N/A"}</div>
                            {circle.daysUntilPayout !== null && circle.daysUntilPayout > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">in {circle.daysUntilPayout} days</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-xs sm:text-sm text-muted-foreground">Progress</div>
                              <div className="text-xs sm:text-sm font-medium">
                                Cycle {circle.currentCycle} of {circle.totalCycles}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>

                        <div className="mt-3 sm:mt-4 relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: circle.totalCycles > 0
                                ? `${(circle.currentCycle / circle.totalCycles) * 100}%`
                                : "0%",
                            }}
                            transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                          />
                        </div>
                      </Link>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Trust Score & Activity Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 sm:p-8 border-border/40 bg-gradient-to-br from-card to-muted/20">
                <TrustScore score={user.trustScore} />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              id="activity"
            >
              <Card className="p-4 sm:p-6 border-border/40">
                <h3 className="font-semibold text-base sm:text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">Loading activity...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">No activity recorded yet.</div>
                  ) : (
                    recentActivity.map((activity, index) => (
                      <div
                        key={activity.id || index}
                        className="flex items-start gap-3 pb-4 border-b border-border/40 last:border-0 last:pb-0"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs sm:text-sm mb-1 break-words">{activity.action}</div>
                          {activity.circle && (
                            <div className="text-xs text-muted-foreground truncate">{activity.circle}</div>
                          )}
                          {activity.amount && (
                            <div className="text-xs sm:text-sm text-accent mt-1">{activity.amountFormatted}</div>
                          )}
                          {activity.recipient && (
                            <div className="text-xs text-primary font-medium mt-1">
                              Recipient: {activity.recipient}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0 ml-2">{activity.date}</div>
                      </div>
                    ))
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

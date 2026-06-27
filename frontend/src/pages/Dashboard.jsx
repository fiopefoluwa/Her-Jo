import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { TrustScore } from "../components/TrustScore";
import { Plus, ArrowRight, Users, Calendar, TrendingUp, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { apiFetch, clearToken } from "../lib/api";
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
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };
  const [userProfile, setUserProfile] = useState(null);
  const [savingsCircles, setSavingsCircles] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [members, setMembers] = useState("6");


  const fetchUserProfile = async () => {
    try {
      const data = await apiFetch("/auth/me");
      setUserProfile({
        name: data.name,
        trustScore: data.trustScore,
        totalSaved: data.totalSavedFormatted,
        activeCycles: data.activeCycles,
        completedCycles: data.completedCycles,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

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
    await Promise.all([fetchUserProfile(), fetchCircles(), fetchActivities()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCircle = async (e) => {
    // Extra guard: if this handler is ever invoked via a non-submit click,
    // prevent accidental navigation.
    e?.preventDefault?.();

    if (e && e.nativeEvent && typeof e.nativeEvent.stopPropagation === "function") {
      e.nativeEvent.stopPropagation();
    }

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
        }),
      });

      toast.success(`Savings circle "${newCircle.name}" created successfully!`);

      // Reset state and close dialog
      setName("");
      setDescription("");
      setMonthlyContribution("");
      setMembers("6");
      setIsOpen(false);

      // Refresh data
      loadData();
    } catch (err) {
      console.error("Error creating circle:", err);
      toast.error(err.message || "Failed to create savings circle");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-playfair font-bold text-xl">H</span>
            </div>
            <span className="font-playfair font-bold text-xl tracking-tight">HerJo</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <a
              href="#circles"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              My Circles
            </a>
            <a
              href="#activity"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Activity
            </a>

            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">AO</span>
            </div>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-playfair font-bold text-4xl mb-2">
            Welcome back, {userProfile?.name ? userProfile.name.split(" ")[0] : ""}
          </h1>

          <p className="text-muted-foreground">
            Your savings journey continues to grow stronger with each contribution
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground">Total Saved</div>
              </div>
              <div className="font-playfair text-3xl font-bold">{userProfile?.totalSaved ?? "₦0"}</div>

            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div className="text-sm text-muted-foreground">Active Circles</div>
              </div>
              <div className="font-playfair text-3xl font-bold">{userProfile?.activeCycles ?? 0}</div>

            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 border-border/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="font-playfair text-3xl font-bold">{userProfile?.completedCycles ?? 0}</div>

            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 border-border/40 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="text-sm text-muted-foreground mb-2">Trust Score</div>
              <div className="font-playfair text-3xl font-bold text-primary mb-1">
                {userProfile?.trustScore ?? 0}

              </div>
              <div className="text-xs text-muted-foreground">Excellent standing</div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Savings Circles */}
          <div className="lg:col-span-2" id="circles">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair font-bold text-2xl">Your Savings Circles</h2>

              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    New Circle
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-card border-border/40">
                  <form onSubmit={handleCreateCircle}>
                    <DialogHeader>
                      <DialogTitle className="font-playfair text-2xl text-foreground">
                        Create a Savings Circle
                      </DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Form a new Esusu/Ajo circle. Set the contribution details and invite members.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name" className="text-foreground">
                          Circle Name
                        </Label>
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
                        <Label htmlFor="description" className="text-foreground">
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          placeholder="What is this savings circle for?"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="bg-background border-border/40 min-h-[80px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="contribution" className="text-foreground">
                            Monthly Contribution (₦)
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
                          <Label htmlFor="members" className="text-foreground">
                            Total Members
                          </Label>
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
                <Card className="p-8 text-center border-border/40">
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
                    <Card className="p-6 border-border/40 hover:shadow-lg transition-all cursor-pointer group">
                      <Link to={`/circle/${circle.id}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                              {circle.name}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {circle.members} members
                              </span>
                              <span>•</span>
                              <span>
                                {circle.monthlyContributionFormatted || `₦${circle.monthlyContribution?.toLocaleString()}`}/month
                              </span>
                            </div>
                          </div>

                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              circle.nextPayout === "You"
                                ? "bg-accent/20 text-accent"
                                : circle.status === "completed"
                                  ? "bg-secondary/20 text-secondary"
                                  : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {circle.nextPayout === "You"
                              ? "Your Turn Soon"
                              : circle.status === "completed"
                                ? "Completed"
                                : "Active"}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Next Payout</div>
                            <div className="font-medium">{circle.nextPayout || "N/A"}</div>
                            {circle.daysUntilPayout !== null && circle.daysUntilPayout > 0 && (
                              <div className="text-xs text-muted-foreground mt-1">in {circle.daysUntilPayout} days</div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Progress</div>
                              <div className="text-sm font-medium">
                                Cycle {circle.currentCycle} of {circle.totalCycles}
                              </div>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>

                        <div className="mt-4 relative h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width:
                                circle.totalCycles > 0
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
            {/* Trust Score Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
                <Card className="p-8 border-border/40 bg-gradient-to-br from-card to-muted/20">
                <TrustScore score={userProfile?.trustScore ?? 0} />
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              id="activity"
            >
              <Card className="p-6 border-border/40">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
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
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm mb-1">{activity.action}</div>
                          <div className="text-xs text-muted-foreground">{activity.circle}</div>
                          {activity.amount && (
                            <div className="text-sm text-accent mt-1">{activity.amountFormatted}</div>
                          )}
                          {activity.recipient && (
                            <div className="text-xs text-primary font-medium mt-1">
                              Recipient: {activity.recipient}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.date}</div>
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


import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrustScore } from "./TrustScore";
import { WovenDivider } from "./WovenDivider";
import { Plus, ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

// Mock data
const userProfile = {
  name: "Amina Okafor",
  trustScore: 87,
  totalSaved: "₦340,000",
  activeCycles: 3,
  completedCycles: 12,
};

const savingsCircles = [
  {
    id: "circle-1",
    name: "Market Women Alliance",
    members: 8,
    monthlyContribution: "₦50,000",
    nextPayout: "Bisi Adekunle",
    daysUntilPayout: 5,
    status: "active",
    currentCycle: 3,
    totalCycles: 8,
  },
  {
    id: "circle-2",
    name: "Tech Sisters Savings",
    members: 6,
    monthlyContribution: "₦75,000",
    nextPayout: "You",
    daysUntilPayout: 12,
    status: "upcoming",
    currentCycle: 2,
    totalCycles: 6,
  },
  {
    id: "circle-3",
    name: "Traders Circle",
    members: 10,
    monthlyContribution: "₦30,000",
    nextPayout: "Chika Nwosu",
    daysUntilPayout: 18,
    status: "active",
    currentCycle: 7,
    totalCycles: 10,
  },
];

const recentActivity = [
  { action: "Contribution received", circle: "Market Women Alliance", amount: "₦50,000", date: "2 days ago" },
  { action: "Payout completed", circle: "Tech Sisters Savings", amount: "₦450,000", date: "1 week ago" },
  { action: "Circle started", circle: "Traders Circle", amount: "—", date: "2 weeks ago" },
];

export function Dashboard() {
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
            <a href="#circles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              My Circles
            </a>
            <a href="#activity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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
            Welcome back, {userProfile.name.split(' ')[0]}
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
              <div className="font-playfair text-3xl font-bold">{userProfile.totalSaved}</div>
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
              <div className="font-playfair text-3xl font-bold">{userProfile.activeCycles}</div>
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
              <div className="font-playfair text-3xl font-bold">{userProfile.completedCycles}</div>
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
                {userProfile.trustScore}
              </div>
              <div className="text-xs text-muted-foreground">
                Excellent standing
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Savings Circles */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-playfair font-bold text-2xl">Your Savings Circles</h2>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Circle
              </Button>
            </div>

            <div className="space-y-4">
              {savingsCircles.map((circle, index) => (
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
                            <span>{circle.monthlyContribution}/month</span>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          circle.nextPayout === "You" 
                            ? "bg-accent/20 text-accent" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {circle.nextPayout === "You" ? "Your Turn Soon" : "Active"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Next Payout</div>
                          <div className="font-medium">{circle.nextPayout}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            in {circle.daysUntilPayout} days
                          </div>
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
                          animate={{ width: `${(circle.currentCycle / circle.totalCycles) * 100}%` }}
                          transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                        />
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              ))}
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
                <TrustScore score={userProfile.trustScore} />
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 border-border/40">
                <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border/40 last:border-0 last:pb-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.circle}</div>
                        {activity.amount !== "—" && (
                          <div className="text-sm text-accent mt-1">{activity.amount}</div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.date}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

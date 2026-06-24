import { Link, useParams } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { TrustScore } from "./TrustScore";
import { ArrowLeft, Calendar, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";

// Mock circle data
const circleData = {
  "circle-1": {
    name: "Market Women Alliance",
    description: "A trusted circle of market traders supporting each other's business growth",
    monthlyContribution: "₦50,000",
    totalPool: "₦400,000",
    members: [
      { id: 1, name: "Amina Okafor", trustScore: 87, status: "paid", avatar: "AO", isYou: true },
      { id: 2, name: "Bisi Adekunle", trustScore: 92, status: "upcoming", avatar: "BA", isYou: false },
      { id: 3, name: "Chika Nwosu", trustScore: 78, status: "pending", avatar: "CN", isYou: false },
      { id: 4, name: "Dami Okonkwo", trustScore: 85, status: "pending", avatar: "DO", isYou: false },
      { id: 5, name: "Ese Ogbonna", trustScore: 90, status: "pending", avatar: "EO", isYou: false },
      { id: 6, name: "Funmi Adeleke", trustScore: 88, status: "pending", avatar: "FA", isYou: false },
      { id: 7, name: "Grace Udoka", trustScore: 82, status: "pending", avatar: "GU", isYou: false },
      { id: 8, name: "Helen Chukwu", trustScore: 94, status: "pending", avatar: "HC", isYou: false },
    ],
    rotationSchedule: [
      { position: 1, name: "Amina Okafor", status: "completed", date: "Jan 15, 2026" },
      { position: 2, name: "Bisi Adekunle", status: "active", date: "Feb 15, 2026" },
      { position: 3, name: "Chika Nwosu", status: "upcoming", date: "Mar 15, 2026" },
      { position: 4, name: "Dami Okonkwo", status: "upcoming", date: "Apr 15, 2026" },
      { position: 5, name: "Ese Ogbonna", status: "upcoming", date: "May 15, 2026" },
      { position: 6, name: "Funmi Adeleke", status: "upcoming", date: "Jun 15, 2026" },
      { position: 7, name: "Grace Udoka", status: "upcoming", date: "Jul 15, 2026" },
      { position: 8, name: "Helen Chukwu", status: "upcoming", date: "Aug 15, 2026" },
    ],
    currentCycle: 2,
    startDate: "January 2026",
    endDate: "August 2026",
  },
};

export function CirclePage() {
  const { id } = useParams();
  const circle = circleData[id as keyof typeof circleData] || circleData["circle-1"];

  return (
    <div className="min-h-screen bg-background">
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
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-playfair font-bold text-4xl mb-2">
                {circle.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {circle.description}
              </p>
            </div>
            
            <Button variant="outline">Circle Settings</Button>
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
                  <div className="font-semibold">{circle.totalPool}</div>
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
                  <div className="font-semibold">{circle.monthlyContribution}</div>
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
                  <div className="font-semibold">{circle.currentCycle} of {circle.members.length}</div>
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
                  <div className="font-semibold text-sm">{circle.startDate} - {circle.endDate}</div>
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
                {circle.rotationSchedule.map((rotation, index) => {
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
                        <div className={`relative -ml-[25px] flex-shrink-0 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center ${
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
                                <span className="font-semibold">7 of 8</span>
                              </div>
                              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: '87.5%' }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                              
                              <div className="mt-4">
                                <Button className="w-full bg-primary hover:bg-primary/90">
                                  Trigger Payout to Bisi
                                </Button>
                              </div>
                            </div>
                          )}
                          
                          {isCompleted && (
                            <div className="mt-3 text-sm text-muted-foreground">
                              ✓ Payout of {circle.totalPool} completed
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
            {/* Circle Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="font-semibold text-lg mb-4">Circle Members</h3>
              <Card className="p-6 border-border/40">
                <div className="space-y-4">
                  {circle.members.map((member, index) => (
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
                              ? 'text-accent' 
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
                  <div className="flex items-center justify-between text-sm pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Feb 2026</span>
                    <span className="font-semibold text-accent">₦50,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pb-3 border-b border-border/40">
                    <span className="text-muted-foreground">Jan 2026</span>
                    <span className="font-semibold text-accent">₦50,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2">
                    <span className="font-medium">Total Contributed</span>
                    <span className="font-bold text-primary">₦100,000</span>
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

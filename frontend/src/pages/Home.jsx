import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  ArrowRight,
  Shield,
  Users,
  TrendingUp,
  Sparkles,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { WovenDivider } from "../components/WovenDivider";
import { MobileNavMenu } from "../components/MobileNavMenu";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

export function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  const demoSteps = [
    {
      title: "1. Create Your Savings Circle",
      description:
        "Form a digital Esusu/Ajo circle with family or trusted traders. Set custom contribution amounts and invite members seamlessly.",
      visual: (
        <div className="bg-card border border-border/40 p-4 sm:p-6 rounded-xl space-y-4 shadow-inner w-full max-w-sm mx-auto text-left">
          <div className="font-playfair text-xl font-bold border-b border-border/40 pb-2 text-foreground">
            Market Women Alliance
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm text-muted-foreground">
            <div>
              <div>Monthly Contribution</div>
              <div className="font-semibold text-foreground">₦50,000</div>
            </div>
            <div>
              <div>Total Members</div>
              <div className="font-semibold text-foreground">8 Members</div>
            </div>
            <div>
              <div>Monthly Payout</div>
              <div className="font-semibold text-foreground">₦400,000</div>
            </div>
            <div>
              <div>Start Date</div>
              <div className="font-semibold text-foreground">Jan 2026</div>
            </div>
          </div>
          <div className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-1 rounded text-center font-medium mt-2">
            Active Cycle 1 of 8
          </div>
        </div>
      ),
    },
    {
      title: "2. Watch Your Trust Vessel Grow",
      description:
        "As you make on-time contributions, your Trust Score rises. This score is represented visually as a gorgeous traditional African clay vessel that becomes richer in detail.",
      visual: (
        <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-card border border-border/40 rounded-xl w-full max-w-sm mx-auto shadow-inner">
          <div className="w-28 h-28 sm:w-36 sm:h-36 relative mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="demo-pot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#B85C42" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
              </defs>
              <path
                d="M 50 15 C 35 15 25 25 25 45 C 25 65 35 85 50 85 C 65 85 75 65 75 45 C 75 25 65 15 50 15 Z"
                fill="url(#demo-pot-grad)"
                opacity="0.85"
              />
              <path d="M 35 30 L 65 30" stroke="#FFF" strokeWidth="2" strokeDasharray="3,3" opacity="0.7" />
              <path d="M 27 45 C 38 45 42 55 50 55 C 58 55 62 45 73 45" stroke="#FFF" strokeWidth="2" opacity="0.8" />
              <circle cx="50" cy="45" r="16" fill="none" stroke="#FFF" strokeWidth="1.5" strokeDasharray="5,2" opacity="0.6" />
            </svg>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Trust Score</div>
            <div className="font-playfair text-3xl font-bold text-primary">87 / 100</div>
            <div className="text-xs text-secondary mt-1 font-semibold">"Excellent Standing"</div>
          </div>
        </div>
      ),
    },
    {
      title: "3. Transparent Rotation & Payouts",
      description:
        "When your turn arrives in the rotation schedule, you receive the full pooled payout instantly. The cycle continues transparently until all members are paid.",
      visual: (
        <div className="bg-card border border-border/40 p-3 sm:p-4 rounded-xl space-y-3 shadow-inner w-full max-w-sm mx-auto text-left text-sm">
          <div className="flex items-center justify-between font-semibold border-b border-border/40 pb-2 text-foreground">
            <span>Rotation Schedule</span>
            <span className="text-xs text-accent">Cycle 2 of 8</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-accent/5 p-2 rounded border border-accent/20">
              <span className="text-xs text-accent font-medium">✓ Amina Okafor (You)</span>
              <span className="text-xs text-muted-foreground">Jan 15 (Paid)</span>
            </div>
            <div className="flex justify-between items-center bg-primary/10 p-2 rounded border border-primary/30 animate-pulse">
              <span className="text-xs text-primary font-bold">● Bisi Adekunle</span>
              <span className="text-xs text-primary font-medium">Feb 15 (Active)</span>
            </div>
            <div className="flex justify-between items-center opacity-60 p-2 rounded text-muted-foreground">
              <span className="text-xs">Chika Nwosu</span>
              <span className="text-xs">Mar 15 (Upcoming)</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const mobileNavItems = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Trust System", href: "#trust" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-playfair font-bold text-xl">H</span>
            </div>
            <span className="font-playfair font-bold text-xl tracking-tight">HerJo</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#trust" className="text-sm hover:text-primary transition-colors">
              Trust System
            </a>
            <Link to="/login">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <MobileNavMenu
            items={mobileNavItems}
            actions={
              <>
                <Link to="/login" onClick={() => {}}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            }
          />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-sm text-accent">Modern Ajo • Digital Esusu</span>
            </div>

            <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
              The Digital Fabric of Trust
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              HerJo brings the warmth of traditional savings circles into the modern era. Built on community, continuity,
              and shared responsibility — not cold transactions.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Start Your Circle
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setIsDemoOpen(true);
                  setDemoStep(0);
                }}
              >
                Watch Demo
              </Button>
            </div>

            <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <div className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-1">12K+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-1">₦2.4B</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Saved Together</div>
              </div>
              <div>
                <div className="font-playfair text-2xl sm:text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Trust Rate</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative mt-4 lg:mt-0"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655720357872-ce227e4164ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tZW4lMjBlbnRyZXByZW5ldXIlMjBidXNpbmVzcyUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzgyMjA4NzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African women entrepreneurs collaborating in business"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative woven pattern overlay */}
            <div className="absolute -top-4 -right-4 w-20 h-20 sm:w-24 sm:h-24 opacity-20">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <pattern id="kente-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="10" height="10" fill="#B85C42" />
                  <rect x="10" y="10" width="10" height="10" fill="#4A5D7F" />
                  <rect x="10" y="0" width="10" height="10" fill="#7A8F6B" />
                  <rect x="0" y="10" width="10" height="10" fill="#D4A574" />
                </pattern>
                <rect width="100" height="100" fill="url(#kente-pattern)" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      <WovenDivider />

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-4">
            A Financial System Built on Community
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Not a transaction platform decorated with patterns. A trust system that grew from cultural memory.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-playfair font-semibold text-xl mb-3">Join a Circle</h3>
            <p className="text-muted-foreground leading-relaxed">
              Form or join a savings group with trusted members. Each circle sets its own contribution amount and rotation schedule.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-playfair font-semibold text-xl mb-3">Contribute Regularly</h3>
            <p className="text-muted-foreground leading-relaxed">
              Make your agreed contributions on schedule. Each payment strengthens your trust score and the circle's bond.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border/40 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-playfair font-semibold text-xl mb-3">Receive Your Payout</h3>
            <p className="text-muted-foreground leading-relaxed">
              When your turn comes in the rotation, receive the full pooled amount. The circle continues until everyone receives.
            </p>
          </motion.div>
        </div>
      </section>

      <WovenDivider />

      {/* Trust System */}
      <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1534470717-233b39a41c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tZW4lMjB0cmFkZXIlMjBtYXJrZXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgyMjA4NzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African woman professional trader"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-6 lg:mt-0"
          >
            <h2 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-6">
              Trust That Grows Like Woven Fabric
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
              Your Trust Score isn't a number on a screen. It's represented as a handcrafted pot
              that becomes more intricate and beautiful with each contribution you make.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Building Over Time</h4>
                  <p className="text-sm text-muted-foreground">
                    Every on-time contribution adds detail to your trust vessel, symbolizing accumulated reliability.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Community Recognition</h4>
                  <p className="text-sm text-muted-foreground">
                    Higher trust scores unlock the ability to join premium circles and lead new groups.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Cultural Connection</h4>
                  <p className="text-sm text-muted-foreground">
                    A visual language rooted in traditional craft, not generic fintech metrics.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <WovenDivider />

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair font-bold text-2xl sm:text-3xl md:text-4xl mb-6">
            Ready to Join the Circle?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience savings the way it was meant to be — rooted in trust, community, and cultural continuity.
          </p>

          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90 group">
              Create Your First Circle
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-playfair font-bold">H</span>
                </div>
                <span className="font-playfair font-bold tracking-tight">HerJo</span>
              </div>
              <p className="text-sm text-muted-foreground">Modern savings circles rooted in tradition.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#" className="hover:text-foreground transition-colors">How it Works</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Trust System</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Pricing</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#" className="hover:text-foreground transition-colors">About Us</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Careers</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Contact</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#" className="hover:text-foreground transition-colors">Privacy</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Terms</a></div>
                <div><a href="#" className="hover:text-foreground transition-colors">Security</a></div>
              </div>
            </div>
          </div>

          <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2026 HerJo. Built with trust, continuity, and cultural memory.
          </div>
        </div>
      </footer>

      {/* Interactive Demo Walkthrough Dialog */}
      <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-lg bg-card border-border/40 text-center p-5 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-playfair text-xl sm:text-3xl font-bold text-foreground">
              {demoSteps[demoStep].title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2 text-sm leading-relaxed max-w-md mx-auto">
              {demoSteps[demoStep].description}
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 sm:my-8 py-2 sm:py-4 flex items-center justify-center min-h-[180px] sm:min-h-[220px]">
            {demoSteps[demoStep].visual}
          </div>

          <div className="flex items-center justify-between border-t border-border/40 pt-4 sm:pt-6 mt-2 sm:mt-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDemoStep((prev) => Math.max(0, prev - 1))}
                disabled={demoStep === 0}
                type="button"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setDemoStep((prev) => Math.min(demoSteps.length - 1, prev + 1))}
                disabled={demoStep === demoSteps.length - 1}
                type="button"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              {demoSteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === demoStep ? "bg-primary scale-110" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {demoStep === demoSteps.length - 1 ? (
              <Link to="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 font-medium text-sm">
                  Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90 font-medium text-sm"
                onClick={() => setDemoStep((prev) => prev + 1)}
                type="button"
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

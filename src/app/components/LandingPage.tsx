import { Link } from "react-router";
import { Button } from "./ui/button";
import { ArrowRight, Shield, Users, TrendingUp, Sparkles } from "lucide-react";
import { WovenDivider } from "./WovenDivider";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-playfair font-bold text-xl">H</span>
            </div>
            <span className="font-playfair font-bold text-xl tracking-tight">HerJo</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm hover:text-primary transition-colors">
              How it Works
            </a>
            <a href="#trust" className="text-sm hover:text-primary transition-colors">
              Trust System
            </a>
            <Link to="/dashboard">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <span className="text-sm text-accent">Modern Ajo • Digital Esusu</span>
            </div>
            
            <h1 className="font-playfair font-bold text-5xl lg:text-6xl leading-tight mb-6">
              The Digital Fabric of Trust
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              HerJo brings the warmth of traditional savings circles into the modern era. 
              Built on community, continuity, and shared responsibility — not cold transactions.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                  Start Your Circle
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div>
                <div className="font-playfair text-3xl font-bold text-primary mb-1">12K+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="font-playfair text-3xl font-bold text-primary mb-1">₦2.4B</div>
                <div className="text-sm text-muted-foreground">Saved Together</div>
              </div>
              <div>
                <div className="font-playfair text-3xl font-bold text-primary mb-1">98%</div>
                <div className="text-sm text-muted-foreground">Trust Rate</div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1655720357872-ce227e4164ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tZW4lMjBlbnRyZXByZW5ldXIlMjBidXNpbmVzcyUyMGNvbGxhYm9yYXRpb258ZW58MXx8fHwxNzgyMjA4NzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African women entrepreneurs collaborating in business"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative woven pattern overlay */}
            <div className="absolute -top-4 -right-4 w-24 h-24 opacity-20">
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
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-playfair font-bold text-4xl mb-4">
            A Financial System Built on Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not a transaction platform decorated with patterns. A trust system that grew from cultural memory.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border/40 rounded-xl p-8 hover:shadow-lg transition-shadow"
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
            className="bg-card border border-border/40 rounded-xl p-8 hover:shadow-lg transition-shadow"
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
            className="bg-card border border-border/40 rounded-xl p-8 hover:shadow-lg transition-shadow"
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
      <section id="trust" className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden border border-border/40 shadow-xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1534470717-233b39a41c54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwd29tYW4lMjB0cmFkZXIlMjBtYXJrZXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzgyMjA4NzE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="African woman professional trader"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-playfair font-bold text-4xl mb-6">
              Trust That Grows Like Woven Fabric
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
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
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair font-bold text-4xl mb-6">
            Ready to Join the Circle?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
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
      <footer className="border-t border-border/40 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-playfair font-bold">H</span>
                </div>
                <span className="font-playfair font-bold tracking-tight">HerJo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern savings circles rooted in tradition.
              </p>
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
          
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2026 HerJo. Built with trust, continuity, and cultural memory.
          </div>
        </div>
      </footer>
    </div>
  );
}

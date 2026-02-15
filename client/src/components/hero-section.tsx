import { Link } from "wouter";
import { Compass, Heart, Globe, Sparkles, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const features = [
    { icon: Award, label: "Artisan Verified", color: "text-primary" },
    { icon: Globe, label: "Worldwide Shipping", color: "text-secondary" },
    { icon: Shield, label: "Secure Payments", color: "text-accent" },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Multi-layer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-accent/5 to-secondary/15"></div>
      <div className="hero-pattern absolute inset-0 opacity-40"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-accent/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-20 right-20 w-80 h-80 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-secondary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="flex justify-center lg:justify-start animate-slide-in-down" style={{ animationDelay: '0s' }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-semibold text-primary hover:bg-primary/15 smooth-transition">
                <Sparkles className="w-4 h-4" />
                Welcome to Artisan Collective
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight text-foreground">
              <span className="block animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="text-primary animate-fade-in" style={{ animationDelay: '0.2s' }}>Discover</span> Authentic
              </span>
              <span className="block animate-slide-in-up bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent" style={{ animationDelay: '0.3s' }}>
                Handcrafted Treasures
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed animate-slide-in-up max-w-xl" style={{ animationDelay: '0.4s' }}>
              Connect directly with master artisans from around the globe. Each handmade creation tells a unique story of tradition, culture, and exceptional craftsmanship. Support sustainable practices while owning pieces that truly matter.
            </p>

            {/* Feature highlights */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-3 px-4 py-3 bg-white/40 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/60 smooth-transition hover:scale-110 group"
                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                  >
                    <Icon className={`w-5 h-5 ${feature.color} group-hover:scale-125 smooth-transition`} />
                    <span className="text-sm font-semibold text-foreground">{feature.label}</span>
                  </div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
              <Link href="/marketplace">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl hover:scale-110 smooth-transition button-hover px-8 py-6 text-lg font-semibold w-full sm:w-auto group" 
                  data-testid="button-explore-crafts"
                >
                  <Compass className="mr-2 h-6 w-6 group-hover:rotate-12 smooth-transition" />
                  Start Exploring Now
                </Button>
              </Link>
              <Link href="/artisan-signup">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground smooth-transition shadow-lg hover:shadow-xl hover:scale-110 button-hover px-8 py-6 text-lg font-semibold w-full sm:w-auto group" 
                  data-testid="button-become-artisan"
                >
                  <Heart className="mr-2 h-6 w-6 group-hover:scale-125 smooth-transition" />
                  Become an Artisan
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-border/50 animate-slide-in-up" style={{ animationDelay: '0.9s' }}>
              <p className="text-sm text-muted-foreground mb-4">Trusted by artisans & collectors worldwide</p>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">2,847+</p>
                  <p className="text-xs text-muted-foreground">Active Artisans</p>
                </div>
                <div className="w-px h-8 bg-border/50"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">67</p>
                  <p className="text-xs text-muted-foreground">Countries</p>
                </div>
                <div className="w-px h-8 bg-border/50"></div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">$2.4M</p>
                  <p className="text-xs text-muted-foreground">Earned by Artisans</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Image Section */}
          <div className="relative animate-fade-in-scale" style={{ animationDelay: '0.35s' }}>
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur-3xl opacity-0 group-hover:opacity-20 smooth-transition duration-700"></div>
              
              {/* Main image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-3xl smooth-transition">
                <img 
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Artisan master hands crafting handmade pottery with precision and dedication" 
                  className="w-full h-full object-cover floating-animation group-hover:scale-110 smooth-transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 smooth-transition duration-500"></div>
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-20 h-20 border-2 border-white/30 rounded-lg opacity-0 group-hover:opacity-100 smooth-transition duration-500"></div>
                <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-white/30 rounded-lg opacity-0 group-hover:opacity-100 smooth-transition duration-500"></div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl shadow-2xl p-6 border border-border backdrop-blur-xl hover:shadow-3xl smooth-transition hover:scale-110 hover:-translate-y-2 animate-bounce-in max-w-xs" style={{ animationDelay: '0.6s' }}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-br from-accent to-secondary shadow-lg animate-pulse">
                      <Heart className="text-white text-2xl" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-foreground" data-testid="text-customer-count">10,000+</p>
                    <p className="text-sm text-muted-foreground mt-1">Happy customers from across the globe</p>
                    <div className="flex gap-1 mt-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">⭐</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </section>
  );
}

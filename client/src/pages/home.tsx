import HeroSection from "@/components/hero-section";
import FeaturedArtisans from "@/components/featured-artisans";
import ProductGrid from "@/components/product-grid";
import AiStoryGenerator from "@/components/ai-story-generator";
import CommunityStories from "@/components/community-stories";
import SmartRecommendations from "@/components/smart-recommendations";
import { Link } from "wouter";
import { Heart, Users, DollarSign, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const stats = [
    { icon: Users, value: "2,847", label: "Supported Artisans" },
    { icon: Award, value: "67", label: "Countries Represented" },
    { icon: DollarSign, value: "$2.4M", label: "Earned by Artisans" },
    { icon: Heart, value: "156", label: "Preserved Traditions" },
  ];

  return (
    <>
      {/* ==================== INTRO SECTION ==================== */}
      <HeroSection />

      {/* ==================== MEET ARTISANS SECTION ==================== */}
      <FeaturedArtisans />

      {/* ==================== DISCOVER PRODUCTS SECTION ==================== */}
      <ProductGrid />

      {/* ==================== AI STORYTELLING SECTION ==================== */}
      <AiStoryGenerator />

      {/* ==================== COMMUNITY STORIES SECTION ==================== */}
      <CommunityStories />

      {/* ==================== SMART RECOMMENDATIONS SECTION ==================== */}
      <SmartRecommendations />

      {/* ==================== IMPACT STATS SECTION ==================== */}
      <section className="py-24 story-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white animate-slide-in-left" style={{ animationDelay: '0s' }}>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-8 animate-slide-in-up">Crafting a Better World</h2>
              <p className="text-lg text-white/90 mb-12 leading-relaxed animate-slide-in-up transition-slow" style={{ animationDelay: '0.1s' }}>
                Every purchase supports traditional craftsmanship, empowers local communities, and preserves cultural heritage for future generations.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 smooth-transition hover:scale-110 card-hover animate-bounce-in border border-white/10 hover:border-white/30" 
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
                      <div className="text-3xl font-bold mb-2 animate-fade-in-scale transition-smooth" data-testid={`text-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
                        {stat.value}
                      </div>
                      <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <div className="group relative rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Diverse group of artisans collaborating on traditional crafts" 
                  className="rounded-2xl shadow-2xl w-full hover:shadow-3xl smooth-transition hover:scale-105 group-hover:translate-y-[-8px] relative"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/20 via-accent/15 to-secondary/20 p-16 text-center border border-primary/20 shadow-2xl hover:shadow-3xl smooth-transition card-hover group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <CardContent className="space-y-8 animate-slide-in-up relative z-10">
              <div>
                <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>Ready to Join Our Community?</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in transition-slow" style={{ animationDelay: '0.2s' }}>
                  Whether you're an artisan ready to share your craft or someone who appreciates authentic handmade beauty, there's a place for you here.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 animate-slide-in-up transition-slow" style={{ animationDelay: '0.3s' }}>
                <Link href="/artisan-signup">
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition shadow-lg hover:shadow-2xl hover:scale-110 button-hover px-8 py-6 text-lg" 
                    data-testid="button-become-artisan"
                  >
                    Become an Artisan
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button 
                    className="bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition shadow-lg hover:shadow-2xl hover:scale-110 px-8 py-6 text-lg button-hover" 
                    data-testid="button-shop-now"
                  >
                    Start Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

    </>
  );
}

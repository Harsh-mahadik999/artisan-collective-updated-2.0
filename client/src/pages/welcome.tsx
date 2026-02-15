import { useLocation } from "wouter";
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Heart,
  Users,
  Zap,
  Globe,
  Lock,
  BookOpen,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Welcome() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Palette,
      title: "Discover Unique Crafts",
      description: "Browse handmade artifacts from artisans around the world",
      color: "text-accent",
    },
    {
      icon: Users,
      title: "Connect with Artisans",
      description: "Build relationships with creative minds and support their craft",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Share Stories",
      description: "Read and contribute to our community's cultural heritage collection",
      color: "text-secondary",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Tools",
      description: "Generate product descriptions and marketing content with AI assistance",
      color: "text-destructive",
    },
    {
      icon: Heart,
      title: "Personalized Experience",
      description: "Save favorites and get recommendations tailored just for you",
      color: "text-rose-500",
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Join thousands supporting artisans and preserving traditions",
      color: "text-blue-500",
    },
  ];

  const benefits = [
    { text: "Browse community stories and artisan profiles", free: true },
    { text: "View all products and collect favorites", free: false },
    { text: "Connect directly with artisans", free: false },
    { text: "Generate AI descriptions & content", free: false },
    { text: "Save orders and manage purchases", free: false },
    { text: "Personalized product recommendations", free: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Hero Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
              Welcome to Artisan Alley ✨
            </Badge>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold mb-6 gradient-text">
              Discover the Art of Handcrafted Excellence
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Connect with artisans, explore unique handmade crafts, and become part of a global 
              community preserving traditions and supporting creative talents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="lg"
                variant="outline"
                className="border-border h-12 text-base"
              >
                Explore as Guest
              </Button>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative rounded-2xl overflow-hidden border border-border shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1513364776144-60967b0f800e?w=1000&h=600&fit=crop"
                alt="Artisans at work"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 bg-secondary/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">What You Can Do</h2>
            <p className="text-lg text-muted-foreground">
              Unlimited possibilities for both customers and artisans
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="border border-border hover:shadow-lg smooth-transition group"
                >
                  <CardContent className="p-6">
                    <Icon className={`h-12 w-12 ${feature.color} mb-4 group-hover:scale-110 smooth-transition`} />
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Free vs Premium */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Choose Your Path</h2>
              <p className="text-lg text-muted-foreground">
                Start exploring for free, then unlock the full potential
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Guest Access */}
              <Card className="border border-border relative">
                <div className="absolute -top-4 left-6 bg-secondary text-secondary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Guest Mode
                </div>
                <CardContent className="p-8 pt-12">
                  <h3 className="text-2xl font-bold mb-2">Limited Preview</h3>
                  <p className="text-muted-foreground mb-6">
                    Explore the platform and discover what's available
                  </p>
                  <ul className="space-y-3 mb-8">
                    {benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 ${
                          benefit.free ? "opacity-100" : "opacity-50"
                        }`}
                      >
                        {benefit.free ? (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                        <span className={benefit.free ? "" : "line-through text-muted-foreground"}>
                          {benefit.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="w-full border-border"
                  >
                    Explore Now
                  </Button>
                </CardContent>
              </Card>

              {/* Registered Users */}
              <Card className="border-2 border-primary bg-primary/5 relative">
                <div className="absolute -top-4 left-6 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Unlock Full Access
                </div>
                <CardContent className="p-8 pt-12">
                  <h3 className="text-2xl font-bold mb-2">Premium Features</h3>
                  <p className="text-muted-foreground mb-6">
                    Log in to access all features and save your progress
                  </p>
                  <ul className="space-y-3 mb-8">
                    {benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => navigate("/customer-login")}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Login as Customer
                    </Button>
                    <Button
                      onClick={() => navigate("/artisan-login")}
                      variant="outline"
                      className="w-full"
                    >
                      Login as Artisan
                    </Button>
                    <Button
                      onClick={() => navigate("/auth")}
                      variant="ghost"
                      className="w-full text-primary"
                    >
                      Create New Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-30"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Zap className="h-16 w-16 text-primary" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-4">
              Ready to Join Our Community?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you're a craft enthusiast or an artisan, there's a perfect place for you in our global community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base"
              >
                Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate("/customer-login")}
                size="lg"
                variant="outline"
                className="border-border h-12 text-base"
              >
                Already Have an Account?
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/5 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Artisan Alley © 2025 | Celebrating Craftsmanship Around the World
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

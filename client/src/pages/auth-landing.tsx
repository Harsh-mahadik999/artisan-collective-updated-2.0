import { useState } from "react";
import { Link } from "wouter";
import { Users, Hammer, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLanding() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-4">
              Join ArtisanAlley
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with global artisans, discover authentic crafts, or showcase your traditional skills to the world
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Artisan Section */}
            <Card className="border-2 border-primary/20 hover:border-primary/50 smooth-transition shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <Hammer className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Artisan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Showcase your handcrafted masterpieces to a global audience. Build your brand, connect with customers, and grow your craft business.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-sm">Create Your Artisan Profile</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-sm">List Your Products & Stories</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-sm">AI-Powered Product Descriptions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-sm">Direct Customer Connection</span>
                  </div>
                </div>

                <Link href="/artisan-signup">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition">
                    Join as Artisan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground text-center">
                  Already registered? <Link href="/artisan-login" className="text-primary hover:underline">Login here</Link>
                </p>
              </CardContent>
            </Card>

            {/* Customer Section */}
            <Card className="border-2 border-secondary/20 hover:border-secondary/50 smooth-transition shadow-xl">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Buyer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Discover authentic, handcrafted products from artisans worldwide. Support traditional crafts and own unique, meaningful pieces.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Browse Authentic Crafts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Connect with Artisans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Personalized Recommendations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="text-sm">Secure Shopping Experience</span>
                  </div>
                </div>

                <Link href="/customer-signup">
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 smooth-transition">
                    Browse as Buyer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <p className="text-sm text-muted-foreground text-center">
                  Already have an account? <Link href="/customer-login" className="text-secondary hover:underline">Login here</Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

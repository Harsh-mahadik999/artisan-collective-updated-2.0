import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedArtisans() {
  const { data: artisans, isLoading } = useQuery({
    queryKey: ["/api/artisans/featured"],
    queryFn: api.getFeaturedArtisans,
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-in-down">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Talented Creators</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6 animate-slide-in-up">Meet Our Artisans</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-in-up transition-slow" style={{ animationDelay: '0.1s' }}>
            Discover the passionate creators behind each masterpiece, their unique stories, and time-honored techniques passed down through generations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {artisans?.map((artisan: any, index: number) => (
            <Card 
              key={artisan.id} 
              className="artisan-card overflow-hidden border border-border shadow-md hover:shadow-2xl animate-fade-in-scale"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`card-artisan-${artisan.id}`}
            >
              <img 
                src={artisan.profileImage} 
                alt={`${artisan.name} - ${artisan.specialty} artisan`} 
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-serif font-semibold" data-testid={`text-artisan-name-${artisan.id}`}>
                    {artisan.name}
                  </h3>
                  <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded-full">
                    <MapPin className="text-primary text-sm h-3 w-3" />
                    <span className="text-xs text-muted-foreground font-medium" data-testid={`text-artisan-location-${artisan.id}`}>
                      {artisan.location}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed" data-testid={`text-artisan-story-${artisan.id}`}>
                  {artisan.story}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full" data-testid={`text-artisan-specialty-${artisan.id}`}>
                      {artisan.specialty}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium" data-testid={`text-artisan-experience-${artisan.id}`}>
                      {artisan.experience}
                    </span>
                  </div>
                  <Link href={`/artisans/${artisan.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary/80 hover:bg-primary/10 smooth-transition" 
                      data-testid={`button-view-profile-${artisan.id}`}
                    >
                      View Profile <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 smooth-transition" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-in-up">
          <Link href="/marketplace">
            <Button 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 smooth-transition shadow-md hover:shadow-lg hover:scale-105" 
              data-testid="button-view-all-artisans"
            >
              Meet All Artisans
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

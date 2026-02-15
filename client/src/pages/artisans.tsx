import { useQuery } from "@tanstack/react-query";
import { MapPin, ArrowRight, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArtisansPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: artisans, isLoading } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: api.getArtisans,
    retry: 3,
  });

  const filteredArtisans = artisans?.filter((artisan: any) =>
    artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artisan.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <Skeleton className="h-10 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-24 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 animate-slide-in-down">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Meet Our Artisans
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover talented craftspeople from around the world. Each artisan brings unique skills, heritage, and passion to their craft.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search by name, specialty, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-border focus:border-primary focus:ring-primary smooth-transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artisans Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {filteredArtisans.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No artisans found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12 animate-slide-in-down">
              <p className="text-lg text-muted-foreground">
                Showing <span className="text-primary font-semibold">{filteredArtisans.length}</span> artisan{filteredArtisans.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtisans.map((artisan: any, index: number) => (
                <Card
                  key={artisan.id}
                  className="artisan-card overflow-hidden border border-border shadow-md hover:shadow-2xl animate-fade-in-scale"
                  style={{ animationDelay: `${(index % 6) * 0.08}s` }}
                >
                  <img
                    src={artisan.profileImage}
                    alt={`${artisan.name} - ${artisan.specialty} artisan`}
                    className="w-full h-56 object-cover"
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-serif font-semibold text-foreground">
                        {artisan.name}
                      </h3>
                      {artisan.verified && (
                        <div className="bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-semibold">
                          ✓ Verified
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded-full mb-3 w-fit">
                      <MapPin className="text-primary text-sm h-3 w-3" />
                      <span className="text-xs text-muted-foreground font-medium">
                        {artisan.location}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                      {artisan.story}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-border mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                            {artisan.specialty}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium">
                          {artisan.experience}
                        </p>
                      </div>
                    </div>

                    <Link href={`/artisans/${artisan.id}`}>
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition shadow-md hover:shadow-lg"
                      >
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

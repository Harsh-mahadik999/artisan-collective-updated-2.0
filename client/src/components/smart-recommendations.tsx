import { useQuery } from "@tanstack/react-query";
import { Star, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function SmartRecommendations() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/featured"],
    queryFn: api.getFeaturedProducts,
  });

  // Mock recommendation profile data
  const profile = {
    mediterraneanStyle: 85,
    ecoFriendlyFocus: 92,
    traditionalTechniques: 78,
  };

  // Mock recommended products (would be actual recommendations in real app)
  const recommendedProducts = products?.slice(0, 4) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-down">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-4">Crafted Just for You</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI learns your preferences and cultural interests to recommend crafts that resonate with your style and values.
          </p>
        </div>

        <Card className="shadow-xl border border-border p-8 mb-12 hover:shadow-2xl smooth-transition animate-fade-in-scale">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-in-left">
              <h3 className="text-2xl font-serif font-semibold mb-4 text-foreground">Personalized for You</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Based on your interest in <span className="text-primary font-medium">Mediterranean ceramics</span> and{" "}
                <span className="text-accent font-medium">sustainable crafts</span>, we've curated these special recommendations:
              </p>
              
              <div className="space-y-3">
                {[
                  { match: "95%", title: "Greek Olive Wood Bowls" },
                  { match: "92%", title: "Moroccan Ceramic Tagines" },
                  { match: "89%", title: "Italian Terra Cotta Planters" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg hover:bg-muted/80 smooth-transition hover:scale-105 animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <TrendingUp className="text-primary h-5 w-5 flex-shrink-0" />
                    <span className="font-semibold text-primary">{item.match} match</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-6 border border-primary/20 hover:border-primary/50 smooth-transition animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-lg font-semibold mb-4 text-center text-foreground">Preference Profile</h4>
              <div className="space-y-5">
                {[
                  { label: "Mediterranean Style", value: profile.mediterraneanStyle, testid: "text-mediterranean-percentage" },
                  { label: "Eco-Friendly Focus", value: profile.ecoFriendlyFocus, testid: "text-eco-friendly-percentage" },
                  { label: "Traditional Techniques", value: profile.traditionalTechniques, testid: "text-traditional-percentage" }
                ].map((item, index) => (
                  <div key={index} className="animate-slide-in-up" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span className="text-primary font-semibold" data-testid={item.testid}>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="w-full h-2 rounded-full" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product: any, index: number) => (
            <Card 
              key={product.id} 
              className="overflow-hidden border border-border group shadow-md hover:shadow-2xl smooth-transition animate-fade-in-scale"
              style={{ animationDelay: `${(index % 4) * 0.1}s` }}
              data-testid={`card-recommendation-${product.id}`}
            >
              <div className="relative bg-muted overflow-hidden h-32">
                <img 
                  src={product.images?.[0] || "/placeholder-product.jpg"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 smooth-transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
              </div>
              <CardContent className="p-5">
                <h4 className="font-semibold text-sm mb-2 line-clamp-1 group-hover:text-primary smooth-transition" data-testid={`text-recommendation-name-${product.id}`}>
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-3 font-medium">by Artisan</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-primary font-bold text-lg" data-testid={`text-recommendation-price-${product.id}`}>
                    ${product.price}
                  </span>
                  <div className="flex items-center space-x-1 text-xs bg-yellow-50 px-2 py-1 rounded-full">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-yellow-700" data-testid={`text-recommendation-rating-${product.id}`}>
                      {product.rating || "4.8"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

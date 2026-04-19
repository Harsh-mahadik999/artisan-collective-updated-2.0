import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Lightbulb, ShieldCheck, Sparkles, ArrowLeft, Star, MessageSquare } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { getCategoryFallbackImage, getProductImage } from "@/lib/product-image-utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Review } from "@shared/schema";

const categoryInsight: Record<string, { helpful: string; good: string; innovation: string }> = {
  ceramics: {
    helpful:
      "Ceramic pieces distribute heat gently and are practical for daily use while still preserving a handcrafted character.",
    good:
      "Durable firing, food-safe finishes, and hand-checking make these products reliable over long-term use.",
    innovation:
      "The maker combines traditional forming methods with modern finishing consistency, so each piece feels unique yet dependable.",
  },
  textiles: {
    helpful:
      "Handwoven textiles offer breathable comfort, better repairability, and stronger emotional value than mass alternatives.",
    good:
      "Natural fibers and reinforced edges improve longevity, making each purchase a practical long-term choice.",
    innovation:
      "The artisan blends heritage patterns with updated construction techniques for modern homes and routines.",
  },
  jewelry: {
    helpful:
      "Handmade jewelry carries personal craftsmanship and often uses smaller-batch, more transparent sourcing.",
    good:
      "Manual finishing improves wear comfort and detail quality, which helps pieces stay wearable for years.",
    innovation:
      "Designs mix classic hand-tool methods with contemporary silhouettes, balancing tradition and modern taste.",
  },
  woodwork: {
    helpful:
      "Woodwork products provide tactile comfort, repairability, and structural longevity for everyday tasks.",
    good:
      "Proper joinery and protective finishing reduce wear, giving better life-cycle value than disposable alternatives.",
    innovation:
      "Traditional joinery is adapted for modern dimensions, improving utility without losing craft identity.",
  },
  glasswork: {
    helpful:
      "Hand-finished glass elevates function and visual appeal while keeping each object distinct.",
    good:
      "Controlled shaping and annealing produce stronger, safer pieces suitable for regular use.",
    innovation:
      "Color layering and form control create premium objects that still remain practical and user-focused.",
  },
};

function buildMarketSeries(price: number, seed: string) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const seedValue = Array.from(seed).reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  let value = Math.max(price * 7.5, 120);

  return months.map((month, index) => {
    const wave = Math.sin((index + seedValue % 5) * 0.9) * 0.075;
    const cycle = index % 3 === 0 ? -0.045 : 0.055;
    const movement = wave + cycle;
    value = Math.max(80, value * (1 + movement));

    const benchmark = value * (0.93 + Math.cos(index * 0.6) * 0.03);
    return {
      month,
      value: Number(value.toFixed(2)),
      benchmark: Number(benchmark.toFixed(2)),
    };
  });
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery({
    queryKey: ["/api/products", id],
    queryFn: () => api.getProduct(id!),
    enabled: !!id,
  });

  const { data: artisan } = useQuery({
    queryKey: ["/api/artisans", product?.artisanId],
    queryFn: () => api.getArtisan(product.artisanId),
    enabled: !!product?.artisanId,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["/api/products", product?.category, "related"],
    queryFn: () => api.getProducts(product.category),
    enabled: !!product?.category,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", id],
    queryFn: () => api.getProductReviews(id!),
    enabled: !!id,
    refetchInterval: 5000, // Real-time sync for reviews
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newReview, setNewReview] = useState({
    rating: 5,
    userName: "",
    comment: "",
  });

  const reviewMutation = useMutation({
    mutationFn: (data: any) => api.createReview(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", id] });
      setNewReview({ rating: 5, userName: "", comment: "" });
      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback.",
      });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please check your input and try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment) {
      toast({
        title: "Missing fields",
        description: "Please provide both a name and a comment.",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate(newReview);
  };

  const price = Number(product?.price || 0);

  const marketData = useMemo(() => {
    if (!product) return [];
    return buildMarketSeries(price, product.id);
  }, [price, product]);

  const trendSummary = useMemo(() => {
    if (marketData.length < 2) return { up: 0, down: 0, latest: 0, direction: "flat" as "up" | "down" | "flat" };
    const first = marketData[0].value;
    const latest = marketData[marketData.length - 1].value;
    const up = ((latest - first) / first) * 100;
    const downside = Math.min(...marketData.map((d) => d.value));
    const down = ((first - downside) / first) * 100;

    return {
      up: Number(up.toFixed(1)),
      down: Number(down.toFixed(1)),
      latest: Number(latest.toFixed(2)),
      direction: latest >= first ? "up" : "down",
    };
  }, [marketData]);

  const insight = categoryInsight[product?.category || ""] || {
    helpful: "This product brings craft quality and long-term use value to real daily life.",
    good: "Materials, skill, and finishing quality make it a dependable handcrafted purchase.",
    innovation: "The artisan combines heritage process with practical modern design decisions.",
  };

  const related = (relatedProducts || []).filter((p: any) => p.id !== product?.id).slice(0, 3);

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <Skeleton className="h-10 w-48 mb-6" />
          <Skeleton className="h-96 w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">This product might have been removed or the link is invalid.</p>
          <Link href="/marketplace">
            <Button>Back to Discover</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6 hover:text-primary" data-testid="button-back-discover">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Discover
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="rounded-2xl overflow-hidden border border-border shadow-xl">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-[360px] sm:h-[460px] object-cover"
              onError={(e) => {
                const img = e.currentTarget;
                img.onerror = null;
                img.src = getCategoryFallbackImage(product.category, product.id || product.name, 2);
              }}
            />
          </div>

          <div className="space-y-5">
            <Badge className="bg-primary/10 text-primary">{product.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold leading-tight" data-testid="text-product-detail-name">
              {product.name}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-product-detail-description">
              {product.description}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Crafted by</p>
                  <p className="text-lg font-semibold">{artisan?.name || "Artisan"}</p>
                  <p className="text-sm text-muted-foreground">{artisan?.location || "Global Collective"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Current Price</p>
                  <p className="text-2xl font-bold text-primary">${product.price}</p>
                  <p className="text-sm text-muted-foreground">Rating {product.rating || "4.7"}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <p className="text-sm leading-7 text-foreground/90">
                  {artisan?.name || "This artisan"} created this product to balance heritage craftsmanship with modern usability. It is helpful for daily life, aesthetically strong, and built with practical design thinking so buyers get both function and story.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                Why It Is Helpful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">{insight.helpful}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-secondary" />
                Why It Is Good
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">{insight.good}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-accent" />
                What Is Innovative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-7">{insight.innovation}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-10">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Market Value Trend</CardTitle>
            <div className="flex items-center gap-3 text-sm">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                Upside {trendSummary.up > 0 ? `+${trendSummary.up}%` : `${trendSummary.up}%`}
              </span>
              <span className="inline-flex items-center text-rose-600">
                <TrendingDown className="h-4 w-4 mr-1" />
                Downside -{trendSummary.down}%
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Product Value", color: "hsl(var(--primary))" },
                benchmark: { label: "Category Benchmark", color: "hsl(var(--secondary))" },
              }}
              className="h-[280px] w-full"
            >
              <AreaChart data={marketData} margin={{ left: 8, right: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  stroke="var(--color-benchmark)"
                  fill="var(--color-benchmark)"
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-value)"
                  fill="var(--color-value)"
                  fillOpacity={0.26}
                  strokeWidth={2.4}
                />
              </AreaChart>
            </ChartContainer>
            <p className="text-sm text-muted-foreground mt-4 leading-6">
              This chart reflects a simulated market outlook using craftsmanship quality signals, category demand rhythm, and pricing strength. It intentionally includes both upward and downward movement so you can evaluate realistic potential.
            </p>
          </CardContent>
        </Card>

        <section className="mt-12 pt-12 border-t border-border">
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold mb-2">Community Reviews</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.round(Number(product.rating)) ? "fill-current" : ""}`} />
                ))}
              </div>
              <span className="text-xl font-bold">{product.rating} / 5</span>
              <span className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6 flex justify-center lg:justify-start">
              <Card className="bg-white border-2 border-primary/5 shadow-lg w-full max-w-md">
                <CardHeader>
                  <CardTitle className="text-lg">Share Your Experience</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none hover:scale-110 transition-transform p-1 bg-muted/20 rounded-lg hover:bg-muted/40 smooth-transition"
                          >
                            <Star
                              className={`h-7 w-7 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Input
                        placeholder="Your Name (e.g. Alex M.)"
                        value={newReview.userName}
                        onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                        className="h-12 bg-background border-border hover:border-primary smooth-transition shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Textarea
                        placeholder="What do you love about this piece?"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="bg-background min-h-[120px] border-border hover:border-primary smooth-transition shadow-sm"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-bold shadow-xl hover:shadow-primary/20 smooth-transition hover:scale-[1.02]" 
                      disabled={reviewMutation.isPending}
                    >
                      {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-2xl" />
                  ))}
                </div>
              ) : reviews?.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-muted/10 rounded-3xl border-2 border-dashed border-muted-foreground/10 text-center animate-fade-in group">
                  <div className="p-4 bg-muted/20 rounded-full mb-4 group-hover:scale-110 smooth-transition">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">No reviews yet</h3>
                  <p className="text-muted-foreground max-w-xs mt-2 leading-relaxed">
                    Be the first to share your experience with this unique artisan piece!
                  </p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {reviews?.map((review) => (
                    <div key={review.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-border/60 hover:shadow-xl hover:border-primary/20 smooth-transition animate-slide-in-up">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex gap-0.5 text-yellow-500 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : ""}`} />
                            ))}
                          </div>
                          <p className="font-bold text-foreground text-lg">{review.userName}</p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                          {review.createdAt ? format(new Date(review.createdAt), "MMM d, yyyy") : ""}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic border-l-4 border-primary/10 pl-4 py-1">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-serif font-bold mb-4">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((item: any) => (
                <Link key={item.id} href={`/products/${item.id}`}>
                  <Card className="cursor-pointer hover:shadow-xl smooth-transition hover:-translate-y-1">
                    <CardContent className="p-4">
                      <img
                        src={getProductImage(item, 1)}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                        onError={(e) => {
                          const img = e.currentTarget;
                          img.onerror = null;
                          img.src = getCategoryFallbackImage(item.category, item.id || item.name, 3);
                        }}
                      />
                      <p className="font-semibold line-clamp-1">{item.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                      <p className="text-primary font-bold mt-3">${item.price}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

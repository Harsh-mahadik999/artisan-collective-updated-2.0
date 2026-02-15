import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, Heart, ShoppingCart as ShoppingCartIcon, Award, Calendar, Users } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function ArtisanProfile() {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: artisan, isLoading: artisanLoading } = useQuery({
    queryKey: ["/api/artisans", id],
    queryFn: () => api.getArtisan(id!),
    enabled: !!id,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/artisans", id, "products"],
    queryFn: () => api.getArtisanProducts(id!),
    enabled: !!id,
  });

  const { data: stories } = useQuery({
    queryKey: ["/api/stories"],
    queryFn: api.getStories,
  });

  const toggleWishlist = (productId: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
      toast({ title: "Removed from wishlist" });
    } else {
      newWishlist.add(productId);
      toast({ title: "Added to wishlist" });
    }
    setWishlist(newWishlist);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(productId);
    toast({ title: `${productName} added to cart` });
  };

  // Filter stories by this artisan
  const artisanStories = stories?.filter((story: any) => story.authorId === id) || [];

  if (artisanLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="w-full h-64 mb-4" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-48 mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-bold mb-2">Artisan Not Found</h1>
        <p className="text-muted-foreground">The artisan you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <>
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={artisan.profileImage} 
                alt={`${artisan.name} - ${artisan.specialty} artisan`} 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto lg:mx-0"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="text-primary h-5 w-5" />
                <span className="text-muted-foreground" data-testid="text-artisan-location">
                  {artisan.location}
                </span>
                {artisan.verified && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4" data-testid="text-artisan-name">
                {artisan.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <Badge className="bg-accent text-accent-foreground">
                  {artisan.specialty}
                </Badge>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span data-testid="text-artisan-experience">{artisan.experience}</span>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed" data-testid="text-artisan-story">
                {artisan.story}
              </p>
              
              <div className="flex space-x-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-contact-artisan">
                  Contact {artisan.name}
                </Button>
                <Button variant="outline" data-testid="button-follow-artisan">
                  <Users className="mr-2 h-4 w-4" />
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
            <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
            <TabsTrigger value="story" data-testid="tab-story">Story</TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-serif font-bold mb-2">Handcrafted Collection</h2>
              <p className="text-muted-foreground">
                Discover {artisan.name}'s unique creations, each piece telling its own story.
              </p>
            </div>
            
            {productsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="w-full h-48" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-4" />
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : products?.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-xl font-semibold mb-2">No products available</h3>
                <p className="text-muted-foreground">This artisan hasn't listed any products yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product: any) => (
                  <Card key={product.id} className="overflow-hidden border border-border group hover:shadow-lg smooth-transition" data-testid={`card-product-${product.id}`}>
                    <div className="relative">
                      <img 
                        src={product.images?.[0] || "/placeholder-product.jpg"} 
                        alt={product.name} 
                        className="w-full h-48 object-cover group-hover:scale-105 smooth-transition"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        data-testid={`button-wishlist-${product.id}`}
                      >
                        <Heart 
                          className={`h-4 w-4 ${wishlist.has(product.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                        />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-1" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground mb-4 text-sm line-clamp-2" data-testid={`text-product-description-${product.id}`}>
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                            ${product.price}
                          </span>
                          {product.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-muted-foreground" data-testid={`text-product-rating-${product.id}`}>
                                {product.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => handleAddToCart(product.id, product.name)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition"
                          data-testid={`button-add-to-cart-${product.id}`}
                        >
                          <ShoppingCartIcon className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="story" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-serif">The Journey of {artisan.name}</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-lg max-w-none">
                  <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                    {artisan.story}
                  </p>
                  
                  <h3 className="text-xl font-serif font-semibold mb-4">Craft Specialty</h3>
                  <p className="text-muted-foreground mb-6">
                    {artisan.name} specializes in {artisan.specialty.toLowerCase()}, bringing {artisan.experience} of 
                    dedication to preserving traditional techniques while creating contemporary pieces that speak to modern sensibilities.
                  </p>
                  
                  <h3 className="text-xl font-serif font-semibold mb-4">Philosophy & Approach</h3>
                  <p className="text-muted-foreground mb-6">
                    Every piece created by {artisan.name} is a testament to the belief that handmade objects carry the soul 
                    of their creator. Working from {artisan.location}, each creation reflects not just individual artistry 
                    but also the rich cultural heritage of the region.
                  </p>
                  
                  {artisanStories.length > 0 && (
                    <>
                      <h3 className="text-xl font-serif font-semibold mb-4">Featured Stories</h3>
                      <div className="space-y-4">
                        {artisanStories.slice(0, 2).map((story: any) => (
                          <Card key={story.id} className="p-4">
                            <h4 className="font-semibold mb-2">{story.title}</h4>
                            <p className="text-sm text-muted-foreground">{story.excerpt}</p>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      Be the first to leave a review for {artisan.name}'s work.
                    </p>
                    <Button className="mt-4" data-testid="button-write-review">
                      Write a Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </>
  );
}

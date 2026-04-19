import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";

const categories = [
  { id: "all", label: "All" },
  { id: "ceramics", label: "Ceramics" },
  { id: "textiles", label: "Textiles" },
  { id: "jewelry", label: "Jewelry" },
  { id: "woodwork", label: "Woodwork" },
];

export default function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products/featured"],
    queryFn: api.getFeaturedProducts,
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: api.getArtisans,
  });

  const filteredProducts = products?.filter((product: any) => 
    selectedCategory === "all" || product.category === selectedCategory
  ) || [];

  const getArtisanName = (artisanId: string) => {
    return artisans?.find((a: any) => a.id === artisanId)?.name || "Unknown Artisan";
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto mb-8" />
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20" />
              ))}
            </div>
          </div>
          <div className="product-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-3" />
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 animate-slide-in-down">
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Explore Our Collection</span>
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6 animate-slide-in-up">Handcrafted Treasures</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-slide-in-up transition-slow" style={{ animationDelay: '0.1s' }}>
            Each piece is unique, carrying the soul and skill of its creator. Browse our curated collection of authentic handmade crafts from artisans around the world.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`smooth-transition button-hover cursor-pointer ${selectedCategory === category.id 
                  ? "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110" 
                  : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary hover:scale-105"
                } animate-fade-in-scale px-6 py-2 font-medium`}
                style={{ animationDelay: `${index * 0.08}s` }}
                data-testid={`button-filter-${category.id}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product: any, index: number) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index} 
              artisanName={getArtisanName(product.artisanId)} 
            />
          ))}
        </div>

        <div className="text-center mt-12 animate-slide-in-up">
          <Button 
            className="bg-accent text-accent-foreground hover:bg-accent/90 smooth-transition shadow-lg hover:shadow-xl hover:scale-105" 
            data-testid="button-shop-all"
          >
            Shop All Products
          </Button>
        </div>
      </div>
    </section>
  );
}

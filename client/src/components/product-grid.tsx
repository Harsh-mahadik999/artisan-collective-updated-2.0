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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-100">
            Discover a curated selection of unique artisan crafts, each with its own story of tradition and innovation.
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in delay-200">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-8 py-6 h-auto smooth-transition shadow-sm hover:shadow-md hover:scale-105 active:scale-95 ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground shadow-primary/20' 
                    : 'text-foreground hover:border-primary hover:text-primary bg-white/50 backdrop-blur-sm'
                }`}
                data-testid={`button-category-${category.id}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="product-grid">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product: any, index: number) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  artisanName={getArtisanName(product.artisanId)} 
                />
              ))}
            </div>
        </div>

        <div className="text-center mt-12 animate-slide-in-up">
          <p className="text-muted-foreground mb-6">Want to see more unique handcrafted items?</p>
          <Button variant="outline" className="rounded-full px-8 hover:bg-primary hover:text-primary-foreground smooth-transition shadow-sm hover:shadow-lg">
            View Marketplace
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, Filter, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";

const categories = [
  "Ceramics",
  "Textiles",
  "Jewelry",
  "Woodwork",
  "Paper Goods",
  "Glass Art"
];

export default function Marketplace() {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    priceRange: "all",
    artisan: "",
    sortBy: "newest",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => api.getProducts(),
    refetchInterval: 5000, // Poll every 5s for real-time likes
    retry: 3,
  });

  const { data: artisans } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: api.getArtisans,
  });

  const getArtisanName = (artisanId: string) => {
    return artisans?.find((a: any) => a.id === artisanId)?.name || "Unknown Artisan";
  };

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = filters.category === "all" || product.category === filters.category;
    
    let matchesPrice = true;
    const price = parseFloat(product.price);
    if (filters.priceRange === "under-50") matchesPrice = price < 50;
    else if (filters.priceRange === "50-100") matchesPrice = price >= 50 && price <= 100;
    else if (filters.priceRange === "100-250") matchesPrice = price > 100 && price <= 250;
    else if (filters.priceRange === "250-500") matchesPrice = price > 250 && price <= 500;
    else if (filters.priceRange === "over-500") matchesPrice = price > 500;

    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a: any, b: any) => {
    if (filters.sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
    if (filters.sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
    if (filters.sortBy === "popularity") return (b.likes || 0) - (a.likes || 0);
    if (filters.sortBy === "rating") return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <Skeleton className="h-12 w-full md:w-96" />
          <Skeleton className="h-12 w-full md:w-48" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search and Filters Header */}
      <section className="bg-muted/30 border-b border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-10 animate-slide-in-down">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">Artisan Marketplace</h1>
            <p className="text-lg text-muted-foreground">Discover unique handmade treasures from master craftspeople around the world.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto animate-fade-in delay-100">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5 group-hover:text-primary smooth-transition" />
              <Input 
                placeholder="Search for products or master artisans..." 
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-border hover:border-primary smooth-transition shadow-sm"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                data-testid="input-search"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12 w-full md:w-[180px] bg-white/80 backdrop-blur-sm border-border hover:border-primary smooth-transition shadow-sm group font-medium">
                    <SlidersHorizontal className="mr-2 h-4 w-4 group-hover:scale-110 smooth-transition" />
                    Filters
                    {Object.values(filters).filter(v => v !== "all" && v !== "" && v !== "newest").length > 0 && (
                      <Badge className="ml-2 bg-primary text-primary-foreground">{Object.values(filters).filter(v => v !== "all" && v !== "" && v !== "newest").length}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="animate-slide-in-right">
                  <SheetHeader>
                    <SheetTitle>Marketplace Filters</SheetTitle>
                  </SheetHeader>
                  <div className="py-8 space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                      <Select value={filters.category} onValueChange={(val) => setFilters({ ...filters, category: val })}>
                        <SelectTrigger className="hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Price Range</label>
                      <Select value={filters.priceRange} onValueChange={(val) => setFilters({ ...filters, priceRange: val })}>
                        <SelectTrigger className="hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any Price</SelectItem>
                          <SelectItem value="under-50">Under $50</SelectItem>
                          <SelectItem value="50-100">$50 - $100</SelectItem>
                          <SelectItem value="100-250">$100 - $250</SelectItem>
                          <SelectItem value="250-500">$250 - $500</SelectItem>
                          <SelectItem value="over-500">Over $500</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sort By</label>
                      <Select value={filters.sortBy} onValueChange={(val) => setFilters({ ...filters, sortBy: val })}>
                        <SelectTrigger className="hover:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="animate-in fade-in slide-in-from-top-1">
                          <SelectItem value="newest">None (Default)</SelectItem>
                          <SelectItem value="popularity">Most Popular</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="rating">Top Rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 mt-8 shadow-md"
                      onClick={() => {
                        setFilters({
                          search: "",
                          category: "all",
                          priceRange: "all",
                          artisan: "",
                          sortBy: "newest",
                        });
                        setIsFilterOpen(false);
                      }}
                      data-testid="button-reset-filters"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </section>

      {/* Product List */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Featured Creations</h2>
            <p className="text-muted-foreground">Showing {filteredProducts.length} unique treasures</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button variant="ghost" size="sm" className="bg-accent/10 text-primary">Grid</Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">List</Button>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-border animate-fade-in">
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold mb-3">No treasures found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}

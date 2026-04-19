import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { useCart } from "@/context/cart-context";
import { FilterState } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ProductCard } from "@/components/product-card";

const categories = [
  { id: "all", label: "All Categories" },
  { id: "ceramics", label: "Ceramics & Pottery" },
  { id: "textiles", label: "Textiles & Weaving" },
  { id: "jewelry", label: "Jewelry" },
  { id: "woodwork", label: "Woodworking" },
  { id: "glasswork", label: "Glasswork" },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    priceRange: [0, 500],
    artisan: "",
    sortBy: "newest",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["/api/products"],
    queryFn: () => api.getProducts(),
    retry: 3,
  });

  const { data: artisans, isLoading: artisansLoading, error: artisansError } = useQuery({
    queryKey: ["/api/artisans"],
    queryFn: () => api.getArtisans(),
    retry: 3,
  });

  const getArtisanName = (artisanId: string) => {
    return artisans?.find((a: any) => a.id === artisanId)?.name || "Unknown Artisan";
  };

  // Filter and sort products
  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === "all" || product.category === filters.category;
    const matchesPrice = parseFloat(product.price) >= filters.priceRange[0] && 
                        parseFloat(product.price) <= filters.priceRange[1];
    const matchesArtisan = !filters.artisan || product.artisanId === filters.artisan;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesArtisan;
  })?.sort((a: any, b: any) => {
    switch (filters.sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  }) || [];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
        <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
            max={500}
            min={0}
            step={10}
            className="mb-2"
            data-testid="slider-price-range"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Artisan</label>
        <Select value={filters.artisan || "all-artisans"} onValueChange={(value) => setFilters(prev => ({ ...prev, artisan: value === "all-artisans" ? "" : value }))}>
          <SelectTrigger data-testid="select-artisan-filter">
            <SelectValue placeholder="All Artisans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-artisans">All Artisans</SelectItem>
            {artisans?.map((artisan: any) => (
              <SelectItem key={artisan.id} value={artisan.id}>
                {artisan.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
        <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as any }))}>
          <SelectTrigger data-testid="select-sort-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <>
      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 animate-slide-in-down">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Discover Authentic Crafts
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our curated collection of handmade treasures from artisans around the world. Each piece tells a unique story.
            </p>
          </div>

          <div className="max-w-2xl mx-auto animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search for products, artisans, or materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-border focus:border-primary focus:ring-primary smooth-transition"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Filter className="mr-2 h-5 w-5" />
                  Filters
                </h3>
                <FilterContent />
              </CardContent>
            </Card>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold" data-testid="text-results-count">
                  {filteredProducts.length} Products Found
                </h2>
                
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden" data-testid="button-mobile-filters">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {productsError ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold mb-2">Unable to load products</h3>
                <p className="text-muted-foreground mb-4">There was an error loading the products. Please try refreshing the page.</p>
                <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
                  Refresh Page
                </Button>
              </div>
            ) : productsLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
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
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </>
  );
}

import { Heart, Star, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/App";
import { getCategoryFallbackImage, getProductImage } from "@/lib/product-image-utils";
import { Product } from "@shared/schema";
import { useState, useEffect } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
  artisanName?: string;
}

export function ProductCard({ product, index = 0, artisanName }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Load liked state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("likedProducts");
    if (saved) {
      try {
        const likedSet = new Set(JSON.parse(saved));
        if (likedSet.has(product.id)) {
          setIsLiked(true);
        }
      } catch (e) {
        console.error("Failed to parse likedProducts from localStorage", e);
      }
    }
  }, [product.id]);

  const likeMutation = useMutation({
    mutationFn: () => api.likeProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      
      const saved = localStorage.getItem("likedProducts");
      try {
        const likedSet = new Set<string>(saved ? JSON.parse(saved) : []);
        likedSet.add(product.id);
        localStorage.setItem("likedProducts", JSON.stringify(Array.from(likedSet)));
        setIsLiked(true);
      } catch (e) {
        console.error("Failed to update likedProducts in localStorage", e);
        // We set local state anyway to ensure UI responsiveness even if persistence fails
        setIsLiked(true);
      }
      toast({ title: "Product liked!" });
    },
    onError: () => {
      toast({
        title: "Could not Like product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const unlikeMutation = useMutation({
    mutationFn: () => api.unlikeProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/featured"] });
      
      const saved = localStorage.getItem("likedProducts");
      try {
        const likedSet = new Set<string>(saved ? JSON.parse(saved) : []);
        likedSet.delete(product.id);
        localStorage.setItem("likedProducts", JSON.stringify(Array.from(likedSet)));
        setIsLiked(false);
      } catch (e) {
        console.error("Failed to update likedProducts in localStorage", e);
        // We set local state anyway
        setIsLiked(false);
      }
      toast({ title: "Like removed" });
    },
    onError: () => {
      toast({
        title: "Could not unlike product",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  });

  const handleToggleLike = () => {
    if (isLiked) {
      unlikeMutation.mutate();
    } else {
      likeMutation.mutate();
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
      toast({ title: `${product.name} added to cart` });
    } catch {
      toast({
        title: "Could not add to cart",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card 
      className="overflow-hidden border border-border group shadow-md hover:shadow-2xl smooth-transition animate-fade-in-scale"
      style={{ animationDelay: `${(index % 6) * 0.08}s` }}
      data-testid={`card-product-${product.id}`}
    >
      <div className="relative bg-muted overflow-hidden">
        <img 
          src={getProductImage({ ...product, images: product.images || undefined })} 
          alt={product.name} 
          className="w-full h-48 object-cover group-hover:scale-110 smooth-transition duration-500"
          onError={(e) => {
            const img = e.currentTarget;
            img.onerror = null;
            img.src = getCategoryFallbackImage(product.category, product.id || product.name, 1);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition"></div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleLike}
          className={`absolute top-3 right-3 bg-white/90 hover:bg-white shadow-md hover:shadow-lg smooth-transition hover:scale-110 flex items-center gap-1.5 px-3 py-1.5 rounded-full h-auto cursor-pointer`}
          data-testid={`button-like-${product.id}`}
          disabled={likeMutation.isPending || unlikeMutation.isPending}
        >
          <Heart 
            className={`h-4 w-4 smooth-transition ${isLiked ? 'fill-primary text-primary animate-pulse' : 'text-muted-foreground'}`} 
          />
          <span className="text-xs font-bold text-foreground">{product.likes || 0}</span>
        </Button>
      </div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground line-clamp-1" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-3" data-testid={`text-product-artisan-${product.id}`}>
          by {artisanName || "Artisan"}
        </p>
        <p className="text-muted-foreground mb-4 text-sm line-clamp-2 leading-relaxed" data-testid={`text-product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
              ${product.price}
            </span>
            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium text-yellow-700" data-testid={`text-product-rating-${product.id}`}>
                {product.rating}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/products/${product.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="hover:border-primary hover:text-primary"
                data-testid={`button-view-product-${product.id}`}
              >
                View
              </Button>
            </Link>
            <Button 
              size="sm"
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg smooth-transition hover:scale-105"
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

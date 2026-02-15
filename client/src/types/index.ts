export interface CartContextType {
  items: CartItemWithProduct[];
  addToCart: (productId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: string;
    images: string[];
    artisanName: string;
  };
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  artisan: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating';
}

export interface RecommendationProfile {
  preferences: {
    mediterraneanStyle: number;
    ecoFriendlyFocus: number;
    traditionalTechniques: number;
  };
  interests: string[];
  location?: string;
}

import { Switch, Route } from "wouter";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, useContext, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/context/auth-context";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import Home from "@/pages/home";
import Marketplace from "@/pages/marketplace";
import ProductDetail from "./pages/product-detail";
import Artisans from "@/pages/artisans";
import ArtisanProfile from "@/pages/artisan-profile";
import AiStorytelling from "@/pages/ai-storytelling";
import Community from "@/pages/community";
import StoryDetail from "@/pages/story-detail";
import AuthLanding from "@/pages/auth-landing";
import CustomerSignup from "@/pages/customer-signup";
import CustomerLogin from "@/pages/customer-login";
import ArtisanSignup from "@/pages/artisan-signup";
import ArtisanLogin from "@/pages/artisan-login";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import { CartContextType, CartItemWithProduct } from "@/types";
import { api } from "@/lib/api";

const CartContext = createContext<CartContextType | null>(null);
const CART_SESSION_STORAGE_KEY = "artisan-collective-cart-session";
const CART_CACHE_STORAGE_KEY = "artisan-collective-cart-cache";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    console.error("useCart must be used within CartProvider - this might be a timing issue during development");
    // Return default values to prevent crashes during development
    return {
      items: [],
      addToCart: async () => {},
      updateQuantity: async () => {},
      removeFromCart: async () => {},
      clearCart: async () => {},
      total: 0,
      itemCount: 0,
      isOpen: false,
      setIsOpen: () => {},
    };
  }
  return context;
};

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "guest-session";
    const existing = window.localStorage.getItem(CART_SESSION_STORAGE_KEY);
    if (existing) return existing;
    const generated = `guest-${crypto.randomUUID()}`;
    window.localStorage.setItem(CART_SESSION_STORAGE_KEY, generated);
    return generated;
  });

  const writeCartCache = (nextItems: CartItemWithProduct[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_CACHE_STORAGE_KEY, JSON.stringify(nextItems));
  };

  const readCartCache = (): CartItemWithProduct[] => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(CART_CACHE_STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed as CartItemWithProduct[];
    } catch {
      return [];
    }
  };

  const hydrateWithProducts = async (cartItems: Array<{ id: string; productId: string; quantity: number }>) => {
    return Promise.all(
      cartItems.map(async (item) => {
        const product = await api.getProduct(item.productId);
        const artisan = await api.getArtisan(product.artisanId);
        return {
          ...item,
          product: {
            ...product,
            artisanName: artisan.name,
          },
        };
      })
    );
  };

  const loadCart = async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);
      let itemsWithProducts = await hydrateWithProducts(cartItems);

      // MemStorage resets whenever the server restarts. Restore from local cache.
      if (itemsWithProducts.length === 0) {
        const cachedItems = readCartCache();
        if (cachedItems.length > 0) {
          for (const cachedItem of cachedItems) {
            await api.addToCart({
              sessionId,
              productId: cachedItem.productId,
              quantity: Math.max(1, Number(cachedItem.quantity) || 1),
            });
          }

          const restoredItems = await api.getCartItems(sessionId);
          itemsWithProducts = await hydrateWithProducts(restoredItems);
        }
      }

      setItems(itemsWithProducts);
      writeCartCache(itemsWithProducts);
    } catch (error) {
      console.error("Failed to load cart:", error);

      const cachedItems = readCartCache();
      if (cachedItems.length > 0) {
        setItems(cachedItems);
      }
    }
  };

  useEffect(() => {
    const cachedItems = readCartCache();
    if (cachedItems.length > 0) {
      setItems(cachedItems);
    }

    loadCart();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      await loadCart();
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.updateCartItem(itemId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
      writeCartCache([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      {/* Auth Routes - No Layout Wrapper */}
      <Route path="/welcome" component={Welcome} />
      <Route path="/auth" component={AuthLanding} />
      <Route path="/customer-signup" component={CustomerSignup} />
      <Route path="/customer-login" component={CustomerLogin} />
      <Route path="/artisan-signup" component={ArtisanSignup} />
      <Route path="/artisan-login" component={ArtisanLogin} />

      {/* Main App Routes - With Layout */}
      <Route>
        {() => (
          <div className="min-h-screen bg-background">
            <Navbar />
            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={location}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/marketplace" component={Marketplace} />
                  <Route path="/products/:id" component={ProductDetail} />
                  <Route path="/artisans" component={Artisans} />
                  <Route path="/artisans/:id" component={ArtisanProfile} />
                  <Route path="/ai-storytelling" component={AiStorytelling} />
                  <Route path="/community/stories/:id" component={StoryDetail} />
                  <Route path="/community" component={Community} />
                  <Route component={NotFound} />
                </Switch>
              </motion.main>
            </AnimatePresence>
            <Footer />
            <ShoppingCart />
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Router />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

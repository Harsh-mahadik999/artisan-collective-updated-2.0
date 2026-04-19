import "./i18n";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import { queryClient } from "./lib/queryClient";
import { api } from "@/lib/api";
import { AuthProvider } from "@/context/auth-context";
import { CartContextType, CartItemWithProduct } from "@/types";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import BackToTop from "@/components/BackToTop";

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


// ─── Cart Context ────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextType | null>(null);

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Stable session ID — created once, never re-computed on re-renders
  const sessionId = useRef(
    localStorage.getItem("cart-session") ?? crypto.randomUUID()
  ).current;

  const loadCart = useCallback(async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);

      const fullItems = await Promise.all(
        cartItems.map(async (item: any) => {
          const product = await api.getProduct(item.productId);
          const artisan = await api.getArtisan(product.artisanId);
          return { ...item, product: { ...product, artisanName: artisan.name } };
        })
      );

      setItems(fullItems);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }, [sessionId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = useCallback(async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      await loadCart();
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  }, [sessionId, loadCart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      await api.updateCartItem(id, quantity);
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  }, [loadCart]);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  }, [sessionId]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen, setIsOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}


// ─── Router ──────────────────────────────────────────────────────────────────

const AUTH_ROUTES = [
  { path: "/welcome",         component: Welcome         },
  { path: "/auth",            component: AuthLanding     },
  { path: "/customer-signup", component: CustomerSignup  },
  { path: "/customer-login",  component: CustomerLogin   },
  { path: "/artisan-signup",  component: ArtisanSignup   },
  { path: "/artisan-login",   component: ArtisanLogin    },
];

const MAIN_ROUTES = [
  { path: "/",                       component: Home           },
  { path: "/marketplace",            component: Marketplace    },
  { path: "/products/:id",           component: ProductDetail  },
  { path: "/artisans",               component: Artisans       },
  { path: "/artisans/:id",           component: ArtisanProfile },
  { path: "/ai-storytelling",        component: AiStorytelling },
  { path: "/community/stories/:id",  component: StoryDetail    },
  { path: "/community",              component: Community      },
];

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      {AUTH_ROUTES.map(({ path, component }) => (
        <Route key={path} path={path} component={component} />
      ))}

      <Route>
        {() => (
          <div className="min-h-screen bg-background">
            <Navbar />

            <AnimatePresence mode="wait">
              <motion.main
                key={location}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Switch>
                  {MAIN_ROUTES.map(({ path, component }) => (
                    <Route key={path} path={path} component={component} />
                  ))}
                  <Route component={NotFound} />
                </Switch>
              </motion.main>
            </AnimatePresence>

            <Footer />
            <ShoppingCart />
            <BackToTop />
          </div>
        )}
      </Route>
    </Switch>
  );
}


// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
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
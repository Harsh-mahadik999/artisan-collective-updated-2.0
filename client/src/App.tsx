import "./i18n";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";

// Components
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ShoppingCart from "@/components/shopping-cart";
import BackToTop from "@/components/BackToTop";

// Pages
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
import Wishlist from "@/pages/wishlist";

// ─── Routes ──────────────────────────────────────────────────────────────────

const AUTH_ROUTES = [
  { path: "/welcome",          component: Welcome        },
  { path: "/auth",             component: AuthLanding    },
  { path: "/customer-signup",  component: CustomerSignup },
  { path: "/customer-login",   component: CustomerLogin  },
  { path: "/artisan-signup",   component: ArtisanSignup  },
  { path: "/artisan-login",    component: ArtisanLogin   },
];

const MAIN_ROUTES = [
  { path: "/",                      component: Home           },
  { path: "/marketplace",           component: Marketplace    },
  { path: "/products/:id",          component: ProductDetail  },
  { path: "/artisans",              component: Artisans       },
  { path: "/artisans/:id",          component: ArtisanProfile },
  { path: "/ai-storytelling",       component: AiStorytelling },
  { path: "/community/stories/:id", component: StoryDetail    },
  { path: "/community",             component: Community      },
  { path: "/wishlist",              component: Wishlist       },
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

            <AnimatePresence mode="wait" initial={false}>
              <motion.main
                key={location}
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
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
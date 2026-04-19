import "./i18n";
import { Switch, Route } from "wouter";
import { useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
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

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/welcome" component={Welcome} />
      <Route path="/auth" component={AuthLanding} />
      <Route path="/customer-signup" component={CustomerSignup} />
      <Route path="/customer-login" component={CustomerLogin} />
      <Route path="/artisan-signup" component={ArtisanSignup} />
      <Route path="/artisan-login" component={ArtisanLogin} />

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
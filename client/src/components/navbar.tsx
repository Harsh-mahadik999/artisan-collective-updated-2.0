import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Menu, X, Home, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/App";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [location] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const { isLoggedIn, userType, userName, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/marketplace", label: "Discover" },
    { href: "/artisans", label: "Artisans" },
    { href: "/community", label: "Stories" },
    { href: "/ai-storytelling", label: "AI Tools" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm smooth-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="link-home">
              <h1 className="text-xl font-serif font-bold text-primary hover:text-primary/80 smooth-transition cursor-pointer hover:scale-110 active:scale-95">
                Artisan Collective
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-${item.label.toLowerCase()}`}>
                <span className={`px-3 py-2 rounded-lg text-foreground smooth-transition cursor-pointer relative group transition-all ${
                  location === item.href ? 'text-primary font-medium bg-primary/5' : 'hover:text-primary hover:bg-accent/10 active:scale-95'
                }`}>
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary smooth-transition ${
                    location === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              data-testid="button-search" 
              className="hidden sm:flex text-foreground hover:text-primary hover:bg-accent/20 smooth-transition group active:scale-95"
            >
              <Search className="h-5 w-5 group-hover:scale-125 smooth-transition" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(true)}
              data-testid="button-cart"
              className="relative text-foreground hover:text-primary hover:bg-accent/20 smooth-transition group active:scale-95"
            >
              <ShoppingBag className="h-5 w-5 group-hover:scale-125 smooth-transition" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse animate-glow-pulse" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <div className="text-sm animate-slide-in-right">
                    <span className="text-muted-foreground">Welcome, </span>
                    <span className="font-semibold text-foreground">{userName}</span>
                    <span className="text-xs ml-2 px-2 py-1 bg-primary/20 text-primary rounded-full inline-block">
                      {userType === "artisan" ? "🛠️ Artisan" : "🛍️ Buyer"}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      logout();
                    }}
                    className="text-foreground hover:text-destructive ml-2 smooth-transition active:scale-95 group" 
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-1 group-hover:scale-125 smooth-transition" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/welcome">
                    <Button variant="ghost" className="text-foreground hover:text-primary smooth-transition active:scale-95 group" data-testid="button-welcome">
                      Welcome
                    </Button>
                  </Link>
                  <Link href="/customer-login">
                    <Button variant="ghost" className="text-foreground hover:text-secondary smooth-transition active:scale-95 group" data-testid="button-login">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button 
                      className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-110 smooth-transition button-hover active:scale-95" 
                      data-testid="button-join"
                    >
                      Join Now
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-foreground hover:text-primary hover:bg-accent/20 smooth-transition active:scale-95" 
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] animate-slide-in-right">
                <div className="flex flex-col space-y-6 mt-6">
                  {navItems.map((item, index) => (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-link-${item.label.toLowerCase()}`}
                    >
                      <span className={`text-lg font-medium text-foreground smooth-transition cursor-pointer block py-2 px-3 rounded-lg animate-slide-in-left ${
                        location === item.href ? 'text-primary bg-primary/5 font-semibold' : 'hover:text-primary hover:bg-accent/10 active:scale-95'
                      }`} style={{ animationDelay: `${index * 0.1}s` }}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                  
                  {/* Mobile Auth Buttons */}
                  <div className="flex flex-col space-y-2 mt-6 pt-6 border-t border-border">
                    {isLoggedIn ? (
                      <>
                        <div className="px-3 py-2 text-sm animate-slide-in-left">
                          <span className="text-muted-foreground">Welcome, </span>
                          <span className="font-semibold">{userName}</span>
                          <div className="text-xs mt-1 px-2 py-1 bg-primary/20 text-primary rounded w-fit">
                            {userType === "artisan" ? "🛠️ Artisan" : "🛍️ Buyer"}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full smooth-transition active:scale-95 animate-slide-in-left" 
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-1" />
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/welcome">
                          <Button variant="outline" className="w-full smooth-transition active:scale-95 animate-slide-in-left" onClick={() => setIsMobileMenuOpen(false)}>
                            Welcome
                          </Button>
                        </Link>
                        <Link href="/customer-login">
                          <Button variant="outline" className="w-full smooth-transition active:scale-95 animate-slide-in-left" onClick={() => setIsMobileMenuOpen(false)}>
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth">
                          <Button 
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition active:scale-95 animate-slide-in-left" 
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Join Now
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

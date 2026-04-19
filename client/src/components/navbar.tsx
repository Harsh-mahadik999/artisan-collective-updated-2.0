import { Link, useLocation } from "wouter";
import { LogOut, Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const USER_TYPE_LABEL: Record<string, string> = {
  artisan:  "Artisan",
  customer: "Buyer",
};

export default function Navbar() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { itemCount, setIsOpen } = useCart();
  const { isLoggedIn, userType, userName, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/marketplace",     label: t("nav.marketplace") },
    { href: "/artisans",        label: t("nav.artisans")    },
    { href: "/community",       label: t("nav.stories")     },
    { href: "/ai-storytelling", label: t("nav.aitools")     },
  ];

  const isActive        = (href: string) => location === href;
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm smooth-transition">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <h1 className="text-xl font-serif font-bold text-primary hover:text-primary/80 smooth-transition cursor-pointer hover:scale-110 active:scale-95">
              Artisan Collective
            </h1>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label }) => (
              <Link key={href} href={href} data-testid={`link-${href}`}>
                <span className={`px-3 py-2 rounded-lg text-foreground smooth-transition cursor-pointer relative group transition-all ${isActive(href) ? "text-primary font-medium bg-primary/5" : "hover:text-primary hover:bg-accent/10 active:scale-95"}`}>
                  {label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-primary smooth-transition ${isActive(href) ? "w-full" : "w-0 group-hover:w-full"}`} />
                </span>
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" data-testid="button-search" className="hidden sm:flex text-foreground hover:text-primary hover:bg-accent/20 smooth-transition group active:scale-95">
              <Search className="h-5 w-5 group-hover:scale-125 smooth-transition" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} data-testid="button-cart" className="relative text-foreground hover:text-primary hover:bg-accent/20 smooth-transition group active:scale-95">
              <ShoppingBag className="h-5 w-5 group-hover:scale-125 smooth-transition" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse" data-testid="text-cart-count">
                  {itemCount}
                </span>
              )}
            </Button>
            <div className="hidden sm:flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <div className="text-sm animate-slide-in-right">
                    <span className="text-muted-foreground">{t("nav.welcome")}, </span>
                    <span className="font-semibold text-foreground">{userName}</span>
                    <span className="text-xs ml-2 px-2 py-1 bg-primary/20 text-primary rounded-full inline-block">{USER_TYPE_LABEL[userType ?? "customer"]}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={logout} data-testid="button-logout" className="text-foreground hover:text-destructive ml-2 smooth-transition active:scale-95 group">
                    <LogOut className="h-4 w-4 mr-1 group-hover:scale-125 smooth-transition" />
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/welcome"><Button variant="ghost" className="text-foreground hover:text-primary smooth-transition active:scale-95" data-testid="button-welcome">{t("nav.welcome")}</Button></Link>
                  <Link href="/customer-login"><Button variant="ghost" className="text-foreground hover:text-secondary smooth-transition active:scale-95" data-testid="button-login">{t("nav.login")}</Button></Link>
                  <Link href="/auth"><Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-110 smooth-transition active:scale-95" data-testid="button-join">{t("nav.join")}</Button></Link>
                </>
              )}
            </div>
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu" className="md:hidden text-foreground hover:text-primary hover:bg-accent/20 smooth-transition active:scale-95">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] animate-slide-in-right">
                <div className="flex flex-col space-y-6 mt-6">
                  {navItems.map(({ href, label }, index) => (
                    <Link key={href} href={href} onClick={closeMobileMenu} data-testid={`mobile-link-${href}`}>
                      <span className={`text-lg font-medium text-foreground smooth-transition cursor-pointer block py-2 px-3 rounded-lg animate-slide-in-left ${isActive(href) ? "text-primary bg-primary/5 font-semibold" : "hover:text-primary hover:bg-accent/10 active:scale-95"}`} style={{ animationDelay: `${index * 0.1}s` }}>
                        {label}
                      </span>
                    </Link>
                  ))}
                  <div className="flex flex-col space-y-2 mt-6 pt-6 border-t border-border">
                    <LanguageSwitcher />
                    {isLoggedIn ? (
                      <>
                        <div className="px-3 py-2 text-sm animate-slide-in-left">
                          <span className="text-muted-foreground">{t("nav.welcome")}, </span>
                          <span className="font-semibold">{userName}</span>
                          <div className="text-xs mt-1 px-2 py-1 bg-primary/20 text-primary rounded w-fit">{USER_TYPE_LABEL[userType ?? "customer"]}</div>
                        </div>
                        <Button variant="outline" className="w-full smooth-transition active:scale-95" onClick={() => { logout(); closeMobileMenu(); }}>
                          <LogOut className="h-4 w-4 mr-1" />{t("nav.logout")}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/welcome"><Button variant="outline" className="w-full smooth-transition active:scale-95" onClick={closeMobileMenu}>{t("nav.welcome")}</Button></Link>
                        <Link href="/customer-login"><Button variant="outline" className="w-full smooth-transition active:scale-95" onClick={closeMobileMenu}>{t("nav.login")}</Button></Link>
                        <Link href="/auth"><Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 smooth-transition active:scale-95" onClick={closeMobileMenu}>{t("nav.join")}</Button></Link>
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
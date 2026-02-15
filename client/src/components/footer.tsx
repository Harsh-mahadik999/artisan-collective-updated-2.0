import { Link } from "wouter";
import { Facebook, Instagram, Youtube, PinIcon as Pinterest } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Discover",
      links: [
        { label: "All Artisans", href: "/marketplace" },
        { label: "Marketplace", href: "/marketplace" },
        { label: "New Arrivals", href: "/marketplace?sort=newest" },
        { label: "Gift Collections", href: "/marketplace?category=gifts" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "Stories & Blog", href: "/community" },
        { label: "Cultural Heritage", href: "/community?category=heritage" },
        { label: "Artisan Interviews", href: "/community?category=interviews" },
        { label: "Events", href: "/community?category=events" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Shipping Info", href: "/shipping" },
        { label: "Returns", href: "/returns" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Pinterest, label: "Pinterest", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-secondary to-secondary/95 text-secondary-foreground py-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="animate-slide-in-up">
            <Link href="/" data-testid="link-footer-home">
              <h3 className="text-xl font-serif font-bold mb-6 hover:text-secondary-foreground/80 smooth-transition cursor-pointer hover:scale-105">
                Artisan Collective
              </h3>
            </Link>
            <p className="text-secondary-foreground/80 mb-6 leading-relaxed">
              Connecting authentic craftsmanship with appreciative hearts worldwide.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className="text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-white/10 smooth-transition hover:scale-110"
                  data-testid={`button-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {footerSections.map((section, index) => (
            <div 
              key={section.title}
              className="animate-slide-in-up"
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <h4 className="font-semibold mb-4 text-secondary-foreground text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                      <span className="text-secondary-foreground/70 hover:text-secondary-foreground smooth-transition cursor-pointer hover:translate-x-1 inline-block">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-secondary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-secondary-foreground/60 text-sm animate-fade-in-scale" data-testid="text-copyright">
              © {currentYear} Artisan Collective. Crafted with love for authentic artisanship.
            </p>
            <div className="flex space-x-6 text-sm text-secondary-foreground/60">
              <Link href="/privacy" data-testid="link-privacy">
                <span className="hover:text-secondary-foreground smooth-transition cursor-pointer hover:underline">Privacy Policy</span>
              </Link>
              <Link href="/terms" data-testid="link-terms">
                <span className="hover:text-secondary-foreground smooth-transition cursor-pointer hover:underline">Terms of Service</span>
              </Link>
              <Link href="/cookies" data-testid="link-cookies">
                <span className="hover:text-secondary-foreground smooth-transition cursor-pointer hover:underline">Cookie Policy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

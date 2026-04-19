import { useEffect, useMemo, useState } from "react";
import { X, Plus, Minus, ShoppingBag, HeartHandshake, Smile, Meh, Frown, Angry, Sparkles } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCategoryFallbackImage, getProductImage } from "@/lib/product-image-utils";

type MoodKey = "good" | "normal" | "okay" | "sad" | "angry";

const MOODS: Array<{ key: MoodKey; label: string; emoji: string; icon: typeof Smile }> = [
  { key: "good",   label: "Good",   emoji: "😄", icon: Smile  },
  { key: "normal", label: "Normal", emoji: "🙂", icon: Smile  },
  { key: "okay",   label: "Okay",   emoji: "😐", icon: Meh    },
  { key: "sad",    label: "Sad",    emoji: "😔", icon: Frown  },
  { key: "angry",  label: "Angry",  emoji: "😠", icon: Angry  },
];

export default function ShoppingCart() {
  const { items, updateQuantity, removeFromCart, clearCart, total, isOpen, setIsOpen } = useCart();
  const { toast } = useToast();
  const [donationByArtisan, setDonationByArtisan] = useState<Record<string, number>>({});
  const [mood, setMood] = useState<MoodKey>("good");
  const [feedbackReason, setFeedbackReason] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState<null | {
    amount: number; donation: number; mood: MoodKey; reason: string;
  }>(null);

  useEffect(() => {
    if (!items.length) return;
    const artisanNames = Array.from(new Set(items.map((item) => item.product.artisanName)));
    setDonationByArtisan((prev) => {
      const next: Record<string, number> = {};
      artisanNames.forEach((name) => { next[name] = prev[name] ?? 1; });
      return next;
    });
  }, [items]);

  const donationTotal = useMemo(() =>
    Object.values(donationByArtisan).reduce((sum, val) => sum + val, 0),
  [donationByArtisan]);

  const grandTotal = total + donationTotal;

  const handleCheckout = async () => {
    const filledLines = feedbackReason.split("\n").map((l) => l.trim()).filter(Boolean);
    if (filledLines.length < 3) {
      toast({ title: "Add a little more feedback", description: "Please write at least 3 lines in the reason box before payment.", variant: "destructive" });
      return;
    }
    const currentDonation = donationTotal;
    const currentTotal = grandTotal;
    await clearCart();
    setPaymentReceipt({ amount: currentTotal, donation: currentDonation, mood, reason: feedbackReason });
    setFeedbackReason("");
    toast({ title: "Payment completed", description: `Order placed successfully. Total paid ${currentTotal.toFixed(2)} including donation.` });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-96 sm:w-[400px] flex flex-col p-0" data-testid="sheet-shopping-cart">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart</span>
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {paymentReceipt && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4" data-testid="payment-receipt">
              <p className="font-semibold text-foreground flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                Payment done successfully
              </p>
              <p className="text-sm text-muted-foreground mt-1">Paid: ${paymentReceipt.amount.toFixed(2)} (Donation: ${paymentReceipt.donation.toFixed(2)})</p>
              <p className="text-sm mt-2">Mood: {MOODS.find((m) => m.key === paymentReceipt.mood)?.emoji} {MOODS.find((m) => m.key === paymentReceipt.mood)?.label}</p>
              <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line">{paymentReceipt.reason}</p>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground" data-testid="text-empty-cart">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => { const img = e.currentTarget; img.onerror = null; img.src = getCategoryFallbackImage(undefined, item.product.id || item.id, 2); }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" data-testid={`text-item-name-${item.id}`}>{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground" data-testid={`text-item-artisan-${item.id}`}>by {item.product.artisanName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold" data-testid={`text-item-price-${item.id}`}>${item.product.price}</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="h-6 w-6" data-testid={`button-decrease-${item.id}`}><Minus className="h-3 w-3" /></Button>
                          <span className="text-sm font-medium w-8 text-center" data-testid={`text-item-quantity-${item.id}`}>{item.quantity}</span>
                          <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-6 w-6" data-testid={`button-increase-${item.id}`}><Plus className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="h-6 w-6 text-destructive hover:text-destructive" data-testid={`button-remove-${item.id}`}><X className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Donation */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold flex items-center mb-2">
                  <HeartHandshake className="h-4 w-4 mr-2 text-primary" />
                  Donate to artisans ($1 to $10 each)
                </p>
                <div className="space-y-3">
                  {Object.entries(donationByArtisan).map(([artisanName, value]) => (
                    <div key={artisanName} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{artisanName}</span>
                        <span className="font-semibold text-primary">${value}</span>
                      </div>
                      <input type="range" min={1} max={10} step={1} value={value}
                        onChange={(e) => { const next = Number(e.target.value); setDonationByArtisan((prev) => ({ ...prev, [artisanName]: next })); }}
                        className="w-full" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold mb-2">How do you feel about this order?</p>
                <div className="grid grid-cols-5 gap-1">
                  {MOODS.map((item) => {
                    const Icon = item.icon;
                    const active = mood === item.key;
                    return (
                      <Button key={item.key} variant={active ? "default" : "outline"} size="sm"
                        onClick={() => setMood(item.key)} className="h-auto py-2 px-1 flex flex-col gap-1">
                        <span>{item.emoji}</span>
                        <span className="text-[10px] leading-none">{item.label}</span>
                        <Icon className="h-3 w-3" />
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-semibold mb-2">Why this feeling? (min 3 lines)</p>
                <Textarea rows={4}
                  placeholder={"Line 1: What you liked\nLine 2: What can improve\nLine 3: Why you chose this mood"}
                  value={feedbackReason} onChange={(e) => setFeedbackReason(e.target.value)}
                  data-testid="textarea-feedback-reason" />
              </div>
            </>
          )}
        </div>

        {/* Sticky bottom — totals + buttons */}
        {items.length > 0 && (
          <div className="shrink-0 px-6 pb-6 pt-4 border-t border-border bg-background space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Donation</span>
              <span className="font-semibold text-primary">${donationTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-bold text-primary" data-testid="text-cart-total">${grandTotal.toFixed(2)}</span>
            </div>
            <Separator />
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleCheckout} data-testid="button-checkout">
              Pay Now
            </Button>
            <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); window.location.href = "/checkout"; }} data-testid="button-go-to-checkout">
              Proceed to Checkout Page
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

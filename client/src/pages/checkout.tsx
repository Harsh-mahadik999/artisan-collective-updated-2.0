import { useState } from "react";
import type { ChangeEvent } from "react";
import { useLocation } from "wouter";
import { ShoppingBag, MapPin, CreditCard, CheckCircle, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { getProductImage, getCategoryFallbackImage } from "@/lib/product-image-utils";

type Step = "summary" | "address" | "payment" | "confirmed";

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}

const EMPTY_ADDRESS: AddressForm = {
  fullName: "", phone: "", addressLine1: "",
  addressLine2: "", city: "", state: "", pincode: "",
};

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, itemCount, removeFromCart, clearCart } = useCart();
  const { userName } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<Step>("summary");
  const [address, setAddress] = useState<AddressForm>({
    ...EMPTY_ADDRESS,
    fullName: userName ?? "",
  });
  const [addressErrors, setAddressErrors] = useState<Record<keyof AddressForm, string>>({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [orderId] = useState(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [loading, setLoading] = useState(false);

  const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const tax = total * 0.05;
  const grandTotal = total + tax;

  // ── helpers ────────────────────────────────────────────────────────────────

  // Field-level validator for realtime error updates.
  const getAddressFieldError = (field: keyof AddressForm, value: string) => {
    const trimmed = value.trim();
    if (field === "addressLine2") return "";
    if (!trimmed) return "This field is required";
    if (field === "phone" && !/^\d{10}$/.test(trimmed)) return "Phone number must be 10 digits";
    if (field === "pincode" && !/^\d{6}$/.test(trimmed)) return "Pincode must be 6 digits";
    return "";
  };

  const handleAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as keyof AddressForm;
    const rawValue = e.target.value;
    const value =
      field === "phone" ? rawValue.replace(/\D/g, "").slice(0, 10) :
      field === "pincode" ? rawValue.replace(/\D/g, "").slice(0, 6) :
      rawValue;

    setAddress((prev) => ({ ...prev, [field]: value }));
    setAddressErrors((prev) => ({ ...prev, [field]: getAddressFieldError(field, value) }));
  };

  const isAddressValid = () =>
    address.fullName.trim() &&
    address.phone.trim() &&
    address.addressLine1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.pincode.trim() &&
    !getAddressFieldError("fullName", address.fullName) &&
    !getAddressFieldError("phone", address.phone) &&
    !getAddressFieldError("addressLine1", address.addressLine1) &&
    !getAddressFieldError("city", address.city) &&
    !getAddressFieldError("state", address.state) &&
    !getAddressFieldError("pincode", address.pincode);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await wait(1000);
      await clearCart();
      setStep("confirmed");
      toast({ title: "Order placed!", description: `Your order ${orderId} is confirmed.` });
    } finally {
      setLoading(false);
    }
  };

  // ── empty cart guard ───────────────────────────────────────────────────────

  if (items.length === 0 && step !== "confirmed") {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-serif font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button onClick={() => navigate("/marketplace")}>Browse Marketplace</Button>
      </div>
    );
  }

  // ── step: confirmed ────────────────────────────────────────────────────────

  if (step === "confirmed") {
    return (
      <div className="container mx-auto px-4 py-24 max-w-lg text-center">
        <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-6" />
        <h1 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-1">Thank you for supporting local artisans.</p>
        <p className="text-sm font-mono text-primary mb-8">{orderId}</p>
        <Card className="text-left mb-6">
          <CardContent className="p-6 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Delivered to</span><span className="font-medium">{address.fullName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-right max-w-[60%]">{address.addressLine1}, {address.city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Amount paid</span><span className="font-bold text-primary">₹{grandTotal.toFixed(2)}</span></div>
          </CardContent>
        </Card>
        <Button className="w-full" onClick={() => navigate("/marketplace")}>Continue Shopping</Button>
      </div>
    );
  }

  // ── main layout ────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* breadcrumb */}
      <button
        onClick={() => step === "summary" ? navigate("/marketplace") : setStep(step === "payment" ? "address" : "summary")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {step === "summary" ? "Back to Marketplace" : "Back"}
      </button>

      {/* step indicator */}
      <div className="flex items-center gap-2 mb-10 text-xs font-semibold uppercase tracking-wider">
        {(["summary", "address", "payment"] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold
              ${step === s ? "bg-primary text-primary-foreground" :
                ["summary","address","payment"].indexOf(step) > i ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"}`}>
              {i + 1}
            </span>
            <span className={step === s ? "text-foreground" : "text-muted-foreground"}>{s}</span>
            {i < 2 && <span className="text-muted-foreground mx-1">›</span>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── left panel ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1 — Order Summary */}
          {step === "summary" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5" /> Order Summary ({itemCount} items)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => {
                  const img = getProductImage(item.product, 0);
                  return (
                    <div key={item.id} className="flex gap-4 items-start">
                      <img src={img} alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover border border-border flex-shrink-0"
                        onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = getCategoryFallbackImage("default", item.productId, 1); }} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">by {item.product.artisanName}</p>
                        <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm">₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                        <button onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive/80 mt-1 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
                <Separator />
                <Button className="w-full" onClick={() => setStep("address")}>
                  Proceed to Delivery Address
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 2 — Delivery Address */}
          {step === "address" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" /> Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                    <Input
                      name="fullName"
                      value={address.fullName}
                      onChange={handleAddressChange}
                      placeholder="Your full name"
                      className={addressErrors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.fullName && <p className="text-red-500 text-sm mt-1">{addressErrors.fullName}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
                    <Input
                      name="phone"
                      value={address.phone}
                      onChange={handleAddressChange}
                      placeholder="10-digit phone number"
                      className={addressErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.phone && <p className="text-red-500 text-sm mt-1">{addressErrors.phone}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Address Line 1 *</label>
                    <Input
                      name="addressLine1"
                      value={address.addressLine1}
                      onChange={handleAddressChange}
                      placeholder="House / Flat / Street"
                      className={addressErrors.addressLine1 ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.addressLine1 && <p className="text-red-500 text-sm mt-1">{addressErrors.addressLine1}</p>}
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Address Line 2</label>
                    <Input name="addressLine2" value={address.addressLine2} onChange={handleAddressChange} placeholder="Landmark (optional)" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">City *</label>
                    <Input
                      name="city"
                      value={address.city}
                      onChange={handleAddressChange}
                      placeholder="City"
                      className={addressErrors.city ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.city && <p className="text-red-500 text-sm mt-1">{addressErrors.city}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">State *</label>
                    <Input
                      name="state"
                      value={address.state}
                      onChange={handleAddressChange}
                      placeholder="State"
                      className={addressErrors.state ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.state && <p className="text-red-500 text-sm mt-1">{addressErrors.state}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Pincode *</label>
                    <Input
                      name="pincode"
                      value={address.pincode}
                      onChange={handleAddressChange}
                      placeholder="6-digit pincode"
                      maxLength={6}
                      className={addressErrors.pincode ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {addressErrors.pincode && <p className="text-red-500 text-sm mt-1">{addressErrors.pincode}</p>}
                  </div>
                </div>
                <Button className="w-full" disabled={!isAddressValid()} onClick={() => setStep("payment")}>
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}

          {/* STEP 3 — Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" /> Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground text-center">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-foreground">Demo Checkout</p>
                  <p className="text-xs mt-1">Payment gateway integration coming soon. Click below to simulate a successful order.</p>
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Delivering to</span><span className="font-medium text-foreground">{address.fullName}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>{address.addressLine1}, {address.city}</span></div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handlePlaceOrder} disabled={loading}>
                  {loading ? "Processing..." : `Place Order · ₹${grandTotal.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── right panel — price breakdown ── */}
        <div className="space-y-4">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Price Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate max-w-[65%]">{item.product.name} × {item.quantity}</span>
                  <span>₹{(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (5%)</span><span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span className="text-green-600 font-medium">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span><span className="text-primary">₹{grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CartContextType, CartItemWithProduct } from "@/types";

const CartContext = createContext<CartContextType | null>(null);

const CART_SESSION_KEY = "artisan-collective-cart-session";
const CART_CACHE_KEY   = "artisan-collective-cart-cache";

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,  setItems]  = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [sessionId] = useState(() => {
    const existing = window.localStorage.getItem(CART_SESSION_KEY);
    if (existing) return existing;
    const generated = `guest-${crypto.randomUUID()}`;
    window.localStorage.setItem(CART_SESSION_KEY, generated);
    return generated;
  });

  const writeCache = (next: CartItemWithProduct[]) =>
    window.localStorage.setItem(CART_CACHE_KEY, JSON.stringify(next));

  const readCache = (): CartItemWithProduct[] => {
    try {
      const raw = window.localStorage.getItem(CART_CACHE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

  const hydrate = async (cartItems: Array<{ id: string; productId: string; quantity: number }>) =>
    Promise.all(
      cartItems.map(async (item) => {
        const product = await api.getProduct(item.productId);
        const artisan = await api.getArtisan(product.artisanId);
        return { ...item, product: { ...product, artisanName: artisan.name } };
      })
    );

  const loadCart = async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);
      let withProducts = await hydrate(cartItems);

      if (withProducts.length === 0) {
        const cached = readCache();
        if (cached.length > 0) {
          for (const c of cached) {
            await api.addToCart({ sessionId, productId: c.productId, quantity: Math.max(1, Number(c.quantity) || 1) });
          }
          withProducts = await hydrate(await api.getCartItems(sessionId));
        }
      }

      setItems(withProducts);
      writeCache(withProducts);
    } catch {
      const cached = readCache();
      if (cached.length > 0) setItems(cached);
    }
  };

  useEffect(() => {
    const cached = readCache();
    if (cached.length > 0) setItems(cached);
    loadCart();
  }, []);

  const addToCart = async (productId: string) => {
    await api.addToCart({ sessionId, productId, quantity: 1 });
    await loadCart();
    setIsOpen(true);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    await api.updateCartItem(itemId, quantity);
    await loadCart();
  };

  const removeFromCart = async (itemId: string) => {
    await api.removeFromCart(itemId);
    await loadCart();
  };

  const clearCart = async () => {
    await api.clearCart(sessionId);
    setItems([]);
    writeCache([]);
  };

  const total     = items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

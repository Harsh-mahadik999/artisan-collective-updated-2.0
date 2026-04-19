import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CartContextType, CartItemWithProduct } from "@/types";

const CartContext = createContext<CartContextType | null>(null);

const CART_SESSION_STORAGE_KEY = "artisan-collective-cart-session";
const CART_CACHE_STORAGE_KEY = "artisan-collective-cart-cache";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
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
        return { ...item, product: { ...product, artisanName: artisan.name } };
      })
    );
  };

  const loadCart = async () => {
    try {
      const cartItems = await api.getCartItems(sessionId);
      let itemsWithProducts = await hydrateWithProducts(cartItems);

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
      if (cachedItems.length > 0) setItems(cachedItems);
    }
  };

  useEffect(() => {
    const cachedItems = readCartCache();
    if (cachedItems.length > 0) setItems(cachedItems);
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
    writeCartCache([]);
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

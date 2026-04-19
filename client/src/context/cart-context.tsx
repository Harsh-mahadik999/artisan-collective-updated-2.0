import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { api } from "@/lib/api";
import { CartContextType, CartItemWithProduct } from "@/types";

const CartContext = createContext<CartContextType | null>(null);

const CART_SESSION_STORAGE_KEY = "artisan-collective-cart-session";
const CART_CACHE_STORAGE_KEY = "artisan-collective-cart-cache";

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const sessionId = useRef(() => {
    if (typeof window === "undefined") return "guest-session";
    const existing = window.localStorage.getItem(CART_SESSION_STORAGE_KEY);
    if (existing) return existing;
    const generated = `guest-${crypto.randomUUID()}`;
    window.localStorage.setItem(CART_SESSION_STORAGE_KEY, generated);
    return generated;
  }).current();

  const writeCartCache = useCallback((nextItems: CartItemWithProduct[]) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CART_CACHE_STORAGE_KEY, JSON.stringify(nextItems));
  }, []);

  const readCartCache = useCallback((): CartItemWithProduct[] => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(CART_CACHE_STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CartItemWithProduct[]) : [];
    } catch {
      return [];
    }
  }, []);

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
      writeCartCache(fullItems);
    } catch (err) {
      console.error("Failed to load cart:", err);
      // Fallback to cache on error
      const cached = readCartCache();
      if (cached.length > 0) {
        setItems(cached);
      }
    }
  }, [sessionId, writeCartCache, readCartCache]);

  useEffect(() => {
    // Initial hydration from cache for immediate UI
    const cached = readCartCache();
    if (cached.length > 0) {
      setItems(cached);
    }
    loadCart();
  }, [loadCart, readCartCache]);

  const addToCart = useCallback(async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      await loadCart();
      setIsOpen(true);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err;
    }
  }, [sessionId, loadCart]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      await api.updateCartItem(id, quantity);
      await loadCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
      throw err;
    }
  }, [loadCart]);

  const removeFromCart = useCallback(async (id: string) => {
    try {
      await api.removeFromCart(id);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      throw err;
    }
  }, [loadCart]);

  const clearCart = useCallback(async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
      writeCartCache([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      throw err;
    }
  }, [sessionId, writeCartCache]);

  const total = useMemo(() => 
    items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0), 
  [items]);

  const itemCount = useMemo(() => 
    items.reduce((sum, i) => sum + i.quantity, 0), 
  [items]);

  const value = useMemo(() => ({
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen
  }), [items, addToCart, updateQuantity, removeFromCart, clearCart, total, itemCount, isOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

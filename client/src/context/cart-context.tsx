import React, { createContext, useContext, useState, useEffect } from "react";
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
        return {
          ...item,
          product: {
            ...product,
            artisanName: artisan.name,
          },
        };
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
      if (cachedItems.length > 0) {
        setItems(cachedItems);
      }
    }
  };

  useEffect(() => {
    const cachedItems = readCartCache();
    if (cachedItems.length > 0) {
      setItems(cachedItems);
    }
    loadCart();
  }, []);

  const addToCart = async (productId: string) => {
    try {
      await api.addToCart({ sessionId, productId, quantity: 1 });
      await loadCart();
      setIsOpen(true);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await api.updateCartItem(itemId, quantity);
      await loadCart();
    } catch (error) {
      console.error("Failed to update cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await api.removeFromCart(itemId);
      await loadCart();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart(sessionId);
      setItems([]);
      writeCartCache([]);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value: CartContextType = {
    items,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    total,
    itemCount,
    isOpen,
    setIsOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

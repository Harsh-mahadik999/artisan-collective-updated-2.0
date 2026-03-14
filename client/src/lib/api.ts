import { apiRequest } from "./queryClient";

interface StoryGenerationResponse {
  description: string;
  captions: string[];
}

export const api = {
  // Artisans
  getArtisans: () => fetch("/api/artisans").then(res => res.json()),
  getFeaturedArtisans: () => fetch("/api/artisans/featured").then(res => res.json()),
  getArtisan: (id: string) => fetch(`/api/artisans/${id}`).then(res => res.json()),
  createArtisan: (data: any) => apiRequest("POST", "/api/artisans", data),
  
  // Products
  getProducts: (category?: string) => {
    const url = category ? `/api/products?category=${category}` : "/api/products";
    return fetch(url).then(res => res.json());
  },
  getFeaturedProducts: () => fetch("/api/products/featured").then(res => res.json()),
  getProduct: (id: string) => fetch(`/api/products/${id}`).then(res => res.json()),
  getArtisanProducts: (artisanId: string) => fetch(`/api/artisans/${artisanId}/products`).then(res => res.json()),
  createProduct: (data: any) => apiRequest("POST", "/api/products", data),
  
  // Stories
  getStories: () => fetch("/api/stories").then(res => res.json()),
  getFeaturedStories: () => fetch("/api/stories/featured").then(res => res.json()),
  getStory: (id: string) => fetch(`/api/stories/${id}`).then(res => res.json()),
  createStory: (data: any) => apiRequest("POST", "/api/stories", data),
  
  // Cart
  getCartItems: (sessionId: string) => fetch(`/api/cart/${sessionId}`).then(res => res.json()),
  addToCart: (data: any) => apiRequest("POST", "/api/cart", data),
  updateCartItem: (id: string, quantity: number) => apiRequest("PUT", `/api/cart/${id}`, { quantity }),
  removeFromCart: (id: string) => apiRequest("DELETE", `/api/cart/${id}`),
  clearCart: (sessionId: string) => apiRequest("DELETE", `/api/cart/session/${sessionId}`),
  
  // AI Generation
  generateStory: async (data: any): Promise<StoryGenerationResponse> => {
    const response = await apiRequest("POST", "/api/ai/generate-story", data);
    return response.json();
  },
  getArtisanGenerations: (artisanId: string) => fetch(`/api/ai/generations/${artisanId}`).then(res => res.json()),
};

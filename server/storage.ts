import { type Artisan, type InsertArtisan, type Product, type InsertProduct, type Story, type InsertStory, type CartItem, type InsertCartItem, type AiGeneration, type InsertAiGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Artisans
  getArtisan(id: string): Promise<Artisan | undefined>;
  getArtisans(): Promise<Artisan[]>;
  getFeaturedArtisans(): Promise<Artisan[]>;
  createArtisan(artisan: InsertArtisan): Promise<Artisan>;
  
  // Products
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByArtisan(artisanId: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  
  // Stories
  getStory(id: string): Promise<Story | undefined>;
  getStories(): Promise<Story[]>;
  getFeaturedStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  
  // Cart
  getCartItems(sessionId: string): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
  
  // AI Generations
  createAiGeneration(generation: InsertAiGeneration): Promise<AiGeneration>;
  getArtisanGenerations(artisanId: string): Promise<AiGeneration[]>;
}

export class MemStorage implements IStorage {
  private artisans: Map<string, Artisan> = new Map();
  private products: Map<string, Product> = new Map();
  private stories: Map<string, Story> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private aiGenerations: Map<string, AiGeneration> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed artisans
    const artisan1: Artisan = {
      id: "artisan-1",
      name: "Maria Santos",
      location: "Portugal",
      specialty: "Ceramics",
      experience: "25 years",
      story: "Third-generation ceramicist creating unique pottery using traditional Portuguese techniques learned from her grandmother. Each piece reflects the coastal beauty of her hometown.",
      profileImage: "https://pixabay.com/get/g8b7c5f507a3d2865b2f33c79c50177741d039c67391e7aab086216ffabcda4f3b6456f8df1c5a8ae95f215d9b460b950a4b2095f2e0b24240d75958a36b683c7_1280.jpg",
      verified: true,
      createdAt: new Date(),
    };

    const artisan2: Artisan = {
      id: "artisan-2",
      name: "Rajesh Kumar",
      location: "India",
      specialty: "Textiles",
      experience: "30 years",
      story: "Master weaver preserving ancient Indian textile traditions, creating vibrant handloom fabrics that tell stories of cultural heritage passed down through generations.",
      profileImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      verified: true,
      createdAt: new Date(),
    };

    const artisan3: Artisan = {
      id: "artisan-3",
      name: "Elena Müller",
      location: "Germany",
      specialty: "Woodwork",
      experience: "15 years",
      story: "Contemporary woodworker blending traditional Black Forest techniques with modern design, creating functional art pieces that honor both heritage and innovation.",
      profileImage: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      verified: true,
      createdAt: new Date(),
    };

    this.artisans.set(artisan1.id, artisan1);
    this.artisans.set(artisan2.id, artisan2);
    this.artisans.set(artisan3.id, artisan3);

    // Seed products
    const products = [
      {
        id: "product-1",
        name: "Sunset Ceramic Bowl",
        description: "Hand-thrown ceramic bowl with a unique sunset glaze pattern. Perfect for serving or as a decorative piece.",
        price: "78.00",
        category: "ceramics",
        artisanId: "artisan-1",
        images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        inStock: true,
        featured: true,
        rating: "4.8",
        reviewCount: 24,
        createdAt: new Date(),
      },
      {
        id: "product-2",
        name: "Heritage Tapestry",
        description: "Traditional handwoven tapestry featuring ancient Indian motifs, crafted using organic cotton and natural dyes.",
        price: "245.00",
        category: "textiles",
        artisanId: "artisan-2",
        images: ["https://pixabay.com/get/g8b3222ea30b4f2d0a7a2dc67d5d22301e05fdf9d74d7a158b26b8ab69e3ef6797a552aab00706f2e8fb2db4ccecf5605304be8117d92a421273ca88ee8f4e09d_1280.jpg"],
        inStock: true,
        featured: true,
        rating: "4.9",
        reviewCount: 18,
        createdAt: new Date(),
      },
      {
        id: "product-3",
        name: "Carved Memory Box",
        description: "Handcrafted wooden jewelry box featuring intricate Black Forest carvings, perfect for storing precious keepsakes.",
        price: "156.00",
        category: "woodwork",
        artisanId: "artisan-3",
        images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"],
        inStock: true,
        featured: true,
        rating: "4.7",
        reviewCount: 31,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, product as Product));

    // Seed stories
    const stories = [
      {
        id: "story-1",
        title: "The Ancient Art of Japanese Pottery: A 500-Year Legacy",
        excerpt: "Discover how the Yamamoto family has preserved traditional Raku pottery techniques through five centuries, adapting ancient methods for modern appreciation...",
        content: "Full story content here...",
        category: "Heritage",
        authorId: "artisan-1",
        coverImage: "https://pixabay.com/get/ge89c04c0034e93f46305ebea170c91cbd41d321c1f1ed4681775005fe56d4e6e73ec9d66d808113cae5a776abf3ae23f5baf442cc7a66fb8841c0e2451301dac_1280.jpg",
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "story-2",
        title: "Weaving Dreams: Maria's Journey from Village to Global Recognition",
        excerpt: "From her grandmother's loom to international exhibitions, follow Maria's inspiring transformation of traditional Mexican weaving into contemporary art...",
        content: "Full story content here...",
        category: "Interview",
        authorId: "artisan-2",
        coverImage: "https://pixabay.com/get/ga2c4670c12cd6d6977932eae9dab11b7d6699779e0fcbcaa6e119274776477ae84a386a8eb77026199f362a9cd00341a235a90f8a03d9a163938411e3a9191c7_1280.jpg",
        publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        featured: true,
      },
    ];

    stories.forEach(story => this.stories.set(story.id, story as Story));
  }

  // Artisan methods
  async getArtisan(id: string): Promise<Artisan | undefined> {
    return this.artisans.get(id);
  }

  async getArtisans(): Promise<Artisan[]> {
    return Array.from(this.artisans.values());
  }

  async getFeaturedArtisans(): Promise<Artisan[]> {
    return Array.from(this.artisans.values()).filter(a => a.verified).slice(0, 6);
  }

  async createArtisan(insertArtisan: InsertArtisan): Promise<Artisan> {
    const id = randomUUID();
    const artisan: Artisan = { 
      ...insertArtisan, 
      id, 
      createdAt: new Date(),
      profileImage: insertArtisan.profileImage || null,
      verified: insertArtisan.verified || false
    };
    this.artisans.set(id, artisan);
    return artisan;
  }

  // Product methods
  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async getProductsByArtisan(artisanId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.artisanId === artisanId);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.featured);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt: new Date(),
      images: insertProduct.images || [],
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : false,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Story methods
  async getStory(id: string): Promise<Story | undefined> {
    return this.stories.get(id);
  }

  async getStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }

  async getFeaturedStories(): Promise<Story[]> {
    return Array.from(this.stories.values()).filter(s => s.featured);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = randomUUID();
    const story: Story = { 
      ...insertStory, 
      id, 
      publishDate: new Date(),
      featured: insertStory.featured !== undefined ? insertStory.featured : false,
      authorId: insertStory.authorId || null,
      coverImage: insertStory.coverImage || null
    };
    this.stories.set(id, story);
    return story;
  }

  // Cart methods
  async getCartItems(sessionId: string): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    const id = randomUUID();
    const item: CartItem = { 
      ...insertItem, 
      id, 
      createdAt: new Date(),
      quantity: insertItem.quantity || 1
    };
    this.cartItems.set(id, item);
    return item;
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const items = Array.from(this.cartItems.entries());
    let cleared = false;
    
    items.forEach(([id, item]) => {
      if (item.sessionId === sessionId) {
        this.cartItems.delete(id);
        cleared = true;
      }
    });
    
    return cleared;
  }

  // AI Generation methods
  async createAiGeneration(insertGeneration: InsertAiGeneration): Promise<AiGeneration> {
    const id = randomUUID();
    const generation: AiGeneration = { 
      ...insertGeneration, 
      id, 
      createdAt: new Date(),
      heritage: insertGeneration.heritage || null,
      generatedCaptions: insertGeneration.generatedCaptions || []
    };
    this.aiGenerations.set(id, generation);
    return generation;
  }

  async getArtisanGenerations(artisanId: string): Promise<AiGeneration[]> {
    return Array.from(this.aiGenerations.values()).filter(g => g.artisanId === artisanId);
  }
}

export const storage = new MemStorage();

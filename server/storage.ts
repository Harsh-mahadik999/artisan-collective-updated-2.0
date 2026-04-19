import { type Artisan, type InsertArtisan, type Product, type InsertProduct, type Story, type InsertStory, type CartItem, type InsertCartItem, type AiGeneration, type InsertAiGeneration, type Review, type InsertReview } from "@shared/schema";
import { randomUUID } from "crypto";

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

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
  getPopularProducts(limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  likeProduct(id: string): Promise<Product | undefined>;
  unlikeProduct(id: string): Promise<Product | undefined>;
  
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

  // Reviews
  getReviewsForProduct(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class MemStorage implements IStorage {
  private artisans: Map<string, Artisan> = new Map();
  private products: Map<string, Product> = new Map();
  private stories: Map<string, Story> = new Map();
  private cartItems: Map<string, CartItem> = new Map();
  private aiGenerations: Map<string, AiGeneration> = new Map();
  private reviews: Map<string, Review> = new Map();

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

    const artisan4: Artisan = {
      id: "artisan-4",
      name: "Amina El Idrissi",
      location: "Morocco",
      specialty: "Ceramics",
      experience: "19 years",
      story: "Amina blends Fez tile geometry with modern tableware forms. She runs a women-led studio where apprentices learn glaze chemistry, pattern drawing, and kiln safety before taking paid commissions.",
      profileImage: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan5: Artisan = {
      id: "artisan-5",
      name: "Luca Bianchi",
      location: "Italy",
      specialty: "Glasswork",
      experience: "22 years",
      story: "Luca is a Murano-trained glass artist known for translucent color layering and precision torchwork. His practice focuses on durable objects that still feel like collected pieces of light.",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan6: Artisan = {
      id: "artisan-6",
      name: "Nokuthula Dlamini",
      location: "South Africa",
      specialty: "Textiles",
      experience: "14 years",
      story: "Nokuthula develops handwoven home textiles using native dye plants and low-water finishing methods. Her collective funds school transport for young weavers in rural communities.",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan7: Artisan = {
      id: "artisan-7",
      name: "Kenji Watanabe",
      location: "Japan",
      specialty: "Woodwork",
      experience: "27 years",
      story: "Kenji creates joinery-first furniture without visible screws, preserving Japanese hand-tool traditions while adapting dimensions for compact modern homes.",
      profileImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan8: Artisan = {
      id: "artisan-8",
      name: "Sofia Alvarez",
      location: "Mexico",
      specialty: "Jewelry",
      experience: "16 years",
      story: "Sofia works with recycled silver and hand-carved wax molds inspired by desert plants. Her jewelry studio is known for heirloom-quality finishing and ethical sourcing.",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan9: Artisan = {
      id: "artisan-9",
      name: "Thiago Ribeiro",
      location: "Brazil",
      specialty: "Woodwork",
      experience: "12 years",
      story: "Thiago turns reclaimed hardwood into kitchen and bar objects with long lifecycles. He documents every material source to prove traceability from workshop to customer.",
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan10: Artisan = {
      id: "artisan-10",
      name: "Greta Novak",
      location: "Czech Republic",
      specialty: "Glasswork",
      experience: "18 years",
      story: "Greta specializes in blown glass lighting with subtle smoked gradients. Her team pairs old furnace methods with safer studio workflows for younger makers.",
      profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan11: Artisan = {
      id: "artisan-11",
      name: "Fatima Noor",
      location: "Pakistan",
      specialty: "Textiles",
      experience: "21 years",
      story: "Fatima revives hand-block printing with naturally aged dye recipes and modern garment cuts. Her workshop is built around fair wages and transparent production calendars.",
      profileImage: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan12: Artisan = {
      id: "artisan-12",
      name: "Mateo Silva",
      location: "Chile",
      specialty: "Ceramics",
      experience: "11 years",
      story: "Mateo experiments with volcanic ash glazes and hand-pressed stoneware forms. His pieces are built for daily use but designed as collectable functional art.",
      profileImage: "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    const artisan13: Artisan = {
      id: "artisan-13",
      name: "Hana Park",
      location: "South Korea",
      specialty: "Jewelry",
      experience: "13 years",
      story: "Hana designs minimal metal jewelry with hand-textured surfaces inspired by river stones. She teaches micro-soldering through community workshops for beginners.",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=700&h=800",
      verified: true,
      createdAt: new Date(),
    };

    this.artisans.set(artisan1.id, artisan1);
    this.artisans.set(artisan2.id, artisan2);
    this.artisans.set(artisan3.id, artisan3);
    this.artisans.set(artisan4.id, artisan4);
    this.artisans.set(artisan5.id, artisan5);
    this.artisans.set(artisan6.id, artisan6);
    this.artisans.set(artisan7.id, artisan7);
    this.artisans.set(artisan8.id, artisan8);
    this.artisans.set(artisan9.id, artisan9);
    this.artisans.set(artisan10.id, artisan10);
    this.artisans.set(artisan11.id, artisan11);
    this.artisans.set(artisan12.id, artisan12);
    this.artisans.set(artisan13.id, artisan13);

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
      {
        id: "product-4",
        name: "Fez Pattern Dinner Plate",
        description: "Stoneware dinner plate with hand-painted geometric motifs inspired by classic Moroccan zellige compositions.",
        price: "62.00",
        category: "ceramics",
        artisanId: "artisan-4",
        images: ["https://images.unsplash.com/photo-1610701596077-11502861dcfa?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 19,
        createdAt: new Date(),
      },
      {
        id: "product-5",
        name: "Atlas Glaze Serving Set",
        description: "Three-piece serving set with deep blue crackle glaze and smooth sanded foot-rings for stable placement.",
        price: "129.00",
        category: "ceramics",
        artisanId: "artisan-4",
        images: ["https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 27,
        createdAt: new Date(),
      },
      {
        id: "product-6",
        name: "Hand-Tiled Tea Cup Pair",
        description: "Porcelain tea cups with hand-brushed cobalt linework and gently rounded lip for comfortable sipping.",
        price: "48.00",
        category: "ceramics",
        artisanId: "artisan-4",
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 14,
        createdAt: new Date(),
      },
      {
        id: "product-7",
        name: "Murano Drift Vase",
        description: "Hand-blown glass vase with layered sea-green tones and a sculpted asymmetrical rim.",
        price: "210.00",
        category: "glasswork",
        artisanId: "artisan-5",
        images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a4a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: true,
        rating: "4.9",
        reviewCount: 41,
        createdAt: new Date(),
      },
      {
        id: "product-8",
        name: "Amber Flame Tumbler Set",
        description: "Set of four hand-finished tumblers designed for daily use with warm amber core color.",
        price: "116.00",
        category: "glasswork",
        artisanId: "artisan-5",
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 23,
        createdAt: new Date(),
      },
      {
        id: "product-9",
        name: "Lagoon Glass Pendant",
        description: "Blown-glass pendant light with subtle ripple texture and brass top cap.",
        price: "185.00",
        category: "glasswork",
        artisanId: "artisan-5",
        images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 17,
        createdAt: new Date(),
      },
      {
        id: "product-10",
        name: "Savannah Weave Throw",
        description: "Handwoven cotton throw featuring natural stripe transitions and brushed soft finish.",
        price: "138.00",
        category: "textiles",
        artisanId: "artisan-6",
        images: ["https://images.unsplash.com/photo-1616627456767-8c82f6b6fe7a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 28,
        createdAt: new Date(),
      },
      {
        id: "product-11",
        name: "Indigo Table Runner",
        description: "Naturally dyed table runner with hand-knotted fringe and reinforced selvedges.",
        price: "72.00",
        category: "textiles",
        artisanId: "artisan-6",
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 16,
        createdAt: new Date(),
      },
      {
        id: "product-12",
        name: "Braided Cushion Cover",
        description: "Textured handloom cushion cover with hidden zipper and durable stitching for long use.",
        price: "54.00",
        category: "textiles",
        artisanId: "artisan-6",
        images: ["https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 13,
        createdAt: new Date(),
      },
      {
        id: "product-13",
        name: "Kumiko Desk Shelf",
        description: "Compact wooden shelf using clean joinery and geometric side lattice for modern workspaces.",
        price: "242.00",
        category: "woodwork",
        artisanId: "artisan-7",
        images: ["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 22,
        createdAt: new Date(),
      },
      {
        id: "product-14",
        name: "Hinoki Tea Tray",
        description: "Low-profile serving tray in hinoki with carved channels and food-safe oil finish.",
        price: "96.00",
        category: "woodwork",
        artisanId: "artisan-7",
        images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 20,
        createdAt: new Date(),
      },
      {
        id: "product-15",
        name: "Joinery Stool No. 4",
        description: "Hand-shaped stool with wedged tenon construction designed for everyday seating.",
        price: "279.00",
        category: "woodwork",
        artisanId: "artisan-7",
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 15,
        createdAt: new Date(),
      },
      {
        id: "product-16",
        name: "Desert Bloom Ring",
        description: "Recycled sterling silver ring with hand-filed petals and satin finish.",
        price: "84.00",
        category: "jewelry",
        artisanId: "artisan-8",
        images: ["https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 26,
        createdAt: new Date(),
      },
      {
        id: "product-17",
        name: "Cactus Line Earrings",
        description: "Lightweight silver earrings with brushed texture and secure handcrafted hooks.",
        price: "66.00",
        category: "jewelry",
        artisanId: "artisan-8",
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 18,
        createdAt: new Date(),
      },
      {
        id: "product-18",
        name: "Sol Necklace",
        description: "Minimal pendant necklace cast from hand-carved wax and polished by cloth wheel.",
        price: "92.00",
        category: "jewelry",
        artisanId: "artisan-8",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 31,
        createdAt: new Date(),
      },
      {
        id: "product-19",
        name: "Reclaimed Walnut Board",
        description: "Large serving board made from reclaimed walnut with chamfered edge and carrying groove.",
        price: "132.00",
        category: "woodwork",
        artisanId: "artisan-9",
        images: ["https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 24,
        createdAt: new Date(),
      },
      {
        id: "product-20",
        name: "Rio Spice Mill",
        description: "Hand-turned spice mill with ceramic grinder core and smooth matte oil finish.",
        price: "74.00",
        category: "woodwork",
        artisanId: "artisan-9",
        images: ["https://images.unsplash.com/photo-1572410368985-5dcabb8f4f0d?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 17,
        createdAt: new Date(),
      },
      {
        id: "product-21",
        name: "Bar Spoon Pair",
        description: "Long-handled hardwood bar spoons carved and balanced for stirring cocktails.",
        price: "44.00",
        category: "woodwork",
        artisanId: "artisan-9",
        images: ["https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 10,
        createdAt: new Date(),
      },
      {
        id: "product-22",
        name: "Smoked Glass Wall Sconce",
        description: "Hand-blown wall light with smoky finish and warm brass mounting plate.",
        price: "198.00",
        category: "glasswork",
        artisanId: "artisan-10",
        images: ["https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 29,
        createdAt: new Date(),
      },
      {
        id: "product-23",
        name: "Prague Bubble Vase",
        description: "Tall decorative vase featuring trapped-air bubble detail and polished base.",
        price: "164.00",
        category: "glasswork",
        artisanId: "artisan-10",
        images: ["https://images.unsplash.com/photo-1611485988300-b7530d6c2f38?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 18,
        createdAt: new Date(),
      },
      {
        id: "product-24",
        name: "Frosted Stem Glass Set",
        description: "Set of two stem glasses with soft frosted gradient and comfortable grip.",
        price: "88.00",
        category: "glasswork",
        artisanId: "artisan-10",
        images: ["https://images.unsplash.com/photo-1563225409-127c18758bd5?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 12,
        createdAt: new Date(),
      },
      {
        id: "product-25",
        name: "Indus Block Print Kurta",
        description: "Breathable cotton kurta hand-printed with repeat botanical motifs using carved blocks.",
        price: "92.00",
        category: "textiles",
        artisanId: "artisan-11",
        images: ["https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 34,
        createdAt: new Date(),
      },
      {
        id: "product-26",
        name: "Hand-Printed Scarf",
        description: "Soft voile scarf featuring dual-tone block print and hand-rolled edge finishing.",
        price: "58.00",
        category: "textiles",
        artisanId: "artisan-11",
        images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 21,
        createdAt: new Date(),
      },
      {
        id: "product-27",
        name: "Botanical Bedding Set",
        description: "Hand-block printed bedding with natural pigments and pre-washed finish.",
        price: "186.00",
        category: "textiles",
        artisanId: "artisan-11",
        images: ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 25,
        createdAt: new Date(),
      },
      {
        id: "product-28",
        name: "Volcanic Ash Mug",
        description: "Wheel-thrown mug with dark ash glaze and thumb rest handle for balanced grip.",
        price: "39.00",
        category: "ceramics",
        artisanId: "artisan-12",
        images: ["https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 30,
        createdAt: new Date(),
      },
      {
        id: "product-29",
        name: "Andes Serving Bowl",
        description: "Large serving bowl with mineral-rich glaze and hand-burnished interior.",
        price: "86.00",
        category: "ceramics",
        artisanId: "artisan-12",
        images: ["https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 18,
        createdAt: new Date(),
      },
      {
        id: "product-30",
        name: "Stoneware Espresso Set",
        description: "Set of four mini cups fired at high temperature for dense, durable daily use.",
        price: "64.00",
        category: "ceramics",
        artisanId: "artisan-12",
        images: ["https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 11,
        createdAt: new Date(),
      },
      {
        id: "product-31",
        name: "Riverstone Cuff",
        description: "Open cuff bracelet with hand-hammered curve and soft matte polish.",
        price: "96.00",
        category: "jewelry",
        artisanId: "artisan-13",
        images: ["https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 20,
        createdAt: new Date(),
      },
      {
        id: "product-32",
        name: "Pebble Stud Trio",
        description: "Three-pair stud set inspired by natural pebble silhouettes and textures.",
        price: "58.00",
        category: "jewelry",
        artisanId: "artisan-13",
        images: ["https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 14,
        createdAt: new Date(),
      },
      {
        id: "product-33",
        name: "Seoul Line Pendant",
        description: "Minimal pendant necklace with textured bar charm and handmade clasp closure.",
        price: "82.00",
        category: "jewelry",
        artisanId: "artisan-13",
        images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 23,
        createdAt: new Date(),
      },
      {
        id: "product-34",
        name: "Coastal Glaze Pitcher",
        description: "Hand-thrown ceramic pitcher with wave-inspired brush glaze and drip-resistant spout.",
        price: "94.00",
        category: "ceramics",
        artisanId: "artisan-1",
        images: ["https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 21,
        createdAt: new Date(),
      },
      {
        id: "product-35",
        name: "Terracotta Pasta Bowl",
        description: "Wide-rim terracotta bowl finished with food-safe satin glaze for everyday dining.",
        price: "52.00",
        category: "ceramics",
        artisanId: "artisan-1",
        images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 15,
        createdAt: new Date(),
      },
      {
        id: "product-36",
        name: "Festival Shawl",
        description: "Handwoven shawl in vibrant heritage palette with naturally dyed cotton fibers.",
        price: "126.00",
        category: "textiles",
        artisanId: "artisan-2",
        images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.9",
        reviewCount: 26,
        createdAt: new Date(),
      },
      {
        id: "product-37",
        name: "Handloom Cushion Pair",
        description: "Set of two woven cushion covers with reinforced seams and textured front panel.",
        price: "68.00",
        category: "textiles",
        artisanId: "artisan-2",
        images: ["https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.6",
        reviewCount: 14,
        createdAt: new Date(),
      },
      {
        id: "product-38",
        name: "Black Forest Wall Hook Rail",
        description: "Solid wood rail with hand-carved accents and concealed wall mounts.",
        price: "118.00",
        category: "woodwork",
        artisanId: "artisan-3",
        images: ["https://images.unsplash.com/photo-1582582429416-9363e57f1a7b?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.8",
        reviewCount: 19,
        createdAt: new Date(),
      },
      {
        id: "product-39",
        name: "Carved Walnut Pen Stand",
        description: "Desktop organizer carved from walnut with satin oil finish and stable weighted base.",
        price: "58.00",
        category: "woodwork",
        artisanId: "artisan-3",
        images: ["https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=900&h=700"],
        inStock: true,
        featured: false,
        rating: "4.7",
        reviewCount: 12,
        createdAt: new Date(),
      },
    ];

    products.forEach(product => this.products.set(product.id, { ...product, likes: 0 } as Product));

    // Seed stories (3 stories for each Browse Category type)
    const stories = [
      {
        id: "story-1",
        title: "Clay, Salt, and Memory: A Portuguese Pottery Lineage",
        excerpt: "In a small coastal workshop, Maria still mixes sea salt into her glazes the same way her grandmother taught her forty years ago.",
        content: "Maria says the first bowl she ever made was crooked, heavy, and beautiful to her family. Today, every collection begins with that same imperfect bowl sitting on a shelf above her wheel. She believes heritage is not a museum piece, it is a living practice shaped by daily hands and small rituals.",
        category: "Heritage",
        authorId: "artisan-1",
        coverImage: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "story-2",
        title: "Threads of Ceremony in Kutch",
        excerpt: "Rajesh documents motifs used in wedding shawls and revives patterns that were nearly forgotten in his district.",
        content: "Each motif in Rajesh's studio has a name, a season, and a story attached to it. Apprentices spend their first month learning pattern stories before touching the loom. It slows production, but it protects meaning and keeps the language of textiles alive.",
        category: "Heritage",
        authorId: "artisan-2",
        coverImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "story-3",
        title: "Carving the Black Forest Alphabet",
        excerpt: "Elena's grandfather taught her that every chisel mark should read like handwriting, never like machine code.",
        content: "Old furniture rescued from barns became Elena's first classroom. She learned to identify regional carving signatures by touch alone. Today she teaches children to carve initials on scrap wood so they understand that craft can carry identity across generations.",
        category: "Heritage",
        authorId: "artisan-3",
        coverImage: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-4",
        title: "Interview: Maria on Pricing Handmade Work Honestly",
        excerpt: "We asked Maria how she explains the true value of handmade pottery to first-time buyers.",
        content: "Maria's answer is simple: she prices time, not just clay. She includes failed experiments, kiln electricity, and design sketches because those invisible hours are part of each finished object. Her best customers, she says, are the ones who ask questions before asking for discounts.",
        category: "Interview",
        authorId: "artisan-1",
        coverImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        featured: true,
      },
      {
        id: "story-5",
        title: "Interview: Rajesh on Training the Next 20 Weavers",
        excerpt: "Rajesh shares why he redesigned his studio schedule so apprentices can learn while still earning.",
        content: "Traditional training often asks new weavers to work unpaid for long periods. Rajesh changed that model by splitting the day into paid production and guided practice. He says skill grows faster when dignity is protected from day one.",
        category: "Interview",
        authorId: "artisan-2",
        coverImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-6",
        title: "Interview: Elena on Balancing Craft and E-commerce",
        excerpt: "Elena explains the practical systems she uses to keep quality high while shipping globally.",
        content: "She batches photography once a week, packs orders every Tuesday, and leaves one full day for pure making. That rhythm keeps her from turning into a full-time logistics manager. Her advice to new artisans: protect your maker hours on the calendar first.",
        category: "Interview",
        authorId: "artisan-3",
        coverImage: "https://images.unsplash.com/photo-1523419409543-6f1f86a6d165?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-7",
        title: "Technique Notes: Layered Ash Glaze for Warm Ceramic Tones",
        excerpt: "A step-by-step approach to building depth in neutral glazes without losing the hand-thrown texture.",
        content: "This method uses two thin coats and one wiped-back layer to keep edges bright while deepening the bowl interior. Maria recommends documenting kiln positions because shelf placement can change color by an entire shade family.",
        category: "Techniques",
        authorId: "artisan-1",
        coverImage: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a4a?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-8",
        title: "Technique Notes: Strong Selvedges on Handlooms",
        excerpt: "Three practical adjustments that reduce edge curling and improve drape in handwoven scarves.",
        content: "Rajesh teaches students to adjust shuttle speed before changing yarn tension. Most selvedge issues, he says, are rhythm problems not material problems. A metronome in the studio helped beginners stabilize their weaving cadence.",
        category: "Techniques",
        authorId: "artisan-2",
        coverImage: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-9",
        title: "Technique Notes: Oil Finishing for Carved Walnut",
        excerpt: "Elena demonstrates how to bring out grain contrast with a food-safe finish for everyday objects.",
        content: "The process starts with sanding progression and ends with two patient buffing passes. Elena avoids thick topcoats on utility pieces because she wants wood to age and record use naturally. A finish, in her words, should protect without silencing texture.",
        category: "Techniques",
        authorId: "artisan-3",
        coverImage: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-10",
        title: "Community Event: Weekend Makers Market in Porto",
        excerpt: "Families, tourists, and local chefs gathered to meet artisans and buy directly from studio tables.",
        content: "The Porto market sold out of small tableware before noon, but the bigger win was conversation. Visitors spent time asking about firing temperatures and regional clays, which gave makers a chance to teach as well as sell.",
        category: "Events",
        authorId: null,
        coverImage: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-11",
        title: "Community Event: Open Loom Day for Students",
        excerpt: "Over 120 students visited Rajesh's weaving center and tried hands-on loom exercises in rotating groups.",
        content: "Teachers reported that students stayed longer at the loom stations than expected because they could immediately feel progress in pattern building. The team plans to publish a free starter workbook based on this event's exercises.",
        category: "Events",
        authorId: null,
        coverImage: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000),
        featured: false,
      },
      {
        id: "story-12",
        title: "Community Event: Winter Craft Circle and Repair Clinic",
        excerpt: "Artisans hosted a repair-first event where people brought worn objects and learned how to restore them.",
        content: "From cracked handles to loose joints, each item became a mini workshop. The event reduced waste and reminded visitors that craftsmanship includes maintenance, not just making new products.",
        category: "Events",
        authorId: null,
        coverImage: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&h=800",
        publishDate: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000),
        featured: false,
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
      images: normalizeStringArray(insertProduct.images),
      inStock: insertProduct.inStock !== undefined ? insertProduct.inStock : true,
      featured: insertProduct.featured !== undefined ? insertProduct.featured : false,
      rating: insertProduct.rating || "0",
      reviewCount: insertProduct.reviewCount || 0,
      likes: 0
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

  async likeProduct(id: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { 
      ...product, 
      likes: (product.likes || 0) + 1 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async unlikeProduct(id: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { 
      ...product, 
      likes: Math.max(0, (product.likes || 0) - 1) 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async getPopularProducts(limit: number = 4): Promise<Product[]> {
    return Array.from(this.products.values())
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, limit);
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
    // Check if this product already exists in the session cart
    const existing = Array.from(this.cartItems.values()).find(
      (item) => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existing) {
      const updated = { ...existing, quantity: existing.quantity + (insertItem.quantity || 1) };
      this.cartItems.set(existing.id, updated);
      return updated;
    }

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
      generatedCaptions: normalizeStringArray(insertGeneration.generatedCaptions)
    };
    this.aiGenerations.set(id, generation);
    return generation;
  }

  async getArtisanGenerations(artisanId: string): Promise<AiGeneration[]> {
    return Array.from(this.aiGenerations.values())
      .filter(gen => gen.artisanId === artisanId);
  }

  // Review methods
  async getReviewsForProduct(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter(review => review.productId === productId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);

    // Update product rating and review count
    const product = this.products.get(review.productId);
    if (product) {
      const productReviews = Array.from(this.reviews.values())
        .filter(r => r.productId === review.productId);
      
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = (totalRating / productReviews.length).toFixed(1);
      
      this.products.set(review.productId, {
        ...product,
        rating: avgRating,
        reviewCount: productReviews.length,
      });
    }

    return review;
  }
}

export const storage = new MemStorage();

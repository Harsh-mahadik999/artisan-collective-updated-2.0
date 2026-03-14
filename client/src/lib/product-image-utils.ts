type ProductLike = {
  id?: string;
  category?: string;
  images?: string[];
};

const CATEGORY_IMAGE_POOL: Record<string, string[]> = {
  ceramics: [
    "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=1200&h=900",
  ],
  textiles: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1616627456767-8c82f6b6fe7a?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=1200&h=900",
  ],
  jewelry: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&w=1200&h=900",
  ],
  woodwork: [
    "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1200&h=900",
  ],
  glasswork: [
    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a4a?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1611485988300-b7530d6c2f38?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1563225409-127c18758bd5?auto=format&fit=crop&w=1200&h=900",
  ],
  default: [
    "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&h=900",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&h=900",
  ],
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCategoryFallbackImage(category?: string, seed = "", variant = 0): string {
  const key = category && CATEGORY_IMAGE_POOL[category] ? category : "default";
  const pool = CATEGORY_IMAGE_POOL[key];
  const idx = (hashString(seed || key) + variant) % pool.length;
  return pool[idx];
}

export function getProductImage(product: ProductLike, variant = 0): string {
  const primary = product.images?.find((img) => typeof img === "string" && img.trim().length > 0);
  if (primary) return primary;
  return getCategoryFallbackImage(product.category, product.id || product.category || "product", variant);
}

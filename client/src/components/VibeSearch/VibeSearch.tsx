import { useState } from "react";
import "./VibeSearch.css";

interface Product {
  id: number;
  name: string;
  artisan: string;
  price: number;
  emoji: string;
  vibes: string[];
  bg: string;
  score?: number;
}

const PRODUCTS: Product[] = [
  { id: 1,  name: "Wabi-Sabi Tea Bowl",        artisan: "Keiko Tanaka",    price: 68, emoji: "🍵",  vibes: ["wabi-sabi","earthy","minimal","handcrafted","japanese","zen","organic","muted"],           bg: "#F1EFE8" },
  { id: 2,  name: "Hammered Copper Pendant",    artisan: "Ravi Mehta",      price: 42, emoji: "🔶",  vibes: ["rustic","warm","metallic","boho","earthy","artisan","vintage","bold"],                     bg: "#FAEEDA" },
  { id: 3,  name: "Indigo Block-Print Scarf",   artisan: "Priya Nair",      price: 55, emoji: "🧣",  vibes: ["indigo","block-print","traditional","bold","geometric","vibrant","artisan","maximalist"],  bg: "#E6F1FB" },
  { id: 4,  name: "Birch Wood Serving Board",   artisan: "Lars Eriksen",    price: 85, emoji: "🪵",  vibes: ["scandinavian","minimal","natural","nordic","clean","functional","light","japandi"],        bg: "#EAF3DE" },
  { id: 5,  name: "Terracotta Planter Set",     artisan: "Sofia Gomez",     price: 38, emoji: "🏺",  vibes: ["terracotta","earthy","mediterranean","rustic","organic","warm","handcrafted","boho"],      bg: "#FAECE7" },
  { id: 6,  name: "Hand-dyed Linen Napkins",    artisan: "Amara Diallo",    price: 29, emoji: "🍃",  vibes: ["linen","neutral","minimal","scandinavian","japandi","soft","organic","sustainable"],       bg: "#E1F5EE" },
  { id: 7,  name: "Brass Bell Wind Chime",      artisan: "Chen Wei",        price: 47, emoji: "🔔",  vibes: ["bohemian","warm","metallic","spiritual","earthy","artisan","vintage","maximalist"],        bg: "#FAEEDA" },
  { id: 8,  name: "Batik Throw Pillow",         artisan: "Ibu Sari",        price: 52, emoji: "🛋️", vibes: ["batik","vibrant","maximalist","traditional","colorful","bold","artisan","tropical"],       bg: "#FBEAF0" },
  { id: 9,  name: "Slate Cheese Board",         artisan: "Owen Davies",     price: 62, emoji: "🧀",  vibes: ["slate","minimal","rustic","dark","moody","nordic","earthy","functional"],                  bg: "#F1EFE8" },
  { id: 10, name: "Embroidered Wall Hanging",   artisan: "Fatima Al-Rashid",price: 78, emoji: "🖼️", vibes: ["maximalist","colorful","boho","artisan","vibrant","traditional","bold","decorative"],      bg: "#EEEDFE" },
  { id: 11, name: "Matte Black Ceramic Mug",    artisan: "Jung-ah Kim",     price: 34, emoji: "☕",  vibes: ["minimal","dark","modern","sleek","japandi","matte","clean","functional"],                  bg: "#2C2C2A" },
  { id: 12, name: "Rattan Market Basket",       artisan: "Nguyen Lan",      price: 44, emoji: "🧺",  vibes: ["rattan","natural","coastal","boho","organic","earthy","woven","sustainable"],              bg: "#FAEEDA" },
];

const QUICK_VIBES = [
  "rustic & earthy", "minimalist Japandi", "bold maximalist",
  "coastal boho", "dark moody", "vibrant traditional",
];

export default function VibeSearch(): JSX.Element {
  const [query, setQuery]     = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [results, setResults]   = useState<Product[]>([]);
  const [sortBy, setSortBy]     = useState<string>("relevance");
  const [searched, setSearched] = useState<boolean>(false);

  const runSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setSearched(false);
    setResults([]);
    setKeywords([]);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a semantic vibe matching engine for an artisan marketplace.

User query: "${q}"

Product catalog (each with id and vibes array):
${JSON.stringify(PRODUCTS.map(p => ({ id: p.id, name: p.name, vibes: p.vibes })))}

Task:
1. Extract 3-5 core aesthetic keywords from the user query.
2. Score each product 0-100 based on how well its vibes match the query aesthetic. Be nuanced — partial matches still get decent scores. Only exclude products that truly clash.
3. Return ONLY valid JSON, no markdown, no explanation:
{"keywords":["kw1","kw2"],"scores":{"1":85,"2":60}}`,
          }],
        }),
      });

      const data = await response.json();
      const text = (data.content as { type: string; text?: string }[])
        .map(i => i.text || "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());

      setKeywords(parsed.keywords || []);

      const scored: Product[] = PRODUCTS
        .map(p => ({ ...p, score: parsed.scores?.[String(p.id)] || 0 }))
        .filter(p => (p.score ?? 0) >= 20)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      setResults(scored);
    } catch (err) {
      console.error("Vibe search failed:", err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getSorted = (): Product[] => {
    const r = [...results];
    if (sortBy === "price_asc")  return r.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") return r.sort((a, b) => b.price - a.price);
    return r;
  };

  return (
    <div className="vibe-search">
      <div className="search-bar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && runSearch()}
          placeholder="e.g. rustic earthy tones, minimalist Japandi, bold maximalist..."
          className="search-input"
        />
        <button onClick={() => runSearch()} disabled={loading} className="search-btn">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="quick-pills">
        {QUICK_VIBES.map(v => (
          <button key={v} className="pill" onClick={() => { setQuery(v); runSearch(v); }}>
            {v}
          </button>
        ))}
      </div>

      {keywords.length > 0 && (
        <div className="vibe-chips">
          <span className="chips-label">Vibes detected:</span>
          {keywords.map(k => <span key={k} className="chip">{k}</span>)}
        </div>
      )}

      {searched && results.length > 0 && (
        <>
          <div className="results-header">
            <span className="results-count">{results.length} matches</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
              <option value="relevance">Sort: relevance</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </select>
          </div>

          <div className="results-grid">
            {getSorted().map(p => (
              <div key={p.id} className="product-card">
                <div className="card-img" style={{ background: p.bg }}>{p.emoji}</div>
                <div className="card-body">
                  <div className="card-name">{p.name}</div>
                  <div className="card-meta">by {p.artisan} · ${p.price}</div>
                  <div className="card-tags">
                    {p.vibes.slice(0, 3).map(v => <span key={v} className="tag">{v}</span>)}
                  </div>
                  <div className="card-score">Vibe match: {p.score}%</div>
                  <div className="score-bar">
                    <div className="score-fill" style={{ width: `${p.score}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {searched && results.length === 0 && !loading && (
        <p className="empty">No strong matches found — try a different vibe.</p>
      )}

      {!searched && !loading && (
        <p className="hint">Describe an aesthetic, mood, or feeling to discover the right artisan pieces.</p>
      )}
    </div>
  );
}
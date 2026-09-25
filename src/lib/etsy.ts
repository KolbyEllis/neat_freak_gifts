import seedListings from "@/data/seed-listings.json";
import {
  categorizeTitle,
  Product,
  ProductState,
} from "@/lib/products";

/** Refresh catalog from Etsy once per day. */
export const CATALOG_REVALIDATE_SECONDS = 60 * 60 * 24;

type SeedListing = {
  id: string;
  title: string;
  url: string;
  image: string;
  price: number;
  currency: string;
  state: ProductState;
  description?: string;
};

type EtsyListing = {
  listing_id: number;
  title: string;
  url: string;
  description?: string;
  price?: { amount: number; divisor: number; currency_code: string };
  state: string;
  images?: { url_570xN?: string; url_794xN?: string }[];
};

export type CatalogSource = "etsy" | "rss" | "seed";

function mapSeed(listings: SeedListing[]): Product[] {
  return listings.map((item) => ({
    ...item,
    description: item.description || "",
    category: categorizeTitle(item.title),
  }));
}

function mapEtsyListing(item: EtsyListing): Product | null {
  const state =
    item.state === "sold_out"
      ? "sold_out"
      : item.state === "active"
        ? "active"
        : null;
  if (!state) return null;

  const amount = item.price?.amount ?? 0;
  const divisor = item.price?.divisor || 100;
  const image =
    item.images?.[0]?.url_794xN ||
    item.images?.[0]?.url_570xN ||
    "";

  return {
    id: String(item.listing_id),
    title: item.title,
    url: item.url || `https://www.etsy.com/listing/${item.listing_id}`,
    image,
    price: amount / divisor,
    currency: item.price?.currency_code || "USD",
    state,
    category: categorizeTitle(item.title),
    description: (item.description || "").trim(),
  };
}

function decodeXml(value: string) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function sortProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    if (a.state !== b.state) return a.state === "active" ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

async function fetchEtsyState(
  state: "active" | "sold_out",
): Promise<Product[]> {
  const apiKey = process.env.ETSY_API_KEY;
  const shopId = process.env.ETSY_SHOP_ID || "30419831";
  if (!apiKey) return [];

  const products: Product[] = [];
  let offset = 0;
  const limit = 100;

  while (offset < 400) {
    const url = new URL(
      `https://openapi.etsy.com/v3/application/shops/${shopId}/listings`,
    );
    url.searchParams.set("state", state);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("offset", String(offset));
    url.searchParams.set("includes", "Images");

    const res = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    });

    if (!res.ok) {
      throw new Error(
        `Etsy API error (${res.status}) while fetching ${state} listings`,
      );
    }

    const data = (await res.json()) as {
      count?: number;
      results?: EtsyListing[];
    };
    const batch = (data.results || [])
      .map(mapEtsyListing)
      .filter((item): item is Product => Boolean(item));
    products.push(...batch);

    if (!data.results?.length || batch.length < limit) break;
    offset += limit;
  }

  return products;
}

async function fetchFromEtsyApi(): Promise<Product[]> {
  if (!process.env.ETSY_API_KEY) return [];

  const [active, soldOut] = await Promise.all([
    fetchEtsyState("active"),
    fetchEtsyState("sold_out"),
  ]);

  const byId = new Map<string, Product>();
  for (const item of [...active, ...soldOut]) {
    byId.set(item.id, item);
  }

  return sortProducts([...byId.values()]);
}

/**
 * Public shop RSS (no API key). Only recent listings, but enough to
 * refresh titles/prices/images and pick up brand-new items daily.
 */
async function fetchFromEtsyRss(): Promise<Product[]> {
  const shopName = process.env.ETSY_SHOP_NAME || "NeatFreakGifts";
  const res = await fetch(`https://www.etsy.com/shop/${shopName}/rss`, {
    next: { revalidate: CATALOG_REVALIDATE_SECONDS },
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });

  if (!res.ok) {
    throw new Error(`Etsy RSS error (${res.status})`);
  }

  const xml = await res.text();
  const products: Product[] = [];

  for (const match of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = match[1];
    const rawTitle = block.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "";
    const rawLink = block.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "";
    const rawDescription =
      block.match(/<description>([\s\S]*?)<\/description>/)?.[1] || "";

    const link = decodeXml(rawLink).split("?")[0];
    const idMatch = link.match(/\/listing\/(\d+)/);
    if (!idMatch) continue;

    const descriptionHtml = decodeXml(rawDescription);
    const image =
      descriptionHtml.match(/<img[^>]+src="([^"]+)"/i)?.[1]?.replace(
        /il_[^.]+\./,
        "il_794xN.",
      ) || "";
    const priceMatch = descriptionHtml.match(
      /class="price">\s*([0-9]+(?:\.[0-9]+)?)\s*([A-Z]{3})/i,
    );
    const descriptionText = (
      descriptionHtml.match(/class="description">([\s\S]*?)<\/p>/i)?.[1] || ""
    )
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim();

    let title = decodeXml(rawTitle)
      .replace(/\s+by\s+NeatFreakGifts\s*$/i, "")
      .trim();

    products.push({
      id: idMatch[1],
      title,
      url: link,
      image,
      price: priceMatch ? Number(priceMatch[1]) : 0,
      currency: priceMatch?.[2] || "USD",
      state: "active",
      category: categorizeTitle(title),
      description: descriptionText,
    });
  }

  return products;
}

function mergeCatalog(base: Product[], updates: Product[]): Product[] {
  const byId = new Map<string, Product>();
  for (const item of base) byId.set(item.id, item);
  for (const item of updates) {
    const existing = byId.get(item.id);
    byId.set(item.id, {
      ...existing,
      ...item,
      // Prefer a real image/price/description from either side
      image: item.image || existing?.image || "",
      price: item.price || existing?.price || 0,
      description:
        (item.description?.length || 0) >= (existing?.description?.length || 0)
          ? item.description || existing?.description || ""
          : existing?.description || "",
      state: existing?.state === "sold_out" ? existing.state : item.state,
    });
  }
  return sortProducts([...byId.values()]);
}

export async function getProducts(): Promise<{
  products: Product[];
  source: CatalogSource;
}> {
  const seed = mapSeed(seedListings as SeedListing[]);

  try {
    const apiProducts = await fetchFromEtsyApi();
    if (apiProducts.length > 0) {
      return { products: apiProducts, source: "etsy" };
    }
  } catch (error) {
    console.error("Etsy API sync failed:", error);
  }

  try {
    const rssProducts = await fetchFromEtsyRss();
    if (rssProducts.length > 0) {
      return {
        products: mergeCatalog(seed, rssProducts),
        source: "rss",
      };
    }
  } catch (error) {
    console.error("Etsy RSS sync failed:", error);
  }

  return { products: seed, source: "seed" };
}

export async function getProductById(id: string): Promise<Product | null> {
  const { products } = await getProducts();
  return products.find((item) => item.id === id) ?? null;
}

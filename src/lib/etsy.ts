import seedListings from "@/data/seed-listings.json";
import {
  categorizeTitle,
  Product,
  ProductState,
} from "@/lib/products";

type SeedListing = {
  id: string;
  title: string;
  url: string;
  image: string;
  price: number;
  currency: string;
  state: ProductState;
};

type EtsyListing = {
  listing_id: number;
  title: string;
  url: string;
  price?: { amount: number; divisor: number; currency_code: string };
  state: string;
  images?: { url_570xN?: string; url_794xN?: string }[];
};

function mapSeed(listings: SeedListing[]): Product[] {
  return listings.map((item) => ({
    ...item,
    category: categorizeTitle(item.title),
  }));
}

function mapEtsyListing(item: EtsyListing): Product | null {
  const state = item.state === "sold_out" ? "sold_out" : item.state === "active" ? "active" : null;
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
  };
}

async function fetchEtsyState(state: "active" | "sold_out"): Promise<Product[]> {
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
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Etsy API error (${res.status}) while fetching ${state} listings`);
    }

    const data = (await res.json()) as { count?: number; results?: EtsyListing[] };
    const batch = (data.results || [])
      .map(mapEtsyListing)
      .filter((item): item is Product => Boolean(item));
    products.push(...batch);

    if (!data.results?.length || batch.length < limit) break;
    offset += limit;
  }

  return products;
}

export async function getProducts(): Promise<{
  products: Product[];
  source: "etsy" | "seed";
}> {
  try {
    if (process.env.ETSY_API_KEY) {
      const [active, soldOut] = await Promise.all([
        fetchEtsyState("active"),
        fetchEtsyState("sold_out"),
      ]);

      const byId = new Map<string, Product>();
      for (const item of [...active, ...soldOut]) {
        byId.set(item.id, item);
      }

      const products = [...byId.values()].sort((a, b) => {
        if (a.state !== b.state) return a.state === "active" ? -1 : 1;
        return a.title.localeCompare(b.title);
      });

      if (products.length > 0) {
        return { products, source: "etsy" };
      }
    }
  } catch (error) {
    console.error(error);
  }

  return {
    products: mapSeed(seedListings as SeedListing[]),
    source: "seed",
  };
}

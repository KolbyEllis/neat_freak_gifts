export type ProductState = "active" | "sold_out";

export type Product = {
  id: string;
  title: string;
  url: string;
  image: string;
  price: number;
  currency: string;
  state: ProductState;
  category: ProductCategory;
};

export type ProductCategory =
  | "all"
  | "books"
  | "candy"
  | "blind-date"
  | "seasonal"
  | "unique";

export const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: "all", label: "All gifts" },
  { id: "books", label: "Books by color" },
  { id: "candy", label: "Candy" },
  { id: "blind-date", label: "Blind date with a book" },
  { id: "seasonal", label: "Seasonal & festive" },
  { id: "unique", label: "Unique finds" },
];

export function categorizeTitle(title: string): ProductCategory {
  const t = title.toLowerCase();
  if (t.includes("blind date") || (t.includes("book advent") && t.includes("blind"))) {
    return "blind-date";
  }
  if (t.includes("candy") || t.includes("sour")) return "candy";
  if (
    t.includes("books by color") ||
    t.includes("books by the") ||
    t.includes("decorative books") ||
    t.includes("hardback books") ||
    t.includes("pounds of books")
  ) {
    return "books";
  }
  if (
    t.includes("christmas") ||
    t.includes("halloween") ||
    t.includes("santa") ||
    t.includes("advent") ||
    t.includes("graduation") ||
    t.includes("birthday") ||
    t.includes("tooth fairy")
  ) {
    return "seasonal";
  }
  return "unique";
}

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
}

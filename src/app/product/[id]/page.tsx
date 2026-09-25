import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getProductById, getProducts } from "@/lib/etsy";
import {
  categoryLabel,
  formatPrice,
} from "@/lib/products";

export const revalidate = 86400;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const { products } = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Gift not found | Neat Freak Gifts" };

  const summary = product.description
    ? product.description.replace(/\s+/g, " ").slice(0, 160)
    : `Shop ${product.title} from Neat Freak Gifts — ${formatPrice(product.price, product.currency)}.`;

  return {
    title: `${product.title} | Neat Freak Gifts`,
    description: summary,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const soldOut = product.state === "sold_out";

  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-frost shadow-[0_10px_0_rgba(139,30,63,0.14)]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              className={`object-cover ${soldOut ? "grayscale opacity-70" : ""}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : null}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-paper ${
              soldOut ? "bg-ink" : "bg-evergreen"
            }`}
          >
            {soldOut ? "Sold out" : "Available"}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href="/#shop"
            className="text-sm font-bold text-berry hover:underline"
          >
            ← Back to shop
          </Link>
          <p className="mt-4 text-sm font-extrabold uppercase tracking-wide text-candy">
            {categoryLabel(product.category)}
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-4 text-2xl font-extrabold text-berry">
            {formatPrice(product.price, product.currency)}
          </p>

          {product.description ? (
            <div className="mt-6 max-w-xl whitespace-pre-line text-base leading-relaxed text-ink/80">
              {product.description}
            </div>
          ) : (
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/75">
              A handpicked gift from Neat Freak Gifts. Add it to your cart, then
              review everything together before you check out.
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <AddToCartButton
              product={product}
              className="key-press-lg px-6 py-3 text-base"
            />
            <Link
              href="/cart"
              className="key-press key-press-lg key-press-frost rounded-full border-2 border-berry/20 bg-white px-6 py-3 text-sm font-extrabold text-berry hover:border-berry hover:bg-frost"
            >
              View cart
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

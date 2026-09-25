"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  formatPrice,
  Product,
  ProductCategory,
} from "@/lib/products";

type Props = {
  products: Product[];
  source: "etsy" | "seed";
};

export function Storefront({ products, source }: Props) {
  const [category, setCategory] = useState<ProductCategory>("all");

  const filtered = useMemo(() => {
    if (category === "all") return products;
    return products.filter((item) => item.category === category);
  }, [category, products]);

  const availableCount = products.filter((p) => p.state === "active").length;
  const soldOutCount = products.filter((p) => p.state === "sold_out").length;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=2000&q=80"
            alt="Bright festive gift wrapping and celebration"
            fill
            priority
            className="hero-zoom object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-berry-deep/90 via-berry/70 to-evergreen/45" />
          <div className="festive-dots absolute inset-0 opacity-70" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-10 sm:px-10 sm:pb-24">
          <p className="animate-confetti font-[family-name:var(--font-display)] text-5xl font-semibold tracking-tight text-paper sm:text-7xl md:text-8xl">
            Neat Freak Gifts
          </p>
          <h1 className="animate-rise-delay mt-4 max-w-2xl font-[family-name:var(--font-display)] text-2xl font-medium leading-snug text-gold sm:text-4xl">
            One stop shop for personal, unique gifts!
          </h1>
          <p className="animate-rise-delay mt-4 max-w-xl text-base leading-relaxed text-frost sm:text-lg">
            We&apos;re crazy about gifting — books by color, candy by color, blind
            date with a book, and festive surprises for everyone on your list.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#shop"
              className="rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink shadow-[0_8px_0_#c58a00] transition hover:-translate-y-0.5"
            >
              Shop the fun
            </a>
            <a
              href="https://www.etsy.com/shop/NeatFreakGifts"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border-2 border-paper/70 px-6 py-3 text-sm font-extrabold text-paper transition hover:bg-paper/10"
            >
              Visit our Etsy shop
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-berry/10 bg-frost/50 px-6 py-10 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          {[
            {
              title: "Books by color",
              copy: "Housewarming-ready rainbow shelves and styled hardbacks.",
            },
            {
              title: "Candy by color",
              copy: "Sweet boxes that look as good as they taste.",
            },
            {
              title: "Blind date with a book",
              copy: "Wrapped surprises — including Christmas editions!",
            },
          ].map((item) => (
            <div key={item.title} className="border-l-4 border-candy pl-4">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-berry">
                {item.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
              The shop
            </h2>
            <p className="mt-2 text-sm text-ink/70">
              {availableCount} available
              {soldOutCount ? ` · ${soldOutCount} sold out` : ""} · synced from
              Etsy ({source === "etsy" ? "live" : "catalog snapshot"})
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-berry text-paper"
                    : "bg-frost text-ink hover:bg-candy/20"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const soldOut = product.state === "sold_out";
            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-berry/10 bg-white shadow-[0_10px_0_rgba(139,30,63,0.08)]"
              >
                <div className="relative aspect-[4/3] bg-frost">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className={`object-cover ${soldOut ? "grayscale opacity-70" : ""}`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : null}
                  {soldOut ? (
                    <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-paper">
                      Sold out
                    </span>
                  ) : (
                    <span className="absolute left-3 top-3 rounded-full bg-evergreen px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-paper">
                      Available
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-2 font-[family-name:var(--font-display)] text-lg font-semibold leading-snug">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-base font-extrabold text-berry">
                    {formatPrice(product.price, product.currency)}
                  </p>
                  {soldOut ? (
                    <p className="mt-4 text-sm font-semibold text-ink/55">
                      This listing is sold out on Etsy.
                    </p>
                  ) : (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-full bg-candy px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-gold"
                    >
                      Buy on Etsy
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-berry px-6 py-16 text-paper sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold sm:text-4xl">
            Why we started this shop
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-frost sm:text-lg">
            There are so many gift ideas out there that it can feel overwhelming.
            So we collected the good ones — festive, personal, and unique — and
            put them all in one joyful place. After 5+ years and hundreds of happy
            Etsy customers, this website is the next chapter.
          </p>
        </div>
      </section>

      <footer className="border-t border-berry/10 px-6 py-8 text-sm text-ink/65 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Neat Freak Gifts</p>
          <a
            href="https://www.etsy.com/shop/NeatFreakGifts"
            target="_blank"
            rel="noreferrer"
            className="font-bold text-berry hover:underline"
          >
            etsy.com/shop/NeatFreakGifts
          </a>
        </div>
      </footer>
    </main>
  );
}

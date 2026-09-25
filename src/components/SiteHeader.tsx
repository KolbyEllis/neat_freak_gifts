"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { itemCount, ready } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-berry/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:px-10">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-berry transition hover:text-berry-deep"
        >
          Neat Freak Gifts
        </Link>
        <nav className="flex items-center gap-4 text-sm font-bold">
          <Link href="/#shop" className="text-ink/70 transition hover:text-berry">
            Shop
          </Link>
          <Link
            href="/cart"
            className="relative key-press key-press-sm key-press-berry inline-flex items-center gap-2 rounded-full bg-berry px-4 py-2 text-paper hover:bg-berry-deep"
          >
            Cart
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 text-xs font-extrabold text-ink">
              {ready ? itemCount : 0}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

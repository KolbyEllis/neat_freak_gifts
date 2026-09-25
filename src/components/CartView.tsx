"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, productPath } from "@/lib/products";

export function CartView() {
  const { items, subtotal, setQuantity, removeItem, clear, ready } = useCart();

  if (!ready) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <p className="text-ink/60">Loading cart…</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
          Your cart
        </h1>
        <p className="mt-4 text-ink/70">Your cart is empty — time to find a gift.</p>
        <Link
          href="/#shop"
          className="key-press key-press-lg key-press-gold mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink"
        >
          Browse the shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
          Your cart
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-bold text-ink/55 underline-offset-2 hover:text-berry hover:underline"
        >
          Clear cart
        </button>
      </div>

      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="key-press key-press-card flex flex-col gap-4 rounded-2xl border border-berry/10 bg-white p-4 sm:flex-row sm:items-center"
          >
            <Link
              href={productPath(item.id)}
              className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-frost sm:h-24 sm:w-24"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : null}
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                href={productPath(item.id)}
                className="font-[family-name:var(--font-display)] text-lg font-semibold leading-snug hover:text-berry"
              >
                {item.title}
              </Link>
              <p className="mt-1 font-extrabold text-berry">
                {formatPrice(item.price, item.currency)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${item.title}`}
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                className="key-press key-press-sm key-press-frost flex h-10 w-10 items-center justify-center rounded-xl bg-frost text-lg font-extrabold"
              >
                −
              </button>
              <span className="min-w-8 text-center font-extrabold">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${item.title}`}
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                className="key-press key-press-sm key-press-frost flex h-10 w-10 items-center justify-center rounded-xl bg-frost text-lg font-extrabold"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="ml-2 text-sm font-bold text-ink/55 hover:text-berry"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 rounded-2xl border border-berry/10 bg-frost/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-bold">Subtotal</p>
          <p className="text-2xl font-extrabold text-berry">
            {formatPrice(subtotal)}
          </p>
        </div>
        <p className="mt-2 text-sm text-ink/65">
          Shipping and tax calculated when you place your order.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/checkout"
            className="key-press key-press-lg key-press-berry rounded-full bg-berry px-6 py-3 text-sm font-extrabold text-paper hover:bg-berry-deep"
          >
            Checkout
          </Link>
          <Link
            href="/#shop"
            className="key-press key-press-lg key-press-frost rounded-full border-2 border-berry/20 bg-white px-6 py-3 text-sm font-extrabold text-berry hover:border-berry"
          >
            Keep shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

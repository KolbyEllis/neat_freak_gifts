"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export function CheckoutView() {
  const { items, subtotal, clear, ready } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");

  const lineCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  if (!ready) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <p className="text-ink/60">Loading checkout…</p>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
          Order received!
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink/75">
          Thanks{name ? `, ${name}` : ""}. We saved your order{" "}
          <span className="font-extrabold text-berry">{orderId}</span> and will
          follow up at{" "}
          <span className="font-extrabold">{email}</span> to confirm payment
          and shipping.
        </p>
        <Link
          href="/#shop"
          className="key-press key-press-lg key-press-gold mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink"
        >
          Back to the shop
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 sm:px-10">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
          Checkout
        </h1>
        <p className="mt-4 text-ink/70">Your cart is empty.</p>
        <Link
          href="/#shop"
          className="key-press key-press-lg key-press-gold mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-extrabold text-ink"
        >
          Browse the shop
        </Link>
      </main>
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const id = `NFG-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id,
      name: name.trim(),
      email: email.trim(),
      note: note.trim(),
      items,
      subtotal,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        window.localStorage.getItem("neat-freak-orders-v1") || "[]",
      ) as unknown[];
      window.localStorage.setItem(
        "neat-freak-orders-v1",
        JSON.stringify([order, ...existing].slice(0, 20)),
      );
    } catch {
      // ignore storage errors
    }

    clear();
    setOrderId(id);
    setSubmitted(true);
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.1fr_0.9fr]">
      <section>
        <Link href="/cart" className="text-sm font-bold text-berry hover:underline">
          ← Back to cart
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold text-berry">
          Checkout
        </h1>
        <p className="mt-2 text-sm text-ink/65">
          Tell us where to reach you and we&apos;ll confirm your gift order.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-berry/15 bg-white px-4 py-3 font-semibold outline-none ring-berry/30 focus:ring-2"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-berry/15 bg-white px-4 py-3 font-semibold outline-none ring-berry/30 focus:ring-2"
              placeholder="you@email.com"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-extrabold">
              Order note{" "}
              <span className="font-semibold text-ink/45">(optional)</span>
            </span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              className="w-full resize-y rounded-2xl border border-berry/15 bg-white px-4 py-3 font-semibold outline-none ring-berry/30 focus:ring-2"
              placeholder="Gift message, shipping notes, color preferences…"
            />
          </label>

          <button
            type="submit"
            className="key-press key-press-lg key-press-berry rounded-full bg-berry px-6 py-3 text-sm font-extrabold text-paper hover:bg-berry-deep"
          >
            Place order
          </button>
        </form>
      </section>

      <aside className="h-fit rounded-3xl border border-berry/10 bg-frost/70 p-6 shadow-[0_10px_0_rgba(139,30,63,0.1)]">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-berry">
          Order summary
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          {lineCount} item{lineCount === 1 ? "" : "s"}
        </p>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="line-clamp-2 font-bold leading-snug">{item.title}</p>
                <p className="mt-1 text-sm text-ink/60">Qty {item.quantity}</p>
              </div>
              <p className="shrink-0 font-extrabold text-berry">
                {formatPrice(item.price * item.quantity, item.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-berry/10 pt-4">
          <p className="font-bold">Subtotal</p>
          <p className="text-xl font-extrabold text-berry">
            {formatPrice(subtotal)}
          </p>
        </div>
      </aside>
    </main>
  );
}

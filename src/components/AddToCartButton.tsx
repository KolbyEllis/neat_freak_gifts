"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

type Props = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className = "" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.state === "sold_out";

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (soldOut) return;
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
      className={`key-press key-press-sm inline-flex rounded-full px-4 py-2 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50 ${
        added
          ? "key-press-berry bg-evergreen text-paper"
          : "key-press-candy bg-candy text-ink hover:bg-gold"
      } ${className}`}
    >
      {soldOut ? "Sold out" : added ? "Added!" : "Add to cart"}
    </button>
  );
}

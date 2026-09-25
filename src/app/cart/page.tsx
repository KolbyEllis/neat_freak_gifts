import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Your cart | Neat Freak Gifts",
  description: "Review the gifts in your Neat Freak Gifts cart.",
};

export default function CartPage() {
  return <CartView />;
}

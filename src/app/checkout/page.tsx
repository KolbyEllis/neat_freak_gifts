import type { Metadata } from "next";
import { CheckoutView } from "@/components/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Neat Freak Gifts",
  description: "Place your Neat Freak Gifts order.",
};

export default function CheckoutPage() {
  return <CheckoutView />;
}

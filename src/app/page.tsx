import { Storefront } from "@/components/Storefront";
import { getProducts } from "@/lib/etsy";

/** Refresh the storefront from Etsy once per day. */
export const revalidate = 86400;

export default async function Home() {
  const { products, source } = await getProducts();
  return <Storefront products={products} source={source} />;
}

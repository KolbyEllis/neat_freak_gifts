import { Storefront } from "@/components/Storefront";
import { getProducts } from "@/lib/etsy";

export const revalidate = 3600;

export default async function Home() {
  const { products, source } = await getProducts();
  return <Storefront products={products} source={source} />;
}

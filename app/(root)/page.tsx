import ProductList from "@/components/products/product-list";
import { getLatesProducts } from "@/actions/product-actions";
import { LATEST_PRODUCTS_LIMIT } from "@/lib/constants";

export const metadata = {
  title: 'Welcome'
}

export default async function HomePage() {
  const products = await getLatesProducts()
  return (
    <>
      {/* @ts-expect-error I know why this will error*/}
      <ProductList data={products} title="Newest Arrivals" limit={LATEST_PRODUCTS_LIMIT} />
    </>
  );
}

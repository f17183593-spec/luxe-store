import { getLocale } from "next-intl/server";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY } from "@/lib/sanity.queries";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { ProductCardData } from "@/types/product";

export default async function ProductsPage() {
  const locale = await getLocale();

  const products = await sanityFetch<ProductCardData[]>(PRODUCTS_QUERY);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-normal tracking-wide text-zinc-900 dark:text-zinc-50">
          Our Collection
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Discover our curated luxury pieces.
        </p>
      </div>

      <ProductGrid products={products ?? []} locale={locale} />
    </main>
  );
}
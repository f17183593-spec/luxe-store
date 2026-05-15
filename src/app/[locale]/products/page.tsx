import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductFilters } from "@/components/product/ProductFilters";
import { sanityFetch } from "@/lib/sanity";
import { buildProductsQuery } from "@/lib/sanity.queries";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductCardData } from "@/types/product";

function ProductGridFallback() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function ProductGridWrapper({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const locale = await getLocale();
  const params = await searchParams;
  const filters = {
    category: params.category,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    sort: params.sort,
  };

  const query = buildProductsQuery(filters);
  const products = await sanityFetch<ProductCardData[]>(
    query,
    {},
    { next: { revalidate: 300 } },
  );

  return <ProductGrid products={products ?? []} locale={locale} />;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const locale = await getLocale();
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <span className="font-sans text-xs tracking-[0.25em] uppercase text-luxe-charcoal/40">
          The Collection
        </span>
        <h1 className="font-display mt-3 text-3xl font-normal tracking-wide text-luxe-charcoal sm:text-4xl lg:text-5xl">
          {params.category ? `${params.category}` : "All Pieces"}
        </h1>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <ProductFilters
            currentCategory={params.category}
            currentSort={params.sort}
            currentMinPrice={params.minPrice}
            currentMaxPrice={params.maxPrice}
          />
        </aside>
        <div className="flex-1">
          <Suspense fallback={<ProductGridFallback />}>
            <ProductGridWrapper searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

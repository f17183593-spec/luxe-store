import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCT_QUERY } from "@/lib/sanity.queries";
import { Button } from "@/components/ui/Button";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const locale = await getLocale();

  const product = await sanityFetch<any>(PRODUCT_QUERY, { slug });

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        <div className="aspect-square w-full rounded-xl bg-zinc-100 dark:bg-zinc-900" />
        
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <h1 className="font-display text-3xl font-normal tracking-wide text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              {product.name}
            </h1>
            <p className="text-2xl text-zinc-900 dark:text-zinc-50">
              ${product.price}
            </p>
            <p className="text-base text-zinc-500 dark:text-zinc-400">
              {product.description}
            </p>
          </div>

          <div className="mt-8">
            <Button variant="gold" size="lg" className="w-full sm:w-auto">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
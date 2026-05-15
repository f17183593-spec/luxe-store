import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Skeleton } from "@/components/ui/Skeleton";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCT_QUERY, PRODUCT_SLUGS_QUERY } from "@/lib/sanity.queries";
import type { PageProps, ProductSlugParams } from "@/types/common";

interface SanityProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  material: string;
  tags: string[];
  featured: boolean;
}

function ProductDetailFallback() {
  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-8 w-32" />
      </div>
    </div>
  );
}

async function ProductContent({ slug }: { slug: string }) {
  const locale = await getLocale();
  const product = await sanityFetch<SanityProduct>(
    PRODUCT_QUERY,
    { slug },
    { next: { revalidate: 60 } },
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="grid gap-12 md:grid-cols-2">
      <div className="space-y-4">
        {product.images?.length > 0 ? (
          product.images.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt={`${product.title} — view ${i + 1}`}
              className="w-full rounded-2xl object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ))
        ) : (
          <div className="flex aspect-[4/5] items-center justify-center rounded-2xl bg-luxe-silver/20">
            <span className="text-xs text-luxe-charcoal/30">
              No image available
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center md:sticky md:top-28 md:self-start">
        <GlassPanel variant="light">
          <span className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/40">
            {product.category}
          </span>

          <h1 className="font-display mt-3 text-3xl font-normal tracking-wide text-luxe-charcoal sm:text-4xl">
            {product.title}
          </h1>

          <p className="mt-6 leading-relaxed text-luxe-charcoal/60">
            {product.description}
          </p>

          <p className="font-display mt-8 text-3xl text-luxe-gold">
            ${(product.price / 100).toLocaleString()}
          </p>

          {product.material && (
            <p className="mt-4 text-sm text-luxe-charcoal/40">
              Crafted from{" "}
              <span className="text-luxe-charcoal/70">
                {product.material}
              </span>
            </p>
          )}

          {product.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full bg-luxe-silver/20 px-3 py-1 text-[10px] tracking-wider uppercase text-luxe-charcoal/50"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-10 flex gap-4">
            <AddToCartButton
              productId={product._id}
              slug={slug}
              title={product.title}
              price={product.price}
              image={product.images?.[0] ?? ""}
              category={product.category}
              size="lg"
            />
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(PRODUCT_SLUGS_QUERY);
  if (!slugs) return [];
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function ProductDetailPage({
  params,
}: PageProps<ProductSlugParams>) {
  const { slug } = await params;

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Suspense fallback={<ProductDetailFallback />}>
        <ProductContent slug={slug} />
      </Suspense>
    </div>
  );
}

import { GlassPanel } from "@/components/ui/GlassPanel";
import { prisma } from "@/lib/prisma";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY } from "@/lib/sanity.queries";
import type { ProductCardData } from "@/types/product";

export default async function AdminOverviewPage() {
  const [orderCount, productCount] = await Promise.all([
    prisma.order.count(),
    sanityFetch<ProductCardData[]>(PRODUCTS_QUERY, {}, { next: { revalidate: 300 } }).then(
      (products) => products?.length ?? 0,
    ),
  ]);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-normal tracking-wide text-luxe-charcoal">
        Dashboard Overview
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <GlassPanel variant="light" className="space-y-2">
          <p className="text-xs tracking-[0.15em] uppercase text-luxe-charcoal/40">
            Total Orders
          </p>
          <p className="font-display text-4xl text-luxe-charcoal">{orderCount}</p>
        </GlassPanel>
        <GlassPanel variant="light" className="space-y-2">
          <p className="text-xs tracking-[0.15em] uppercase text-luxe-charcoal/40">
            Products
          </p>
          <p className="font-display text-4xl text-luxe-charcoal">{productCount}</p>
        </GlassPanel>
      </div>
    </div>
  );
}

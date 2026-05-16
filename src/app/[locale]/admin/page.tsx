import { GlassPanel } from "@/components/ui/GlassPanel";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY } from "@/lib/sanity.queries";
import type { ProductCardData } from "@/types/product";

export default async function AdminDashboard() {
  const products = await sanityFetch<ProductCardData[]>(PRODUCTS_QUERY);
  const productCount = products?.length ?? 0;
  const orderCount = 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-normal tracking-wide text-zinc-900 dark:text-zinc-50">
          Dashboard Overview
        </h1>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <GlassPanel className="p-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Products</p>
          <p className="mt-2 font-display text-3xl font-normal text-zinc-900 dark:text-zinc-50">
            {productCount}
          </p>
        </GlassPanel>

        <GlassPanel className="p-6">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Orders</p>
          <p className="mt-2 font-display text-3xl font-normal text-zinc-900 dark:text-zinc-50">
            {orderCount}
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}
import { GlassPanel } from "@/components/ui/GlassPanel";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY } from "@/lib/sanity.queries";
import type { ProductCardData } from "@/types/product";

export default async function AdminProductsPage() {
  const products = await sanityFetch<ProductCardData[]>(PRODUCTS_QUERY);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-normal tracking-wide text-zinc-900 dark:text-zinc-50">
          Products
        </h1>
      </div>
      
      <GlassPanel variant="dark" className="overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-500 dark:text-zinc-400">
            <thead className="bg-zinc-50 text-xs uppercase text-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
              <tr>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {products?.map((product: any) => (
                <tr key={product._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">
                    {product.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    ${product.price}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  );
}
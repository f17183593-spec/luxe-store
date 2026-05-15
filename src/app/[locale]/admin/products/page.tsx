import { GlassPanel } from "@/components/ui/GlassPanel";
import { sanityFetch } from "@/lib/sanity";
import { PRODUCTS_QUERY } from "@/lib/sanity.queries";
import type { ProductCardData } from "@/types/product";

export default async function AdminProductsPage() {
  const products = await sanityFetch<ProductCardData[]>(
    PRODUCTS_QUERY,
    {},
    { next: { revalidate: 300 } },
  );

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-normal tracking-wide text-luxe-charcoal">
        Products
      </h1>
      <GlassPanel variant="dark" className="overflow-x-auto p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs tracking-[0.15em] uppercase text-white/30">
              <th className="px-6 pb-3 pt-4 font-normal">Image</th>
              <th className="px-6 pb-3 pt-4 font-normal">Title</th>
              <th className="px-6 pb-3 pt-4 font-normal">Category</th>
              <th className="px-6 pb-3 pt-4 text-right font-normal">Price</th>
            </tr>
          </thead>
          <tbody className="px-6">
            {!products || products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-white/30">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.slug}
                  className="border-b border-white/5 text-sm last:border-0"
                >
                  <td className="py-3">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-white/5" />
                    )}
                  </td>
                  <td className="py-3 text-white/80">{product.title}</td>
                  <td className="py-3 text-white/40">{product.category}</td>
                  <td className="py-3 text-right text-white/80">
                    {new Intl.NumberFormat("en", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price / 100)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Jewelry",
  "Watches",
  "Handbags",
  "Accessories",
  "Apparel",
] as const;

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
] as const;

interface ProductFiltersProps {
  currentCategory?: string;
  currentSort?: string;
  currentMinPrice?: string;
  currentMaxPrice?: string;
}

export function ProductFilters({
  currentCategory,
  currentSort = "newest",
  currentMinPrice,
  currentMaxPrice,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  }

  return (
    <GlassPanel variant="light" className="sticky top-28 space-y-6 p-6">
      <div className="space-y-3">
        <p className="text-xs tracking-[0.15em] uppercase text-luxe-charcoal/40">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active =
              cat === "All"
                ? !currentCategory || currentCategory === "All"
                : currentCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => updateParam("category", cat === "All" ? "" : cat)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs tracking-[0.1em] transition-all",
                  active
                    ? "bg-luxe-black text-white"
                    : "bg-luxe-charcoal/5 text-luxe-charcoal/60 hover:bg-luxe-charcoal/10",
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs tracking-[0.15em] uppercase text-luxe-charcoal/40">
          Price Range
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={currentMinPrice ?? ""}
            onBlur={(e) => updateParam("minPrice", e.target.value)}
            className="w-full rounded-lg border border-luxe-charcoal/10 bg-transparent px-3 py-2 text-xs text-luxe-charcoal placeholder:text-luxe-charcoal/30 focus:border-luxe-gold focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={currentMaxPrice ?? ""}
            onBlur={(e) => updateParam("maxPrice", e.target.value)}
            className="w-full rounded-lg border border-luxe-charcoal/10 bg-transparent px-3 py-2 text-xs text-luxe-charcoal placeholder:text-luxe-charcoal/30 focus:border-luxe-gold focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs tracking-[0.15em] uppercase text-luxe-charcoal/40">
          Sort By
        </p>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-lg border border-luxe-charcoal/10 bg-transparent px-3 py-2 text-xs text-luxe-charcoal focus:border-luxe-gold focus:outline-none"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </GlassPanel>
  );
}

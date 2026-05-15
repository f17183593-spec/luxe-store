"use client";

import { motion } from "motion/react";
import { Link } from "@/navigation";
import { formatPrice, cn } from "@/lib/utils";
import type { ProductCardData } from "@/types/product";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface ProductGridProps {
  products: ProductCardData[];
  locale: string;
}

export function ProductGrid({ products, locale }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="font-display text-xl text-luxe-charcoal/30">
          No products found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <motion.div
          key={product.slug ?? i}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: 0.5,
            delay: i * 0.05,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <Link
            href={`/products/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-luxe-silver/20">
              <img
                src={product.image ?? ""}
                alt={product.title}
                className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                loading={i < 4 ? "eager" : "lazy"}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-luxe-black/0 transition-colors duration-500 group-hover:bg-luxe-black/10" />
            </div>

            <div className="mt-4 space-y-1 px-1">
              <p className="text-[10px] tracking-[0.2em] uppercase text-luxe-charcoal/40">
                {product.category}
              </p>
              <h3 className="font-display text-base text-luxe-charcoal sm:text-lg">
                {product.title}
              </h3>
              <p className="font-sans text-sm text-luxe-gold">
                {formatPrice(product.price, "USD", locale)}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

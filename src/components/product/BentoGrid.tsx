"use client";

import { motion } from "motion/react";
import { Link } from "@/navigation";
import { formatPrice } from "@/lib/utils";
import type { ProductCardData } from "@/types/product";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  products: ProductCardData[];
  locale: string;
}

function BentoCard({
  product,
  index,
  locale,
}: {
  product: ProductCardData;
  index: number;
  locale: string;
}) {
  const isHero = index === 0;
  const isWide = index === 1 || index === 3;
  const isTall = index === 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-luxe-charcoal",
        isHero && "bento-full md:bento-wide md:bento-tall",
        isWide && "bento-wide",
        isTall && "md:bento-tall",
      )}
    >
      <Link href={`/products/${product.slug}`} className="block h-full w-full">
        <div className="relative h-full w-full">
          <img
            src={product.image ?? ""}
            alt={product.title}
            className={cn(
              "h-full w-full object-cover transition-all duration-700 group-hover:scale-105",
            )}
            sizes={
              isHero
                ? "(max-width: 768px) 100vw, 50vw"
                : isWide
                  ? "(max-width: 768px) 100vw, 50vw"
                  : "(max-width: 768px) 100vw, 25vw"
            }
            loading={index < 2 ? "eager" : "lazy"}
          />

          <div className="absolute inset-0 hero-gradient opacity-60 transition-opacity duration-500 group-hover:opacity-80" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
            <div className="glass inline-block rounded-full px-3 py-1 text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 backdrop-blur-md">
              {product.category}
            </div>
            <h3 className="font-display text-lg text-white sm:text-xl lg:text-2xl">
              {product.title}
            </h3>
            <p className="mt-1 font-sans text-sm text-luxe-gold sm:text-base">
              {formatPrice(product.price, "USD", locale)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <div className="bento-full flex min-h-[400px] items-center justify-center rounded-2xl border border-dashed border-luxe-silver/40 bg-luxe-cream">
      <div className="text-center">
        <p className="font-display text-2xl text-luxe-charcoal/30">
          Collection Coming Soon
        </p>
        <p className="mt-2 text-sm text-luxe-charcoal/20">
          Our featured pieces are being curated.
        </p>
      </div>
    </div>
  );
}

export function BentoGrid({ products, locale }: BentoGridProps) {
  if (!products || products.length === 0) {
    return <EmptyState />;
  }

  const displayProducts = products.slice(0, 7);

  return (
    <section>
      <div className="bento">
        {displayProducts.map((product, i) => (
          <BentoCard
            key={product.slug ?? i}
            product={product}
            index={i}
            locale={locale}
          />
        ))}
      </div>
    </section>
  );
}

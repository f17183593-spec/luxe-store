import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import { HeroSection } from "@/components/product/HeroSection";
import { BentoGrid } from "@/components/product/BentoGrid";
import { sanityFetch } from "@/lib/sanity";
import { HOME_PAGE_QUERY } from "@/lib/sanity.queries";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductCardData } from "@/types/product";

interface HomeData {
  hero?: {
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaLink: string;
    backgroundImage: string;
    backgroundAlt: string;
  } | null;
  featured?: ProductCardData[] | null;
}

function BentoFallback() {
  return (
    <div className="bento">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "aspect-[4/5] rounded-2xl",
            i === 0 && "md:col-span-2 md:row-span-2",
            (i === 1 || i === 3) && "md:col-span-2"
          )}
        />
      ))}
    </div>
  );
}

async function HeroSectionWrapper() {
  const data = await sanityFetch<any>(
    `*[_type == "hero"][0] {
      title, subtitle, ctaLabel, ctaLink,
      "backgroundImage": backgroundImage.asset->url,
      "backgroundAlt": backgroundImage.alt
    }`
  );

  if (!data) {
    return <HeroSection />;
  }

  return (
    <HeroSection
      title={data.title || ""}
      subtitle={data.subtitle || ""}
      backgroundImage={data.backgroundImage || ""}
      backgroundAlt={data.backgroundAlt || ""}
      ctaLabel={data.ctaLabel || ""}
      ctaLink={data.ctaLink || ""}
    />
  );
}

async function BentoGridWrapper() {
  const locale = await getLocale();
  const data = await sanityFetch<HomeData>(HOME_PAGE_QUERY);

  return (
    <BentoGrid
      products={data?.featured ?? []}
      locale={locale}
    />
  );
}

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HeroSectionWrapper />
      </Suspense>

      <section className="mx-auto max-w-screen-2xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mb-12 text-center">
          <span className="font-sans text-xs tracking-[0.25em] uppercase text-luxe-charcoal/40">
            Curated for You
          </span>
          <h2 className="font-display mt-3 text-3xl font-normal tracking-wide text-luxe-charcoal sm:text-4xl lg:text-5xl">
            Featured Pieces
          </h2>
        </div>

        <Suspense fallback={<BentoFallback />}>
          <BentoGridWrapper />
        </Suspense>
      </section>
    </>
  );
}
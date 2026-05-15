"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const DECORATIVE_ORBS = [
  {
    className: "w-72 h-72 bg-luxe-gold/10 blur-3xl top-[-10%] right-[-5%] animate-float",
  },
  {
    className: "w-96 h-96 bg-luxe-gold/5 blur-3xl bottom-[-20%] left-[-10%] animate-float-slow",
  },
];

const DEFAULT_BG = "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1920&q=80";

export function HeroSection({
  title = "Timeless Elegance",
  subtitle = "Discover our curated collection of luxury essentials, crafted for those who appreciate the extraordinary.",
  backgroundImage,
  backgroundAlt = "Luxury lifestyle background",
  ctaLabel = "Explore Collection",
  ctaLink = "/products",
}: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {DECORATIVE_ORBS.map((orb, i) => (
        <div key={i} className={cn("pointer-events-none absolute", orb.className)} />
      ))}

      <div className="absolute inset-0">
        <img
          src={backgroundImage ?? DEFAULT_BG}
          alt={backgroundAlt}
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-luxe-black/10"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="glass inline-block rounded-full px-5 py-2 text-xs tracking-[0.25em] uppercase text-luxe-silver/80 mb-8">
              New Season
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl font-normal leading-tight tracking-wide text-white sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button variant="gold" size="lg" className="animate-glow">
              {ctaLabel}
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              Watch Film
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase text-white/40">Scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}

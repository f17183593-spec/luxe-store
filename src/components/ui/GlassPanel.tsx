"use client";

import type { ReactNode, ElementType } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type GlassVariant = "light" | "dark" | "gold";

interface GlassPanelProps {
  children: ReactNode;
  variant?: GlassVariant;
  className?: string;
  as?: ElementType;
  animate?: boolean;
  delay?: number;
}

const variantStyles: Record<GlassVariant, string> = {
  light: "glass",
  dark: "glass-dark",
  gold: "glass-gold",
};

export function GlassPanel({
  children,
  variant = "light",
  className,
  as: Tag = "div",
  animate = true,
  delay = 0,
}: GlassPanelProps) {
  if (!animate) {
    return (
      <Tag className={cn("rounded-2xl p-8", variantStyles[variant], className)}>
        {children}
      </Tag>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn("rounded-2xl p-8", variantStyles[variant], className)}
    >
      {children}
    </motion.div>
  );
}

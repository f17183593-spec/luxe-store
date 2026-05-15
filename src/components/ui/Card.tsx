"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: "lift" | "glow" | "none";
}

export function Card({ children, className, hover = "lift" }: CardProps) {
  return (
    <motion.div
      whileHover={
        hover === "lift"
          ? { y: -6, transition: { duration: 0.3 } }
          : hover === "glow"
            ? { boxShadow: "0 0 30px rgba(201, 168, 76, 0.15)" }
            : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-500",
        hover !== "none" && "cursor-pointer",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

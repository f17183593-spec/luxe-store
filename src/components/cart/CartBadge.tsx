"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface CartBadgeProps {
  className?: string;
}

export function CartBadge({ className }: CartBadgeProps) {
  const items = useCartStore((s) => s.items);
  const openDrawer = useCartStore((s) => s.toggleDrawer);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={openDrawer}
      className={cn("relative transition-colors hover:text-luxe-black", className)}
      aria-label={`Cart with ${count} items`}
    >
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 400 }}
            className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-luxe-gold px-1 text-[9px] font-bold text-luxe-black"
          >
            {count > 99 ? "99+" : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

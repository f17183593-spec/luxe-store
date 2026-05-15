"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  productId,
  slug,
  title,
  price,
  image,
  category,
  className,
  size = "md",
}: AddToCartButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.toggleDrawer);

  const handleClick = useCallback(() => {
    addItem({ productId, slug, title, price, image, category });
    setShowFeedback(true);
    const timer = setTimeout(() => setShowFeedback(false), 1200);
    return () => clearTimeout(timer);
  }, [addItem, productId, slug, title, price, image, category]);

  const sizeStyles = {
    sm: "px-5 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
  };

  return (
    <div className="relative inline-flex">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center rounded-full font-sans tracking-[0.15em] uppercase transition-all duration-300",
          "bg-luxe-black text-white hover:bg-luxe-charcoal",
          sizeStyles[size],
          className,
        )}
      >
        Add to Cart
      </motion.button>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ type: "spring", damping: 15, stiffness: 400 }}
            className="absolute -top-2 right-0 z-10"
          >
            <span className="whitespace-nowrap rounded-full bg-luxe-gold px-3 py-1 text-[10px] font-sans tracking-wider text-luxe-black shadow-lg">
              Added to cart
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedback && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openDrawer}
            className="ml-2 inline-flex h-full items-center justify-center rounded-full bg-luxe-gold/10 px-3 text-xs tracking-wider text-luxe-gold transition-colors hover:bg-luxe-gold/20"
          >
            View
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

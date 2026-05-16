"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

// هنا دمجنا الأنيميشن مع خواص الزرار وحلينا مشكلة الـ TypeScript تماماً
type MotionButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrag"> &
  HTMLMotionProps<"button"> & {
    variant?: "default" | "outline" | "ghost" | "link" | "gold";
    size?: "default" | "sm" | "lg" | "icon";
    loading?: boolean;
  };

const variantStyles = {
  default: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
  outline: "border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-50",
  ghost: "hover:bg-zinc-100 text-zinc-900 dark:hover:bg-zinc-900 dark:text-zinc-50",
  link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
  gold: "bg-[#D4AF37] text-black hover:bg-[#AA7C11] font-semibold shadow-lg shadow-[#D4AF37]/20",
};

const sizeStyles = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export const Button = React.forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ className, variant = "default", size = "default", loading, disabled, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-300",
          variantStyles[variant],
          sizeStyles[size],
          loading && "cursor-wait",
          className
        )}
        {...(props as any)}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
export default Button;
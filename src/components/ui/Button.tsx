"use client";

import type { ReactNode, ButtonHTMLAttributes } from "react";
import { forwardRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-luxe-black text-white hover:bg-luxe-charcoal disabled:opacity-40",
  outline:
    "border border-luxe-black/20 text-luxe-black hover:bg-luxe-black/5",
  ghost: "text-luxe-charcoal/60 hover:text-luxe-black",
  gold:
    "bg-luxe-gold text-luxe-black hover:bg-luxe-gold-light disabled:opacity-40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-5 py-2 text-xs",
  md: "px-8 py-3 text-sm",
  lg: "px-12 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className,
      loading,
      disabled,
      ...props
    },
    ref,
  ) => {
    // @ts-ignore
    return (
    <motion.button
      ref={ref}
        whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-full font-sans tracking-[0.15em] uppercase transition-all duration-300",
          variantStyles[variant],
          sizeStyles[size],
          loading && "cursor-wait",
          className,
        )}
        {...(props as any)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{children}</span>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  },
);

Button.displayName = "Button";

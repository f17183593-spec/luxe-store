"use client";

import { useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

const DRAWER_WIDTH = 420;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants = {
  hidden: { x: DRAWER_WIDTH, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },
  exit: {
    x: DRAWER_WIDTH,
    opacity: 0,
    transition: { type: "spring", damping: 30, stiffness: 300 },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: any;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex gap-4 rounded-2xl glass p-3"
    >
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-luxe-silver/20">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-luxe-black">
              {item.title}
            </p>
            {item.category && (
              <p className="text-[10px] tracking-wider uppercase text-luxe-charcoal/40">
                {item.category}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="flex-shrink-0 text-luxe-charcoal/30 hover:text-red-400 transition-colors"
            aria-label={`Remove ${item.title}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-luxe-charcoal/20 text-xs text-luxe-charcoal/60 hover:bg-luxe-charcoal/5 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </motion.button>
            <span className="w-6 text-center text-sm font-medium text-luxe-charcoal/80">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-luxe-charcoal/20 text-xs text-luxe-charcoal/60 hover:bg-luxe-charcoal/5 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </motion.button>
          </div>
          <p className="font-display text-sm text-luxe-gold">
            ${((item.price * item.quantity) / 100).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = useCallback(() => {
    closeDrawer();
    window.location.href = "/en/checkout";
  }, [closeDrawer]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeDrawer]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-luxe-black/40 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          <motion.aside
            key="cart-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 z-50 flex h-full flex-col border-l border-luxe-silver/20 bg-luxe-cream"
            style={{ width: DRAWER_WIDTH, maxWidth: "100vw" }}
          >
            <div className="glass-dark flex items-center justify-between px-6 py-5">
              <h2 className="font-display text-xl tracking-wide text-white">
                Cart{" "}
                <span className="text-sm font-sans text-luxe-silver/50">
                  ({items.length})
                </span>
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={closeDrawer}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
                aria-label="Close cart"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center pt-20 text-center"
                  >
                    <div className="mb-4 h-14 w-14 rounded-full bg-luxe-silver/30 flex items-center justify-center">
                      <svg
                        className="h-7 w-7 text-luxe-charcoal/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                        />
                      </svg>
                    </div>
                    <p className="font-display text-base text-luxe-charcoal/40">
                      Your cart is empty
                    </p>
                    <p className="mt-1 text-xs text-luxe-charcoal/30">
                      Add items to get started.
                    </p>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <CartItemRow
                      key={item.productId}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="glass-dark border-t border-white/5 px-6 py-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Subtotal</span>
                  <span className="font-display text-lg text-white">
                    ${(total / 100).toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-white/30 tracking-wider">
                  Shipping calculated at checkout
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-luxe-gold py-3 text-sm tracking-widest uppercase text-luxe-black transition-colors hover:bg-luxe-gold-light font-sans"
                >
                  Checkout
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

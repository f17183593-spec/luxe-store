"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-luxe-silver/40 px-6 py-20 text-center">
      <div className="mb-6 h-16 w-16 rounded-full bg-luxe-silver/20 flex items-center justify-center">
        <svg
          className="h-8 w-8 text-luxe-charcoal/30"
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
      <p className="font-display text-xl text-luxe-charcoal/40">
        Your cart is empty
      </p>
      <p className="mt-2 text-sm text-luxe-charcoal/30">
        Discover our collection of luxury essentials.
      </p>
      <div className="mt-8">
        <a href="/products">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full bg-luxe-black px-8 py-3 text-sm tracking-[0.15em] uppercase text-white transition-colors hover:bg-luxe-charcoal font-sans"
          >
            Continue Shopping
          </motion.button>
        </a>
      </div>
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: ReturnType<ReturnType<typeof useCartStore>["items"]>[number];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-6 border-b border-luxe-silver/20 pb-6"
    >
      <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-luxe-silver/20">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <h3 className="font-display text-lg text-luxe-charcoal">
              {item.title}
            </h3>
            {item.category && (
              <p className="mt-0.5 text-[10px] tracking-wider uppercase text-luxe-charcoal/40">
                {item.category}
              </p>
            )}
          </div>
          <button
            onClick={() => onRemove(item.productId)}
            className="text-luxe-charcoal/30 hover:text-red-400 transition-colors"
            aria-label={`Remove ${item.title}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-luxe-charcoal/20 text-sm text-luxe-charcoal/60 hover:bg-luxe-charcoal/5 transition-colors"
            >
              -
            </motion.button>
            <span className="w-8 text-center font-sans text-base text-luxe-charcoal/80">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-luxe-charcoal/20 text-sm text-luxe-charcoal/60 hover:bg-luxe-charcoal/5 transition-colors"
            >
              +
            </motion.button>
          </div>
          <p className="font-display text-xl text-luxe-gold">
            ${((item.price * item.quantity) / 100).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <h1 className="font-display text-3xl font-normal tracking-wide text-luxe-charcoal sm:text-4xl">
          Cart
        </h1>
        {items.length > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearCart}
            className="text-xs tracking-wider text-luxe-charcoal/40 hover:text-red-400 transition-colors uppercase"
          >
            Clear all
          </motion.button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {items.length === 0 ? (
          <EmptyCart key="empty" />
        ) : (
          <div key="cart-items" className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-2xl bg-luxe-cream p-6 sm:p-8">
                <h3 className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/50 mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm text-luxe-charcoal/60">
                      <span className="truncate max-w-[180px]">
                        {item.title} × {item.quantity}
                      </span>
                      <span>${((item.price * item.quantity) / 100).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-luxe-silver/30 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-luxe-charcoal/40">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between font-display text-xl text-luxe-charcoal">
                    <span>Total</span>
                    <span>${(total / 100).toLocaleString()}</span>
                  </div>
                </div>

                <a href="/checkout">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6 w-full rounded-full bg-luxe-gold py-3 text-sm tracking-[0.15em] uppercase text-luxe-black transition-colors hover:bg-luxe-gold-light font-sans"
                  >
                    Checkout
                  </motion.button>
                </a>

                <a href="/products">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-3 w-full rounded-full border border-luxe-black/10 py-3 text-xs tracking-[0.15em] uppercase text-luxe-charcoal/50 transition-colors hover:bg-luxe-black/5 font-sans"
                  >
                    Continue Shopping
                  </motion.button>
                </a>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

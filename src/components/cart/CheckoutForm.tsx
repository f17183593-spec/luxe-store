"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "motion/react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  required?: boolean;
}

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required,
}: FieldProps) {
  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/50">
        {label}
        {required && <span className="ml-1 text-luxe-gold">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "mt-2 w-full rounded-xl border bg-transparent px-4 py-3 text-sm outline-none transition-colors",
          error
            ? "border-red-300 focus:border-red-400"
            : "border-luxe-silver/30 focus:border-luxe-gold",
        )}
      />
      {error && (
        <p className="mt-1 text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Invalid email";
  if (!data.firstName) errors.firstName = "Required";
  if (!data.lastName) errors.lastName = "Required";
  if (!data.address) errors.address = "Required";
  if (!data.city) errors.city = "Required";
  if (!data.postalCode) errors.postalCode = "Required";
  return errors;
}

export function CheckoutForm() {
  const items = useCartStore((s) => s.items);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "US",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = useCallback(
    (key: keyof FormData) => (value: string) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: undefined }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (items.length === 0) {
        setError("Your cart is empty");
        return;
      }

      setLoading(true);

      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            customerEmail: form.email,
          }),
        });

        const data = (await res.json()) as { url?: string; error?: string };

        if (!res.ok || !data.url) {
          throw new Error(data.error ?? "Failed to create checkout session");
        }

        window.location.href = data.url;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong",
        );
        setLoading(false);
      }
    },
    [form, items],
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-luxe-silver/40 px-6 py-16 text-center">
        <p className="font-display text-lg text-luxe-charcoal/40">
          Your cart is empty
        </p>
        <a
          href="/products"
          className="mt-4 text-sm text-luxe-gold hover:underline"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6 rounded-2xl border border-luxe-silver/30 p-6 sm:p-8">
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={updateField("email")}
          error={errors.email}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First Name"
            placeholder="John"
            value={form.firstName}
            onChange={updateField("firstName")}
            error={errors.firstName}
            required
          />
          <Field
            label="Last Name"
            placeholder="Doe"
            value={form.lastName}
            onChange={updateField("lastName")}
            error={errors.lastName}
            required
          />
        </div>

        <Field
          label="Address"
          placeholder="123 Luxury Lane"
          value={form.address}
          onChange={updateField("address")}
          error={errors.address}
          required
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="City"
            placeholder="New York"
            value={form.city}
            onChange={updateField("city")}
            error={errors.city}
            required
          />
          <Field
            label="Postal Code"
            placeholder="10001"
            value={form.postalCode}
            onChange={updateField("postalCode")}
            error={errors.postalCode}
            required
          />
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-luxe-charcoal/50">
              Country
            </label>
            <select
              value={form.country}
              onChange={(e) => updateField("country")(e.target.value)}
              className="mt-2 w-full rounded-xl border border-luxe-silver/30 bg-transparent px-4 py-3 text-sm outline-none transition-colors focus:border-luxe-gold"
            >
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IT">Italy</option>
              <option value="ES">Spain</option>
              <option value="JP">Japan</option>
              <option value="AE">UAE</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-luxe-black px-12 py-4 text-sm tracking-[0.15em] uppercase text-white transition-all hover:bg-luxe-charcoal disabled:opacity-40 font-sans"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Processing…
          </span>
        ) : (
          "Pay with Card"
        )}
      </motion.button>

      <p className="text-[10px] text-luxe-charcoal/30 tracking-wider">
        You will be redirected to Stripe Checkout to complete your purchase
        securely.
      </p>
    </form>
  );
}

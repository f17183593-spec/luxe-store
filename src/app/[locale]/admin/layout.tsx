import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/GlassPanel";
import type { ReactNode } from "react";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Orders", href: "/admin/orders" },
  { label: "Products", href: "/admin/products" },
] as const;

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  if (session.user.role !== "admin") {
    redirect(`/${locale}`);
  }

  return (
    <div className="mx-auto flex max-w-screen-2xl gap-8 px-6 py-8">
      <GlassPanel as="aside" variant="dark" className="flex h-fit w-64 shrink-0 flex-col gap-1 p-4">
        <div className="mb-4 px-3 font-display text-lg tracking-[0.15em] text-luxe-gold">
          Admin
        </div>
        {adminNav.map((item) => (
          <a
            key={item.href}
            href={`/${locale}${item.href}`}
            className="rounded-lg px-3 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </GlassPanel>
      <main className="flex-1">{children}</main>
    </div>
  );
}

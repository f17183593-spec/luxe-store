import { GlassPanel } from "@/components/ui/GlassPanel";
import { prisma } from "@/lib/prisma";

interface OrderRowProps {
  id: string;
  email: string;
  status: string;
  total: number;
  currency: string;
  createdAt: Date;
}

function OrderRow({ id, email, status, total, currency, createdAt }: OrderRowProps) {
  const statusColors: Record<string, string> = {
    pending: "text-yellow-500",
    paid: "text-green-500",
    shipped: "text-blue-500",
    delivered: "text-luxe-gold",
    cancelled: "text-red-500",
  };

  return (
    <tr className="border-b border-white/5 text-sm last:border-0">
      <td className="py-3 text-white/40">{id.slice(0, 8)}…</td>
      <td className="py-3 text-white/80">{email}</td>
      <td className={`py-3 capitalize ${statusColors[status] ?? "text-white/40"}`}>
        {status}
      </td>
      <td className="py-3 text-right text-white/80">
        {new Intl.NumberFormat("en", { style: "currency", currency }).format(total / 100)}
      </td>
      <td className="py-3 text-right text-white/40">
        {createdAt.toLocaleDateString()}
      </td>
    </tr>
  );
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-normal tracking-wide text-luxe-charcoal">
        Orders
      </h1>
      <GlassPanel variant="dark" className="overflow-x-auto p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs tracking-[0.15em] uppercase text-white/30">
              <th className="px-6 pb-3 pt-4 font-normal">ID</th>
              <th className="px-6 pb-3 pt-4 font-normal">Customer</th>
              <th className="px-6 pb-3 pt-4 font-normal">Status</th>
              <th className="px-6 pb-3 pt-4 text-right font-normal">Total</th>
              <th className="px-6 pb-3 pt-4 text-right font-normal">Date</th>
            </tr>
          </thead>
          <tbody className="px-6">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-white/30">
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order.id}
                  id={order.id}
                  email={order.user.email}
                  status={order.status}
                  total={order.total}
                  currency={order.currency}
                  createdAt={order.createdAt}
                />
              ))
            )}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
}

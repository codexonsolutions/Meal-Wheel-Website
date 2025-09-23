"use client";
import { useAdmin } from "@/store/admin-store";
import type { Order } from "@/types";

export default function OrdersView() {
  const { orders, setOrderStatus } = useAdmin();
  const statuses: Order["status"][] = ["pending", "preparing", "delivering", "completed", "cancelled"];

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>No orders yet.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} className="rounded-xl border shadow-sm p-4" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-lg">Order #{o.id.slice(-6)}</div>
                <div className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <select
                value={o.status}
                onChange={(e) => setOrderStatus(o.id, e.target.value as Order["status"])}
                className="px-3 py-2 rounded-md border bg-transparent"
                style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {o.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.name} × {it.qty}
                  </span>
                  <span>Rs. {(it.qty * it.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 border-t pt-3 flex justify-between font-medium" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
              <span>Total</span>
              <span>Rs. {o.total.toFixed(2)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

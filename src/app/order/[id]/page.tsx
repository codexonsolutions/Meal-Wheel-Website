"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Circle, Clock, Truck, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

type ApiOrderItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  category: string;
  customizations?: {
    group: string;
    options: { name: string; price: number }[];
  }[];
};

type ApiOrder = {
  _id: string;
  restaurant?: {
    restaurantId?: string;
    name: string;
    imageUrl?: string;
  };
  restaurants?: { restaurantId?: string; name: string; imageUrl?: string }[];
  customer?: { fullName: string; email: string; phone: string };
  deliveryAddress?: {
    street: string;
    city: string;
    postal: string;
    notes?: string;
  };
  items: ApiOrderItem[];
  subtotal: number;
  gstTotal: number;
  deliveryFee: number;
  total: number;
  status:
    | "pending"
    | "preparing"
    | "out-for-delivery"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
};

const STATUS_STEPS = [
  { key: "pending", label: "Received", icon: Clock },
  { key: "preparing", label: "Preparing", icon: Circle },
  { key: "out-for-delivery", label: "On the way", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Check },
] as const;

type StatusKey = (typeof STATUS_STEPS)[number]["key"];

function prettyDate(iso?: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

function currency(n?: number) {
  const v = typeof n === "number" ? n : 0;
  return `Rs. ${v.toFixed(2)}`;
}

function StatusBadge({ status }: { status: ApiOrder["status"] }) {
  const map: Record<ApiOrder["status"], { label: string; tone: string }> = {
    pending: {
      label: "Pending",
      tone: "bg-amber-50 text-amber-700 border-amber-200",
    },
    preparing: {
      label: "Preparing",
      tone: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "out-for-delivery": {
      label: "Out for delivery",
      tone: "bg-purple-50 text-purple-700 border-purple-200",
    },
    delivered: {
      label: "Delivered",
      tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    cancelled: {
      label: "Cancelled",
      tone: "bg-rose-50 text-rose-700 border-rose-200",
    },
  };
  const conf = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${conf.tone}`}
    >
      {conf.label}
    </span>
  );
}

function StatusStepper({ status }: { status: ApiOrder["status"] }) {
  if (status === "cancelled") {
    return (
      <div className="w-full rounded-xl border p-4 bg-rose-50 border-rose-200 text-rose-700 flex items-center gap-3">
        <XCircle className="size-5" />
        <div className="font-medium">This order was cancelled</div>
      </div>
    );
  }

  const activeIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between">
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-gray-200 rounded-full transform" />
        {/* Progress */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-full transition-all transform"
          style={{
            width: activeIndex == 3 ? `100%` : `${12.5 + activeIndex * 25}%`,
          }}
        />

        {STATUS_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const done = idx <= activeIndex;
          return (
            <div
              key={step.key}
              className="relative mt-[25px] z-10 flex flex-col items-center w-1/4"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors ${
                  done
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-500 border-gray-300"
                }`}
              >
                <Icon className="size-4" />
              </div>
              <div
                className={`text-xs ${
                  done ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="mt-[10px] block"> {step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const id = useMemo(
    () =>
      typeof params?.id === "string"
        ? params.id
        : Array.isArray(params?.id)
        ? params?.id?.[0]
        : "",
    [params]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<ApiOrder | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    async function fetchOrder(signal?: AbortSignal) {
      if (!id) return;
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) {
        setError("Missing NEXT_PUBLIC_API_URL environment variable");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${base}/orders/${id}`, {
          cache: "no-store",
          signal,
        });
        if (!res.ok) {
          const msg = await res.json().catch(() => ({} as any));
          throw new Error(msg?.error || "Failed to fetch order");
        }
        const data = (await res.json()) as { order: ApiOrder };
        setOrder(data.order);
        setError(null);
      } catch (err) {
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    const ctrl = new AbortController();
    fetchOrder(ctrl.signal);
    // Poll for status updates every 20s
    timer = window.setInterval(
      () => fetchOrder(ctrl.signal),
      20000
    ) as unknown as number;
    return () => {
      ctrl.abort();
      if (timer) window.clearInterval(timer);
    };
  }, [id]);

  const hasMultiRestaurants = (order?.restaurants?.length || 0) > 1;
  const restaurantName =
    order?.restaurant?.name || (order?.restaurants?.[0]?.name ?? "");

  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Order <span className="text-secondary">Status</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8">
              Track your order and view its details
            </p>
          </div>
        </div>
      </section>

      <section className="p-16">
        <div className="container">
          {loading ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Loading order…</CardTitle>
                <CardDescription>
                  Fetching the latest order details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="animate-pulse space-y-4 py-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Unable to load order</CardTitle>
                <CardDescription className="text-rose-600">
                  {error}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-6">
                <Button onClick={() => router.refresh()}>Retry</Button>
              </CardContent>
            </Card>
          ) : !order ? (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-xl">Order not found</CardTitle>
                <CardDescription>
                  Please check the link and try again.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Status + Details */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <span>Order</span>
                          <span className="text-secondary">
                            #{order._id.slice(-6)}
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Placed on {prettyDate(order.createdAt)}{" "}
                          {restaurantName ? `• ${restaurantName}` : ""}
                          {hasMultiRestaurants ? " • Multiple restaurants" : ""}
                        </CardDescription>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="py-6">
                    <StatusStepper status={order.status} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">Order Items</CardTitle>
                    <CardDescription>
                      A summary of everything in your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-6 space-y-4">
                    {order.items.map((it, idx) => (
                      <div
                        key={`${it.itemId}-${idx}`}
                        className="flex items-start gap-4"
                      >
                        <div className="relative h-16 w-16 rounded-lg overflow-hidden border bg-gray-50">
                          <SafeImage
                            src={it.imageUrl}
                            alt={it.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-medium text-foreground leading-tight">
                                {it.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Qty: {it.quantity}
                              </div>
                              {it.customizations &&
                                it.customizations.length > 0 && (
                                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                    {it.customizations.map((g) => (
                                      <div key={g.group}>
                                        <span className="font-medium">
                                          {g.group}:
                                        </span>{" "}
                                        {g.options
                                          .map((o) => o.name)
                                          .join(", ")}
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                            <div className="text-sm font-semibold text-secondary">
                              {currency(it.price * it.quantity)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-lg">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Name</span>
                        <span className="font-medium">
                          {order.customer?.fullName || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">
                          {order.customer?.phone || "—"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium break-all">
                          {order.customer?.email || "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="border-b">
                      <CardTitle className="text-lg">
                        Delivery Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-6 space-y-1 text-sm">
                      <div className="text-foreground font-medium">
                        {order.deliveryAddress?.street || "—"}
                      </div>
                      <div className="text-muted-foreground">
                        {[
                          order.deliveryAddress?.city,
                          order.deliveryAddress?.postal,
                        ]
                          .filter(Boolean)
                          .join(", ") || ""}
                      </div>
                      {order.deliveryAddress?.notes ? (
                        <div className="text-muted-foreground text-xs mt-2">
                          Notes: {order.deliveryAddress?.notes}
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right: Summary */}
              <aside className="lg:col-span-1">
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">Order Summary</CardTitle>
                    <CardDescription>Totals and fees</CardDescription>
                  </CardHeader>
                  <CardContent className="py-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">
                        {currency(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">GST</span>
                      <span className="font-medium">
                        {currency(order.gstTotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Delivery Fee
                      </span>
                      <span className="font-medium">
                        {currency(order.deliveryFee)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex items-center justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-secondary">
                        {currency(order.total)}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="text-xs text-muted-foreground">
                        Last updated
                      </div>
                      <div className="text-sm font-medium">
                        {prettyDate(order.updatedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

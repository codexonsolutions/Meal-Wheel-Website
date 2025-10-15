"use client";
/* Checkout page: Collects user details and shows order summary */
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CheckoutPage() {
  const { state, subtotal, clear } = useCart();
  const router = useRouter();
  const STORAGE_KEY = "MW_CHECKOUT_V1";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [notes, setNotes] = useState("");

  const deliveryFee = state.items.length > 0 ? 220 : 0; // flat fee example
  // Map of restaurantId -> gst percentage
  const [gstByRestaurant, setGstByRestaurant] = useState<
    Record<string, number>
  >({});
  // Compute GST for the current cart based on restaurant GST
  const gstTotal = useMemo(() => {
    if (!state.items || state.items.length === 0) return 0;
    let tax = 0;
    for (const item of state.items) {
      const rid = item.restaurantId || "";
      const pct =
        typeof gstByRestaurant[rid] === "number" ? gstByRestaurant[rid] : 0;
      if (pct > 0) tax += item.price * item.qty * (pct / 100);
    }
    return Math.max(0, Number.isFinite(tax) ? tax : 0);
  }, [state.items, gstByRestaurant]);
  const total = subtotal + gstTotal + deliveryFee;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Hydrate checkout form from localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw) as Partial<{
        fullName: string;
        email: string;
        phone: string;
        street: string;
        city: string;
        postal: string;
        notes: string;
      }>;
      if (data.fullName) setFullName(data.fullName);
      if (data.email) setEmail(data.email);
      if (data.phone) setPhone(data.phone);
      if (data.street) setStreet(data.street);
      if (data.city) setCity(data.city);
      if (data.postal) setPostal(data.postal);
      if (data.notes) setNotes(data.notes);
    } catch {
      // ignore parse errors
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch restaurant GST mapping for pricing calculations
  useEffect(() => {
    let active = true;
    async function loadGst() {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL;
        if (!base) return;
        const res = await fetch(`${base}/restaurant`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const list: Array<{ _id?: string; gst?: number }> = Array.isArray(
          data?.restaurants
        )
          ? data.restaurants
          : [];
        const map: Record<string, number> = {};
        for (const r of list) {
          const id = typeof r._id === "string" ? r._id : undefined;
          const gst = typeof r.gst === "number" && r.gst >= 0 ? r.gst : 0;
          if (id) map[id] = gst;
        }
        if (active) setGstByRestaurant(map);
      } catch {
        // ignore; fallback GST is 0
      }
    }
    loadGst();
    return () => {
      active = false;
    };
  }, []);

  // Persist checkout form to localStorage
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const payload = {
        fullName,
        email,
        phone,
        street,
        city,
        postal,
        notes,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [fullName, email, phone, street, city, postal, notes]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (state.items.length === 0 && !showSuccess) {
      router.push("/");
    }
  }, [state.items.length, router, showSuccess]);

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!fullName || !email || !phone || !street || !city || !postal) {
      setError("Please complete all required fields.");
      return;
    }

    if (state.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare order data for backend
      const orderData: Record<string, unknown> = {
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        deliveryAddress: {
          street: street.trim(),
          city: city.trim(),
          postal: postal.trim(),
          notes: notes.trim() || undefined,
        },
        items: state.items.map((item) => ({
          id: item.id.includes("::") ? item.id.split("::")[0] : item.id,
          quantity: item.qty,
          selectedOptions: item.selectedOptions?.map((g) => ({
            group: g.group,
            options: g.options.map((o) => ({ name: o.name, price: o.price })),
          })),
        })),
        deliveryFee: deliveryFee,
      };
      // restaurant field no longer required; backend derives restaurants from item docs

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
      }

      // Debug log (can be removed in production)
      if (process.env.NODE_ENV !== "production") {
        console.log("Submitting order payload", orderData);
      }

      // Send order to backend
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/public`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok) {
        let errorMsg = "Failed to place order";
        try {
          const errorData = await response.json();
          if (errorData?.error) errorMsg = errorData.error;
        } catch {
          /* ignore */
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();

      setOrderId(result.order?._id ?? null);
      setShowSuccess(true);
      // Keep saved checkout info for convenience across orders
      clear();
    } catch (err) {
      console.error("Order placement error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-secondary">Checkout</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 mb-8">
              Complete your order details below
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="py-16">
        <div className="container">
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="px-6 pt-8 pb-6 text-center space-y-3">
                  <div className="text-2xl font-semibold text-gray-900">
                    Order Successful!
                  </div>
                  <p className="text-sm text-gray-600">
                    {orderId
                      ? `Thanks for your order.`
                      : "Thanks for your order!"}
                  </p>
                  <Button
                    className="mt-4 w-[100%]"
                    size="lg"
                    onClick={() => {
                      if (orderId) {
                        router.push(`/order/${orderId}`);
                      } else {
                        router.push("/");
                      }
                    }}
                  >
                    Track Order
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors"
            >
              <span>←</span> Back to Menu
            </Link>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Order Summary */}
            <aside className="w-full order-1 lg:order-2 lg:sticky lg:top-24">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.length === 0 ? (
                    <p className="text-sm text-gray-500">Your cart is empty.</p>
                  ) : (
                    state.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        {item.image ? (
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                            <SafeImage
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100" />
                        )}
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                          {item.selectedOptions &&
                            item.selectedOptions.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1 space-y-1">
                                {item.selectedOptions.map((g) => (
                                  <div key={g.group}>
                                    <span className="font-medium">
                                      {g.group}:
                                    </span>{" "}
                                    {g.options
                                      .map(
                                        (o) =>
                                          `${o.name}${
                                            o.price
                                              ? ` (+Rs. ${o.price.toFixed(2)})`
                                              : ""
                                          }`
                                      )
                                      .join(", ")}
                                  </div>
                                ))}
                              </div>
                            )}
                          <div className="text-xs text-gray-500 mt-1">
                            Qty: {item.qty}
                          </div>
                        </div>
                        <div className="text-sm font-bold text-secondary">
                          Rs. {(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}

                  <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        Rs. {subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">GST</span>
                      <span className="font-medium">
                        Rs. {gstTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Fee</span>
                      <span className="font-medium">
                        Rs. {deliveryFee.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-secondary">
                        Rs. {total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Form */}
            <form
              onSubmit={placeOrder}
              className="w-full order-2 lg:order-1 space-y-6"
            >
              {/* Personal Information */}
              <Card className="w-full">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Full Name <span className="text-secondary">*</span>
                    </label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Enter your full name"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Email Address <span className="text-secondary">*</span>
                    </label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-secondary">*</span>
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="Enter your phone number"
                      className="h-12 text-base"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="w-full">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">Delivery Address</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Street Address <span className="text-secondary">*</span>
                    </label>
                    <Input
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      placeholder="Enter your street address"
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        City <span className="text-secondary">*</span>
                      </label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Enter your city"
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">
                        Postal Code
                      </label>
                      <Input
                        value={postal}
                        onChange={(e) => setPostal(e.target.value)}
                        required
                        placeholder="Enter postal code"
                        className="h-12 text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      Special Instructions
                    </label>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special delivery instructions..."
                      className="min-h-[90px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="w-full">
                <CardHeader className="border-b">
                  <CardTitle className="text-xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Payment will be collected upon delivery. We accept cash and
                    card payments.
                  </p>
                </CardContent>
              </Card>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  className="w-full"
                  type="submit"
                  size="lg"
                  variant={"outline"}
                  disabled={isLoading || state.items.length === 0}
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

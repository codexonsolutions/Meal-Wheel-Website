"use client";
/* Checkout page: Collects user details and shows order summary */
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";

export default function CheckoutPage() {
  const { state, subtotal, clear } = useCart();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [notes, setNotes] = useState("");

  const deliveryFee = state.items.length > 0 ? 150 : 0; // flat fee example
  const total = subtotal + deliveryFee;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (state.items.length === 0 && !showSuccess) {
      router.push('/');
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
      const orderData = {
        customer: {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim()
        },
        deliveryAddress: {
          street: street.trim(),
          city: city.trim(),
          postal: postal.trim(),
          notes: notes.trim() || undefined
        },
        items: state.items.map(item => ({
          id: item.id,
          quantity: item.qty
        })),
        deliveryFee: deliveryFee
      };

      // Send order to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to place order' }));
        throw new Error(errorData.error || 'Failed to place order');
      }

      const result = await response.json();

      setOrderId(result.order?._id ?? null);
      setShowSuccess(true);
      clear();
      
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* subtle background like other pages */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-sm rounded-xl border shadow-xl" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 92%, white 8%)", borderColor: "color-mix(in oklch, var(--text-primary) 18%, var(--app-bg))" }}>
              <div className="px-6 pt-8 pb-6 text-center space-y-3">
                <div className="text-2xl font-semibold">Order Successful!</div>
                <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
                  {orderId ? `Thanks for your order.` : 'Thanks for your order!'}
                </p>
                <button
                  className="mt-4 inline-flex items-center justify-center px-6 py-2 rounded-md font-medium hover:opacity-90"
                  style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}
                  onClick={() => {
                    setShowSuccess(false);
                    router.push('/');
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
            <span>←</span> Back to Menu
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
        <p className="mb-8" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Complete your order details below</p>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Order Summary - appears first on mobile */}
          <aside className="order-1 lg:order-2 rounded-xl border shadow-sm lg:sticky lg:top-24" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))", backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, white 3%)" }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <div className="p-5 space-y-4">
              {state.items.length === 0 ? (
                <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Your cart is empty.</p>
              ) : (
                state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.image ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
                        <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-[color:color-mix(in_oklch,var(--text-primary)_10%,var(--app-bg))]" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-medium">Rs. {(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))
              )}

              <div className="mt-4 border-t pt-4 space-y-2" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>Rs. {deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total</span>
                  <span>Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Form - appears second on mobile */}
          <form onSubmit={placeOrder} className="order-2 lg:order-1 space-y-6">
            {/* Personal Information */}
            <div className="rounded-xl border shadow-sm" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))", backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, white 3%)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
                <h2 className="font-semibold">Personal Information</h2>
              </div>
              <div className="p-5 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm">Full Name <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                  <input value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="Enter your full name" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm">Email Address <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Enter your email" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                </div>
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-sm">Phone Number <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Enter your phone number" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-xl border shadow-sm" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))", backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, white 3%)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
                <h2 className="font-semibold">Delivery Address</h2>
              </div>
              <div className="p-5 grid gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm">Street Address <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                  <input value={street} onChange={(e) => setStreet(e.target.value)} required placeholder="Enter your street address" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm">City <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                    <input value={city} onChange={(e) => setCity(e.target.value)} required placeholder="Enter your city" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm">Postal Code <span style={{ color: "var(--text-secondary)" }}>*</span></label>
                    <input value={postal} onChange={(e) => setPostal(e.target.value)} required placeholder="Enter postal code" className="px-3 py-2 rounded-md border bg-transparent outline-none" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm">Special Instructions</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special delivery instructions..." className="px-3 py-2 rounded-md border bg-transparent outline-none min-h-[90px]" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))", color: "var(--text-primary)" }} />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border shadow-sm" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))", backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, white 3%)" }}>
              <div className="px-5 py-4 border-b" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
                <h2 className="font-semibold">Payment Method</h2>
              </div>
              <div className="p-5">
                <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
                  Payment will be collected upon delivery. We accept cash and card payments.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={isLoading || state.items.length === 0}
                className="px-5 py-3 rounded-md font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed" 
                style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}
              >
                {isLoading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

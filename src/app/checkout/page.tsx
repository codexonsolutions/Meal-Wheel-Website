"use client";
/* Checkout page: Collects user details and shows order summary */
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { useAdmin } from "@/store/admin-store";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const { state, subtotal, clear } = useCart();
  const { addOrder } = useAdmin();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [notes, setNotes] = useState("");

  const deliveryFee = state.items.length > 0 ? 150 : 0; // flat fee example
  const total = subtotal + deliveryFee;

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!fullName || !email || !phone || !street || !city || !postal) {
      alert("Please complete all required fields.");
      return;
    }
    // Create order and persist into admin store
    const order: Order = {
      id: `ord_${Date.now()}`,
      customer: { fullName, email, phone },
      address: { street, city, postal, notes },
      items: state.items.map((i) => ({ name: i.name, price: i.price, qty: i.qty, image: i.image })),
      subtotal,
      deliveryFee,
      total,
      status: "pending",
      createdAt: Date.now(),
    };
    addOrder(order);
    alert("Order placed successfully! (Demo)");
    clear();
  };

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* subtle background like other pages */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)" }} />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm hover:opacity-80" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
            <span>←</span> Back to Menu
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
        <p className="mb-8" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Complete your order details below</p>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left: Form */}
          <form onSubmit={placeOrder} className="space-y-6">
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

            <div className="flex justify-end">
              <button type="submit" className="px-5 py-3 rounded-md font-medium hover:opacity-90" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>
                Place Order
              </button>
            </div>
          </form>

          {/* Right: Order Summary */}
          <aside className="rounded-xl border shadow-sm sticky top-24" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))", backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, white 3%)" }}>
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
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-[color:color-mix(in_oklch,var(--text-primary)_10%,var(--app-bg))]" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Qty: {item.qty}</div>
                    </div>
                    <div className="text-sm font-medium">${(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))
              )}

              <div className="mt-4 border-t pt-4 space-y-2" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 12%, var(--app-bg))" }}>
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

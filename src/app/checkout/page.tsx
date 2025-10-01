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


    const restaurantIds = [...new Set(state.items.map(i => i.restaurantId).filter(Boolean))];
    if (restaurantIds.length > 1) {
      setError("All items must be from the same restaurant.");
      return;
    }
    const restaurantId = restaurantIds[0]; 

    setIsLoading(true);

    try {
      // Prepare order data for backend
      const orderData: Record<string, unknown> = {
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
        items: state.items.map(item => ({ id: item.id, quantity: item.qty })),
        deliveryFee: deliveryFee
      };
      if (restaurantId) orderData.restaurant = restaurantId; // tolerated extra field; backend ignores on public route

      if (!process.env.NEXT_PUBLIC_API_URL) {
        throw new Error('Missing NEXT_PUBLIC_API_URL environment variable');
      }

      // Debug log (can be removed in production)
      if (process.env.NODE_ENV !== 'production') {
        console.log('Submitting order payload', orderData);
      }

      // Send order to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/public`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        let errorMsg = 'Failed to place order';
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
      clear();
      
    } catch (err) {
      console.error('Order placement error:', err);
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
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
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
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
                  <div className="text-2xl font-semibold text-gray-900">Order Successful!</div>
                  <p className="text-sm text-gray-600">
                    {orderId ? `Thanks for your order.` : 'Thanks for your order!'}
                  </p>
                  <button
                    className="mt-4 inline-flex items-center justify-center px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors"
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
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-colors">
              <span>←</span> Back to Menu
            </Link>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_400px] gap-8 items-start">
            {/* Order Summary */}
            <aside className="order-1 lg:order-2 bg-white rounded-2xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="p-6 space-y-4">
                {state.items.length === 0 ? (
                  <p className="text-sm text-gray-500">Your cart is empty.</p>
                ) : (
                  state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.image ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200">
                          <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-100" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">Qty: {item.qty}</div>
                      </div>
                      <div className="text-sm font-bold text-secondary">Rs. {(item.qty * item.price).toFixed(2)}</div>
                    </div>
                  ))
                )}

                <div className="mt-6 border-t border-gray-200 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">Rs. {deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-secondary">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Form */}
            <form onSubmit={placeOrder} className="order-2 lg:order-1 space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                </div>
                <div className="p-6 grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Full Name <span className="text-secondary">*</span></label>
                    <input 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      required 
                      placeholder="Enter your full name" 
                      className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Email Address <span className="text-secondary">*</span></label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="Enter your email" 
                      className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number <span className="text-secondary">*</span></label>
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      placeholder="Enter your phone number" 
                      className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                </div>
                <div className="p-6 grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Street Address <span className="text-secondary">*</span></label>
                    <input 
                      value={street} 
                      onChange={(e) => setStreet(e.target.value)} 
                      required 
                      placeholder="Enter your street address" 
                      className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">City <span className="text-secondary">*</span></label>
                      <input 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                        placeholder="Enter your city" 
                        className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-700">Postal Code <span className="text-secondary">*</span></label>
                      <input 
                        value={postal} 
                        onChange={(e) => setPostal(e.target.value)} 
                        required 
                        placeholder="Enter postal code" 
                        className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Special Instructions</label>
                    <textarea 
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)} 
                      placeholder="Any special delivery instructions..." 
                      className="px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-colors min-h-[90px] resize-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600">
                    Payment will be collected upon delivery. We accept cash and card payments.
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={isLoading || state.items.length === 0}
                  className="px-8 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

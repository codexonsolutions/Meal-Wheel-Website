"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { useEffect, useState } from "react";

function isWithinDeliveryWindow() {
  const now = new Date();
  const openHour = 18; // 6pm
  const closeHour = 2; // 2am (next day)
  const open = new Date(now);
  const close = new Date(now);
  open.setHours(openHour, 0, 0, 0);
  close.setHours(closeHour, 0, 0, 0);
  if (closeHour <= openHour) close.setDate(close.getDate() + 1);

  // If window does not cross midnight
  if (open < close) {
    return now >= open && now < close;
  } else {
    // Overnight window (crosses midnight)
    // Open if now >= open (today) or now < close (next day)
    return now >= open || now < close;
  }
}

export function CartDrawer() {
  const { state, close, remove, increment, decrement, clear, subtotal } = useCart();
  const router = useRouter();
  const open = state.open;
  const [canCheckout, setCanCheckout] = useState(isWithinDeliveryWindow());

  useEffect(() => {
    const interval = setInterval(() => {
      setCanCheckout(isWithinDeliveryWindow());
    }, 1000 * 30); // update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden
        onClick={close}
        className={
          "fixed inset-0 bg-black/40 transition-opacity " +
          (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")
        }
        style={{ zIndex: 60 }}
      />

      {/* Drawer */}
      <aside
        className={
          "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[color:var(--app-bg)] border-l border-[color:color-mix(in_oklch,var(--text-primary)_15%,var(--app-bg))] shadow-xl transition-transform" +
          (open ? " translate-x-0" : " translate-x-full")
        }
        style={{ zIndex: 70 }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-[color:color-mix(in_oklch,var(--text-primary)_15%,var(--app-bg))]">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button aria-label="Close cart" onClick={close} className="p-2 rounded hover:opacity-80" style={{ color: "var(--text-primary)" }}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-56px)]">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {state.items.length === 0 ? (
              <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
                Your cart is empty.
              </p>
            ) : (
              state.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  {item.image ? (
                    <div className="relative h-16 w-16 rounded overflow-hidden border" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 15%, var(--app-bg))" }}>
                      <SafeImage src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded bg-[color:color-mix(in_oklch,var(--text-primary)_10%,var(--app-bg))]" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
                      Rs. {(item.price * item.qty).toFixed(2)} ({item.qty} × Rs. {item.price.toFixed(2)})
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <button onClick={() => decrement(item.id)} className="px-2 py-1 rounded border" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}>
                        −
                      </button>
                      <span className="min-w-6 text-center">{item.qty}</span>
                      <button onClick={() => increment(item.id)} className="px-2 py-1 rounded border" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}>
                        +
                      </button>
                      <button onClick={() => remove(item.id)} className="ml-3 text-sm hover:opacity-80" style={{ color: "var(--text-secondary)" }}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-[color:color-mix(in_oklch,var(--text-primary)_15%,var(--app-bg))] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={clear}
                disabled={state.items.length === 0}
                className="px-4 py-2 rounded-md text-sm font-medium border hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}
              >
                Clear cart
              </button>
              <button
                disabled={state.items.length === 0 || !canCheckout}
                className="px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}
                onClick={() => {
                  if (state.items.length > 0 && canCheckout) {
                    close();
                    router.push("/checkout");
                  }
                }}
                title={!canCheckout ? "Checkout is only available from 9:00 PM to 2:00 AM" : undefined}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

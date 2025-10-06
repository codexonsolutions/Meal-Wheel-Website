"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "./cart-context";
import { useEffect, useState } from "react";
import { Button } from "../ui";

function isWithinDeliveryWindow() {
  return true; // Temporary override to always allow checkout
  const now = new Date();
  const openHour = 18; // 6pm
  const closeHour = 2; // 2am (next day)

  const start = new Date(now);
  const end = new Date(now);
  start.setHours(openHour, 0, 0, 0);
  end.setHours(closeHour, 0, 0, 0);

  // If window crosses midnight, anchor start/end around 'now'
  if (closeHour <= openHour) {
    if (now < start) {
      // After midnight but before today's opening: start was yesterday
      start.setDate(start.getDate() - 1);
    } else {
      // Evening: closing happens next calendar day
      end.setDate(end.getDate() + 1);
    }
  }

  return now >= start && now < end;
}

export function CartDrawer() {
  const { state, close, remove, increment, decrement, clear, subtotal } =
    useCart();
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
          (open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none")
        }
        style={{ zIndex: 60 }}
      />

      {/* Drawer */}
      <aside
        className={
          "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background border-l border-border rounded-md shadow-xl transition-transform" +
          (open ? " translate-x-0" : " translate-x-full")
        }
        style={{ zIndex: 70 }}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            aria-label="Close cart"
            onClick={close}
            className="p-2 rounded cursor-pointer hover:opacity-80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-56px)]">
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {state.items.length === 0 ? (
              <p className="text-sm">Your cart is empty.</p>
            ) : (
              state.items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  {item.image ? (
                    <div className="relative h-16 w-16 overflow-hidden">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded bg-background" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    {item.selectedOptions &&
                      item.selectedOptions.length > 0 && (
                        <div className="text-xs text-foreground/70 mt-1 space-y-1">
                          {item.selectedOptions.map((g) => (
                            <div key={g.group}>
                              <span className="font-medium">{g.group}:</span>{" "}
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
                    <div className="text-sm mt-1">
                      Rs. {(item.price * item.qty).toFixed(2)} ({item.qty} × Rs.{" "}
                      {item.price.toFixed(2)})
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2">
                      <button
                        onClick={() => decrement(item.id)}
                        className="px-2 rounded-full border border-border cursor-pointer"
                      >
                        −
                      </button>
                      <span className="min-w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="px-2 rounded-full border border-border cursor-pointer"
                      >
                        +
                      </button>
                      <button
                        onClick={() => remove(item.id)}
                        className="ml-3 text-sm hover:opacity-80 text-secondary cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold">Rs. {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clear}
                disabled={state.items.length === 0}
              >
                Clear Cart
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  close();
                  router.push("/checkout");
                }}
                disabled={state.items.length === 0 || !canCheckout}
                title={
                  canCheckout
                    ? undefined
                    : "Orders can be placed only between 6PM and 2AM"
                }
              >
                Checkout
              </Button>
            </div>
            <div className="text-xs text-foreground/70">
              {canCheckout
                ? "You can place your order now!"
                : "Orders can be placed only between 6PM and 2AM"}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

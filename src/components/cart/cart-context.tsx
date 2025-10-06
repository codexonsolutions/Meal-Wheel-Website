"use client";
import { createContext, useContext, useMemo, useReducer, ReactNode } from "react";
import { useToast } from "@/components/ui/toast";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  restaurantId?: string; // optional to maintain backward compatibility
  selectedOptions?: { group: string; options: { name: string; price: number }[] }[];
};

type State = {
  open: boolean;
  items: CartItem[];
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "ADD"; payload: (Omit<CartItem, "qty"> & { qty?: number; variantKey?: string }) }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "INCREMENT"; payload: { id: string } }
  | { type: "DECREMENT"; payload: { id: string } }
  | { type: "CLEAR" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OPEN":
      return { ...state, open: true };
    case "CLOSE":
      return { ...state, open: false };
    case "TOGGLE":
      return { ...state, open: !state.open };
    case "ADD": {
      const { id, name, price, image, qty = 1, restaurantId, selectedOptions, variantKey } = action.payload as any;
      const cartId = variantKey ? `${id}::${variantKey}` : id;
      const idx = state.items.findIndex((i) => i.id === cartId);
      const extra = Array.isArray(selectedOptions)
        ? selectedOptions.reduce((sum: number, g: any) => sum + (Array.isArray(g.options) ? g.options.reduce((s: number, o: any) => s + (Number(o.price) || 0), 0) : 0), 0)
        : 0;
      const unitPrice = Number(price) + extra;
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { id: cartId, name, price: unitPrice, image, qty, restaurantId, selectedOptions }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) };
    case "INCREMENT": {
      const items = state.items.map((i) => (i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i));
      return { ...state, items };
    }
    case "DECREMENT": {
      const items = state.items
        .map((i) => (i.id === action.payload.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i))
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }
    case "CLEAR":
      return { ...state, items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: State;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  remove: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
  totalQty: number;
  subtotal: number;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { open: false, items: [] });
  const { toast } = useToast();

  const api = useMemo(() => {
    const totalQty = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return {
      state,
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
      toggle: () => dispatch({ type: "TOGGLE" }),
      add: (item: Omit<CartItem, "qty"> & { qty?: number }) => {
        // Determine if this will create a new line item
        const raw: any = item as any;
        const baseId = String(raw.id ?? "");
        const cartId = raw.variantKey ? `${baseId}::${raw.variantKey}` : baseId;
        const exists = state.items.some((i) => i.id === cartId);

        dispatch({ type: "ADD", payload: item });

        // Toast only when a new line item is created
        if (!exists) {
          try {
            const name = raw?.name ? String(raw.name) : "Item";
            toast({ title: "Added to cart", description: `${name} has been added.` });
          } catch {
            // no-op toast failures
          }
        }
      },
      remove: (id: string) => dispatch({ type: "REMOVE", payload: { id } }),
      increment: (id: string) => dispatch({ type: "INCREMENT", payload: { id } }),
      decrement: (id: string) => dispatch({ type: "DECREMENT", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
      totalQty,
      subtotal,
    };
  }, [state, toast]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

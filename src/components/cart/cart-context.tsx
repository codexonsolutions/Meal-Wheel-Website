"use client";
import { createContext, useContext, useMemo, useReducer, ReactNode } from "react";

export type CartItem = {
  id: string; // unique per product/variant
  name: string;
  price: number; // store as number for totals
  image?: string;
  qty: number;
};

type State = {
  open: boolean;
  items: CartItem[];
};

type Action =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "TOGGLE" }
  | { type: "ADD"; payload: Omit<CartItem, "qty"> & { qty?: number } }
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
      const { id, name, price, image, qty = 1 } = action.payload;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = { ...items[idx], qty: items[idx].qty + qty };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, { id, name, price, image, qty }] };
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

  const api = useMemo(() => {
    const totalQty = state.items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return {
      state,
      open: () => dispatch({ type: "OPEN" }),
      close: () => dispatch({ type: "CLOSE" }),
      toggle: () => dispatch({ type: "TOGGLE" }),
      add: (item: Omit<CartItem, "qty"> & { qty?: number }) => dispatch({ type: "ADD", payload: item }),
      remove: (id: string) => dispatch({ type: "REMOVE", payload: { id } }),
      increment: (id: string) => dispatch({ type: "INCREMENT", payload: { id } }),
      decrement: (id: string) => dispatch({ type: "DECREMENT", payload: { id } }),
      clear: () => dispatch({ type: "CLEAR" }),
      totalQty,
      subtotal,
    };
  }, [state]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

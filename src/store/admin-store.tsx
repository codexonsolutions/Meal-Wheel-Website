"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { Restaurant, Item, Order } from "@/types";

const LS_KEY = "mw_admin_store_v1";

type AdminState = {
  restaurants: Restaurant[];
  items: Item[];
  orders: Order[];
};

const defaultState: AdminState = {
  restaurants: [],
  items: [],
  orders: [],
};

type AdminContextType = AdminState & {
  addRestaurant: (data: Pick<Restaurant, "name" | "image">) => Restaurant;
  addItem: (data: Omit<Item, "id" | "createdAt">) => Item;
  toggleFeatured: (itemId: string, featured: boolean) => void;
  addOrder: (order: Order) => void;
  setOrderStatus: (orderId: string, status: Order["status"]) => void;
};

const AdminContext = createContext<AdminContextType | null>(null);

function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminState>(defaultState);

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setState(JSON.parse(raw));
    } catch {}
  }, []);

  // persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const api: AdminContextType = useMemo(() => ({
    ...state,
    addRestaurant: ({ name, image }) => {
      const r: Restaurant = {
        id: uid("rest"),
        name,
        image,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        createdAt: Date.now(),
      };
      setState((s) => ({ ...s, restaurants: [r, ...s.restaurants] }));
      return r;
    },
    addItem: (data) => {
      const item: Item = { ...data, id: uid("item"), createdAt: Date.now() };
      setState((s) => ({ ...s, items: [item, ...s.items] }));
      return item;
    },
    toggleFeatured: (itemId, featured) => {
      setState((s) => ({
        ...s,
        items: s.items.map((it) => (it.id === itemId ? { ...it, featured } : it)),
      }));
    },
    addOrder: (order) => {
      setState((s) => ({ ...s, orders: [order, ...s.orders] }));
    },
    setOrderStatus: (orderId, status) => {
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      }));
    },
  }), [state]);

  return <AdminContext.Provider value={api}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

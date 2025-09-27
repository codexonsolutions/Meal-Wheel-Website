export type ID = string;

export type Restaurant = {
  id: ID;
  name: string;
  image?: string;
  slug: string;
  description?: string;
  categories: string[];
  createdAt: number;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type MenuItem = {
  id: ID;
  name: string;
  price: number;
  description?: string;
  image?: string;
  featured?: boolean;
  category: string;
};

export type Item = {
  id: ID;
  restaurantId: ID;
  name: string;
  image?: string;
  price: number; // numeric price
  category?: string;
  featured?: boolean;
  createdAt: number;
};

export type OrderItem = {
  name: string;
  price: number;
  qty: number;
  image?: string;
};

export type Order = {
  id: ID;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    postal: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "preparing" | "delivering" | "completed" | "cancelled";
  createdAt: number;
};

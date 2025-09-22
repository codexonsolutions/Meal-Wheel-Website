/* Stats section */
import { Users, Store, Truck, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "50K+", label: "Happy Customers", description: "Satisfied with our service" },
  { icon: Store, value: "200+", label: "Partner Restaurants", description: "Across the city" },
  { icon: Truck, value: "10K+", label: "Orders Delivered", description: "This month alone" },
  { icon: Star, value: "4.8", label: "Average Rating", description: "From customer reviews" },
];

export function StatsSection() {
  return (
    <section className="py-20">
      <div className="container max-w-screen-xl px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ backgroundColor: "color-mix(in oklch, var(--text-secondary) 10%, var(--app-bg))", border: "1px solid color-mix(in oklch, var(--text-secondary) 20%, var(--app-bg))" }}>
                <stat.icon className="h-8 w-8" style={{ color: "var(--text-secondary)" }} />
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "var(--text-secondary)" }}>{stat.value}</div>
                <div className="font-semibold mb-1">{stat.label}</div>
                <div className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

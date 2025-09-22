/* Restaurants listing page: shows restaurant cards with only image and name */
import Image from "next/image";
import Link from "next/link";

type Restaurant = {
  id: number;
  name: string;
  image: string; // path under public/, e.g., "/my-restaurant.jpg"
};

const restaurants: Restaurant[] = [
  { id: 1, name: "Bella Italia", image: "/healthy-salad-bowl.png" },
  { id: 2, name: "Dragon Palace", image: "/chinese-restaurant-with-red-lanterns.jpg" },
  { id: 3, name: "Burger Junction", image: "/modern-burger-restaurant.jpg" },
  { id: 4, name: "Sakura Sushi", image: "/elegant-sushi-restaurant.jpg" },
];

export default function RestaurantsPage() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--app-bg) 100%, transparent) 0%, color-mix(in oklch, var(--app-bg) 95%, transparent) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="container relative z-10 max-w-screen-xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold">Restaurants</h1>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {restaurants.map((r) => {
            const slug = r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            return (
              <Link key={r.id} href={`/restaurants/${slug}`} className="group rounded-[12%] overflow-hidden border shadow-md hover:shadow-xl cursor-pointer transition-shadow" style={{ borderColor: "var(--text-secondary)" }}>
                <div className="relative aspect-[4/3]">
                  <Image src={r.image} alt={r.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{r.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

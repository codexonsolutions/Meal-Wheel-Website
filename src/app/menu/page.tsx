"use client";
import { getFeaturedItems } from "@/data/restaurants";
import { useCart } from "@/components/cart/cart-context";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
export default function MenuPage() {
  const { add } = useCart();
  const featuredItems = getFeaturedItems();

  const handleAddToCart = (item: any) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "/placeholder.jpg"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-secondary">Menu</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover all our featured dishes from different restaurants. Each item is carefully crafted for the best taste experience.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Items Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">
                      Rs. {item.price}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      size="sm"
                      variant="default"
                      className="bg-secondary hover:bg-secondary/90 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

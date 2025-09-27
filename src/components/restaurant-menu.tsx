"use client";
import { useState } from "react";
import { MenuCategory, MenuItem } from "@/types";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RestaurantMenuProps {
  categories: MenuCategory[];
  restaurantName: string;
}

export function RestaurantMenu({ categories, restaurantName }: RestaurantMenuProps) {
  const { add } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>(
    categories.length > 0 ? categories[0].name : ""
  );

  const activeCategoryData = categories.find(cat => cat.name === activeCategory);
  const featuredItems = categories.flatMap(cat => cat.items.filter(item => item.featured));

  const handleAddToCart = (item: MenuItem) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "/placeholder.jpg"
    });
  };

  return (
    <div className="space-y-8">
      {/* Featured Items */}
      {featuredItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredItems.slice(0, 4).map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
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
                    <span className="text-lg font-bold text-secondary">Rs. {item.price}</span>
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
      )}

      {/* Category Navigation */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Menu Categories</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.name
                  ? "bg-secondary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name} ({category.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      {activeCategoryData && (
        <div>
          <h3 className="text-xl font-bold mb-4">{activeCategoryData.name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCategoryData.items.map((item) => (
              <div key={item.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-secondary">Rs. {item.price}</span>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      size="sm"
                      variant="default"
                      className="bg-secondary hover:bg-secondary/90 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
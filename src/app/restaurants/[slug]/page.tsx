"use client";
import { notFound } from "next/navigation";
import { useState, use } from "react";
import { getRestaurantBySlug, getMenuCategories } from "@/data/restaurants";
import { SafeImage } from "@/components/ui/safe-image";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { Star, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MenuCategory, MenuItem } from "@/types";

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function RestaurantPage({ params }: RestaurantPageProps) {
  const { add } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>("");
  
  const resolvedParams = use(params);
  const restaurant = getRestaurantBySlug(resolvedParams.slug);
  const menuCategories = getMenuCategories(resolvedParams.slug);

  if (!restaurant) {
    notFound();
  }

  // Set first category as active by default
  if (!activeCategory && menuCategories.length > 0) {
    setActiveCategory(menuCategories[0].name);
  }

  const activeCategoryData = menuCategories.find(cat => cat.name === activeCategory);
  const featuredItems = menuCategories.flatMap(cat => cat.items.filter(item => item.featured));

  const handleAddToCart = (item: MenuItem) => {
    add({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || "/placeholder.jpg"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/restaurants"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <p className="text-gray-600">{restaurant.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Hero */}
      <section className="relative py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Restaurant Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="relative h-48">
                    <SafeImage
                      src={restaurant.image || "/placeholder.jpg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.8</span>
                      <span className="text-gray-500">(124 reviews)</span>
                    </div>
                    <p className="text-gray-600 mb-4">{restaurant.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Categories:</span>
                        <span className="font-medium">{restaurant.categories.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Items:</span>
                        <span className="font-medium">
                          {menuCategories.reduce((total, cat) => total + cat.items.length, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Content */}
            <div className="lg:col-span-2">
              {/* Featured Items */}
              {featuredItems.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Featured Items</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <span className="text-secondary font-bold">Rs. {item.price}</span>
                        </div>
                        <Button
                          onClick={() => handleAddToCart(item)}
                          className="w-full bg-secondary hover:bg-secondary/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Navigation */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Menu Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {menuCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className={`px-4 py-2 rounded-full text-sm cursor-pointer font-medium transition-colors ${
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
                  <div className="space-y-3">
                    {activeCategoryData.items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border border-primary/50 p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{item.name}</h4>
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                            )}
                            <span className="text-secondary font-bold text-lg">Rs. {item.price}</span>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            size="sm"
                            className="bg-secondary hover:bg-secondary/90 ml-4"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

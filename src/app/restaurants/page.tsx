"use client";
import Link from "next/link";
import { restaurants } from "@/data/restaurants";
import { SafeImage } from "@/components/ui/safe-image";
import { ArrowRight, Star } from "lucide-react";

export default function RestaurantsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
        <div className="container relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our <span className="text-secondary">Restaurants</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover amazing flavors from our partner restaurants. Each one offers unique dishes crafted with love and tradition.
            </p>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {restaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.slug}`}
                className="group block"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Restaurant Image */}
                  <div className="relative h-48 md:h-56 overflow-hidden">
                    <SafeImage
                      src={restaurant.image || "/placeholder.jpg"}
                      alt={restaurant.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Restaurant Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-secondary transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-gray-600">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {restaurant.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {restaurant.categories.slice(0, 3).map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-secondary/10 text-secondary text-sm rounded-full font-medium"
                        >
                          {category}
                        </span>
                      ))}
                      {restaurant.categories.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{restaurant.categories.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {restaurant.categories.length} categories
                      </span>
                      <div className="flex items-center gap-2 text-secondary font-medium group-hover:gap-3 transition-all">
                        <span>View Menu</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Can't decide?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our featured items to discover popular dishes from all restaurants.
          </p>
          <Link
            href="/#featured-items"
            className="inline-flex items-center gap-2 bg-secondary text-background px-6 py-3 rounded-full font-medium hover:bg-secondary/90 transition-colors"
          >
            View Featured Items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
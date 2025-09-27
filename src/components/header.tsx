"use client";
/* Refactored Header component using only Tailwind CSS classes */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, MessageCircle, Instagram } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const { open, totalQty } = useCart();

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 py-0">
      <div className="mx-auto bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          
          {/* Left - Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image 
                src="/Meal_Wheel_Logo_Final.svg" 
                alt="Meal Wheel" 
                width={24} 
                height={24}
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-secondary">
                mealwheel
              </span>
            </div>
          </div>

          {/* Middle - Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname === "/" ? "text-secondary" : "text-text-primary"
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/restaurants" 
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/restaurants") ? "text-secondary" : "text-text-primary"
              }`}
            >
              Restaurants
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/menu" 
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/menu") ? "text-secondary" : "text-text-primary"
              }`}
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/orders" 
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/orders") ? "text-secondary" : "text-text-primary"
              }`}
            >
              Orders
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Right - Social Icons and Cart */}
          <div className="flex items-center gap-3">
            
            {/* WhatsApp */}
           <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 transition-colors group bg-transparent rounded-2xl hover:bg-hover-mix"
            >
            <a
              href="https://wa.me/923188868811"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-5 h-5 bg-[url('/whatsapp.png')] bg-contain bg-no-repeat bg-center block"
            >
            </a>
          </Button>

            {/* Instagram */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 transition-colors group text-text-primary bg-transparent rounded-2xl hover:bg-hover-mix"
            >
              <a
                href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-5 h-5 bg-[url('/instagram.png')] bg-contain bg-no-repeat bg-center block"
              >
              </a>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 transition-colors group text-text-primary bg-transparent rounded-2xl hover:bg-hover-mix"
              onClick={open}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full h-3 min-w-3 px-1 flex items-center justify-center font-medium bg-secondary text-primary">
                  {totalQty}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button (for smaller screens) */}
            <div className="md:hidden ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-10  h-10 transition-colors text-text-primary bg-transparent rounded-2xl hover:bg-hover-mix"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 rounded bg-text-primary"></div>
                  <div className="w-4 h-0.5 rounded bg-text-primary"></div>
                  <div className="w-4 h-0.5 rounded bg-text-primary"></div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
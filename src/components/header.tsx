"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, MessageCircle, Instagram } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";
import { useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";

export function Header() {
  const pathname = usePathname();
  const { open, totalQty } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="hidden md:block">
            <Logo />
          </div>

          <div className="md:hidden">
            <Link href="/" className="flex items-center relative h-14 w-14">
              <SafeImage
                src="/mealwheel.svg"
                alt="Meal Wheel"
                fill
                className="object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname === "/" ? "text-secondary" : "text-black"
              }`}
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/restaurants"
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/restaurants")
                  ? "text-secondary"
                  : "text-black"
              }`}
            >
              Restaurants
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/menu"
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/menu") ? "text-secondary" : "text-black"
              }`}
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="https://wa.me/923283688688"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>

            <Link
              href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </Link>

            <Button
              variant="secondary"
              size="icon"
              className="relative w-10 h-10"
              onClick={open}
              aria-label={
                totalQty > 0 ? `Open cart, ${totalQty} items` : "Open cart"
              }
            >
              <ShoppingCart className="h-6 w-6 cursor-pointer" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-medium bg-red-700 text-white">
                  {totalQty}
                </span>
              )}
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="relative w-10 h-10"
              onClick={open}
              aria-label={
                totalQty > 0 ? `Open cart, ${totalQty} items` : "Open cart"
              }
            >
              <ShoppingCart className="h-6 w-6 cursor-pointer" />
              {totalQty > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-medium bg-red-700 text-white">
                  {totalQty}
                </span>
              )}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-10 h-10"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              <nav className="space-y-3">
                <Link
                  href="/"
                  className={`block text-lg font-medium transition-colors ${
                    pathname === "/"
                      ? "text-secondary"
                      : "text-black hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/restaurants"
                  className={`block text-lg font-medium transition-colors ${
                    pathname?.startsWith("/restaurants")
                      ? "text-secondary"
                      : "text-black hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Restaurants
                </Link>
                <Link
                  href="/menu"
                  className={`block text-lg font-medium transition-colors ${
                    pathname?.startsWith("/menu")
                      ? "text-secondary"
                      : "text-black hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Menu
                </Link>
              </nav>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href="https://wa.me/923283688688"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Link>

                  <Link
                    href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-primary text-primary hover:bg-secondary hover:text-background transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

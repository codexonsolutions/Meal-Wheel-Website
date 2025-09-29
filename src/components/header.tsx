"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X, MessageCircle, Instagram } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";
import { useState } from "react";

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
          {/* Logo - Desktop */}
          <div className="hidden md:block">
            <Logo />
          </div>

          {/* Mobile Logo - Just the SVG icon */}
          <div className="md:hidden">
            <Link href="/" className="flex items-center">
              <img src="/mealwheel.svg" alt="Meal Wheel" className="h-8 w-8" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname === "/" ? "text-secondary" : "text-gray-700"
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
                  : "text-gray-700"
              }`}
            >
              Restaurants
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/menu"
              className={`relative text-lg font-medium transition-all duration-200 hover:text-secondary group ${
                pathname?.startsWith("/menu")
                  ? "text-secondary"
                  : "text-gray-700"
              }`}
            >
              Menu
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Desktop Social Icons and Cart */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp - white bg with shadow */}
            <Link
              href="https://wa.me/923188868811"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-foreground hover:bg-secondary hover:text-background transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
            </Link>

            {/* Instagram - white bg with shadow */}
            <Link
              href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-foreground hover:bg-secondary hover:text-background transition-colors"
            >
              <Instagram className="h-4 w-4" />
            </Link>

            {/* Cart - match size and shape */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-foreground hover:bg-secondary hover:text-background transition-colors"
              onClick={open}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full h-3 min-w-3 px-1 flex items-center justify-center font-medium bg-secondary text-white">
                  {totalQty}
                </span>
              )}
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart - match size and shape */}
            <Button
              variant="ghost"
              size="icon"
              className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-foreground hover:bg-secondary hover:text-background transition-colors"
              onClick={open}
              aria-label="Open cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 text-xs rounded-full h-3 min-w-3 px-1 flex items-center justify-center font-medium bg-secondary text-white">
                  {totalQty}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-lg transition-colors text-gray-700 bg-transparent rounded-2xl hover:bg-gray-100"
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="space-y-3">
                <Link
                  href="/"
                  className={`block text-lg font-medium transition-colors ${
                    pathname === "/"
                      ? "text-secondary"
                      : "text-gray-700 hover:text-secondary"
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
                      : "text-gray-700 hover:text-secondary"
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
                      : "text-gray-700 hover:text-secondary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Menu
                </Link>
              </nav>

              {/* Mobile Social Links */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <a
                    href="https://wa.me/923188868811"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors"
                  >
                    <div className="w-5 h-5 bg-[url('/whatsapp.png')] bg-contain bg-no-repeat bg-center"></div>
                    <span className="text-base">WhatsApp</span>
                  </a>
                  <a
                    href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-700 hover:text-secondary transition-colors"
                  >
                    <div className="w-5 h-5 bg-[url('/instagram.png')] bg-contain bg-no-repeat bg-center"></div>
                    <span className="text-base">Instagram</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

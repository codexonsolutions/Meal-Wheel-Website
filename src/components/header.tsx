"use client";
/* Header component */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const { open, totalQty } = useCart();
  return (
  <header className="sticky top-0 z-50 w-full border-b border-zinc-800/40 backdrop-blur supports-[backdrop-filter]:bg-black/60" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 95%, transparent)" }}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/Meal_Wheel_Logo_Final.svg" alt="Meal Wheel" width={40} height={40} className="rounded-lg" />
            <span className="text-3xl font-bold">
              <span style={{ color: "var(--text-secondary)" }}>Meal</span> <span style={{ color: "var(--text-primary)" }}>Wheel</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xl">
            <Link href="/" className="font-medium transition-colors" style={{ color: pathname === "/" ? "var(--text-secondary)" : "var(--text-primary)" }}>
              Home
            </Link>
            <Link href="/restaurants" className="font-medium transition-colors" style={{ color: pathname?.startsWith("/restaurants") ? "var(--text-secondary)" : "var(--text-primary)" }}>
              Restaurants
            </Link>
          </nav>
        </div>

  <div className="flex items-center gap-4">


          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-8 w-8" />
          </Button>

          {/* Social icons */}
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md overflow-hidden border transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
              style={{
                borderColor: "color-mix(in oklch, var(--text-primary) 25%, transparent)"
              }}
            >
              <Image src="/whatsapp.png" alt="WhatsApp" width={40} height={40} className="object-cover" />
            </a>
            <a
              href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 inline-flex items-center justify-center rounded-md overflow-hidden border transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-500"
              style={{
                borderColor: "color-mix(in oklch, var(--text-primary) 25%, transparent)"
              }}
            >
              <Image src="/instagram.png" alt="Instagram" width={40} height={40} className="object-cover" />
            </a>
          </div>

          <Button variant="ghost" size="icon" className="relative" onClick={open} aria-label="Open cart">
            <ShoppingCart className="h-8 w-8" />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>
                {totalQty}
              </span>
            )}
          </Button>

        </div>
      </div>
    </header>
  );
}

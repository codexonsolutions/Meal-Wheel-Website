/* Header component */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

export function Header() {
  return (
  <header className="sticky top-0 z-50 w-full border-b border-zinc-800/40 backdrop-blur supports-[backdrop-filter]:bg-black/60" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 95%, transparent)" }}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Meal Wheel" width={40} height={40} className="rounded-lg" />
            <span className="text-xl font-bold">
              <span style={{ color: "var(--text-secondary)" }}>Meal</span> <span style={{ color: "var(--text-primary)" }}>Wheel</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors" style={{ color: "var(--text-primary)" }}>
              Home
            </Link>
            <Link href="/restaurants" className="text-sm font-medium transition-colors" style={{ color: "var(--text-primary)" }}>
              Restaurants
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors" style={{ color: "var(--text-primary)" }}>
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 min-w-[300px]" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 75%, white 5%)" }}>
            <Search className="h-4 w-4" style={{ color: "color-mix(in oklch, var(--text-primary) 60%, var(--app-bg))" }} />
            <input
              type="text"
              placeholder="Search restaurants or dishes..."
              className="bg-transparent border-none outline-none flex-1 text-sm"
              style={{ color: "var(--text-primary)" }}
            />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 text-xs rounded-full h-5 w-5 flex items-center justify-center" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>
              2
            </span>
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

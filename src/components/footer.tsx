/* Footer component */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
  <footer className="border-t border-zinc-800/40" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 70%, transparent)" }}>
      <div className="container max-w-screen-xl px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/images/meal-wheel-logo.svg" alt="Meal Wheel" width={32} height={32} className="rounded-lg" />
              <span className="text-lg font-bold">
                <span style={{ color: "var(--text-secondary)" }}>Meal</span> <span style={{ color: "var(--text-primary)" }}>Wheel</span>
              </span>
            </Link>
            <p className="text-sm max-w-xs" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>
              Bringing delicious food from your favorite restaurants right to your doorstep, fast and fresh.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8"><Facebook className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Twitter className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Instagram className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/restaurants" className="block text-sm transition-colors" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>All Restaurants</Link>
              <Link href="/cuisines" className="block text-sm transition-colors" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Cuisines</Link>
              <Link href="/deals" className="block text-sm transition-colors" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Deals & Offers</Link>
              <Link href="/about" className="block text-sm transition-colors" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>About Us</Link>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}><Phone className="h-4 w-4" style={{ color: "var(--text-secondary)" }} /><span>+1 (555) 123-4567</span></div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}><Mail className="h-4 w-4" style={{ color: "var(--text-secondary)" }} /><span>support@mealwheel.com</span></div>
              <div className="flex items-center gap-2 text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}><MapPin className="h-4 w-4" style={{ color: "var(--text-secondary)" }} /><span>123 Food Street, City</span></div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Newsletter</h3>
            <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>Subscribe to get updates on new restaurants and exclusive deals.</p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-zinc-800/40 mt-12 pt-8 text-center">
          <p className="text-sm" style={{ color: "color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))" }}>© 2025 Meal Wheel. All rights reserved. Made with ❤️ for food lovers.</p>
        </div>
      </div>
    </footer>
  );
}

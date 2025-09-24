"use client";
/* Header component */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const pathname = usePathname();
  const { open, totalQty } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [mobileOpen]);

  const toggleMobile = useCallback(() => setMobileOpen(o => !o), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeMobile(); }
    if (mobileOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen, closeMobile]);

  return (
  <header className="sticky top-0 z-50 w-full border-b border-zinc-800/40 backdrop-blur supports-[backdrop-filter]:bg-black/60" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 95%, transparent)" }}>
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
  <div className="flex items-center gap-3 sm:gap-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobile}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/Meal_Wheel_Logo_Final.svg" alt="Meal Wheel" width={36} height={36} className="rounded-lg" />
            <span className="text-2xl sm:text-3xl font-bold leading-none">
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

  <div className="flex items-center gap-3">



          {/* Social icons */}
          <div className="hidden sm:flex items-center gap-2 mr-1">
            <a
              href="https://wa.me/923188868811"
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
            <ShoppingCart className="h-7 w-7" />
            {totalQty > 0 && (
              <span className="absolute -top-1 -right-1 text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center" style={{ backgroundColor: "var(--text-secondary)", color: "var(--text-primary)" }}>
                {totalQty}
              </span>
            )}
          </Button>

        </div>
      </div>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={{ opacity: 0}}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
            aria-modal="true"
            role="dialog"
          >
            {/* Backdrop */}
            <motion.div
              onClick={closeMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            {/* Panel */}
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative left-0 top-0 bottom-0 w-5/6 max-w-sm border-r flex flex-col shadow-xl z-10"
              style={{ 
                backgroundColor: "var(--app-bg)",
                borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))",
                height: "100vh"
              }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}>
                <Link href="/" onClick={closeMobile} className="flex items-center gap-2">
                  <Image src="/Meal_Wheel_Logo_Final.svg" alt="Meal Wheel" width={36} height={36} className="rounded-md" />
                  <span className="text-xl font-bold"><span style={{ color: 'var(--text-secondary)' }}>Meal</span> <span style={{ color: 'var(--text-primary)' }}>Wheel</span></span>
                </Link>
                <Button variant="ghost" size="icon" onClick={closeMobile} aria-label="Close menu">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 px-6 py-8 min-h-0">
                <ul className="space-y-2 text-xl">
                  <li>
                    <Link
                      href="/"
                      onClick={closeMobile}
                      className="block font-medium py-2 rounded-lg px-3 transition-colors"
                      style={{ 
                        color: pathname === '/' ? 'var(--text-secondary)' : 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'color-mix(in oklch, var(--text-primary) 8%, var(--app-bg))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/restaurants"
                      onClick={closeMobile}
                      className="block font-medium py-2 rounded-lg px-3 transition-colors"
                      style={{ 
                        color: pathname?.startsWith('/restaurants') ? 'var(--text-secondary)' : 'var(--text-primary)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'color-mix(in oklch, var(--text-primary) 8%, var(--app-bg))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Restaurants
                    </Link>
                  </li>
                </ul>
                <div className="mt-12 border-t pt-8" style={{ borderColor: "color-mix(in oklch, var(--text-primary) 20%, var(--app-bg))" }}>
                  <p className="text-sm mb-4 font-medium" style={{ color: 'color-mix(in oklch, var(--text-primary) 70%, var(--app-bg))' }}>Connect with us</p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://wa.me/923188868811"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-10 h-10 inline-flex items-center justify-center rounded-md overflow-hidden border transition hover:opacity-90"
                      style={{ borderColor: 'color-mix(in oklch, var(--text-primary) 25%, transparent)' }}
                    >
                      <Image src="/whatsapp.png" alt="WhatsApp" width={40} height={40} className="object-cover" />
                    </a>
                    <a
                      href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="w-10 h-10 inline-flex items-center justify-center rounded-md overflow-hidden border transition hover:opacity-90"
                      style={{ borderColor: 'color-mix(in oklch, var(--text-primary) 25%, transparent)' }}
                    >
                      <Image src="/instagram.png" alt="Instagram" width={40} height={40} className="object-cover" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

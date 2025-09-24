/* Footer component */
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export function Footer() {
  return (
  <footer className="border-t border-zinc-800/40" style={{ backgroundColor: "color-mix(in oklch, var(--app-bg) 90%, transparent)" }}>
        <div className="py-3 text-center">
          <p className="text-sm leading-none" style={{ color: "color-mix(in oklch, var(--text-primary) 90%, var(--app-bg))" }}>© 2025 Meal Wheel. All rights reserved. Made for food lovers.</p>
        </div>
    </footer>
  );
}

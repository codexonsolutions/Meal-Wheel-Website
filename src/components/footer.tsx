import Link from "next/link";
import { MessageCircle, Instagram, Phone, Mail } from "lucide-react";
import Logo from "./ui/logo";

export function Footer() {
  return (
    <footer className="bg-bg-secondary mt-16">
      <div className="w-full h-px bg-border-mix mb-0"></div>
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-foreground/70 leading-relaxed">
              Delicious meals delivered fresh to your doorstep. Experience the best flavors from local restaurants.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://wa.me/923188868811"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-hover-mix text-foreground hover:bg-secondary hover:text-background transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.instagram.com/mealwheelpk/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-hover-mix text-foreground hover:bg-secondary hover:text-background transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Restaurants
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                  Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-foreground/70">
                <Phone className="h-4 w-4" />
                <span>+92 318 886 8811</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground/70">
                <Mail className="h-4 w-4" />
                <span>hello@mealwheel.pk</span>
              </li>
            </ul>
            <div className="text-sm text-foreground/70">
              <p className="font-medium text-foreground">Operating Hours</p>
              <p>6:00 PM - 2:00 AM</p>
              <p>Every Day</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Order Now</h3>
            <p className="text-sm text-foreground/70">
              Ready to satisfy your cravings? Browse our menu and order your favorite meals.
            </p>
            <Link 
              href="/menu"
              className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-background text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/70">
              © 2025 Meal Wheel. All rights reserved. Made for food lovers.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-foreground/70 hover:text-secondary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
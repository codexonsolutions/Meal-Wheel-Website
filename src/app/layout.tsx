/* Root layout for Meal Wheel application */
import { AdminProvider } from "@/store/admin-store";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Wheel - Food Delivery Made Simple",
  description: "Order from your favorite restaurants with Meal Wheel",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
              <AdminProvider>
                <CartProvider>
                  <Header />
                  <Suspense fallback={null}>{children}</Suspense>
                  <Footer />
                  <CartDrawer />
                </CartProvider>
              </AdminProvider>
        <Analytics />
      </body>
    </html>
  );
}

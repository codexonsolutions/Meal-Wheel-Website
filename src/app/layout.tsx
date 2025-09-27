/* Root layout for Meal Wheel application */
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@vercel/analytics/react";
import CountdownModal from "@/components/countdown-modal";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Wheel - Food Delivery Made Simple",
  description: "Order from your favorite restaurants with Meal Wheel",
  icons: {
    icon: "/mealwheel.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} font-sans antialiased`}>
        <CartProvider>
          <CountdownModal />
          <Header />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <CartDrawer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}
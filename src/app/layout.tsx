import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Analytics } from "@vercel/analytics/react";
import CountdownModal from "@/components/countdown-modal";
import { BetaBanner } from "@/components/beta-banner";
import Script from "next/script";
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
    <html lang="en">
      <head>
        <Script id="crisp-chat" strategy="afterInteractive">
          {`
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "c2334a78-30ea-428c-8082-08585251aab1";
            (function() {
              var d = document;
              var s = d.createElement("script");
              s.src = "https://client.crisp.chat/l.js";
              s.async = 1;
              d.getElementsByTagName("head")[0].appendChild(s);
            })();
          `}
        </Script>
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        <CartProvider>
          <CountdownModal />
          {/* <BetaBanner /> */}
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

"use client";

import { Button } from "./ui/button";
import Logo from "./ui/logo";

export const BetaBanner = () => {
  const handleWhatsAppRedirect = () => {
    // Replace this with your actual WhatsApp business number
    const whatsappNumber = "923188868811";
    const message = encodeURIComponent("Hi! I'd like to place an order.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-[#FFFFFF] p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] text-[#FF6B35]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <p className="text-lg font-semibold">
            We are finalizing a few things. Please use WhatsApp to place your
            order.
          </p>
          <Button onClick={handleWhatsAppRedirect}>Order on WhatsApp</Button>
        </div>
      </div>
    </div>
  );
};

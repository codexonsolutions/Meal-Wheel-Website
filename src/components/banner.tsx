"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Logo from "./ui/logo";

export const Banner = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL;
    if (!base) return;
    (async () => {
      try {
        const res = await fetch(`${base}/status`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (data && typeof data.status === "boolean")
          setIsAvailable(!!data.status);
      } catch (_) {
        // keep default
      }
    })();
  }, []);

  const handleWhatsAppRedirect = () => {
    const whatsappNumber = "923283688688";
    const message = encodeURIComponent("Hi! I'd like to place an order.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (isAvailable) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-[#FFFFFF] p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] text-[#FF6B35]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <p className="text-lg font-semibold text-neutral-600">
            We are currently not taking orders. Please use WhatsApp to chat.
          </p>
          <Button onClick={handleWhatsAppRedirect}>Contact on WhatsApp</Button>
        </div>
      </div>
    </div>
  );
};

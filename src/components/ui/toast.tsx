"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { XIcon, InfoIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "default" | "error" | "info" | "success";

type ToastItem = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms
};

const ToastContext = React.createContext<{
  toast: (t: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
} | null>(null);

// ✨ Smoother animations with transform and GPU acceleration
const toastVariants = cva(
  "pointer-events-auto relative overflow-hidden w-[340px] max-w-[90vw] rounded-md shadow-md text-sm flex items-start gap-3 p-3 transition-all will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        error: "bg-red-600 text-white",
        info: "bg-blue-600 text-white",
        success: "bg-green-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconClasses = "shrink-0 mt-0.5";

function VariantIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "error":
      return <XCircleIcon className={cn(iconClasses)} />;
    case "info":
      return <InfoIcon className={cn(iconClasses)} />;
    case "success":
      return <CheckCircle2Icon className={cn(iconClasses)} />;
    default:
      return <InfoIcon className={cn(iconClasses)} />;
  }
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem & { state: "open" | "closed" };
  onClose: (id: string) => void;
}) {
  const variant = item.variant ?? "default";
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Trigger entrance animation on mount
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  return (
    <div
      data-slot="toast"
      data-state={item.state}
      className={cn(toastVariants({ variant }))}
      role="status"
      aria-live="polite"
      style={{
        transform:
          mounted && item.state === "open"
            ? "translateX(0)"
            : "translateX(120%)",
        opacity: mounted && item.state === "open" ? 1 : 0,
        transition:
          "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
      }}
    >
      <VariantIcon variant={variant} />
      <div className="flex-1 min-w-0">
        {item.title && (
          <div className="font-medium leading-none truncate">{item.title}</div>
        )}
        {item.description && (
          <div className="text-sm opacity-90 mt-0.5 break-words">
            {item.description}
          </div>
        )}
      </div>
      <button
        type="button"
        aria-label="Close"
        onClick={() => onClose(item.id)}
        className="rounded-xs p-1 opacity-80 hover:opacity-100 transition-opacity cursor-pointer [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <XIcon />
      </button>
      {/* Progress bar */}
      {item.duration && item.duration > 0 ? (
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/25">
          <div
            className="h-full bg-white/90"
            style={{
              animation: `toast-progress ${item.duration}ms linear forwards`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<
    Array<ToastItem & { state: "open" | "closed" }>
  >([]);

  const dismiss = React.useCallback((id: string) => {
    const CLOSE_ANIMATION_MS = 300;

    // Mark as closed to trigger exit animation
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, state: "closed" } : t))
    );

    // Remove after animation completes
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, CLOSE_ANIMATION_MS);
  }, []);

  const toast = React.useCallback(
    (t: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duration = t.duration ?? 4000;
      const item: ToastItem & { state: "open" } = {
        id,
        title: t.title,
        description: t.description,
        variant: t.variant ?? "default",
        duration,
        state: "open",
      };
      setItems((prev) => [item, ...prev]);
      if (duration > 0) {
        window.setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        data-slot="toast-viewport"
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-auto max-w-full flex-col items-end gap-2"
      >
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onClose={dismiss} />
        ))}
      </div>
      <style jsx global>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
            transform-origin: left;
          }
          to {
            transform: scaleX(0);
            transform-origin: left;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export type { ToastVariant };

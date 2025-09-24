"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

/* Simple reusable animated food tile that can accept an SVG / emoji / custom node */
export function AnimatedFood({
  children,
  gradient,
  size = "square",
  delay = 0,
  float = true,
  shape = "square",
}: {
  children: ReactNode;
  gradient: string;
  size?: "square" | "landscape";
  delay?: number;
  float?: boolean;
  shape?: "square" | "circle" | "blob" | "diamond" | "pill";
}) {
  const aspect = size === "square" ? "aspect-square" : "aspect-[4/3]";

  const baseShapeClass = (() => {
    switch (shape) {
      case "circle":
        return "rounded-full";
      case "pill":
        return "rounded-full";
      case "diamond":
        return "rounded-[2rem]"; // base before rotation wrapper
      case "blob":
        return "rounded-[2rem]"; // clip-path will override exact edges
      default:
        return "rounded-2xl";
    }
  })();

  const clipStyles: Record<string, React.CSSProperties | undefined> = {
    blob: {
      clipPath:
        "polygon(60% 0%, 80% 10%, 100% 35%, 95% 70%, 75% 90%, 45% 100%, 20% 95%, 5% 70%, 0% 40%, 15% 15%)",
    },
  };

  const container = (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={`${aspect} ${baseShapeClass} p-6 flex items-center justify-center relative overflow-hidden ${gradient}`}
      style={clipStyles[shape]}
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
      {float ? (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4 + delay, ease: "easeInOut" }}
          className="text-6xl md:text-7xl drop-shadow-lg select-none"
        >
          {children}
        </motion.div>
      ) : (
        <div className="text-6xl md:text-7xl">{children}</div>
      )}
    </motion.div>
  );

  if (shape === "diamond") {
    return (
      <div className={`${aspect} relative`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full rotate-45">{container}</div>
        </div>
      </div>
    );
  }

  if (shape === "pill") {
    // Force a pill aspect if square selected
    return (
      <div className={`relative ${size === "square" ? "aspect-[5/6]" : aspect}`}>{container}</div>
    );
  }

  return container;
}

export function SparkleRing({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
    >
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,var(--text-secondary)_0deg,transparent_90deg)] opacity-20" />
    </motion.div>
  );
}

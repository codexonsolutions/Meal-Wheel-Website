/* Minimal Button component for styling and usage parity */
import * as React from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
}

const sizeClass = {
  sm: "h-9 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-6",
  icon: "h-10 w-10 p-0",
} as const satisfies Record<NonNullable<ButtonProps["size"]>, string>;

const variantClass = {
  default: "bg-orange-500 text-white hover:bg-orange-600",
  outline: "border border-zinc-800 bg-transparent hover:bg-zinc-800/40",
  ghost: "hover:bg-zinc-800/40",
} as const satisfies Record<NonNullable<ButtonProps["variant"]>, string>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClass[size],
          variantClass[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

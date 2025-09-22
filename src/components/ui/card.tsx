/* Card primitive */
import * as React from "react";
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-4", className)} {...props} />;
}

/* Badge primitive */
import * as React from "react";
import clsx from "clsx";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-medium text-zinc-200",
        className
      )}
      {...props}
    />
  );
}

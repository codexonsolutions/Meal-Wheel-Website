import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="min-h-[60vh] flex items-center px-4 py-12">
      <div className="container mx-auto">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-5xl font-bold">
            <span className="text-secondary">404</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-foreground/70">
            Page not found. Let’s get you back home.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

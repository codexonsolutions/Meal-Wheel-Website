"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

function StarRating({
  label,
  value,
  onChange,
  idPrefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  idPrefix: string;
}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-foreground/80">{label}</div>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
          const active = value >= n;
          return (
            <button
              key={n}
              type="button"
              aria-label={`${label} ${n}`}
              onClick={() => onChange(n)}
              className="cursor-pointer"
            >
              <Star
                className={
                  "h-6 w-6 transition-colors " +
                  (active ? "text-secondary" : "text-gray-300")
                }
                fill={active ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function SurveyPage() {
  const [email, setEmail] = useState("");
  const [foodQuality, setFoodQuality] = useState(0);
  const [serviceQuality, setServiceQuality] = useState(0);
  const [suggestion, setSuggestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const t = setTimeout(() => {
      router.push("/");
    }, 1200);
    return () => clearTimeout(t);
  }, [successOpen, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (foodQuality < 1 || serviceQuality < 1) {
      toast({
        title: "Missing ratings",
        description: "Please rate both Food Quality and Quality of Service.",
      });
      return;
    }
    try {
      setSubmitting(true);
      const base = process.env.NEXT_PUBLIC_API_URL;
      if (!base) throw new Error("Missing NEXT_PUBLIC_API_URL");
      const res = await fetch(`${base}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim() || undefined,
          foodQuality,
          serviceQuality,
          suggestion: suggestion.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error || "Failed to submit survey";
        throw new Error(msg);
      }
      setSuccessOpen(true);
      setEmail("");
      setFoodQuality(0);
      setServiceQuality(0);
      setSuggestion("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Submission failed",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <section className="relative py-12 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="container relative z-10 max-w-screen-md px-4">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold">
              We value your <span className="text-secondary">feedback</span>
            </h1>
            <p className="mt-2 text-foreground/70">
              Help us improve Meal Wheel.
            </p>
          </div>

          <Card className="p-0 overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-[5px]"
                  />
                </div>

                <StarRating
                  label="Food Quality (Rate out of 5)"
                  value={foodQuality}
                  onChange={setFoodQuality}
                  idPrefix="food-quality"
                />

                <StarRating
                  label="Quality of Service (Rate out of 5)"
                  value={serviceQuality}
                  onChange={setServiceQuality}
                  idPrefix="service-quality"
                />

                <div className="space-y-3">
                  <label htmlFor="suggestion" className="text-sm font-medium">
                    Suggestion Box
                  </label>
                  <Textarea
                    id="suggestion"
                    rows={5}
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    placeholder="Share your ideas, concerns, or compliments."
                    className="mt-[5px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={submitting}
                    className="w-full sm:w-auto"
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Submitted successfully</DialogTitle>
            <DialogDescription>
              Thank you for your feedback. Redirecting to the home page...
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

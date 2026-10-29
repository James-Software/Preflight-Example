"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WaitlistForm() {
  const [email, setEmail] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmail("");
    toast.success("You have entered the waitlist!");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Label htmlFor="waitlist-email" className="text-sm font-medium">
        Email address
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-describedby="email-note"
          maxLength={254}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="h-12 min-h-12 min-w-0 sm:flex-1 rounded-lg bg-white px-3.5 text-base sm:text-sm"
        />
        <Button type="submit" className="h-12 gap-2 rounded-lg px-5 text-sm">
          Join the waitlist
          <ArrowRight className="size-4" aria-hidden="true" />
        </Button>
      </div>
      <p id="email-note" className="text-xs leading-relaxed text-muted-foreground">
        Just an invitation when we’re ready. Nothing else.
      </p>
    </form>
  );
}

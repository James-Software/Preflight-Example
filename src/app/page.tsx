import { ArrowUpRight, BookOpen, Feather, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistForm } from "@/components/waitlist-form";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col px-6 sm:px-10">
      <header className="flex items-center justify-between py-7 sm:py-9">
        <a href="/" aria-label="Margin home" className="inline-flex items-center gap-2.5 text-xl font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
            <Feather className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </span>
          margin<span className="-ml-2 text-stone-400">.</span>
        </a>
        <span className="text-xs text-muted-foreground">A little room for your ideas.</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center pb-14 pt-12 sm:pb-20 sm:pt-16">
        <Badge variant="outline" className="mb-7 gap-2 rounded-full border-stone-200 bg-white px-3 py-1.5 font-normal text-stone-600">
          <span className="size-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
          Something good is taking shape
        </Badge>

        <h1 className="max-w-3xl text-balance text-center text-[clamp(2.65rem,6.8vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.055em]">
          Less noise.<br />
          <span className="text-stone-500">More room to think.</span>
        </h1>
        <p className="mt-6 max-w-[28rem] text-pretty text-center text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          A calmer home for your notes, ideas, and the little things you don’t want to lose.
        </p>

        <Card className="mt-10 w-full max-w-xl rounded-2xl border-stone-200/80 bg-white py-0 shadow-[0_6px_28px_-18px_rgba(28,25,23,0.22)] sm:mt-12">
          <CardContent className="p-6 sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-medium tracking-tight">Be the first to find your space.</h2>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">Leave your email. We’ll be in touch with early access.</p>
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-100 text-stone-500">
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </span>
            </div>
            <WaitlistForm />
          </CardContent>
        </Card>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-muted-foreground sm:gap-x-8">
          <span className="inline-flex items-center gap-1.5"><BookOpen className="size-3.5" aria-hidden="true" />A home for your thoughts</span>
          <span className="inline-flex items-center gap-1.5"><Sparkles className="size-3.5" aria-hidden="true" />Intentionally simple</span>
        </div>
      </main>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/70 py-6 text-xs text-muted-foreground">
        <span>© Margin</span>
        <span>Good ideas deserve a little breathing room.</span>
      </footer>
    </div>
  );
}

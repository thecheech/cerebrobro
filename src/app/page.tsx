import { BookLink } from "@/components/book-link";
import { site } from "@/lib/site";

const path = [
  "Brief",
  "Reference images",
  "Generations",
  "Select",
  "Client deliverable",
];

const ctaClass =
  "inline-flex items-center justify-center bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 py-8 sm:px-10 sm:py-12">
      <header className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-line pb-5">
        <a href="#top" className="text-sm font-medium tracking-wide">
          {site.name}
        </a>
        <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2 text-sm">
          <a href="#work" className="text-muted">
            What we do
          </a>
          <a href="#about" className="text-muted">
            About
          </a>
          <BookLink className="font-medium">Talk to Koby</BookLink>
        </nav>
      </header>

      <main id="top" className="flex flex-col">
        <section className="border-b border-line py-14 sm:py-20">
          <p className="text-sm text-accent">AI systems for creative production.</p>
          <p className="mt-8 text-sm text-muted">
            You&apos;re already experimenting with AI.
          </p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-[1.15] font-medium tracking-tight sm:text-5xl sm:leading-[1.12]">
            You don&apos;t need another AI workshop. You need AI that works in
            production.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8">
            If your team is experimenting with Midjourney, Flux, Runway, Kling,
            Veo, or whatever shipped last week, I can help you figure out what
            is actually worth putting into production.
          </p>

          <ol className="mt-10 grid gap-px bg-line sm:grid-cols-5">
            {path.map((step, index) => (
              <li key={step} className="bg-background px-3 py-4">
                <span className="font-serif text-sm text-accent">0{index + 1}</span>
                <p className="mt-2 text-sm leading-5">{step}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <BookLink className={ctaClass}>Talk to Koby →</BookLink>
            <p className="mt-3 text-sm text-muted">20 minutes. No sales deck.</p>
          </div>
        </section>

        <section
          id="about"
          className="grid scroll-mt-8 gap-6 border-b border-line py-14 sm:grid-cols-[10rem_1fr] sm:py-16"
        >
          <h2 className="text-sm text-muted">About</h2>
          <div className="max-w-xl space-y-5 text-lg leading-8">
            <p>
              I&apos;m Koby Karp. I&apos;ve spent the last several years building
              and operating AI image and video products, from the models and the
              infrastructure to how the work gets found and paid for.
            </p>
            <p>I&apos;m not here to teach your team what ChatGPT is.</p>
          </div>
        </section>

        <section
          id="work"
          className="grid scroll-mt-8 gap-6 border-b border-line py-14 sm:grid-cols-[10rem_1fr] sm:py-16"
        >
          <h2 className="text-sm text-muted">What we do</h2>
          <div className="max-w-xl space-y-5 text-lg leading-8">
            <p>
              You already have someone making frames. A client is going to ask
              you to do it on a job. The question is whether you can brief it,
              review it, price it, and do it again next month.
            </p>
            <p>
              On the call we look at one client ask. If there&apos;s a line worth
              installing, I send a proposal the same day. Two weeks. $5,000, or
              $7,500 when the review bar or the client makes it heavier. I stay
              through one live job. Then your producers run it.
            </p>
          </div>
        </section>

        <section id="talk" className="scroll-mt-8 py-14 sm:py-16">
          <h2 className="max-w-xl font-serif text-3xl leading-tight font-medium sm:text-4xl">
            Talk to Koby.
          </h2>
          <p className="mt-4 text-lg text-muted">20 minutes. No sales deck.</p>
          <div className="mt-8">
            <BookLink className={ctaClass}>Talk to Koby →</BookLink>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-line pt-6 text-sm text-muted">
        Koby Karp
      </footer>
    </div>
  );
}

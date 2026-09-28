import Link from "next/link";
import { HeroStill, Machine } from "@/components/machine";
import { Wordmark } from "@/components/mark";
import { contactEmail, contactHref } from "@/lib/site";

const steps = [
  {
    num: "1",
    title: "A 20-minute call",
    body: "You show me the brief, the workflow, or the job everyone avoids.",
  },
  {
    num: "2",
    title: "A working session",
    body: "If it's worth it, we spend 60–90 minutes on that one workflow and try things for real.",
  },
  {
    num: "3",
    title: "An answer",
    body: "You leave with a working prototype, or a clear reason not to bother.",
  },
];

const beliefs = [
  "Most AI ads still look like AI ads.",
  "The model is rarely the bottleneck. The workflow usually is.",
  "Automating mediocre creative just gets you more of it.",
  "Find one thing worth scaling before you build an AI department.",
];

export default function Home() {
  return (
    <div className="page">
      <header className="nav">
        <Link className="brand" href="/">
          <Wordmark />
        </Link>
        <nav aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#how">How it works</a>
          <a href="#about">About</a>
          <a className="nav-cta" href={contactHref}>
            Book a call
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1>
              <span>Your agency has enough AI experiments.</span>
              Show me something your team <mark>hates making.</mark>
            </h1>
            <p className="hero-sub">
              In 20 minutes I&apos;ll tell you if AI can actually make it
              better. If it can&apos;t, I&apos;ll say so.
            </p>
            <div className="actions">
              <a className="button" href={contactHref}>
                Book a 20-min call
              </a>
              <a className="text-link" href="#work">
                See the work
              </a>
            </div>
          </div>
          <HeroStill />
        </section>

        <Machine />

        <section className="how" id="how">
          <h2>How it works</h2>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.num}>
                <span className="step-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="beliefs" id="beliefs">
          <div className="beliefs-inner">
            <h2>What I&apos;ve learned</h2>
            <ul>
              {beliefs.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="about" id="about">
          <div className="about-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lab/koby/koby-4x5.jpg"
              alt="Koby Karp"
              width={614}
              height={768}
            />
          </div>
          <div className="about-copy">
            <h2>I&apos;m Koby.</h2>
            <p>
              I&apos;ve spent the last few years building and running AI image
              and video products: the models, the GPUs, the costs, the users,
              and the bad generations nobody puts in the demo.
            </p>
            <p>CerebroBro is where I use that on your creative work.</p>
          </div>
        </section>

        <section className="closer" id="contact">
          <div className="closer-inner">
            <h2>Got something your team hates making?</h2>
            <p>Book 20 minutes. If AI can&apos;t help, you&apos;ll hear it from me.</p>
            <a className="button button-ink" href={contactHref}>
              Book a 20-min call
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <Wordmark />
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </div>
      </footer>
    </div>
  );
}

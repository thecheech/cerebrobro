import Link from "next/link";
import { HeroStill, Machine } from "@/components/machine";
import { Mark, Wordmark } from "@/components/mark";
import { contactHref, site } from "@/lib/site";

const beliefs = [
  "Most AI-generated advertising still looks like AI-generated advertising.",
  "The model isn't usually the bottleneck.",
  "Don't automate mediocre creative.",
  "Don't build an AI department before you've found something worth scaling.",
];

const method = [
  {
    num: "01",
    title: "Show me the work",
    body: "What are you actually trying to make?",
  },
  {
    num: "02",
    title: "Let's break it",
    body: "Where does the current process suck?",
  },
  {
    num: "03",
    title: "Make one thing better",
    body: "We build the smallest useful workflow and test it on real work.",
  },
];

const offer = [
  {
    title: "You bring",
    body: "A brief, workflow, production problem, or client request.",
  },
  {
    title: "We do",
    body: "Pull it apart, test what's possible, and figure out where AI genuinely helps.",
  },
  {
    title: "You leave with",
    body: "A working prototype — or a very clear “don't bother.”",
  },
];

export default function Home() {
  return (
    <div className="page">
      <header className="nav">
        <Link className="brand" href="/" aria-label={site.name}>
          <Wordmark size="nav" />
        </Link>
        <nav aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#pov">POV</a>
          <a href="#koby">Koby</a>
          <a className="nav-talk" href={contactHref}>
            Talk to Koby
          </a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="hero-brand" aria-label={site.name}>
              <Wordmark size="hero" />
            </p>
            <p className="eyebrow">You&apos;re already playing with AI.</p>
            <h1>
              <span>Your agency has enough AI experiments.</span>
              Show me something your team <mark>hates making.</mark>
            </h1>
            <div className="actions">
              <a className="button button-hero" href={contactHref}>
                Talk to Koby
                <span className="button-meta">20 min</span>
              </a>
              <a className="text-link" href="#work">
                Show me the work →
              </a>
            </div>
            <p className="hero-ask">
              We find the creative workflows where AI can actually save your
              team time, money, or production pain.
            </p>
          </div>

          <HeroStill />
          <Machine />
        </section>

        <section className="method" id="method">
          <div className="method-intro">
            <h2>I don&apos;t start with the model.</h2>
            <p>
              Don&apos;t show me your AI stack. Show me what you&apos;re trying
              to make.
            </p>
          </div>
          <div className="method-list">
            {method.map((step) => (
              <div key={step.num} className="method-step">
                <span className="block-num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="offer" id="offer">
          <div className="offer-step">
            <p className="eyebrow">20 min — first conversation</p>
            <h2>Bring me the annoying thing.</h2>
            <p className="lede">
              We&apos;ll figure out whether it&apos;s worth exploring.
            </p>
          </div>
          <div className="offer-step offer-step-next">
            <p className="eyebrow">If there&apos;s something worth building</p>
            <p className="lede">
              We run a focused 60–90 minute working session around one real
              workflow.
            </p>
            <div className="offer-grid">
              {offer.map((item) => (
                <div key={item.title} className="offer-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pov" id="pov">
          <div className="pov-head">
            <h2>Things I believe</h2>
            <p className="theatre">No AI theatre.</p>
          </div>
          <ul className="beliefs">
            {beliefs.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="theatre-sub">
            No innovation workshops where everyone leaves excited and nothing
            ships.
          </p>
        </section>

        <section className="operator" id="koby">
          <div className="operator-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lab/koby/koby-4x5.jpg"
              alt="Koby"
              width={614}
              height={768}
            />
          </div>
          <div className="operator-copy">
            <p className="eyebrow">The operator</p>
            <h2>I&apos;m Koby.</h2>
            <p>
              I&apos;ve spent the last few years building and running AI image
              and video products. I&apos;ve dealt with the models, APIs, GPUs,
              costs, users, shitty generations and everything else that happens
              between &ldquo;cool demo&rdquo; and &ldquo;this actually
              works.&rdquo;
            </p>
            <p>
              CerebroBro is the consulting practice that comes out of that —
              not a deck about the future of creativity.
            </p>
            <p className="operator-proof">
              AI image &amp; video products · years in production · not a
              workshop guy
            </p>
          </div>
        </section>

        <section className="invite" id="contact">
          <Mark className="invite-mark" plate="transparent" />
          <div className="invite-copy">
            <h2>Show me something your team hates making.</h2>
            <p>
              20 minutes. No AI theatre. If I don&apos;t think AI can help,
              I&apos;ll tell you.
            </p>
            <a className="button button-ink" href={contactHref}>
              Talk to Koby
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-brand" aria-label={site.name}>
            <Wordmark size="footer" />
          </span>
          <span>Built by Koby.</span>
        </div>
      </footer>
    </div>
  );
}

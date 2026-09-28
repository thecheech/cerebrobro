"use client";

import { useState } from "react";

interface Asset {
  src: string;
  label: string;
  kind?: "image" | "video";
}

interface Experiment {
  id: string;
  title: string;
  note: string;
  assets: Asset[];
}

const experiments: Experiment[] = [
  {
    id: "worlds",
    title: "One product, many worlds",
    note: "One plain product shot, restaged in completely different art directions. The bottle never changes.",
    assets: [
      { src: "/lab/perfume/perfume-ref-03.png", label: "Original" },
      { src: "/lab/perfume/world-alpine.png", label: "Alpine" },
      { src: "/lab/perfume/world-brutalist.png", label: "Brutalist" },
      { src: "/lab/perfume/world-still-life.png", label: "Still life" },
      { src: "/lab/perfume/world-greenhouse.png", label: "Greenhouse" },
      { src: "/lab/perfume/world-studio-void.png", label: "Studio" },
      { src: "/lab/perfume/world-rain-city.png", label: "Rain city" },
    ],
  },
  {
    id: "character",
    title: "One face, many scenes",
    note: "Lock a character once, then move her between locations without her turning into someone else.",
    assets: [
      { src: "/lab/character/character-ref-01.png", label: "Original" },
      { src: "/lab/scenes/char-museum.png", label: "Museum" },
      { src: "/lab/scenes/char-cafe.png", label: "Cafe" },
      { src: "/lab/scenes/char-coast.png", label: "Coast" },
      { src: "/lab/scenes/char-workspace.png", label: "Studio" },
      { src: "/lab/motion/motion-character.mp4", label: "Motion", kind: "video" },
    ],
  },
  {
    id: "motion",
    title: "From still to motion",
    note: "Stills turned into short clips. Slow camera, moving fabric, and the product stays exactly where it was.",
    assets: [
      { src: "/lab/hero/hero-01.png", label: "Still" },
      { src: "/lab/motion/motion-hero-push.mp4", label: "Push-in", kind: "video" },
      { src: "/lab/hero/hero-02.png", label: "Still" },
      { src: "/lab/motion/motion-hero-parallax.mp4", label: "Parallax", kind: "video" },
      { src: "/lab/hero/hero-04.png", label: "Still" },
    ],
  },
];

export function Machine() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const experiment = experiments[active];
  const featured =
    experiment.assets[Math.min(selected, experiment.assets.length - 1)];
  const isVideo = featured.kind === "video";

  return (
    <section className="lab" id="work">
      <div className="lab-head">
        <h2>Experiments</h2>
        <p>Made for CerebroBro to test what works. Not client work.</p>
      </div>

      <div className="lab-tabs" role="tablist" aria-label="Experiments">
        {experiments.map((exp, i) => (
          <button
            key={exp.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? "is-active" : undefined}
            onClick={() => {
              setActive(i);
              setSelected(0);
            }}
          >
            {exp.title}
          </button>
        ))}
      </div>

      <div className="lab-stage">
        <aside className="lab-side">
          <h3>{experiment.title}</h3>
          <p>{experiment.note}</p>
          <div className="lab-thumbs" role="list">
            {experiment.assets.map((asset, i) => (
              <button
                key={asset.src}
                type="button"
                role="listitem"
                className={i === selected ? "is-active" : undefined}
                onClick={() => setSelected(i)}
                aria-label={`Show ${asset.label}`}
              >
                {asset.kind === "video" ? (
                  <video src={asset.src} muted playsInline preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.src} alt="" width={464} height={576} />
                )}
                <span>{asset.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="lab-viz" data-kind={isVideo ? "video" : "image"}>
          {isVideo ? (
            <video
              key={featured.src}
              src={featured.src}
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featured.src}
              alt={`${experiment.title}: ${featured.label}`}
              width={1856}
              height={2304}
            />
          )}
        </div>
      </div>
    </section>
  );
}

export function HeroStill() {
  return (
    <figure className="hero-still">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lab/hero/hero-01.png"
        alt="Campaign still of a black running shoe on stone with flowing fabric"
        width={1856}
        height={2304}
      />
      <figcaption>Experiment, not client work.</figcaption>
    </figure>
  );
}

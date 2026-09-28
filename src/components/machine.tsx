"use client";

import { useState } from "react";

type Asset = {
  src: string;
  label: string;
  kind?: "image" | "video";
};

type Experiment = {
  id: string;
  label: string;
  title: string;
  caption: string;
  note: string;
  assets: Asset[];
};

const experiments: Experiment[] = [
  {
    id: "worlds",
    label: "01 — One object, many worlds",
    title: "One object → many worlds",
    caption: "ONE PLAIN SHOE → MULTIPLE ART DIRECTIONS",
    note: "Start with a boring product still. Then build distinct production worlds without redesigning the object.",
    assets: [
      { src: "/lab/product/product-ref-01.png", label: "Reference" },
      { src: "/lab/worlds/world-alpine.png", label: "Alpine" },
      { src: "/lab/worlds/world-brutalist.png", label: "Brutalist" },
      { src: "/lab/worlds/world-liquid.png", label: "Liquid" },
      { src: "/lab/worlds/world-desert.png", label: "Desert" },
      { src: "/lab/worlds/world-studio-night.png", label: "Studio night" },
      { src: "/lab/worlds/world-rain-city.png", label: "Rain city" },
    ],
  },
  {
    id: "character",
    label: "02 — Character lock",
    title: "One character → many scenes",
    caption: "ONE FACE → MULTIPLE SCENES",
    note: "Lock an identity first. Then put her in different places without drifting into a new person each time.",
    assets: [
      { src: "/lab/character/character-ref-01.png", label: "Lock" },
      { src: "/lab/scenes/char-museum.png", label: "Museum" },
      { src: "/lab/scenes/char-cafe.png", label: "Cafe" },
      { src: "/lab/scenes/char-coast.png", label: "Coast" },
      { src: "/lab/scenes/char-workspace.png", label: "Studio" },
      {
        src: "/lab/motion/motion-character.mp4",
        label: "Motion",
        kind: "video",
      },
    ],
  },
  {
    id: "motion",
    label: "03 — Still → motion",
    title: "Still → motion",
    caption: "ONE STILL → CINEMATIC MOTION",
    note: "Same universe as the still. Quiet camera. Fabric and atmosphere move. The product stays locked.",
    assets: [
      { src: "/lab/hero/hero-01.png", label: "Still A" },
      {
        src: "/lab/motion/motion-hero-push.mp4",
        label: "Push-in",
        kind: "video",
      },
      { src: "/lab/hero/hero-02.png", label: "Still B" },
      {
        src: "/lab/motion/motion-hero-parallax.mp4",
        label: "Parallax",
        kind: "video",
      },
      { src: "/lab/hero/hero-04.png", label: "Still C" },
      { src: "/lab/hero/hero-06.png", label: "Still D" },
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
    <div className="machine" id="work">
      <div className="machine-tabs" role="tablist" aria-label="Lab experiments">
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
            {exp.label}
          </button>
        ))}
      </div>

      <div className="machine-stage">
        <aside className="machine-brief">
          <div className="machine-kicker">The lab</div>
          <h3 className="machine-title">{experiment.title}</h3>
          <p className="machine-note">{experiment.note}</p>
          <p className="machine-live-label">
            <span className="pulse" />
            {featured.label}
          </p>
        </aside>

        <div className="machine-viz" data-kind={isVideo ? "video" : "image"}>
          {isVideo ? (
            <video
              key={featured.src}
              className="machine-feature"
              src={featured.src}
              autoPlay
              muted
              loop
              playsInline
              controls={false}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="machine-feature"
              src={featured.src}
              alt={`${experiment.title} — ${featured.label}`}
              width={1856}
              height={2304}
            />
          )}
        </div>
      </div>

      <div className="machine-thumbs" role="list">
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

      <p className="machine-caption">{experiment.caption}</p>
    </div>
  );
}

export function HeroStill() {
  return (
    <figure className="hero-still">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lab/hero/hero-01.png"
        alt="Experimental campaign still of an unbranded black running shoe on stone with flowing fabric"
        width={1856}
        height={2304}
      />
      <figcaption>
        Independent experiment — not a client case study. Generated for
        CerebroBro.
      </figcaption>
    </figure>
  );
}

"use client";

import { useState } from "react";

const experiments = [
  {
    id: "product",
    label: "01 — One object, many worlds",
    title: "Product lab",
    caption: "ONE PLAIN SHOE → MULTIPLE ART DIRECTIONS",
    note: "Starting point: a clean, unbranded product still. The worlds come next.",
    images: [
      { src: "/lab/product/product-ref-01.png", label: "Reference" },
      { src: "/lab/product/product-ref-02.png", label: "Angle B" },
      { src: "/lab/product/product-ref-03.png", label: "Angle C" },
      { src: "/lab/product/product-ref-04.png", label: "Angle D" },
    ],
  },
  {
    id: "character",
    label: "02 — Character lock",
    title: "Character lab",
    caption: "ONE FACE → MULTIPLE LOOKS",
    note: "Find one identity. Then test whether it holds across scenes.",
    images: [
      { src: "/lab/character/character-ref-01.png", label: "Lock" },
      { src: "/lab/character/character-ref-02.png", label: "Look 02" },
      { src: "/lab/character/character-ref-03.png", label: "Look 03" },
      { src: "/lab/character/character-ref-04.png", label: "Look 04" },
      { src: "/lab/character/character-ref-05.png", label: "Look 05" },
      { src: "/lab/character/character-ref-06.png", label: "Look 06" },
      { src: "/lab/character/character-ref-07.png", label: "Look 07" },
      { src: "/lab/character/character-ref-08.png", label: "Look 08" },
    ],
  },
  {
    id: "hero",
    label: "03 — Campaign stills",
    title: "Hero experiments",
    caption: "SAME OBJECT → CINEMATIC PRODUCTION",
    note: "Not a fake Nike brief. Independent experiments that look like expensive production.",
    images: [
      { src: "/lab/hero/hero-01.png", label: "Hero 01" },
      { src: "/lab/hero/hero-02.png", label: "Hero 02" },
      { src: "/lab/hero/hero-04.png", label: "Hero 04" },
      { src: "/lab/hero/hero-05.png", label: "Hero 05" },
      { src: "/lab/hero/hero-06.png", label: "Hero 06" },
      { src: "/lab/hero/hero-07.png", label: "Hero 07" },
      { src: "/lab/hero/hero-08.png", label: "Hero 08" },
      { src: "/lab/hero/hero-09.png", label: "Hero 09" },
      { src: "/lab/hero/hero-10.png", label: "Hero 10" },
      { src: "/lab/hero/hero-11.png", label: "Hero 11" },
      { src: "/lab/hero/hero-12.png", label: "Hero 12" },
      { src: "/lab/hero/hero-03.png", label: "Hero 03" },
    ],
  },
] as const;

export function Machine() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(0);
  const experiment = experiments[active];
  const featured = experiment.images[Math.min(selected, experiment.images.length - 1)];

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
          <div className="machine-kicker">Watch the process</div>
          <h3 className="machine-title">{experiment.title}</h3>
          <p className="machine-note">{experiment.note}</p>
          <p className="machine-live-label">
            <span className="pulse" />
            Showing {featured.label}
          </p>
        </aside>

        <div className="machine-viz">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="machine-feature"
            src={featured.src}
            alt={`${experiment.title} — ${featured.label}`}
            width={1856}
            height={2304}
          />
        </div>
      </div>

      <div className="machine-thumbs" role="list">
        {experiment.images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            role="listitem"
            className={i === selected ? "is-active" : undefined}
            onClick={() => setSelected(i)}
            aria-label={`Show ${image.label}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt="" width={464} height={576} />
            <span>{image.label}</span>
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
        Independent experiment — not a client case study. Generated for CerebroBro.
      </figcaption>
    </figure>
  );
}

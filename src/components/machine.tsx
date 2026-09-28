"use client";

import { useEffect, useState } from "react";

const projects = [
  {
    id: "product",
    label: "01 — Product campaign",
    brief: {
      client: "NIKE",
      job: "New trail shoe",
      need: "Campaign concept · 12 social assets · 3 days",
    },
    stages: ["Reference", "Prompt", "Generations", "Selection", "Final"],
    caption: "ONE BRIEF → 47 GENERATIONS → 6 DIRECTIONS → 1 CLIENT-READY ASSET",
    finals: [
      { tone: "mud", label: "Trail dawn" },
      { tone: "fog", label: "Ridge line" },
      { tone: "heat", label: "Finish line" },
    ],
  },
  {
    id: "character",
    label: "02 — Character",
    brief: {
      client: "STREAMING",
      job: "IP character lock",
      need: "Moodboard → consistent hero · 8 looks",
    },
    stages: ["Moodboard", "Identity", "Looks", "Consistency", "Lock"],
    caption: "ONE FACE → 31 LOOKS → 4 CONSISTENT → 1 LOCKED HERO",
    finals: [
      { tone: "ink", label: "Portrait A" },
      { tone: "neon", label: "Portrait B" },
      { tone: "bone", label: "Portrait C" },
    ],
  },
  {
    id: "video",
    label: "03 — Video",
    brief: {
      client: "FMCG",
      job: "15s social cut",
      need: "Still → motion · 3 hooks · tomorrow",
    },
    stages: ["Still", "Motion", "Hooks", "Edit", "Export"],
    caption: "ONE STILL → 18 MOTION TESTS → 3 HOOKS → 1 CUT",
    finals: [
      { tone: "pulse", label: "Hook 01" },
      { tone: "sweep", label: "Hook 02" },
      { tone: "cut", label: "Final cut" },
    ],
  },
] as const;

type Project = (typeof projects)[number];

export function Machine() {
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState(0);
  const project = projects[active];

  useEffect(() => {
    setStage(0);
    const id = window.setInterval(() => {
      setStage((s) => (s + 1) % project.stages.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [active, project.stages.length]);

  return (
    <div className="machine" id="work">
      <div className="machine-tabs" role="tablist" aria-label="Work examples">
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            className={i === active ? "is-active" : undefined}
            onClick={() => setActive(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="machine-stage">
        <BriefPanel project={project} stage={stage} />
        <ProcessPanel project={project} stage={stage} />
      </div>

      <p className="machine-caption">{project.caption}</p>
    </div>
  );
}

function BriefPanel({ project, stage }: { project: Project; stage: number }) {
  return (
    <aside className="machine-brief">
      <div className="machine-kicker">Watch the process</div>
      <dl>
        <div>
          <dt>Client</dt>
          <dd>{project.brief.client}</dd>
        </div>
        <div>
          <dt>Job</dt>
          <dd>{project.brief.job}</dd>
        </div>
        <div>
          <dt>Ask</dt>
          <dd>{project.brief.need}</dd>
        </div>
      </dl>
      <ol className="machine-steps" aria-label="Pipeline">
        {project.stages.map((name, i) => (
          <li key={name} className={i === stage ? "is-live" : i < stage ? "is-done" : undefined}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {name}
          </li>
        ))}
      </ol>
    </aside>
  );
}

function ProcessPanel({ project, stage }: { project: Project; stage: number }) {
  const progress = stage / (project.stages.length - 1);

  return (
    <div className="machine-viz" data-project={project.id}>
      <div className="machine-grid" aria-hidden="true">
        {project.finals.map((tile, i) => (
          <div
            key={tile.label}
            className={`gen gen-${tile.tone} ${i <= Math.floor(progress * 2) ? "is-on" : ""}`}
            style={{ animationDelay: `${i * 120}ms` }}
          >
            <span>{tile.label}</span>
          </div>
        ))}
        <div className={`gen gen-final ${stage >= project.stages.length - 1 ? "is-on is-final" : ""}`}>
          <span>Final</span>
        </div>
      </div>
      <div className="machine-live">
        <span className="pulse" />
        {project.stages[stage]}
      </div>
    </div>
  );
}

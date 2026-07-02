import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { FloatingCard } from "../components/FloatingCard";
import { Eyebrow } from "../components/ui";
import { SKILL_NOTES, SKILLS } from "../data/portfolioData";
import type { PageNavigationProps } from "../types";

export function AboutPage({ setPage }: Pick<PageNavigationProps, "setPage">) {
  const [selectedSkill, setSelectedSkill] = useState(SKILLS[0]);

  return (
    <div className="page-canvas page-canvas--about">
      <FloatingCard
        top="12%"
        left="7%"
        width={460}
        mountDelay={60}
        className="action-card"
      >
        <Eyebrow>About Me</Eyebrow>
        <p className="glow-text text-bone text-xl md:text-2xl font-bold leading-snug">
          Hi, I’m Kürşat.
        </p>
        <p className="text-slate mt-4 leading-relaxed">
          I’m Kürşat, a developer who enjoys writing code, experimenting with
          design, and turning chaos into something that works well. I like
          approaching web projects from both the frontend and backend. For me,
          a good interface should not only work; it should also look sharp,
          feel smooth, and leave an impression. I build experimental,
          dark-themed projects with React, TypeScript, Node.js, and modern web
          technologies. I also work with the FiveM ecosystem, Discord systems,
          scripts, and server-side development. Building something from
          scratch, fixing what is broken, or improving an existing system is
          the part I enjoy most. In short, I code, design, repair, experiment,
          and usually keep some music playing in the background.
        </p>
        <div className="card-actions">
          <button
            type="button"
            className="card-action-btn cursor-hover no-drag"
            onClick={() => setPage("projects")}
          >
            View my projects <ArrowUpRight size={13} />
          </button>
        </div>
      </FloatingCard>

      <FloatingCard
        top="13%"
        right="7%"
        width={340}
        mountDelay={200}
        className="action-card"
      >
        <Eyebrow>Tools I Use</Eyebrow>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((s) => (
            <button
              key={s}
              type="button"
              className={`skill-pill cursor-hover no-drag ${selectedSkill === s ? "active" : ""}`}
              onClick={() => setSelectedSkill(s)}
            >
              {s}
              <span className="skill-orbit" aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="skill-detail-panel">
          <span>selected tool</span>
          <strong>{selectedSkill}</strong>
          <p>{SKILL_NOTES[selectedSkill]}</p>
        </div>
      </FloatingCard>


      <FloatingCard
        bottom="14%"
        right="9%"
        width={300}
        mountDelay={440}
        className="action-card quote-card"
      >
        <p className="text-bone italic leading-relaxed">
          "Details are not decoration; they are the product."
        </p>
      </FloatingCard>
    </div>
  );
}

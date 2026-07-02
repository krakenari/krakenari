import { useState } from "react";

import { FloatingCard } from "../components/FloatingCard";
import { Eyebrow } from "../components/ui";
import { PROJECTS } from "../data/portfolioData";
import type { ProjectItem } from "../data/portfolioData";
import type { PageNavigationProps } from "../types";
import { randomBetween } from "../utils/randomBetween";

export function ProjectsPage({ setPage }: Pick<PageNavigationProps, "setPage">) {
  const [activeProject, setActiveProject] = useState<ProjectItem>(PROJECTS[0]);
  const [projectLayouts] = useState(() => {
    const base = [
      { top: "12%", left: "5%" },
      { top: "9%", right: "7%" },
      { top: "42%", left: "10%" },
      { top: "39%", right: "9%" },
      { top: "66%", left: "31%" },
    ];

    return PROJECTS.map((project, index) => ({
      project,
      position: base[index % base.length],
      width: Math.round(randomBetween(350, 410)),
      delay: 110 + index * 90,
    }));
  });

  return (
    <div className="page-canvas page-canvas--projects">

      {projectLayouts.map(({ project, position, width, delay }) => (
        <FloatingCard
          key={project.id}
          {...position}
          width={width}
          mountDelay={delay}
          className={`project-card action-card ${activeProject.id === project.id ? "active" : ""}`}
        >
          <button
            type="button"
            className="project-card-button cursor-hover no-drag"
            onClick={() => setActiveProject(project)}
          >
            <div className="project-card-topline">
              <span>{project.tag}</span>
            </div>
            <h3>{project.title}</h3>
            <p className="project-card-description">{project.description}</p>
            <div className="project-stack-row">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </button>
        </FloatingCard>
      ))}

      <FloatingCard bottom="8%" right="6%" width={430} mountDelay={600} className="project-detail-card action-card">
        <Eyebrow>Active Signal</Eyebrow>
        <div className="project-detail-metric">{activeProject.metric}</div>
        <h3>{activeProject.title}</h3>
        <p className="project-detail-description">{activeProject.description}</p>
        <div className="card-actions">
          <button type="button" className="card-action-btn cursor-hover no-drag" onClick={() => setPage("contact")}>
            Let’s build something like this
          </button>
          <button type="button" className="card-action-btn ghosty cursor-hover no-drag" onClick={() => setPage("blog")}>
            Read the blog notes
          </button>
        </div>
      </FloatingCard>
    </div>
  );
}

import { useState } from "react";

import {
  CursorTrail,
  SkyBackground,
  Spotlight,
} from "./components/AmbientEffects";
import { Navigation } from "./components/Navigation";
import { useIsTouch } from "./hooks/useIsTouch";
import { usePageTransition } from "./hooks/usePageTransition";
import { AboutPage } from "./pages/AboutPage";
import { BlogDetail, BlogPage } from "./pages/BlogPages";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import type { PageId } from "./types";
import "./styles/portfolio.css";

export default function PortfolioExperience() {
  const isTouch = useIsTouch();
  const [page, setPage] = useState<PageId>("home");
  const [selectedBlogId, setSelectedBlogId] = useState("");
  const [displayPage, phase] = usePageTransition(page);

  return (
    <div className={`portfolio-root ${!isTouch ? "cursor-none-root" : ""}`}>
      <SkyBackground />
      <Spotlight />
      <CursorTrail />

      <span className="brand-mark" aria-hidden="true">
        krakenari
      </span>

      <Navigation page={page} setPage={setPage} />

      <main className={`page-canvas-wrap phase-${phase}`}>
        {displayPage === "home" && <HomePage setPage={setPage} />}
        {displayPage === "about" && <AboutPage setPage={setPage} />}
        {displayPage === "projects" && <ProjectsPage setPage={setPage} />}
        {displayPage === "blog" && (
          <BlogPage setPage={setPage} setSelectedBlogId={setSelectedBlogId} />
        )}
        {displayPage === "blogdetail" && (
          <BlogDetail setPage={setPage} selectedBlogId={selectedBlogId} />
        )}
        {displayPage === "contact" && <ContactPage />}
      </main>
    </div>
  );
}

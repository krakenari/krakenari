import { useState } from "react";
import { Menu, X } from "lucide-react";

import { PAGES } from "../data/portfolioData";
import type { PageId, PageNavigationProps } from "../types";

export function Navigation({ page, setPage }: PageNavigationProps) {
  const [open, setOpen] = useState(false);

  const navigateTo = (pageId: PageId) => {
    setPage(pageId);
    setOpen(false);
  };

  return (
    <header className="nav-wrap">
      <nav className="nav-pill glass-pill hidden md:flex items-center gap-1 cursor-hover no-drag">
        {PAGES.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`nav-pill-link cursor-hover no-drag ${page === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        className="nav-mobile-toggle glass-pill md:hidden cursor-hover no-drag"
        onClick={() => setOpen((current) => !current)}
        aria-label="Menu"
        aria-expanded={open}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={`nav-mobile-menu glass-card md:hidden ${open ? "open" : ""}`}
      >
        {PAGES.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`nav-mobile-link no-drag ${page === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}

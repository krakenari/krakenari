import { useEffect, useRef, useState } from "react";

import type { PageId } from "../types";

type TransitionPhase = "enter" | "exit" | "enter-start";

export function usePageTransition(page: PageId) {
  const [displayPage, setDisplayPage] = useState<PageId>(page);
  const [phase, setPhase] = useState<TransitionPhase>("enter");
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (page === displayPage) return;

    setPhase("exit");

    const transitionTimer = window.setTimeout(() => {
      setDisplayPage(page);
      setPhase("enter-start");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("enter"));
      });
    }, 380);

    return () => window.clearTimeout(transitionTimer);
  }, [displayPage, page]);

  return [displayPage, phase] as const;
}

import { useState } from "react";
import type { MouseEventHandler, ReactNode } from "react";

import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="text-2xs tracking-widest uppercase text-slate font-bold mb-3">
      {children}
    </div>
  );
}

interface GhostButtonProps {
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export function GhostButton({
  children,
  onClick,
  className = "",
}: GhostButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`btn-ghost cursor-hover no-drag ${className}`}
    >
      {children}
    </button>
  );
}

interface MiniStatProps {
  target: number;
  suffix?: string;
  label: string;
  note?: string;
  action?: string;
  onActivate?: () => void;
}

export function MiniStat({
  target,
  suffix = "",
  label,
  note = "Live counter is active.",
  action = "Click for details.",
  onActivate,
}: MiniStatProps) {
  const [ref, visible] = useReveal();
  const [armed, setArmed] = useState(false);
  const value = useCountUp(target, visible);

  const activate = () => {
    setArmed(true);
    window.setTimeout(() => setArmed(false), 900);
    onActivate?.();
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={activate}
      onMouseEnter={() => setArmed(true)}
      onMouseLeave={() => setArmed(false)}
      onFocus={() => setArmed(true)}
      onBlur={() => setArmed(false)}
      className={`mini-stat-card cursor-hover no-drag ${armed ? "is-armed" : ""}`}
    >
      <div className="mini-stat-topline">{action}</div>
      <div className="text-3xl font-extrabold text-bone">
        {value}
        <span className="text-slate">{suffix}</span>
      </div>
      <div className="text-3xs tracking-widest uppercase text-slate mt-1 font-semibold">
        {label}
      </div>
      <p className="mini-stat-inline-note">{note}</p>
    </button>
  );
}

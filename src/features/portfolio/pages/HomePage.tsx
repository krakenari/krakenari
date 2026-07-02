import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { DiscordCard } from "../components/DiscordCard";
import { FloatingCard } from "../components/FloatingCard";
import { LinuxTerminal } from "../components/LinuxTerminal";
import { Eyebrow, GhostButton, MiniStat } from "../components/ui";
import { DISCORD_USER_ID } from "../data/portfolioData";
import type { PageNavigationProps } from "../types";

export function HomePage({ setPage }: Pick<PageNavigationProps, "setPage">) {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);

  const copyDiscordId = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_USER_ID);
      setDiscordCopied(true);
      window.setTimeout(() => setDiscordCopied(false), 1400);
    } catch {
      setDiscordCopied(false);
    }
  };

  return (
    <div className="page-canvas page-canvas--home">
      <FloatingCard
        top="13%"
        left="6%"
        width={460}
        mountDelay={60}
        className="hero-card space-card action-card"
      >
        <h1 className="glow-text space-title text-4xl md:text-5xl font-extrabold text-bone leading-tight">
          krakenari
        </h1>
        <p className="text-slate mt-4 leading-relaxed">
          Yo, I’m Kürşat — coding, creating, fixing chaos, and just listening to
          music.
        </p>
        <div className="card-actions">
          <button type="button" className="card-action-btn cursor-hover no-drag" onClick={() => setPage("about")}>
            Who is this? <ArrowUpRight size={13} />
          </button>
          <button type="button" className="card-action-btn ghosty cursor-hover no-drag" onClick={() => setTerminalOpen(true)}>
            Wake the terminal
          </button>
        </div>
      </FloatingCard>

      <FloatingCard
        top="45%"
        left="7%"
        width={400}
        mountDelay={260}
        className="space-card score-card action-card"
      >
        <div className="grid grid-cols-2 gap-4">
          <MiniStat
            target={6}
            suffix="+"
            label="Years of Experience"
            note="Design, frontend, and server work on the same track."
            action="About"
            onActivate={() => setPage("about")}
          />
        </div>
      </FloatingCard>

      <FloatingCard
        top="47%"
        right="4%"
        width={680}
        mountDelay={400}
        className="discord-card-shell space-card action-card"
      >
        <DiscordCard />
        <div className="card-actions discord-actions">
          <button type="button" className="card-action-btn cursor-hover no-drag" onClick={copyDiscordId}>
            {discordCopied ? "ID copied" : "Copy Discord ID"}
          </button>
          <button type="button" className="card-action-btn ghosty cursor-hover no-drag" onClick={() => setPage("contact")}>
            Get in touch
          </button>
        </div>
      </FloatingCard>

      <FloatingCard
        bottom="12%"
        left="10%"
        width={310}
        mountDelay={420}
        className="space-card action-card"
      >
        <Eyebrow>JOURNAL // BLOG</Eyebrow>
        <p className="text-slate text-sm leading-relaxed mb-4">
          Short notes on design, code, interfaces, and digital atmosphere.
        </p>
        <div className="card-actions compact-actions">
          <GhostButton onClick={() => setPage("blog")}>
            Read the blog <ArrowUpRight size={14} />
          </GhostButton>
          <button type="button" className="card-action-btn ghosty cursor-hover no-drag" onClick={() => setPage("projects")}>
            Projects
          </button>
        </div>
      </FloatingCard>

      {terminalOpen && (
        <FloatingCard
          bottom="6%"
          right="25%"
          width={560}
          mountDelay={0}
          className="terminal-card space-card"
        >
          <LinuxTerminal setPage={setPage} onClose={() => setTerminalOpen(false)} />
        </FloatingCard>
      )}
    </div>
  );
}

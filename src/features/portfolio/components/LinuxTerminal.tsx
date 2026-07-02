import { useEffect, useRef, useState } from "react";

import { SKILLS } from "../data/portfolioData";
import type { PageId } from "../types";

type TerminalLine = {
  id: number;
  kind: "system" | "command" | "output" | "error";
  text: string;
};

interface LinuxTerminalProps {
  setPage: (page: PageId) => void;
  onClose: () => void;
}

const TERMINAL_WELCOME: TerminalLine[] = [
  { id: 1, kind: "system", text: "krakenOS 0.7 booted // hidden node online" },
  {
    id: 2,
    kind: "system",
    text: "Commands: help | neofetch | ls | cat readme.md",
  },
];

export function LinuxTerminal({ setPage, onClose }: LinuxTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>(TERMINAL_WELCOME);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const addLines = (nextLines: Array<Omit<TerminalLine, "id">>) => {
    setLines((current) => [
      ...current,
      ...nextLines.map((line, index) => ({
        ...line,
        id: Date.now() + index + Math.random(),
      })),
    ]);
  };

  const runCommand = (rawCommand: string) => {
    const command = rawCommand.trim();
    if (!command) return;

    setHistory((current) =>
      [command, ...current.filter((item) => item !== command)].slice(0, 14),
    );
    setHistoryIndex(null);

    const lower = command.toLowerCase();
    const output: Array<Omit<TerminalLine, "id">> = [
      { kind: "command", text: `guest@krakenari:~$ ${command}` },
    ];

    if (lower === "clear") {
      setLines([]);
      return;
    }

    if (lower === "help") {
      output.push(
        { kind: "output", text: "help        Show available commands" },
        { kind: "output", text: "neofetch    Show system information" },
        { kind: "output", text: "whoami      Show profile information" },
        { kind: "output", text: "ls          List files and folders" },
        {
          kind: "output",
          text: "cat readme.md  Read the short portfolio note",
        },
        { kind: "output", text: "skills      List the tools I use" },
        {
          kind: "output",
          text: "projects    Open the projects page",
        },
        {
          kind: "output",
          text: "blog/about/contact  Open the matching page",
        },
        { kind: "output", text: "sudo frog   Run a small hidden joke" },
        {
          kind: "output",
          text: "clear/exit  Clear or close the terminal",
        },
      );
    } else if (lower === "neofetch") {
      output.push(
        {
          kind: "output",
          text: "        .--.           krakenari@portfolio",
        },
        {
          kind: "output",
          text: "       |o_o |          OS: krakenOS / monochrome sky",
        },
        {
          kind: "output",
          text: "       |:_/ |          Shell: floating-card zsh",
        },
        {
          kind: "output",
          text: "      //   \\ \\        Stack: React + TypeScript + Vite",
        },
        {
          kind: "output",
          text: "     (|     | )       Theme: black / white / arcade glass",
        },
        {
          kind: "output",
          text: "    /'\\_   _/`\\      Status: fixing chaos",
        },
        {
          kind: "output",
          text: "    \\___)=(___/      Music: probably playing",
        },
      );
    } else if (lower === "whoami") {
      output.push({
        kind: "output",
        text: "Kürşat // coding, creating, fixing chaos.",
      });
    } else if (lower === "ls") {
      output.push({
        kind: "output",
        text: "about/  blog/  contact/  projects/  readme.md  frog.txt",
      });
    } else if (lower === "cat readme.md") {
      output.push(
        { kind: "output", text: "# krakenari" },
        {
          kind: "output",
          text: "Frontend, backend, FiveM/FrogV systems, and dark interface experiments.",
        },
        {
          kind: "output",
          text: "This terminal also works as a hidden navigation panel.",
        },
      );
    } else if (lower === "cat frog.txt" || lower === "sudo frog") {
      output.push(
        { kind: "output", text: "      _   _" },
        { kind: "output", text: "     (.)_(.)   ribbit access granted." },
        { kind: "output", text: "  _ (   _   ) _  FrogV signal found." },
      );
    } else if (lower === "skills") {
      output.push({ kind: "output", text: SKILLS.join("  |  ") });
    } else if (lower === "projects") {
      output.push({
        kind: "output",
        text: "Project signals found. Opening the projects page...",
      });
      setPage("projects");
    } else if (lower === "blog") {
      output.push({ kind: "output", text: "Opening the blog..." });
      setPage("blog");
    } else if (lower === "about") {
      output.push({ kind: "output", text: "Opening the about page..." });
      setPage("about");
    } else if (lower === "contact") {
      output.push({ kind: "output", text: "Opening the contact page..." });
      setPage("contact");
    } else if (lower.startsWith("echo ")) {
      output.push({ kind: "output", text: command.slice(5) });
    } else if (lower === "date") {
      output.push({
        kind: "output",
        text: new Date().toLocaleString("en-US"),
      });
    } else if (lower === "exit") {
      output.push({ kind: "system", text: "terminal sleeping..." });
      addLines(output);
      window.setTimeout(onClose, 240);
      return;
    } else {
      output.push({
        kind: "error",
        text: `command not found: ${command}. Try typing help.`,
      });
    }

    addLines(output);
  };

  return (
    <div className="terminal-shell" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-titlebar">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>guest@krakenari:~</span>
        <button
          type="button"
          className="terminal-close cursor-hover no-drag"
          onClick={onClose}
        >
          close
        </button>
      </div>

      <div ref={scrollRef} className="terminal-screen">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`terminal-line terminal-line--${line.kind}`}
          >
            {line.text}
          </div>
        ))}
      </div>

      <div className="terminal-input-row">
        <span>guest@krakenari:~$</span>
        <input
          ref={inputRef}
          value={input}
          spellCheck={false}
          autoComplete="off"
          className="terminal-input no-drag"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              runCommand(input);
              setInput("");
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              const nextIndex =
                historyIndex === null
                  ? 0
                  : Math.min(history.length - 1, historyIndex + 1);
              setHistoryIndex(nextIndex);
              setInput(history[nextIndex] || "");
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              if (historyIndex === null) return;

              const nextIndex = historyIndex - 1;
              if (nextIndex < 0) {
                setHistoryIndex(null);
                setInput("");
              } else {
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex] || "");
              }
            }
          }}
        />
      </div>
    </div>
  );
}

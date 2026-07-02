import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import { Move } from "lucide-react";

import { useIsTouch } from "../hooks/useIsTouch";
import { randomBetween } from "../utils/randomBetween";

let zIndexCounter = 5;

const bringToFront = (element: HTMLElement | null) => {
  zIndexCounter += 1;

  if (element) {
    element.style.zIndex = String(zIndexCounter);
  }
};

export interface FloatingCardProps {
  children: ReactNode;
  top?: CSSProperties["top"];
  left?: CSSProperties["left"];
  right?: CSSProperties["right"];
  bottom?: CSSProperties["bottom"];
  width: CSSProperties["width"];
  mountDelay?: number;
  className?: string;
  noDrag?: boolean;
  randomizeSpawn?: boolean;
}

interface DragMeta {
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

type CardStyle = CSSProperties & Record<`--${string}`, string | number>;

export function FloatingCard({
  children,
  top,
  left,
  right,
  bottom,
  width,
  mountDelay = 0,
  className = "",
  noDrag = false,
  randomizeSpawn = true,
}: FloatingCardProps) {
  const isTouch = useIsTouch();
  const disableDrag = noDrag || isTouch;
  const shellRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragMeta = useRef<DragMeta | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });

  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [animationDuration] = useState(() => 5.5 + Math.random() * 3);
  const [animationDelay] = useState(() => Math.random() * 2.2);
  const [spawn] = useState(() => ({
    x: randomizeSpawn ? randomBetween(-18, 18) : 0,
    y: randomizeSpawn ? randomBetween(-14, 14) : 0,
    rot: randomizeSpawn ? randomBetween(-2.2, 2.2) : 0,
    scrollDepth: randomizeSpawn ? randomBetween(-0.055, 0.075) : 0.035,
    scrollRot: randomizeSpawn ? randomBetween(-0.004, 0.004) : 0,
  }));

  useEffect(() => {
    const mountTimer = window.setTimeout(() => setMounted(true), mountDelay);
    return () => window.clearTimeout(mountTimer);
  }, [mountDelay]);

  const onPointerMove = useCallback((event: PointerEvent) => {
    if (!dragMeta.current || !dragRef.current) return;

    const deltaX = event.clientX - dragMeta.current.startX;
    const deltaY = event.clientY - dragMeta.current.startY;
    const nextX = Math.max(
      dragMeta.current.minX,
      Math.min(
        dragMeta.current.maxX,
        dragMeta.current.origX + deltaX,
      ),
    );
    const nextY = Math.max(
      dragMeta.current.minY,
      Math.min(
        dragMeta.current.maxY,
        dragMeta.current.origY + deltaY,
      ),
    );

    positionRef.current = { x: nextX, y: nextY };
    dragRef.current.style.setProperty("--dx", `${nextX}px`);
    dragRef.current.style.setProperty("--dy", `${nextY}px`);
  }, []);

  const onPointerUp = useCallback(() => {
    setDragging(false);
    dragMeta.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }, [onPointerMove]);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disableDrag) return;

      if (
        event.target instanceof Element &&
        event.target.closest("button, a, .no-drag")
      ) {
        return;
      }

      bringToFront(shellRef.current);
      if (!dragRef.current) return;

      const rectangle = dragRef.current.getBoundingClientRect();
      const edgePadding = 16;

      dragMeta.current = {
        startX: event.clientX,
        startY: event.clientY,
        origX: positionRef.current.x,
        origY: positionRef.current.y,
        minX: positionRef.current.x + edgePadding - rectangle.left,
        maxX:
          positionRef.current.x +
          window.innerWidth -
          edgePadding -
          rectangle.right,
        minY: positionRef.current.y + edgePadding - rectangle.top,
        maxY:
          positionRef.current.y +
          window.innerHeight -
          edgePadding -
          rectangle.bottom,
      };

      setDragging(true);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    },
    [disableDrag, onPointerMove, onPointerUp],
  );

  const onCardPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!dragRef.current || dragging || isTouch) return;

      const rectangle = dragRef.current.getBoundingClientRect();
      const pointerX = Math.min(
        1,
        Math.max(0, (event.clientX - rectangle.left) / rectangle.width),
      );
      const pointerY = Math.min(
        1,
        Math.max(0, (event.clientY - rectangle.top) / rectangle.height),
      );
      const tiltX = (0.5 - pointerY) * 8;
      const tiltY = (pointerX - 0.5) * 10;
      const cornerDepth = Math.min(
        1,
        Math.hypot(pointerX - 0.5, pointerY - 0.5) * 1.75,
      );

      dragRef.current.style.setProperty("--mx", `${pointerX * 100}%`);
      dragRef.current.style.setProperty("--my", `${pointerY * 100}%`);
      dragRef.current.style.setProperty("--rx", `${tiltX.toFixed(2)}deg`);
      dragRef.current.style.setProperty("--ry", `${tiltY.toFixed(2)}deg`);
      dragRef.current.style.setProperty("--sink", cornerDepth.toFixed(3));
      dragRef.current.style.setProperty(
        "--edge",
        `${(cornerDepth * 18).toFixed(1)}px`,
      );
      dragRef.current.style.setProperty(
        "--shadow-x",
        `${((0.5 - pointerX) * 24).toFixed(1)}px`,
      );
      dragRef.current.style.setProperty(
        "--shadow-y",
        `${((0.5 - pointerY) * 24).toFixed(1)}px`,
      );
    },
    [dragging, isTouch],
  );

  const resetCardMagnet = useCallback(() => {
    if (!dragRef.current) return;

    dragRef.current.style.setProperty("--mx", "50%");
    dragRef.current.style.setProperty("--my", "50%");
    dragRef.current.style.setProperty("--rx", "0deg");
    dragRef.current.style.setProperty("--ry", "0deg");
    dragRef.current.style.setProperty("--sink", "0");
    dragRef.current.style.setProperty("--edge", "0px");
    dragRef.current.style.setProperty("--shadow-x", "0px");
    dragRef.current.style.setProperty("--shadow-y", "0px");
  }, []);

  useEffect(() => {
    let animationFrame = 0;

    const updateScrollMotion = () => {
      animationFrame = 0;
      if (!shellRef.current) return;

      const scrollPosition = window.scrollY;
      shellRef.current.style.setProperty(
        "--scroll-shift",
        `${(scrollPosition * spawn.scrollDepth).toFixed(1)}px`,
      );
      shellRef.current.style.setProperty(
        "--scroll-rot",
        `${(scrollPosition * spawn.scrollRot).toFixed(2)}deg`,
      );
    };

    const onScroll = () => {
      if (!animationFrame) {
        animationFrame = requestAnimationFrame(updateScrollMotion);
      }
    };

    updateScrollMotion();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);

      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [spawn.scrollDepth, spawn.scrollRot]);

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    },
    [onPointerMove, onPointerUp],
  );

  const shellStyle: CardStyle = {
    top,
    left,
    right,
    bottom,
    width,
    "--dur": `${animationDuration}s`,
    "--fdelay": `${animationDelay}s`,
    "--spawn-x": `${spawn.x.toFixed(1)}px`,
    "--spawn-y": `${spawn.y.toFixed(1)}px`,
    "--spawn-rot": `${spawn.rot.toFixed(2)}deg`,
    "--scroll-shift": "0px",
    "--scroll-rot": "0deg",
  };

  return (
    <div
      ref={shellRef}
      className={`float-shell ${mounted ? "mounted" : ""} ${
        mounted && !dragging ? "bob" : ""
      }`}
      style={shellStyle}
    >
      <div
        ref={dragRef}
        onPointerDown={onPointerDown}
        onPointerEnter={() => bringToFront(shellRef.current)}
        onPointerMove={onCardPointerMove}
        onPointerLeave={resetCardMagnet}
        className={`float-drag glass-card ${className} ${
          dragging ? "dragging" : ""
        } ${disableDrag ? "" : "draggable cursor-hover"}`}
      >
        {!disableDrag && (
          <span className="grip" aria-hidden="true">
            <Move size={13} />
          </span>
        )}
        <span className="hud-corner hud-tl" aria-hidden="true" />
        <span className="hud-corner hud-tr" aria-hidden="true" />
        <span className="hud-corner hud-bl" aria-hidden="true" />
        <span className="hud-corner hud-br" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}

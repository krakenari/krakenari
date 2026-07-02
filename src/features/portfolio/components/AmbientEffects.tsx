import { useEffect, useRef, useState } from "react";

import { useIsTouch } from "../hooks/useIsTouch";

export function SkyBackground() {
  return (
    <div className="sky-bg" aria-hidden="true">
      <span className="stars stars-far" />
      <span className="stars stars-near" />

      <div className="space-cube cube-a">
        <span className="cube-face face-front" />
        <span className="cube-face face-back" />
        <span className="cube-face face-right" />
        <span className="cube-face face-left" />
        <span className="cube-face face-top" />
        <span className="cube-face face-bottom" />
      </div>

      <div className="space-cube cube-b">
        <span className="cube-face face-front" />
        <span className="cube-face face-back" />
        <span className="cube-face face-right" />
        <span className="cube-face face-left" />
        <span className="cube-face face-top" />
        <span className="cube-face face-bottom" />
      </div>

      <div className="orbital-system">
        <span className="orbital-path" />
        <span className="orbital-satellite" />
      </div>

      <span className="comet comet-a" />
      <span className="comet comet-b" />
      <span className="vignette" />
    </div>
  );
}

export function Spotlight() {
  const isTouch = useIsTouch();
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTouch) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smoothPosition = { ...target };
    const onMouseMove = (event: MouseEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrame = 0;
    const animate = () => {
      smoothPosition.x += (target.x - smoothPosition.x) * 0.07;
      smoothPosition.y += (target.y - smoothPosition.y) * 0.07;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform =
          `translate(${smoothPosition.x}px, ${smoothPosition.y}px)`;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return <div ref={spotlightRef} className="spotlight" aria-hidden="true" />;
}

export function CursorTrail() {
  const isTouch = useIsTouch();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [hovering, setHovering] = useState(false);
  const [dragMode, setDragMode] = useState(false);

  useEffect(() => {
    if (isTouch) return;

    const position = { x: 0, y: 0 };
    const trailPositions = Array.from({ length: 3 }, () => ({ x: 0, y: 0 }));

    const onMouseMove = (event: MouseEvent) => {
      position.x = event.clientX;
      position.y = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
      }

      const target = event.target;
      setHovering(
        target instanceof Element &&
          Boolean(target.closest("a, button, .cursor-hover")),
      );
      setDragMode(
        target instanceof Element && Boolean(target.closest(".draggable")),
      );
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrame = 0;
    const animateTrail = () => {
      let previousPosition = position;

      trailPositions.forEach((trailPosition, index) => {
        trailPosition.x += (previousPosition.x - trailPosition.x) * 0.22;
        trailPosition.y += (previousPosition.y - trailPosition.y) * 0.22;

        const element = trailRefs.current[index];
        if (element) {
          element.style.transform =
            `translate(${trailPosition.x}px, ${trailPosition.y}px)`;
        }

        previousPosition = trailPosition;
      });

      animationFrame = requestAnimationFrame(animateTrail);
    };

    animationFrame = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className="cur-trail"
          style={{ opacity: 0.45 - index * 0.14 }}
        />
      ))}
      <div
        ref={ringRef}
        className={`cur-ring ${hovering ? "cur-ring-hover" : ""} ${dragMode ? "cur-ring-drag" : ""}`}
      />
      <div
        ref={dotRef}
        className={`cur-dot ${hovering ? "cur-dot-hover" : ""}`}
      />
    </>
  );
}

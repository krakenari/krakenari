import { useEffect, useState } from "react";

export function useCountUp(
  target: number,
  active: boolean,
  duration = 1300,
) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let animationFrame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setValue(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [active, duration, target]);

  return value;
}

import { useEffect, useState } from "react";

export function useIsTouch() {
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        !window.matchMedia("(pointer: fine)").matches,
    );
  }, []);

  return isTouch;
}

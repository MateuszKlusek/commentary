import { useEffect, useRef } from "react";

export const useIntersectionObserver = (
  callback: () => void,
  enabled: boolean
) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
};

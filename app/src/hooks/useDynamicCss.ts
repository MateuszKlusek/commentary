import { useEffect, useState } from "react";

export const useDynamicCss = (url?: string) => {
  const [isReady, setIsReady] = useState(!url);

  useEffect(() => {
    if (!url) return;

    const existingLink = document.querySelector<HTMLLinkElement>(
      `link[href="${url}"]`
    );
    if (existingLink) {
      console.log("CSS already loaded");
      queueMicrotask(() => setIsReady(true));
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;

    const handleLoad = () => {
      console.log("CSS loaded");
      queueMicrotask(() => setIsReady(true));
    };

    const handleError = () => {
      console.error(`Failed to load CSS: ${url}`);
      setIsReady(true);
    };

    link.addEventListener("load", handleLoad);
    link.addEventListener("error", handleError);
    document.head.appendChild(link);

    return () => {
      link.removeEventListener("load", handleLoad);
      link.removeEventListener("error", handleError);
      document.head.removeChild(link);
    };
  }, [url]);

  return { isReady };
};

import { useEffect } from "react";

export const useDynamicCss = (url?: string) => {
  useEffect(() => {
    if (!url) return;

    if (document.querySelector(`link[href="${url}"]`)) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [url]);
};

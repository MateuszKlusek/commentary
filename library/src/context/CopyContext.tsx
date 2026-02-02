import type { CompleteCopy, Copy } from "@shared/src/types/copy";
import { createContext, useContext, useMemo } from "react";
import { defaultCopy } from "../copy/defaults";

const CopyContext = createContext(defaultCopy);


function deepMerge(defaultCopy: CompleteCopy, providedCopy?: Copy) {
  if (!providedCopy) return defaultCopy;

  for (const key in providedCopy) {
    const k = key as keyof Copy
    if (providedCopy[k] instanceof Object && k in defaultCopy) {
      const defVal = defaultCopy[k];
      if (defVal !== undefined && typeof defVal === "object" && defVal !== null) {
        Object.assign(
          providedCopy[k],
          deepMerge(defVal as unknown as CompleteCopy, providedCopy[k] as Copy)
        );
      }
    }
  }

  Object.assign(defaultCopy || {}, providedCopy);
  return defaultCopy
}


export const CopyProvider = ({
  copy,
  children,
}: {
  copy?: Copy;
  children: React.ReactNode;
}) => {

  const value = useMemo(() => deepMerge(defaultCopy, copy), [copy]);

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
};

export const useCopy = () => {
  const context = useContext(CopyContext);
  if (!context) {
    throw new Error("useCopy must be used within a CopyProvider");
  }
  return context;
};

import type { Copy } from "@shared/src/types/copy";
import { createContext, useContext, useMemo } from "react";
import { defaultCopy } from "../copy/defaults";

const CopyContext = createContext(defaultCopy);

export const CopyProvider = ({
  copy,
  children,
}: {
  copy?: Copy;
  children: React.ReactNode;
}) => {
  // TODO implement deep merge
  //   const value = useMemo(() => deepMerge(defaultCopy, copy), [copy]);
  const value = useMemo(() => copy ?? defaultCopy, [copy]);

  return <CopyContext.Provider value={value}>{children}</CopyContext.Provider>;
};

export const useCopy = () => {
  const context = useContext(CopyContext);
  if (!context) {
    throw new Error("useCopy must be used within a CopyProvider");
  }
  return context;
};

"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type PageMetaState = {
  hideFooter: boolean;
  setHideFooter: (hidden: boolean) => void;
};

const PageMetaContext = createContext<PageMetaState | null>(null);

export function PageMetaProvider({ children }: { children: ReactNode }) {
  const [hideFooter, setHideFooter] = useState(false);

  const value = useMemo(() => ({ hideFooter, setHideFooter }), [hideFooter]);

  return <PageMetaContext.Provider value={value}>{children}</PageMetaContext.Provider>;
}

export function usePageMeta() {
  const ctx = useContext(PageMetaContext);
  if (!ctx) {
    throw new Error("usePageMeta must be used within PageMetaProvider");
  }
  return ctx;
}


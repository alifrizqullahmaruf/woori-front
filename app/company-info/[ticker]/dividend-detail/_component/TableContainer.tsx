"use client";

import { ReactNode, useLayoutEffect, useRef, useState } from "react";

interface TableContainerProps {
  children?: ReactNode;
}

export default function TableContainer({ children }: TableContainerProps) {
  const [containerRef, top] = useCalculateHeight();

  return (
    <div
      className={
        "font-numbers text-gray-w800 overflow-y-auto px-6 py-[14px] font-medium"
      }
      ref={containerRef}
      style={{
        maxHeight: `calc(100dvh - ${top}px)`,
      }}
    >
      {children}
    </div>
  );
}

const useCalculateHeight = () => {
  const [top, setTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container) {
      setTop(container.getBoundingClientRect().y);
    }
  }, []);

  return [containerRef, top] as const;
};

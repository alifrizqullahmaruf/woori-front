import { ReactNode } from "react";

interface PageViewContainerProps {
  children: ReactNode;
  verticalPadding?: number | { top: number; bottom: number };
  className?: string;
}

export default function PageViewContainer({
  children,
  verticalPadding = 18,
  className,
}: PageViewContainerProps) {
  return (
    <article
      className={"flex flex-1 flex-col px-6 " + (className ?? "")}
      style={{
        paddingTop:
          typeof verticalPadding === "number"
            ? `${verticalPadding}px`
            : `${verticalPadding?.top}px`,
        paddingBottom:
          typeof verticalPadding === "number"
            ? `${verticalPadding}px`
            : `${verticalPadding?.bottom}px`,
      }}
    >
      {children}
    </article>
  );
}

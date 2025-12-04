import { ReactNode } from "react";

interface CardContainerProps {
  children?: ReactNode;
  className?: string;
}

export default function CardFrame({ children, className }: CardContainerProps) {
  return (
    <div
      className={"rounded-xl px-3 py-[9px] " + (className ?? "")}
      style={{
        boxShadow: "3px 4px 15px 0px #85A5D940",
      }}
    >
      {children}
    </div>
  );
}

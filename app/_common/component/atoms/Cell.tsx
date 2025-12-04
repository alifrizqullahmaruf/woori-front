import { HTMLAttributes, ReactNode } from "react";

interface TdProps extends HTMLAttributes<HTMLTableCellElement> {
  children?: ReactNode;
  role?: "cell" | "columnheader" | "rowheader";
}

export default function Cell({ children, role = "cell", ...props }: TdProps) {
  return (
    <div role={role} {...props}>
      {children}
    </div>
  );
}

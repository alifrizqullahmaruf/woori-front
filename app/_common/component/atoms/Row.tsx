import { HTMLAttributes, ReactNode } from "react";

export interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  children?: ReactNode;
}

export default function Row({ children, ...props }: RowProps) {
  return (
    <div role={"row"} {...props}>
      {children}
    </div>
  );
}

import { HTMLAttributes, ReactNode } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children?: ReactNode;
}

export default function Table({ children, ...props }: TableProps) {
  return (
    <div role={"table"} {...props}>
      {children}
    </div>
  );
}

'use client';

import type { HTMLAttributes, ReactNode } from "react";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  wrapperClassName?: string;
}

const Table = ({
  children,
  className = "",
  wrapperClassName = "",
  ...props
}: TableProps) => (
  <div className={`overflow-x-auto ${wrapperClassName}`}>
    <table
      className={`w-full border-collapse text-left text-sm ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
);

export default Table;


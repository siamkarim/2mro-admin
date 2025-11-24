'use client';

import type { ReactNode } from "react";

interface PopupProps {
  children: ReactNode;
  className?: string;
}

const Popup = ({ children, className = "" }: PopupProps) => (
  <div
    className={`border border-slate-200 bg-white p-4 text-sm shadow-lg ${className}`}
  >
    {children}
  </div>
);

export default Popup;


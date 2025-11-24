import type { SVGProps } from "react";

const BellIcon = ({ className = "", ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M5.5 9.75a6.5 6.5 0 1 1 13 0c0 4.2 1.5 6 1.5 6H4s1.5-1.8 1.5-6Z" />
    <path d="M9.75 18.75a2.25 2.25 0 0 0 4.5 0" />
  </svg>
);

export default BellIcon;



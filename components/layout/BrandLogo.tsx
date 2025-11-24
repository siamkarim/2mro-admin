'use client';

import Image from "next/image";

interface BrandLogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  ariaLabel?: string;
}

const BrandLogo = ({
  width = 140,
  height = 48,
  className = "",
  priority = false,
  ariaLabel = "Forex brand",
}: BrandLogoProps) => {
  return (
    <div className={`inline-flex items-center ${className}`} aria-label={ariaLabel}>
      <Image
        src="/forex-logo.png"
        alt="Forex brand logo"
        width={width}
        height={height}
        priority={priority}
      />
    </div>
  );
};

export default BrandLogo;



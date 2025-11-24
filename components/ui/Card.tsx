import type { ReactNode } from "react";

interface CardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendPositive?: boolean;
  children?: ReactNode;
}

const Card = ({ title, value, trend, trendPositive = true, children }: CardProps) => (
  <div className="border border-slate-200 bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
      {title}
    </p>
    <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
    {trend ? (
      <p
        className={`mt-1 text-sm ${
          trendPositive ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {trend}
      </p>
    ) : null}
    {children ? <div className="mt-3 text-sm text-slate-600">{children}</div> : null}
  </div>
);

export default Card;


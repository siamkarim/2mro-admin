'use client';

import type { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
  outline:
    "border border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900",
  ghost: "text-slate-700 hover:text-slate-900",
  danger: "border border-red-500 text-red-600 hover:bg-red-50",
  success: "border border-emerald-500 text-emerald-600 hover:bg-emerald-50",
};

const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
    {...props}
  />
);

export default Button;


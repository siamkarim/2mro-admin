'use client';

import type { ReactNode } from "react";

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: ReactNode;
}

const ModalBase = ({ open, onClose, title, className = "", children }: ModalBaseProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 flex w-full max-w-4xl flex-col border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-hidden ${className}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close modal"
          className="absolute right-4 top-4 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex h-full flex-col">
          {title ? (
            <div className="mb-4 pr-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                {title}
              </h3>
            </div>
          ) : null}
          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalBase;


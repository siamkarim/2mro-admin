'use client';

import type { ReactNode } from "react";

import ModalBase from "@/components/popups/ModalBase";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const Modal = ({ open, onClose, title, children, footer, className }: ModalProps) => (
  <ModalBase open={open} onClose={onClose} title={title} className={className}>
    <div className="space-y-4">
      <div>{children}</div>
      {footer ? <div className="flex justify-end gap-2">{footer}</div> : null}
    </div>
  </ModalBase>
);

export default Modal;


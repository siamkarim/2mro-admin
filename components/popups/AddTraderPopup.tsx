'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface TraderPayload {
  userId: string;
  name: string;
  surname: string;
  nationalId: string;
  phone: string;
  dateOfBirth: string;
  email: string;
  password: string;
}

interface AddTraderPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: TraderPayload) => void;
}

const AddTraderPopup = ({ open, onClose, onSubmit }: AddTraderPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<TraderPayload>(() => ({
    userId: `TRD-${Date.now()}`,
    name: "",
    surname: "",
    nationalId: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    password: "",
  }));

  const handleChange = (
    key: keyof TraderPayload,
    value: string
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("ui.add_trader_modal_title")}
      className="max-w-3xl"
    >
      <form className="grid gap-4 text-sm text-slate-700 md:grid-cols-2" onSubmit={handleSubmit}>
        {[
          { key: "name", label: t("traders.columns.name"), type: "text" },
          { key: "surname", label: t("traders.columns.surname"), type: "text" },
          { key: "nationalId", label: t("users.columns.nationalId"), type: "text" },
          { key: "phone", label: t("users.columns.phone"), type: "text" },
          { key: "dateOfBirth", label: t("users.columns.dob"), type: "date" },
          { key: "email", label: t("ui.common_email_label"), type: "email" },
          { key: "password", label: t("users.columns.password"), type: "password" },
        ].map((field) => (
          <label
            key={field.key}
            className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
          >
            {field.label}
            <input
              type={field.type}
              className="mt-1 w-full border border-slate-300 px-3 py-2"
              value={formState[field.key as keyof TraderPayload] as string}
              onChange={(event) =>
                handleChange(field.key as keyof TraderPayload, event.target.value)
              }
              required
            />
          </label>
        ))}
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="border border-slate-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>
          <button
            type="submit"
            className="bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
          >
            {t("ui.add_trader_save_button")}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default AddTraderPopup;


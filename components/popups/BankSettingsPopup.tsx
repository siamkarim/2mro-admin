'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface BankSettings {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swift: string;
  iban: string;
  depositFee: string;
  commissionFee: string;
}

interface BankSettingsPopupProps {
  open: boolean;
  active: boolean;
  details: BankSettings;
  onClose: () => void;
  onSubmit: (payload: { details: BankSettings; active: boolean }) => void;
}

const fields: Array<{ key: keyof BankSettings; labelKey: string }> = [
  { key: "bankName", labelKey: "ui.bank_name_label" },
  { key: "accountName", labelKey: "ui.bank_account_name_label" },
  { key: "accountNumber", labelKey: "ui.bank_account_number_label" },
  { key: "swift", labelKey: "ui.bank_swift_label" },
  { key: "iban", labelKey: "funding.iban" },
  { key: "depositFee", labelKey: "ui.bank_deposit_fee_label" },
  { key: "commissionFee", labelKey: "ui.bank_commission_fee_label" },
];

const BankSettingsPopup = ({
  open,
  active,
  details,
  onClose,
  onSubmit,
}: BankSettingsPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState(details);
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    setFormState(details);
    setIsActive(active);
  }, [details, active, open]);

  const handleChange = (key: keyof BankSettings, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit({ details: formState, active: isActive });
  };

  return (
    <ModalBase open={open} onClose={onClose} title={t("ui.bank_settings_modal_title")} className="max-w-2xl">
      <div className="flex flex-col gap-4 text-[12px] text-slate-700">
        <div className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
          <span>{t("labels.status")}</span>
          <button
            type="button"
            className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
              isActive ? "bg-emerald-600 text-white" : "border border-slate-300 text-slate-600"
            }`}
            onClick={() => setIsActive((prev) => !prev)}
          >
            {isActive ? t("status.ACTIVE") : t("ui.status_inactive_label")}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map((field) => (
            <label
              key={field.key}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500"
            >
              {t(field.labelKey)}
              <input
                className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm text-slate-900"
                value={formState[field.key]}
                onChange={(event) => handleChange(field.key, event.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="border border-slate-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>
          <button
            type="button"
            className="bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
            onClick={handleSave}
          >
            {t("ui.common_save_changes_button")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default BankSettingsPopup;



"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";
import type { BankSettings } from "@/components/popups/BankSettingsPopup";
import { BANK } from "@/mock/data";

const fields: Array<{ key: keyof BANK; labelKey: string }> = [
  { labelKey: "ui.bank_name_label", key: "bank_name" },
  { labelKey: "ui.bank_account_name_label", key: "bank_account_name" },
  { labelKey: "ui.bank_account_number_label", key: "bank_account_number" },
  { labelKey: "ui.bank_swift_label", key: "bank_swift_code" },
  { labelKey: "funding.iban", key: "bank_iban" },
  { labelKey: "ui.bank_deposit_fee_label", key: "bank_deposit_fee" },
  { labelKey: "ui.bank_commission_fee_label", key: "bank_withdrawal_fee" },
];

interface PaymentBankSettingsPopupProps {
  open: boolean;
  details: BANK;
  onClose: () => void;
  onSubmit: (payload: BANK) => void;
}

const PaymentBankSettingsPopup = ({
  open,
  details,
  onClose,
  onSubmit,
}: PaymentBankSettingsPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState(details);

  useEffect(() => {
    setFormState(details);
  }, [details, open]);

  const handleChange = (key: keyof BANK, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit(formState);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("ui.bank_settings_modal_title")}
      className="max-w-2xl"
    >
      <div className="grid gap-3 text-[12px] text-slate-700 md:grid-cols-2">
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
      <div className="mt-4 flex justify-end gap-2">
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
    </ModalBase>
  );
};

export default PaymentBankSettingsPopup;

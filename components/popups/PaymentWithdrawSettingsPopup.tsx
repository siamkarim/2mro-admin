'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

interface WithdrawSettings {
  fee: string;
  tax: string;
}

interface PaymentWithdrawSettingsPopupProps {
  open: boolean;
  onClose: () => void;
  values: WithdrawSettings;
  onSubmit: (payload: WithdrawSettings) => void;
}

const PaymentWithdrawSettingsPopup = ({
  open,
  onClose,
  values,
  onSubmit,
}: PaymentWithdrawSettingsPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState(values);

  useEffect(() => {
    setFormState(values);
  }, [values, open]);

  const handleChange = (key: keyof WithdrawSettings, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit(formState);
  };

  return (
    <ModalBase open={open} onClose={onClose} title={t("ui.withdraw_settings_modal_title")} className="max-w-lg">
      <div className="space-y-4 text-[12px] text-slate-700">
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("ui.withdraw_fee_label")}
          <input
            className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
            value={formState.fee}
            onChange={(event) => handleChange("fee", event.target.value)}
          />
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("ui.income_tax_label")}
          <input
            className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
            value={formState.tax}
            onChange={(event) => handleChange("tax", event.target.value)}
          />
        </label>
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

export default PaymentWithdrawSettingsPopup;


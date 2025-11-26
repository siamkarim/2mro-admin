"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface CryptoFeeSettings {
  crypto_deposit_fee: number;
  crypto_withdrawal_fee: number;
}

interface CryptoFeeSettingsPopupProps {
  open: boolean;
  values: CryptoFeeSettings;
  onClose: () => void;
  onSubmit: (values: CryptoFeeSettings) => void;
}

const CryptoFeeSettingsPopup = ({
  open,
  values,
  onClose,
  onSubmit,
}: CryptoFeeSettingsPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState(values);

  useEffect(() => {
    setFormState(values);
  }, [values, open]);

  const handleChange = (key: keyof CryptoFeeSettings, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit(formState);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("ui.crypto_fee_modal_title")}
      className="max-w-md"
    >
      <div className="space-y-4 text-[12px] text-slate-700">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t("ui.crypto_fee_deposit_label")}
            <input
              type="number"
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.crypto_deposit_fee}
              onChange={(event) =>
                handleChange("crypto_deposit_fee", event.target.value)
              }
            />
          </label>
          <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t("ui.crypto_fee_commission_label")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.crypto_withdrawal_fee}
              onChange={(event) =>
                handleChange("crypto_withdrawal_fee", event.target.value)
              }
            />
          </label>
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
            className="bg-blue-600 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-blue-500"
            onClick={handleSave}
          >
            {t("ui.common_save_label")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default CryptoFeeSettingsPopup;

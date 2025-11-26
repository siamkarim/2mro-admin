"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface Crypto {
  crypto: string;
  network: string;
  address: string;
}
interface PaymentCryptoSettingsPopupProps {
  open: boolean;
  onClose: () => void;
  initial?: Crypto;
  onSubmit: (payload: Crypto) => void;
}

const PaymentCryptoSettingsPopup = ({
  open,
  onClose,
  initial,
  onSubmit,
}: PaymentCryptoSettingsPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<Crypto>(
    initial ?? { crypto: "", network: "", address: "" }
  );

  useEffect(() => {
    setFormState(initial ?? { crypto: "", network: "", address: "" });
  }, [initial, open]);

  const handleChange = (key: keyof Crypto, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSubmit(formState);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={
        initial
          ? t("ui.crypto_wallet_edit_title")
          : t("ui.crypto_wallet_add_title")
      }
      className="max-w-xl"
    >
      <div className="space-y-3 text-[12px] text-slate-700">
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("funding.cryptoLabel")}
          <input
            className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
            value={formState.crypto}
            onChange={(event) => handleChange("crypto", event.target.value)}
          />
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("funding.network")}
          <input
            className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
            value={formState.network}
            onChange={(event) => handleChange("network", event.target.value)}
          />
        </label>
        <label className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("ui.crypto_wallet_address_label")}
          <input
            className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
            value={formState.address}
            onChange={(event) => handleChange("address", event.target.value)}
          />
        </label>
        <div className="flex justify-end gap-2 pt-2">
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

export default PaymentCryptoSettingsPopup;

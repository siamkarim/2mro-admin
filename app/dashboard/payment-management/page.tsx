'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";

import type { BankSettings } from "@/components/popups/BankSettingsPopup";
import PaymentBankSettingsPopup from "@/components/popups/PaymentBankSettingsPopup";
import PaymentCryptoSettingsPopup from "@/components/popups/PaymentCryptoSettingsPopup";
import PaymentWithdrawSettingsPopup from "@/components/popups/PaymentWithdrawSettingsPopup";
import CryptoFeeSettingsPopup, {
  type CryptoFeeSettings,
} from "@/components/popups/CryptoFeeSettingsPopup";
import type { CryptoSettings } from "@/components/popups/CryptoSettingsPopup";

const bankDetailFields: Array<{ labelKey: string; key: keyof BankSettings }> = [
  { labelKey: "ui.bank_name_label", key: "bankName" },
  { labelKey: "ui.bank_account_name_label", key: "accountName" },
  { labelKey: "ui.bank_account_number_label", key: "accountNumber" },
  { labelKey: "ui.bank_swift_label", key: "swift" },
  { labelKey: "funding.iban", key: "iban" },
  { labelKey: "ui.bank_deposit_fee_label", key: "depositFee" },
  { labelKey: "ui.bank_commission_fee_label", key: "commissionFee" },
];

const paymentTransactions = [
  {
    id: "PAY-001",
    userId: "ED17412002",
    name: "John",
    surname: "Miller",
    type: "bank",
    direction: "deposit",
    date: "2025-02-12 09:15",
    amount: 2500,
    status: "pending",
  },
  {
    id: "PAY-002",
    userId: "ED52445007",
    name: "Ali",
    surname: "Kaya",
    type: "crypto",
    direction: "withdrawal",
    date: "2025-02-11 16:40",
    amount: 1800,
    status: "approved",
  },
  {
    id: "PAY-003",
    userId: "ED87330014",
    name: "Maya",
    surname: "Sanchez",
    type: "bank",
    direction: "withdrawal",
    date: "2025-02-10 13:05",
    amount: 4200,
    status: "rejected",
  },
  {
    id: "PAY-004",
    userId: "ED99112077",
    name: "Leo",
    surname: "Martins",
    type: "crypto",
    direction: "deposit",
    date: "2025-02-09 18:22",
    amount: 3100,
    status: "approved",
  },
];

const PaymentManagementPage = () => {
  const { t } = useTranslation();
  const [bankDetails, setBankDetails] = useState<BankSettings>({
    bankName: "Forex Bank",
    accountName: "Forex Holdings",
    accountNumber: "366363333",
    swift: "ASDSA523",
    iban: "SDUJFDJAS5245W5DS",
    depositFee: "3",
    commissionFee: "1.2",
  });
  const [cryptoAccounts, setCryptoAccounts] = useState<CryptoSettings[]>([
    {
      id: "crypto-1",
      crypto: "USDT",
      network: "TRC-20",
      address: "894HFDSCN98444",
    },
  ]);
  const [cryptoFeeGeneral, setCryptoFeeGeneral] = useState<CryptoFeeSettings>({
    deposit: "3",
    commission: "2",
  });
  const [isBankPopupOpen, setIsBankPopupOpen] = useState(false);
  const [isCryptoFeePopupOpen, setIsCryptoFeePopupOpen] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState<CryptoSettings | null>(null);
  const [withdrawSettings, setWithdrawSettings] = useState<{ fee: string; tax: string }>({
    fee: "5",
    tax: "12",
  });
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);

  const handleCopy = (value: string) => {
    if (!value) return;
    navigator.clipboard
      .writeText(value)
      .catch(() => {
        /* ignore */
      });
  };

  const handleBankSubmit = (payload: BankSettings) => {
    setBankDetails(payload);
    setIsBankPopupOpen(false);
  };

  const handleCryptoSubmit = (payload: CryptoSettings) => {
    setCryptoAccounts((prev) => {
      if (payload.id) {
        return prev.map((entry) => (entry.id === payload.id ? payload : entry));
      }
      return [...prev, { ...payload, id: `crypto-${Date.now()}` }];
    });
    setEditingCrypto(null);
  };

  const handleRemoveCrypto = (id: string) => {
    setCryptoAccounts((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleCryptoFeeSubmit = (payload: CryptoFeeSettings) => {
    setCryptoFeeGeneral(payload);
    setIsCryptoFeePopupOpen(false);
  };

  const handleWithdrawSubmit = (payload: { fee: string; tax: string }) => {
    setWithdrawSettings(payload);
    setIsWithdrawPopupOpen(false);
  };

  return (
    <section className="space-y-4 border border-slate-200 bg-white p-4">
      <header className="space-y-1">
        <p className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-900">
          {t("payments.title", { defaultValue: "Payment Management" })}
        </p>
        <p className="text-xs text-slate-500">
          {t("payments.subtitle", {
            defaultValue: "Control bank settlement and crypto wallet details.",
          })}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 text-[11px] leading-tight">
        <section className="border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {t("ui.bank_info_title")}
              </p>
              <p className="text-[10px] text-slate-500">{t("ui.bank_info_subtitle")}</p>
            </div>
            <button
              type="button"
              className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
              onClick={() => setIsBankPopupOpen(true)}
            >
              {t("actions.edit")}
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {bankDetailFields.map((field) => {
              const value = bankDetails[field.key];
              const isCurrencyField =
                field.key === "depositFee" || field.key === "commissionFee";
              return (
                <div
                  key={field.labelKey}
                  className="flex items-center justify-between border-b border-slate-100 pb-2"
                >
                  <div className="pr-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {t(field.labelKey)}
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {isCurrencyField ? `$${value}` : value}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
                    onClick={() => handleCopy(value)}
                  >
                    {t("actions.copy")}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                {t("ui.crypto_info_title")}
              </p>
              <p className="text-[10px] text-slate-500">{t("ui.crypto_info_subtitle")}</p>
            </div>
            <button
              type="button"
              className="bg-blue-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-blue-500"
              onClick={() =>
                setEditingCrypto({
                  crypto: "",
                  network: "",
                  address: "",
                })
              }
            >
              {t("ui.crypto_add_button")}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
              <thead className="border-b border-slate-200 text-slate-600">
                <tr>
                  <th className="py-2 px-2">{t("funding.cryptoLabel")}</th>
                  <th className="py-2 px-2">{t("funding.network")}</th>
                  <th className="py-2 px-2">{t("ui.crypto_wallet_address_label")}</th>
                  <th className="py-2 px-2 text-right">{t("ui.table_actions_header")}</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {cryptoAccounts.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-100">
                    <td className="py-2 px-2">{entry.crypto}</td>
                    <td className="py-2 px-2">{entry.network}</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{entry.address}</span>
                        <button
                          type="button"
                          className="text-[10px] uppercase tracking-[0.3em] text-slate-500 hover:text-slate-900"
                          onClick={() => handleCopy(entry.address)}
                        >
                      {t("actions.copy")}
                        </button>
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                          onClick={() => setEditingCrypto(entry)}
                        >
                      {t("actions.edit")}
                        </button>
                        <button
                          type="button"
                          className="border border-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-600 hover:bg-red-50"
                          onClick={() => entry.id && handleRemoveCrypto(entry.id)}
                        >
                      {t("ui.common_delete_button")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                {t("ui.crypto_fee_section_title")}
              </p>
              <button
                type="button"
                className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                onClick={() => setIsCryptoFeePopupOpen(true)}
              >
                {t("ui.crypto_fee_edit_button")}
              </button>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {t("ui.crypto_fee_deposit_label")}
                </p>
                <p className="text-base font-semibold text-slate-900">
                  ${cryptoFeeGeneral.deposit}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {t("ui.crypto_fee_commission_label")}
                </p>
                <p className="text-base font-semibold text-slate-900">
                  ${cryptoFeeGeneral.commission}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <section className="border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {t("ui.withdraw_settings_section_title")}
            </p>
            <p className="text-[10px] text-slate-500">{t("ui.withdraw_settings_subtitle")}</p>
          </div>
          <button
            type="button"
            className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
            onClick={() => setIsWithdrawPopupOpen(true)}
          >
            {t("actions.edit")}
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t("ui.withdraw_fee_label")}
            </p>
            <p className="text-xl font-semibold text-slate-900">${withdrawSettings.fee}</p>
          </div>
          <div className="rounded border border-slate-100 bg-slate-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
              {t("ui.income_tax_label")}
            </p>
            <p className="text-xl font-semibold text-slate-900">{withdrawSettings.tax}%</p>
          </div>
        </div>
      </section>

      <section className="border border-slate-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
              {t("ui.payment_transactions_title")}
            </p>
            <p className="text-[10px] text-slate-500">
              {t("ui.payment_transactions_subtitle")}
            </p>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
            <thead className="border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2 px-2">{t("ui.payment_tx_id_label")}</th>
                <th className="py-2 px-2">{t("traders.columns.userId")}</th>
                <th className="py-2 px-2">{t("traders.columns.name")}</th>
                <th className="py-2 px-2">{t("traders.columns.surname")}</th>
                <th className="py-2 px-2">{t("funding.type")}</th>
                <th className="py-2 px-2">{t("dashboard.table.direction")}</th>
                <th className="py-2 px-2">{t("ui.table_date_label")}</th>
                <th className="py-2 px-2">{t("funding.amount")}</th>
                <th className="py-2 px-2">{t("labels.status")}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {paymentTransactions.map((tx) => {
                const typeLabel = tx.type === "bank" ? t("filters.bank") : t("filters.crypto");
                const directionLabel =
                  tx.direction === "withdrawal"
                    ? t("ui.table_withdrawal_label")
                    : t("ui.table_deposit_label");
                const directionColor =
                  tx.direction === "withdrawal" ? "text-red-500" : "text-emerald-600";
                const statusClasses =
                  tx.status === "approved"
                    ? "border-emerald-500 text-emerald-600"
                    : tx.status === "pending"
                    ? "border-amber-500 text-amber-600"
                    : "border-red-500 text-red-600";
                return (
                  <tr key={tx.id} className="border-b border-slate-100">
                    <td className="py-3 px-2 font-semibold text-slate-900">{tx.id}</td>
                    <td className="py-3 px-2 font-semibold text-slate-900">{tx.userId}</td>
                    <td className="py-3 px-2">{tx.name}</td>
                    <td className="py-3 px-2">{tx.surname}</td>
                    <td className="py-3 px-2">{typeLabel}</td>
                    <td className={`py-3 px-2 font-semibold ${directionColor}`}>
                      {directionLabel}
                    </td>
                    <td className="py-3 px-2">{tx.date}</td>
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      {tx.direction === "withdrawal" ? "-$" : "+$"}
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${statusClasses}`}
                      >
                        {tx.status === "approved"
                          ? t("ui.status_approved_titlecase")
                          : tx.status === "pending"
                          ? t("ui.status_pending_titlecase")
                          : t("ui.status_rejected_titlecase")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <PaymentBankSettingsPopup
        open={isBankPopupOpen}
        onClose={() => setIsBankPopupOpen(false)}
        details={bankDetails}
        onSubmit={handleBankSubmit}
      />

      <PaymentCryptoSettingsPopup
        open={Boolean(editingCrypto)}
        onClose={() => setEditingCrypto(null)}
        initial={editingCrypto ?? undefined}
        onSubmit={handleCryptoSubmit}
      />

      <CryptoFeeSettingsPopup
        open={isCryptoFeePopupOpen}
        onClose={() => setIsCryptoFeePopupOpen(false)}
        values={cryptoFeeGeneral}
        onSubmit={handleCryptoFeeSubmit}
      />

      <PaymentWithdrawSettingsPopup
        open={isWithdrawPopupOpen}
        onClose={() => setIsWithdrawPopupOpen(false)}
        values={withdrawSettings}
        onSubmit={handleWithdrawSubmit}
      />
    </section>
  );
};

export default PaymentManagementPage;


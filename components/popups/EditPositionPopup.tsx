'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

interface EditPositionPopupProps {
  open: boolean;
  onClose: () => void;
  position: {
    id: string;
    orderNo: string;
    symbol: string;
    createdAt: string;
    volume: string;
    direction: string;
    enterPrice: string;
    price: string;
    stopLoss: string;
    takeProfit: string;
    swap: number;
    commission: number;
    profit: number;
    netProfit: number;
  } | null;
  onSave: (position: EditPositionPopupProps["position"]) => void;
}

const EditPositionPopup = ({ open, onClose, position, onSave }: EditPositionPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] =
    useState<EditPositionPopupProps["position"] | null>(position);

  useEffect(() => {
    setFormState(position);
  }, [position]);

  if (!position || !formState) {
    return (
      <ModalBase open={open} onClose={onClose} title={t("ui.edit_position_modal_title")} className="max-w-3xl">
        <p className="text-sm text-slate-500">{t("ui.edit_position_empty_state")}</p>
      </ModalBase>
    );
  }

  const numericKeys = new Set<"swap" | "commission" | "profit" | "netProfit">([
    "swap",
    "commission",
    "profit",
    "netProfit",
  ]);

  const handleChange = (
    key: keyof NonNullable<EditPositionPopupProps["position"]>,
    value: string
  ) => {
    const nextValue = numericKeys.has(key as keyof EditPositionPopupProps["position"])
      ? Number(value)
      : value;
    setFormState({ ...formState, [key]: nextValue as never });
  };

  const handleSave = () => {
    onSave(formState);
  };

  return (
    <ModalBase open={open} onClose={onClose} title={t("ui.edit_position_modal_title")} className="max-w-3xl">
      <div className="space-y-4 text-xs text-slate-700 md:text-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_order_number")}
            <div
              className="pointer-events-none select-none mt-1 w-full border border-slate-300 bg-slate-50 px-2 py-1 text-sm text-slate-700"
              aria-readonly="true"
            >
              {formState.orderNo}
            </div>
          </label>
          {[
            { key: "symbol", label: "Symbol", type: "symbol" as const },
            { key: "createdAt", label: "ui.label_created_time" },
            { key: "volume", label: "dashboard.table.volume" },
            { key: "enterPrice", label: "ui.label_enter_price" },
            { key: "price", label: "ui.label_price" },
            { key: "stopLoss", label: "ui.label_stop_loss" },
            { key: "takeProfit", label: "ui.label_take_profit" },
          ].map((field) => (
            <label
              key={field.key}
              className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500"
            >
              {field.type === "symbol" ? t("dashboard.table.symbol") : t(field.label)}
              {field.type === "symbol" ? (
                <select
                  className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
                  value={formState.symbol}
                  onChange={(event) => handleChange("symbol", event.target.value)}
                >
                  {["EURUSD", "XAUUSD", "GBPUSD", "USDJPY"].map((sym) => (
                    <option key={sym} value={sym}>
                      {sym}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
                  value={formState[field.key as keyof typeof formState] as string}
                  onChange={(event) =>
                    handleChange(field.key as keyof typeof formState, event.target.value)
                  }
                />
              )}
            </label>
          ))}
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("dashboard.table.direction")}
            <select
              className={`mt-1 w-full border border-slate-300 px-2 py-1 text-sm font-semibold ${
                formState.direction === "Buy" ? "text-emerald-600" : "text-red-500"
              }`}
              value={formState.direction}
              onChange={(event) => handleChange("direction", event.target.value)}
            >
              <option value="Buy" className="text-emerald-600" style={{ color: "#059669" }}>
                {t("ui.option_buy_label")}
              </option>
              <option value="Sell" className="text-red-500" style={{ color: "#dc2626" }}>
                {t("ui.option_sell_label")}
              </option>
            </select>
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_swap")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.swap}
              onChange={(event) => handleChange("swap", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_commission")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.commission}
              onChange={(event) => handleChange("commission", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_profit")}
            <div
              className={`pointer-events-none select-none mt-1 w-full border border-slate-300 bg-slate-50 px-2 py-1 text-sm ${
                Number(formState.profit) >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
              aria-readonly="true"
            >
              {`${Number(formState.profit) >= 0 ? "+" : "-"}$${Math.abs(
                Number(formState.profit)
              ).toLocaleString()}`}
            </div>
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_net_profit")}
            <div
              className={`pointer-events-none select-none mt-1 w-full border border-slate-300 bg-slate-50 px-2 py-1 text-sm ${
                Number(formState.netProfit) >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
              aria-readonly="true"
            >
              {`${Number(formState.netProfit) >= 0 ? "+" : "-"}$${Math.abs(
                Number(formState.netProfit)
              ).toLocaleString()}`}
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="border border-slate-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>
          <button
            type="button"
            className="bg-blue-600 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-blue-500"
            onClick={handleSave}
          >
            {t("ui.common_save_label")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default EditPositionPopup;


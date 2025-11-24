'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface OrderPosition {
  id: string;
  orderNo: string;
  symbol: string;
  createdAt: string;
  volume: string;
  direction: string;
  orderPrice: string;
  currentPrice: string;
  stopLoss: string;
  takeProfit: string;
}

interface EditOrderPopupProps {
  open: boolean;
  onClose: () => void;
  order: OrderPosition | null;
  onSave: (order: OrderPosition) => void;
}

const EditOrderPopup = ({ open, onClose, order, onSave }: EditOrderPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<OrderPosition | null>(order);

  useEffect(() => {
    setFormState(order);
  }, [order]);

  if (!order || !formState) {
    return (
      <ModalBase open={open} onClose={onClose} title={t("ui.edit_order_modal_title")} className="max-w-3xl">
        <p className="text-sm text-slate-500">{t("ui.edit_order_empty_state")}</p>
      </ModalBase>
    );
  }

  const handleChange = (key: keyof OrderPosition, value: string) => {
    setFormState({ ...formState, [key]: value });
  };

  const handleSave = () => {
    if (!formState) return;
    onSave(formState);
  };

  const symbolOptions = ["EURUSD", "XAUUSD", "GBPUSD", "USDJPY", "USOIL"];

  return (
    <ModalBase open={open} onClose={onClose} title={t("ui.edit_order_modal_title")} className="max-w-3xl">
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
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("dashboard.table.symbol")}
            <select
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.symbol}
              onChange={(event) => handleChange("symbol", event.target.value)}
            >
              {symbolOptions.map((symbol) => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_created_time")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.createdAt}
              onChange={(event) => handleChange("createdAt", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("dashboard.table.volume")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.volume}
              onChange={(event) => handleChange("volume", event.target.value)}
            />
          </label>
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
            {t("ui.label_order_price")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.orderPrice}
              onChange={(event) => handleChange("orderPrice", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_current_price")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.currentPrice}
              onChange={(event) => handleChange("currentPrice", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_stop_loss")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.stopLoss}
              onChange={(event) => handleChange("stopLoss", event.target.value)}
            />
          </label>
          <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("ui.label_take_profit")}
            <input
              className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
              value={formState.takeProfit}
              onChange={(event) => handleChange("takeProfit", event.target.value)}
            />
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

export default EditOrderPopup;



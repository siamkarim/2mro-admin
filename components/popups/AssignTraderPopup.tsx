'use client';

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";
import type { TraderAccount } from "@/mock/data";

interface AssignTraderPopupProps {
  open: boolean;
  onClose: () => void;
  adminName: string;
  traders?: TraderAccount[];
  assignedIds?: string[];
  onSave: (ids: string[]) => void;
}

const AssignTraderPopup = ({
  open,
  onClose,
  adminName,
  traders = [],
  assignedIds = [],
  onSave,
}: AssignTraderPopupProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>(assignedIds);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    setSelected(assignedIds);
  }, [assignedIds, open]);

  const filtered = useMemo(() => {
    const term = filter.toLowerCase();
    return (traders ?? []).filter((trader) =>
      [trader.userId, trader.name, trader.surname].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [filter, traders]);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selected);
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={`${t("ui.assign_traders_title")} · ${adminName}`}
      className="max-w-4xl"
    >
      <div className="flex h-[480px] flex-col gap-4 text-sm text-slate-700">
        <div className="flex items-center justify-between gap-3">
          <input
            className="h-9 flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder={t("ui.assign_trader_search_placeholder")}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {t("ui.assign_trader_selected_label")} {selected.length}
          </span>
        </div>
        <div className="flex-1 overflow-auto rounded border border-slate-200">
          <table className="w-full min-w-[720px] text-left text-xs uppercase tracking-[0.2em] text-slate-500">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="py-2 px-3">{t("ui.assign_trader_assign_column")}</th>
                <th className="py-2 px-3">{t("traders.columns.userId")}</th>
                <th className="py-2 px-3">{t("traders.columns.name")}</th>
                <th className="py-2 px-3">{t("traders.columns.surname")}</th>
                <th className="py-2 px-3">{t("labels.status")}</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {filtered.map((trader) => {
                const checked = selected.includes(trader.userId);
                return (
                  <tr key={trader.userId} className="border-b border-slate-100">
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggle(trader.userId)}
                        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-slate-500"
                      />
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {trader.userId}
                    </td>
                    <td className="py-2 px-3">{trader.name}</td>
                    <td className="py-2 px-3">{trader.surname}</td>
                    <td className="py-2 px-3">
                      {t(trader.status === "live" ? "traders.live" : "traders.demo")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            {t("ui.assign_trader_save_button")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default AssignTraderPopup;


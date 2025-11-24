'use client';

import { useTranslation } from "react-i18next";

import type { TraderAccount } from "@/mock/data";
import { formatMarginLevel } from "@/lib/utils/helpers";
import Table from "@/components/ui/Table";
import ModalBase from "./ModalBase";

interface OnlineUsersPopupProps {
  open: boolean;
  onClose: () => void;
  accounts: TraderAccount[];
}

const OnlineUsersPopup = ({ open, onClose, accounts }: OnlineUsersPopupProps) => {
  const { t } = useTranslation();

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("statCards.onlineUsers")}
      className="max-w-3xl h-[420px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto pr-2">
          <Table className="text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="py-2 px-2">{t("traders.columns.status")}</th>
                <th className="py-2 px-2">{t("traders.columns.userId")}</th>
                <th className="py-2 px-2">{t("traders.columns.name")}</th>
                <th className="py-2 px-2">{t("traders.columns.surname")}</th>
                <th className="py-2 px-2">{t("traders.columns.marginLevel")}</th>
              </tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-3 text-center text-sm text-slate-500">
                    {t("messages.empty")}
                  </td>
                </tr>
              ) : (
                accounts.map((account) => (
                  <tr key={account.userId} className="border-b border-slate-50">
                    <td className="py-3 px-2">
                      <span className="inline-block h-3 w-3 rounded-full border border-emerald-500 bg-emerald-500" />
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      {account.userId}
                    </td>
                    <td className="py-3 px-2 text-slate-700">{account.name}</td>
                    <td className="py-3 px-2 text-slate-700">{account.surname}</td>
                    <td className="py-3 px-2 font-semibold text-emerald-600">
                      {formatMarginLevel(account)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </ModalBase>
  );
};

export default OnlineUsersPopup;


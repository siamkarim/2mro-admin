"use client";

import { useTranslation } from "react-i18next";

import type { ActiveUser, TraderAccount } from "@/mock/data";
import { formatMarginLevel, formatMarginLevel2 } from "@/lib/utils/helpers";
import Table from "@/components/ui/Table";
import ModalBase from "./ModalBase";
import { useEffect, useState } from "react";
import { fetchOnlineUsers } from "@/lib/api/users";

interface OnlineUsersPopupProps {
  open: boolean;
  onClose: () => void;
}

const OnlineUsersPopup = ({ open, onClose }: OnlineUsersPopupProps) => {
  const { t } = useTranslation();
  const [onlineUsers, setOnlineUsers] = useState<ActiveUser[]>([]);

  const fetchUser = async () => {
    const data = await fetchOnlineUsers(100);
    console.log(data);
    setOnlineUsers(data.users);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
                <th className="py-2 px-2">
                  {t("traders.columns.marginLevel")}
                </th>
              </tr>
            </thead>
            <tbody>
              {onlineUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-3 text-center text-sm text-slate-500"
                  >
                    {t("messages.empty")}
                  </td>
                </tr>
              ) : (
                onlineUsers.map((account, index) => (
                  <tr key={index} className="border-b border-slate-50">
                    <td className="py-3 px-2">
                      <span className="inline-block h-3 w-3 rounded-full border border-emerald-500 bg-emerald-500" />
                    </td>
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      {account.user_id}
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      {account.first_name}
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      {account.user_name}
                    </td>
                    <td className="py-3 px-2 font-semibold text-emerald-600">
                      {formatMarginLevel2(account.margin_level)}
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

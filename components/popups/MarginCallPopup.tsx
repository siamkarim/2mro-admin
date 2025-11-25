"use client";

import { useTranslation } from "react-i18next";

import type { MarginCall, TraderAccount } from "@/mock/data";
import { formatMarginLevel, formatMarginLevel2 } from "@/lib/utils/helpers";
import Table from "@/components/ui/Table";
import ModalBase from "./ModalBase";
import { useEffect, useState } from "react";
import { fetchMarginCall } from "@/lib/api/dashboard";

interface MarginCallPopupProps {
  open: boolean;
  onClose: () => void;
}

const MarginCallPopup = ({ open, onClose }: MarginCallPopupProps) => {
  const { t } = useTranslation();
  const [marginData, setMarginData] = useState<MarginCall[]>([]);

  const fetchUser = async () => {
    const data = await fetchMarginCall();
    console.log(data);
    setMarginData(data.accounts);
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("statCards.marginCall")}
      className="max-w-3xl h-[420px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto pr-2">
          <Table className="text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="py-2 px-2">{t("traders.columns.userId")}</th>
                <th className="py-2 px-2">{t("traders.columns.name")}</th>
                {/* <th className="py-2 px-2">{t("traders.columns.surname")}</th> */}
                <th className="py-2 px-2">
                  {t("traders.columns.marginLevel")}
                </th>
              </tr>
            </thead>
            <tbody>
              {marginData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-3 text-center text-sm text-slate-500"
                  >
                    {t("messages.empty")}
                  </td>
                </tr>
              ) : (
                marginData.map((account) => (
                  <tr
                    key={account.user_id}
                    className="border-b border-slate-50"
                  >
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      {account.user_id}
                    </td>
                    <td className="py-3 px-2 text-slate-700">
                      {account.user_name}
                    </td>
                    {/* <td className="py-3 px-2 text-slate-700">{account.surname}</td> */}
                    <td className="py-3 px-2 font-semibold text-red-600">
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

export default MarginCallPopup;

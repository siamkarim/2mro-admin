"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button";
import ModalBase from "@/components/popups/ModalBase";
import Table from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils/helpers";
import type { PendingDataType, PendingFunding } from "@/mock/data";
import { fetchPendingDeposit } from "@/lib/api/depsoit";

type DepositFilter = "all" | "bank" | "crypto";
type ActionType = "approve" | "reject";

interface PendingDepositPopupProps {
  open: boolean;
  onClose: () => void;
  deposits: PendingFunding[];
}

interface ActionState {
  entry: PendingDataType;
  type: ActionType;
}

const PendingDepositPopup = ({
  open,
  onClose,
  deposits,
}: PendingDepositPopupProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("all");
  const [action, setAction] = useState<ActionState | null>(null);

  const [pendingUser, setPendingUser] = useState<PendingDataType[]>([]);

  const fetchUser = async () => {
    const data = await fetchPendingDeposit("deposit");
    console.log(data);
    setPendingUser(data.transactions);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const filteredDeposits = useMemo(() => {
    if (filter === "all") return pendingUser;
    return pendingUser.filter((deposit) => deposit.transaction_method === filter);
  }, [pendingUser, filter]);

  const accountColumnLabel =
    filter === "crypto"
      ? t("funding.address")
      : filter === "bank"
      ? t("funding.account")
      : t("funding.accountAddress");

  const handleClose = () => {
    setFilter("all");
    onClose();
  };

  const handleActionConfirm = () => {
    setAction(null);
  };

  return (
    <>
      <ModalBase
        open={open}
        onClose={handleClose}
        title={t("funding.pendingTitle")}
        className="max-w-4xl h-[540px]"
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "bank", "crypto"] as const).map((option) => (
              <Button
                key={option}
                variant={filter === option ? "primary" : "outline"}
                onClick={() => setFilter(option)}
              >
                {t(`filters.${option}`)}
              </Button>
            ))}
          </div>
          <div className="mt-4 flex-1 overflow-y-auto pr-2">
            <Table className="text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="py-2 px-2">{t("traders.columns.userId")}</th>
                  <th className="py-2 px-2">{t("traders.columns.name")}</th>
                  <th className="py-2 px-2">{t("traders.columns.surname")}</th>
                  <th className="py-2 px-2">
                    {t("traders.columns.accountType")}
                  </th>
                  <th className="py-2 px-2">{accountColumnLabel}</th>
                  <th className="py-2 px-2">{t("funding.amount")}</th>
                  <th className="py-2 px-2 text-right">
                    {t("actions.approve")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-4 text-center text-sm text-slate-500"
                    >
                      {t("messages.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-50">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {entry.user_id}
                      </td>
                      <td className="py-3 px-2 text-slate-700">
                        {entry.user?.first_name}
                      </td>
                      <td className="py-3 px-2 text-slate-700">
                        {entry.user?.first_name}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {t(
                          entry.transaction_method === "bank"
                            ? "filters.bank"
                            : "filters.crypto"
                        )}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {entry.account_holder_name}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="success"
                            onClick={() =>
                              setAction({ entry, type: "approve" })
                            }
                          >
                            {t("actions.approve")}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => setAction({ entry, type: "reject" })}
                          >
                            {t("actions.reject")}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </ModalBase>

      <ModalBase
        open={Boolean(action)}
        onClose={() => setAction(null)}
        title={t("funding.confirmTitle")}
        className="max-w-md"
      >
        {action ? (
          <div className="space-y-4 text-sm text-slate-700">
            <p>
              {t("funding.confirmText", {
                action:
                  action.type === "approve"
                    ? t("actions.approve")
                    : t("actions.reject"),
              })}
            </p>
            <div className="rounded border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">
                {action.entry.user_name} {action.entry.user_name}
              </p>
              <p>{formatCurrency(action.entry.amount)}</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAction(null)}>
                {t("actions.cancel")}
              </Button>
              <Button
                variant={action.type === "approve" ? "primary" : "danger"}
                onClick={handleActionConfirm}
              >
                {t("actions.confirm")}
              </Button>
            </div>
          </div>
        ) : null}
      </ModalBase>
    </>
  );
};

export default PendingDepositPopup;

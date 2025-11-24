'use client';

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button";
import ModalBase from "@/components/popups/ModalBase";
import Table from "@/components/ui/Table";
import { formatCurrency } from "@/lib/utils/helpers";
import type { PendingWithdrawal } from "@/mock/data";

type WithdrawalFilter = "all" | "bank" | "crypto";
type ActionType = "approve" | "reject";

interface PendingWithdrawalPopupProps {
  open: boolean;
  onClose: () => void;
  withdrawals: PendingWithdrawal[];
}

interface ActionState {
  entry: PendingWithdrawal;
  type: ActionType;
}

const PendingWithdrawalPopup = ({
  open,
  onClose,
  withdrawals,
}: PendingWithdrawalPopupProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<WithdrawalFilter>("all");
  const [action, setAction] = useState<ActionState | null>(null);

  const filteredWithdrawals = useMemo(() => {
    if (filter === "all") return withdrawals;
    return withdrawals.filter((withdrawal) => withdrawal.type === filter);
  }, [withdrawals, filter]);

  const isAllFilter = filter === "all";
  const columnCount = 8;

  const handleClose = () => {
    setFilter("all");
    onClose();
  };

  const handleActionConfirm = () => {
    setAction(null);
  };

  const handleCopy = async (value?: string) => {
    if (!value) return;
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // swallow clipboard errors silently
    }
  };

  const renderCopyableValue = (value?: string) =>
    value ? (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="truncate">{value}</span>
        <button
          type="button"
          className="text-[10px] uppercase tracking-[0.3em] text-slate-400 transition-colors duration-150 hover:text-slate-900 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
          onClick={() => void handleCopy(value)}
        >
          {t("actions.copy", { defaultValue: "Copy" })}
        </button>
      </span>
    ) : (
      <span className="text-slate-400">—</span>
    );

  const columnLabels = useMemo(() => {
    if (isAllFilter) {
      return {
        entityLines: [t("funding.bankName"), t("funding.cryptoLabel")],
        detailLines: [
          `${t("funding.account")} / ${t("funding.iban")}`,
          `${t("funding.network")} / ${t("funding.address")}`,
        ],
      };
    }

    if (filter === "bank") {
      return {
        entityLines: [t("funding.bankName")],
        detailLines: [`${t("funding.account")} / ${t("funding.iban")}`],
      };
    }

    return {
      entityLines: [t("funding.cryptoLabel")],
      detailLines: [`${t("funding.network")} / ${t("funding.address")}`],
    };
  }, [filter, isAllFilter, t]);

  const renderDetailGroup = (entry: PendingWithdrawal) => {
    if (entry.type === "bank") {
      return (
        <div className="space-y-1">
          <div className="text-slate-600">{renderCopyableValue(entry.accountName)}</div>
          <div className="text-slate-600">{renderCopyableValue(entry.iban)}</div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="text-slate-600">{renderCopyableValue(entry.network)}</div>
        <div className="text-slate-600">
          {renderCopyableValue(entry.address ?? entry.accountName)}
        </div>
      </div>
    );
  };

  const resolveEntityValue = (entry: PendingWithdrawal) =>
    entry.type === "bank"
      ? entry.bankName ?? entry.accountName
      : entry.cryptoName ?? entry.accountName;

  return (
    <>
      <ModalBase
        open={open}
        onClose={handleClose}
        title={t("funding.pendingWithdrawTitle")}
        className="max-w-5xl h-[600px]"
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
                  <th className="py-2 px-2">{t("funding.type")}</th>
                  <th className="py-2 px-2 leading-tight">
                    {columnLabels.entityLines.map((line, index) => (
                      <span
                        key={`${line}-${index}`}
                        className={index === 0 ? "block" : "block pt-1"}
                      >
                        {line}
                      </span>
                    ))}
                  </th>
                  <th className="py-2 px-2 leading-tight">
                    {columnLabels.detailLines.map((line, index) => (
                      <span
                        key={`${line}-${index}`}
                        className={index === 0 ? "block" : "block pt-1"}
                      >
                        {line}
                      </span>
                    ))}
                  </th>
                  <th className="py-2 px-2">{t("funding.amount")}</th>
                  <th className="py-2 px-2 text-right">
                    {t("funding.actionColumn")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWithdrawals.length === 0 ? (
                  <tr>
                    <td colSpan={columnCount} className="py-4 text-center text-sm text-slate-500">
                      {t("messages.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredWithdrawals.map((entry) => (
                    <tr key={entry.id} className="border-b border-slate-50">
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {entry.userId}
                      </td>
                      <td className="py-3 px-2 text-slate-700">{entry.name}</td>
                      <td className="py-3 px-2 text-slate-700">{entry.surname}</td>
                      <td className="py-3 px-2 text-slate-600">
                        {t(entry.type === "bank" ? "filters.bank" : "filters.crypto")}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {resolveEntityValue(entry) ?? "—"}
                      </td>
                      <td className="py-3 px-2 text-slate-600">
                        {renderDetailGroup(entry)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-900">
                        {formatCurrency(entry.amount)}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="success"
                            onClick={() => setAction({ entry, type: "approve" })}
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
              {action.type === "approve"
                ? t("funding.confirmWithdrawTextApprove", {
                    defaultValue: "Are you sure you want to approve this withdrawal?",
                  })
                : t("funding.confirmWithdrawTextReject", {
                    defaultValue: "Are you sure you want to reject this withdrawal?",
                  })}
            </p>
            <div className="rounded border border-slate-100 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">
                {action.entry.name} {action.entry.surname}
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

export default PendingWithdrawalPopup;


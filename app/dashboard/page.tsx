'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { RoleGuard } from "@/context/AuthContext";
import {
  fetchPendingDeposits,
  fetchPendingWithdrawals,
  fetchTraderAccounts,
  fetchTraderStats,
} from "@/lib/api";
import type {
  PendingFunding,
  PendingWithdrawal,
  TraderAccount,
  TraderStats,
} from "@/mock/data";
import { formatMarginLevel, ROUTE_MAP } from "@/lib/utils/helpers";
import MarginCallPopup from "@/components/popups/MarginCallPopup";
import OnlineUsersPopup from "@/components/popups/OnlineUsersPopup";
import PendingDepositPopup from "@/components/popups/PendingDepositPopup";
import PendingWithdrawalPopup from "@/components/popups/PendingWithdrawalPopup";
import TraderDetailPopup from "@/components/popups/TraderDetailPopup";

type StatKey =
  | "totalUsers"
  | "onlineUsers"
  | "marginCall"
  | "pendingDeposit"
  | "pendingWithdrawal"
  | "totalDeposit"
  | "totalWithdrawal";

interface StatItem {
  key: StatKey;
  label: string;
  value: string;
  accent?: string;
}

const DashboardPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<TraderAccount[]>([]);
  const [accountFilter, setAccountFilter] = useState<"live" | "demo">("live");
  const [stats, setStats] = useState<TraderStats | null>(null);
  const [pendingDeposits, setPendingDeposits] = useState<PendingFunding[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawal[]>([]);

  const [isStatsMenuOpen, setIsStatsMenuOpen] = useState(false);
  const [isOnlinePopupOpen, setIsOnlinePopupOpen] = useState(false);
  const [isMarginPopupOpen, setIsMarginPopupOpen] = useState(false);
  const [isPendingDepositOpen, setIsPendingDepositOpen] = useState(false);
  const [isPendingWithdrawalOpen, setIsPendingWithdrawalOpen] = useState(false);
  const [isTraderPopupOpen, setIsTraderPopupOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<TraderAccount | null>(null);
  const [generatedAt, setGeneratedAt] = useState("");

  const refreshData = useCallback(async () => {
    setLoading(true);
    const [accountList, traderStats, depositList, withdrawalList] =
      await Promise.all([
        fetchTraderAccounts(),
        fetchTraderStats(),
        fetchPendingDeposits(),
        fetchPendingWithdrawals(),
      ]);

    setAccounts(accountList);
    setPendingDeposits(depositList);
    setPendingWithdrawals(withdrawalList);
    setStats({
      ...traderStats,
      onlineUsers: accountList.filter((account) => account.online).length,
      pendingDeposit: depositList.length,
      pendingWithdrawal: withdrawalList.length,
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      void refreshData();
    });
    return () => cancelAnimationFrame(frame);
  }, [refreshData]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setGeneratedAt(new Date().toLocaleString());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const filteredAccounts = useMemo(
    () => accounts.filter((account) => account.accountType === accountFilter),
    [accounts, accountFilter]
  );

  const onlineAccounts = useMemo(
    () => accounts.filter((account) => account.online),
    [accounts]
  );

  const marginAccounts = useMemo(
    () => accounts.filter((account) => account.marginCall),
    [accounts]
  );

  const statItems: StatItem[] = stats
    ? [
        {
          key: "totalUsers",
          label: t("statCards.totalUsers"),
          value: stats.totalUsers.toLocaleString(),
        },
        {
          key: "onlineUsers",
          label: t("statCards.onlineUsers"),
          value: stats.onlineUsers.toLocaleString(),
          accent: "text-emerald-600",
        },
        {
          key: "marginCall",
          label: t("statCards.marginCall"),
          value: stats.marginCalls.toLocaleString(),
          accent: "text-red-600",
        },
        {
          key: "pendingDeposit",
          label: t("statCards.pendingDeposit"),
          value: stats.pendingDeposit.toLocaleString(),
        },
        {
          key: "pendingWithdrawal",
          label: t("statCards.pendingWithdrawal"),
          value: stats.pendingWithdrawal.toLocaleString(),
        },
        {
          key: "totalDeposit",
          label: t("statCards.totalDeposit"),
          value: `+$${stats.totalDeposit.toLocaleString()}`,
          accent: "text-emerald-600",
        },
        {
          key: "totalWithdrawal",
          label: t("statCards.totalWithdrawal"),
          value: `-$${stats.totalWithdrawal.toLocaleString()}`,
          accent: "text-red-600",
        },
      ]
    : [];

  const statActions: Partial<Record<StatKey, () => void>> = {
    onlineUsers: () => setIsOnlinePopupOpen(true),
    marginCall: () => setIsMarginPopupOpen(true),
    pendingDeposit: () => setIsPendingDepositOpen(true),
    pendingWithdrawal: () => setIsPendingWithdrawalOpen(true),
  };

  const hoverStyles: Partial<Record<StatKey, string>> = {
    onlineUsers:
      "hover:border-emerald-500 focus-visible:border-emerald-500 hover:bg-emerald-50",
    marginCall:
      "hover:border-red-500 focus-visible:border-red-500 hover:bg-red-50",
    pendingDeposit:
      "hover:border-emerald-500 focus-visible:border-emerald-500 hover:bg-emerald-50",
    pendingWithdrawal:
      "hover:border-red-500 focus-visible:border-red-500 hover:bg-red-50",
  };

  return (
    <RoleGuard allowedRoles={ROUTE_MAP.dashboard.allowedRoles}>
      <section className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">
            {t("dashboard.title")}
          </h1>
        </header>

        {stats ? (
          <>
            <div className="hidden gap-4 overflow-visible md:flex">
              {statItems.map((item) => {
                const handler = statActions[item.key];
                const interactive = Boolean(handler);
                const titleBase =
                  "text-xs font-semibold uppercase tracking-[0.25em]";
                const titleColor =
                  item.key === "marginCall" ? "text-red-600" : "text-slate-500";

                return (
                  <div
                    key={item.key}
                    role={interactive ? "button" : undefined}
                    tabIndex={interactive ? 0 : -1}
                    className={`relative flex h-28 min-w-[220px] flex-col justify-between border border-slate-200 bg-white px-4 py-3 text-left ${
                      interactive
                        ? `cursor-pointer transition-colors duration-150 ${
                            hoverStyles[item.key] ??
                            "hover:border-slate-900 focus-visible:border-slate-900"
                          }`
                        : "cursor-default"
                    }`}
                    onClick={() => handler?.()}
                    onKeyDown={(event) => {
                      if (!interactive) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handler?.();
                      }
                    }}
                  >
                    <p className={`${titleBase} ${titleColor}`}>{item.label}</p>
                    <p className={`text-2xl font-semibold ${item.accent ?? "text-slate-900"}`}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-end md:hidden">
              <button
                type="button"
                className="border border-slate-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
                onClick={() => setIsStatsMenuOpen(true)}
              >
                {t("stats.menu")}
              </button>
            </div>
          </>
        ) : null}
        {loading ? (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
            {t("messages.loading")}
          </div>
        ) : null}

        {isStatsMenuOpen ? (
          <div className="fixed inset-0 z-40 flex items-start justify-center p-4 md:hidden">
            <button
              type="button"
              aria-label="Close stats menu"
              className="fixed inset-0 z-30 cursor-default bg-transparent"
              onClick={() => setIsStatsMenuOpen(false)}
            />
            <div className="relative z-40 w-full max-w-sm border border-slate-300 bg-white p-5">
              <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-2">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-600">
                  {t("stats.menu")}
                </p>
                <button
                  type="button"
                  className="border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"
                  onClick={() => setIsStatsMenuOpen(false)}
                >
                  Close
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {statItems.map((item) => {
                  const handler = statActions[item.key];
                  const interactive = Boolean(handler);
                  return (
                    <button
                      type="button"
                      key={item.label}
                      className={`flex items-center justify-between border border-slate-200 px-3 py-2 text-left text-sm ${
                        interactive ? "text-slate-900" : "cursor-default"
                      }`}
                      onClick={() => {
                        handler?.();
                        setIsStatsMenuOpen(false);
                      }}
                    >
                      <span className="font-semibold uppercase tracking-[0.2em] text-slate-500">
                        {item.label}
                      </span>
                      <span className="text-base font-semibold text-slate-900">
                        {item.value}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <section className="space-y-4 border border-slate-200 bg-white p-4">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {t("traders.title")}
              </p>
              <p className="text-xs text-slate-500">
                Forex · {generatedAt || "—"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex border border-slate-300">
                {(["live", "demo"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                      accountFilter === type
                        ? "bg-slate-900 text-white"
                        : "text-slate-700"
                    }`}
                    onClick={() => setAccountFilter(type)}
                  >
                    {t(type === "live" ? "traders.live" : "traders.demo")}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-100"
                onClick={() => void refreshData()}
              >
                {t("actions.refresh")}
              </button>
              <button
                type="button"
                className="border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
              >
                {t("traders.export")}
              </button>
            </div>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="py-2 px-3">{t("traders.columns.userId")}</th>
                  <th className="py-2 px-3">{t("traders.columns.status")}</th>
                  <th className="py-2 px-3">{t("traders.columns.name")}</th>
                  <th className="py-2 px-3">{t("traders.columns.surname")}</th>
                  <th className="py-2 px-3">{t("traders.columns.accountType")}</th>
                  <th className="py-2 px-3">{t("traders.columns.credit")}</th>
                  <th className="py-2 px-3">{t("traders.columns.balance")}</th>
                  <th className="py-2 px-3">{t("traders.columns.equity")}</th>
                  <th className="py-2 px-3">{t("traders.columns.freeMargin")}</th>
                  <th className="py-2 px-3">{t("traders.columns.marginLevel")}</th>
                  <th className="py-2 px-3 text-right">{t("traders.columns.editTrader")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="py-4 text-center text-sm text-slate-500"
                    >
                      {t("messages.empty")}
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.userId} className="border-b border-slate-100">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {account.userId}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <span
                          aria-hidden
                          className="mr-2 inline-block h-3 w-3 bg-emerald-500"
                        />
                        {t(
                          account.status === "live"
                            ? "traders.live"
                            : "traders.demo"
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-900">{account.name}</td>
                      <td className="py-3 px-3 text-slate-900">
                        {account.surname}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {`${t(
                          account.accountType === "live"
                            ? "traders.live"
                            : "traders.demo"
                        )} - ${account.currency.toUpperCase()}`}
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        {account.credit.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        ${account.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        ${account.equity.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        ${account.freeMargin.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-slate-900">
                        {formatMarginLevel(account)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          className="border border-slate-300 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-700 hover:bg-slate-100"
                          onClick={() => {
                            setSelectedTrader(account);
                            setIsTraderPopupOpen(true);
                          }}
                        >
                          {t("traders.columns.editTrader")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <OnlineUsersPopup
          open={isOnlinePopupOpen}
          onClose={() => setIsOnlinePopupOpen(false)}
          accounts={onlineAccounts}
        />
        <MarginCallPopup
          open={isMarginPopupOpen}
          onClose={() => setIsMarginPopupOpen(false)}
          accounts={marginAccounts}
        />
        <PendingDepositPopup
          open={isPendingDepositOpen}
          onClose={() => setIsPendingDepositOpen(false)}
          deposits={pendingDeposits}
        />
        <PendingWithdrawalPopup
          open={isPendingWithdrawalOpen}
          onClose={() => setIsPendingWithdrawalOpen(false)}
          withdrawals={pendingWithdrawals}
        />
        <TraderDetailPopup
          open={isTraderPopupOpen}
          onClose={() => {
            setIsTraderPopupOpen(false);
            setSelectedTrader(null);
          }}
          account={selectedTrader}
        />
      </section>
    </RoleGuard>
  );
};

export default DashboardPage;


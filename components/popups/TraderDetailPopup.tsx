"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import BankSettingsPopup, {
  BankSettings,
} from "@/components/popups/BankSettingsPopup";
import CryptoFeeSettingsPopup, {
  CryptoFeeSettings,
} from "@/components/popups/CryptoFeeSettingsPopup";
import CryptoSettingsPopup, {
  CryptoSettings,
} from "@/components/popups/CryptoSettingsPopup";
import EditOrderPopup, {
  OrderPosition,
} from "@/components/popups/EditOrderPopup";
import EditPositionPopup from "@/components/popups/EditPositionPopup";
import PaymentWithdrawSettingsPopup from "@/components/popups/PaymentWithdrawSettingsPopup";
import ModalBase from "@/components/popups/ModalBase";
import type {
  AdjustmentLog,
  TraderAccount,
  TraderAccountType,
} from "@/mock/data";
import { mockAdjustmentLogs } from "@/mock/data";

interface TraderDetailPopupProps {
  open: boolean;
  onClose: () => void;
  account: TraderAccountType | null;
}

const tabs = [
  "Open Positions",
  "Order Positions",
  "Closed Positions",
  "Transactions",
  "Deposit Settings",
  "Account Settings",
] as const;

const tabLabelKeyMap: Record<(typeof tabs)[number], string> = {
  "Open Positions": "ui.tab_open_positions_label",
  "Order Positions": "ui.tab_order_positions_label",
  "Closed Positions": "ui.tab_closed_positions_label",
  Transactions: "ui.tab_transactions_label",
  "Deposit Settings": "ui.tab_deposit_settings_label",
  "Account Settings": "ui.tab_account_settings_label",
};

const totals = [
  { labelKey: "ui.total_swaps_label", value: "$0.00" },
  { labelKey: "ui.total_commission_label", value: "$0.00" },
  { labelKey: "ui.total_profit_label", value: "$0.00" },
  { labelKey: "ui.total_total_profit_label", value: "$0.00" },
];

const openPositionHeaderKeys = [
  "dashboard.table.symbol",
  "ui.label_created_time",
  "dashboard.table.volume",
  "dashboard.table.direction",
  "ui.label_enter_price",
  "ui.label_price",
  "ui.label_stop_loss",
  "ui.label_take_profit",
  "ui.label_swap",
  "ui.label_commission",
  "ui.label_profit",
  "ui.label_net_profit",
];

const orderPositionHeaderKeys = [
  "ui.label_order_number",
  "dashboard.table.symbol",
  "ui.label_created_time",
  "dashboard.table.volume",
  "dashboard.table.direction",
  "ui.label_order_price",
  "ui.label_current_price",
  "ui.label_stop_loss",
  "ui.label_take_profit",
];

const closedPositionHeaderKeys = [
  "ui.label_order_number",
  "dashboard.table.symbol",
  "ui.label_created_time",
  "ui.label_close_time",
  "dashboard.table.volume",
  "dashboard.table.direction",
  "ui.label_enter_price",
  "ui.label_close_price",
  "ui.label_stop_loss",
  "ui.label_take_profit",
  "ui.label_swap",
  "ui.label_commission",
  "ui.label_profit",
  "ui.label_net_profit",
];

const transactionHeaderKeys = [
  "ui.transactions_table_id_label",
  "funding.type",
  "dashboard.table.direction",
  "reports.columns.timestamp",
  "funding.amount",
  "labels.status",
];

const mockOpenPositions = [
  {
    id: "pos-1",
    orderNo: "ORD-40018",
    symbol: "EURUSD",
    createdAt: "2025-02-14 09:32",
    volume: "1.00",
    direction: "Buy",
    enterPrice: "1.07210",
    price: "1.07430",
    stopLoss: "1.06600",
    takeProfit: "1.08000",
    swap: -1.2,
    commission: -3.5,
    profit: 220,
    netProfit: 215.3,
  },
  {
    id: "pos-2",
    orderNo: "ORD-40027",
    symbol: "XAUUSD",
    createdAt: "2025-02-13 15:08",
    volume: "0.50",
    direction: "Sell",
    enterPrice: "2058.40",
    price: "2052.10",
    stopLoss: "2066.00",
    takeProfit: "2045.00",
    swap: -0.8,
    commission: -2.1,
    profit: 315,
    netProfit: 312.1,
  },
];

type Position = (typeof mockOpenPositions)[number];

const mockOrderPositions: OrderPosition[] = [
  {
    id: "ord-1",
    orderNo: "ORD-9021",
    symbol: "GBPUSD",
    createdAt: "2025-02-12 11:45",
    volume: "0.80",
    direction: "Buy",
    orderPrice: "1.26340",
    currentPrice: "1.26710",
    stopLoss: "1.25800",
    takeProfit: "1.27200",
  },
  {
    id: "ord-2",
    orderNo: "ORD-9022",
    symbol: "USOIL",
    createdAt: "2025-02-11 17:22",
    volume: "1.20",
    direction: "Sell",
    orderPrice: "74.30",
    currentPrice: "73.10",
    stopLoss: "75.10",
    takeProfit: "71.80",
  },
];

const mockClosedPositions = [
  {
    id: "cpos-1",
    orderNo: "ORD-3011",
    symbol: "EURJPY",
    createdAt: "2025-02-10 08:20",
    closeTime: "2025-02-10 14:35",
    volume: "0.60",
    direction: "Buy",
    enterPrice: "160.210",
    closePrice: "160.980",
    stopLoss: "159.800",
    takeProfit: "161.200",
    swap: -0.5,
    commission: -1.7,
    profit: 180,
    netProfit: 177.8,
  },
  {
    id: "cpos-2",
    orderNo: "ORD-3012",
    symbol: "AUDUSD",
    createdAt: "2025-02-09 09:05",
    closeTime: "2025-02-09 15:42",
    volume: "1.10",
    direction: "Sell",
    enterPrice: "0.65720",
    closePrice: "0.65380",
    stopLoss: "0.66000",
    takeProfit: "0.65200",
    swap: -0.9,
    commission: -2.3,
    profit: 375,
    netProfit: 371.8,
  },
];

type ClosedPosition = (typeof mockClosedPositions)[number];
interface TransactionItem {
  id: string;
  type: "bank" | "crypto";
  direction: "withdrawal" | "deposit";
  time: string;
  amount: number;
  status: "approved" | "rejected";
}

const mockTransactions: TransactionItem[] = [
  {
    id: "TRX-1001",
    type: "bank",
    direction: "deposit",
    time: "2025-02-12 10:15",
    amount: 2500,
    status: "approved",
  },
  {
    id: "TRX-1002",
    type: "crypto",
    direction: "withdrawal",
    time: "2025-02-11 16:48",
    amount: 1800,
    status: "rejected",
  },
  {
    id: "TRX-1003",
    type: "bank",
    direction: "withdrawal",
    time: "2025-02-10 13:05",
    amount: 4200,
    status: "approved",
  },
];

const TraderDetailPopup = ({
  open,
  onClose,
  account,
}: TraderDetailPopupProps) => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Position[]>(mockOpenPositions);
  const [orderPositions, setOrderPositions] =
    useState<OrderPosition[]>(mockOrderPositions);
  const closedPositions: ClosedPosition[] = mockClosedPositions;
  const transactions = mockTransactions;
  const [bankDetails, setBankDetails] = useState<BankSettings>({
    bankName: "Forex Bank",
    accountName: "Forex Holdings",
    accountNumber: "366363333",
    swift: "ASDSA523",
    iban: "SDUJFDJAS5245W5DS",
    depositFee: "3",
    commissionFee: "1.2",
  });
  const [bankActive, setBankActive] = useState(true);
  const [cryptoAccounts, setCryptoAccounts] = useState<CryptoSettings[]>([
    {
      id: "crypto-1",
      crypto: "USDT",
      network: "TRC-20",
      address: "894hfdscn98444",
    },
  ]);
  const [cryptoActive, setCryptoActive] = useState(true);
  const [cryptoFeeGeneral, setCryptoFeeGeneral] = useState<CryptoFeeSettings>({
    deposit: "3",
    commission: "2",
  });
  const [withdrawSettings, setWithdrawSettings] = useState<{
    fee: string;
    tax: string;
  }>({
    fee: "5",
    tax: "12",
  });
  const [withdrawActive, setWithdrawActive] = useState(true);
  const [isWithdrawPopupOpen, setIsWithdrawPopupOpen] = useState(false);
  const [leverageRatio, setLeverageRatio] = useState("100");
  const [leverageDraft, setLeverageDraft] = useState("100");
  const [creditAdjustments, setCreditAdjustments] = useState<
    Record<string, number>
  >({});
  const [balanceAdjustments, setBalanceAdjustments] = useState<
    Record<string, number>
  >({});
  const [creditInput, setCreditInput] = useState("");
  const [balanceInput, setBalanceInput] = useState("");
  const [isBankPopupOpen, setIsBankPopupOpen] = useState(false);
  const [isCryptoFeePopupOpen, setIsCryptoFeePopupOpen] = useState(false);
  const [editingCrypto, setEditingCrypto] = useState<CryptoSettings | null>(
    null
  );
  const [pendingAdjustment, setPendingAdjustment] = useState<{
    target: "credit" | "balance";
    mode: "add" | "remove";
    amount: number;
  } | null>(null);
  const [manualAdjustmentLogs, setManualAdjustmentLogs] = useState<
    Record<string, AdjustmentLog[]>
  >({});
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderPosition | null>(
    null
  );
  const [isEditPositionOpen, setIsEditPositionOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<(typeof tabs)[number]>("Open Positions");

  const baseAdjustmentLogs = useMemo(() => {
    if (!account) return [];
    return mockAdjustmentLogs.filter((log) => log.user_id === account.user_id);
  }, [account]);

  const adjustmentLogs = useMemo(() => {
    if (!account) return [];
    const manual = manualAdjustmentLogs[account.user_id] ?? [];
    return [...manual, ...baseAdjustmentLogs];
  }, [manualAdjustmentLogs, baseAdjustmentLogs, account]);

  if (!account) return null;

  const isOpenTab = activeTab === "Open Positions";
  const isOrderTab = activeTab === "Order Positions";
  const isClosedTab = activeTab === "Closed Positions";
  const isTransactionsTab = activeTab === "Transactions";
  const isDepositSettingsTab = activeTab === "Deposit Settings";
  const isAccountSettingsTab = activeTab === "Account Settings";
  const canEdit =
    (isOpenTab && Boolean(selectedPosition)) ||
    (isOrderTab && Boolean(selectedOrder));
  const canClose =
    (isOpenTab && Boolean(selectedPosition)) ||
    (isOrderTab && Boolean(selectedOrder));
  const editLabel = isOrderTab
    ? t("ui.edit_order_modal_title")
    : t("ui.edit_position_modal_title");

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // ignore clipboard errors silently
    }
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

  const handleCryptoFeeSubmit = (values: CryptoFeeSettings) => {
    setCryptoFeeGeneral(values);
    setIsCryptoFeePopupOpen(false);
  };

  const handleWithdrawSubmit = (payload: { fee: string; tax: string }) => {
    setWithdrawSettings(payload);
    setIsWithdrawPopupOpen(false);
  };

  const bankDetailFields: Array<{ labelKey: string; key: keyof BankSettings }> =
    [
      { labelKey: "ui.bank_name_label", key: "bankName" },
      { labelKey: "ui.bank_account_name_label", key: "accountName" },
      { labelKey: "ui.bank_account_number_label", key: "accountNumber" },
      { labelKey: "ui.bank_swift_label", key: "swift" },
      { labelKey: "funding.iban", key: "iban" },
      { labelKey: "ui.bank_deposit_fee_label", key: "depositFee" },
      { labelKey: "ui.bank_commission_fee_label", key: "commissionFee" },
    ];

  const handleBankSettingsSubmit = (payload: {
    details: BankSettings;
    active: boolean;
  }) => {
    setBankDetails(payload.details);
    setBankActive(payload.active);
    setIsBankPopupOpen(false);
  };

  const handleLeverageSave = () => {
    setLeverageRatio(leverageDraft || "1");
  };

  const accountId = account.user_id;
  const currentCredit =
    (account.credit ?? 0) + (creditAdjustments[accountId] ?? 0);
  const currentBalance =
    (account.balance ?? 0) + (balanceAdjustments[accountId] ?? 0);

  const requestAdjustment = (
    target: "credit" | "balance",
    mode: "add" | "remove"
  ) => {
    const value = target === "credit" ? creditInput : balanceInput;
    const amount = Number(value);
    if (!amount) return;
    setPendingAdjustment({ target, mode, amount });
  };

  const confirmAdjustment = () => {
    if (!pendingAdjustment) return;
    const { target, mode, amount } = pendingAdjustment;
    const delta = mode === "add" ? amount : -amount;
    let updatedCredit = currentCredit;
    let updatedBalance = currentBalance;
    const baseCredit = account.credit ?? 0;
    const baseBalance = account.balance ?? 0;

    if (target === "credit") {
      updatedCredit = Math.max(0, currentCredit + delta);
      setCreditAdjustments((prev) => ({
        ...prev,
        [accountId]: updatedCredit - baseCredit,
      }));
      setCreditInput("");
    } else {
      updatedBalance = Math.max(0, currentBalance + delta);
      setBalanceAdjustments((prev) => ({
        ...prev,
        [accountId]: updatedBalance - baseBalance,
      }));
      setBalanceInput("");
    }

    setManualAdjustmentLogs((prev) => {
      const existing = prev[accountId] ?? [];
      const nextLog: AdjustmentLog = {
        id: `log-${Date.now()}`,
        userId: accountId,
        target,
        mode,
        amount,
        createdAt: new Date().toLocaleString(),
        creditAfter: updatedCredit,
        balanceAfter: updatedBalance,
      };
      return { ...prev, [accountId]: [nextLog, ...existing] };
    });

    setPendingAdjustment(null);
  };

  const cancelAdjustment = () => {
    setPendingAdjustment(null);
  };

  const summary = [
    { label: t("traders.columns.userId"), value: account.userId },
    {
      label: t("traders.columns.name"),
      value: `${account.name} ${account.surname}`,
    },
    {
      label: t("traders.columns.balance"),
      value: `$${account.balance.toLocaleString()}`,
    },
    {
      label: t("traders.columns.credit"),
      value: account.credit.toLocaleString(),
    },
    {
      label: t("ui.label_profit"),
      value: `$${(account.equity - account.balance).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`,
    },
    {
      label: t("dashboard.cards.equity"),
      value: `$${account.equity.toLocaleString()}`,
    },
    {
      label: t("traders.columns.margin"),
      value: `$${account.margin.toLocaleString()}`,
    },
    {
      label: t("traders.columns.freeMargin"),
      value: `$${account.freeMargin.toLocaleString()}`,
    },
  ];

  return (
    <ModalBase
      open={open}
      onClose={() => {
        setSelectedPosition(null);
        setSelectedOrder(null);
        setIsEditPositionOpen(false);
        setIsEditOrderOpen(false);
        setActiveTab("Open Positions");
        onClose();
      }}
      title={t("ui.trader_detail_title")}
      className="max-w-[1180px] h-[calc(90vh-40px)]"
    >
      <div className="flex h-full flex-col gap-4 text-xs text-slate-700 md:text-sm">
        <div className="flex w-full flex-wrap gap-2 rounded border border-slate-200 bg-slate-50 px-3 py-2">
          {summary.map((item) => (
            <div
              key={item.label}
              className="flex-1 min-w-[120px] rounded border border-slate-200 bg-white px-2 py-1"
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="px-3">
          <div className="flex w-full flex-wrap gap-2 text-[12px] font-semibold uppercase tracking-[0.25em]">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  className={`flex-1 min-w-[120px] px-4 py-2 border ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "border-slate-300 text-slate-600 hover:text-slate-900"
                  }`}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedPosition(null);
                    setSelectedOrder(null);
                  }}
                >
                  {t(tabLabelKeyMap[tab])}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-900">
            {totals.map((item) => (
              <div key={item.labelKey} className="min-w-[150px]">
                <p className="text-slate-900">{t(item.labelKey)}</p>
                <p className="text-base text-red-600">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            className="border border-slate-300 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-600 hover:bg-slate-100"
          >
            {t("ui.button_refresh_data_titlecase")}
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${
              canEdit
                ? "bg-blue-600 text-white hover:bg-blue-500"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            }`}
            disabled={!canEdit}
            onClick={() => {
              if (isOpenTab && selectedPosition) {
                setIsEditPositionOpen(true);
              } else if (isOrderTab && selectedOrder) {
                setIsEditOrderOpen(true);
              }
            }}
          >
            {editLabel}
          </button>
          <button
            type="button"
            className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${
              canClose
                ? "border border-red-500 text-red-600 hover:bg-red-50"
                : "border border-slate-300 text-slate-400 cursor-not-allowed"
            }`}
            disabled={!canClose}
          >
            {t("ui.button_close_position_label")}
          </button>
        </div>

        <div className="flex-1 overflow-hidden rounded border border-slate-200">
          <div className="h-full overflow-auto">
            {isOpenTab ? (
              <table className="w-full min-w-[960px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {openPositionHeaderKeys.map((key) => (
                      <th key={key} className="py-3 px-3">
                        {t(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {positions.map((row) => {
                    const isSelected = selectedPosition?.id === row.id;
                    const directionColor =
                      row.direction === "Buy"
                        ? "text-emerald-600"
                        : "text-red-500";
                    const profitColor =
                      Number(row.profit) >= 0
                        ? "text-emerald-600"
                        : "text-red-500";
                    const netProfitColor =
                      Number(row.netProfit) >= 0
                        ? "text-emerald-600"
                        : "text-red-500";
                    return (
                      <tr
                        key={row.id}
                        className={`border-t border-slate-200 cursor-pointer transition ${
                          isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          setSelectedOrder(null);
                          setSelectedPosition((current) =>
                            current?.id === row.id ? null : row
                          );
                        }}
                      >
                        <td className="py-3 px-3">{row.symbol}</td>
                        <td className="py-3 px-3">{row.createdAt}</td>
                        <td className="py-3 px-3">{row.volume}</td>
                        <td
                          className={`py-3 px-3 font-semibold ${directionColor}`}
                        >
                          {t(
                            row.direction === "Buy"
                              ? "ui.option_buy_label"
                              : "ui.option_sell_label"
                          )}
                        </td>
                        <td className="py-3 px-3">{row.enterPrice}</td>
                        <td className="py-3 px-3">{row.price}</td>
                        <td className="py-3 px-3">{row.stopLoss}</td>
                        <td className="py-3 px-3">{row.takeProfit}</td>
                        <td className="py-3 px-3">
                          {row.swap >= 0
                            ? `$${row.swap}`
                            : `-$${Math.abs(row.swap)}`}
                        </td>
                        <td className="py-3 px-3">
                          {row.commission >= 0
                            ? `$${row.commission}`
                            : `-$${Math.abs(row.commission)}`}
                        </td>
                        <td className={`py-3 px-3 ${profitColor}`}>
                          ${row.profit.toLocaleString()}
                        </td>
                        <td className={`py-3 px-3 ${netProfitColor}`}>
                          ${row.netProfit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isOrderTab ? (
              <table className="w-full min-w-[900px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {orderPositionHeaderKeys.map((key) => (
                      <th key={key} className="py-3 px-3">
                        {t(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {orderPositions.map((row) => {
                    const directionColor =
                      row.direction === "Buy"
                        ? "text-emerald-600"
                        : "text-red-500";
                    const isSelected = selectedOrder?.id === row.id;
                    return (
                      <tr
                        key={row.id}
                        className={`border-t border-slate-200 cursor-pointer transition ${
                          isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                        }`}
                        onClick={() => {
                          setSelectedPosition(null);
                          setSelectedOrder((current) =>
                            current?.id === row.id ? null : row
                          );
                        }}
                      >
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {row.orderNo}
                        </td>
                        <td className="py-3 px-3">{row.symbol}</td>
                        <td className="py-3 px-3">{row.createdAt}</td>
                        <td className="py-3 px-3">{row.volume}</td>
                        <td
                          className={`py-3 px-3 font-semibold ${directionColor}`}
                        >
                          {t(
                            row.direction === "Buy"
                              ? "ui.option_buy_label"
                              : "ui.option_sell_label"
                          )}
                        </td>
                        <td className="py-3 px-3">{row.orderPrice}</td>
                        <td className="py-3 px-3">{row.currentPrice}</td>
                        <td className="py-3 px-3">{row.stopLoss}</td>
                        <td className="py-3 px-3">{row.takeProfit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isClosedTab ? (
              <table className="w-full min-w-[1050px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {closedPositionHeaderKeys.map((key) => (
                      <th key={key} className="py-3 px-3">
                        {t(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {closedPositions.map((row) => {
                    const directionColor =
                      row.direction === "Buy"
                        ? "text-emerald-600"
                        : "text-red-500";
                    const profitColor =
                      Number(row.profit) >= 0
                        ? "text-emerald-600"
                        : "text-red-500";
                    const netProfitColor =
                      Number(row.netProfit) >= 0
                        ? "text-emerald-600"
                        : "text-red-500";
                    return (
                      <tr key={row.id} className="border-t border-slate-200">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {row.orderNo}
                        </td>
                        <td className="py-3 px-3">{row.symbol}</td>
                        <td className="py-3 px-3">{row.createdAt}</td>
                        <td className="py-3 px-3">{row.closeTime}</td>
                        <td className="py-3 px-3">{row.volume}</td>
                        <td
                          className={`py-3 px-3 font-semibold ${directionColor}`}
                        >
                          {t(
                            row.direction === "Buy"
                              ? "ui.option_buy_label"
                              : "ui.option_sell_label"
                          )}
                        </td>
                        <td className="py-3 px-3">{row.enterPrice}</td>
                        <td className="py-3 px-3">{row.closePrice}</td>
                        <td className="py-3 px-3">{row.stopLoss}</td>
                        <td className="py-3 px-3">{row.takeProfit}</td>
                        <td className="py-3 px-3">
                          {row.swap >= 0
                            ? `$${row.swap}`
                            : `-$${Math.abs(row.swap)}`}
                        </td>
                        <td className="py-3 px-3">
                          {row.commission >= 0
                            ? `$${row.commission}`
                            : `-$${Math.abs(row.commission)}`}
                        </td>
                        <td className={`py-3 px-3 ${profitColor}`}>
                          ${row.profit.toLocaleString()}
                        </td>
                        <td className={`py-3 px-3 ${netProfitColor}`}>
                          ${row.netProfit.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isTransactionsTab ? (
              <table className="w-full min-w-[820px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    {transactionHeaderKeys.map((key) => (
                      <th key={key} className="py-3 px-3">
                        {t(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {transactions.map((entry) => {
                    const typeLabel =
                      entry.type === "bank"
                        ? t("filters.bank")
                        : t("filters.crypto");
                    const directionLabel =
                      entry.direction === "withdrawal"
                        ? t("ui.table_withdrawal_label")
                        : t("ui.table_deposit_label");
                    const directionColor =
                      entry.direction === "withdrawal"
                        ? "text-red-500"
                        : "text-blue-600";
                    const statusColor =
                      entry.status === "approved"
                        ? "text-emerald-600"
                        : "text-red-500";
                    const amountPrefix =
                      entry.direction === "withdrawal" ? "-$" : "+$";
                    const amountColor =
                      entry.direction === "withdrawal"
                        ? "text-red-500"
                        : "text-emerald-600";
                    const formattedAmount = `${amountPrefix}${entry.amount.toLocaleString()}`;
                    return (
                      <tr key={entry.id} className="border-t border-slate-200">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {entry.id}
                        </td>
                        <td className="py-3 px-3">{typeLabel}</td>
                        <td
                          className={`py-3 px-3 font-semibold ${directionColor}`}
                        >
                          {directionLabel}
                        </td>
                        <td className="py-3 px-3">{entry.time}</td>
                        <td
                          className={`py-3 px-3 font-semibold ${amountColor}`}
                        >
                          {formattedAmount}
                        </td>
                        <td
                          className={`py-3 px-3 font-semibold ${statusColor}`}
                        >
                          {entry.status === "approved"
                            ? t("ui.status_approved_titlecase")
                            : t("ui.status_rejected_titlecase")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isDepositSettingsTab ? (
              <div className="space-y-4">
                <div className="grid gap-3 lg:grid-cols-2 text-[11px] leading-tight">
                  <section className="border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                          {t("ui.bank_info_title")}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {t("ui.bank_info_subtitle")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                            bankActive
                              ? "bg-emerald-600 text-white hover:bg-emerald-500"
                              : "border border-slate-300 text-slate-500 hover:text-slate-700"
                          }`}
                          onClick={() => setBankActive((prev) => !prev)}
                        >
                          {bankActive
                            ? t("status.ACTIVE")
                            : t("ui.status_inactive_label")}
                        </button>
                        <button
                          type="button"
                          className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                          onClick={() => setIsBankPopupOpen(true)}
                        >
                          {t("actions.edit")}
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {bankDetailFields.map((field) => {
                        const value = bankDetails[field.key];
                        const isCurrencyField =
                          field.key === "depositFee" ||
                          field.key === "commissionFee";
                        return (
                          <div
                            key={field.key}
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
                        <p className="text-[10px] text-slate-500">
                          {t("ui.crypto_info_subtitle")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                            cryptoActive
                              ? "bg-emerald-600 text-white hover:bg-emerald-500"
                              : "border border-slate-300 text-slate-500 hover:text-slate-700"
                          }`}
                          onClick={() => setCryptoActive((prev) => !prev)}
                        >
                          {cryptoActive
                            ? t("status.ACTIVE")
                            : t("ui.status_inactive_label")}
                        </button>
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
                    </div>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left text-[11px] uppercase tracking-[0.25em] text-slate-500">
                        <thead className="border-b border-slate-200 text-slate-600">
                          <tr>
                            <th className="py-2 px-2">
                              {t("funding.cryptoLabel")}
                            </th>
                            <th className="py-2 px-2">
                              {t("funding.network")}
                            </th>
                            <th className="py-2 px-2">
                              {t("ui.crypto_wallet_address_label")}
                            </th>
                            <th className="py-2 px-2 text-right">
                              {t("ui.table_actions_header")}
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-700">
                          {cryptoAccounts.map((entry) => {
                            return (
                              <tr
                                key={entry.id}
                                className="border-b border-slate-100"
                              >
                                <td className="py-2 px-2">{entry.crypto}</td>
                                <td className="py-2 px-2">{entry.network}</td>
                                <td className="py-2 px-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-900">
                                      {entry.address}
                                    </span>
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
                                      onClick={() =>
                                        handleRemoveCrypto(entry.id!)
                                      }
                                    >
                                      {t("ui.common_delete_button")}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
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
                <div className="rounded border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {t("ui.withdraw_settings_section_title")}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t("ui.withdraw_settings_subtitle")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                          withdrawActive
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "border border-slate-300 text-slate-500 hover:text-slate-700"
                        }`}
                        onClick={() => setWithdrawActive((prev) => !prev)}
                      >
                        {withdrawActive
                          ? t("status.ACTIVE")
                          : t("ui.status_inactive_label")}
                      </button>
                      <button
                        type="button"
                        className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                        onClick={() => setIsWithdrawPopupOpen(true)}
                      >
                        {t("actions.edit")}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("ui.withdraw_fee_label")}
                      </p>
                      <p className="text-xl font-semibold text-slate-900">
                        ${withdrawSettings.fee}
                      </p>
                    </div>
                    <div className="rounded border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("ui.income_tax_label")}
                      </p>
                      <p className="text-xl font-semibold text-slate-900">
                        {withdrawSettings.tax}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : isAccountSettingsTab ? (
              <div className="space-y-4 text-[11px] leading-tight">
                <section className="border border-slate-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {t("ui.leverage_setting_label")}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {t("ui.current_leverage_text")}&nbsp;
                        <span className="font-semibold text-slate-900">
                          1:{leverageRatio}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-300 px-2 py-1 text-sm text-slate-600">
                        <span className="mr-1 font-semibold">1:</span>
                        <input
                          type="number"
                          min="1"
                          className="w-20 border-none bg-transparent p-0 text-sm text-slate-900 focus:outline-none"
                          value={leverageDraft}
                          onChange={(event) =>
                            setLeverageDraft(
                              event.target.value.replace(/[^0-9]/g, "")
                            )
                          }
                        />
                      </div>
                      <button
                        type="button"
                        className="bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
                        onClick={handleLeverageSave}
                      >
                        {t("ui.common_save_label")}
                      </button>
                    </div>
                  </div>
                </section>

                <section className="border border-slate-200 bg-white p-3 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("ui.credit_tools_heading")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {t("ui.current_credit_text")} $
                        {currentCredit.toLocaleString()}
                      </p>
                      <label className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("funding.amount")}
                        <input
                          className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
                          value={creditInput}
                          onChange={(event) =>
                            setCreditInput(event.target.value)
                          }
                          placeholder="100"
                        />
                      </label>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          className="flex-1 border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                          onClick={() => requestAdjustment("credit", "add")}
                        >
                          {t("ui.button_add_label")}
                        </button>
                        <button
                          type="button"
                          className="flex-1 border border-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-600 hover:bg-red-50"
                          onClick={() => requestAdjustment("credit", "remove")}
                        >
                          {t("ui.button_remove_label")}
                        </button>
                      </div>
                    </div>
                    <div className="rounded border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("ui.balance_tools_heading")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {t("ui.current_balance_text")} $
                        {currentBalance.toLocaleString()}
                      </p>
                      <label className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("funding.amount")}
                        <input
                          className="mt-1 w-full border border-slate-300 px-2 py-1 text-sm"
                          value={balanceInput}
                          onChange={(event) =>
                            setBalanceInput(event.target.value)
                          }
                          placeholder="100"
                        />
                      </label>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          className="flex-1 border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                          onClick={() => requestAdjustment("balance", "add")}
                        >
                          {t("ui.button_add_label")}
                        </button>
                        <button
                          type="button"
                          className="flex-1 border border-red-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-red-600 hover:bg-red-50"
                          onClick={() => requestAdjustment("balance", "remove")}
                        >
                          {t("ui.button_remove_label")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {adjustmentLogs.length ? (
                    <div className="rounded border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-500">
                        {t("ui.adjustment_logs_heading")}
                      </p>
                      <div className="mt-3 max-h-[220px] overflow-y-auto border border-slate-100 bg-white">
                        <table className="w-full text-left text-[10px] uppercase tracking-[0.3em] text-slate-500">
                          <thead className="bg-slate-50 text-slate-600">
                            <tr>
                              <th className="py-2 px-2">
                                {t("reports.columns.timestamp")}
                              </th>
                              <th className="py-2 px-2">{t("funding.type")}</th>
                              <th className="py-2 px-2">
                                {t("funding.actionColumn")}
                              </th>
                              <th className="py-2 px-2">
                                {t("funding.amount")}
                              </th>
                              <th className="py-2 px-2">
                                {t("ui.credit_after_header")}
                              </th>
                              <th className="py-2 px-2">
                                {t("ui.balance_after_header")}
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-slate-700">
                            {adjustmentLogs.map((log) => (
                              <tr
                                key={log.id}
                                className="border-t border-slate-100 text-[11px] normal-case"
                              >
                                <td className="py-2 px-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                  {log.createdAt}
                                </td>
                                <td className="py-2 px-2">
                                  {log.target === "credit"
                                    ? t("traders.columns.credit")
                                    : t("labels.balance")}
                                </td>
                                <td
                                  className={`py-2 px-2 font-semibold ${
                                    log.mode === "add"
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {log.mode === "add"
                                    ? t("ui.log_action_added_label")
                                    : t("ui.log_action_removed_label")}
                                </td>
                                <td
                                  className={`py-2 px-2 font-semibold ${
                                    log.mode === "add"
                                      ? "text-emerald-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {`${
                                    log.mode === "add" ? "+" : "-"
                                  }$${log.amount.toLocaleString()}`}
                                </td>
                                <td className="py-2 px-2">
                                  ${log.creditAfter.toLocaleString()}
                                </td>
                                <td className="py-2 px-2">
                                  ${log.balanceAfter.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </section>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                {t("ui.coming_soon_text")}
              </div>
            )}
          </div>
        </div>

        <EditPositionPopup
          open={isEditPositionOpen}
          onClose={() => setIsEditPositionOpen(false)}
          position={selectedPosition}
          onSave={(updated) => {
            if (!updated) return;
            setPositions((prev) =>
              prev.map((pos) =>
                pos.id === updated.id ? { ...pos, ...updated } : pos
              )
            );
            setSelectedPosition(updated);
            setIsEditPositionOpen(false);
          }}
        />
        <EditOrderPopup
          open={isEditOrderOpen}
          onClose={() => setIsEditOrderOpen(false)}
          order={selectedOrder}
          onSave={(updated) => {
            setOrderPositions((prev) =>
              prev.map((entry) => (entry.id === updated.id ? updated : entry))
            );
            setSelectedOrder(updated);
            setIsEditOrderOpen(false);
          }}
        />
        <BankSettingsPopup
          open={isBankPopupOpen}
          active={bankActive}
          details={bankDetails}
          onClose={() => setIsBankPopupOpen(false)}
          onSubmit={handleBankSettingsSubmit}
        />
        <CryptoSettingsPopup
          open={Boolean(editingCrypto)}
          initial={editingCrypto ?? undefined}
          onClose={() => setEditingCrypto(null)}
          onSubmit={handleCryptoSubmit}
        />
        <CryptoFeeSettingsPopup
          open={isCryptoFeePopupOpen}
          values={cryptoFeeGeneral}
          onClose={() => setIsCryptoFeePopupOpen(false)}
          onSubmit={handleCryptoFeeSubmit}
        />
        <PaymentWithdrawSettingsPopup
          open={isWithdrawPopupOpen}
          onClose={() => setIsWithdrawPopupOpen(false)}
          values={withdrawSettings}
          onSubmit={handleWithdrawSubmit}
        />
        <ModalBase
          open={Boolean(pendingAdjustment)}
          onClose={cancelAdjustment}
          title="Confirm Adjustment"
          className="max-w-md"
        >
          {pendingAdjustment ? (
            <div className="space-y-3 text-sm text-slate-700">
              {(() => {
                const delta =
                  pendingAdjustment.mode === "add"
                    ? pendingAdjustment.amount
                    : -pendingAdjustment.amount;
                const projectedCredit =
                  pendingAdjustment.target === "credit"
                    ? Math.max(0, currentCredit + delta)
                    : currentCredit;
                const projectedBalance =
                  pendingAdjustment.target === "balance"
                    ? Math.max(0, currentBalance + delta)
                    : currentBalance;
                return (
                  <>
                    <p>
                      {t("ui.adjustment_confirm_sentence", {
                        action:
                          pendingAdjustment.mode === "add"
                            ? t("ui.adjustment_action_add")
                            : t("ui.adjustment_action_remove"),
                        amount: `$${pendingAdjustment.amount.toLocaleString()}`,
                        target:
                          pendingAdjustment.target === "credit"
                            ? t("ui.adjustment_target_credit_label")
                            : t("ui.adjustment_target_balance_label"),
                      })}
                    </p>
                    <div className="rounded border border-slate-200 bg-slate-50 p-3 text-[12px] uppercase tracking-[0.25em] text-slate-500">
                      <p>
                        {t("ui.user_id_prefix_label")} {account.userId}
                      </p>
                      <p>
                        {t("ui.name_prefix_label")} {account.name}{" "}
                        {account.surname}
                      </p>
                      <p>
                        {t("ui.new_credit_prefix_label")} $
                        {projectedCredit.toLocaleString()} ·{" "}
                        {t("ui.new_balance_prefix_label")} $
                        {projectedBalance.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="border border-slate-300 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                        onClick={cancelAdjustment}
                      >
                        {t("actions.cancel")}
                      </button>
                      <button
                        type="button"
                        className="bg-slate-900 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
                        onClick={confirmAdjustment}
                      >
                        {t("actions.confirm")}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </ModalBase>
      </div>
    </ModalBase>
  );
};

export default TraderDetailPopup;

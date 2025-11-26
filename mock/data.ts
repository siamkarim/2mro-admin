export type TradeStatus = "OPEN" | "CLOSED" | "PENDING";

export interface Trade {
  id: string;
  symbol: string;
  direction: "BUY" | "SELL";
  volume: number;
  profitLoss: number;
  status: TradeStatus;
  openedAt: string;
}

export interface AppUser {
  userId: string;
  name: string;
  surname: string;
  nationalId: string;
  phone: string;
  dateOfBirth: string;
  status: "verified" | "not_verified";
  accountType: "live" | "demo";
  hasUploadedId?: boolean;
}

export type UserVerification = {
  id: number;
  user_id: number;
  show_id: string;
  name: string;
  first_name: string;
  username: string;
  nid: string;
  email: string;
  phone: string;
  date_of_birth: string; // ISO 8601 format
  id_number: string;
  account_id: number;
  account_number: string;
  account_name: string;
  account_type: string;
  user_account_type: string;
  user_is_verified: true;
  currency: string;
  password: string;
  documents_count: number;
  documents: object; // Could be more specific if document structure is known
  created_at: string; // ISO 8601 format
};
export interface ActiveUser {
  user_id: number;
  user_name: string;
  first_name: string;
  margin_level: number;
  last_activity: string;
}

export interface MarginCall {
  user_id: number;
  user_name: string;
  margin_level: number;
  margin: number;
}

export interface PendingDataType {
  id: number;
  user_id: number;
  user_name: string;
  email: string;
  account_id: number;
  transaction_id: string;
  transaction_type: string; // assuming other possible values
  transaction_method: string; // assuming other possible values
  amount: number;
  currency: string;
  status: string; // assuming other possible values
  bank_name: string | null;
  account_number: string | null;
  account_holder_name: string | null;
  swift: string | null;
  crypto_address: string | null;
  crypto: string | null;
  crypto_type: string | null;
  wallet_address: string | null;
  wallet_network: string | null;
  crypto_tx_hash: string | null;
  card_last_four: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  proof_of_payment: string | null;
  admin_evidence: string | null;
  approved_by: number | null;
  approved_at: string | null;
  user: {
    email: string;
    first_name: string;

    account_type: string;
  };
  account: object; // Replace with actual Account interface if known
  applicable_fee: number;
  applicable_commission: number;
  applicable_tax: number | null;
  created_at: string;
  updated_at: string | null;
  completed_at: string | null;
}

export interface OpenPosition {
  user_id: number;
  pid_id: number;
  symbol: string;
  created_time: string;
  volume: number;
  direction: string; // <-- allow any string
  enter_price: number;
  price: number;
  stop_loss: number;
  take_profit: number;
  swap: number;
  commission: number;
  profit: number;
  net_profit: number;
}

export interface OrderPosition {
  user_id: number;
  pid_no: number;
  symbol: string;
  created_time: string; // ISO string
  volume: number;
  direction: string;
  order_price: number;
  price: number;
  stop_loss: number;
  take_profit: number;
}
export interface ClosedPosition {
  user_id: number;
  closed_pid_no: number;
  symbol: string;
  created_time: string; // ISO string
  close_time: string; // ISO string
  volume: number;
  direction: string;
  enter_price: number;
  close_price: number;
  stop_loss: number;
  take_profit: number;
  swap: number;
  commission: number;
  profit: number;
  net_profit: number;
}

export interface UserSummary {
  user_id: number;
  name: string;
  balance: number;
  credit: number;
  profit: number;
  equity: number;
  margin: number;
  free_margin: number;
  all_swaps: number;
  all_commission: number;
  all_profit: number;
  all_total_profit: number;
}

export interface TransectionUser {
  transaction_id: string;
  type: string;
  method: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface BANK {
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  bank_iban: string;
  bank_swift_code: string;
  bank_deposit_fee: number;
  bank_withdrawal_fee: number;
  bank_commission_per_transaction: number;
}

export interface CRYPTO {
  id?: number;
  symbol: string;
  address: string;
  network: string;
}

export interface CRYPTOINPUT {
  id?: number;
  symbol: string;
  address: string;
  network: string;
}

export interface CryptoFeeResponse {
  crypto_deposit_fee: number;
  crypto_withdrawal_fee: number;
  crypto_commission_per_transaction: number;
}

export interface AdjustmentLog {
  id: string;
  userId: string;
  target: "credit" | "balance";
  mode: "add" | "remove";
  amount: number;
  createdAt: string;
  creditAfter: number;
  balanceAfter: number;
}

export interface SettingItem {
  id: string;
  name: string;
  value: string;
  description: string;
  category: "investment" | "withdraw" | "system";
}

export interface ActivityLog {
  id: string;
  action: string;
  actor: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
  trend: string;
  positive: boolean;
}

export interface DashboardSummary {
  equity: string;
  dailyProfit: string;
  openTrades: number;
  retentionRate: string;
}

export interface TraderAccount {
  userId: string;
  status: "live" | "demo";
  name: string;
  surname: string;
  accountType: "live" | "demo";
  currency: string;
  phone: string;
  credit: number;
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  online: boolean;
  marginCall: boolean;
}

export interface TraderAccountType {
  user_id: number;
  show_id: string;
  account_id: number;
  status: boolean;
  name: string;
  first_name: string;
  account_type: string;
  email: string;
  phone: string;
  balance: number;
  equity: number;
  margin: number;
  free_margin: number;
  margin_level: number;
  credit: number;
}

export type FundingType = "bank" | "crypto";

export interface PendingFunding {
  id: string;
  userId: string;
  name: string;
  surname: string;
  type: FundingType;
  accountName: string;
  amount: number;
}

export interface PendingWithdrawal extends PendingFunding {
  destination: FundingType;
  bankName?: string;
  iban?: string;
  cryptoName?: string;
  network?: string;
  address?: string;
}

export interface TraderStats {
  totalUsers: number;
  onlineUsers: number;
  marginCalls: number;
  netProfit: number;
  pendingDeposit: number;
  pendingWithdrawal: number;
  totalDeposit: number;
  totalWithdrawal: number;
}

export const mockTrades: Trade[] = [
  {
    id: "TRD-1048",
    symbol: "EUR/USD",
    direction: "BUY",
    volume: 2.4,
    profitLoss: 540,
    status: "OPEN",
    openedAt: "2025-11-21T09:20:00Z",
  },
  {
    id: "TRD-1049",
    symbol: "GBP/USD",
    direction: "SELL",
    volume: 1.1,
    profitLoss: -120,
    status: "OPEN",
    openedAt: "2025-11-21T13:02:00Z",
  },
  {
    id: "TRD-1050",
    symbol: "USD/JPY",
    direction: "BUY",
    volume: 3.2,
    profitLoss: 880,
    status: "CLOSED",
    openedAt: "2025-11-20T15:40:00Z",
  },
  {
    id: "TRD-1051",
    symbol: "XAU/USD",
    direction: "SELL",
    volume: 0.8,
    profitLoss: 210,
    status: "OPEN",
    openedAt: "2025-11-21T06:10:00Z",
  },
];

export const mockUsers: AppUser[] = [
  {
    userId: "ED17412002",
    name: "John",
    surname: "Miller",
    nationalId: "12345678901",
    phone: "+1234567890",
    dateOfBirth: "1990-04-12",
    status: "verified",
    accountType: "live",
    hasUploadedId: true,
  },
  {
    userId: "ED52445007",
    name: "Ali",
    surname: "Kaya",
    nationalId: "34567890123",
    phone: "+905333885666",
    dateOfBirth: "1988-09-22",
    status: "verified",
    accountType: "live",
    hasUploadedId: true,
  },
  {
    userId: "ED87330014",
    name: "Maya",
    surname: "Sanchez",
    nationalId: "67890123456",
    phone: "+13475551212",
    dateOfBirth: "1992-03-09",
    status: "not_verified",
    accountType: "demo",
    hasUploadedId: false,
  },
  {
    userId: "ED99112077",
    name: "Leo",
    surname: "Martins",
    nationalId: "89012345678",
    phone: "+351987665544",
    dateOfBirth: "1985-12-30",
    status: "verified",
    accountType: "demo",
    hasUploadedId: true,
  },
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "volume",
    label: "Total Volume",
    value: "$148M",
    trend: "+4.6% vs last week",
    positive: true,
  },
  {
    id: "profit",
    label: "Daily Profit",
    value: "$18.4K",
    trend: "+1.2% vs yesterday",
    positive: true,
  },
  {
    id: "retention",
    label: "Retention Health",
    value: "92%",
    trend: "-0.4% vs target",
    positive: false,
  },
  {
    id: "risk",
    label: "Risk Exposure",
    value: "38%",
    trend: "-2.1% vs policy",
    positive: true,
  },
];

export const dashboardSummary: DashboardSummary = {
  equity: "$412,500",
  dailyProfit: "$18,400",
  openTrades: 68,
  retentionRate: "92%",
};

export const investmentSettings: SettingItem[] = [
  {
    id: "INV-001",
    name: "Default Leverage",
    value: "1:200",
    description: "Maximum leverage offered for retail clients.",
    category: "investment",
  },
  {
    id: "INV-002",
    name: "Auto-Hedging",
    value: "Enabled",
    description: "Automatically hedge exposure above $1M.",
    category: "investment",
  },
  {
    id: "INV-003",
    name: "Risk Guard",
    value: "Moderate",
    description: "Defines global trade size restrictions.",
    category: "investment",
  },
];

export const withdrawSettings: SettingItem[] = [
  {
    id: "WD-001",
    name: "Daily Limit",
    value: "$250,000",
    description: "Total withdrawal cap per business day.",
    category: "withdraw",
  },
  {
    id: "WD-002",
    name: "Manual Review Threshold",
    value: "$25,000",
    description: "Requests above threshold need finance approval.",
    category: "withdraw",
  },
  {
    id: "WD-003",
    name: "Processing Window",
    value: "09:00 - 18:00 GMT",
    description: "Operational hours for payouts.",
    category: "withdraw",
  },
];

export const systemSettings: SettingItem[] = [
  {
    id: "SYS-001",
    name: "Two-Factor Auth",
    value: "Mandatory",
    description: "All staff must login with MFA.",
    category: "system",
  },
  {
    id: "SYS-002",
    name: "Backup Schedule",
    value: "Hourly",
    description: "Data snapshots pushed to cold storage.",
    category: "system",
  },
  {
    id: "SYS-003",
    name: "Compliance Mode",
    value: "ESMA",
    description: "Active regulation package.",
    category: "system",
  },
];

export const activityLogs: ActivityLog[] = [
  {
    id: "LOG-1001",
    action: "Ken Adams approved 4 withdrawals",
    actor: "Ken Adams",
    severity: "info",
    timestamp: "2025-11-22T08:40:00Z",
  },
  {
    id: "LOG-1002",
    action: "Risk Guard tightened leverage for high-risk groups",
    actor: "System",
    severity: "warning",
    timestamp: "2025-11-22T08:15:00Z",
  },
  {
    id: "LOG-1003",
    action: "User Leo Martins flagged for manual review",
    actor: "Ayşe Karaman",
    severity: "critical",
    timestamp: "2025-11-21T18:05:00Z",
  },
  {
    id: "LOG-1004",
    action: "New retention campaign launched",
    actor: "Maya Sanchez",
    severity: "info",
    timestamp: "2025-11-21T11:22:00Z",
  },
];

export const traderAccounts: TraderAccount[] = [
  {
    userId: "ED17412002",
    status: "live",
    name: "John",
    surname: "Miller",
    accountType: "live",
    currency: "USD",
    phone: "+1234567890",
    credit: 250,
    balance: 10533.5,
    equity: 10533.3,
    margin: 2.73,
    freeMargin: 10530.6,
    online: true,
    marginCall: false,
  },
  {
    userId: "ED52445007",
    status: "live",
    name: "Ali",
    surname: "Kaya",
    accountType: "live",
    currency: "TRY",
    phone: "+905333885666",
    credit: 0,
    balance: 0,
    equity: 0,
    margin: 0,
    freeMargin: 0,
    online: false,
    marginCall: true,
  },
  {
    userId: "ED85211006",
    status: "demo",
    name: "Yasin",
    surname: "Demir",
    accountType: "demo",
    currency: "USD",
    phone: "+8801797365053",
    credit: 610,
    balance: 506.441,
    equity: 504.14,
    margin: 46.08,
    freeMargin: 458.06,
    online: true,
    marginCall: false,
  },
];

export const traderStats: TraderStats = {
  totalUsers: 9,
  onlineUsers: 2,
  marginCalls: 1,
  netProfit: 760,
  pendingDeposit: 0,
  pendingWithdrawal: 0,
  totalDeposit: 860,
  totalWithdrawal: 100,
};

export const mockAdjustmentLogs: AdjustmentLog[] = [
  {
    id: "ADJ-1001",
    userId: "ED17412002",
    target: "credit",
    mode: "add",
    amount: 250,
    createdAt: "2025-02-11 09:32",
    creditAfter: 250,
    balanceAfter: 10533.5,
  },
  {
    id: "ADJ-1002",
    userId: "ED17412002",
    target: "balance",
    mode: "remove",
    amount: 500,
    createdAt: "2025-02-10 14:05",
    creditAfter: 250,
    balanceAfter: 10033.5,
  },
];

export const pendingDeposits: PendingFunding[] = [
  {
    id: "PD-101",
    userId: "ED17412002",
    name: "John",
    surname: "Miller",
    type: "bank",
    accountName: "HSBC London",
    amount: 12500,
  },
  {
    id: "PD-102",
    userId: "ED52445007",
    name: "Ali",
    surname: "Kaya",
    type: "crypto",
    accountName: "BTC Wallet 0x9df1",
    amount: 4200,
  },
  {
    id: "PD-103",
    userId: "ED85211006",
    name: "Yasin",
    surname: "Demir",
    type: "bank",
    accountName: "Ziraat FX",
    amount: 7600,
  },
];

export const pendingWithdrawals: PendingWithdrawal[] = [
  {
    id: "PW-201",
    userId: "ED17412002",
    name: "John",
    surname: "Miller",
    type: "bank",
    accountName: "Barclays UK",
    bankName: "Barclays UK",
    iban: "GB55 BARC 2004 0161 2345 67",
    amount: 7800,
    destination: "bank",
  },
  {
    id: "PW-202",
    userId: "ED52445007",
    name: "Ali",
    surname: "Kaya",
    type: "crypto",
    accountName: "USDT Wallet 0x92ab",
    cryptoName: "USDT Wallet",
    network: "TRC-20",
    address: "0x92ab3f98c772ffc8",
    amount: 2300,
    destination: "crypto",
  },
];

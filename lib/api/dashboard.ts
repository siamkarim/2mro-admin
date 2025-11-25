import axios, { type AxiosAdapter } from "axios";

import {
  dashboardMetrics,
  dashboardSummary,
  mockTrades,
  mockUsers,
  traderAccounts,
  traderStats,
  pendingDeposits,
  pendingWithdrawals,
  type AppUser,
  type DashboardMetric,
  type DashboardSummary,
  type Trade,
  type TraderAccount,
  type TraderStats,
  type PendingFunding,
  type PendingWithdrawal,
} from "@/mock/data";
import api from "../apiClient";
import { apiLink } from "../apiLink";

const normalizeUrl = (url?: string) => {
  if (!url) return "";
  const trimmed = url.replace("mock://forex", "");
  const ensured = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return ensured.endsWith("/") && ensured !== "/"
    ? ensured.slice(0, -1)
    : ensured;
};

const mockRoutes: Record<string, unknown> = {
  "/trades": mockTrades,
  "/users": mockUsers,
  "/trader-accounts": traderAccounts,
  "/trader-stats": traderStats,
  "/pending-deposits": pendingDeposits,
  "/pending-withdrawals": pendingWithdrawals,
  "/dashboard": {
    metrics: dashboardMetrics,
    summary: dashboardSummary,
  },
};

const mockAdapter: AxiosAdapter = async (config) => {
  const key = normalizeUrl(config.url);
  const payload = mockRoutes[key];

  if (!payload) {
    return {
      data: { message: "Not Found" },
      status: 404,
      statusText: "Not Found",
      headers: {},
      config,
    };
  }

  return {
    data: payload,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
};

const apiClient = axios.create({
  baseURL: "mock://forex",
  adapter: mockAdapter,
  timeout: 300,
});

export const fetchTrades = async () => {
  const { data } = await apiClient.get<Trade[]>("/trades");
  return data;
};

export const fetchUsers = async () => {
  const { data } = await apiClient.get<AppUser[]>("/users");
  return data;
};

export const fetchDashboardOverview = async () => {
  const { data } = await apiClient.get<{
    metrics: DashboardMetric[];
    summary: DashboardSummary;
  }>("/dashboard");
  return data;
};

export const fetchTraderAccounts = async () => {
  const { data } = await apiClient.get<TraderAccount[]>("/trader-accounts");
  return data;
};

export const fetchTraderStats = async () => {
  const { data } = await apiClient.get<TraderStats>("/trader-stats");
  return data;
};

export const fetchPendingDeposits = async () => {
  const { data } = await apiClient.get<PendingFunding[]>("/pending-deposits");
  return data;
};

export const fetchPendingWithdrawals = async () => {
  const { data } = await apiClient.get<PendingWithdrawal[]>(
    "/pending-withdrawals"
  );
  return data;
};

// New function to fetch overview data

export const fetchOverviewData = async () => {
  const { data } = await api.get(apiLink.SUMMARY);
  return data;
};

// New Traders Info
export const fetchTradersInfo = async (
  skip: number,
  limit: number,
  selectedType: string
) => {
  const { data } = await api.get(
    `${apiLink.TRADER}?skip=${skip}&limit=${limit}&account_type=${selectedType}`
  );
  return data;
};

export const fetchMarginCall = async () => {
  const { data } = await api.get(
    `${apiLink.MARGIN_CALL}?skip=${0}&limit=${200}`
  );
  return data;
};

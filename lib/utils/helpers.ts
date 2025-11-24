export type UserRole = "SUPER_ADMIN" | "MANAGER" | "RETENTION" | "USER";

export type RouteKey = "dashboard" | "users" | "payments" | "administration";

export interface RouteConfig {
  key: RouteKey;
  href: string;
  labelKey: string;
  descriptionKey: string;
  allowedRoles: UserRole[];
}

export const ROUTE_DEFINITIONS: RouteConfig[] = [
  {
    key: "dashboard",
    href: "/dashboard",
    labelKey: "nav.dashboard",
    descriptionKey: "navDesc.dashboard",
    allowedRoles: ["SUPER_ADMIN", "MANAGER", "RETENTION"],
  },
  {
    key: "users",
    href: "/users",
    labelKey: "nav.users",
    descriptionKey: "navDesc.users",
    allowedRoles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    key: "payments",
    href: "/payment-management",
    labelKey: "nav.payments",
    descriptionKey: "navDesc.payments",
    allowedRoles: ["SUPER_ADMIN", "MANAGER"],
  },
  {
    key: "administration",
    href: "/administration",
    labelKey: "nav.administration",
    descriptionKey: "navDesc.administration",
    allowedRoles: ["SUPER_ADMIN"],
  },
];

export const ROUTE_MAP = ROUTE_DEFINITIONS.reduce<Record<RouteKey, RouteConfig>>(
  (acc, route) => {
    acc[route.key] = route;
    return acc;
  },
  {} as Record<RouteKey, RouteConfig>
);

export const ROLE_OPTIONS: UserRole[] = [
  "SUPER_ADMIN",
  "MANAGER",
  "RETENTION",
  "USER",
];

export const DEFAULT_ROLE: UserRole = "SUPER_ADMIN";

export const canAccess = (role: UserRole, routeKey: RouteKey) =>
  ROUTE_MAP[routeKey].allowedRoles.includes(role);

export interface MarginSnapshot {
  equity: number;
  margin: number;
}

export const calculateMarginLevel = (account: MarginSnapshot) => {
  if (!account.margin || account.margin <= 0) {
    return 0;
  }
  return (account.equity / account.margin) * 100;
};

export const formatMarginLevel = (account: MarginSnapshot) =>
  `${calculateMarginLevel(account).toFixed(1)}%`;

export const formatCurrency = (value: number, currency = "$") =>
  `${currency}${value.toLocaleString()}`;


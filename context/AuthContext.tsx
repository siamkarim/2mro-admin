'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import { DEFAULT_ROLE, type UserRole } from "@/lib/utils/helpers";

interface AuthContextValue {
  role: UserRole;
  loginAs: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>(DEFAULT_ROLE);

  const value = useMemo(
    () => ({
      role,
      loginAs: setRole,
    }),
    [role]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export const RoleGuard = ({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  if (!allowedRoles.includes(role)) {
    return (
      <div className="border border-red-200 bg-white px-6 py-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
          {t("messages.noAccessTitle")}
        </p>
        <p className="mt-2 text-base text-slate-700">{t("messages.noAccessBody")}</p>
      </div>
    );
  }

  return <>{children}</>;
};


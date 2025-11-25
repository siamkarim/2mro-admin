'use client';

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AdminUserPopup, {
  type AdminUser,
} from "@/components/popups/AdminUserPopup";
import AssignTraderPopup from "@/components/popups/AssignTraderPopup";
import { traderAccounts } from "@/mock/data";
import type { TraderAccount } from "@/mock/data";
import { RoleGuard } from "@/context/AuthContext";
import { ROUTE_MAP } from "@/lib/utils/helpers";

const initialAdmins: AdminUser[] = [
  {
    id: "ADM-1001",
    name: "Maya Sanchez",
    email: "maya.sanchez@forex.com",
    role: "SUPER_ADMIN",
    password: "",
    permissions: {
      addAdmin: true,
      updatePayments: true,
      viewAdministration: true,
      viewPayments: true,
      editTrader: true,
      editPositions: true,
      addTrader: true,
      editTraderDeposit: true,
      assignTraderAccess: true,
    },
  },
  {
    id: "ADM-1002",
    name: "Ken Adams",
    email: "ken.adams@forex.com",
    role: "MANAGER",
    password: "",
    permissions: {
      addAdmin: false,
      updatePayments: true,
      viewAdministration: true,
      viewPayments: true,
      editTrader: true,
      editPositions: true,
      addTrader: true,
      editTraderDeposit: true,
      assignTraderAccess: true,
    },
  },
  {
    id: "ADM-1003",
    name: "Ayşe Karaman",
    email: "ayse.karaman@forex.com",
    role: "RETENTION",
    password: "",
    permissions: {
      addAdmin: false,
      updatePayments: false,
      viewAdministration: true,
      viewPayments: true,
      editTrader: true,
      editPositions: false,
      addTrader: false,
      editTraderDeposit: false,
      assignTraderAccess: false,
    },
  },
];

const AdministrationPage = () => {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [assignAdmin, setAssignAdmin] = useState<AdminUser | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"admins" | "assigned">("admins");
  const [assignments, setAssignments] = useState<Record<string, string[]>>({});

  const traderLookup = useMemo<Record<string, TraderAccount>>(() => {
    return traderAccounts.reduce<Record<string, TraderAccount>>((acc, trader) => {
      acc[trader.userId] = trader;
      return acc;
    }, {});
  }, []);

  const handleSubmit = (payload: AdminUser) => {
    setAdmins((prev) => {
      const exists = prev.some((admin) => admin.id === payload.id);
      if (exists) {
        return prev.map((admin) => (admin.id === payload.id ? payload : admin));
      }
      return [...prev, payload];
    });
    setIsPopupOpen(false);
    setEditingAdmin(null);
  };

  return (
    <RoleGuard allowedRoles={ROUTE_MAP.administration.allowedRoles}>
      <section className="space-y-4 border border-slate-200 bg-white p-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-900">
              {t("administration.title", { defaultValue: "Administration Management" })}
            </p>
            <p className="text-xs text-slate-500">
              {t("administration.subtitle", {
                defaultValue: "Manage panel operators and role access.",
              })}
            </p>
          </div>
          <button
            type="button"
            className="bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
            onClick={() => {
              setEditingAdmin(null);
              setIsPopupOpen(true);
            }}
          >
            {t("ui.administration_add_admin_button", { defaultValue: "Add Admin User" })}
          </button>
        </header>
        <div className="flex gap-2 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {(["admins", "assigned"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`px-4 py-2 transition-colors ${
                activeTab === tab ? "bg-slate-900 text-white" : "hover:text-slate-900"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "admins"
                ? t("administration.tabs.admins")
                : t("administration.tabs.assigned")}
            </button>
          ))}
        </div>
        {activeTab === "admins" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                  <th className="py-3 px-4">{t("users.columns.userId")}</th>
                  <th className="py-3 px-4">{t("traders.columns.name")}</th>
                  <th className="py-3 px-4">{t("ui.common_email_label")}</th>
                  <th className="py-3 px-4">{t("labels.role")}</th>
                  <th className="py-3 px-4 text-center">{t("ui.common_assign_label")}</th>
                  <th className="py-3 px-4 text-right">{t("ui.table_actions_header")}</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold text-slate-900">{admin.id}</td>
                    <td className="py-3 px-4">{admin.name}</td>
                    <td className="py-3 px-4 text-slate-600">{admin.email}</td>
                    <td className="py-3 px-4 text-slate-700">
                      {t(`ui.role_${admin.role.toLowerCase()}_titlecase`, {
                        defaultValue: admin.role.replace("_", " "),
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {admin.role !== "SUPER_ADMIN" ? (
                        <button
                          type="button"
                          className="border border-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 hover:bg-emerald-50"
                          onClick={() => {
                            setAssignAdmin(admin);
                            setIsAssignOpen(true);
                          }}
                        >
                          {t("ui.common_assign_label")}
                        </button>
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                          —
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                        onClick={() => {
                          setEditingAdmin(admin);
                          setIsPopupOpen(true);
                        }}
                      >
                        {t("actions.edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {admins.map((admin) => {
              const assignedIds = assignments[admin.id] ?? [];
              const assignedTraders = assignedIds
                .map((id) => traderLookup[id])
                .filter(Boolean);
              return (
                <div key={`assigned-${admin.id}`} className="border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-800">
                        {admin.name}
                      </p>
                      <p className="text-xs text-slate-500">{admin.email}</p>
                    </div>
                    <button
                      type="button"
                      className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                      onClick={() => {
                        setAssignAdmin(admin);
                        setIsAssignOpen(true);
                      }}
                    >
                      {t("administration.assignedTable.manage")}
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    {assignedTraders.length ? (
                      assignedTraders.map((trader) => (
                        <div
                          key={trader.userId}
                          className="border border-slate-100 px-3 py-2 text-xs uppercase tracking-[0.2em] text-slate-600"
                        >
                          {trader.userId} · {trader.name} {trader.surname}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        {t("administration.assignedTable.none")}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {admins.every((admin) => (assignments[admin.id]?.length ?? 0) === 0) && (
              <p className="md:col-span-2 text-center text-sm text-slate-500">
                {t("administration.assignedTable.empty")}
              </p>
            )}
          </div>
        )}
        <AdminUserPopup
          open={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setEditingAdmin(null);
          }}
          user={editingAdmin ?? undefined}
          onSubmit={handleSubmit}
        />

        <AssignTraderPopup
          open={isAssignOpen}
          onClose={() => {
            setIsAssignOpen(false);
            setAssignAdmin(null);
          }}
          adminName={assignAdmin?.name ?? ""}
          traders={traderAccounts}
          assignedIds={assignAdmin ? assignments[assignAdmin.id] ?? [] : []}
          onSave={(ids) => {
            if (assignAdmin) {
              setAssignments((prev) => ({
                ...prev,
                [assignAdmin.id]: ids,
              }));
              if (ids.length) {
                setActiveTab("assigned");
              }
            }
            setIsAssignOpen(false);
            setAssignAdmin(null);
          }}
        />
      </section>
    </RoleGuard>
  );
};

export default AdministrationPage;


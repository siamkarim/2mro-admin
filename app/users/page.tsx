"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { RoleGuard } from "@/context/AuthContext";
import EditUserPopup from "@/components/popups/EditUserPopup";
import AddTraderPopup from "@/components/popups/AddTraderPopup";
import { fetchUsers } from "@/lib/api";
import type { AppUser } from "@/mock/data";
import { ROUTE_MAP } from "@/lib/utils/helpers";

const UsersPage = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [segment, setSegment] = useState<"users" | "blocked">("users");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
    setGeneratedAt(new Date().toLocaleString());
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

  const displayedUsers = users.filter((user) =>
    segment === "users"
      ? user.status === "verified"
      : user.status !== "verified"
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadUsers();
    setIsRefreshing(false);
  };

  const handleExport = () => {
    if (!displayedUsers.length) return;
    const header = [
      t("users.columns.userId"),
      t("users.columns.name"),
      t("users.columns.surname"),
      t("users.columns.nationalId"),
      t("users.columns.phone"),
      t("users.columns.dob"),
      t("users.columns.status"),
    ];
    const rows = displayedUsers.map((user) => [
      user.userId,
      user.name,
      user.surname,
      user.nationalId,
      user.phone,
      formatDate(user.dateOfBirth),
      t(`userVerification.${user.status}`),
    ]);
    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${segment}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <RoleGuard allowedRoles={ROUTE_MAP.users.allowedRoles}>
      <section className="space-y-4 border border-slate-200 bg-white p-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {t("users.title")}
            </p>
            <p className="text-xs text-slate-500">
              Forex · {generatedAt ?? "—"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex overflow-hidden rounded border border-slate-200">
              {(["users", "blocked"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSegment(option)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    segment === option
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option === "users"
                    ? t("users.filters.users")
                    : t("users.filters.blocked")}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing
                ? `${t("actions.refresh")}...`
                : t("actions.refresh")}
            </button>
            <button
              type="button"
              className="border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-50"
              onClick={handleExport}
            >
              {t("traders.export") ?? "Export to excel"}
            </button>
            <button
              type="button"
              className="bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
              onClick={() => setIsAddOpen(true)}
            >
              {t("ui.users_add_trader_button")}
            </button>
          </div>
        </header>
        {loading ? (
          <div className="border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">
            {t("messages.loading")}
          </div>
        ) : null}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[930px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="py-3 px-4">{t("users.columns.userId")}</th>
                <th className="py-3 px-4">{t("users.columns.name")}</th>
                <th className="py-3 px-4">{t("users.columns.surname")}</th>
                <th className="py-3 px-4">{t("users.columns.nationalId")}</th>
                <th className="py-3 px-4">{t("users.columns.phone")}</th>
                <th className="py-3 px-4">{t("users.columns.dob")}</th>
                <th className="py-3 px-4">{t("users.columns.status")}</th>
                <th className="py-3 px-4 text-right">
                  {segment === "users"
                    ? t("users.columns.edit")
                    : t("users.columns.action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-6 text-center text-sm text-slate-500"
                  >
                    {t("messages.empty")}
                  </td>
                </tr>
              ) : (
                displayedUsers.map((user) => (
                  <tr key={user.userId} className="border-b border-slate-100">
                    <td className="py-3 px-4 font-semibold uppercase tracking-[0.2em] text-slate-900">
                      {user.userId}
                    </td>
                    <td className="py-3 px-4 text-slate-900">{user.name}</td>
                    <td className="py-3 px-4 text-slate-900">{user.surname}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {user.nationalId}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{user.phone}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(user.dateOfBirth)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 border px-2 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${
                          user.status === "verified"
                            ? "border-emerald-500 text-emerald-600"
                            : "border-amber-500 text-amber-600"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            user.status === "verified"
                              ? "bg-emerald-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {t(`userVerification.${user.status}`)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {segment === "users" ? (
                        <button
                          type="button"
                          className="border border-slate-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
                          onClick={() => {
                            setEditingUser(user);
                            setIsEditOpen(true);
                          }}
                        >
                          {t("users.columns.edit")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="border border-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-600 hover:bg-emerald-50"
                        >
                          {t("actions.unblock") ?? "Unblock"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <EditUserPopup
          open={isEditOpen}
          user={editingUser ?? undefined}
          onClose={() => {
            setIsEditOpen(false);
            setEditingUser(null);
          }}
          // onSubmit={(user) => {
          //   if (!user) return;
          //   setUsers((prev) =>
          //     prev.map((entry) => (entry.userId === user.userId ? user : entry))
          //   );
          //   setIsEditOpen(false);
          //   setEditingUser(null);
          // }}
        />
        <AddTraderPopup
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSubmit={(payload) => {
            const newUser: AppUser = {
              userId: payload.userId,
              name: payload.name,
              surname: payload.surname,
              nationalId: payload.nationalId,
              phone: payload.phone,
              dateOfBirth: payload.dateOfBirth,
              status: "verified",
              accountType: "live",
              hasUploadedId: false,
            };
            setUsers((prev) => [newUser, ...prev]);
            setIsAddOpen(false);
          }}
        />
      </section>
    </RoleGuard>
  );
};

export default UsersPage;

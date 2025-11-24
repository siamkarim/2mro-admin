'use client';

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ModalBase from "@/components/popups/ModalBase";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "SUPER_ADMIN" | "MANAGER" | "RETENTION" | "USER";
  permissions: {
    addAdmin: boolean;
    updatePayments: boolean;
    viewAdministration: boolean;
    viewPayments: boolean;
    editTrader: boolean;
    editPositions: boolean;
    addTrader: boolean;
    editTraderDeposit: boolean;
    assignTraderAccess: boolean;
  };
}

interface AdminUserPopupProps {
  open: boolean;
  onClose: () => void;
  user?: AdminUser | null;
  onSubmit: (payload: AdminUser) => void;
}

const roleOptions: AdminUser["role"][] = [
  "SUPER_ADMIN",
  "MANAGER",
  "RETENTION",
  "USER",
];

const permissionConfig: Array<{
  key: keyof AdminUser["permissions"];
  labelKey: string;
  descriptionKey: string;
}> = [
  {
    key: "addAdmin",
    labelKey: "ui.permission_create_admins",
    descriptionKey: "ui.permission_create_admins_desc",
  },
  {
    key: "viewAdministration",
    labelKey: "ui.permission_view_admin",
    descriptionKey: "ui.permission_view_admin_desc",
  },
  {
    key: "editTrader",
    labelKey: "ui.permission_edit_trader_profiles",
    descriptionKey: "ui.permission_edit_trader_profiles_desc",
  },
  {
    key: "addTrader",
    labelKey: "ui.permission_create_trader",
    descriptionKey: "ui.permission_create_trader_desc",
  },
  {
    key: "updatePayments",
    labelKey: "ui.permission_configure_payments",
    descriptionKey: "ui.permission_configure_payments_desc",
  },
  {
    key: "viewPayments",
    labelKey: "ui.permission_view_payments",
    descriptionKey: "ui.permission_view_payments_desc",
  },
  {
    key: "editPositions",
    labelKey: "ui.permission_modify_positions",
    descriptionKey: "ui.permission_modify_positions_desc",
  },
  {
    key: "editTraderDeposit",
    labelKey: "ui.permission_edit_deposit_settings",
    descriptionKey: "ui.permission_edit_deposit_settings_desc",
  },
  {
    key: "assignTraderAccess",
    labelKey: "ui.permission_assign_trader",
    descriptionKey: "ui.permission_assign_trader_desc",
  },
];

const AdminUserPopup = ({ open, onClose, user, onSubmit }: AdminUserPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<AdminUser>({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "MANAGER",
    permissions: {
      addAdmin: false,
      updatePayments: false,
      viewAdministration: true,
      viewPayments: true,
      editTrader: false,
      editPositions: false,
      addTrader: false,
      editTraderDeposit: false,
      assignTraderAccess: false,
    },
  });

  useEffect(() => {
    if (user) {
      setFormState({
        ...user,
        password: user.password ?? "",
      });
    } else {
      setFormState({
        id: `ADM-${Date.now()}`,
        name: "",
        email: "",
        password: "",
        role: "MANAGER",
        permissions: {
          addAdmin: false,
          updatePayments: false,
          viewAdministration: true,
          viewPayments: true,
          editTrader: false,
          editPositions: false,
          addTrader: false,
          editTraderDeposit: false,
          assignTraderAccess: false,
        },
      });
    }
  }, [user, open]);

  const roleLabels = useMemo<Record<AdminUser["role"], string>>(
    () => ({
      SUPER_ADMIN: t("ui.role_super_admin_titlecase"),
      MANAGER: t("ui.role_manager_titlecase"),
      RETENTION: t("ui.role_retention_titlecase"),
      USER: t("ui.role_user_titlecase"),
    }),
    [t]
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formState);
  };

  const updateField = (key: keyof AdminUser, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={user ? t("ui.admin_user_edit_title") : t("ui.administration_add_admin_button")}
      className="max-w-lg"
    >
      <form className="space-y-4 text-sm text-slate-700" onSubmit={handleSubmit}>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("traders.columns.name")}
          <input
            className="mt-1 w-full border border-slate-300 px-3 py-2"
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            required
          />
        </label>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("ui.common_email_label")}
          <input
            type="email"
            className="mt-1 w-full border border-slate-300 px-3 py-2"
            value={formState.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
          />
        </label>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("users.columns.password")}
          <input
            type="password"
            className="mt-1 w-full border border-slate-300 px-3 py-2"
            value={formState.password ?? ""}
            onChange={(event) => updateField("password", event.target.value)}
            required={!user}
            placeholder={user ? "••••••••" : t("ui.admin_user_password_placeholder")}
          />
        </label>
        <label className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">
          {t("labels.role")}
          <select
            className="mt-1 w-full border border-slate-300 px-3 py-2"
            value={formState.role}
            onChange={(event) => updateField("role", event.target.value as AdminUser["role"])}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        </label>
        <div className="rounded border border-slate-200 bg-slate-50 p-3">
          <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-slate-500">
            {t("ui.permission_section_heading")}
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            {permissionConfig.map((perm) => (
              <label
                key={perm.key}
                className="flex gap-2 rounded border border-slate-200 bg-white p-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-3.5 w-3.5 border-slate-400 text-slate-900 focus:ring-slate-500"
                  checked={formState.permissions[perm.key]}
                  onChange={(event) =>
                    setFormState((prev) => ({
                      ...prev,
                      permissions: {
                        ...prev.permissions,
                        [perm.key]: event.target.checked,
                      },
                    }))
                  }
                />
                <span className="flex-1 normal-case text-slate-700 leading-tight">
                  <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    {t(perm.labelKey)}
                  </span>
                  <span className="text-[9px] font-normal uppercase tracking-[0.2em] text-slate-400">
                    {t(perm.descriptionKey)}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="border border-slate-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-600 hover:bg-slate-100"
            onClick={onClose}
          >
            {t("actions.cancel")}
          </button>
          <button
            type="submit"
            className="bg-slate-900 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white hover:bg-slate-800"
          >
            {t("ui.common_save_label")}
          </button>
        </div>
      </form>
    </ModalBase>
  );
};

export default AdminUserPopup;


'use client';

import { useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button";
import ModalBase from "@/components/popups/ModalBase";

interface AddUserPopupProps {
  open: boolean;
  onClose: () => void;
}

const AddUserPopup = ({ open, onClose }: AddUserPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState({
    name: "",
    surname: "",
    email: "",
    role: "USER",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClose();
  };

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("users.addUser", { defaultValue: "Add user" })}
      className="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("traders.columns.name")}
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("traders.columns.surname")}
            <input
              name="surname"
              value={formState.surname}
              onChange={handleChange}
              className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>
        </div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Email
          <input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
          Role
          <select
            name="role"
            value={formState.role}
            onChange={handleChange}
            className="mt-1 w-full border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="RETENTION">Retention</option>
            <option value="USER">User</option>
          </select>
        </label>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("actions.cancel")}
          </Button>
          <Button type="submit">{t("actions.confirm")}</Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default AddUserPopup;


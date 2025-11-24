'use client';

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "@/components/ui/Button";
import ModalBase from "@/components/popups/ModalBase";
import type { AppUser } from "@/mock/data";

export type EditableUser = AppUser & {
  password?: string;
};

interface EditUserPopupProps {
  open: boolean;
  onClose: () => void;
  user?: EditableUser | null;
}

const EditUserPopup = ({ open, onClose, user }: EditUserPopupProps) => {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<EditableUser | null>(null);
  const [originalState, setOriginalState] = useState<EditableUser | null>(null);
  const [isVerifyConfirmOpen, setIsVerifyConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<EditableUser["status"] | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      setFormState(null);
      setOriginalState(null);
      setIsEditing(false);
      setIsDirty(false);
      setPendingStatus(null);
      setIsVerifyConfirmOpen(false);
      setIsPasswordVisible(false);
      return;
    }
    const base = { ...user, password: "" };
    setFormState(base);
    setOriginalState({ ...base });
    setIsEditing(false);
    setIsDirty(false);
    setPendingStatus(null);
    setIsVerifyConfirmOpen(false);
    setIsPasswordVisible(false);
  }, [user]);

  const computeDirty = (next: EditableUser | null, base?: EditableUser | null) => {
    if (!next || !(base ?? originalState)) return false;
    const reference = base ?? originalState;
    return JSON.stringify(reference) !== JSON.stringify(next);
  };

  const updateFormState = (updates: Partial<EditableUser>) => {
    setFormState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      setIsDirty(computeDirty(next));
      return next;
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formState) return;
    const { name, value } = event.target;

    if (name === "status") {
      if (value === "verified" && formState.status !== "verified") {
        setPendingStatus("verified");
        setIsVerifyConfirmOpen(true);
        return;
      }
      updateFormState({ status: value as EditableUser["status"] });
      return;
    }

    if (!isEditing) return;

    updateFormState({ [name]: value } as Partial<EditableUser>);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState || !isDirty) return;
    setOriginalState({ ...formState });
    setIsDirty(false);
    setIsEditing(false);
    onClose();
  };

  if (!formState) {
    return (
      <ModalBase
        open={open}
        onClose={onClose}
        title={t("users.editUser")}
        className="max-w-lg"
      >
        <p className="text-sm text-slate-600">Select a user to edit.</p>
      </ModalBase>
    );
  }

  const canExportId = Boolean(formState.hasUploadedId);

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title={t("users.editUser")}
      className="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.userId")}
            <input
              name="userId"
              value={formState.userId}
              readOnly
              className="mt-1 w-full border border-slate-300 bg-slate-100 px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.nationalId")}
            <input
              name="nationalId"
              value={formState.nationalId}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full border border-slate-300 px-3 py-2 text-sm ${
                !isEditing ? "bg-slate-100 text-slate-500" : ""
              }`}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("traders.columns.name")}
            <input
              name="name"
              value={formState.name}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full border border-slate-300 px-3 py-2 text-sm ${
                !isEditing ? "bg-slate-100 text-slate-500" : ""
              }`}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("traders.columns.surname")}
            <input
              name="surname"
              value={formState.surname}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full border border-slate-300 px-3 py-2 text-sm ${
                !isEditing ? "bg-slate-100 text-slate-500" : ""
              }`}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.phone")}
            <input
              name="phone"
              value={formState.phone}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full border border-slate-300 px-3 py-2 text-sm ${
                !isEditing ? "bg-slate-100 text-slate-500" : ""
              }`}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.dob")}
            <input
              type="date"
              name="dateOfBirth"
              value={formState.dateOfBirth}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`mt-1 w-full border border-slate-300 px-3 py-2 text-sm ${
                !isEditing ? "bg-slate-100 text-slate-500" : ""
              }`}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.password")}
            <div className="relative mt-1">
              <input
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={formState.password ?? ""}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder="********"
                className={`w-full border border-slate-300 px-3 py-2 pr-16 text-sm font-mono tracking-widest ${
                  !isEditing ? "bg-slate-100 text-slate-500" : "text-slate-900"
                }`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600 hover:text-slate-900"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
              >
                {isPasswordVisible ? t("actions.hide") : t("actions.show")}
              </button>
            </div>
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            {t("users.columns.status")}
            <div className="relative mt-1">
              <span
                className={`pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${
                  formState.status === "verified" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <select
                name="status"
                value={formState.status}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border px-3 py-2 pl-7 text-sm font-semibold uppercase tracking-[0.2em] ${
                  formState.status === "verified"
                    ? "border-emerald-400 text-emerald-600"
                    : "border-amber-400 text-amber-500"
                } ${!isEditing ? "bg-slate-100 cursor-not-allowed" : ""}`}
              >
                <option value="verified">{t("userVerification.verified")}</option>
                <option value="not_verified">{t("userVerification.not_verified")}</option>
              </select>
            </div>
          </label>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 md:col-span-2">
            <span>{t("actions.exportId", { defaultValue: "Export ID" })}</span>
            <div className="mt-1 grid gap-2 md:grid-cols-2">
              <button
                type="button"
                disabled={!canExportId}
                className={`w-full border px-3 py-2 text-center text-sm font-semibold uppercase tracking-[0.25em] transition-colors ${
                  canExportId
                    ? "border-sky-600 bg-sky-600 text-white hover:bg-sky-500"
                    : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                }`}
                onClick={() => {
                  if (!formState || !canExportId) return;
                  const header = [
                    t("users.columns.userId"),
                    t("users.columns.name"),
                    t("users.columns.surname"),
                    t("users.columns.nationalId"),
                    t("users.columns.phone"),
                    t("users.columns.dob"),
                    t("users.columns.status"),
                  ];
                  const row = [
                    formState.userId,
                    formState.name,
                    formState.surname,
                    formState.nationalId,
                    formState.phone,
                    formState.dateOfBirth,
                    t(`userVerification.${formState.status}`),
                  ];
                  const csv = [header, row].map((line) => line.join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `${formState.userId}.csv`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                {t("actions.download") ?? "Download"}
              </button>
              <Button
                type="button"
                variant="danger"
                className="w-full"
                onClick={() => {
                  setIsEditing(true);
                  updateFormState({ status: "not_verified" });
                }}
              >
                {t("actions.blockUser")}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(true)}
              disabled={isEditing}
            >
              {t("actions.edit")}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {t("actions.cancel")}
            </Button>
            <Button type="submit" disabled={!isDirty}>
              {t("actions.confirm")}
            </Button>
          </div>
        </div>
      </form>
      {isVerifyConfirmOpen && (
        <ModalBase
          open={isVerifyConfirmOpen}
          onClose={() => {
            setIsVerifyConfirmOpen(false);
            setPendingStatus(null);
          }}
          title={t("users.confirmVerify.title")}
          className="max-w-md"
        >
          <div className="space-y-4 text-sm text-slate-700">
            <p>{t("users.confirmVerify.body")}</p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsVerifyConfirmOpen(false);
                  setPendingStatus(null);
                }}
              >
                {t("actions.cancel")}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (formState && pendingStatus) {
                    updateFormState({ status: pendingStatus });
                  }
                  setIsVerifyConfirmOpen(false);
                  setPendingStatus(null);
                }}
              >
                {t("actions.confirm")}
              </Button>
            </div>
          </div>
        </ModalBase>
      )}
    </ModalBase>
  );
};

export default EditUserPopup;


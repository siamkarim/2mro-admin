"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";
import { resources, type SupportedLocale } from "@/i18n/config";
import BrandLogo from "./BrandLogo";
import BellIcon from "@/components/icons/BellIcon";
import { userLogout } from "@/lib/api/users";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { role } = useAuth();
  const router = useRouter();

  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("preferredLanguage");
    if (stored && stored in resources && stored !== i18n.language) {
      void i18n.changeLanguage(stored as SupportedLocale);
    }
  }, [i18n]);

  const handleLanguageChange = (lang: SupportedLocale) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("preferredLanguage", lang);
      window.location.reload();
    } else {
      void i18n.changeLanguage(lang);
    }
  };

  const handleLogout = async () => {
    const res = await userLogout();
    if (res) {
      router.push(`/`);
    } else {
    }
  };

  return (
    <header className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 md:hidden"
          onClick={onToggleSidebar}
        >
          {t("actions.menu")}
        </button>
        <div className="flex items-start gap-3">
          <BrandLogo width={120} height={38} ariaLabel={t("brand")} priority />
          <span className="mt-[20px] text-lg font-semibold text-slate-900">
            {t("ui.navbar_heading_text")}
          </span>
        </div>
      </div>
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            aria-label={t("ui.navbar_notifications_title")}
            className="flex h-10 w-10 items-center justify-center border border-slate-300 bg-white text-slate-700"
            onClick={() => setNotificationOpen((prev) => !prev)}
          >
            <BellIcon className="h-5 w-5" />
          </button>
          {notificationOpen ? (
            <div className="absolute right-0 mt-1 w-56 border border-slate-200 bg-white shadow z-50">
              <div className="border-b border-slate-200 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {t("ui.navbar_notifications_title")}
              </div>
              <div className="px-4 py-3 text-sm text-slate-500">
                {t("ui.navbar_notifications_empty")}
              </div>
            </div>
          ) : null}
        </div>
        <div className="relative">
          <button
            type="button"
            className="flex items-center gap-2 border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {t("actions.menu")}
          </button>
          {menuOpen ? (
            <div className="absolute right-0 mt-1 w-56 border border-slate-200 bg-white shadow z-50">
              <div className="border-b border-slate-200 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {t("actions.changeRole")}
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {role.replace(/_/g, " ")}
                </p>
              </div>
              <div className="border-b border-slate-200 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {t("labels.language")}
                <div className="mt-2 flex gap-2">
                  {(["en", "tr"] as const).map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      className={`border border-slate-300 px-3 py-1 text-xs font-semibold ${
                        i18n.language === lang
                          ? "bg-slate-900 text-white"
                          : "text-slate-700"
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <button
                className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-600"
                onClick={handleLogout}
              >
                {t("ui.navbar_logout_link")}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

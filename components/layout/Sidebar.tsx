'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/context/AuthContext";
import BrandLogo from "./BrandLogo";
import { ROUTE_DEFINITIONS } from "@/lib/utils/helpers";
import type { RouteKey } from "@/lib/utils/helpers";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

const navBaseClass =
  "flex flex-col justify-between border-r border-slate-200 bg-white px-5 py-6";

const Sidebar = ({
  isMobile = false,
  isOpen = false,
  onNavigate,
  onClose,
}: SidebarProps) => {
  const pathname = usePathname();
  const { role } = useAuth();
  const { t } = useTranslation();

  const allowedSidebarKeys: RouteKey[] = [
    "dashboard",
    "users",
    "payments",
    "administration",
  ];

  const visibleLinks = ROUTE_DEFINITIONS.filter(
    (route) =>
      allowedSidebarKeys.includes(route.key) &&
      route.allowedRoles.includes(role)
  );

  const wrapperClass = isMobile
    ? `fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 md:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`
    : "hidden md:flex md:w-64";

  return (
    <aside className={`${wrapperClass} ${navBaseClass}`}>
      <div className="flex flex-col gap-6">
        <div className="border-b border-slate-200 pb-4">
          <div
            className={`flex ${
              isMobile ? "items-center justify-between" : "justify-center"
            }`}
          >
            <BrandLogo
              width={120}
              height={38}
              ariaLabel={t("brand")}
              className={isMobile ? "shrink-0" : "mx-auto"}
              priority
            />
            {isMobile ? (
              <button
                type="button"
                onClick={onClose}
                className="border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600"
              >
                X
              </button>
            ) : null}
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          {visibleLinks.map((route) => {
            const active = pathname.startsWith(route.href);
            return (
              <Link
                key={route.key}
                href={route.href}
                onClick={onNavigate}
                className={`border px-3 py-3 text-sm font-medium ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 text-slate-700 hover:border-slate-400"
                }`}
              >
                <span className="block">{t(route.labelKey)}</span>
                <span className="text-xs font-normal text-slate-500">
                  {t(route.descriptionKey)}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
        Forex © {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default Sidebar;


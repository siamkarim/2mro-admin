'use client';

import type { ReactNode } from "react";
import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const LayoutShell = ({ children }: { children: ReactNode }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <Sidebar
          isMobile
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onNavigate={() => setMobileSidebarOpen(false)}
        />
        <div className="flex-1 border-l border-slate-200">
          <Navbar
            onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          />
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default LayoutShell;


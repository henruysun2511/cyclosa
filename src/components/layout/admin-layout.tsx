"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeMenuItem?: string;
}

export function AdminLayout({
  children,
  activeMenuItem = "Companies",
}: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(activeMenuItem);

  const toggleSidebar = () => {
    // If mobile, toggle mobile drawer; if desktop, toggle collapse
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA] text-[#111827]">
      {/* ── Desktop Sidebar ─────────────────────────────────────────── */}
      <div className="hidden md:flex h-full shrink-0">
        <AdminSidebar
          collapsed={sidebarCollapsed}
          activeItem={selectedMenu}
          onSelectItem={(item) => setSelectedMenu(item)}
        />
      </div>

      {/* ── Mobile Sidebar Drawer ───────────────────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="w-64 h-full bg-white animate-slideIn">
            <AdminSidebar
              collapsed={false}
              activeItem={selectedMenu}
              onSelectItem={(item) => {
                setSelectedMenu(item);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
          <div
            className="flex-1"
            onClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* ── Main App Shell ──────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          sidebarOpen={!sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

export const DashboardLayout = AdminLayout;

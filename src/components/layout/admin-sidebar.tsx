"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Columns,
  PanelRight,
  Monitor,
  Columns2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export interface AdminSidebarProps {
  collapsed?: boolean;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

export function AdminSidebar({
  collapsed = false,
  activeItem,
  onSelectItem,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [superAdminExpanded, setSuperAdminExpanded] = useState(true);
  const [applicationsExpanded, setApplicationsExpanded] = useState(false);
  const [aiCenterExpanded, setAiCenterExpanded] = useState(false);

  const superAdminSubItems = [
    { name: "Dashboard", href: "#", badge: null },
    { name: "Companies", href: "/companies", badge: null },
    { name: "Subscriptions", href: "#", badge: null },
    { name: "Packages", href: "#", badge: null },
    { name: "Domain", href: "#", badge: null },
    { name: "Purchase Transaction", href: "#", badge: null },
    { name: "Tenant Usage Metrics", href: "#", badge: "New" },
    { name: "Tenant Support Tickets", href: "#", badge: "New" },
    { name: "Tickets", href: "#", badge: "New" },
  ];

  const layoutOptions = [
    { name: "Horizontal", icon: Columns },
    { name: "Detached", icon: PanelRight },
    { name: "Modern", icon: Monitor },
    { name: "Two Column", icon: Columns2 },
  ];

  return (
    <aside
      className={`flex flex-col h-full border-r border-border bg-white transition-all duration-300 select-none ${
        collapsed ? "w-18" : "w-64"
      }`}
    >
      {/* ── Brand Logo Header ────────────────────────────────────────── */}
      <div className="sidebar-header">
        <Link href="/companies" className="flex items-center gap-2.5">
          {/* Stylized swirl/spiral icon */}
          <div className="sidebar-brand-icon">
            <svg
              className="h-5 w-5 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 4a6 6 0 1 1-6 6 6 6 0 0 1 6-6Zm0 4a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
            </svg>
          </div>
          {!collapsed && (
            <div className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Cyclo<span className="text-primary">sa</span>
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* ── Navigation Menu ──────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin">
        {/* MAIN MENU GROUP */}
        <div>
          {!collapsed && (
            <div className="sidebar-group-label">
              Main Menu
            </div>
          )}

          <nav className="space-y-1">
            {/* 1. Dashboard with "Hot" badge */}
            <Link
              href="/companies"
              className={`sidebar-nav-item ${
                pathname === "/" ? "active" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4 shrink-0 text-muted-foreground" />
                {!collapsed && <span>Dashboard</span>}
              </div>
              {!collapsed && (
                <span className="badge-hot">
                  Hot
                </span>
              )}
            </Link>

            {/* 2. Applications (with expandable chevron) */}
            <div>
              <button
                type="button"
                onClick={() => setApplicationsExpanded(!applicationsExpanded)}
                className="sidebar-nav-item"
              >
                <div className="flex items-center gap-3">
                  <Boxes className="h-4 w-4 shrink-0 text-muted-foreground" />
                  {!collapsed && <span>Applications</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      applicationsExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {!collapsed && applicationsExpanded && (
                <div className="mt-1 pl-9 pr-2 space-y-1 border-l-2 border-border ml-4 text-xs">
                  <Link
                    href="/products"
                    className={`flex items-center gap-2 py-1.5 px-2 rounded transition-colors ${
                      pathname?.startsWith("/products")
                        ? "text-primary font-semibold bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Products Manager</span>
                  </Link>
                  <button
                    type="button"
                    className="flex w-full py-1.5 px-2 rounded hover:text-primary text-muted-foreground text-left transition-colors cursor-pointer"
                  >
                    Calendar
                  </button>
                  <button
                    type="button"
                    className="flex w-full py-1.5 px-2 rounded hover:text-primary text-muted-foreground text-left transition-colors cursor-pointer"
                  >
                    Chat & Messaging
                  </button>
                </div>
              )}
            </div>

            {/* 3. Super Admin (Expanded by default) */}
            <div>
              <button
                type="button"
                onClick={() => setSuperAdminExpanded(!superAdminExpanded)}
                className="sidebar-nav-item bg-background text-foreground font-semibold"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-primary" />
                  {!collapsed && <span>Super Admin</span>}
                </div>
                {!collapsed && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      superAdminExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {/* Sub-menu items */}
              {!collapsed && superAdminExpanded && (
                <div className="mt-1 space-y-0.5 pl-2">
                  {superAdminSubItems.map((subItem) => {
                    const isActive =
                      (subItem.name === "Companies" && pathname?.includes("/companies")) ||
                      (subItem.name === "Dashboard" && pathname === "/dashboard");

                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        onClick={() => onSelectItem?.(subItem.name)}
                        className={`sidebar-nav-item text-xs ${
                          isActive ? "active" : ""
                        }`}
                      >
                        <span className="truncate">{subItem.name}</span>
                        {subItem.badge && (
                          <span className="badge-new">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. AI Center (Menu parent with chevron) */}
            <div>
              <button
                type="button"
                onClick={() => setAiCenterExpanded(!aiCenterExpanded)}
                className="sidebar-nav-item"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#7C3AED]" />
                  {!collapsed && <span>AI Center</span>}
                </div>
                {!collapsed && (
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      aiCenterExpanded ? "rotate-90" : ""
                    }`}
                  />
                )}
              </button>

              {!collapsed && aiCenterExpanded && (
                <div className="mt-1 pl-9 pr-2 space-y-1 border-l-2 border-border ml-4 text-xs">
                  <button
                    type="button"
                    className="flex w-full py-1.5 px-2 rounded hover:text-primary text-muted-foreground text-left transition-colors cursor-pointer"
                  >
                    AI Assistant
                  </button>
                  <button
                    type="button"
                    className="flex w-full py-1.5 px-2 rounded hover:text-primary text-muted-foreground text-left transition-colors cursor-pointer"
                  >
                    Smart Analytics
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* LAYOUT GROUP */}
        <div>
          {!collapsed && (
            <div className="sidebar-group-label">
              Layout
            </div>
          )}

          <nav className="space-y-1">
            {layoutOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.name}
                  type="button"
                  onClick={() => onSelectItem?.(opt.name)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{opt.name}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}

export const Sidebar = AdminSidebar;
export const DashboardSidebar = AdminSidebar;

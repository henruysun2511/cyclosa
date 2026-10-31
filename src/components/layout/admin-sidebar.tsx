"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Bell,
  User,
  Users,
  Building2,
  FolderKanban,
  FileText,
  Clock,
  CalendarDays,
  DollarSign,
  Award,
  TrendingUp,
  MapPin,
  ShieldAlert,
  Sparkles,
  Settings,
  ShieldCheck,
  ChevronDown,
  Building,
  UserCheck,
  LogOut,
  History,
  GitFork,
  Film,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpiderIcon } from "@/components/shared";
import { navigationConfig, type NavGroup, type NavItem } from "@/config/navigation";
import { usePermission } from "@/features/authorization";

export interface AdminSidebarProps {
  collapsed?: boolean;
  activeItem?: string;
  onSelectItem?: (item: string) => void;
}

export function AdminSidebar({
  collapsed = false,
  onSelectItem,
}: AdminSidebarProps) {
  const pathname = usePathname();

  // Expanded group states
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ess: true,
    org: false,
    rec: false,
    time: false,
    payroll: false,
    perf: false,
    workplace: false,
    admin: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { can, canAnyInResource, isSuperAdmin } = usePermission();

  // Lọc đệ quy cây Menu Sidebar theo quyền hạn của người dùng
  const filteredNavGroups = React.useMemo(() => {
    if (isSuperAdmin) return navigationConfig;

    return navigationConfig
      .map((group) => {
        const filteredItems = group.items
          .map((item) => {
            // Nếu có menu con (Submenu), tiến hành lọc menu con
            if (item.children && item.children.length > 0) {
              const validChildren = item.children.filter((child) => {
                if (!child.permission) return true;
                return can(child.permission);
              });

              // Nếu tất cả menu con đều bị ẩn -> Ẩn luôn menu cha
              if (validChildren.length === 0) return null;

              return { ...item, children: validChildren };
            }

            // Menu không có con: Kiểm tra quyền cụ thể hoặc quyền theo phân hệ
            if (item.permission && !can(item.permission)) return null;
            if (item.resource && !canAnyInResource(item.resource)) return null;

            return item;
          })
          .filter(Boolean) as NavItem[];

        return { ...group, items: filteredItems };
      })
      .filter((group) => group.items.length > 0);
  }, [can, canAnyInResource, isSuperAdmin]);

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-white transition-all duration-300 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* ── Brand Logo Header ────────────────────────────────────────── */}
      <div className="h-16 border-b border-border flex items-center px-4 shrink-0 bg-white">
        <Link href="/dashboard" className="flex items-center gap-3 no-underline hover:no-underline select-none">
          <div className="h-9 w-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <SpiderIcon className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground font-sans">
              Cyclo<span className="text-primary font-bold">sa</span>
            </span>
          )}
        </Link>
      </div>

      {/* ── Navigation Menu Scrollable ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 scrollbar-thin">
        {filteredNavGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider select-none">
                {group.label}
              </div>
            )}

            <nav className="space-y-0.5">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const sectionKey = `${groupIdx}_${itemIdx}`;
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = expandedSections[sectionKey] ?? false;
                const isDirectActive = pathname === item.href;
                const isChildActive = item.children?.some((c) => pathname?.startsWith(c.href));

                if (hasChildren) {
                  return (
                    <div key={item.title}>
                      <button
                        type="button"
                        onClick={() => toggleSection(sectionKey)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer select-none no-underline hover:no-underline",
                          isChildActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                        )}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <Icon className={cn("h-4 w-4 shrink-0", isChildActive ? "text-primary" : "text-slate-500")} />
                          {!collapsed && <span className="truncate">{item.title}</span>}
                        </div>
                        {!collapsed && (
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0",
                              isExpanded && "rotate-180"
                            )}
                          />
                        )}
                      </button>

                      {!collapsed && isExpanded && (
                        <div className="mt-1 ml-4 pl-3 border-l border-slate-200 space-y-0.5 py-0.5">
                          {item.children!.map((child) => {
                            const active = pathname === child.href;
                            return (
                              <Link
                                key={child.title}
                                href={child.href}
                                onClick={() => onSelectItem?.(child.title)}
                                className={cn(
                                  "flex items-center justify-between py-1.5 px-2.5 rounded-md text-[12.5px] transition-colors select-none no-underline hover:no-underline",
                                  active
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                                )}
                              >
                                <span className="truncate">{child.title}</span>
                                {child.badge && (
                                  <span
                                    className={cn(
                                      "text-[10px] px-1.5 py-0.5 rounded font-medium",
                                      active ? "bg-primary text-white" : "bg-primary/10 text-primary"
                                    )}
                                  >
                                    {child.badge}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => onSelectItem?.(item.title)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors select-none no-underline hover:no-underline",
                      isDirectActive
                        ? "bg-primary text-white font-medium shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                    )}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <Icon className={cn("h-4 w-4 shrink-0", isDirectActive ? "text-white" : "text-slate-500")} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </div>
                    {!collapsed && item.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          isDirectActive ? "bg-white text-primary" : "bg-primary/10 text-primary"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  );
}

export const Sidebar = AdminSidebar;
export const DashboardSidebar = AdminSidebar;

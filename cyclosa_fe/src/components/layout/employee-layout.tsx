"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Camera,
  CalendarCheck,
  CalendarDays,
  Banknote,
  FileText,
  FileSignature,
  Target,
  Laptop,
  Trophy,
  CheckSquare,
  UserCheck,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  User,
  Shield,
  Clock,
  Building2,
  ChevronDown,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SpiderIcon } from "@/components/shared";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { useLogoutMutation, useGetMeQuery } from "@/features/auth/api/auth-api";
import { NotificationBell } from "@/features/notification";
import { toast } from "sonner";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ResponsiveEmployeeNav({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = React.useState<number>(6);
  const [isOpen, setIsOpen] = React.useState(false);

  const checkItemActive = (href: string) => {
    if (href.includes("tab=metrics")) {
      return pathname === "/me" && currentTab === "metrics";
    }
    if (href === "/me") {
      return pathname === "/me" && !currentTab;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const container = containerRef.current;
    const measureContainer = measureRef.current;
    if (!container || !measureContainer) return;

    const calculateFit = () => {
      const parent = container.parentElement;
      if (!parent) return;

      const parentWidth = parent.clientWidth;
      if (parentWidth <= 0) return;

      // Available width is parent width minus logo and right actions and extra safety padding
      const firstChild = parent.firstElementChild as HTMLElement | null;
      const lastChild = parent.lastElementChild as HTMLElement | null;
      const logoWidth = firstChild ? firstChild.offsetWidth : 240;
      const actionsWidth = lastChild ? lastChild.offsetWidth : 160;
      const PADDING_AND_GAPS = 64;

      const availableWidth = Math.max(200, parentWidth - logoWidth - actionsWidth - PADDING_AND_GAPS);

      const renderedItems = Array.from(measureContainer.children) as HTMLElement[];
      if (renderedItems.length === 0) return;

      const GAP = 4; // gap-1 is 4px
      const MORE_BTN_WIDTH = 84; // Width needed for "Khác v" trigger

      let totalWidth = 0;
      const itemWidths: number[] = [];
      for (let i = 0; i < renderedItems.length; i++) {
        const w = renderedItems[i].offsetWidth;
        itemWidths.push(w);
        totalWidth += w + (i > 0 ? GAP : 0);
      }

      // If all items fit comfortably
      if (totalWidth <= availableWidth) {
        setVisibleCount(items.length);
        return;
      }

      // Otherwise calculate how many fit along with the "Khác" button
      let accumulated = 0;
      let count = 0;
      for (let i = 0; i < itemWidths.length; i++) {
        const needed = accumulated + itemWidths[i] + (i > 0 ? GAP : 0) + GAP + MORE_BTN_WIDTH;
        if (needed <= availableWidth) {
          accumulated += itemWidths[i] + (i > 0 ? GAP : 0);
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    calculateFit();

    // Observe parent element to avoid flex feedback loops
    const observerTarget = container.parentElement || container;
    const resizeObserver = new ResizeObserver(() => {
      calculateFit();
    });

    resizeObserver.observe(observerTarget);

    return () => {
      resizeObserver.disconnect();
    };
  }, [items]);

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(visibleCount);

  const isOverflowActive = overflowItems.some((item) => checkItemActive(item.href));

  return (
    <div ref={containerRef} className="hidden md:flex items-center gap-1 flex-1 justify-center min-w-0 px-2 relative">
      {/* Hidden measuring container to get exact DOM widths of all items */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute top-0 left-0 -z-50 pointer-events-none opacity-0 invisible flex items-center gap-1"
      >
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.href}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0"
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.title}</span>
            </div>
          );
        })}
      </div>

      {/* Render visible items */}
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive = checkItemActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              isActive
                ? "bg-primary text-white font-semibold shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.title}</span>
          </Link>
        );
      })}

      {/* Render "Khác" dropdown when items overflow */}
      {overflowItems.length > 0 && (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isOverflowActive
                ? "bg-primary text-white font-semibold shadow-xs"
                : isOpen
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            <span>Khác</span>
            <ChevronDown className={`h-3.5 w-3.5 opacity-80 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-card p-1.5 text-foreground shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-100">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Chức năng khác
              </div>
              <div className="my-1 h-px bg-border" />
              <div className="max-h-72 overflow-y-auto space-y-0.5">
                {overflowItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = checkItemActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        isActive
                          ? "bg-primary text-white font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-muted-foreground"}`} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface EmployeeLayoutProps {
  children: React.ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { data: meResponse } = useGetMeQuery(undefined, { skip: !isAuthenticated });
  const userProfile = meResponse?.data;
  const [logoutApi] = useLogoutMutation();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const userMenuRef = React.useRef<HTMLDivElement>(null);

  // Khi đang ở /me và không mở tab metrics/dashboard -> hiển thị toàn màn hình Layout Grid Menu (Launchpad)
  const currentTab = searchParams.get("tab");
  const isGridMenu = pathname === "/me" && currentTab !== "metrics" && currentTab !== "dashboard";

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  React.useEffect(() => {
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Ignored
    } finally {
      dispatch(logout());
      toast.success("Đã đăng xuất thành công");
      router.replace("/login");
    }
  };

  const normalizedRoles = (authUser?.roles || []).map((r) => r.replace(/^ROLE_/, "").toUpperCase());
  const canAccessAdminPortal = normalizedRoles.some((r) =>
    [
      "SUPER_ADMIN",
      "HR_ADMIN",
      "HR_SPECIALIST",
      "RECRUITER",
      "PAYROLL_ACCOUNTANT",
      "EXECUTIVE",
      "MANAGER",
      "OFFICE_ADMIN",
      "AUDITOR",
      "ADMIN",
    ].includes(r)
  );

  const navItems = [
    {
      title: "Menu phân hệ",
      href: "/me",
      icon: LayoutGrid,
    },
    {
      title: "Dashboard",
      href: "/me?tab=metrics",
      icon: LayoutDashboard,
    },
    {
      title: "Thông tin cá nhân",
      href: "/me/profile",
      icon: UserCheck,
    },
    {
      title: "Điểm danh Face AI",
      href: "/me/attendance/check-in",
      icon: Camera,
    },
    {
      title: "Bảng công",
      href: "/me/attendance",
      icon: CalendarCheck,
    },
    {
      title: "Nghỉ phép",
      href: "/me/leave",
      icon: CalendarDays,
    },
    {
      title: "Phiếu lương",
      href: "/me/payslips",
      icon: Banknote,
    },
    {
      title: "Hợp đồng & Ký số",
      href: "/me/contracts",
      icon: FileSignature,
    },
    {
      title: "Đánh giá hiệu suất",
      href: "/me/performance",
      icon: Target,
    },
    {
      title: "Không gian làm việc",
      href: "/me/workplace/map",
      icon: Building2,
    },
    {
      title: "Tài sản & Thiết bị",
      href: "/me/assets",
      icon: Laptop,
    },
    {
      title: "Khen thưởng & Góp ý",
      href: "/me/rewards",
      icon: Trophy,
    },
    {
      title: "Phê duyệt đơn",
      href: "/me/approvals",
      icon: CheckSquare,
    },
  ];

  // Nếu đang ở trang Layout Grid Menu (/me), hiển thị full màn hình Launchpad trực tiếp
  if (isGridMenu) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/15 dark:bg-background">
      {/* 1. Header Cổng Nhân viên */}
      <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-md shadow-xs">
        <div className="w-full px-5 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-4 md:gap-6">
          {/* Logo & Nhãn Cổng nhân viên: Bấm vào luôn quay về trang layout grid menu (/me) */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/me"
              className="flex items-center gap-2 group cursor-pointer"
              title="Về trang Menu phân hệ (Grid Menu)"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-transform group-hover:scale-105">
                <SpiderIcon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight leading-none text-foreground group-hover:text-primary transition-colors">
                  CYCLOSA
                </span>
                <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                  Cổng Tự phục vụ ESS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links - Tự động hiển thị nút Khác và dropdown khi menu quá dài */}
          <ResponsiveEmployeeNav items={navItems} pathname={pathname} />

          {/* Actions & User menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Chuông thông báo */}
            <NotificationBell />

            {/* Menu người dùng chuẩn 100% AdminHeader (thuần React, không phụ thuộc Base UI) */}
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full p-0.5 transition-shadow hover:ring-2 hover:ring-primary/20 focus:outline-none cursor-pointer"
                aria-label="Menu tài khoản"
              >
                <div className="relative">
                  <div className="header-avatar-circle overflow-hidden">
                    {userProfile?.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.username || authUser?.email || "User"}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      (userProfile?.username || authUser?.name || authUser?.email || "NV")
                        .substring(0, 2)
                        .toUpperCase()
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="filter-dropdown-menu right-0 w-64 p-2 z-50 shadow-xl border rounded-xl bg-card text-foreground">
                  {/* User info header */}
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {userProfile?.username || authUser?.name || authUser?.email}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {authUser?.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-medium text-muted-foreground truncate">
                        {authUser?.roles && authUser.roles.length > 0
                          ? authUser.roles.map((r) => r.replace(/^ROLE_/, "")).join(", ")
                          : "Nhân viên"}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/me/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md cursor-pointer flex items-center transition-colors"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      href="/me/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md cursor-pointer flex items-center transition-colors"
                    >
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <span>Đổi mật khẩu</span>
                    </Link>

                    <Link
                      href="/me"
                      onClick={() => setUserMenuOpen(false)}
                      className="gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted rounded-md cursor-pointer flex items-center transition-colors"
                    >
                      <LayoutGrid className="h-4 w-4 text-primary" />
                      <span>Menu phân hệ (Grid Menu)</span>
                    </Link>

                    {canAccessAdminPortal && (
                      <Link
                        href="/dashboard/overview"
                        onClick={() => setUserMenuOpen(false)}
                        className="gap-2 px-3 py-2 text-xs text-primary font-medium hover:bg-primary/10 rounded-md cursor-pointer flex items-center transition-colors"
                      >
                        <Shield className="h-4 w-4 text-primary" />
                        <span>Chuyển sang Cổng Quản trị</span>
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-md cursor-pointer flex items-center font-medium transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Nội dung chính toàn màn hình */}
      <main className="flex-1 w-full overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
        <div className="w-full max-w-7xl mx-auto">{children}</div>
      </main>

      {/* 3. Bottom Navigation Bar dành cho Mobile / Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 h-14 max-w-md mx-auto">
          {[
            navItems[0], // Menu phân hệ (/me)
            navItems[1], // Dashboard (/me?tab=metrics)
            navItems[3], // Điểm danh Face AI
            navItems[4], // Bảng công
            navItems[6], // Phiếu lương
          ].map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors ${isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                <span className="truncate max-w-[64px] text-center">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}


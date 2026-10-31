"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  Grid3X3,
  MessageSquare,
  Mail,
  Bell,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  User,
  Shield,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import { useLogoutMutation } from "@/features/auth/api/auth-api";
import { ChangePasswordDialog } from "@/features/auth/components/change-password-dialog";

export interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
}: AdminHeaderProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [triggerLogout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      toast.info("Đã vào chế độ toàn màn hình");
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
        toast.info("Đã thoát chế độ toàn màn hình");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
    } catch {
      // Ignored
    } finally {
      dispatch(logout());
      toast.success("Đăng xuất thành công", {
        description: "Hẹn gặp lại bạn trong phiên làm việc tiếp theo.",
      });
      setUserMenuOpen(false);
      router.push("/login");
    }
  };

  return (
    <header className="header-bar">
      {/* ── Left section ────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
        {/* Toggle sidebar button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Thu gọn sidebar" : "Mở rộng sidebar"}
          className="btn-icon"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeft className="h-4 w-4" />
          )}
        </button>

        {/* Search input with keyboard shortcut badge */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm nhanh (nhân viên, chức danh, báo cáo)..."
            className="input-search"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <span className="badge-shortcut">CTRL + /</span>
          </div>
        </div>

        {/* Quick Nav Icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Ứng dụng nhanh"
            onClick={() => toast.info("Tính năng đang phát triển")}
            className="btn-icon-ghost"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Right section ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Center Dropdown Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAiMenuOpen(!aiMenuOpen)}
            className="btn-ai"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>AI Center</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {aiMenuOpen && (
            <div className="filter-dropdown-menu w-56 p-1.5 z-50">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Trợ lý AI Thông Minh
              </div>
              <button
                type="button"
                onClick={() => {
                  toast.success("Khởi động AI Insights");
                  setAiMenuOpen(false);
                }}
                className="filter-menu-item gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>AI Insights & Analytics</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  toast.success("Tạo báo cáo tự động bằng AI");
                  setAiMenuOpen(false);
                }}
                className="filter-menu-item gap-2"
              >
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                <span>Auto-Generate Reports</span>
              </button>
            </div>
          )}
        </div>

        {/* Utility Icon Cluster */}
        <div className="flex items-center gap-1 border-l border-border pl-2 sm:pl-3">
          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
            className="btn-icon-ghost"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            title="Lưới ứng dụng"
            onClick={() => toast.info("Xem bố cục dạng lưới")}
            className="btn-icon-ghost hidden sm:flex"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Tin nhắn"
            onClick={() => toast.info("Bạn có 0 tin nhắn mới")}
            className="btn-icon-ghost relative"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="header-dot bg-primary" />
          </button>

          <button
            type="button"
            title="Hộp thư"
            onClick={() => toast.info("Hộp thư đến")}
            className="btn-icon-ghost hidden sm:flex"
          >
            <Mail className="h-4 w-4" />
          </button>

          <button
            type="button"
            title="Thông báo"
            onClick={() => toast.info("Không có thông báo mới")}
            className="btn-icon-ghost relative"
          >
            <Bell className="h-4 w-4" />
          </button>
        </div>

        {/* User avatar & Account Dropdown */}
        <div className="relative pl-1">
          {isAuthenticated && authUser ? (
            <div>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full p-0.5 transition-shadow hover:ring-2 hover:ring-primary/20"
                aria-label="Menu tài khoản"
              >
                <div className="relative">
                  <div className="header-avatar-circle flex items-center justify-center bg-primary/10 text-primary font-semibold text-xs overflow-hidden">
                    {authUser.email.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </button>

              {userMenuOpen && (
                <div className="filter-dropdown-menu right-0 w-64 p-2 z-50 shadow-xl border rounded-xl bg-card">
                  {/* User info header */}
                  <div className="border-b border-border px-3 py-2.5">
                    <p className="text-sm font-semibold truncate text-foreground">
                      {authUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {authUser.roles && authUser.roles.length > 0
                          ? authUser.roles.join(", ")
                          : "Thành viên"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        toast.info("Trang hồ sơ cá nhân đang phát triển");
                      }}
                      className="filter-menu-item w-full gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Hồ sơ cá nhân</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setChangePasswordOpen(true);
                      }}
                      className="filter-menu-item w-full gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md flex items-center"
                    >
                      <KeyRound className="h-4 w-4 text-muted-foreground" />
                      <span>Đổi mật khẩu</span>
                    </button>
                  </div>

                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={handleLogout}
                      className="filter-menu-item w-full gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md flex items-center font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-xs font-semibold text-primary hover:underline px-2 py-1"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </header>
  );
}

export const Header = AdminHeader;
export const DashboardHeader = AdminHeader;

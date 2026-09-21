"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

export interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
}: AdminHeaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

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
            placeholder="Search..."
            className="input-search"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <span className="badge-shortcut">
              CTRL + /
            </span>
          </div>
        </div>

        {/* Quick Nav Icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Applications Grid"
            onClick={() => toast.info("Ứng dụng nhanh")}
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
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>Auto-Generate Reports</span>
              </button>
            </div>
          )}
        </div>

        {/* Utility Icon Cluster */}
        <div className="flex items-center gap-1 border-l border-border pl-2 sm:pl-3">
          {/* Maximize screen */}
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

          {/* Grid layout */}
          <button
            type="button"
            title="Lưới ứng dụng"
            onClick={() => toast.info("Xem bố cục dạng lưới")}
            className="btn-icon-ghost hidden sm:flex"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>

          {/* Messages with dot */}
          <button
            type="button"
            title="Tin nhắn"
            onClick={() => toast.info("Bạn có 3 tin nhắn chưa đọc")}
            className="btn-icon-ghost relative"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="header-dot bg-destructive" />
          </button>

          {/* Emails */}
          <button
            type="button"
            title="Hộp thư"
            onClick={() => toast.info("Hộp thư đến")}
            className="btn-icon-ghost hidden sm:flex"
          >
            <Mail className="h-4 w-4" />
          </button>

          {/* Notifications bell with dot */}
          <button
            type="button"
            title="Thông báo"
            onClick={() => toast.info("Bạn có 5 thông báo mới")}
            className="btn-icon-ghost relative"
          >
            <Bell className="h-4 w-4" />
            <span className="header-dot bg-primary" />
          </button>
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-1">
          <div className="relative cursor-pointer">
            <div className="header-avatar-circle">
              AD
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-white" />
          </div>
        </div>
      </div>
    </header>
  );
}

export const Header = AdminHeader;
export const DashboardHeader = AdminHeader;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../api/notification-api";
import { NotificationItem } from "./notification-item";

export function NotificationBell() {
  const [open, setOpen] = useState(false);

  // Polling unread count mỗi 30s
  const { data: countData, refetch: refetchCount } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
    skipPollingIfUnfocused: true, // Tiết kiệm mạng khi tab không active
  });

  // Revalidate ngay lập tức khi user quay lại tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refetchCount();
      }
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refetchCount]);

  // Lấy 5 thông báo mới nhất khi mở menu dropdown
  const { data: listData, isLoading: isLoadingList } = useGetNotificationsQuery(
    { page: 1, size: 5 },
    { skip: !open }
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: isMarkingAll }] = useMarkAllAsReadMutation();

  const unreadCount = countData?.unreadCount ?? 0;
  const notifications = listData?.items ?? [];

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc");
    } catch {
      toast.error("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch {
      // Bỏ qua lỗi ngầm
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Thông báo"
          className="btn-icon-ghost relative transition-colors focus-visible:outline-none"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span
              className={cn(
                "absolute -top-1 -right-1 flex items-center justify-center rounded-full",
                "bg-red-500 text-white font-bold shadow-xs border-2 border-background animate-in zoom-in-50",
                unreadCount > 99
                  ? "text-[9px] h-4.5 min-w-4.5 px-1"
                  : "text-[10px] h-4 min-w-4 px-1"
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 sm:w-96 p-0 shadow-xl border border-border rounded-xl bg-card z-50 overflow-hidden"
      >
        {/* Header Dropdown */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">Thông báo</span>
            {unreadCount > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {unreadCount} mới
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              disabled={isMarkingAll}
              onClick={handleMarkAllRead}
              className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              <span>Đọc tất cả</span>
            </Button>
          )}
        </div>

        {/* Danh sách 5 thông báo */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-border/50 p-1">
          {isLoadingList ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-xs">Đang tải thông báo...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-foreground">Không có thông báo nào</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Các tin tức và sự kiện mới sẽ hiển thị tại đây
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                compact
                onMarkRead={handleMarkRead}
              />
            ))
          )}
        </div>

        {/* Footer Dropdown */}
        <div className="p-2 border-t border-border bg-muted/20 text-center">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex items-center justify-center w-full py-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Xem tất cả trong Trung tâm thông báo &rarr;
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


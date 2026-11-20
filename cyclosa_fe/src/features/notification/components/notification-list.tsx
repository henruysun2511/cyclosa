"use client";

import React from "react";
import { Bell, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/empty-state";
import type { Notification } from "../types/notification.types";
import { NotificationItem } from "./notification-item";

interface NotificationListProps {
  notifications: Notification[];
  isLoading: boolean;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationList({
  notifications,
  isLoading,
  onMarkRead,
  onDelete,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="p-4 border border-border rounded-xl bg-card flex items-start gap-3.5"
          >
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="py-12 border border-border/60 rounded-2xl bg-card/50 text-center">
        <EmptyState
          icon={Inbox}
          title="Không có thông báo nào"
          description="Hòm thư của bạn hiện đang trống. Mọi thông báo mới từ hệ thống sẽ hiển thị tại đây."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkRead={onMarkRead}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


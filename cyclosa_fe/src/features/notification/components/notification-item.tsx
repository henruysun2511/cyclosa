"use client";

import React from "react";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Notification } from "../types/notification.types";
import { NOTIFICATION_TYPE_CONFIG } from "../constants/notification.constants";
import { formatRelativeTime } from "../utils/notification-utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
  compact = false,
}: NotificationItemProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.notificationType] || {
    label: "Thông báo",
    icon: NOTIFICATION_TYPE_CONFIG.SYSTEM.icon,
    badgeClassName: "bg-muted text-muted-foreground",
    iconBgClassName: "bg-muted text-muted-foreground",
  };

  const Icon = config.icon;

  const handleClickItem = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClickItem}
      className={cn(
        "group relative flex items-start gap-3.5 transition-colors rounded-xl",
        compact
          ? "p-3 hover:bg-muted/60 cursor-pointer text-left w-full"
          : "p-4 border border-border bg-card hover:border-primary/30 hover:shadow-xs",
        !notification.isRead && "bg-primary/5 dark:bg-primary/10 border-primary/20"
      )}
    >
      {/* Icon phân loại */}
      <div
        className={cn(
          "shrink-0 rounded-lg flex items-center justify-center",
          compact ? "h-9 w-9" : "h-10 w-10",
          config.iconBgClassName
        )}
      >
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </div>

      {/* Nội dung thông báo */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-xs font-semibold leading-snug line-clamp-1",
                notification.isRead ? "text-foreground" : "text-foreground font-bold"
              )}
            >
              {notification.title}
            </span>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-1.5 py-0 h-4 font-medium", config.badgeClassName)}
            >
              {config.label}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {formatRelativeTime(notification.createdAt)}
            </span>
            {!notification.isRead && (
              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
        </div>

        <p
          className={cn(
            "text-xs text-muted-foreground leading-relaxed",
            compact ? "line-clamp-2" : "line-clamp-3"
          )}
        >
          {notification.content}
        </p>

        {/* Footer actions nếu có actionUrl hoặc onDelete */}
        {(!compact || notification.actionUrl) && (
          <div className="mt-2.5 flex items-center justify-between gap-2 pt-1">
            {notification.actionUrl ? (
              <Link
                href={notification.actionUrl}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickItem();
                }}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <span>Xem chi tiết</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            ) : (
              <div />
            )}

            {!compact && onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                <span>Xóa</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


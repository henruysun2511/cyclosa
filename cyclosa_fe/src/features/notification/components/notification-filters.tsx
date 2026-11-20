"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { NotificationTab } from "../types/notification.types";
import { NOTIFICATION_TABS } from "../constants/notification.constants";

interface NotificationFiltersProps {
  activeTab: NotificationTab;
  onTabChange: (tab: NotificationTab) => void;
  unreadCount?: number;
}

export function NotificationFilters({
  activeTab,
  onTabChange,
  unreadCount = 0,
}: NotificationFiltersProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-border scrollbar-none">
      {NOTIFICATION_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3.5 py-2 text-xs font-medium rounded-lg transition-all shrink-0 flex items-center gap-1.5",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <span>{tab.label}</span>
            {tab.id === "UNREAD" && unreadCount > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold leading-none",
                  isActive
                    ? "bg-white text-primary"
                    : "bg-red-500 text-white"
                )}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}


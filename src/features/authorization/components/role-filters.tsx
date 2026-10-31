"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCw, X, ShieldAlert, SlidersHorizontal, Layers } from "lucide-react";
import { ROLE_FILTER_TABS, type RoleFilterTab } from "../constants/role.constants";

interface RoleFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  activeTab: RoleFilterTab;
  onTabChange: (tab: RoleFilterTab) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export function RoleFilters({
  keyword,
  onKeywordChange,
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing = false,
}: RoleFiltersProps) {
  const tabs = [
    {
      id: ROLE_FILTER_TABS.ALL,
      label: "Tất cả vai trò",
      icon: Layers,
    },
    {
      id: ROLE_FILTER_TABS.SYSTEM,
      label: "Vai trò Hệ thống",
      icon: ShieldAlert,
    },
    {
      id: ROLE_FILTER_TABS.CUSTOM,
      label: "Vai trò Tùy chỉnh",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-card rounded-xl border shadow-xs">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Tìm theo tên hoặc mã vai trò..."
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          className="pl-9 pr-8 h-9 text-sm"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => onKeywordChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Refresh */}
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <div className="inline-flex items-center rounded-lg bg-muted p-1 border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="h-9 px-3 gap-1.5"
          title="Tải lại dữ liệu"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
          <span className="hidden md:inline text-xs">Làm mới</span>
        </Button>
      </div>
    </div>
  );
}


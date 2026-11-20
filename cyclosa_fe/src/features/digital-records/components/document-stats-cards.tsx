"use client";

import React from "react";
import { FileText, Clock, Archive, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentSummary } from "../types/digital-records.types";

interface DocumentStatsCardsProps {
  total?: number;
  draftOrPending?: number;
  archived?: number;
  legalHold?: number;
  documents?: DocumentSummary[];
  onFilterStatus?: (status: string | undefined) => void;
  selectedStatus?: string;
}

export function DocumentStatsCards({
  total = 0,
  draftOrPending,
  archived,
  legalHold,
  documents = [],
  onFilterStatus,
  selectedStatus,
}: DocumentStatsCardsProps) {
  const calculatedTotal = total > 0 ? total : documents.length;
  const calculatedDraft =
    draftOrPending !== undefined
      ? draftOrPending
      : documents.filter((d) => d.status === "DRAFT" || d.status === "VERIFIED").length;
  const calculatedArchived =
    archived !== undefined
      ? archived
      : documents.filter((d) => d.status === "ARCHIVED").length;
  const calculatedHold =
    legalHold !== undefined
      ? legalHold
      : documents.filter((d) => d.isLegalHold).length;

  const stats = [
    {
      label: "Tổng hồ sơ số hóa",
      count: calculatedTotal,
      icon: FileText,
      iconBg: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
      sparkColor: "#2563EB",
      sparkPath: "M0,35 Q25,38 50,20 T100,6",
      statusKey: "ALL",
    },
    {
      label: "Chờ thẩm định & Ký số",
      count: calculatedDraft,
      icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
      sparkColor: "#F59E0B",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
      statusKey: "DRAFT",
    },
    {
      label: "Đã nộp lưu kho",
      count: calculatedArchived,
      icon: Archive,
      iconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
      sparkColor: "#10B981",
      sparkPath: "M0,32 Q35,15 70,25 T100,8",
      statusKey: "ARCHIVED",
    },
    {
      label: "Tạm giữ pháp lý",
      count: calculatedHold,
      icon: ShieldAlert,
      iconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400",
      sparkColor: "#E11D48",
      sparkPath: "M0,20 L25,35 L55,18 L75,32 L100,15",
      statusKey: "HOLD",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.statusKey;
        return (
          <div
            key={item.label}
            onClick={() => {
              if (onFilterStatus) {
                onFilterStatus(isSelected ? undefined : item.statusKey);
              }
            }}
            className={cn(
              "flex items-center justify-between rounded-xl border p-4 sm:p-5 shadow-xs transition-all cursor-pointer group bg-card",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:shadow-md"
            )}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5">
                  {item.count}
                </h3>
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity">
              <svg viewBox="0 0 100 45" className="h-full w-full overflow-visible">
                <path
                  d={item.sparkPath}
                  fill="none"
                  stroke={item.sparkColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

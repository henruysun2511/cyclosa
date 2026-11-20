"use client";

import React from "react";
import { HandCoins, Clock, CheckCircle2, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SalaryAdvanceDto } from "../../types/payroll.types";

interface AdvanceStatsCardsProps {
  advances: SalaryAdvanceDto[];
  selectedStatus?: string;
  onFilterStatus?: (status: string | undefined) => void;
}

/**
 * Thẻ thống kê KPI Tạm ứng lương chuẩn Rule 03 (Contract/Employee Stats Cards)
 */
export function AdvanceStatsCards({
  advances,
  selectedStatus,
  onFilterStatus,
}: AdvanceStatsCardsProps) {
  const total = advances.length;
  const pending = advances.filter((a) => a.status === "PENDING_APPROVAL").length;
  const approved = advances.filter((a) => a.status === "APPROVED").length;
  const disbursed = advances.filter((a) => a.status === "DISBURSED").length;

  const totalDisbursedAmount = advances
    .filter((a) => a.status === "DISBURSED")
    .reduce((sum, a) => sum + (a.amount || 0), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const stats = [
    {
      label: "Tổng đơn đề nghị",
      count: total,
      subtext: "Toàn bộ yêu cầu tạm ứng",
      icon: HandCoins,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
      statusKey: "ALL",
    },
    {
      label: "Chờ phê duyệt",
      count: pending,
      subtext: "Cần xét duyệt hạn mức",
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
      statusKey: "PENDING_APPROVAL",
    },
    {
      label: "Chờ giải ngân",
      count: approved,
      subtext: "Kế toán chuẩn bị chi",
      icon: CheckCircle2,
      iconBg: "bg-blue-600 text-white",
      sparkColor: "#2563EB",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
      statusKey: "APPROVED",
    },
    {
      label: "Đã giải ngân",
      count: disbursed,
      subtext: formatCurrency(totalDisbursedAmount),
      icon: Banknote,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
      statusKey: "DISBURSED",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected =
          (!selectedStatus && item.statusKey === "ALL") || selectedStatus === item.statusKey;

        return (
          <div
            key={item.label}
            onClick={() => {
              if (!onFilterStatus) return;
              if (item.statusKey === "ALL") {
                onFilterStatus(selectedStatus === "ALL" ? undefined : "ALL");
              } else {
                onFilterStatus(selectedStatus === item.statusKey ? "ALL" : item.statusKey);
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
                {item.subtext && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[150px]">
                    {item.subtext}
                  </p>
                )}
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

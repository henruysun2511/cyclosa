"use client";

import React from "react";
import type { PayrollPeriodSummaryDto } from "../../types/payroll.types";
import { DollarSign, Wallet, ShieldAlert, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodSummaryCardsProps {
  summary?: PayrollPeriodSummaryDto;
}

/**
 * Thẻ thống kê tài chính Tổng quan kỳ lương theo chuẩn Rule 03
 */
export function PeriodSummaryCards({ summary }: PeriodSummaryCardsProps) {
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const totalDeductions =
    (summary?.totalEmployeeInsurance || 0) +
    (summary?.totalPitTax || 0) +
    (summary?.totalAdvanceDeducted || 0);

  const stats = [
    {
      label: "Tổng quỹ lương Gross",
      value: formatCurrency(summary?.totalGross),
      subtext: `Quy mô: ${summary?.totalEmployees || 0} nhân sự`,
      icon: DollarSign,
      iconBg: "bg-primary text-white",
      sparkColor: "#DC2626",
      sparkPath: "M0,35 Q25,38 50,22 T100,8",
    },
    {
      label: "Tổng thực lĩnh (Net)",
      value: formatCurrency(summary?.totalNet),
      subtext: `Chờ chi: ${formatCurrency(summary?.totalPendingPayment)}`,
      icon: Wallet,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,38 Q30,42 60,18 T100,5",
    },
    {
      label: "Thuế & BHXH NLĐ đóng",
      value: formatCurrency(totalDeductions),
      subtext: `Thuế: ${formatCurrency(summary?.totalPitTax)} • BHXH: ${formatCurrency(summary?.totalEmployeeInsurance)}`,
      icon: ShieldAlert,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,30 Q35,12 70,25 T100,10",
    },
    {
      label: "Tổng chi phí doanh nghiệp",
      value: formatCurrency(summary?.totalEmployerCost),
      subtext: `BHXH DN (21.5%): ${formatCurrency(summary?.totalEmployerInsurance)}`,
      icon: Building2,
      iconBg: "bg-indigo-600 text-white",
      sparkColor: "#6366F1",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="flex items-center justify-between rounded-xl border border-border p-4 sm:p-5 shadow-xs transition-all group bg-card hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105",
                  item.iconBg
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {item.label}
                </p>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono mt-0.5 truncate">
                  {item.value}
                </h3>
                {item.subtext && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {item.subtext}
                  </p>
                )}
              </div>
            </div>

            <div className="h-9 w-20 shrink-0 opacity-75 group-hover:opacity-100 transition-opacity pl-2">
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

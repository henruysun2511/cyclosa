import React from "react";
import { FileCheck, Clock, AlertTriangle, FileX } from "lucide-react";
import type { ContractSummary } from "../types/contract.types";
import { cn } from "@/lib/utils";

interface ContractStatsCardsProps {
  contracts: ContractSummary[];
  onFilterStatus?: (status: string | undefined) => void;
  selectedStatus?: string;
}

export function ContractStatsCards({
  contracts,
  onFilterStatus,
  selectedStatus,
}: ContractStatsCardsProps) {
  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const inProgressCount = contracts.filter(
    (c) =>
      c.status === "PENDING_APPROVAL" ||
      c.status === "IN_SIGNING" ||
      c.status === "APPROVED"
  ).length;
  const expiringCount = contracts.filter((c) => {
    if (c.status !== "ACTIVE" || !c.endDate) return false;
    const end = new Date(c.endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  }).length;
  const terminatedCount = contracts.filter(
    (c) => c.status === "TERMINATED" || c.status === "EXPIRED"
  ).length;

  const stats = [
    {
      label: "Đang hiệu lực",
      count: activeCount,
      icon: FileCheck,
      iconBg: "bg-emerald-600 text-white",
      sparkColor: "#10B981",
      sparkPath: "M0,35 Q25,38 50,20 T100,6",
      statusKey: "ACTIVE",
    },
    {
      label: "Chờ duyệt & Đang ký",
      count: inProgressCount,
      icon: Clock,
      iconBg: "bg-purple-600 text-white",
      sparkColor: "#A855F7",
      sparkPath: "M0,28 Q30,12 60,26 T100,12",
      statusKey: "IN_SIGNING",
    },
    {
      label: "Sắp hết hạn (≤ 60 ngày)",
      count: expiringCount,
      icon: AlertTriangle,
      iconBg: "bg-amber-500 text-white",
      sparkColor: "#F59E0B",
      sparkPath: "M0,18 L25,34 L55,22 L75,38 L100,24",
      statusKey: "EXPIRING",
    },
    {
      label: "Đã kết thúc / Chấm dứt",
      count: terminatedCount,
      icon: FileX,
      iconBg: "bg-slate-600 text-white",
      sparkColor: "#64748B",
      sparkPath: "M0,32 Q35,32 70,32 T100,32",
      statusKey: "TERMINATED",
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
            onClick={() => onFilterStatus?.(isSelected ? undefined : item.statusKey)}
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

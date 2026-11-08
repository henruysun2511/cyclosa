import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Clock, AlertTriangle, FileX } from "lucide-react";
import type { ContractSummary } from "../types/contract.types";

interface ContractStatsCardsProps {
  contracts: ContractSummary[];
  onFilterStatus?: (status: string | undefined) => void;
  selectedStatus?: string;
}

export function ContractStatsCards({ contracts, onFilterStatus, selectedStatus }: ContractStatsCardsProps) {
  const activeCount = contracts.filter((c) => c.status === "ACTIVE").length;
  const inProgressCount = contracts.filter(
    (c) => c.status === "PENDING_APPROVAL" || c.status === "IN_SIGNING" || c.status === "APPROVED"
  ).length;
  const expiringCount = contracts.filter((c) => {
    if (c.status !== "ACTIVE" || !c.endDate) return false;
    const end = new Date(c.endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 60;
  }).length;
  const terminatedCount = contracts.filter((c) => c.status === "TERMINATED" || c.status === "EXPIRED").length;

  const stats = [
    {
      label: "Đang hiệu lực",
      count: activeCount,
      icon: FileCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      statusKey: "ACTIVE",
    },
    {
      label: "Chờ duyệt & Đang ký",
      count: inProgressCount,
      icon: Clock,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      statusKey: "IN_SIGNING",
    },
    {
      label: "Sắp hết hạn (≤ 60 ngày)",
      count: expiringCount,
      icon: AlertTriangle,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      statusKey: "EXPIRING",
    },
    {
      label: "Đã kết thúc / Chấm dứt",
      count: terminatedCount,
      icon: FileX,
      color: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50 dark:bg-slate-800/40",
      statusKey: "TERMINATED",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        const isSelected = selectedStatus === item.statusKey;
        return (
          <Card
            key={item.label}
            onClick={() => onFilterStatus?.(isSelected ? undefined : item.statusKey)}
            className={`cursor-pointer transition-all hover:shadow-md border ${
              isSelected ? "ring-2 ring-primary border-primary" : "border-border"
            }`}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.count}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${item.bgColor}`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}


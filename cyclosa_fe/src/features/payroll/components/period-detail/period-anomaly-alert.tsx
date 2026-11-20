"use client";

import { AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PayrollAnomalyDto } from "../../types/payroll.types";

interface PeriodAnomalyAlertProps {
  anomalies?: PayrollAnomalyDto[];
  onViewRecord?: (recordId: string) => void;
}

export function PeriodAnomalyAlert({
  anomalies = [],
  onViewRecord,
}: PeriodAnomalyAlertProps) {
  if (anomalies.length === 0) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-semibold text-sm">
        <AlertTriangle className="h-4 w-4" />
        <span>Phát hiện {anomalies.length} bất thường cần kế toán rà soát trước khi trình duyệt:</span>
      </div>

      <div className="mt-3 divide-y divide-amber-200/60 dark:divide-amber-900/40 text-xs">
        {anomalies.map((a, idx) => (
          <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="font-medium text-foreground">
                {a.employeeName} ({a.employeeCode}) {a.departmentName && `• ${a.departmentName}`}
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                {a.message} (Thực nhận hiện tại: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(a.currentNet)})
              </p>
            </div>
            {onViewRecord && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1 hover:bg-amber-100 dark:hover:bg-amber-900/40"
                onClick={() => onViewRecord(a.recordId)}
              >
                Xem chi tiết
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


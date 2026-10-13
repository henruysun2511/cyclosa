"use client";

import React, { useState } from "react";
import { Calendar, History, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface EffectiveRecord {
  id: string | number;
  effectiveFrom: string; // YYYY-MM-DD
  effectiveTo?: string | null; // YYYY-MM-DD or null
  title: string;
  departmentName?: string;
  salaryOrGrade?: string;
  changeReason?: string;
  decisionNumber?: string;
  isCurrent?: boolean;
}

export interface EffectiveDatedHistoryProps {
  records: EffectiveRecord[];
  className?: string;
  title?: string;
  onFilterAsOf?: (asOfDate: string) => void;
}

export function EffectiveDatedHistory({
  records,
  className,
  title = "Lịch sử biến động theo ngày hiệu lực",
  onFilterAsOf,
}: EffectiveDatedHistoryProps) {
  const [asOfDate, setAsOfDate] = useState("");

  const handleApplyAsOf = () => {
    if (onFilterAsOf && asOfDate) {
      onFilterAsOf(asOfDate);
    }
  };

  return (
    <div className={cn("space-y-4 rounded-lg border border-border bg-white p-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        </div>

        {/* AsOf Date Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground whitespace-nowrap">Xem tại thời điểm:</span>
          <Input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="h-8 w-36 text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={handleApplyAsOf}
          >
            Tra cứu
          </Button>
          {asOfDate && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => {
                setAsOfDate("");
                onFilterAsOf?.("");
              }}
            >
              Xem tất cả
            </Button>
          )}
        </div>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {records.map((rec) => (
          <div key={rec.id} className="relative group">
            {/* Timeline bullet */}
            <div
              className={cn(
                "absolute -left-6 top-1.5 -translate-x-1/2 h-3.5 w-3.5 rounded-full border-2 bg-white",
                rec.isCurrent
                  ? "border-primary bg-primary ring-4 ring-primary/20"
                  : "border-slate-400"
              )}
            />

            <div
              className={cn(
                "p-3.5 rounded-lg border transition-all",
                rec.isCurrent
                  ? "bg-primary/5 border-primary/20 shadow-xs"
                  : "bg-slate-50/60 border-slate-200"
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {rec.title}
                  </span>
                  {rec.isCurrent && (
                    <Badge variant="default" className="text-2xs py-0 h-4 bg-primary text-white">
                      Đang áp dụng
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>{rec.effectiveFrom}</span>
                  <ArrowRight className="h-3 w-3 text-slate-400" />
                  <span>{rec.effectiveTo || "Hiện tại"}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 mt-2">
                {rec.departmentName && (
                  <div>
                    <span className="text-muted-foreground">Đơn vị: </span>
                    <span className="font-medium text-foreground">{rec.departmentName}</span>
                  </div>
                )}
                {rec.salaryOrGrade && (
                  <div>
                    <span className="text-muted-foreground">Mức lương / Bậc: </span>
                    <span className="font-medium text-foreground">{rec.salaryOrGrade}</span>
                  </div>
                )}
                {rec.decisionNumber && (
                  <div>
                    <span className="text-muted-foreground">Số quyết định: </span>
                    <span className="font-mono font-medium text-foreground">{rec.decisionNumber}</span>
                  </div>
                )}
              </div>

              {rec.changeReason && (
                <div className="mt-2 text-xs text-muted-foreground italic border-t border-slate-200/60 pt-1.5">
                  Lý do: {rec.changeReason}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

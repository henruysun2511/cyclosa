"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Layers,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import type {
  WhatIfImpactAnalysis,
  RestructureConflicts,
} from "../types/org-restructuring.types";
import { Badge } from "@/components/ui/badge";
import { CONFLICT_SEVERITY_CONFIG } from "../constants/org-restructuring.constants";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgImpactPanelProps {
  impact?: WhatIfImpactAnalysis;
  conflicts?: RestructureConflicts;
  isLoading?: boolean;
}

export function OrgImpactPanel({
  impact,
  conflicts,
  isLoading = false,
}: OrgImpactPanelProps) {
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-5">
      {/* 1. Header */}
      <div>
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Bảng phân tích Tác động What-If</span>
        </h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Dự báo định lượng trước khi áp dụng vào thực tế
        </p>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Biến động nhân sự */}
        <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3 text-primary" />
            Biến động Định biên
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-foreground">{impact?.toBeHeadcount || 0}</span>
            <span className="text-xs text-muted-foreground">({impact?.asIsHeadcount || 0} cũ)</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-medium">
            {impact && impact.deltaHeadcount >= 0 ? `+${impact.deltaHeadcount}` : impact?.deltaHeadcount} nhân sự
          </p>
        </div>

        {/* Biến động quỹ lương tháng */}
        <div className="p-3 rounded-lg border border-border/80 bg-background/50 space-y-1">
          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-emerald-600" />
            Quỹ lương tháng
          </span>
          <div className="text-sm font-bold text-foreground truncate">
            {formatCurrency(impact?.toBeMonthlyPayroll)}
          </div>
          <p className="text-[10px] text-muted-foreground">
            Chênh lệch: {formatCurrency(impact?.deltaMonthlyPayroll)}/tháng
          </p>
        </div>
      </div>

      {/* 3. Tỉ lệ quản lý & Độ sâu phân cấp */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
        <div className="space-y-1">
          <span className="text-[11px] text-muted-foreground block">Span of Control TB:</span>
          <div className="text-sm font-semibold text-foreground">
            {impact?.toBeAverageSpanOfControl || 0} <span className="text-[11px] font-normal text-muted-foreground">NV/quản lý</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-muted-foreground block">Độ sâu phân tầng tối đa:</span>
          <div className="text-sm font-semibold text-foreground">
            {impact?.toBeMaxHierarchyDepth || 0} <span className="text-[11px] font-normal text-muted-foreground">cấp quản lý</span>
          </div>
        </div>
      </div>

      {/* 4. Rà soát xung đột & Lỗ hổng tổ chức */}
      <div className="space-y-2 pt-2 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <span>Rà soát xung đột ({conflicts?.conflicts?.length || 0})</span>
          </span>
          {conflicts?.hasCriticalErrors ? (
            <Badge variant="destructive" className="text-[10px] h-5">
              Chặn đệ trình
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] h-5 text-emerald-600 border-emerald-500/30">
              Sẵn sàng
            </Badge>
          )}
        </div>

        {conflicts?.conflicts?.length === 0 ? (
          <div className="p-3 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/50 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Sơ đồ hợp lệ, không phát hiện lỗ hổng hoặc nhân sự mồ côi.</span>
          </div>
        ) : (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {conflicts?.conflicts?.map((c, idx) => {
              const sev = CONFLICT_SEVERITY_CONFIG[c.severity] || {
                label: c.severity,
                badgeClass: "bg-slate-100",
              };
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-border/80 bg-background text-xs space-y-1 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-semibold text-foreground line-clamp-1">{c.title}</span>
                    <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${sev.badgeClass}`}>
                      {c.code}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">{c.description}</p>
                  {c.suggestion && (
                    <p className="text-[10px] text-primary italic">👉 {c.suggestion}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

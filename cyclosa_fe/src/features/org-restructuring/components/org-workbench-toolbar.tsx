"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  GitMerge,
  Split,
  AlertTriangle,
  GitCompare,
  Send,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
} from "lucide-react";
import type { OrgScenarioItem, RestructureConflicts } from "../types/org-restructuring.types";
import { SCENARIO_STATUS_CONFIG } from "../constants/org-restructuring.constants";

interface OrgWorkbenchToolbarProps {
  scenario: OrgScenarioItem;
  conflicts?: RestructureConflicts;
  onOpenAddDept: () => void;
  onOpenMerge: () => void;
  onOpenSplit: () => void;
  onSubmitScenario: () => void;
  onApproveScenario: () => void;
  onRejectScenario: () => void;
  onExecuteScenario: () => void;
  isSubmitting?: boolean;
}

export function OrgWorkbenchToolbar({
  scenario,
  conflicts,
  onOpenAddDept,
  onOpenMerge,
  onOpenSplit,
  onSubmitScenario,
  onApproveScenario,
  onRejectScenario,
  onExecuteScenario,
  isSubmitting = false,
}: OrgWorkbenchToolbarProps) {
  const statusConfig = SCENARIO_STATUS_CONFIG[scenario.status] || {
    label: scenario.status,
    variant: "secondary" as const,
  };
  const isEditable =
    scenario.status === "DRAFT" ||
    scenario.status === "ANALYZING" ||
    scenario.status === "REJECTED";

  const criticalErrors = conflicts?.criticalCount || 0;
  const warnings = conflicts?.warningCount || 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card shadow-xs">
      {/* Vùng trái: Tên kịch bản + Badge trạng thái + Thống kê lỗi */}
      <div className="flex flex-wrap items-center gap-2.5">
        <Badge variant={statusConfig.variant} className={`text-xs ${statusConfig.className || ""}`}>
          {statusConfig.label}
        </Badge>

        <span className="text-xs font-mono font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
          {scenario.code}
        </span>

        {criticalErrors > 0 && (
          <Badge variant="destructive" className="text-xs flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{criticalErrors} Lỗi nghiêm trọng</span>
          </Badge>
        )}

        {warnings > 0 && (
          <Badge
            variant="outline"
            className="text-xs border-amber-500/30 text-amber-600 bg-amber-50/50 flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            <span>{warnings} Cảnh báo</span>
          </Badge>
        )}
      </div>

      {/* Vùng phải: Các nút thao tác tái cấu trúc & Điều hướng */}
      <div className="flex flex-wrap items-center gap-2">
        {isEditable && (
          <>
            <Button variant="outline" size="sm" onClick={onOpenAddDept} className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1 text-primary" />
              <span>Thêm đơn vị</span>
            </Button>

            <Button variant="outline" size="sm" onClick={onOpenMerge} className="h-8 text-xs">
              <GitMerge className="h-3.5 w-3.5 mr-1 text-purple-600" />
              <span>Sáp nhập</span>
            </Button>

            <Button variant="outline" size="sm" onClick={onOpenSplit} className="h-8 text-xs">
              <Split className="h-3.5 w-3.5 mr-1 text-blue-600" />
              <span>Chia tách</span>
            </Button>

            <Button
              size="sm"
              onClick={onSubmitScenario}
              disabled={isSubmitting || criticalErrors > 0}
              className="h-8 text-xs bg-primary hover:bg-primary/90"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              <span>Trình phê duyệt</span>
            </Button>
          </>
        )}

        {scenario.status === "SUBMITTED" && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onRejectScenario}
              className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              <span>Từ chối</span>
            </Button>

            <Button
              size="sm"
              onClick={onApproveScenario}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span>Phê duyệt</span>
            </Button>
          </>
        )}

        {scenario.status === "APPROVED" && (
          <Button
            size="sm"
            onClick={onExecuteScenario}
            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
            <span>Thực thi áp dụng vào sơ đồ Live</span>
          </Button>
        )}

        <Button variant="outline" size="sm" asChild className="h-8 text-xs">
          <Link href={`/org-restructuring/scenarios/${scenario.id}/comparison`}>
            <GitCompare className="h-3.5 w-3.5 mr-1 text-primary" />
            <span>Xem đối chiếu Diff</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

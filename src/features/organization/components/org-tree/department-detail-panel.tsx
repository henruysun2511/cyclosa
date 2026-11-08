"use client";

import React from "react";
import {
  Building2,
  Users,
  ArrowRightLeft,
  Trash2,
  Pencil,
  Plus,
  Tag,
  ShieldCheck,
  Calendar,
  Lock,
  Unlock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { cn } from "@/lib/utils";
import type { Department, DepartmentNode } from "../../types/department.types";

interface DepartmentDetailPanelProps {
  selectedDept: Department | DepartmentNode | null;
  onEdit: (dept: Department | DepartmentNode) => void;
  onMove: (dept: Department | DepartmentNode) => void;
  onDissolve: (dept: Department | DepartmentNode) => void;
  onAddSubDepartment: (parentId: string) => void;
  className?: string;
}

export function DepartmentDetailPanel({
  selectedDept,
  onEdit,
  onMove,
  onDissolve,
  onAddSubDepartment,
  className,
}: DepartmentDetailPanelProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);

  if (!selectedDept) {
    return (
      <div
        className={cn(
          "table-card p-6 flex flex-col items-center justify-center text-center text-muted-foreground min-h-[360px]",
          className
        )}
      >
        <Building2 className="h-10 w-10 text-slate-300 stroke-[1.5] mb-2" />
        <p className="text-sm font-medium text-foreground">Chưa chọn đơn vị</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[220px]">
          Chọn một phòng ban trên cây cơ cấu để xem chi tiết thuộc tính và tác vụ
        </p>
      </div>
    );
  }

  const isInherited = Boolean(selectedDept.isPermissionInherited);

  return (
    <div className={cn("table-card p-5 space-y-4", className)}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h2 className="text-base font-bold text-foreground">
          Thông tin đơn vị
        </h2>
        <span className="text-xs font-mono font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded">
          {selectedDept.code}
        </span>
      </div>

      {/* ── Properties ─────────────────────────────────────────────── */}
      <div className="space-y-3.5 text-xs">
        <div>
          <p className="text-muted-foreground">Tên phòng ban / bộ phận:</p>
          <p className="font-semibold text-foreground text-sm mt-0.5">
            {selectedDept.name}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Người đứng đầu / Quản lý:</p>
          <p className="font-medium text-foreground mt-0.5">
            {selectedDept.managerEmployeeId
              ? `Mã NV: ${selectedDept.managerEmployeeId}`
              : "Chưa bổ nhiệm"}
          </p>
        </div>

        {"costCenterName" in selectedDept && selectedDept.costCenterName && (
          <div>
            <p className="text-muted-foreground">Trung tâm chi phí (Cost Center):</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-mono text-xs font-medium text-foreground">
                {selectedDept.costCenterName}
              </span>
            </div>
          </div>
        )}

        <div>
          <p className="text-muted-foreground">Quy mô nhân sự trực thuộc:</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="font-semibold text-foreground">
              {"memberCount" in selectedDept
                ? selectedDept.memberCount || 0
                : 0}{" "}
              nhân sự
            </span>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground">Mốc thời gian hiệu lực:</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-mono text-xs font-medium text-foreground">
              {selectedDept.effectiveFrom
                ? new Date(selectedDept.effectiveFrom).toLocaleDateString("vi-VN")
                : "Hiện hành"}
            </span>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground">Cơ chế kế thừa phân quyền:</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge
              variant="outline"
              className={cn(
                "text-2xs font-normal",
                isInherited
                  ? "text-emerald-700 bg-emerald-50/50 border-emerald-200"
                  : "text-slate-500"
              )}
            >
              {isInherited ? (
                <Unlock className="h-3 w-3 mr-1 text-emerald-600" />
              ) : (
                <Lock className="h-3 w-3 mr-1 text-slate-400" />
              )}
              {isInherited ? "Kế thừa quyền xuống cấp dưới" : "Quyền hạn độc lập"}
            </Badge>
          </div>
        </div>

        {/* ── Tác vụ đơn vị (Unit Actions) ─────────────────────────── */}
        <div className="pt-4 border-t border-border space-y-2">
          <p className="font-semibold text-foreground">Tác vụ đơn vị:</p>

          {canManage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={() => onAddSubDepartment(selectedDept.id)}
            >
              <Plus className="h-3.5 w-3.5 mr-2 text-primary" />
              <span>Thêm đơn vị trực thuộc</span>
            </Button>
          )}

          {canManage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={() => onEdit(selectedDept)}
            >
              <Pencil className="h-3.5 w-3.5 mr-2 text-slate-600" />
              <span>Chỉnh sửa thông tin đơn vị</span>
            </Button>
          )}

          {canManage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8"
              onClick={() => onMove(selectedDept)}
            >
              <ArrowRightLeft className="h-3.5 w-3.5 mr-2 text-primary" />
              <span>Điều chuyển nhánh cây (Move)</span>
            </Button>
          )}

          {canManage && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-xs h-8 text-destructive hover:bg-red-50 hover:text-destructive border-red-200"
              onClick={() => onDissolve(selectedDept)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              <span>Giải thể đơn vị (Dissolve)</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}


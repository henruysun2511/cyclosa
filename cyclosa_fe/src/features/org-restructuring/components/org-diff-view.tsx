"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Building2, Users, GitCompare, CheckCircle2 } from "lucide-react";
import type { RestructureDiff } from "../types/org-restructuring.types";
import { DEPT_SCENARIO_STATUS_CONFIG } from "../constants/org-restructuring.constants";
import { Skeleton } from "@/components/ui/skeleton";

interface OrgDiffViewProps {
  diffData?: RestructureDiff;
  isLoading?: boolean;
}

export function OrgDiffView({ diffData, isLoading = false }: OrgDiffViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const deptDiffs = diffData?.departmentDiffs || [];
  const empDiffs = diffData?.employeeDiffs || [];

  return (
    <div className="space-y-6">
      {/* 1. Biến động Cơ cấu Phòng ban */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Biến động Cơ cấu Phòng ban ({deptDiffs.length})
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            As-Is vs To-Be
          </Badge>
        </div>

        {deptDiffs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p>Không có sự thay đổi nào đối với cơ cấu phòng ban so với thực tế.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-transparent">
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="text-xs font-semibold">Phòng ban</TableHead>
                <TableHead className="text-xs font-semibold">Hình thức biến động</TableHead>
                <TableHead className="text-xs font-semibold">Cấp trên quản lý</TableHead>
                <TableHead className="text-xs font-semibold">Ghi chú phương án</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deptDiffs.map((d, idx) => {
                const config = (DEPT_SCENARIO_STATUS_CONFIG as any)[d.changeType] || {
                  label: d.changeType,
                  badgeClass: "bg-slate-100 text-slate-700",
                };
                return (
                  <TableRow key={d.departmentId} className="hover:bg-muted/40">
                    <TableCell className="text-center text-xs font-medium text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-sm text-foreground">{d.name}</div>
                      <span className="text-[11px] font-mono text-muted-foreground">{d.code}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${config.badgeClass}`}
                      >
                        {config.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="text-muted-foreground line-through">
                          {d.oldParentName || "Root"}
                        </span>
                        <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                        <span className="font-medium text-foreground">{d.newParentName || "Root"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">{d.details || "—"}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* 2. Biến động Phân công Nhân sự */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-card/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Biến động Điều chuyển & Bổ nhiệm Nhân sự ({empDiffs.length})
            </h3>
          </div>
          <Badge variant="outline" className="text-xs">
            Chi tiết luân chuyển
          </Badge>
        </div>

        {empDiffs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground flex flex-col items-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
            <p>Toàn bộ nhân sự giữ nguyên vị trí công tác hiện tại.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80 dark:bg-slate-900/50 hover:bg-transparent">
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="text-xs font-semibold">Nhân viên</TableHead>
                <TableHead className="text-xs font-semibold">Hình thức biến động</TableHead>
                <TableHead className="text-xs font-semibold">Đơn vị công tác</TableHead>
                <TableHead className="text-xs font-semibold">Chức danh đảm nhiệm</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empDiffs.map((e, idx) => (
                <TableRow key={e.employeeId} className="hover:bg-muted/40">
                  <TableCell className="text-center text-xs font-medium text-muted-foreground">
                    {idx + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-sm text-foreground">{e.employeeName}</div>
                    <span className="text-[11px] font-mono text-primary">{e.employeeCode}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {e.changeType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground line-through">
                        {e.oldDepartmentName}
                      </span>
                      <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{e.newDepartmentName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground line-through">
                        {e.oldJobTitleName || "N/A"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{e.newJobTitleName || "N/A"}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

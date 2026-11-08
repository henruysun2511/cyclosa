"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Award,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetAllJobTitlesQuery,
  useDeleteJobTitleMutation,
} from "../../api/job-title-api";
import {
  useGetAllJobLevelsQuery,
  useDeleteJobLevelMutation,
} from "../../api/job-level-api";
import { ConfirmDialog } from "@/components/common/confirm-dialog";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { JobTitle } from "../../types/job-title.types";
import type { JobLevel } from "../../types/job-level.types";

interface OrgJobMatrixViewProps {
  companyId: string;
  onOpenCreateJobTitle: () => void;
  onOpenCreateJobLevel: () => void;
  onOpenEditJobTitle: (jt: JobTitle) => void;
  onOpenEditJobLevel: (jl: JobLevel) => void;
  className?: string;
}

export function OrgJobMatrixView({
  companyId,
  onOpenCreateJobTitle,
  onOpenCreateJobLevel,
  onOpenEditJobTitle,
  onOpenEditJobLevel,
  className,
}: OrgJobMatrixViewProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);

  const [deleteTarget, setDeleteTarget] = useState<{
    type: "jobTitle" | "jobLevel";
    id: string;
    name: string;
  } | null>(null);

  const { data: jobTitles = [], isLoading: isTitlesLoading } = useGetAllJobTitlesQuery(companyId);
  const { data: jobLevels = [], isLoading: isLevelsLoading } = useGetAllJobLevelsQuery(companyId);

  const [deleteJobTitle] = useDeleteJobTitleMutation();
  const [deleteJobLevel] = useDeleteJobLevelMutation();

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "jobTitle") {
        await deleteJobTitle(deleteTarget.id).unwrap();
        toast.success(`Đã xóa chức danh ${deleteTarget.name}`);
      } else {
        await deleteJobLevel(deleteTarget.id).unwrap();
        toast.success(`Đã xóa cấp bậc ${deleteTarget.name}`);
      }
    } catch {
      toast.error("Thao tác thất bại, vui lòng kiểm tra ràng buộc nhân sự!");
    } finally {
      setDeleteTarget(null);
    }
  };

  const isLoading = isTitlesLoading || isLevelsLoading;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        Đang nạp dữ liệu Vị trí việc làm & Cấp bậc...
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Dimension Sub-bar */}
      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-primary" />
            <span>Danh mục Vị trí việc làm & Cấp bậc (F-C04)</span>
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {jobTitles.length} chức danh · {jobLevels.length} thang cấp bậc phẳng
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCreateJobLevel}
              className="h-8 text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm cấp bậc</span>
            </Button>
            <Button
              size="sm"
              onClick={onOpenCreateJobTitle}
              className="h-8 text-xs gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm chức danh</span>
            </Button>
          </div>
        )}
      </div>

      {/* Grid: 2 bảng Chức danh & Cấp bậc */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Cột Trái: Chức danh (Job Titles) */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-primary" />
              <span>Chức danh nghề nghiệp</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {jobTitles.length} vị trí
            </span>
          </div>

          <div className="space-y-1.5">
            {jobTitles.map((jt) => (
              <div
                key={jt.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-4 h-4 rounded-xs bg-slate-200 text-slate-600 flex items-center justify-center font-mono text-[9px] font-bold shrink-0">
                    ▪
                  </span>
                  <div className="truncate">
                    <span className="font-medium text-slate-800">{jt.name}</span>
                    <span className="font-mono text-[10.5px] text-slate-400 ml-1.5">
                      {jt.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {jt.description && (
                    <span className="text-[10.5px] text-slate-400 hidden lg:inline max-w-[140px] truncate">
                      {jt.description}
                    </span>
                  )}

                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="w-3 h-3 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpenEditJobTitle(jt)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteTarget({
                              type: "jobTitle",
                              id: jt.id,
                              name: jt.name,
                            })
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          <span>Xóa chức danh</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột Phải: Cấp bậc (Job Levels) */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <span className="font-mono text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3 h-3 text-amber-600" />
              <span>Thang Cấp bậc & Thứ hạng</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {jobLevels.length} cấp độ
            </span>
          </div>

          <div className="space-y-1.5">
            {jobLevels.map((jl) => (
              <div
                key={jl.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="w-5 h-5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                    L{jl.rankOrder}
                  </span>
                  <div className="truncate">
                    <span className="font-medium text-slate-800">{jl.name}</span>
                    <span className="font-mono text-[10.5px] text-slate-400 ml-1.5">
                      {jl.code}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {canManage && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="w-3 h-3 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onOpenEditJobLevel(jl)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" />
                          <span>Chỉnh sửa</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setDeleteTarget({
                              type: "jobLevel",
                              id: jl.id,
                              name: jl.name,
                            })
                          }
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-2" />
                          <span>Xóa cấp bậc</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Xác nhận xóa ${deleteTarget?.type === "jobTitle" ? "chức danh" : "cấp bậc"}`}
        description={`Bạn có chắc chắn muốn xóa ${deleteTarget?.name}? Hành động này có thể ảnh hưởng đến hồ sơ nhân sự đang giữ chức danh này.`}
        confirmLabel="Xác nhận xóa"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

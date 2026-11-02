"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Calendar,
  History,
  Layers,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import {
  useGetDepartmentHistoryQuery,
  useUpdatePermissionInheritanceMutation,
} from "../../api/organization-api";
import type { Department } from "../../types/organization.types";

interface DepartmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onEdit?: (dept: Department) => void;
  onMove?: (dept: Department) => void;
}

export function DepartmentDetailDialog({
  open,
  onOpenChange,
  department,
  onEdit,
  onMove,
}: DepartmentDetailDialogProps) {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.ORG.MANAGE);

  const { data: history = [], isFetching } = useGetDepartmentHistoryQuery(
    department?.id || "",
    { skip: !department || !open }
  );

  const [updateInheritance, { isLoading: isUpdatingInheritance }] =
    useUpdatePermissionInheritanceMutation();

  if (!department) return null;

  const handleToggleInheritance = async (checked: boolean) => {
    try {
      await updateInheritance({
        id: department.id,
        isPermissionInherited: checked,
      }).unwrap();
      toast.success(
        checked
          ? "Đã bật kế thừa phân quyền xuống đơn vị con"
          : "Đã tắt kế thừa phân quyền"
      );
    } catch {
      toast.error("Không thể cập nhật cờ kế thừa quyền!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">
              {department.name}
            </DialogTitle>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="outline" className="font-mono text-xs">
              {department.code}
            </Badge>
            <Badge
              variant={department.isActive ? "default" : "secondary"}
              className={department.isActive ? "bg-emerald-600" : ""}
            >
              {department.isActive ? "Đang hoạt động" : "Đã giải thể"}
            </Badge>
          </div>
        </DialogHeader>

        {/* Thông tin tổng quan */}
        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border text-sm">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Đơn vị cấp trên:</span>
            <span className="font-medium flex items-center gap-1.5 text-foreground">
              <Layers className="h-4 w-4 text-slate-400" />
              {department.parentDepartmentName || "Là đơn vị gốc (Root)"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Trung tâm chi phí:</span>
            <span className="font-medium flex items-center gap-1.5 text-foreground">
              <Tag className="h-4 w-4 text-slate-400" />
              {department.costCenterName || "Chưa thiết lập"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Ngày hiệu lực áp dụng:</span>
            <span className="font-medium flex items-center gap-1.5 text-foreground">
              <Calendar className="h-4 w-4 text-slate-400" />
              {department.effectiveFrom || "Chưa xác định"}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-muted-foreground block">Kế thừa phân quyền:</span>
            <div className="flex items-center gap-2 pt-0.5">
              <Switch
                checked={department.isPermissionInherited}
                onCheckedChange={handleToggleInheritance}
                disabled={isUpdatingInheritance || !canManage}
              />
              <span className="text-xs text-muted-foreground">
                {department.isPermissionInherited ? "Đang bật" : "Đã tắt"}
                {!canManage && " (Chỉ đọc)"}
              </span>
            </div>
          </div>
        </div>

        {/* Lịch sử phiên bản hiệu lực */}
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <History className="h-4 w-4 text-primary" />
            Lịch sử phiên bản cơ cấu ({history.length})
          </div>

          {isFetching ? (
            <div className="text-xs text-muted-foreground py-4 text-center">
              Đang tải lịch sử phiên bản...
            </div>
          ) : history.length === 0 ? (
            <div className="text-xs text-muted-foreground py-2 italic">
              Chưa có phiên bản thay đổi nào được ghi nhận.
            </div>
          ) : (
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {history.map((ver, idx) => (
                <div key={ver.id} className="relative">
                  <span
                    className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                      idx === 0 ? "bg-primary ring-2 ring-primary/20" : "bg-slate-300"
                    }`}
                  />
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">
                        {ver.name}
                      </span>
                      <Badge variant="outline" className="font-mono text-2xs">
                        Hiệu lực từ: {ver.effectiveFrom}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 pt-1">
                      <span>
                        Trực thuộc:{" "}
                        <strong className="text-foreground">
                          {ver.parentDepartmentName || "Gốc"}
                        </strong>
                      </span>
                      <span>
                        TT chi phí:{" "}
                        <strong className="text-foreground">
                          {ver.costCenterName || "Không"}
                        </strong>
                      </span>
                      <span>
                        Kế thừa quyền:{" "}
                        <strong className="text-foreground">
                          {ver.isPermissionInherited ? "Có" : "Không"}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 flex justify-between sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onMove?.(department);
              }}
            >
              Điều chuyển vị trí
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onOpenChange(false);
                onEdit?.(department);
              }}
            >
              Chỉnh sửa
            </Button>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


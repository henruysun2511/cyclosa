"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  useMoveDepartmentMutation,
  useLazyCalculateMoveImpactQuery,
  useGetDepartmentTreeQuery,
} from "../../api/organization-api";
import type { Department, DepartmentNode } from "../../types/organization.types";

interface DepartmentMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  companyId: string;
  onSuccess?: () => void;
}

export function DepartmentMoveDialog({
  open,
  onOpenChange,
  department,
  companyId,
  onSuccess,
}: DepartmentMoveDialogProps) {
  const [targetParentId, setTargetParentId] = useState<string | "none">("none");
  const [effectiveFrom, setEffectiveFrom] = useState(
    new Date().toISOString().split("T")[0]
  );

  const { data: treeNodes = [] } = useGetDepartmentTreeQuery(
    { companyId },
    { skip: !companyId }
  );

  const [triggerImpact, { data: impact, isFetching: isCalculatingImpact }] =
    useLazyCalculateMoveImpactQuery();

  const [moveDepartment, { isLoading: isMoving }] = useMoveDepartmentMutation();

  // Flatten departments excluding itself
  const flattenDepartments = (nodes: DepartmentNode[]): { id: string; name: string; code: string }[] => {
    let result: { id: string; name: string; code: string }[] = [];
    nodes.forEach((n) => {
      result.push({ id: n.id, name: n.name, code: n.code });
      if (n.children && n.children.length > 0) {
        result = result.concat(flattenDepartments(n.children));
      }
    });
    return result;
  };

  const availableParents = flattenDepartments(treeNodes).filter(
    (d) => department && d.id !== department.id
  );

  useEffect(() => {
    if (department && open) {
      setTargetParentId(department.parentDepartmentId || "none");
      setEffectiveFrom(new Date().toISOString().split("T")[0]);
    }
  }, [department, open]);

  // Recalculate impact when target parent changes
  useEffect(() => {
    if (department && open) {
      const targetId = targetParentId === "none" ? null : targetParentId;
      triggerImpact({
        departmentId: department.id,
        targetParentId: targetId,
      });
    }
  }, [department, targetParentId, open, triggerImpact]);

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department) return;

    if (impact && !impact.isValid) {
      toast.error(impact.invalidReason || "Không thể di chuyển đến vị trí này!");
      return;
    }

    try {
      await moveDepartment({
        id: department.id,
        body: {
          newParentDepartmentId: targetParentId === "none" ? null : targetParentId,
          effectiveFrom,
        },
      }).unwrap();
      toast.success("Điều chuyển phòng ban thành công!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi khi điều chuyển phòng ban!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Điều chuyển Vị trí Cơ cấu Phòng ban
          </DialogTitle>
        </DialogHeader>

        {department && (
          <form onSubmit={handleMove} className="space-y-4 py-2">
            {/* Đơn vị di chuyển */}
            <div className="p-3 bg-slate-50 rounded-lg border border-border">
              <span className="text-xs text-muted-foreground block">Đơn vị di chuyển:</span>
              <span className="text-sm font-semibold text-foreground">
                {department.name} ({department.code})
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                Cấp trên hiện tại: {department.parentDepartmentName || "Đơn vị gốc (Root)"}
              </span>
            </div>

            {/* Chọn đơn vị cấp trên mới */}
            <div className="space-y-1.5">
              <Label htmlFor="target-parent">Chuyển sang làm cấp dưới của *</Label>
              <Select value={targetParentId} onValueChange={setTargetParentId}>
                <SelectTrigger id="target-parent">
                  <SelectValue placeholder="Chọn vị trí mới trong cây cơ cấu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- Đưa lên làm đơn vị cấp cao nhất (Root) --</SelectItem>
                  {availableParents.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ngày hiệu lực */}
            <div className="space-y-1.5">
              <Label htmlFor="move-effective">Ngày bắt đầu áp dụng vị trí mới *</Label>
              <Input
                id="move-effective"
                type="date"
                value={effectiveFrom}
                onChange={(e) => setEffectiveFrom(e.target.value)}
                required
              />
            </div>

            {/* Phân tích tác động & Cảnh báo chu trình (Cycle Detection) */}
            {isCalculatingImpact ? (
              <div className="text-xs text-muted-foreground py-2 text-center animate-pulse">
                Đang phân tích tác động cơ cấu...
              </div>
            ) : impact ? (
              impact.isValid === false ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Phát hiện vòng lặp phân cấp</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    {impact.invalidReason}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-amber-200 bg-amber-50/50 text-amber-900">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Xem trước tác động di dời</AlertTitle>
                  <AlertDescription className="text-xs text-amber-700 mt-1 space-y-1">
                    <p>
                      • Có <strong>{impact.affectedSubDepartmentCount} đơn vị cấp dưới</strong> sẽ bị di chuyển cùng theo nhánh này.
                    </p>
                    <p>
                      • Các nhánh con sẽ tự động cập nhật đường dẫn phả hệ từ ngày hiệu lực đã chọn.
                    </p>
                  </AlertDescription>
                </Alert>
              )
            ) : (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertTitle>Cơ cấu hợp lệ</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                  Vị trí mới không gây xung đột hoặc tạo vòng lặp phân cấp.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isMoving}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isMoving || (impact && !impact.isValid)}
              >
                {isMoving ? "Đang điều chuyển..." : "Xác nhận điều chuyển"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


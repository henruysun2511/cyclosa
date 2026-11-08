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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useGetAllCostCentersQuery,
  useGetDepartmentTreeQuery,
} from "../../api/organization-api";
import type { Department, DepartmentNode } from "../../types/organization.types";

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department?: Department | null;
  parentDepartmentId?: string | null;
  companyId: string;
  onSuccess?: () => void;
}

export function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  parentDepartmentId,
  companyId,
  onSuccess,
}: DepartmentFormDialogProps) {
  const isEditing = Boolean(department);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | "none">("none");
  const [costCenterId, setCostCenterId] = useState<string | "none">("none");
  const [effectiveFrom, setEffectiveFrom] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isPermissionInherited, setIsPermissionInherited] = useState(true);

  // Queries
  const { data: costCenters = [] } = useGetAllCostCentersQuery(companyId, {
    skip: !companyId,
  });
  const { data: treeNodes = [] } = useGetDepartmentTreeQuery(
    { companyId },
    { skip: !companyId }
  );

  // Mutations
  const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const isLoading = isCreating || isUpdating;

  // Flatten tree for parent selection
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
    (d) => !department || d.id !== department.id
  );

  useEffect(() => {
    if (department) {
      setCode(department.code);
      setName(department.name);
      setParentId(department.parentDepartmentId || "none");
      setCostCenterId(department.costCenterId || "none");
      setEffectiveFrom(
        department.effectiveFrom || new Date().toISOString().split("T")[0]
      );
      setIsPermissionInherited(department.isPermissionInherited ?? true);
    } else {
      setCode("");
      setName("");
      setParentId(parentDepartmentId || "none");
      setCostCenterId("none");
      setEffectiveFrom(new Date().toISOString().split("T")[0]);
      setIsPermissionInherited(true);
    }
  }, [department, parentDepartmentId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên phòng ban");
      return;
    }
    if (!isEditing && !code.trim()) {
      toast.error("Vui lòng nhập mã phòng ban");
      return;
    }
    if (!effectiveFrom) {
      toast.error("Vui lòng chọn ngày hiệu lực");
      return;
    }

    try {
      if (isEditing && department) {
        await updateDepartment({
          id: department.id,
          body: {
            name: name.trim(),
            parentDepartmentId: parentId === "none" ? null : parentId,
            costCenterId: costCenterId === "none" ? null : costCenterId,
            effectiveFrom,
            isPermissionInherited,
          },
        }).unwrap();
        toast.success("Cập nhật phòng ban thành công!");
      } else {
        await createDepartment({
          companyId,
          code: code.trim().toUpperCase(),
          name: name.trim(),
          parentDepartmentId: parentId === "none" ? null : parentId,
          costCenterId: costCenterId === "none" ? null : costCenterId,
          effectiveFrom,
          isPermissionInherited,
        }).unwrap();
        toast.success("Tạo phòng ban mới thành công!");
      }
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Đã xảy ra lỗi, vui lòng thử lại!";
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Chỉnh sửa Phòng ban" : "Thêm mới Phòng ban & Đơn vị"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Mã & Tên phòng ban */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5 sm:col-span-1">
              <Label htmlFor="dept-code">Mã đơn vị *</Label>
              <Input
                id="dept-code"
                placeholder="VD: DEPT_TECH"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isEditing}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="dept-name">Tên phòng ban / đơn vị *</Label>
              <Input
                id="dept-name"
                placeholder="VD: Phòng Phát triển Phần mềm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Đơn vị cấp trên */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-parent">Đơn vị cấp trên (Trực thuộc)</Label>
            <Select value={parentId} onValueChange={(val) => setParentId(val || "none")}>
              <SelectTrigger id="dept-parent">
                <SelectValue placeholder="Chọn đơn vị cấp trên">
                  {(val: string) => {
                    if (!val || val === "none") {
                      return "-- Là đơn vị cấp cao nhất (Root) --";
                    }
                    const parent = availableParents.find((p) => p.id === val);
                    return parent ? `${parent.name} (${parent.code})` : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" label="-- Là đơn vị cấp cao nhất (Root) --">
                  -- Là đơn vị cấp cao nhất (Root) --
                </SelectItem>
                {availableParents.map((p) => (
                  <SelectItem key={p.id} value={p.id} label={`${p.name} (${p.code})`}>
                    {p.name} ({p.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trung tâm chi phí */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-cc">Trung tâm chi phí hạch toán</Label>
            <Select value={costCenterId} onValueChange={(val) => setCostCenterId(val || "none")}>
              <SelectTrigger id="dept-cc">
                <SelectValue placeholder="Chọn trung tâm chi phí">
                  {(val: string) => {
                    if (!val || val === "none") {
                      return "-- Không phân bổ / Tự do --";
                    }
                    const cc = costCenters.find((c) => c.id === val);
                    return cc ? `${cc.name} (${cc.code})` : val;
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" label="-- Không phân bổ / Tự do --">
                  -- Không phân bổ / Tự do --
                </SelectItem>
                {costCenters.map((cc) => (
                  <SelectItem key={cc.id} value={cc.id} label={`${cc.name} (${cc.code})`}>
                    {cc.name} ({cc.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ngày hiệu lực */}
          <div className="space-y-1.5">
            <Label htmlFor="dept-effective">Ngày hiệu lực áp dụng *</Label>
            <Input
              id="dept-effective"
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {isEditing
                ? "Nếu chọn ngày mới, hệ thống sẽ lưu vết lịch sử cơ cấu phiên bản mới."
                : "Ngày bắt đầu áp dụng cơ cấu đơn vị này vào hệ thống."}
            </p>
          </div>

          {/* Toggle Kế thừa quyền */}
          <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-slate-50/50">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Kế thừa phân quyền</Label>
              <p className="text-xs text-muted-foreground">
                Cho phép các phòng ban con trực thuộc tự động kế thừa quyền quản trị
              </p>
            </div>
            <Switch
              checked={isPermissionInherited}
              onCheckedChange={setIsPermissionInherited}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo phòng ban"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


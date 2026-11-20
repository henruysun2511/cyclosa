"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useDissolveDepartmentMutation } from "../../api/organization-api";
import type { Department } from "../../types/organization.types";

interface DepartmentDissolveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSuccess?: () => void;
}

export function DepartmentDissolveDialog({
  open,
  onOpenChange,
  department,
  onSuccess,
}: DepartmentDissolveDialogProps) {
  const [dissolvedDate, setDissolvedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dissolveDepartment, { isLoading }] = useDissolveDepartmentMutation();

  if (!department) return null;

  const handleDissolve = async () => {
    try {
      await dissolveDepartment({
        id: department.id,
        dissolvedDate,
      }).unwrap();
      toast.success(`Đã giải thể phòng ban "${department.name}" thành công!`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Không thể giải thể phòng ban này!";
      toast.error(errorMsg);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Xác nhận giải thể phòng ban
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2 text-sm">
            <p>
              Bạn có chắc chắn muốn giải thể phòng ban{" "}
              <strong className="text-foreground">{department.name} ({department.code})</strong>?
            </p>
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded border border-amber-200">
              ⚠️ Lưu ý: Hệ thống chỉ cho phép giải thể khi phòng ban không còn bất kỳ đơn vị cấp con nào trực thuộc.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-1.5 py-2">
          <Label htmlFor="dissolve-date">Ngày giải thể chính thức *</Label>
          <Input
            id="dissolve-date"
            type="date"
            value={dissolvedDate}
            onChange={(e) => setDissolvedDate(e.target.value)}
            required
          />
        </div>

        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel disabled={isLoading}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDissolve}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận giải thể"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


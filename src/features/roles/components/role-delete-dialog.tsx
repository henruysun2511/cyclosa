"use client";

import React from "react";
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
import { AlertCircle, Trash2, Loader2 } from "lucide-react";
import { useDeleteRoleMutation } from "../api/role-api";
import { toast } from "sonner";
import type { RoleResponse } from "../types/role.types";

interface RoleDeleteDialogProps {
  role: RoleResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleDeleteDialog({
  role,
  open,
  onOpenChange,
}: RoleDeleteDialogProps) {
  const [deleteRole, { isLoading }] = useDeleteRoleMutation();

  if (!role) return null;

  const handleDelete = async () => {
    try {
      const res = await deleteRole(role.id).unwrap();
      if (res.success) {
        toast.success(`Đã xóa vai trò "${role.name}" thành công.`);
        onOpenChange(false);
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể xóa vai trò. Vui lòng thử lại sau.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <AlertDialogTitle className="text-base font-semibold">
                Xác nhận xóa vai trò
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground mt-0.5">
                Hành động này sẽ thực hiện xóa mềm vai trò khỏi hệ thống.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-3 text-sm text-foreground space-y-2">
          <p>
            Bạn có chắc chắn muốn xóa vai trò{" "}
            <span className="font-semibold text-destructive">{role.name}</span> (Mã:{" "}
            <code className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs">
              {role.code}
            </code>
            )?
          </p>
          <p className="text-xs text-muted-foreground bg-muted/50 p-2.5 rounded-lg border">
            ⚠️ Lưu ý: Chỉ các vai trò tùy chỉnh chưa được gán cho nhân viên nào mới có thể xóa thành công.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            variant="destructive"
            className="gap-1.5"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            <span>Xác nhận xóa</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

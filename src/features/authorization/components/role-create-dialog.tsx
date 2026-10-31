"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
  roleCreateDialogSchema,
  type RoleCreateDialogValues,
} from "../schemas/role.schema";
import type { RoleResponse } from "../types/role.types";

export interface RoleCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: RoleResponse[];
  defaultCloneRoleId?: string;
  onSubmit: (data: RoleCreateDialogValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function RoleCreateDialog({
  open,
  onOpenChange,
  roles,
  defaultCloneRoleId = "none",
  onSubmit,
  isSubmitting = false,
}: RoleCreateDialogProps) {
  const form = useForm<RoleCreateDialogValues>({
    resolver: zodResolver(roleCreateDialogSchema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      cloneFromRoleId: defaultCloneRoleId || "none",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: "",
        code: "",
        description: "",
        cloneFromRoleId: defaultCloneRoleId || "none",
      });
    }
  }, [open, defaultCloneRoleId, form]);

  const handleFormSubmit = async (values: RoleCreateDialogValues) => {
    await onSubmit({
      ...values,
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      cloneFromRoleId: values.cloneFromRoleId !== "none" ? values.cloneFromRoleId : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Thêm Vai trò Mới vào Hệ thống
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-3 py-2 text-xs">
          {/* Tên vai trò */}
          <div className="space-y-1">
            <Label htmlFor="role-name" className="font-medium text-foreground block">
              Tên vai trò <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role-name"
              placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
              disabled={isSubmitting}
              className="h-8 text-xs"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mã định danh vai trò */}
          <div className="space-y-1">
            <Label htmlFor="role-code" className="font-medium text-foreground block">
              Mã định danh vai trò (Role Code) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="role-code"
              placeholder="VD: TECH_LEAD"
              disabled={isSubmitting}
              className="h-8 text-xs font-mono uppercase"
              {...form.register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
            {form.formState.errors.code && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.code.message}
              </p>
            )}
            <p className="text-[10px] text-muted-foreground">
              Chỉ bao gồm chữ in hoa, số và dấu gạch dưới (_).
            </p>
          </div>

          {/* Kế thừa quyền */}
          <div className="space-y-1">
            <Label htmlFor="role-clone" className="font-medium text-foreground block">
              Kế thừa cấu hình quyền ban đầu từ
            </Label>
            <select
              id="role-clone"
              disabled={isSubmitting}
              className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
              {...form.register("cloneFromRoleId")}
            >
              <option value="none">-- Không sao chép (để trống) --</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.code})
                </option>
              ))}
            </select>
          </div>

          {/* Mô tả */}
          <div className="space-y-1">
            <Label htmlFor="role-desc" className="font-medium text-foreground block">
              Mô tả trách nhiệm & phạm vi
            </Label>
            <Textarea
              id="role-desc"
              rows={2}
              placeholder="Ghi chú tóm tắt trách nhiệm của vai trò này..."
              disabled={isSubmitting}
              className="w-full rounded-md border border-input bg-background p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-white gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Khởi tạo vai trò</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

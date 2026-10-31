"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShieldPlus, Edit3, Loader2, Save } from "lucide-react";
import {
  roleFormSchema,
  type RoleFormValues,
} from "../schemas/role.schema";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useLazyGetRolePermissionsQuery,
  useAssignRolePermissionsMutation,
} from "../api/role-api";
import { toast } from "sonner";
import type { RoleResponse, PermissionScopeItem } from "../types/role.types";

export interface RoleFormDialogProps {
  role: RoleResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles?: RoleResponse[];
  defaultCloneRoleId?: string;
  onSuccess?: (roleId: string) => void;
}

export function RoleFormDialog({
  role,
  open,
  onOpenChange,
  roles = [],
  defaultCloneRoleId = "none",
  onSuccess,
}: RoleFormDialogProps) {
  const isEditing = Boolean(role);

  const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
  const [updateRole, { isLoading: isUpdating }] = useUpdateRoleMutation();
  const [triggerGetPermissions] = useLazyGetRolePermissionsQuery();
  const [assignRolePermissions] = useAssignRolePermissionsMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      cloneFromRoleId: defaultCloneRoleId || "none",
    },
  });

  useEffect(() => {
    if (open) {
      if (role) {
        form.reset({
          code: role.code,
          name: role.name,
          description: role.description || "",
          cloneFromRoleId: "none",
        });
      } else {
        form.reset({
          code: "",
          name: "",
          description: "",
          cloneFromRoleId: defaultCloneRoleId || "none",
        });
      }
    }
  }, [open, role, defaultCloneRoleId, form]);

  const onSubmit = async (values: RoleFormValues) => {
    try {
      if (isEditing && role) {
        const res = await updateRole({
          roleId: role.id,
          body: {
            name: values.name.trim(),
            description: values.description?.trim() || undefined,
          },
        }).unwrap();

        if (res.success) {
          toast.success(`Đã cập nhật vai trò "${values.name}" thành công.`);
          onOpenChange(false);
          onSuccess?.(role.id);
        }
      } else {
        const res = await createRole({
          code: values.code.trim().toUpperCase(),
          name: values.name.trim(),
          description: values.description?.trim() || undefined,
        }).unwrap();

        if (res.success && res.data) {
          const newRoleId = res.data.id;

          // Nếu có chọn sao chép quyền từ vai trò mẫu
          if (values.cloneFromRoleId && values.cloneFromRoleId !== "none") {
            try {
              const permsRes = await triggerGetPermissions(values.cloneFromRoleId).unwrap();
              if (permsRes.success && permsRes.data && permsRes.data.length > 0) {
                const payload: PermissionScopeItem[] = permsRes.data.map((p) => ({
                  permissionId: p.permissionId,
                  dataScope: p.dataScope,
                }));
                await assignRolePermissions({
                  roleId: newRoleId,
                  body: { permissions: payload },
                }).unwrap();
              }
            } catch {
              // Bỏ qua lỗi clone quyền nếu có để không chặn quá trình tạo vai trò
            }
          }

          toast.success(`Đã tạo mới vai trò "${values.name}" thành công.`);
          onOpenChange(false);
          onSuccess?.(newRoleId);
        }
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(
        error.data?.message ||
          (isEditing
            ? "Không thể cập nhật vai trò. Vui lòng thử lại."
            : "Không thể tạo vai trò mới. Vui lòng thử lại.")
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              {isEditing ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <ShieldPlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                {isEditing ? "Chỉnh sửa Vai trò" : "Thêm Vai trò Mới"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {isEditing
                  ? `Cập nhật thông tin hiển thị cho vai trò ${role?.name}`
                  : "Định nghĩa một vai trò chức năng tùy chỉnh mới cho doanh nghiệp"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Tên vai trò */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Tên Vai trò <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
              disabled={isSubmitting}
              className="text-xs h-8"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mã vai trò */}
          <div className="space-y-1.5">
            <Label htmlFor="code" className="text-xs font-semibold">
              Mã Vai trò (Code) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              placeholder="VD: TECH_LEAD, STORE_MANAGER..."
              disabled={isEditing || isSubmitting}
              className="font-mono uppercase text-xs h-8"
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
            <p className="text-[11px] text-muted-foreground">
              {isEditing
                ? "Mã định danh vai trò không thể thay đổi sau khi tạo."
                : "Chỉ bao gồm chữ in hoa, số và dấu gạch dưới (_)."}
            </p>
          </div>

          {/* Kế thừa cấu hình quyền ban đầu từ vai trò mẫu (Chỉ hiển thị khi tạo mới) */}
          {!isEditing && roles.length > 0 && (
            <div className="space-y-1.5">
              <Label htmlFor="cloneFromRoleId" className="text-xs font-semibold">
                Kế thừa cấu hình quyền từ
              </Label>
              <select
                id="cloneFromRoleId"
                disabled={isSubmitting}
                className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background text-foreground focus:border-primary focus:outline-none"
                {...form.register("cloneFromRoleId")}
              >
                <option value="none">-- Không kế thừa (Bắt đầu với 0 quyền) --</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.code})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-muted-foreground">
                Tự động sao chép toàn bộ quyền chức năng và phạm vi dữ liệu từ vai trò đã chọn.
              </p>
            </div>
          )}

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold">
              Mô tả trách nhiệm & phạm vi
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả tóm tắt quyền hạn và trách nhiệm của vai trò này..."
              rows={3}
              disabled={isSubmitting}
              className="text-xs resize-none"
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
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isEditing ? "Lưu thay đổi" : "Khởi tạo vai trò"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

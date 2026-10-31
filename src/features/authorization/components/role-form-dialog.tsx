"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ShieldPlus, Edit3, Loader2, Save, Sparkles } from "lucide-react";
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
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl shadow-xl border-border bg-card">
        <DialogHeader className="space-y-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              {isEditing ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <ShieldPlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                {isEditing ? "Chỉnh sửa Vai trò" : "Thêm Vai trò Mới"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                {isEditing
                  ? `Cập nhật thông tin hiển thị và mô tả trách nhiệm cho vai trò ${role?.name}`
                  : "Khởi tạo vai trò người dùng tùy chỉnh mới và tùy chọn sao chép ma trận quyền ban đầu"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-3 pb-1 text-xs">
          {/* Tên vai trò */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Tên Vai trò hiển thị <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Trưởng Nhóm Dự Án (Tech Lead)"
              disabled={isSubmitting}
              className="h-9 text-xs rounded-lg border-input bg-background/50 hover:bg-background focus:bg-background transition-colors"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Mã vai trò */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="code" className="text-xs font-semibold text-foreground">
                Mã Vai trò (Code) <span className="text-destructive">*</span>
              </Label>
              {isEditing && (
                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                  Mã cố định
                </span>
              )}
            </div>
            <Input
              id="code"
              placeholder="VD: TECH_LEAD, STORE_MANAGER..."
              disabled={isEditing || isSubmitting}
              className="font-mono uppercase text-xs h-9 rounded-lg border-input bg-background/50 hover:bg-background focus:bg-background transition-colors"
              {...form.register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
            {form.formState.errors.code && (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.code.message}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground">
              {isEditing
                ? "Mã định danh vai trò được bảo vệ và không thể thay đổi sau khi tạo."
                : "Chỉ bao gồm chữ in hoa, số và dấu gạch dưới (_)."}
            </p>
          </div>

          {/* Kế thừa cấu hình quyền ban đầu từ vai trò mẫu (Chỉ hiển thị khi tạo mới) */}
          {!isEditing && roles.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cloneFromRoleId" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-primary" />
                  <span>Kế thừa cấu hình quyền từ</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">Tùy chọn</span>
              </div>

              <Controller
                control={form.control}
                name="cloneFromRoleId"
                render={({ field }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="w-full h-9 text-xs rounded-lg border-input bg-background/50 hover:bg-background transition-colors">
                      <SelectValue placeholder="Chọn vai trò kế thừa quyền..." />
                    </SelectTrigger>
                    <SelectContent className="text-xs max-h-60">
                      <SelectItem value="none" className="text-xs text-muted-foreground font-normal">
                        -- Không kế thừa (Bắt đầu với 0 quyền) --
                      </SelectItem>
                      {roles.map((r) => (
                        <SelectItem key={r.id} value={r.id} className="text-xs cursor-pointer">
                          <span className="font-medium text-foreground">{r.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground ml-2">
                            ({r.code})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-[11px] text-muted-foreground leading-normal">
                Tự động sao chép toàn bộ danh mục quyền và phạm vi dữ liệu từ vai trò mẫu sang vai trò mới.
              </p>
            </div>
          )}

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-foreground">
              Mô tả trách nhiệm & phạm vi
            </Label>
            <Textarea
              id="description"
              placeholder="Mô tả tóm tắt trách nhiệm, đối tượng nhân viên và phạm vi quyền hạn của vai trò này..."
              rows={3}
              disabled={isSubmitting}
              className="text-xs rounded-lg resize-none p-2.5 border-input bg-background/50 hover:bg-background focus:bg-background transition-colors leading-normal"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-4 text-xs font-medium"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8.5 px-4 text-xs font-medium gap-1.5 bg-primary hover:bg-primary/90 text-white shadow-xs"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isEditing ? "Lưu thay đổi" : "Khởi tạo vai trò"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { ShieldPlus, Edit3, Loader2 } from "lucide-react";
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
      <DialogContent className="sm:max-w-[500px] p-6 gap-0 rounded-2xl border-border bg-card shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              {isEditing ? (
                <Edit3 className="h-5 w-5" />
              ) : (
                <ShieldPlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                {isEditing ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {isEditing
                  ? `Cập nhật thông tin hiển thị và mô tả vai trò ${role?.name}`
                  : "Khởi tạo vai trò mới và tùy chọn sao chép quyền từ vai trò có sẵn"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 pb-1">
          {/* Tên vai trò */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-foreground">
              Tên vai trò <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="VD: Quản lý cửa hàng, Kỹ sư phần mềm..."
              disabled={isSubmitting}
              className="h-9 text-xs rounded-lg border-input bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors"
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
                Mã vai trò <span className="text-destructive">*</span>
              </Label>
              {isEditing && (
                <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                  Mã cố định
                </span>
              )}
            </div>
            <Input
              id="code"
              placeholder="VD: STORE_MANAGER, SOFTWARE_ENGINEER..."
              disabled={isEditing || isSubmitting}
              className="font-mono uppercase text-xs h-9 rounded-lg border-input bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors disabled:bg-muted/50 disabled:text-muted-foreground"
              {...form.register("code", {
                onChange: (e) => {
                  e.target.value = e.target.value.toUpperCase();
                },
              })}
            />
            {form.formState.errors.code ? (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.code.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                {isEditing
                  ? "Mã vai trò là định danh duy nhất và không thể thay đổi sau khi tạo."
                  : "Chỉ gồm chữ in hoa, chữ số và dấu gạch dưới (_)."}
              </p>
            )}
          </div>

          {/* Kế thừa quyền từ vai trò mẫu (Chỉ hiển thị khi tạo mới) */}
          {!isEditing && roles.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="cloneFromRoleId" className="text-xs font-semibold text-foreground">
                  Kế thừa quyền từ vai trò
                </Label>
                <span className="text-[11px] text-muted-foreground">Tùy chọn</span>
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
                    <SelectTrigger className="w-full h-9 text-xs rounded-lg border-input bg-background hover:bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring transition-colors">
                      <SelectValue placeholder="Chọn vai trò để sao chép quyền...">
                        {(selectedId: string) => {
                          if (!selectedId || selectedId === "none") {
                            return (
                              <span className="text-muted-foreground font-normal">
                                -- Không kế thừa (Bắt đầu với 0 quyền) --
                              </span>
                            );
                          }
                          const target = roles.find((r) => r.id === selectedId);
                          if (!target) return selectedId;
                          return (
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="font-medium text-foreground">{target.name}</span>
                              <span className="text-[10px] font-mono text-muted-foreground">
                                ({target.code})
                              </span>
                            </span>
                          );
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="text-xs max-h-60">
                      <SelectItem
                        value="none"
                        label="-- Không kế thừa (Bắt đầu với 0 quyền) --"
                        className="text-xs text-muted-foreground font-normal cursor-pointer"
                      >
                        -- Không kế thừa (Bắt đầu với 0 quyền) --
                      </SelectItem>
                      {roles.map((r) => (
                        <SelectItem
                          key={r.id}
                          value={r.id}
                          label={`${r.name} (${r.code})`}
                          className="text-xs cursor-pointer"
                        >
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
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Tự động sao chép danh sách quyền và phạm vi dữ liệu từ vai trò đã chọn.
              </p>
            </div>
          )}

          {/* Mô tả */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-foreground">
              Mô tả vai trò
            </Label>
            <Textarea
              id="description"
              placeholder="Nhập mô tả tóm tắt nhiệm vụ và phạm vi hoạt động của vai trò này..."
              rows={3}
              disabled={isSubmitting}
              className="text-xs rounded-lg resize-none p-2.5 border-input bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors leading-relaxed"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-border/60 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-9 px-4 text-xs font-medium cursor-pointer"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-9 px-4 text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              <span>{isEditing ? "Lưu thay đổi" : "Khởi tạo vai trò"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

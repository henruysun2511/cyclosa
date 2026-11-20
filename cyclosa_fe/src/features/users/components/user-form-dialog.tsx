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
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2 } from "lucide-react";
import { createUserSchema, type CreateUserFormValues } from "../schemas/user.schema";
import { useCreateUserMutation } from "../api/user-api";
import { useGetRolesQuery } from "@/features/authorization";
import { toast } from "sonner";

export interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserFormDialog({ open, onOpenChange, onSuccess }: UserFormDialogProps) {
  const [createUser, { isLoading: isSubmitting }] = useCreateUserMutation();
  const { data: rolesData } = useGetRolesQuery({ size: 100, sortBy: "name", direction: "asc" });
  const roles = rolesData?.data?.items || [];

  const [isUsernameCustomized, setIsUsernameCustomized] = React.useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      email: "",
      roleCodes: [],
    },
  });

  useEffect(() => {
    if (open) {
      setIsUsernameCustomized(false);
      form.reset({
        username: "",
        email: "",
        roleCodes: [],
      });
    }
  }, [open, form]);

  const selectedRoles = form.watch("roleCodes") || [];

  const handleToggleRole = (code: string) => {
    const current = new Set(selectedRoles);
    if (current.has(code)) {
      current.delete(code);
    } else {
      current.add(code);
    }
    form.setValue("roleCodes", Array.from(current));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailVal = e.target.value;
    form.setValue("email", emailVal, { shouldValidate: true });

    // Nếu admin chưa từng can thiệp vào ô username, tự động trích xuất username từ email
    if (!isUsernameCustomized && emailVal.includes("@")) {
      const suggestedUsername = emailVal.split("@")[0].toLowerCase().replace(/[^a-zA-Z0-9._-]/g, "");
      form.setValue("username", suggestedUsername, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: CreateUserFormValues) => {
    try {
      const res = await createUser({
        username: values.username.trim().toLowerCase(),
        email: values.email.trim().toLowerCase(),
        roleCodes: values.roleCodes && values.roleCodes.length > 0 ? values.roleCodes : undefined,
      }).unwrap();

      if (res.success) {
        onOpenChange(false);
        toast.success(`Đã tạo tài khoản cho "${values.username}" (${values.email}) thành công.`, {
          description: "Mã kích hoạt có hiệu lực trong 48 giờ đã được gửi qua email.",
        });
        onSuccess?.();
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error.data?.message || "Không thể tạo tài khoản người dùng. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-6 gap-0 rounded-2xl border-border bg-card shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 shrink-0">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-foreground">
                Tạo tài khoản người dùng mới
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Khởi tạo tài khoản ở trạng thái Chờ kích hoạt và gửi liên kết kích hoạt qua email
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 pb-1">
          {/* Tên đăng nhập (Username) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="username" className="text-xs font-semibold text-foreground">
                Tên đăng nhập (Username) <span className="text-destructive">*</span>
              </Label>
              <span className="text-[10px] text-muted-foreground font-mono">
                Chữ cái, số, ., _, -
              </span>
            </div>
            <Input
              id="username"
              type="text"
              placeholder="VD: nguyen.van.an, nv_001..."
              disabled={isSubmitting}
              className="h-9 text-xs rounded-lg border-input bg-background font-mono focus-visible:ring-1 focus-visible:ring-ring transition-colors"
              {...form.register("username", {
                onChange: () => setIsUsernameCustomized(true),
              })}
            />
            {form.formState.errors.username && (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground">
              Địa chỉ Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="VD: nguyen.van.an@cyclosa.vn"
              disabled={isSubmitting}
              className="h-9 text-xs rounded-lg border-input bg-background focus-visible:ring-1 focus-visible:ring-ring transition-colors"
              {...form.register("email", {
                onChange: handleEmailChange,
              })}
            />
            {form.formState.errors.email ? (
              <p className="text-[11px] text-destructive font-medium">
                {form.formState.errors.email.message}
              </p>
            ) : (
              <p className="text-[11px] text-muted-foreground leading-normal">
                Dùng để nhận liên kết kích hoạt tài khoản trong 48 giờ và đặt mật khẩu lần đầu.
              </p>
            )}
          </div>

          {/* Vai trò ban đầu */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground">
                Vai trò phân quyền ban đầu
              </Label>
              <span className="text-[11px] text-muted-foreground">Tùy chọn</span>
            </div>

            <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2 max-h-48 overflow-y-auto">
              {roles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Đang tải danh sách vai trò...
                </p>
              ) : (
                roles.map((r) => {
                  const isChecked = selectedRoles.includes(r.code);
                  return (
                    <label
                      key={r.id}
                      className="flex items-center gap-2.5 p-1.5 rounded hover:bg-muted/40 cursor-pointer select-none text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleRole(r.code)}
                        className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary/30"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-foreground">{r.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground ml-1.5">
                          ({r.code})
                        </span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Có thể gán thêm hoặc điều chỉnh quyền theo từng công ty sau khi tài khoản được tạo.
            </p>
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
              <span>Khởi tạo tài khoản</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


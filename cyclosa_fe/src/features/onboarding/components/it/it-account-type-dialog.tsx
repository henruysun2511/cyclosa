"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, ShieldAlert } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  itAccountTypeSchema,
  type ItAccountTypeFormValues,
} from "../../schemas/onboarding.schema";
import type { ItAccountTypeDto } from "../../types/onboarding.types";

interface ItAccountTypeDialogProps {
  initialData?: ItAccountTypeDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: ItAccountTypeFormValues) => Promise<void>;
}

export function ItAccountTypeDialog({
  initialData,
  open,
  onOpenChange,
  onConfirm,
}: ItAccountTypeDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItAccountTypeFormValues>({
    resolver: zodResolver(itAccountTypeSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      usernamePattern: initialData?.usernamePattern || "{firstname}.{lastname}@cyclosa.vn",
      requiresVpn: initialData ? initialData.requiresVpn : false,
      isActive: initialData ? initialData.isActive : true,
    },
  });

  React.useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        usernamePattern: initialData.usernamePattern || "",
        requiresVpn: initialData.requiresVpn,
        isActive: initialData.isActive,
      });
    } else {
      reset({
        name: "",
        description: "",
        usernamePattern: "{firstname}.{lastname}@cyclosa.vn",
        requiresVpn: false,
        isActive: true,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (values: ItAccountTypeFormValues) => {
    await onConfirm(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <KeyRound className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              {initialData ? "Chỉnh sửa Loại tài khoản CNTT" : "Thêm Loại tài khoản CNTT mới"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Định nghĩa hệ thống phần mềm cần cấp quyền cho nhân sự khi tiếp nhận.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">
              Tên loại tài khoản <span className="text-destructive">*</span>
            </Label>
            <Input
              {...register("name")}
              placeholder="VD: Email Google Workspace, GitHub Enterprise, VPN..."
              className="h-8 text-xs"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold">Quy cách đặt tên tài khoản (Username Pattern)</Label>
            <Input
              {...register("usernamePattern")}
              placeholder="VD: {firstname}.{lastname}@cyclosa.vn"
              className="h-8 text-xs font-mono"
            />
            <p className="text-[10.5px] text-muted-foreground">
              Gợi ý quy tắc định dạng tài khoản để IT Helpdesk dễ dàng cấp phát thống nhất.
            </p>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Mô tả & Hướng dẫn cấp quyền</Label>
            <Textarea
              {...register("description")}
              placeholder="Quyền hạn mặc định, nhóm phân quyền cần gán hoặc thủ tục cấp..."
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-1 pb-1">
            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="requiresVpn"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="switch-vpn"
                  />
                )}
              />
              <Label htmlFor="switch-vpn" className="text-xs cursor-pointer flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                Yêu cầu kết nối VPN bảo mật
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="switch-active-it"
                  />
                )}
              />
              <Label htmlFor="switch-active-it" className="text-xs cursor-pointer">
                Đang kích hoạt
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-8 text-xs"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu loại tài khoản"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


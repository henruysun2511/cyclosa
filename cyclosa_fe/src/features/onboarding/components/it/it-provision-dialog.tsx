"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
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
import {
  provisionItAccountSchema,
  type ProvisionItAccountFormValues,
} from "../../schemas/onboarding.schema";
import type { ItAccountRequestDto } from "../../types/onboarding.types";

interface ItProvisionDialogProps {
  request: ItAccountRequestDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (values: ProvisionItAccountFormValues) => Promise<void>;
  onFail: (reason: string) => Promise<void>;
}

export function ItProvisionDialog({
  request,
  open,
  onOpenChange,
  onConfirm,
  onFail,
}: ItProvisionDialogProps) {
  const [isRejectMode, setIsRejectMode] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProvisionItAccountFormValues>({
    resolver: zodResolver(provisionItAccountSchema),
    defaultValues: {
      provisionedUsername: "",
      provisionedEmail: "",
      initialPasswordNote: "Mật khẩu tạm thời: Cyclosa@2026 (yêu cầu đổi sau lần đầu đăng nhập)",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (request) {
      const emailGuess = `${request.employeeName.toLowerCase().replace(/\s+/g, ".")}@cyclosa.vn`;
      reset({
        provisionedUsername: request.employeeCode.toLowerCase(),
        provisionedEmail: emailGuess,
        initialPasswordNote: "Mật khẩu tạm thời: Cyclosa@2026 (yêu cầu đổi sau lần đầu đăng nhập)",
        notes: "",
      });
    }
  }, [request, reset]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsRejectMode(false);
      setRejectReason("");
    }
    onOpenChange(nextOpen);
  };

  if (!request) return null;

  const onSubmit = async (values: ProvisionItAccountFormValues) => {
    await onConfirm(values);
    onOpenChange(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    await onFail(rejectReason.trim());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary">
            <KeyRound className="h-5 w-5" />
            <DialogTitle className="text-sm font-bold text-foreground">
              {isRejectMode ? "Từ chối Cấp Tài khoản" : "Cấp phát Tài khoản CNTT"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Hệ thống: <strong className="text-foreground">{request.itAccountTypeName}</strong> cho nhân sự{" "}
            <strong className="text-foreground">{request.employeeName}</strong> ({request.employeeCode})
          </DialogDescription>
        </DialogHeader>

        {isRejectMode ? (
          <div className="space-y-3.5 py-2">
            <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
              <span className="font-bold block">Xác nhận không thể cấp tài khoản này:</span>
              <p>Yêu cầu sẽ chuyển sang trạng thái THẤT BẠI (FAILED) và gửi thông báo tới HR phụ trách.</p>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Lý do không thể cấp <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="VD: Hết giấy phép (license), trùng lặp định danh hoặc thiếu phê duyệt bảo mật..."
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsRejectMode(false)}
                className="h-8 text-xs"
              >
                Quay lại
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
              >
                Xác nhận từ chối
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Tên tài khoản đã tạo (Username) <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("provisionedUsername")}
                placeholder="VD: minh.tuan"
                className="h-8 text-xs font-mono"
              />
              {errors.provisionedUsername && (
                <p className="text-xs text-destructive">{errors.provisionedUsername.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Email tài khoản đã cấp</Label>
              <Input
                {...register("provisionedEmail")}
                placeholder="tuan.pham@cyclosa.vn"
                className="h-8 text-xs font-mono"
              />
              {errors.provisionedEmail && (
                <p className="text-xs text-destructive">{errors.provisionedEmail.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">
                Mật khẩu khởi tạo & Hướng dẫn đăng nhập <span className="text-destructive">*</span>
              </Label>
              <Input
                {...register("initialPasswordNote")}
                placeholder="Mật khẩu ban đầu hoặc liên kết kích hoạt"
                className="h-8 text-xs"
              />
              {errors.initialPasswordNote && (
                <p className="text-xs text-destructive">{errors.initialPasswordNote.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Ghi chú IT Helpdesk</Label>
              <Textarea
                {...register("notes")}
                placeholder="Ghi chú về nhóm quyền đã phân phối hoặc lưu ý cấu hình..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <DialogFooter className="gap-2 pt-2 flex items-center justify-between sm:justify-between w-full">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsRejectMode(true)}
                className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                Báo không thể cấp
              </Button>
              <div className="flex items-center gap-2">
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
                  className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  {isSubmitting ? "Đang lưu..." : "Xác nhận Đã cấp"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


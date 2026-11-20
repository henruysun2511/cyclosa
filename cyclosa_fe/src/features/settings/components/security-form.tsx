"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Check,
} from "lucide-react";

import { useChangePasswordMutation } from "@/features/auth/api/auth-api";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/auth.slice";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../schemas/settings.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function SecurityForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const newPasswordValue = watch("newPassword", "");

  // Quy tắc mật khẩu
  const hasMinLength = newPasswordValue.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPasswordValue);
  const hasLowercase = /[a-z]/.test(newPasswordValue);
  const hasNumber = /[0-9]/.test(newPasswordValue);
  const hasSpecial = /[@$!%*?&]/.test(newPasswordValue);

  const onSubmit = async (values: ChangePasswordInput) => {
    try {
      await changePassword(values).unwrap();
      toast.success("Đổi mật khẩu thành công", {
        description:
          "Mật khẩu đã được cập nhật. Vì lý do bảo mật, vui lòng đăng nhập lại với mật khẩu mới.",
      });
      reset();
      // Thu hồi phiên đăng nhập và chuyển hướng về màn login
      dispatch(logout());
      router.push("/login");
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      const message =
        errorObj?.data?.message || "Không thể đổi mật khẩu. Vui lòng kiểm tra lại thông tin.";
      toast.error("Đổi mật khẩu thất bại", {
        description: message,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Thẻ Form Đổi mật khẩu */}
      <Card className="shadow-xs">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            <CardTitle className="text-base font-bold">Đổi mật khẩu tài khoản</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Để bảo vệ an toàn cho tài khoản HRM của bạn, hãy sử dụng mật khẩu mạnh và không chia sẻ cho bất kỳ ai.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl">
            {/* Mật khẩu hiện tại */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-semibold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Mật khẩu hiện tại
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                  className="h-9 text-xs pr-9"
                  {...register("currentPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* Mật khẩu mới */}
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                Mật khẩu mới
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự (chữ hoa, số, ký tự đặc biệt)"
                  className="h-9 text-xs pr-9"
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.newPassword.message}
                </p>
              )}

              {/* Checklist độ mạnh mật khẩu */}
              {newPasswordValue.length > 0 && (
                <div className="mt-2.5 p-3 rounded-lg bg-muted/30 border border-border/60 text-[11px] space-y-1.5">
                  <p className="font-semibold text-muted-foreground">Tiêu chuẩn mật khẩu an toàn:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <Check className={`h-3 w-3 ${hasMinLength ? "opacity-100" : "opacity-30"}`} />
                      Tối thiểu 8 ký tự
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasUppercase ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <Check className={`h-3 w-3 ${hasUppercase ? "opacity-100" : "opacity-30"}`} />
                      Ít nhất 1 chữ hoa
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasLowercase ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <Check className={`h-3 w-3 ${hasLowercase ? "opacity-100" : "opacity-30"}`} />
                      Ít nhất 1 chữ thường
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <Check className={`h-3 w-3 ${hasNumber ? "opacity-100" : "opacity-30"}`} />
                      Ít nhất 1 chữ số
                    </span>
                    <span className={`flex items-center gap-1.5 ${hasSpecial ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <Check className={`h-3 w-3 ${hasSpecial ? "opacity-100" : "opacity-30"}`} />
                      Ký tự đặc biệt (@$!%*?&)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword" className="text-xs font-semibold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                Xác nhận lại mật khẩu mới
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmNewPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  className="h-9 text-xs pr-9"
                  {...register("confirmNewPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            {/* Chú ý bảo mật */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Sau khi đổi mật khẩu thành công, toàn bộ các phiên đăng nhập khác của bạn trên các thiết bị sẽ tự động kết thúc. Bạn sẽ được điều hướng đến trang Đăng nhập để sử dụng mật khẩu mới.
              </p>
            </div>

            {/* Nút gửi */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="gap-2 cursor-pointer text-xs h-9 px-5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang cập nhật mật khẩu...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Xác nhận đổi mật khẩu</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


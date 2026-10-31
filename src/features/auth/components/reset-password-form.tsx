"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpiderIcon } from "@/components/shared";
import {
  useResetPasswordMutation,
  useForgotPasswordMutation,
} from "../api/auth-api";
import { AUTH_ROUTES } from "../constants/auth.constants";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../schemas/auth.schema";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const [resendOtp, { isLoading: isResending }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: initialEmail,
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Countdown timer cho nút gửi lại OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const currentEmail = watch("email") || initialEmail;
  const watchedPassword = watch("newPassword") || "";

  // Tính điểm độ mạnh mật khẩu (0 - 4)
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/\d/.test(pass)) score++;
    if (/[@$!%*?&]/.test(pass)) score++;
    return score;
  };
  const strengthScore = calculateStrength(watchedPassword);

  const handleResendOtp = async () => {
    if (!currentEmail || !canResend) return;
    try {
      const res = await resendOtp({ email: currentEmail.trim().toLowerCase() }).unwrap();
      if (res.success) {
        toast.success("Mã OTP mới đã được gửi!", {
          description: `Vui lòng kiểm tra hộp thư ${currentEmail}.`,
        });
        setCountdown(60);
        setCanResend(false);
      }
    } catch {
      toast.error("Không thể gửi lại mã OTP", {
        description: "Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau ít phút.",
      });
    }
  };

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const response = await resetPassword({
        email: data.email.trim().toLowerCase(),
        otp: data.otp.trim(),
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Đặt lại mật khẩu thành công!", {
          description: "Mật khẩu của bạn đã được cập nhật. Đang chuyển về trang đăng nhập...",
        });

        setTimeout(() => {
          router.replace(AUTH_ROUTES.LOGIN);
        }, 1500);
      } else {
        toast.error("Đặt lại mật khẩu thất bại", {
          description: response.message || "Vui lòng kiểm tra lại mã OTP.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Thao tác thất bại", {
        description:
          errorObj?.data?.message ||
          "Mã OTP không chính xác hoặc đã hết hạn (15 phút). Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      {/* Mobile Brand */}
      <div className="flex items-center justify-center gap-2.5 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white shadow-md">
          <SpiderIcon className="h-5 w-5" />
        </div>
        <span className="font-sans text-lg font-bold tracking-tight text-foreground">
          Cyclo<span className="text-primary">sa</span> HRM
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Đặt lại mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nhập mã OTP gồm 6 chữ số vừa nhận được qua email và tạo mật khẩu mới an toàn cho tài khoản của bạn.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email xác nhận
          </Label>
          <Input
            id="email"
            type="email"
            readOnly={!!initialEmail}
            className={`h-10 ${initialEmail ? "bg-muted cursor-not-allowed text-muted-foreground" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mã OTP 6 số */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="otp" className="text-sm font-medium">
              Mã xác thực OTP (6 chữ số)
            </Label>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className="inline-flex items-center text-xs font-medium text-primary hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Đang gửi...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Gửi lại mã
                </>
              ) : (
                `Gửi lại sau ${countdown}s`
              )}
            </button>
          </div>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="• • • • • •"
            className="h-12 text-center text-xl font-mono tracking-widest uppercase font-semibold"
            disabled={isResetting}
            {...register("otp")}
          />
          {errors.otp && (
            <p className="text-xs font-medium text-destructive">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Mật khẩu mới */}
        <div className="space-y-1.5">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            Mật khẩu mới
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Nhập ít nhất 8 ký tự..."
              className="pl-9 pr-10 h-10"
              disabled={isResetting}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {watchedPassword && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1.5 h-1.5">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      step <= strengthScore
                        ? strengthScore <= 2
                          ? "bg-amber-500"
                          : strengthScore === 3
                          ? "bg-sky-500"
                          : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                Cần: Chữ hoa, chữ thường, chữ số và ký tự đặc biệt (@$!%*?&)
              </p>
            </div>
          )}

          {errors.newPassword && (
            <p className="text-xs font-medium text-destructive">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Xác nhận mật khẩu mới
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Nhập lại mật khẩu mới..."
              className="pl-9 pr-10 h-10"
              disabled={isResetting}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-medium shadow-md transition-all mt-2"
          disabled={isResetting}
        >
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xác thực & cập nhật...
            </>
          ) : (
            "Xác nhận đặt lại mật khẩu"
          )}
        </Button>
      </form>

      {/* Back link */}
      <div className="text-center">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Hủy bỏ và quay lại Đăng nhập
        </Link>
      </div>
    </div>
  );
}


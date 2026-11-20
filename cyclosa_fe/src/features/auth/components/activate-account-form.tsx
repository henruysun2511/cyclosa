"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {
  UserCheck,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpiderIcon } from "@/components/shared";
import { useActivateAccountMutation } from "../api/auth-api";
import { setCredentials } from "@/store/slices/auth.slice";
import { AUTH_ROUTES } from "../constants/auth.constants";
import {
  activateAccountSchema,
  type ActivateAccountInput,
} from "../schemas/auth.schema";

export function ActivateAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const tokenFromUrl = searchParams.get("token") || "";
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activateAccount, { isLoading }] = useActivateAccountMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ActivateAccountInput>({
    resolver: zodResolver(activateAccountSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

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

  const onSubmit = async (data: ActivateAccountInput) => {
    try {
      const response = await activateAccount({
        token: data.token.trim(),
        newPassword: data.newPassword,
      }).unwrap();

      if (response.success && response.data) {
        // Tự động lưu session và đăng nhập
        dispatch(setCredentials(response.data));

        toast.success("Kích hoạt tài khoản thành công!", {
          description: `Chào mừng ${response.data.email} gia nhập CYCLOSA. Đang chuyển vào hệ thống...`,
        });

        setTimeout(() => {
          router.replace(AUTH_ROUTES.DEFAULT_AFTER_LOGIN);
        }, 1200);
      } else {
        toast.error("Kích hoạt thất bại", {
          description: response.message || "Mã token kích hoạt không hợp lệ hoặc đã hết hạn.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Không thể kích hoạt tài khoản", {
        description:
          errorObj?.data?.message ||
          "Mã token không hợp lệ hoặc thời hạn 48 giờ đã kết thúc. Vui lòng liên hệ HR Admin.",
      });
    }
  };

  // Cảnh báo nếu mở trang không kèm token
  if (!tokenFromUrl) {
    return (
      <div className="mx-auto w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Thiếu mã token kích hoạt
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Liên kết kích hoạt tài khoản không đầy đủ. Vui lòng mở lại email thông báo chào mừng nhân sự mới từ phòng Nhân sự CYCLOSA để nhấp vào đường dẫn kích hoạt hợp lệ.
          </p>
        </div>
        <div className="pt-2">
          <Link href={AUTH_ROUTES.LOGIN}>
            <Button variant="outline" className="w-full h-11">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Header Info */}
      <div className="space-y-2 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Chào mừng nhân viên mới • Hiệu lực 48 giờ
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Kích hoạt tài khoản
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Thiết lập mật khẩu đăng nhập lần đầu để kích hoạt tài khoản nhân sự và truy cập cổng dịch vụ CYCLOSA.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} />

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
              placeholder="Thiết lập mật khẩu an toàn..."
              className="pl-9 pr-10 h-11"
              disabled={isLoading}
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
              placeholder="Nhập lại mật khẩu để xác nhận..."
              className="pl-9 pr-10 h-11"
              disabled={isLoading}
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
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang kích hoạt tài khoản...
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Kích hoạt & Đăng nhập ngay
            </>
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link
          href={AUTH_ROUTES.LOGIN}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Đã kích hoạt? Đến trang Đăng nhập
        </Link>
      </div>
    </div>
  );
}


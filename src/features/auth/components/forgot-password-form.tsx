"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpiderIcon } from "@/components/shared";
import { useForgotPasswordMutation } from "../api/auth-api";
import { AUTH_ROUTES } from "../constants/auth.constants";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "../schemas/auth.schema";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const response = await forgotPassword({
        email: data.email.trim().toLowerCase(),
      }).unwrap();

      if (response.success) {
        toast.success("Yêu cầu gửi OTP thành công!", {
          description: `Mã OTP xác thực 6 chữ số đã được gửi đến hộp thư ${data.email}.`,
        });

        // Chuyển hướng sang trang nhập OTP và mật khẩu mới
        router.push(
          `${AUTH_ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(data.email.trim().toLowerCase())}`
        );
      } else {
        toast.error("Không thể gửi mã OTP", {
          description: response.message || "Vui lòng thử lại sau.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Yêu cầu thất bại", {
        description:
          errorObj?.data?.message ||
          "Không thể gửi mã xác thực. Vui lòng kiểm tra lại địa chỉ email.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
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
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Quên mật khẩu?
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Đừng lo lắng, hãy nhập địa chỉ email liên kết với tài khoản CYCLOSA của bạn để nhận mã xác thực OTP khôi phục mật khẩu.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Địa chỉ Email
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="ten.nhanvien@cyclosa.vn"
              className="pl-9 h-11"
              disabled={isLoading}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-medium shadow-md transition-all"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang gửi mã xác thực...
            </>
          ) : (
            "Gửi mã xác thực OTP"
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
          Quay lại trang Đăng nhập
        </Link>
      </div>
    </div>
  );
}


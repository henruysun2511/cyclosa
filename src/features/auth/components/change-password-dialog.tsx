"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import {
  Lock,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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
import { useChangePasswordMutation } from "../api/auth-api";
import { logout } from "@/store/slices/auth.slice";
import { AUTH_ROUTES } from "../constants/auth.constants";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../schemas/auth.schema";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

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

  const handleClose = () => {
    reset();
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onOpenChange(false);
  };

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      const response = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }).unwrap();

      if (response.success) {
        toast.success("Đổi mật khẩu thành công!", {
          description: "Phiên làm việc cũ đã kết thúc. Vui lòng đăng nhập lại với mật khẩu mới.",
        });

        handleClose();

        // Cưỡng chế đăng xuất và yêu cầu đăng nhập lại
        dispatch(logout());
        setTimeout(() => {
          router.replace(AUTH_ROUTES.LOGIN);
        }, 1000);
      } else {
        toast.error("Không thể đổi mật khẩu", {
          description: response.message || "Vui lòng kiểm tra lại mật khẩu hiện tại.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Đổi mật khẩu thất bại", {
        description:
          errorObj?.data?.message ||
          "Mật khẩu hiện tại không chính xác hoặc dữ liệu không hợp lệ.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[460px] p-6">
        <DialogHeader className="space-y-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-1">
            <KeyRound className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">
            Đổi mật khẩu cá nhân
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Để bảo mật tài khoản, vui lòng nhập mật khẩu hiện tại và thiết lập mật khẩu mới có độ an toàn cao.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Mật khẩu hiện tại */}
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword" className="text-xs font-semibold">
              Mật khẩu hiện tại
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu hiện tại..."
                className="pl-9 pr-10 h-10 text-sm"
                disabled={isLoading}
                {...register("currentPassword")}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-1.5">
            <Label htmlFor="dialogNewPassword" className="text-xs font-semibold">
              Mật khẩu mới
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="dialogNewPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Tối thiểu 8 ký tự..."
                className="pl-9 pr-10 h-10 text-sm"
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

            {/* Strength indicator */}
            {watchedPassword && (
              <div className="space-y-1 pt-1">
                <div className="flex gap-1 h-1">
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
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" />
                  Gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt (@$!%*?&)
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
            <Label htmlFor="dialogConfirmPassword" className="text-xs font-semibold">
              Xác nhận mật khẩu mới
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="dialogConfirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu mới..."
                className="pl-9 pr-10 h-10 text-sm"
                disabled={isLoading}
                {...register("confirmNewPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="text-xs font-medium text-destructive">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-10 text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 text-xs font-medium shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu mật khẩu mới"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


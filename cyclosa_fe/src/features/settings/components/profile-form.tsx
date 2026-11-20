"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  User,
  Mail,
  Shield,
  Clock,
  Calendar,
  Save,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { useGetMeQuery, useUpdateMeMutation } from "@/features/auth/api/auth-api";
import { updateProfileSchema, type UpdateProfileInput } from "../schemas/settings.schema";
import { AvatarUploader } from "@/features/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "Chưa ghi nhận";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function ProfileForm() {
  const { data: meResponse, isLoading, isError, refetch } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateMeMutation();

  const user = meResponse?.data;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: "",
      avatarUrl: "",
    },
  });

  const avatarUrlValue = watch("avatarUrl");

  useEffect(() => {
    if (user) {
      reset({
        username: user.username || user.email.split("@")[0],
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (values: UpdateProfileInput) => {
    try {
      await updateProfile({
        username: values.username.trim(),
        avatarUrl: values.avatarUrl?.trim() || null,
      }).unwrap();
      toast.success("Cập nhật thông tin thành công", {
        description: "Hồ sơ cá nhân và ảnh đại diện đã được lưu vào hệ thống.",
      });
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      const message =
        errorObj?.data?.message || "Không thể cập nhật thông tin cá nhân. Vui lòng thử lại sau.";
      toast.error("Cập nhật thất bại", {
        description: message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <p className="text-sm text-destructive font-medium">
            Không thể tải thông tin hồ sơ cá nhân.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
            Tải lại trang
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-foreground">
                  {user.username || user.email.split("@")[0]}
                </h3>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Đang hoạt động
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </p>
            </div>

            {/* Danh sách vai trò */}
            <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
              <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-primary" />
                Vai trò:
              </span>
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs font-mono">
                    {role}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  Thành viên
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Ảnh đại diện qua Cloudinary (Avatar Uploader) */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Ảnh đại diện tài khoản</Label>
              <AvatarUploader
                value={avatarUrlValue}
                fallbackText={user.username || user.email}
                onChange={(newUrl) => {
                  setValue("avatarUrl", newUrl || "", {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />
              {errors.avatarUrl && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.avatarUrl.message}
                </p>
              )}
            </div>

            <Separator />

            {/* Thông tin đăng nhập & email */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Tên đăng nhập */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-semibold flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Tên đăng nhập (Username)
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập của bạn"
                  className="h-9 text-xs"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.username.message}
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground">
                  Dùng để đăng nhập hệ thống song song với địa chỉ email.
                </p>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold flex items-center gap-1.5 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  Địa chỉ Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="h-9 text-xs bg-muted/50 cursor-not-allowed opacity-80"
                />
                <p className="text-[11px] text-muted-foreground">
                  Email định danh hệ thống. Liên hệ Quản trị viên nếu cần thay đổi.
                </p>
              </div>
            </div>

            <Separator />

            {/* Thông tin phụ: Thời gian đăng nhập & tạo */}
            <div className="grid gap-4 sm:grid-cols-2 text-xs text-muted-foreground bg-muted/20 p-3.5 rounded-lg border border-border/60">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                <span>
                  Đăng nhập gần nhất:{" "}
                  <strong className="text-foreground font-medium">
                    {formatDate(user.lastLoginAt)}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground/70 shrink-0" />
                <span>
                  Ngày tham gia hệ thống:{" "}
                  <strong className="text-foreground font-medium">
                    {formatDate(user.createdAt)}
                  </strong>
                </span>
              </div>
            </div>

            {/* Nút lưu */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isUpdating || !isDirty}
                className="gap-2 cursor-pointer text-xs h-9 px-4"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Lưu thay đổi</span>
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

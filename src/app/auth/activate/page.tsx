"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AccountActivationPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp.");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate activation API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center space-y-1">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold">Kích hoạt tài khoản</CardTitle>
          <CardDescription className="text-xs">
            Chào mừng bạn đến với CYCLOSA. Vui lòng thiết lập mật khẩu bảo vệ tài khoản của bạn lần đầu tiên.
          </CardDescription>
        </CardHeader>

        {isSuccess ? (
          <CardContent className="space-y-4 text-center py-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-emerald-700">Kích hoạt tài khoản thành công!</h4>
              <p className="text-xs text-muted-foreground">
                Tài khoản của bạn đã được kích hoạt. Hãy đăng nhập để bắt đầu làm việc.
              </p>
            </div>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => router.push("/login")}
            >
              Đăng nhập ngay
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-100/80 border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-semibold text-foreground">Thông tin kích hoạt:</div>
                <div>Tài khoản: <strong>nv.nguyen@cyclosa.vn</strong></div>
                <div>Hạn liên kết: <strong>48 giờ kể từ khi gửi</strong></div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 8 ký tự..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Kích hoạt tài khoản & Đăng nhập"}
              </Button>
              <Link href="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                Quay lại đăng nhập
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User as UserIcon,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpiderIcon } from "@/components/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useLoginMutation } from "../api/auth-api";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import {
  AUTH_STORAGE_KEYS,
  AUTH_ROUTES,
} from "../constants/auth.constants";
import { setCredentials } from "@/store/slices/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || AUTH_ROUTES.DEFAULT_AFTER_LOGIN;

  const dispatch = useAppDispatch();
  const { isAuthenticated, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Tự động chuyển hướng nếu người dùng đã có phiên đăng nhập hợp lệ
  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(returnUrl);
    }
  }, [isInitialized, isAuthenticated, router, returnUrl]);

  useEffect(() => {
    const savedAccount = localStorage.getItem(AUTH_STORAGE_KEYS.REMEMBER_ACCOUNT);
    if (savedAccount) {
      form.setValue("username", savedAccount);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await login({
        username: data.username.trim(),
        password: data.password,
      }).unwrap();

      if (data.rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEYS.REMEMBER_ACCOUNT, data.username.trim());
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEYS.REMEMBER_ACCOUNT);
      }

      if (response.success && response.data) {
        dispatch(setCredentials(response.data));

        toast.success("Đăng nhập thành công!", {
          description: `Chào mừng ${data.username} trở lại hệ thống CYCLOSA.`,
        });

        router.replace(returnUrl);
      } else {
        toast.error("Đăng nhập không thành công", {
          description: response.message || "Vui lòng kiểm tra lại thông tin.",
        });
      }
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string } };
      toast.error("Đăng nhập thất bại", {
        description:
          errorObj?.data?.message ||
          "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-7">
      {/* Mobile Brand */}
      <div className="flex items-center justify-center gap-2.5 md:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-bold text-white shadow-sm">
          <SpiderIcon className="h-5 w-5" />
        </div>

        <span className="text-xl font-bold tracking-tight text-foreground">
          Cyclo<span className="text-primary">sa</span>
        </span>

        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          HRM
        </span>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Chào mừng trở lại
        </h1>
        <p className="text-sm text-muted-foreground">
          Đăng nhập vào hệ thống quản trị CYCLOSA HRM bằng tên đăng nhập của bạn.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground">
                  Tên đăng nhập
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="text"
                      placeholder="admin"
                      autoComplete="username"
                      className="h-11 rounded-lg pl-10 pr-3 text-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...field}
                    />
                  </div>
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-foreground">
                    Mật khẩu
                  </FormLabel>

                  <Link
                    href={AUTH_ROUTES.FORGOT_PASSWORD}
                    className="text-xs font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <FormControl>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      autoComplete="current-password"
                      className="h-11 rounded-lg pl-10 pr-11 text-sm transition-shadow focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...field}
                    />

                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Remember */}
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-2 select-none">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 cursor-pointer rounded border-input accent-primary focus:ring-primary/20"
                />

                <span className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                  Ghi nhớ tài khoản trên thiết bị này
                </span>
              </label>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            className="h-11 w-full rounded-lg font-semibold shadow-sm transition-all hover:shadow-md"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
          </Button>

          {/* Security badge footer */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Bảo mật 2 lớp & Xác thực phiên tự động</span>
          </div>
        </form>
      </Form>
    </div>
  );
}

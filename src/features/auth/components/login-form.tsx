"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
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
import { setCredentials } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/hooks";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    const savedAccount = localStorage.getItem("cyclosa_remember_account");

    if (savedAccount) {
      form.setValue("email", savedAccount);
      form.setValue("rememberMe", true);
    }
  }, [form]);

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      if (data.rememberMe) {
        localStorage.setItem("cyclosa_remember_account", data.email);
      } else {
        localStorage.removeItem("cyclosa_remember_account");
      }

      dispatch(setCredentials(result));

      toast.success("Đăng nhập thành công!");
      router.push("/products");
    } catch {
      toast.error("Đăng nhập thất bại", {
        description:
          "Email/tên đăng nhập hoặc mật khẩu không chính xác.",
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
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground">
                  Email / Tên đăng nhập
                </FormLabel>

                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="text"
                      placeholder="name@company.com"
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
                    href="/auth/forgot-password"
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
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={
                        showPassword
                          ? "Ẩn mật khẩu"
                          : "Hiện mật khẩu"
                      }
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
                  Ghi nhớ đăng nhập
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
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>

          {/* Register */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                hoặc
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
            >
              Tạo tài khoản
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
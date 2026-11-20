import { Suspense } from "react";
import type { Metadata } from "next";
import {
  GitFork,
  Clock,
  Sparkles,
  Users,
  MapPin,
  Loader2,
} from "lucide-react";
import { LoginForm } from "@/features/auth/components/login-form";
import { Card } from "@/components/ui/card";
import { SpiderIcon } from "@/components/shared";

export const metadata: Metadata = {
  title: "Đăng nhập — Hệ thống CYCLOSA HRM",
  description:
    "Cổng đăng nhập hệ thống quản trị nhân sự và không gian làm việc số CYCLOSA",
};

const features = [
  {
    icon: GitFork,
    title: "Quản lý tổ chức",
    description: "Quản lý cơ cấu, phòng ban, chức danh và trung tâm chi phí.",
  },
  {
    icon: Users,
    title: "Tuyển dụng thông minh",
    description: "Quản lý ứng viên, Pipeline, phỏng vấn và Offer trên một quy trình.",
  },
  {
    icon: Clock,
    title: "Chấm công & tiền lương",
    description: "Theo dõi chấm công, nghỉ phép và quản lý kỳ lương tập trung.",
  },
  {
    icon: MapPin,
    title: "Không gian số",
    description: "Sơ đồ chỗ ngồi, đặt bàn, phòng họp và quản lý không gian làm việc.",
  },
  {
    icon: Sparkles,
    title: "Trợ lý AI",
    description: "Hỏi đáp dữ liệu nhân sự, chính sách và hỗ trợ khai thác báo cáo.",
  },
];

function LoginFormFallback() {
  return (
    <div className="flex h-64 w-full max-w-md items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs">Đang tải biểu mẫu...</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100/80 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] opacity-70 dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]" />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0 py-0 shadow-2xl gap-0 lg:max-w-5xl">
        <div className="grid min-h-[580px] grid-cols-1 md:grid-cols-2">
          {/* ================= LEFT (Màu đỏ thương hiệu) ================= */}
          <div className="relative hidden select-none flex-col justify-between border-r border-red-700/20 bg-primary p-8 text-white md:flex lg:p-10">
            {/* Logo */}
            <div className="relative z-10 flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white font-bold text-primary shadow-md shadow-black/10">
                  <SpiderIcon className="h-5 w-5" />
                </div>

                <div>
                  <span className="font-sans text-lg font-bold tracking-tight text-white">
                    Cyclo<span className="font-bold text-red-200">sa</span>
                  </span>

                  <span className="ml-1.5 text-xs font-semibold text-red-200/90">
                    HRM
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 my-auto space-y-6 py-6">
              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                  Quản trị nhân sự & Không gian số
                </h2>

                <p className="text-xs leading-relaxed text-red-100/90">
                  Tập trung hóa quản trị nhân sự, tự động hóa quy trình và
                  kết nối dữ liệu trên một nền tảng.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3.5">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="group flex items-start gap-3 rounded-lg p-1.5 transition-colors"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-white/20">
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-xs font-semibold text-white">
                          {feature.title}
                        </h3>

                        <p className="text-[11px] leading-tight text-red-100/80">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-red-200/80">
              <span>© 2026 CYCLOSA HRM</span>
              <span>Phiên bản Enterprise 1.0</span>
            </div>
          </div>

          {/* ================= RIGHT (Form đăng nhập - bọc Suspense) ================= */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <Suspense fallback={<LoginFormFallback />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  );
}

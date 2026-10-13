import type { Metadata } from "next";
import {
  GitFork,
  Clock,
  Sparkles,
  Users,
  MapPin,
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
    description:
      "Quản lý cơ cấu, phòng ban, chức danh và trung tâm chi phí.",
  },
  {
    icon: Users,
    title: "Tuyển dụng thông minh",
    description:
      "Quản lý ứng viên, Pipeline, phỏng vấn và Offer trên một quy trình.",
  },
  {
    icon: Clock,
    title: "Chấm công & tiền lương",
    description:
      "Theo dõi chấm công, nghỉ phép và quản lý kỳ lương tập trung.",
  },
  {
    icon: MapPin,
    title: "Không gian số",
    description:
      "Sơ đồ chỗ ngồi, đặt bàn, phòng họp và quản lý không gian làm việc.",
  },
  {
    icon: Sparkles,
    title: "Trợ lý AI",
    description:
      "Hỏi đáp dữ liệu nhân sự, chính sách và hỗ trợ khai thác báo cáo.",
  },
];

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100/80 p-4 sm:p-6 lg:p-8">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border-border bg-card p-0 py-0 shadow-2xl gap-0 lg:max-w-5xl">
        <div className="grid min-h-[580px] grid-cols-1 md:grid-cols-2">

          {/* ================= LEFT (Màu đỏ chính) ================= */}
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

              {/* Features */}
              <div className="space-y-1.5">
                {features.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/10"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-red-100" />

                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white">
                          {feature.title}
                        </p>

                        <p className="mt-0.5 text-[11px] leading-relaxed text-red-100/80">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-red-200">
              <span className="text-[11px] text-red-100">
                Đặng Nhật Huy
              </span>

              <span className="font-mono text-[11px] text-red-200/80">
                v2.4 Enterprise
              </span>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col justify-center bg-card p-6 sm:p-8 md:p-10 lg:p-12">
            <LoginForm />
          </div>

        </div>
      </Card>
    </div>
  );
}
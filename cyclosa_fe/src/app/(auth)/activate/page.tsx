import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Sparkles,
  UserCheck,
  Shield,
  Rocket,
  Loader2,
} from "lucide-react";
import { ActivateAccountForm } from "@/features/auth/components/activate-account-form";
import { Card } from "@/components/ui/card";
import { SpiderIcon } from "@/components/shared";

export const metadata: Metadata = {
  title: "Kích hoạt tài khoản — CYCLOSA HRM",
  description: "Thiết lập mật khẩu lần đầu và kích hoạt tài khoản nhân viên CYCLOSA",
};

const welcomeFeatures = [
  {
    icon: Sparkles,
    title: "Cổng thông tin nhân sự (ESS)",
    description: "Tự tra cứu hồ sơ cá nhân, ngày phép, bảng lương và hợp đồng lao động.",
  },
  {
    icon: UserCheck,
    title: "Kích hoạt định danh số 48h",
    description: "Liên kết xác thực an toàn một lần, tự động gán vai trò theo quyết định tuyển dụng.",
  },
  {
    icon: Shield,
    title: "Không gian làm việc số",
    description: "Sơ đồ mặt bằng chỗ ngồi, đăng ký phòng họp và trang thiết bị công nghệ.",
  },
  {
    icon: Rocket,
    title: "Tự động đăng nhập",
    description: "Sẵn sàng làm việc ngay sau khi hoàn tất tạo mật khẩu lần đầu.",
  },
];

function FormFallback() {
  return (
    <div className="flex h-64 w-full max-w-md items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-xs">Đang tải biểu mẫu...</span>
      </div>
    </div>
  );
}

export default function ActivateAccountPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-100/80 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#0000000a_1px,transparent_1px)] [background-size:24px_24px] opacity-70 dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)]" />

      {/* Card 2 cột */}
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
              <div className="space-y-2">
                <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
                  Chào mừng thành viên mới
                </h2>
                <p className="text-xs leading-relaxed text-red-100/90">
                  Gia nhập CYCLOSA — Khởi đầu hành trình làm việc số hóa, kết nối không giới hạn cùng đội ngũ nhân sự doanh nghiệp.
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-3.5">
                {welcomeFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.title}
                      className="group flex items-start gap-3 rounded-lg p-1.5 transition-colors"
                    >
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white transition-colors group-hover:bg-white/20">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-semibold text-white">
                          {feat.title}
                        </h3>
                        <p className="text-[11px] leading-tight text-red-100/80">
                          {feat.description}
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
              <span>Chào mừng bạn gia nhập!</span>
            </div>
          </div>

          {/* ================= RIGHT (Form) ================= */}
          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
            <Suspense fallback={<FormFallback />}>
              <ActivateAccountForm />
            </Suspense>
          </div>
        </div>
      </Card>
    </div>
  );
}

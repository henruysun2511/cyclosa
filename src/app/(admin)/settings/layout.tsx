import React from "react";
import Link from "next/link";
import { SettingsNav } from "@/features/settings/components/settings-nav";
import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Cài đặt tài khoản | CYCLOSA HRM",
  description: "Quản lý thông tin hồ sơ cá nhân và cấu hình bảo mật tài khoản",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Module Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Cài đặt tài khoản
          </h1>
        </div>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
          <Link href="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">Cài đặt tài khoản</span>
        </nav>
      </div>

      <Separator />

      {/* Main Settings Body: Submenu Nav + Page Content */}
      <div className="flex flex-col space-y-6 lg:flex-row lg:space-x-8 lg:space-y-0">
        <aside className="lg:w-1/4 shrink-0">
          <SettingsNav />
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}


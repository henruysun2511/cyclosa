import React from "react";
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
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Cài đặt tài khoản
          </h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Quản lý thông tin định danh cá nhân, vai trò hoạt động và các thiết lập bảo mật tài khoản HRM.
        </p>
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


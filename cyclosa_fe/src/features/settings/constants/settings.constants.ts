import { User, ShieldCheck } from "lucide-react";

export interface SettingsNavSubItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

export const SETTINGS_NAV_ITEMS: SettingsNavSubItem[] = [
  {
    id: "profile",
    title: "Thông tin cá nhân",
    description: "Xem và cập nhật tên đăng nhập, thông tin tài khoản",
    href: "/settings/profile",
    icon: User,
  },
  {
    id: "security",
    title: "Bảo mật & Mật khẩu",
    description: "Đổi mật khẩu tài khoản và quản lý trạng thái bảo mật",
    href: "/settings/security",
    icon: ShieldCheck,
  },
];


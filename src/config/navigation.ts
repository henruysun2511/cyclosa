import React from "react";
import { ShieldCheck, Package, Users, Settings } from "lucide-react";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import type {
  PermissionCode,
  PermissionResource,
} from "@/features/authorization/types/permission.types";

export interface NavChildItem {
  title: string;
  href: string;
  badge?: string;
  permission?: PermissionCode | string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  permission?: PermissionCode | string;
  resource?: PermissionResource;
  children?: NavChildItem[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Danh sách menu điều hướng thực tế của hệ thống CYCLOSA.
 * Chỉ giữ lại các menu đã có trang và chức năng hoàn chỉnh.
 * Khi phát triển thêm phân hệ nào sẽ bổ sung menu tương ứng vào đây.
 */
export const navigationConfig: NavGroup[] = [
  {
    label: "HỆ THỐNG & PHÂN QUYỀN",
    items: [
      {
        title: "Tài khoản người dùng",
        href: "/users",
        icon: Users,
        permission: PERMISSIONS.USER.VIEW,
        resource: "USER",
      },
      {
        title: "Vai trò & Phân quyền",
        href: "/roles",
        icon: ShieldCheck,
        permission: PERMISSIONS.ROLE.VIEW,
        resource: "ROLE",
      },
    ],
  },
  {
    label: "CÀI ĐẶT TÀI KHOẢN",
    items: [
      {
        title: "Cài đặt tài khoản",
        href: "/settings/profile",
        icon: Settings,
        children: [
          {
            title: "Thông tin cá nhân",
            href: "/settings/profile",
          },
          {
            title: "Bảo mật & Mật khẩu",
            href: "/settings/security",
          },
        ],
      },
    ],
  },
  {
    label: "MẪU DỮ LIỆU",
    items: [
      {
        title: "Sản phẩm (Sample CRUD)",
        href: "/products",
        icon: Package,
        badge: "Mẫu",
      },
    ],
  },
];

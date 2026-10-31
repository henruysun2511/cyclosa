import React from "react";
import { ShieldCheck, Package } from "lucide-react";
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
    label: "HỆ THỐNG & BẢO MẬT",
    items: [
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

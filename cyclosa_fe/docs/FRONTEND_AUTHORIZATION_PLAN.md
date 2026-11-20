# KẾ HOẠCH & KIẾN TRÚC PHÂN QUYỀN TOÀN DIỆN FRONTEND (CYCLOSA HRM)

> **Tài liệu tham khảo nghiệp vụ:** [`cyclosa_be/docs/ba/module-phan-quyen.md`](file:///f:/Project/CYCLOSA/cyclosa_be/docs/ba/module-phan-quyen.md)  
> **Phiên bản:** 1.0 — Chuẩn Enterprise Next.js App Router & Redux Toolkit

---

## 🏛️ 1. Mô hình Phân quyền Đa tầng (4 + 2 Layers)

Hệ thống phân quyền Frontend kết hợp chặt chẽ **4 lớp kiểm soát hiển thị (UI)** do bạn đề xuất cùng **2 lớp nền tảng (Core Engine & Data Scope)** để tạo nên một kiến trúc chặt chẽ, an toàn và tối ưu trải nghiệm người dùng:

```
┌────────────────────────────────────────────────────────────────────────┐
│  LỚP 0: PERMISSION ENGINE & STATE (Redux Store + Hooks)                │
│  - authUser.roles, authUser.permissions, authUser.dataScopes           │
│  - can(perm), canAny(perms), hasRole(role), getDataScope(perm)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ LỚP 1: ROUTE GUARD   │  │ LỚP 2 & 3: MENU/SUB  │  │ LỚP 4: COMPONENT UI  │
│ - URL / Page Guard   │  │ - Cây Sidebar Menu   │  │ - Button / Tab / Col │
│ - Redirect về /403   │  │ - Lọc đệ quy tự động │  │ - Form Actions       │
└──────────────────────┘  └──────────────────────┘  └──────────┬───────────┘
                                                               │
                               ┌───────────────────────────────┴──────────┐
                               ▼                                          ▼
                ┌───────────────────────────────┐          ┌───────────────────────────────┐
                │ LỚP 5: CHIẾN LƯỢC HIỂN THỊ    │          │ LỚP 6: DATA SCOPE ADAPTER     │
                │ - mode="hide" (Ẩn khỏi DOM)   │          │ - ALL / COMPANY               │
                │ - mode="disable" (Mờ+Tooltip) │          │ - DEPARTMENT / OWN (Khóa lọc) │
                └───────────────────────────────┘          └───────────────────────────────┘
```

---

## 📁 2. Danh sách các file sẽ bổ sung & chỉnh sửa

### 2.1. Thư mục Core Authorization ([`src/features/authorization/`](file:///f:/Project/CYCLOSA/cyclosa_fe/src/features/authorization))

| STT | Đường dẫn File | Loại | Nhiệm vụ chính |
| :-: | :--- | :-: | :--- |
| 1 | `src/features/authorization/types/permission.types.ts` | **Mới** | Định nghĩa Type/Enum 36 mã quyền hệ thống (`role.view`, `employee.create`...), 10 System Roles, DataScope (`ALL`, `COMPANY`, `DEPARTMENT`, `OWN`). |
| 2 | `src/features/authorization/constants/permission.constants.ts` | **Mới** | Hằng số mã quyền, nhãn tiếng Việt của quyền và data scope, đường dẫn trang cấm truy cập (`/403`). |
| 3 | `src/features/authorization/hooks/use-permission.ts` | **Mới** | Hook React cung cấp các hàm `can()`, `canAny()`, `canAll()`, `hasRole()`, `getDataScope()`. |
| 4 | `src/features/authorization/components/permission-guard.tsx` | **Mới** | Component bọc UI để ẩn hoặc disable button/tab/column khi thiếu quyền (`mode="hide"` hoặc `mode="disable"`). |
| 5 | `src/features/authorization/components/role-guard.tsx` | **Mới** | Component bọc UI chỉ cho phép các Role cụ thể xem (`SUPER_ADMIN`, `HR_ADMIN`...). |
| 6 | `src/features/authorization/components/route-guard.tsx` | **Mới** | Component bảo vệ Route/Layout cấp Page, tự động chặn và chuyển hướng nếu không đủ quyền. |
| 7 | `src/features/authorization/index.ts` | **Mới** | Barrel export toàn bộ hook, component và types của module phân quyền. |

---

### 2.2. Cấu hình Điều hướng & Giao diện ([`src/components/` & `src/config/`])

| STT | Đường dẫn File | Loại | Nhiệm vụ chính |
| :-: | :--- | :-: | :--- |
| 8 | `src/config/navigation.ts` | **Chỉnh sửa / Mới** | Định nghĩa Cây Menu/Submenu tập trung kèm metadata quyền: `permission?: PermissionCode`, `requiredRoles?: RoleCode[]`. |
| 9 | `src/components/layout/admin-sidebar.tsx` | **Chỉnh sửa** | Tích hợp thuật toán lọc đệ quy (**Recursive Menu Filter**): Menu cha tự động ẩn nếu toàn bộ menu con bị ẩn. |
| 10 | `src/app/forbidden.tsx` (hoặc `(admin)/403/page.tsx`) | **Mới** | Màn hình thông báo lỗi **403 Không có quyền truy cập** thẩm mỹ, có nút "Quay lại" và "Yêu cầu cấp quyền". |
| 11 | `src/store/slices/auth.slice.ts` | **Chỉnh sửa** | Bổ sung lưu trữ `permissions: string[]` và `dataScopes: Record<string, DataScope>` trong User Profile State. |

---

## 💻 3. Chi tiết Mã nguồn Mẫu & Cách áp dụng vào Code

### 3.1. Hook Thẩm định quyền: `usePermission()`
File: `src/features/authorization/hooks/use-permission.ts`

```tsx
import { useAppSelector } from "@/store/hooks";
import type { PermissionCode, DataScope, RoleCode } from "../types/permission.types";

export function usePermission() {
  const user = useAppSelector((state) => state.auth.user);
  const roles = user?.roles || [];
  const permissions = user?.permissions || [];
  const dataScopes = user?.dataScopes || {};

  // Super Admin luôn có toàn quyền tuyệt đối
  const isSuperAdmin = roles.includes("SUPER_ADMIN");

  /** Kiểm tra có quyền chức năng cụ thể không */
  const can = (permission: PermissionCode, requiredScope?: DataScope): boolean => {
    if (isSuperAdmin) return true;
    if (!permissions.includes(permission)) return false;
    
    // Nếu có yêu cầu kiểm tra phạm vi dữ liệu
    if (requiredScope) {
      const userScope = dataScopes[permission];
      return isScopeSatisfied(userScope, requiredScope);
    }
    return true;
  };

  /** Kiểm tra có ít nhất 1 trong các quyền được truyền vào */
  const canAny = (perms: PermissionCode[]): boolean => {
    if (isSuperAdmin) return true;
    return perms.some((p) => permissions.includes(p));
  };

  /** Kiểm tra vai trò */
  const hasRole = (role: RoleCode): boolean => {
    if (isSuperAdmin) return true;
    return roles.includes(role);
  };

  /** Lấy phạm vi dữ liệu của quyền */
  const getDataScope = (permission: PermissionCode): DataScope => {
    if (isSuperAdmin) return "ALL";
    return dataScopes[permission] || "OWN";
  };

  return { can, canAny, hasRole, getDataScope, isSuperAdmin, roles, permissions };
}
```

---

### 3.2. Lớp 1: Route Guard (Bảo vệ đường dẫn Page/Layout)
File: `src/app/(admin)/roles/layout.tsx` (hoặc từng `page.tsx`)

```tsx
"use client";

import { RouteGuard } from "@/features/authorization";

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard 
      permission="role.view" 
      fallbackUrl="/403"
    >
      {children}
    </RouteGuard>
  );
}
```

---

### 3.3. Lớp 2 & 3: Menu & Submenu Navigation (Lọc đệ quy Sidebar)
Cấu hình tại: `src/config/navigation.ts`

```tsx
export interface NavItem {
  title: string;
  href?: string;
  icon?: any;
  permission?: PermissionCode;      // Quyền yêu cầu
  roles?: RoleCode[];               // Role yêu cầu (nếu cần giới hạn riêng)
  subItems?: NavItem[];             // Submenu con
}

export const navigationConfig: NavItem[] = [
  {
    title: "Quản lý Tổ chức",
    icon: Building2,
    permission: "org.view",
    subItems: [
      { title: "Sơ đồ tổ chức", href: "/organization", permission: "org.view" },
      { title: "Phòng ban & Chi nhánh", href: "/departments", permission: "org.manage" },
    ],
  },
  {
    title: "Phân quyền & Vai trò",
    icon: ShieldCheck,
    permission: "role.view",
    subItems: [
      { title: "Danh sách vai trò", href: "/roles", permission: "role.view" },
      { title: "Gán quyền người dùng", href: "/role-assignments", permission: "role.assign" },
    ],
  },
];
```

Thuật toán lọc Sidebar: `src/components/layout/admin-sidebar.tsx`

```tsx
// Lọc đệ quy: Menu cha chỉ hiển thị nếu bản thân có quyền VÀ có ít nhất 1 menu con thỏa mãn
function filterNavItems(items: NavItem[], can: (p: PermissionCode) => boolean): NavItem[] {
  return items
    .filter((item) => !item.permission || can(item.permission))
    .map((item) => {
      if (item.subItems) {
        const filteredSubs = filterNavItems(item.subItems, can);
        return { ...item, subItems: filteredSubs };
      }
      return item;
    })
    .filter((item) => !item.subItems || item.subItems.length > 0); // Ẩn cha nếu con rỗng
}
```

---

### 3.4. Lớp 4 & 5: Component Guard (Button, Tab, Column, Form Field)
Component: `src/features/authorization/components/permission-guard.tsx`

```tsx
import React from "react";
import { usePermission } from "../hooks/use-permission";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PermissionGuardProps {
  permission: PermissionCode;
  mode?: "hide" | "disable";        // Mặc định "hide" (ẩn khỏi DOM)
  disabledTooltip?: string;         // Tooltip giải thích khi bị disable
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({
  permission,
  mode = "hide",
  disabledTooltip = "Bạn không có quyền thực hiện thao tác này",
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { can } = usePermission();
  const hasAccess = can(permission);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Chế độ 1: Ẩn hoàn toàn khỏi giao diện
  if (mode === "hide") {
    return <>{fallback}</>;
  }

  // Chế độ 2: Vô hiệu hóa và hiển thị Tooltip giải thích cho người dùng
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block cursor-not-allowed opacity-50 pointer-events-none">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-xs bg-slate-900 text-white">
        {disabledTooltip}
      </TooltipContent>
    </Tooltip>
  );
}
```

#### Ví dụ Áp dụng thực tế trên UI:

* **Ví dụ 1: Nút "Thêm mới nhân sự" (Chế độ Ẩn):**
  ```tsx
  <PermissionGuard permission="employee.create">
    <Button onClick={handleOpenCreateModal}>
      <Plus className="mr-2 h-4 w-4" /> Thêm nhân viên
    </Button>
  </PermissionGuard>
  ```

* **Ví dụ 2: Nút "Phê duyệt đơn" (Chế độ Vô hiệu hóa kèm Tooltip):**
  ```tsx
  <PermissionGuard 
    permission="leave.approve" 
    mode="disable" 
    disabledTooltip="Chỉ Quản lý đơn vị mới có quyền duyệt đơn này"
  >
    <Button variant="default" onClick={handleApprove}>Phê duyệt</Button>
  </PermissionGuard>
  ```

* **Ví dụ 3: Tab "Thông tin Lương C&B" trong chi tiết nhân sự:**
  ```tsx
  <TabsList>
    <TabsTrigger value="general">Thông tin chung</TabsTrigger>
    <TabsTrigger value="contract">Hợp đồng</TabsTrigger>
    
    <PermissionGuard permission="payroll.view_salary">
      <TabsTrigger value="salary">Lương thưởng (C&B)</TabsTrigger>
    </PermissionGuard>
  </TabsList>
  ```

---

### 3.5. Lớp 6: Data Scope UI Adapter (Xử lý Phạm vi dữ liệu)
Hook: `useDataScope("employee.view")`

```tsx
const scope = getDataScope("employee.view");

return (
  <div className="filters">
    {/* Chỉ tài khoản có Scope là ALL hoặc COMPANY mới được chọn chi nhánh/phòng ban khác */}
    {(scope === "ALL" || scope === "COMPANY") && (
      <DepartmentSelect value={selectedDept} onChange={setSelectedDept} />
    )}

    {/* Nếu Scope là OWN: Khóa cứng hiển thị của chính mình, ẩn bộ lọc chọn nhân viên */}
    {scope === "OWN" && (
      <Badge variant="outline">Chế độ xem cá nhân</Badge>
    )}
  </div>
);
```

---

## 📅 4. Lộ trình Triển khai (Roadmap 4 Giai đoạn)

```
[ Giai đoạn 1 ] ──► [ Giai đoạn 2 ] ──► [ Giai đoạn 3 ] ──► [ Giai đoạn 4 ]
Type, Enums &       Component Guard     Sidebar Navigation  Áp dụng thực tế
usePermission()     & Route /403        Lọc đệ quy 2 cấp    vào các Module
```

1. **Giai đoạn 1 (Nền tảng):**
   * Tạo `permission.types.ts` (36 mã quyền từ Backend, 10 Roles, 4 DataScopes).
   * Cập nhật `auth.slice.ts` & `AuthInitializer` nạp danh sách `permissions` khi login / reload.
   * Viết hook `usePermission()`.
2. **Giai đoạn 2 (Bảo vệ Route & UI):**
   * Xây dựng `<PermissionGuard>`, `<RoleGuard>`, `<RouteGuard>`.
   * Thiết kế trang lỗi truy cập `src/app/(admin)/403/page.tsx`.
3. **Giai đoạn 3 (Sidebar Navigation):**
   * Chuẩn hóa file `src/config/navigation.ts`.
   * Cập nhật `admin-sidebar.tsx` áp dụng thuật toán lọc đệ quy `filterNavItems`.
4. **Giai đoạn 4 (Triển khai mẫu & Kiểm thử):**
   * Áp dụng phân quyền trực tiếp vào module Sản phẩm (`products`) và trang Quản trị Người dùng / Vai trò.
   * Kiểm thử đăng nhập với tài khoản `admin` (SUPER_ADMIN) và tài khoản thường (EMPLOYEE) để kiểm tra giao diện ẩn/hiện.


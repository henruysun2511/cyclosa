import { Suspense } from "react";
import type { Metadata } from "next";
import { RouteGuard } from "@/features/authorization/components/route-guard";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { RoleManagementView } from "@/features/authorization/components/role-management-view";

export const metadata: Metadata = {
  title: "Vai trò & Phân quyền Hệ thống | CYCLOSA HRM",
  description: "Thiết lập danh mục vai trò hệ thống và ma trận phân quyền chi tiết cho nhân sự.",
};

export default function RolesPage() {
  return (
    <RouteGuard permission={PERMISSIONS.ROLE.VIEW}>
      <Suspense
        fallback={
          <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
            Đang tải dữ liệu phân quyền...
          </div>
        }
      >
        <RoleManagementView />
      </Suspense>
    </RouteGuard>
  );
}

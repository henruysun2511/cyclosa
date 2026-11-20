import React from "react";
import type { Metadata } from "next";
import { EmployeeLayout } from "@/components/layout/employee-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export const metadata: Metadata = {
  title: "CYCLOSA ESS — Cổng Tự Phục Vụ Nhân Viên",
  description: "Cổng tự phục vụ nhân sự, chấm công, phiếu lương và quản lý công việc cá nhân CYCLOSA",
};

export default function EmployeePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <React.Suspense fallback={<div className="min-h-screen bg-background" />}>
        <EmployeeLayout>{children}</EmployeeLayout>
      </React.Suspense>
    </AuthGuard>
  );
}


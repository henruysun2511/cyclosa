import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminLayout activeMenuItem="Products">{children}</AdminLayout>
    </AuthGuard>
  );
}

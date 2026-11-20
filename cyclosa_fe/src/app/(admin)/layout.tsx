import { AdminLayout } from "@/components/layout/admin-layout";
import { AuthGuard } from "@/features/auth/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAdmin>
      <AdminLayout activeMenuItem="Dashboard">{children}</AdminLayout>
    </AuthGuard>
  );
}

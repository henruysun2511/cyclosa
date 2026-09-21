import { CompanyDashboardView } from "@/features/companies/components/company-dashboard-view";

export const metadata = {
  title: "Companies | Super Admin",
  description: "Quản lý danh sách doanh nghiệp và gói đăng ký trên hệ thống",
};

export default function CompaniesPage() {
  return <CompanyDashboardView />;
}

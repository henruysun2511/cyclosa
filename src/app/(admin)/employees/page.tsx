"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Building2,
  MapPin,
  Briefcase,
  Eye,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { useGetCompaniesQuery, useGetDepartmentsQuery } from "@/features/organization/api";
import { useGetEmployeesQuery, useLazyExportEmployeesQuery } from "@/features/employee/api/employee-api";
import { EmployeeCreateDialog } from "@/features/employee/components/dialogs/employee-create-dialog";
import { EmployeeDetailDialog } from "@/features/employee/components/dialogs/employee-detail-dialog";
import type { EmployeeStatus, EmployeeSummary } from "@/features/employee/types/employee.types";

export default function EmployeesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.EMPLOYEE.CREATE);
  const [triggerExport, { isFetching: isExporting }] = useLazyExportEmployeesQuery();

  // Filter states
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [selectedDeptId, setSelectedDeptId] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [page, setPage] = useState<number>(0);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Nạp danh sách công ty
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  // Tự động chọn công ty đầu tiên nếu chưa chọn
  React.useEffect(() => {
    if (!selectedCompanyId && companies.length > 0) {
      setSelectedCompanyId(companies[0].id);
    }
  }, [companies, selectedCompanyId]);

  // Nạp danh sách phòng ban của công ty được chọn
  const { data: deptData } = useGetDepartmentsQuery(
    { companyId: selectedCompanyId, size: 100 },
    { skip: !selectedCompanyId }
  );
  const departments = deptData?.items || [];

  // Nạp danh sách nhân viên
  const {
    data: employeePageData,
    isLoading,
    refetch,
  } = useGetEmployeesQuery(
    {
      companyId: selectedCompanyId,
      departmentId: selectedDeptId !== "all" ? selectedDeptId : undefined,
      status: selectedStatus !== "all" ? (selectedStatus as EmployeeStatus) : undefined,
      keyword: keyword.trim() || undefined,
      page,
      size: 20,
    },
    { skip: !selectedCompanyId }
  );

  const employees = employeePageData?.items || [];
  const totalElements = employeePageData?.pagination?.total || 0;

  const handleOpenDetail = (empId: string) => {
    setSelectedEmployeeId(empId);
    setIsDetailOpen(true);
  };

  const handleExportExcel = async () => {
    if (!selectedCompanyId) return;
    try {
      const res = await triggerExport({
        companyId: selectedCompanyId,
        departmentId: selectedDeptId !== "all" ? selectedDeptId : undefined,
        status: selectedStatus !== "all" ? (selectedStatus as EmployeeStatus) : undefined,
        keyword: keyword.trim() || undefined,
      }).unwrap();

      if (res?.downloadUrl) {
        window.open(res.downloadUrl, "_blank");
        toast.success("Báo cáo danh sách nhân sự đã được xuất thành công!");
      } else {
        toast.success(res?.message || "Yêu cầu xuất Excel đã được tiếp nhận thành công!");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể xuất file Excel!");
    }
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-600 text-white font-normal">Chính thức</Badge>;
      case "PROBATION":
        return <Badge className="bg-amber-600 text-white font-normal">Thử việc</Badge>;
      case "ON_LEAVE":
        return <Badge className="bg-blue-600 text-white font-normal">Nghỉ chế độ</Badge>;
      case "SUSPENDED":
        return <Badge className="bg-rose-600 text-white font-normal">Tạm đình chỉ</Badge>;
      case "TERMINATED":
        return <Badge className="bg-slate-500 text-white font-normal">Đã thôi việc</Badge>;
      default:
        return <Badge variant="outline">Chưa xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-xl border border-border shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              <span>Hồ sơ Nhân sự & Vòng đời Nhân viên</span>
            </h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
              Module 05
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Quản trị tập trung danh tính nhân viên, diễn biến công tác 3 chiều độc lập (Tổ chức - Địa lý - Chức danh) và lịch sử vòng đời.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-9"
            onClick={handleExportExcel}
            disabled={!selectedCompanyId || isExporting}
          >
            <Download className="h-3.5 w-3.5" />
            {isExporting ? "Đang xuất..." : "Xuất Excel"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5 h-9"
            onClick={() => refetch()}
          >
            Làm mới
          </Button>

          {canManage && (
            <Button
              size="sm"
              className="text-xs gap-2 h-9 bg-primary hover:bg-primary/90 text-white shadow-2xs"
              onClick={() => setIsCreateOpen(true)}
              disabled={!selectedCompanyId}
            >
              <UserPlus className="h-4 w-4" />
              <span>Tiếp nhận Nhân sự Mới</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────── */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Chọn Công ty */}
            <div className="w-full sm:w-60">
              <Select value={selectedCompanyId} onValueChange={(v) => setSelectedCompanyId(v || "")}>
                <SelectTrigger className="h-9 text-xs bg-slate-50/80">
                  <SelectValue placeholder="Chọn công ty..." />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chọn Phòng ban */}
            <div className="w-full sm:w-52">
              <Select value={selectedDeptId} onValueChange={(v) => setSelectedDeptId(v || "all")}>
                <SelectTrigger className="h-9 text-xs bg-slate-50/80">
                  <SelectValue placeholder="Tất cả phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Chọn Trạng thái */}
            <div className="w-full sm:w-44">
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v || "all")}>
                <SelectTrigger className="h-9 text-xs bg-slate-50/80">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="ACTIVE">Chính thức</SelectItem>
                  <SelectItem value="PROBATION">Thử việc</SelectItem>
                  <SelectItem value="ON_LEAVE">Nghỉ chế độ</SelectItem>
                  <SelectItem value="SUSPENDED">Tạm đình chỉ</SelectItem>
                  <SelectItem value="TERMINATED">Đã thôi việc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm mã NV, họ tên, số điện thoại..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          </div>

          <div className="text-xs text-muted-foreground font-medium shrink-0">
            Tổng cộng: <strong className="text-foreground">{totalElements}</strong> nhân sự
          </div>
        </div>
      </div>

      {/* ── Table Content ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-border text-slate-700 font-semibold uppercase tracking-wider text-2xs">
              <tr>
                <th className="py-3 px-4">Nhân sự & Mã NV</th>
                <th className="py-3 px-4">Chiều 1: Phòng ban</th>
                <th className="py-3 px-4">Chiều 2: Chi nhánh</th>
                <th className="py-3 px-4">Chiều 3: Vị trí & Cấp bậc</th>
                <th className="py-3 px-4">Quản lý trực tiếp</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground animate-pulse">
                    Đang nạp danh sách hồ sơ nhân sự...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    Chưa có nhân sự nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(emp.id)}
                  >
                    {/* Cột 1: Avatar & Họ tên & Mã */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-primary/20">
                          {emp.portraitUrl ? (
                            <img
                              src={emp.portraitUrl}
                              alt={emp.fullName}
                              className="h-full w-full rounded-full object-cover"
                            />
                          ) : (
                            emp.firstName.charAt(0)
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {emp.fullName}
                          </div>
                          <div className="font-mono text-2xs text-muted-foreground">
                            {emp.employeeCode} • {emp.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Phòng ban */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{emp.currentDepartmentName || "Chưa phân bổ"}</span>
                      </div>
                    </td>

                    {/* Cột 3: Chi nhánh */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{emp.currentBranchName || "---"}</span>
                      </div>
                    </td>

                    {/* Cột 4: Chức danh & Cấp bậc */}
                    <td className="py-3 px-4">
                      <div className="font-medium text-foreground">
                        {emp.currentJobTitleName || "Chưa gán"}
                      </div>
                      <div className="text-2xs text-muted-foreground">
                        {emp.currentJobLevelName ? `Cấp bậc: ${emp.currentJobLevelName}` : ""}
                      </div>
                    </td>

                    {/* Cột 5: Quản lý trực tiếp */}
                    <td className="py-3 px-4 text-slate-600">
                      {emp.currentManagerName ? (
                        <span className="font-medium">{emp.currentManagerName}</span>
                      ) : (
                        <span className="text-slate-400 italic">Không có (Cấp cao nhất)</span>
                      )}
                    </td>

                    {/* Cột 6: Trạng thái */}
                    <td className="py-3 px-4">
                      {getStatusBadge(emp.currentStatus)}
                    </td>

                    {/* Cột 7: Actions */}
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(emp.id);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Dialogs ──────────────────────────────────────────────────── */}
      <EmployeeCreateDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        companyId={selectedCompanyId}
        onSuccess={() => refetch()}
      />

      <EmployeeDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        employeeId={selectedEmployeeId}
        onSuccess={() => refetch()}
      />
    </div>
  );
}


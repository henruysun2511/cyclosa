"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Download,
  Building2,
  MapPin,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  UserCheck,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { useGetCompaniesQuery, useGetDepartmentsQuery } from "@/features/organization/api";
import { useGetEmployeesQuery, useLazyExportEmployeesQuery } from "@/features/employee/api/employee-api";
import { EmployeeCreateDialog } from "@/features/employee/components/dialogs/employee-create-dialog";
import { EmployeeDetailDialog } from "@/features/employee/components/dialogs/employee-detail-dialog";
import type { EmployeeStatus } from "@/features/employee/types/employee.types";

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
    isFetching,
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

  // Thống kê nhanh từ danh sách
  const activeCount = employees.filter((e) => e.currentStatus === "ACTIVE").length;
  const probationCount = employees.filter((e) => e.currentStatus === "PROBATION").length;
  const leaveCount = employees.filter(
    (e) => e.currentStatus === "ON_LEAVE" || e.currentStatus === "SUSPENDED"
  ).length;

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
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 font-medium">
            Chính thức
          </Badge>
        );
      case "PROBATION":
        return (
          <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 font-medium">
            Thử việc
          </Badge>
        );
      case "ON_LEAVE":
        return (
          <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 font-medium">
            Nghỉ chế độ
          </Badge>
        );
      case "SUSPENDED":
        return (
          <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 font-medium">
            Tạm đình chỉ
          </Badge>
        );
      case "TERMINATED":
        return (
          <Badge className="bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/30 hover:bg-slate-500/25 font-medium">
            Đã thôi việc
          </Badge>
        );
      default:
        return <Badge variant="outline">Chưa xác định</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <span>Hồ sơ Nhân sự & Vòng đời</span>
            </h1>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
              Module 05
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Quản trị tập trung danh tính nhân viên, diễn biến công tác 3 chiều độc lập (Tổ chức - Địa lý - Chức danh) và lịch sử vòng đời.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
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
            disabled={isFetching}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          {canManage && (
            <Button
              size="sm"
              className="text-xs gap-2 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs"
              onClick={() => setIsCreateOpen(true)}
              disabled={!selectedCompanyId}
            >
              <UserPlus className="h-4 w-4" />
              <span>Tiếp nhận Nhân sự Mới</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── KPI Quick Stats ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          onClick={() => setSelectedStatus("all")}
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedStatus === "all" ? "ring-2 ring-primary border-primary" : "border-border"
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng nhân sự</p>
              <p className="text-2xl font-bold mt-1">{totalElements}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus(selectedStatus === "ACTIVE" ? "all" : "ACTIVE")}
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedStatus === "ACTIVE" ? "ring-2 ring-emerald-500 border-emerald-500" : "border-border"
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Chính thức (Active)</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400">{activeCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus(selectedStatus === "PROBATION" ? "all" : "PROBATION")}
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedStatus === "PROBATION" ? "ring-2 ring-amber-500 border-amber-500" : "border-border"
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đang thử việc</p>
              <p className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">{probationCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setSelectedStatus(selectedStatus === "ON_LEAVE" ? "all" : "ON_LEAVE")}
          className={`cursor-pointer transition-all hover:shadow-md border ${
            selectedStatus === "ON_LEAVE" || selectedStatus === "SUSPENDED"
              ? "ring-2 ring-blue-500 border-blue-500"
              : "border-border"
          }`}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Nghỉ chế độ / Tạm hoãn</p>
              <p className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400">{leaveCount}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Filter & Search Toolbar ─────────────────────────────────── */}
      <Card className="border border-border">
        <CardContent className="p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Ô tìm kiếm từ khóa */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã NV, họ tên, số điện thoại..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-9 h-9 text-xs w-full"
            />
          </div>

          {/* Nhóm Select bộ lọc có nhãn rõ ràng, không bao giờ hiện ID, không bị dính vào nhau */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Lọc Công ty */}
            <div className="flex items-center gap-2">
              <label htmlFor="companyFilter" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Công ty:
              </label>
              <select
                id="companyFilter"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="h-9 min-w-[190px] max-w-[260px] truncate rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc Phòng ban */}
            <div className="flex items-center gap-2">
              <label htmlFor="deptFilter" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Phòng ban:
              </label>
              <select
                id="deptFilter"
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="h-9 min-w-[180px] max-w-[240px] truncate rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                <option value="all">Tất cả phòng ban</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Lọc Trạng thái */}
            <div className="flex items-center gap-2">
              <label htmlFor="statusFilter" className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Trạng thái:
              </label>
              <select
                id="statusFilter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 min-w-[150px] rounded-lg border border-input bg-background px-3 py-1.5 text-xs text-foreground ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Chính thức</option>
                <option value="PROBATION">Thử việc</option>
                <option value="ON_LEAVE">Nghỉ chế độ</option>
                <option value="SUSPENDED">Tạm đình chỉ</option>
                <option value="TERMINATED">Đã thôi việc</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Table Content ────────────────────────────────────────────── */}
      <Card className="border border-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="py-3 px-4 font-semibold text-xs">Nhân sự & Mã NV</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Chiều 1: Phòng ban</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Chiều 2: Chi nhánh</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Chiều 3: Vị trí & Cấp bậc</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs">Quản lý trực tiếp</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-center w-32">Trạng thái</TableHead>
                <TableHead className="py-3 px-4 font-semibold text-xs text-right w-28">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground animate-pulse">
                    Đang nạp danh sách hồ sơ nhân sự...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    Chưa có nhân sự nào phù hợp với bộ lọc tìm kiếm.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => handleOpenDetail(emp.id)}
                  >
                    {/* Cột 1: Avatar & Họ tên & Mã */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 border border-primary/20 overflow-hidden">
                          {emp.portraitUrl ? (
                            <img
                              src={emp.portraitUrl}
                              alt={emp.fullName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            emp.firstName.charAt(0)
                          )}
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-foreground hover:text-primary transition-colors text-xs">
                            {emp.fullName}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground mt-0.5">
                            {emp.employeeCode} {emp.phone && `• ${emp.phone}`}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Cột 2: Phòng ban */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-foreground text-xs">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{emp.currentDepartmentName || "Chưa phân bổ"}</span>
                      </div>
                    </TableCell>

                    {/* Cột 3: Chi nhánh */}
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{emp.currentBranchName || "---"}</span>
                      </div>
                    </TableCell>

                    {/* Cột 4: Chức danh & Cấp bậc */}
                    <TableCell className="py-3 px-4">
                      <div className="font-medium text-foreground text-xs">
                        {emp.currentJobTitleName || "Chưa gán"}
                      </div>
                      {emp.currentJobLevelName && (
                        <div className="text-[11px] text-muted-foreground mt-0.5">
                          Cấp bậc: {emp.currentJobLevelName}
                        </div>
                      )}
                    </TableCell>

                    {/* Cột 5: Quản lý trực tiếp */}
                    <TableCell className="py-3 px-4 text-xs">
                      {emp.currentManagerName ? (
                        <span className="font-medium text-foreground">{emp.currentManagerName}</span>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">Không có (Cấp cao nhất)</span>
                      )}
                    </TableCell>

                    {/* Cột 6: Trạng thái */}
                    <TableCell className="py-3 px-4 text-center">
                      {getStatusBadge(emp.currentStatus)}
                    </TableCell>

                    {/* Cột 7: Actions */}
                    <TableCell className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(emp.id);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Xem
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

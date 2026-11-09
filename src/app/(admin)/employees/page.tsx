"use client";

import React, { useState, useEffect } from "react";
import { Users, UserPlus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { useGetCompaniesQuery, useGetDepartmentsQuery } from "@/features/organization/api";
import {
  useGetEmployeesQuery,
  useLazyExportEmployeesQuery,
  useEmployeeFilters,
  EmployeeStatsCards,
  EmployeeFilters,
  EmployeeTable,
  EmployeeFormDialog,
  EmployeeDetailDialog,
  WorkAssignmentDialog,
  StatusChangeDialog,
} from "@/features/employee";
import type { EmployeeDetail } from "@/features/employee/types/employee.types";

export default function EmployeesPage() {
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.EMPLOYEE.CREATE);

  // Hook quản lý filters và phân trang đồng bộ URL Search Params (Rule 7.2 & 4.2)
  const {
    keyword,
    debouncedKeyword,
    companyId,
    departmentId,
    status,
    statusParam,
    page,
    size,
    setKeyword,
    setCompanyId,
    setDepartmentId,
    setStatus,
    setPage,
    setSize,
    resetFilters,
  } = useEmployeeFilters();

  const [triggerExport, { isFetching: isExporting }] = useLazyExportEmployeesQuery();

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeDetail | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [transferEmployeeId, setTransferEmployeeId] = useState<string | null>(null);
  const [statusEmployeeId, setStatusEmployeeId] = useState<string | null>(null);

  // Nạp danh mục công ty
  const { data: companiesData } = useGetCompaniesQuery({ size: 50 });
  const companies = companiesData?.items || [];

  // Tự động gán công ty đầu tiên lên URL nếu chưa có
  useEffect(() => {
    if (!companyId && companies.length > 0) {
      setCompanyId(companies[0].id);
    }
  }, [companies, companyId, setCompanyId]);

  // Nạp danh sách phòng ban theo công ty
  const { data: deptData } = useGetDepartmentsQuery(
    { companyId, size: 100 },
    { skip: !companyId }
  );
  const departments = deptData?.items || [];

  // Nạp danh sách nhân viên từ Backend
  const {
    data: employeePageData,
    isLoading,
    isFetching,
    refetch,
  } = useGetEmployeesQuery({
    companyId: companyId || undefined,
    departmentId: departmentId || undefined,
    status: status,
    keyword: debouncedKeyword.trim() || undefined,
    page,
    size,
  });

  const employees = employeePageData?.items || [];
  const totalElements = employeePageData?.pagination?.total || 0;

  // Thống kê nhanh từ dữ liệu hiện tại
  const activeCount = employees.filter((e) => e.currentStatus === "ACTIVE").length;
  const probationCount = employees.filter((e) => e.currentStatus === "PROBATION").length;
  const leaveCount = employees.filter((e) => e.currentStatus === "ON_LEAVE").length;

  const handleOpenCreate = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (empId: string) => {
    // Tạm lấy thông tin từ danh sách để nạp vào form
    const item = employees.find((e) => e.id === empId);
    if (item) {
      setEditingEmployee({
        ...item,
        currentDepartmentId: departmentId,
        currentBranchId: "",
        currentJobTitleId: "",
        currentJobLevelId: "",
      } as unknown as EmployeeDetail);
      setIsFormOpen(true);
    }
  };

  const handleOpenDetail = (empId: string) => {
    setSelectedEmployeeId(empId);
    setIsDetailOpen(true);
  };

  const handleOpenTransfer = (empId: string) => {
    setTransferEmployeeId(empId);
  };

  const handleOpenStatusChange = (empId: string) => {
    setStatusEmployeeId(empId);
  };

  const handleExport = async () => {
    try {
      toast.info("Đang xuất danh sách hồ sơ nhân viên...");
      const res = await triggerExport({
        companyId: companyId || undefined,
        departmentId: departmentId || undefined,
        status: status,
        keyword: debouncedKeyword.trim() || undefined,
      }).unwrap();

      if (res?.downloadUrl) {
        window.open(res.downloadUrl, "_blank");
        toast.success("Xuất dữ liệu Excel thành công!");
      } else {
        toast.success(res?.message || "Đã xuất dữ liệu thành công!");
      }
    } catch {
      toast.error("Không thể xuất file nhân sự. Vui lòng thử lại sau!");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Trang & Nút Thao tác */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Hồ sơ Nhân sự & Quản trị Tổ chức 3 chiều
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Quản lý vòng đời nhân viên từ tiếp nhận, luân chuyển công tác đến quản lý hợp đồng pháp lý.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          {canManage && (
            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="h-9 gap-1.5 shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              Tiếp nhận nhân sự mới
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thẻ Thống kê nhanh KPI */}
      <EmployeeStatsCards
        total={totalElements}
        activeCount={activeCount}
        probationCount={probationCount}
        leaveCount={leaveCount}
        selectedStatus={statusParam}
        onSelectStatus={setStatus}
      />

      {/* 3. Thanh Lọc Chuẩn Select (Rule 11.8) */}
      <EmployeeFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        companies={companies}
        selectedCompanyId={companyId}
        onCompanyChange={setCompanyId}
        departments={departments}
        selectedDepartmentId={departmentId}
        onDepartmentChange={setDepartmentId}
        selectedStatus={statusParam}
        onStatusChange={setStatus}
        onReset={resetFilters}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* 4. Bảng Dữ liệu & Phân trang */}
      <EmployeeTable
        data={employees}
        pagination={employeePageData?.pagination}
        isLoading={isLoading}
        onPageChange={(pageIndex) => setPage(pageIndex + 1)}
        onPageSizeChange={setSize}
        onViewDetail={handleOpenDetail}
        onEdit={handleOpenEdit}
        onTransfer={handleOpenTransfer}
        onChangeStatus={handleOpenStatusChange}
        canManage={canManage}
      />

      {/* 5. Dialog CRUD Hợp nhất (Rule 11.2) */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={editingEmployee}
        companyId={companyId}
        onSuccess={() => refetch()}
      />

      {/* 6. Dialog Xem Chi tiết 360 độ */}
      <EmployeeDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        employeeId={selectedEmployeeId}
        onSuccess={() => refetch()}
      />

      {/* 7. Dialog Luân chuyển công tác 3 chiều */}
      {transferEmployeeId && (
        <WorkAssignmentDialog
          open={Boolean(transferEmployeeId)}
          onOpenChange={(open) => !open && setTransferEmployeeId(null)}
          employeeId={transferEmployeeId}
          companyId={companyId}
          onSuccess={() => refetch()}
        />
      )}

      {/* 8. Dialog Đổi trạng thái làm việc */}
      {statusEmployeeId && (
        <StatusChangeDialog
          open={Boolean(statusEmployeeId)}
          onOpenChange={(open) => !open && setStatusEmployeeId(null)}
          employeeId={statusEmployeeId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}

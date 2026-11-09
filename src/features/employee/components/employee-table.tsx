"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, ArrowRightLeft, AlertCircle, Loader2 } from "lucide-react";
import { DataPagination } from "@/components/common/data-pagination";
import { EmptyState } from "@/components/common/empty-state";
import {
  EMPLOYEE_STATUS_VARIANTS,
  EMPLOYMENT_TYPE_LABELS,
} from "../constants/employee.constants";
import type { EmployeeSummary } from "../types/employee.types";
import type { PaginationData } from "@/types/api.types";

interface EmployeeTableProps {
  data: EmployeeSummary[];
  pagination?: PaginationData;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onTransfer: (id: string) => void;
  onChangeStatus: (id: string) => void;
  canManage: boolean;
}

export function EmployeeTable({
  data,
  pagination,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onEdit,
  onTransfer,
  onChangeStatus,
  canManage,
}: EmployeeTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Đang tải danh sách nhân sự...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <EmptyState
          title="Không tìm thấy nhân viên nào"
          description="Thử thay đổi bộ lọc hoặc thêm mới nhân sự vào hệ thống."
        />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-xs space-y-4 p-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px] font-semibold">Mã NV</TableHead>
              <TableHead className="min-w-[220px] font-semibold">Họ và tên</TableHead>
              <TableHead className="min-w-[180px] font-semibold">Phòng ban</TableHead>
              <TableHead className="min-w-[160px] font-semibold">Chức danh</TableHead>
              <TableHead className="min-w-[150px] font-semibold">Chi nhánh</TableHead>
              <TableHead className="w-[130px] font-semibold">Hình thức</TableHead>
              <TableHead className="w-[130px] font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[160px] text-right font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((emp) => {
              const statusCfg = EMPLOYEE_STATUS_VARIANTS[emp.currentStatus] || {
                label: emp.currentStatus,
                className: "bg-muted text-muted-foreground",
              };

              return (
                <TableRow key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono text-xs font-semibold text-primary">
                    {emp.employeeCode}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      {emp.portraitUrl ? (
                        <img
                          src={emp.portraitUrl}
                          alt={emp.fullName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.firstName?.charAt(0) || "NV"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <button
                          onClick={() => onViewDetail(emp.id)}
                          className="font-medium text-sm text-foreground hover:text-primary hover:underline block truncate text-left"
                        >
                          {emp.fullName}
                        </button>
                        <p className="text-xs text-muted-foreground truncate">{emp.personalEmail || emp.phone}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-foreground">{emp.currentDepartmentName || "—"}</span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {emp.currentJobTitleName || "—"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {emp.currentBranchName || "—"}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="text-muted-foreground">
                      {emp.currentEmploymentType ? (EMPLOYMENT_TYPE_LABELS[emp.currentEmploymentType] || emp.currentEmploymentType) : "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs font-normal ${statusCfg.className}`}>
                      {statusCfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => onViewDetail(emp.id)}
                        title="Xem chi tiết hồ sơ 360°"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(emp.id)}
                        disabled={!canManage}
                        title={canManage ? "Chỉnh sửa lý lịch" : "Không có quyền chỉnh sửa"}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-blue-600"
                        onClick={() => onTransfer(emp.id)}
                        disabled={!canManage}
                        title={canManage ? "Bổ nhiệm & Luân chuyển 3 chiều" : "Không có quyền"}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-amber-600"
                        onClick={() => onChangeStatus(emp.id)}
                        disabled={!canManage}
                        title={canManage ? "Thay đổi trạng thái công tác" : "Không có quyền"}
                      >
                        <AlertCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang chuẩn DataPagination */}
      {pagination && (
        <div className="pt-2">
          <DataPagination
            pagination={pagination}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}


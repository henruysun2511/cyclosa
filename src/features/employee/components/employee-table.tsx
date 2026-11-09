"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import {
  getEmployeeColumns,
  type EmployeeColumnsOptions,
} from "./employee-columns";
import type { EmployeeSummary } from "../types/employee.types";
import type { PaginationData } from "@/types/api.types";

export interface EmployeeTableProps extends EmployeeColumnsOptions {
  data: EmployeeSummary[];
  pagination?: PaginationData;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
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
  const columns = useMemo(
    () =>
      getEmployeeColumns({
        onViewDetail,
        onEdit,
        onTransfer,
        onChangeStatus,
        canManage,
      }),
    [onViewDetail, onEdit, onTransfer, onChangeStatus, canManage]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyTitle="Không tìm thấy nhân viên nào"
        emptyDescription="Thử thay đổi bộ lọc hoặc tiếp nhận nhân sự mới vào hệ thống."
      />

      {pagination && (
        <DataPagination
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

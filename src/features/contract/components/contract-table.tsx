"use client";

import React, { useMemo } from "react";
import { DataTable } from "@/components/common/data-table";
import { DataPagination } from "@/components/common/data-pagination";
import {
  getContractColumns,
  type ContractColumnsOptions,
} from "./contract-columns";
import type { ContractSummary } from "../types/contract.types";
import type { PaginationData } from "@/types/api.types";

export interface ContractTableProps extends ContractColumnsOptions {
  data: ContractSummary[];
  pagination?: PaginationData;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function ContractTable({
  data,
  pagination,
  isLoading,
  onPageChange,
  onPageSizeChange,
  onViewDetail,
  onEdit,
  onSign,
  onAddAppendix,
  canManage,
}: ContractTableProps) {
  const columns = useMemo(
    () =>
      getContractColumns({
        onViewDetail,
        onEdit,
        onSign,
        onAddAppendix,
        canManage,
      }),
    [onViewDetail, onEdit, onSign, onAddAppendix, canManage]
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        emptyTitle="Không tìm thấy hợp đồng nào"
        emptyDescription="Thử thay đổi bộ lọc hoặc soạn thảo hợp đồng mới cho nhân viên."
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

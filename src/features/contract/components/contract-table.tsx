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
import { Button } from "@/components/ui/button";
import { Eye, Edit3, FileSignature, FilePlus2, Loader2 } from "lucide-react";
import { DataPagination } from "@/components/common/data-pagination";
import { EmptyState } from "@/components/common/empty-state";
import {
  ContractStatusBadge,
  ContractTypeBadge,
} from "./contract-status-badge";
import type { ContractSummary } from "../types/contract.types";
import type { PaginationData } from "@/types/api.types";

interface ContractTableProps {
  data: ContractSummary[];
  pagination?: PaginationData;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onSign: (contract: { id: string; number: string }) => void;
  onAddAppendix: (id: string) => void;
  canManage: boolean;
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
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Đang tải danh sách hợp đồng...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <EmptyState
          title="Không tìm thấy hợp đồng nào"
          description="Thử thay đổi bộ lọc hoặc soạn thảo hợp đồng mới cho nhân viên."
        />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-xs space-y-4 p-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[140px] font-semibold">Số hợp đồng</TableHead>
              <TableHead className="min-w-[200px] font-semibold">Nhân viên</TableHead>
              <TableHead className="min-w-[170px] font-semibold">Loại hợp đồng</TableHead>
              <TableHead className="min-w-[180px] font-semibold">Thời hạn hiệu lực</TableHead>
              <TableHead className="w-[140px] text-right font-semibold">Lương cơ bản</TableHead>
              <TableHead className="w-[130px] font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[160px] text-right font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  {item.contractNumber}
                </TableCell>
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {item.employeeName}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.employeeCode}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <ContractTypeBadge type={item.contractType} />
                </TableCell>
                <TableCell className="text-xs">
                  <div>
                    <span className="font-medium">{item.startDate}</span>
                    <span className="text-muted-foreground"> đến </span>
                    <span className="font-medium">{item.endDate || "Không xác định"}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium text-xs">
                  {formatCurrency(item.baseSalary)}
                </TableCell>
                <TableCell>
                  <ContractStatusBadge status={item.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => onViewDetail(item.id)}
                      title="Xem chi tiết & lịch sử ký số"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item.id)}
                      disabled={!canManage || item.status === "TERMINATED" || item.status === "ACTIVE"}
                      title={canManage ? "Chỉnh sửa hợp đồng" : "Không có quyền"}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    {(item.status === "APPROVED" || item.status === "IN_SIGNING") && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                        onClick={() => onSign({ id: item.id, number: item.contractNumber })}
                        title="Ký số / Gửi ký điện tử"
                      >
                        <FileSignature className="w-4 h-4" />
                      </Button>
                    )}

                    {item.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        onClick={() => onAddAppendix(item.id)}
                        disabled={!canManage}
                        title={canManage ? "Tạo phụ lục điều chỉnh" : "Không có quyền"}
                      >
                        <FilePlus2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
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


"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Edit3,
  FileSignature,
  FilePlus2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ContractStatusBadge,
  ContractTypeBadge,
} from "./contract-status-badge";
import type { ContractSummary } from "../types/contract.types";

export interface ContractTableProps {
  contracts: ContractSummary[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onSign: (contract: { id: string; number: string }) => void;
  onAddAppendix: (id: string) => void;
  canManage: boolean;
}

export function ContractTable({
  contracts,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onEdit,
  onSign,
  onAddAppendix,
  canManage,
}: ContractTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[150px] text-xs font-semibold">Số hợp đồng</TableHead>
              <TableHead className="min-w-[200px] text-xs font-semibold">Nhân viên</TableHead>
              <TableHead className="w-[170px] text-xs font-semibold">Loại hợp đồng</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Thời hạn hiệu lực</TableHead>
              <TableHead className="w-[140px] text-right text-xs font-semibold">Lương cơ bản</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[70px] text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="h-3.5 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-muted-foreground">
                  Không tìm thấy hợp đồng nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((item) => {
                const canEdit =
                  canManage && item.status !== "TERMINATED" && item.status !== "ACTIVE";
                const canSign =
                  item.status === "APPROVED" || item.status === "IN_SIGNING";
                const canAppendix = item.status === "ACTIVE" && canManage;

                return (
                  <TableRow key={item.id} className="hover:bg-muted/25 transition-colors">
                    {/* Số hợp đồng */}
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      <button
                        type="button"
                        onClick={() => onViewDetail(item.id)}
                        className="hover:underline cursor-pointer"
                      >
                        {item.contractNumber}
                      </button>
                    </TableCell>

                    {/* Nhân viên */}
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-foreground truncate">
                          {item.employeeName}
                        </div>
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {item.employeeCode}
                        </div>
                      </div>
                    </TableCell>

                    {/* Loại hợp đồng */}
                    <TableCell>
                      <ContractTypeBadge type={item.contractType} />
                    </TableCell>

                    {/* Thời hạn hiệu lực */}
                    <TableCell className="text-xs">
                      <div>
                        <span className="font-medium text-foreground">{item.startDate}</span>
                        <span className="text-muted-foreground"> đến </span>
                        <span className="font-medium text-foreground">
                          {item.endDate || "Không xác định"}
                        </span>
                      </div>
                    </TableCell>

                    {/* Lương cơ bản */}
                    <TableCell className="text-right font-medium text-xs text-foreground">
                      {formatCurrency(item.baseSalary)}
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <ContractStatusBadge status={item.status} />
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu thao tác</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52 text-xs">
                          <DropdownMenuItem
                            onClick={() => onViewDetail(item.id)}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            <span>Xem chi tiết & Ký số</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEdit(item.id)}
                            disabled={!canEdit}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-foreground" />
                            <span>Chỉnh sửa hợp đồng</span>
                          </DropdownMenuItem>

                          {canSign && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  onSign({ id: item.id, number: item.contractNumber })
                                }
                                className="gap-2 text-xs text-purple-600 focus:text-purple-600 cursor-pointer font-medium"
                              >
                                <FileSignature className="h-3.5 w-3.5" />
                                <span>Ký số / Gửi ký điện tử</span>
                              </DropdownMenuItem>
                            </>
                          )}

                          {canAppendix && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onAddAppendix(item.id)}
                                className="gap-2 text-xs text-emerald-600 focus:text-emerald-600 cursor-pointer font-medium"
                              >
                                <FilePlus2 className="h-3.5 w-3.5" />
                                <span>Lập phụ lục hợp đồng</span>
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Phân trang */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div>
          Tổng số <span className="font-semibold text-foreground">{totalItems}</span> hợp đồng
        </div>

        <div className="flex items-center gap-2">
          <span>
            Trang {page} / {Math.max(totalPages, 1)}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
              className="h-7 w-7 cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
              className="h-7 w-7 cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
import { Badge } from "@/components/ui/badge";
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
  ArrowRightLeft,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  EMPLOYEE_STATUS_VARIANTS,
  EMPLOYMENT_TYPE_LABELS,
} from "../constants/employee.constants";
import type { EmployeeSummary, EmployeeStatus } from "../types/employee.types";

export interface EmployeeTableProps {
  employees: EmployeeSummary[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onTransfer: (id: string) => void;
  onChangeStatus: (id: string) => void;
  canManage: boolean;
}

export function EmployeeTable({
  employees,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onEdit,
  onTransfer,
  onChangeStatus,
  canManage,
}: EmployeeTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[120px] text-xs font-semibold">Mã NV</TableHead>
              <TableHead className="min-w-[240px] text-xs font-semibold">Họ và tên</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Phòng ban</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">Chức danh</TableHead>
              <TableHead className="w-[150px] text-xs font-semibold">Chi nhánh</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Hình thức</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[70px] text-right text-xs font-semibold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-muted animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-3.5 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-xs text-muted-foreground">
                  Không tìm thấy nhân viên nào phù hợp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => {
                const status = emp.currentStatus as EmployeeStatus;
                const statusCfg = EMPLOYEE_STATUS_VARIANTS[status] || {
                  label: status,
                  className: "bg-muted text-muted-foreground",
                };
                const initials = `${emp.lastName?.charAt(0) || ""}${emp.firstName?.charAt(0) || "NV"}`.toUpperCase() || "NV";

                return (
                  <TableRow key={emp.id} className="hover:bg-muted/25 transition-colors">
                    {/* Mã NV */}
                    <TableCell className="font-mono text-xs font-semibold text-primary">
                      <button
                        type="button"
                        onClick={() => onViewDetail(emp.id)}
                        className="hover:underline cursor-pointer"
                      >
                        {emp.employeeCode}
                      </button>
                    </TableCell>

                    {/* Họ và tên & Email */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 uppercase overflow-hidden border border-border/60">
                          {emp.portraitUrl ? (
                            <img
                              src={emp.portraitUrl}
                              alt={emp.fullName}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            initials
                          )}
                        </div>
                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => onViewDetail(emp.id)}
                            className="font-semibold text-xs text-foreground truncate block hover:text-primary hover:underline text-left cursor-pointer"
                          >
                            {emp.fullName}
                          </button>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {emp.personalEmail || emp.phone || "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phòng ban */}
                    <TableCell className="text-xs font-medium text-foreground">
                      {emp.currentDepartmentName || "—"}
                    </TableCell>

                    {/* Chức danh */}
                    <TableCell className="text-xs text-muted-foreground">
                      {emp.currentJobTitleName || "—"}
                    </TableCell>

                    {/* Chi nhánh */}
                    <TableCell className="text-xs text-muted-foreground">
                      {emp.currentBranchName || "—"}
                    </TableCell>

                    {/* Hình thức */}
                    <TableCell className="text-xs text-muted-foreground">
                      {emp.currentEmploymentType
                        ? EMPLOYMENT_TYPE_LABELS[emp.currentEmploymentType] || emp.currentEmploymentType
                        : "—"}
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs font-normal whitespace-nowrap ${statusCfg.className}`}
                      >
                        {statusCfg.label}
                      </Badge>
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
                            onClick={() => onViewDetail(emp.id)}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-primary" />
                            <span>Xem hồ sơ 360°</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onEdit(emp.id)}
                            disabled={!canManage}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-foreground" />
                            <span>Chỉnh sửa lý lịch</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => onTransfer(emp.id)}
                            disabled={!canManage}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
                            <span>Bổ nhiệm & Luân chuyển</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => onChangeStatus(emp.id)}
                            disabled={!canManage}
                            className="gap-2 text-xs cursor-pointer"
                          >
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                            <span>Đổi trạng thái công tác</span>
                          </DropdownMenuItem>
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
          Tổng số <span className="font-semibold text-foreground">{totalItems}</span> nhân sự
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

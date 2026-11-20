"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  ExternalLink,
  FolderOpen,
  Phone,
  Mail,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetEmployeesQuery } from "@/features/employee/api/employee-api";
import {
  EMPLOYEE_STATUS_VARIANTS,
  EMPLOYMENT_TYPE_LABELS,
} from "@/features/employee/constants/employee.constants";
import type { EmployeeStatus, EmploymentType } from "@/features/employee/types/employee.types";
import type { Department, DepartmentNode } from "../../types/department.types";
import { useDebounce } from "use-debounce";

interface DepartmentEmployeeListProps {
  department: Department | DepartmentNode | null;
}

export function DepartmentEmployeeList({
  department,
}: DepartmentEmployeeListProps) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword] = useDebounce(keyword, 350);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Reset page khi đổi phòng ban
  React.useEffect(() => {
    setPage(1);
    setKeyword("");
  }, [department?.id]);

  const { data, isLoading, isFetching } = useGetEmployeesQuery(
    {
      departmentId: department?.id,
      keyword: debouncedKeyword || undefined,
      page,
      size: pageSize,
    },
    { skip: !department?.id }
  );

  const employees = data?.items || [];
  const pagination = data?.pagination;
  const totalEmployees = pagination?.total ?? employees.length;

  return (
    <div className="table-card p-5 space-y-4">
      {/* ── Tiêu đề danh sách nhân sự trực thuộc ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <Users className="h-4 w-4 text-primary shrink-0" />
          <h3 className="text-base font-bold text-foreground">
            Danh sách nhân sự
            {department ? (
              <span className="text-primary font-semibold ml-1.5">
                • {department.name} ({department.code})
              </span>
            ) : (
              <span className="text-muted-foreground font-normal ml-1.5">
                (Chưa chọn đơn vị)
              </span>
            )}
          </h3>

          {department && (
            <Badge variant="secondary" className="text-xs font-medium ml-1">
              {totalEmployees} nhân sự
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {/* Ô tìm kiếm nhân viên trong phòng ban */}
          {department && (
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Tìm họ tên, mã NV..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className="pl-8 h-8 text-xs bg-background border-border"
              />
            </div>
          )}

          {department && (
            <Link
              href={`/employees?departmentId=${department.id}`}
              className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
            >
              <span>Xem trang Nhân sự</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Bảng Nhân sự (Tuân thủ Golden Rule 04: Table-Embedded Empty State) ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">
                  STT
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[200px]">
                  Họ và tên & Mã NV
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[150px]">
                  Chức danh / Vị trí
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[180px]">
                  Thông tin liên hệ
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[120px]">
                  Hình thức làm việc
                </TableHead>
                <TableHead className="text-xs font-semibold min-w-[120px]">
                  Trạng thái
                </TableHead>
                <TableHead className="w-20 text-center text-xs font-semibold">
                  Thao tác
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!department ? (
                /* Chưa chọn phòng ban */
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="h-44 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <UserCheck className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Chưa chọn phòng ban</p>
                      <p className="text-xs text-muted-foreground">
                        Nhấp chuột vào một phòng ban trên cây sơ đồ bên trên để xem danh sách nhân sự
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : isLoading || isFetching ? (
                /* Đang tải dữ liệu */
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-7 w-12 rounded mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : employees.length === 0 ? (
                /* Phòng ban không có nhân sự nào */
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="h-44 text-center text-muted-foreground"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">
                        Phòng ban chưa có nhân sự nào
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {debouncedKeyword
                          ? "Không tìm thấy nhân sự phù hợp với từ khóa tìm kiếm"
                          : "Hiện tại chưa có nhân sự nào được phân bổ vào đơn vị này"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                /* Danh sách nhân sự */
                employees.map((emp, index) => {
                  const status = emp.currentStatus as EmployeeStatus;
                  const statusCfg = EMPLOYEE_STATUS_VARIANTS[status] || {
                    label: status,
                    className: "bg-muted text-muted-foreground",
                  };
                  const initials = `${emp.lastName?.charAt(0) || ""}${
                    emp.firstName?.charAt(0) || "NV"
                  }`.toUpperCase() || "NV";

                  const employmentType =
                    emp.currentEmploymentType as EmploymentType;
                  const employmentLabel =
                    (employmentType && EMPLOYMENT_TYPE_LABELS[employmentType]) ||
                    "—";

                  return (
                    <TableRow
                      key={emp.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      {/* STT */}
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>

                      {/* Họ tên & Mã NV */}
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
                          <div className="space-y-0.5">
                            <p className="font-semibold text-xs text-foreground">
                              {emp.fullName}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono">
                              {emp.employeeCode}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Chức danh / Vị trí */}
                      <TableCell className="text-xs font-medium text-foreground">
                        {emp.currentJobTitleName || (
                          <span className="text-muted-foreground italic">
                            Chưa phân bổ
                          </span>
                        )}
                      </TableCell>

                      {/* Liên hệ */}
                      <TableCell className="text-xs space-y-1">
                        {emp.personalEmail && (
                          <div className="flex items-center gap-1.5 text-muted-foreground truncate max-w-[200px]">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{emp.personalEmail}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Phone className="h-3 w-3 shrink-0" />
                            <span>{emp.phone}</span>
                          </div>
                        )}
                      </TableCell>

                      {/* Hình thức làm việc */}
                      <TableCell className="text-xs text-foreground">
                        {employmentLabel}
                      </TableCell>

                      {/* Trạng thái */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[11px] font-medium border-transparent ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>

                      {/* Thao tác */}
                      <TableCell className="text-center">
                        <Link href={`/employees/${emp.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
                          >
                            Hồ sơ
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── Phân trang ────────────────────────────────────────────── */}
        {department && pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-border text-xs text-muted-foreground bg-muted/20">
            <span>
              Trang {page} / {pagination.pages} (Tổng {pagination.total} nhân sự)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-7 px-2 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                <span>Trước</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="h-7 px-2 text-xs"
              >
                <span>Sau</span>
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

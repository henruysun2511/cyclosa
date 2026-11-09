"use client";

import React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit3,
  ArrowRightLeft,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EMPLOYEE_STATUS_VARIANTS,
  EMPLOYMENT_TYPE_LABELS,
} from "../constants/employee.constants";
import type { EmployeeSummary, EmployeeStatus } from "../types/employee.types";

export interface EmployeeColumnsOptions {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onTransfer: (id: string) => void;
  onChangeStatus: (id: string) => void;
  canManage: boolean;
}

export function getEmployeeColumns({
  onViewDetail,
  onEdit,
  onTransfer,
  onChangeStatus,
  canManage,
}: EmployeeColumnsOptions): ColumnDef<EmployeeSummary>[] {
  return [
    {
      accessorKey: "employeeCode",
      header: "Mã NV",
      cell: ({ row }) => {
        const emp = row.original;
        return (
          <Link
            href={`/employees/${emp.id}`}
            className="font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {emp.employeeCode}
          </Link>
        );
      },
    },
    {
      accessorKey: "fullName",
      header: "Họ và tên",
      cell: ({ row }) => {
        const emp = row.original;
        const initials = `${emp.lastName?.charAt(0) || ""}${emp.firstName?.charAt(0) || "NV"}`.toUpperCase() || "NV";

        return (
          <div className="flex items-center gap-3">
            {emp.portraitUrl ? (
              <img
                src={emp.portraitUrl}
                alt={emp.fullName}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-border shadow-2xs"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/employees/${emp.id}`}
                className="font-medium text-sm text-foreground hover:text-primary hover:underline block truncate text-left cursor-pointer"
              >
                {emp.fullName}
              </Link>
              <p className="text-xs text-muted-foreground truncate font-normal">
                {emp.personalEmail || emp.phone || "—"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "currentDepartmentName",
      header: "Phòng ban",
      cell: ({ row }) => (
        <span className="font-medium text-xs text-foreground">
          {row.original.currentDepartmentName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "currentJobTitleName",
      header: "Chức danh",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.currentJobTitleName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "currentBranchName",
      header: "Chi nhánh",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.currentBranchName || "—"}
        </span>
      ),
    },
    {
      accessorKey: "currentEmploymentType",
      header: "Hình thức",
      cell: ({ row }) => {
        const type = row.original.currentEmploymentType;
        return (
          <span className="text-xs text-muted-foreground">
            {type ? EMPLOYMENT_TYPE_LABELS[type] || type : "—"}
          </span>
        );
      },
    },
    {
      accessorKey: "currentStatus",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.currentStatus as EmployeeStatus;
        const statusCfg = EMPLOYEE_STATUS_VARIANTS[status] || {
          label: status,
          className: "bg-muted text-muted-foreground",
        };
        return (
          <Badge
            variant="outline"
            className={`text-xs font-normal whitespace-nowrap ${statusCfg.className}`}
          >
            {statusCfg.label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const emp = row.original;

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Thao tác</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-54">
                <DropdownMenuItem
                  onClick={() => onViewDetail(emp.id)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 text-primary" />
                  <span>Xem hồ sơ 360°</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onEdit(emp.id)}
                  disabled={!canManage}
                  className="cursor-pointer"
                >
                  <Edit3 className="mr-2 h-4 w-4 text-foreground" />
                  <span>Chỉnh sửa lý lịch</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onTransfer(emp.id)}
                  disabled={!canManage}
                  className="cursor-pointer"
                >
                  <ArrowRightLeft className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Bổ nhiệm & Luân chuyển</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onChangeStatus(emp.id)}
                  disabled={!canManage}
                  className="cursor-pointer"
                >
                  <AlertCircle className="mr-2 h-4 w-4 text-amber-600" />
                  <span>Đổi trạng thái công tác</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}


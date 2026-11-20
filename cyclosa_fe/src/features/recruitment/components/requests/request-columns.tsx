"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Send, CheckCircle2, XCircle, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RequestStatusBadge } from "./request-status-badge";
import { EMPLOYMENT_TYPE_LABELS } from "../../constants/recruitment.constants";
import type { RecruitmentRequestDto } from "../../types/recruitment.types";

export interface RequestColumnsOptions {
  onViewDetail: (request: RecruitmentRequestDto) => void;
  onEdit: (request: RecruitmentRequestDto) => void;
  onSubmit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  canManage: boolean;
  canApprove: boolean;
}

export function getRequestColumns({
  onViewDetail,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onDelete,
  canManage,
  canApprove,
}: RequestColumnsOptions): ColumnDef<RecruitmentRequestDto>[] {
  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return [
    {
      accessorKey: "code",
      header: "Mã đề xuất",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <button
            type="button"
            onClick={() => onViewDetail(item)}
            className="font-mono text-xs font-semibold text-primary hover:underline text-left"
          >
            {item.code}
          </button>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Vị trí tuyển dụng",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div>
            <p className="font-semibold text-xs text-foreground line-clamp-1">{item.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {item.departmentName || "Phòng ban nội bộ"}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "headcount",
      header: "Chỉ tiêu",
      cell: ({ row }) => {
        return (
          <span className="font-mono text-xs font-bold text-foreground">
            {row.original.headcount} nhân sự
          </span>
        );
      },
    },
    {
      accessorKey: "employmentType",
      header: "Hình thức",
      cell: ({ row }) => {
        const type = row.original.employmentType;
        return (
          <span className="text-xs text-muted-foreground">
            {EMPLOYMENT_TYPE_LABELS[type] || type}
          </span>
        );
      },
    },
    {
      accessorKey: "minSalary",
      header: "Mức lương dự kiến",
      cell: ({ row }) => {
        const item = row.original;
        if (!item.minSalary && !item.maxSalary) {
          return <span className="text-xs text-muted-foreground">Thỏa thuận</span>;
        }
        return (
          <span className="text-xs text-foreground font-mono">
            {formatCurrency(item.minSalary)} - {formatCurrency(item.maxSalary)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        return <RequestStatusBadge status={row.original.status} />;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày lập",
      cell: ({ row }) => {
        const d = row.original.createdAt;
        if (!d) return "-";
        return (
          <span className="text-xs text-muted-foreground">
            {new Date(d).toLocaleDateString("vi-VN")}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const item = row.original;
        const isPending = item.status === "PENDING_APPROVAL";

        return (
          <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                <DropdownMenuItem onClick={() => onViewDetail(item)}>
                  <Eye className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span>Xem chi tiết</span>
                </DropdownMenuItem>

                {canManage && isPending && (
                  <DropdownMenuItem onClick={() => onEdit(item)}>
                    <Edit className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span>Chỉnh sửa</span>
                  </DropdownMenuItem>
                )}

                {canManage && isPending && (
                  <DropdownMenuItem onClick={() => onSubmit(item.id)}>
                    <Send className="h-3.5 w-3.5 mr-2 text-blue-600" />
                    <span>Trình duyệt</span>
                  </DropdownMenuItem>
                )}

                {canApprove && isPending && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onApprove(item.id)}
                      className="text-emerald-600 focus:text-emerald-700 font-medium"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                      <span>Phê duyệt đề xuất</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onReject(item.id)}
                      className="text-rose-600 focus:text-rose-700 font-medium"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-2" />
                      <span>Từ chối</span>
                    </DropdownMenuItem>
                  </>
                )}

                {canManage && isPending && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(item.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      <span>Xóa đề xuất</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}


"use client";

import React from "react";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Edit3,
  FileSignature,
  FilePlus2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContractStatusBadge,
  ContractTypeBadge,
} from "./contract-status-badge";
import type { ContractSummary } from "../types/contract.types";

export interface ContractColumnsOptions {
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onSign: (contract: { id: string; number: string }) => void;
  onAddAppendix: (id: string) => void;
  canManage: boolean;
}

export function getContractColumns({
  onViewDetail,
  onEdit,
  onSign,
  onAddAppendix,
  canManage,
}: ContractColumnsOptions): ColumnDef<ContractSummary>[] {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return [
    {
      accessorKey: "contractNumber",
      header: "Số hợp đồng",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link
            href={`/contracts/${item.id}`}
            className="font-mono text-xs font-semibold text-primary hover:underline"
          >
            {item.contractNumber}
          </Link>
        );
      },
    },
    {
      accessorKey: "employeeName",
      header: "Nhân viên",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="min-w-0">
            <p className="font-medium text-sm text-foreground truncate">
              {item.employeeName}
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              {item.employeeCode}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "contractType",
      header: "Loại hợp đồng",
      cell: ({ row }) => (
        <ContractTypeBadge type={row.original.contractType} />
      ),
    },
    {
      accessorKey: "startDate",
      header: "Thời hạn hiệu lực",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-xs">
            <span className="font-medium text-foreground">{item.startDate}</span>
            <span className="text-muted-foreground"> đến </span>
            <span className="font-medium text-foreground">
              {item.endDate || "Không xác định"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "baseSalary",
      header: () => <div className="text-right">Lương cơ bản</div>,
      cell: ({ row }) => (
        <div className="text-right font-medium text-xs text-foreground">
          {formatCurrency(row.original.baseSalary)}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <ContractStatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Thao tác</div>,
      cell: ({ row }) => {
        const item = row.original;
        const canEdit =
          canManage && item.status !== "TERMINATED" && item.status !== "ACTIVE";
        const canSign =
          item.status === "APPROVED" || item.status === "IN_SIGNING";
        const canAppendix = item.status === "ACTIVE" && canManage;

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
                  onClick={() => onViewDetail(item.id)}
                  className="cursor-pointer"
                >
                  <Eye className="mr-2 h-4 w-4 text-primary" />
                  <span>Xem chi tiết & Ký số</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onEdit(item.id)}
                  disabled={!canEdit}
                  className="cursor-pointer"
                >
                  <Edit3 className="mr-2 h-4 w-4 text-foreground" />
                  <span>Chỉnh sửa hợp đồng</span>
                </DropdownMenuItem>

                {canSign && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        onSign({ id: item.id, number: item.contractNumber })
                      }
                      className="cursor-pointer text-purple-600 focus:text-purple-700 font-medium"
                    >
                      <FileSignature className="mr-2 h-4 w-4" />
                      <span>Ký số / Gửi ký điện tử</span>
                    </DropdownMenuItem>
                  </>
                )}

                {canAppendix && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onAddAppendix(item.id)}
                      className="cursor-pointer text-emerald-600 focus:text-emerald-700 font-medium"
                    >
                      <FilePlus2 className="mr-2 h-4 w-4" />
                      <span>Lập phụ lục hợp đồng</span>
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


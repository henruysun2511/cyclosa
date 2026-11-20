"use client";

import React from "react";
import { FolderOpen, MoreHorizontal, Eye, Pencil, Trash2, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPagination } from "@/components/common/data-pagination";
import type { WorkplaceSite } from "../../types/workplace.types";

interface WorkplaceSiteTableProps {
  sites: WorkplaceSite[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (id: string) => void;
  onEdit: (site: WorkplaceSite) => void;
  onDelete: (id: string, name: string) => void;
}

export function WorkplaceSiteTable({
  sites,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onEdit,
  onDelete,
}: WorkplaceSiteTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="w-28 text-xs font-semibold">Mã cơ sở</TableHead>
                <TableHead className="text-xs font-semibold">Tên tòa nhà / Cơ sở</TableHead>
                <TableHead className="text-xs font-semibold">Chi nhánh</TableHead>
                <TableHead className="text-xs font-semibold">Địa chỉ</TableHead>
                <TableHead className="w-24 text-center text-xs font-semibold">Số tầng</TableHead>
                <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-5 w-10 mx-auto rounded-full" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-7 w-7 mx-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : sites.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Không tìm thấy dữ liệu tòa nhà phù hợp</p>
                      <p className="text-xs text-muted-foreground">
                        Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sites.map((site, index) => (
                  <TableRow key={site.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {(page - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="text-xs font-mono font-medium text-primary">
                      {site.code}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{site.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {site.branchName || "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate" title={site.address}>
                      {site.address}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {site.floorCount ?? 0} tầng
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => onViewDetail(site.id)}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(site)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(site.id, site.name)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            <span>Xóa cơ sở</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination theo Rule 06 */}
      {!isLoading && totalPages > 0 && (
        <DataPagination
          pagination={{
            page: page - 1,
            size: 10,
            total: totalItems,
            pages: totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }}
          onPageChange={(p) => onPageChange(p + 1)}
        />
      )}
    </div>
  );
}

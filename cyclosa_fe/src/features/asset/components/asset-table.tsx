"use client";

import React from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  RotateCcw,
  PackageX,
  Laptop,
} from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ASSET_STATUS_COLORS,
  ASSET_STATUS_LABELS,
  ASSET_CONDITION_COLORS,
  ASSET_CONDITION_LABELS,
} from "../constants/asset.constants";
import type { AssetSummary } from "../types/asset.types";

interface AssetTableProps {
  assets: AssetSummary[];
  page: number;
  size: number;
  isLoading: boolean;
  onEdit: (asset: AssetSummary) => void;
  onDelete: (asset: AssetSummary) => void;
  onAssign: (asset: AssetSummary) => void;
  onReturn: (asset: AssetSummary) => void;
}

export function AssetTable({
  assets,
  page,
  size,
  isLoading,
  onEdit,
  onDelete,
  onAssign,
  onReturn,
}: AssetTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs">Đang tải danh sách tài sản...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-14 text-center font-semibold text-xs">
                STT
              </TableHead>
              <TableHead className="min-w-[200px] font-semibold text-xs">
                Mã & Tên tài sản
              </TableHead>
              <TableHead className="min-w-[130px] font-semibold text-xs">
                Loại tài sản
              </TableHead>
              <TableHead className="min-w-[150px] font-semibold text-xs">
                Serial / Model
              </TableHead>
              <TableHead className="min-w-[180px] font-semibold text-xs">
                Người đang giữ
              </TableHead>
              <TableHead className="min-w-[120px] font-semibold text-xs text-center">
                Trạng thái
              </TableHead>
              <TableHead className="min-w-[110px] font-semibold text-xs text-center">
                Tình trạng
              </TableHead>
              <TableHead className="w-16 text-center font-semibold text-xs">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <PackageX className="h-6 w-6 text-muted-foreground/60" />
                    </div>
                    <p className="font-medium text-sm text-foreground">
                      Không tìm thấy tài sản nào
                    </p>
                    <p className="text-xs text-muted-foreground max-w-sm">
                      Không có hiện vật tài sản nào phù hợp với điều kiện tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc tạo tài sản mới.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              assets.map((item, index) => {
                const statusColor = ASSET_STATUS_COLORS[item.status];
                const conditionColor = ASSET_CONDITION_COLORS[item.conditionStatus];

                return (
                  <TableRow
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* STT (page - 1) * size + index + 1 */}
                    <TableCell className="text-center font-mono text-xs text-muted-foreground">
                      {(page - 1) * size + index + 1}
                    </TableCell>

                    {/* Mã & Tên tài sản */}
                    <TableCell>
                      <div className="flex items-start gap-2.5">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Laptop className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/assets/${item.id}`}
                            className="font-medium text-xs text-foreground hover:text-primary transition-colors block truncate"
                          >
                            {item.name}
                          </Link>
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {item.assetCode}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Loại tài sản */}
                    <TableCell>
                      <span className="text-xs text-foreground font-medium">
                        {item.categoryName}
                      </span>
                    </TableCell>

                    {/* Serial / Model */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-mono text-foreground">
                          {item.serialNumber || "—"}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                          {[item.manufacturer, item.model]
                            .filter(Boolean)
                            .join(" / ") || "—"}
                        </p>
                      </div>
                    </TableCell>

                    {/* Người đang giữ */}
                    <TableCell>
                      {item.currentEmployeeName ? (
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium text-foreground">
                            {item.currentEmployeeName}
                          </p>
                          <p className="text-[11px] font-mono text-muted-foreground">
                            {item.currentEmployeeCode}
                            {item.currentDepartmentName &&
                              ` • ${item.currentDepartmentName}`}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">
                          Chưa cấp phát
                        </span>
                      )}
                    </TableCell>

                    {/* Trạng thái vận hành */}
                    <TableCell className="text-center">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-normal px-2 py-0.5 border ${statusColor.bg} ${statusColor.border}`}
                      >
                        {ASSET_STATUS_LABELS[item.status]}
                      </Badge>
                    </TableCell>

                    {/* Tình trạng hiện vật */}
                    <TableCell className="text-center">
                      <span
                        className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-md ${conditionColor.bg}`}
                      >
                        {ASSET_CONDITION_LABELS[item.conditionStatus]}
                      </span>
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/assets/${item.id}`}
                              className="cursor-pointer flex items-center"
                            >
                              <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                              Chi tiết tài sản
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit(item)}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2 text-muted-foreground" />
                            Chỉnh sửa
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          {item.status === "AVAILABLE" && (
                            <DropdownMenuItem
                              onClick={() => onAssign(item)}
                              className="cursor-pointer text-blue-600 focus:text-blue-600"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Cấp phát máy
                            </DropdownMenuItem>
                          )}

                          {item.status === "ASSIGNED" && (
                            <DropdownMenuItem
                              onClick={() => onReturn(item)}
                              className="cursor-pointer text-amber-600 focus:text-amber-600"
                            >
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Thu hồi / Hoàn trả
                            </DropdownMenuItem>
                          )}

                          {item.status !== "ASSIGNED" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa tài sản
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
    </div>
  );
}

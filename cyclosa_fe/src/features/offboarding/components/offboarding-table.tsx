"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Trash2,
  Inbox,
  Calendar,
} from "lucide-react";
import type { OffboardingRequest } from "../types/offboarding.types";
import {
  OffboardingStatusBadge,
  OffboardingTypeBadge,
} from "./offboarding-badges";

interface OffboardingTableProps {
  data: OffboardingRequest[];
  isLoading?: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onApprove?: (request: OffboardingRequest) => void;
  onReject?: (request: OffboardingRequest) => void;
  onDelete?: (request: OffboardingRequest) => void;
}

export function OffboardingTable({
  data,
  isLoading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onApprove,
  onReject,
  onDelete,
}: OffboardingTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-[280px]">Nhân viên</TableHead>
              <TableHead className="w-[180px]">Loại hồ sơ</TableHead>
              <TableHead className="w-[160px]">Ngày làm việc cuối</TableHead>
              <TableHead className="w-[200px]">Tiến độ bàn giao</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="h-16 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // Embedded Empty State (Rule 04)
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2.5 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
                      <Inbox className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium">Chưa có hồ sơ thôi việc nào</div>
                    <div className="text-xs text-muted-foreground text-center">
                      Danh sách trống hoặc không tìm thấy kết quả phù hợp với bộ lọc hiện tại.
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const initials = item.employeeName
                  ? item.employeeName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(-2)
                      .join("")
                      .toUpperCase()
                  : "NV";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/40 transition-colors">
                    {/* Nhân viên */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full border border-border bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                          {initials}
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/offboarding/${item.id}`}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors hover:underline"
                          >
                            {item.employeeName}
                          </Link>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="font-mono">{item.employeeCode}</span>
                            {item.departmentName && (
                              <>
                                <span>•</span>
                                <span>{item.departmentName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Loại hồ sơ */}
                    <TableCell>
                      <div className="space-y-1">
                        <OffboardingTypeBadge type={item.type} />
                        {item.decisionNumber && (
                          <div className="text-xs font-mono text-muted-foreground">
                            {item.decisionNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Ngày làm việc cuối */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{item.actualLastWorkingDate}</span>
                      </div>
                    </TableCell>

                    {/* Tiến độ bàn giao */}
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {item.clearedItemsCount}/{item.totalClearanceItems} hạng mục
                          </span>
                          <span className="font-medium text-foreground">
                            {item.clearanceProgressPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary h-full transition-all rounded-full"
                            style={{ width: `${item.clearanceProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <OffboardingStatusBadge status={item.status} />
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/offboarding/${item.id}`} className="flex items-center">
                              <Eye className="w-4 h-4 mr-2" />
                              Chi tiết hồ sơ
                            </Link>
                          </DropdownMenuItem>

                          {item.status === "PENDING" && onApprove && (
                            <DropdownMenuItem
                              onClick={() => onApprove(item)}
                              className="text-emerald-600 dark:text-emerald-400 focus:text-emerald-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Phê duyệt đơn
                            </DropdownMenuItem>
                          )}

                          {item.status === "PENDING" && onReject && (
                            <DropdownMenuItem
                              onClick={() => onReject(item)}
                              className="text-rose-600 dark:text-rose-400 focus:text-rose-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Từ chối đơn
                            </DropdownMenuItem>
                          )}

                          {(item.status === "PENDING" || item.status === "REJECTED") && onDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-rose-600 focus:text-rose-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa hồ sơ
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

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <div>
            Trang {page} / {totalPages} (Tổng cộng {totalElements} hồ sơ)
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 text-xs"
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 text-xs"
            >
              Trang sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

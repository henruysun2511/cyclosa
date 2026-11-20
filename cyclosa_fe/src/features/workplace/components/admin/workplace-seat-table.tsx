"use client";

import React from "react";
import { FolderOpen, MoreHorizontal, Eye, Wrench, CheckCircle, Ban, Armchair, User, UserX } from "lucide-react";
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
import { SEAT_STATUS_OPTIONS, SEAT_TYPE_OPTIONS } from "../../constants/workplace.constants";
import type { WorkplaceSeatDetail, SeatStatus } from "../../types/workplace.types";

interface WorkplaceSeatTableProps {
  seats: WorkplaceSeatDetail[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
  onViewDetail: (id: string) => void;
  onUpdateStatus: (seatId: string, newStatus: SeatStatus) => void;
  onAssignSeat?: (seat: WorkplaceSeatDetail) => void;
  onReleaseSeat?: (seat: WorkplaceSeatDetail) => void;
}

export function WorkplaceSeatTable({
  seats,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onViewDetail,
  onUpdateStatus,
  onAssignSeat,
  onReleaseSeat,
}: WorkplaceSeatTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="w-28 text-xs font-semibold">Mã bàn</TableHead>
                <TableHead className="text-xs font-semibold">Vị trí (Tòa nhà / Tầng / Phân khu)</TableHead>
                <TableHead className="text-xs font-semibold">Loại chỗ ngồi</TableHead>
                <TableHead className="text-xs font-semibold">Người sử dụng</TableHead>
                <TableHead className="w-36 text-center text-xs font-semibold">Trạng thái</TableHead>
                <TableHead className="w-20 text-center text-xs font-semibold">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-24 mx-auto rounded-full" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-7 w-7 mx-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : seats.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Không tìm thấy dữ liệu bàn làm việc phù hợp</p>
                      <p className="text-xs text-muted-foreground">
                        Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc bên trên
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                seats.map((seat, index) => {
                  const statusConfig =
                    SEAT_STATUS_OPTIONS.find((s) => s.value === seat.status) || SEAT_STATUS_OPTIONS[0];
                  const typeConfig =
                    SEAT_TYPE_OPTIONS.find((t) => t.value === seat.seatType) || SEAT_TYPE_OPTIONS[0];

                  return (
                    <TableRow key={seat.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {(page - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-medium text-primary">
                        <div className="flex items-center gap-1.5">
                          <Armchair className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span>{seat.seatCode}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        <div className="space-y-0.5">
                          <p className="font-medium">{seat.siteName} • {seat.floorName}</p>
                          <p className="text-muted-foreground text-[11px]">{seat.zoneName || "Khu vực chung"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {typeConfig.label}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {seat.currentEmployeeName ? (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="font-medium">{seat.currentEmployeeName}</span>
                            {seat.currentEmployeeCode && (
                              <span className="text-[11px] text-muted-foreground font-mono">({seat.currentEmployeeCode})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">Trống</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {/* Nút bấm chuyển đổi nhanh trạng thái đáp ứng Rule & phản hồi tức thì */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const nextStatus: SeatStatus =
                              seat.status === "IN_SERVICE" ? "MAINTENANCE" : "IN_SERVICE";
                            onUpdateStatus(seat.id, nextStatus);
                          }}
                          className={`h-7 px-2.5 text-xs rounded-full border transition-all ${statusConfig.color}`}
                          title="Click để chuyển nhanh trạng thái giữa Sẵn sàng và Bảo trì"
                        >
                          {statusConfig.label}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={() => onViewDetail(seat.id)}>
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              <span>Xem chi tiết & Tài sản</span>
                            </DropdownMenuItem>
                            {seat.seatType === "DEDICATED" && (
                              seat.currentEmployeeName ? (
                                onReleaseSeat && (
                                  <DropdownMenuItem
                                    onClick={() => onReleaseSeat(seat)}
                                    className="text-rose-600 focus:text-rose-600 dark:text-rose-400"
                                  >
                                    <UserX className="h-3.5 w-3.5 mr-2" />
                                    <span>Thu hồi chỗ ngồi</span>
                                  </DropdownMenuItem>
                                )
                              ) : (
                                onAssignSeat && (
                                  <DropdownMenuItem onClick={() => onAssignSeat(seat)}>
                                    <User className="h-3.5 w-3.5 mr-2" />
                                    <span>Phân bổ chỗ ngồi</span>
                                  </DropdownMenuItem>
                                )
                              )
                            )}
                            <DropdownMenuItem onClick={() => onUpdateStatus(seat.id, "IN_SERVICE")}>
                              <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-600" />
                              <span>Mở sẵn sàng sử dụng</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(seat.id, "MAINTENANCE")}>
                              <Wrench className="h-3.5 w-3.5 mr-2 text-amber-600" />
                              <span>Đánh dấu bảo trì</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateStatus(seat.id, "BLOCKED")}>
                              <Ban className="h-3.5 w-3.5 mr-2 text-rose-600" />
                              <span>Khóa bàn tạm thời</span>
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
      </div>

      {!isLoading && totalPages > 0 && (
        <DataPagination
          pagination={{
            page: page - 1,
            size: 15,
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

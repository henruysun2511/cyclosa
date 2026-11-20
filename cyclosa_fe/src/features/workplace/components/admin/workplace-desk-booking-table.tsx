"use client";

import React from "react";
import { FolderOpen, XCircle, Clock, CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataPagination } from "@/components/common/data-pagination";
import type { DeskBooking, BookingStatus } from "../../types/workplace.types";

interface WorkplaceDeskBookingTableProps {
  bookings: DeskBooking[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  cancelledMap: Record<string, boolean>;
  onPageChange: (newPage: number) => void;
  onCancelBooking: (booking: DeskBooking) => void;
}

export function WorkplaceDeskBookingTable({
  bookings,
  isLoading,
  page,
  totalPages,
  totalItems,
  cancelledMap,
  onPageChange,
  onCancelBooking,
}: WorkplaceDeskBookingTableProps) {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-600 text-white hover:bg-blue-600">Đã xác nhận</Badge>;
      case "CHECKED_IN":
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Đã Check-in</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-muted-foreground border-border">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-12 text-center text-xs font-semibold">STT</TableHead>
                <TableHead className="text-xs font-semibold">Nhân viên</TableHead>
                <TableHead className="w-32 text-xs font-semibold">Mã bàn Hot-desk</TableHead>
                <TableHead className="text-xs font-semibold">Địa điểm / Tầng</TableHead>
                <TableHead className="w-32 text-xs font-semibold">Ngày làm việc</TableHead>
                <TableHead className="w-32 text-xs font-semibold">Trạng thái</TableHead>
                <TableHead className="w-36 text-xs font-semibold">Check-in lúc</TableHead>
                <TableHead className="w-24 text-right text-xs font-semibold pr-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right pr-4"><Skeleton className="h-7 w-14 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Không tìm thấy lượt đặt bàn nào phù hợp</p>
                      <p className="text-xs text-muted-foreground">
                        Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh lại bộ lọc trạng thái bên trên
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking, index) => {
                  const isCancelled = cancelledMap[booking.id] || booking.status === "CANCELLED";
                  const effectiveStatus: BookingStatus = isCancelled ? "CANCELLED" : booking.status;
                  return (
                    <TableRow key={booking.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {(page - 1) * 15 + index + 1}
                      </TableCell>
                      <TableCell className="text-xs font-medium text-foreground">
                        {booking.employeeName}
                      </TableCell>
                      <TableCell className="text-xs font-mono font-semibold text-primary">
                        {booking.seatCode}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {[booking.siteName, booking.floorName].filter(Boolean).join(" • ") || "—"}
                      </TableCell>
                      <TableCell className="text-xs text-foreground font-medium">
                        {booking.bookingDate}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(effectiveStatus)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {booking.checkedInAt ? new Date(booking.checkedInAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—"}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {effectiveStatus !== "CANCELLED" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => onCancelBooking(booking)}
                          >
                            Hủy đặt
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Đã hủy</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!isLoading && totalPages > 1 && (
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

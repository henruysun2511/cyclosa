"use client";

import React from "react";
import { FolderOpen, Video, Users, Clock, Calendar } from "lucide-react";
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
import type { RoomBooking, BookingStatus } from "../../types/workplace.types";

interface WorkplaceRoomBookingTableProps {
  bookings: RoomBooking[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  cancelledMap: Record<string, boolean>;
  onPageChange: (newPage: number) => void;
  onCancelBooking: (booking: RoomBooking) => void;
}

export function WorkplaceRoomBookingTable({
  bookings,
  isLoading,
  page,
  totalPages,
  totalItems,
  cancelledMap,
  onPageChange,
  onCancelBooking,
}: WorkplaceRoomBookingTableProps) {
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge className="bg-blue-600 text-white hover:bg-blue-600">Đã xác nhận</Badge>;
      case "CHECKED_IN":
        return <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">Đang diễn ra</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="text-muted-foreground border-border">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
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
                <TableHead className="text-xs font-semibold">Cuộc họp / Mục đích</TableHead>
                <TableHead className="w-48 text-xs font-semibold">Phòng họp</TableHead>
                <TableHead className="w-36 text-xs font-semibold">Người đặt</TableHead>
                <TableHead className="w-44 text-xs font-semibold">Bắt đầu</TableHead>
                <TableHead className="w-44 text-xs font-semibold">Kết thúc</TableHead>
                <TableHead className="w-24 text-center text-xs font-semibold">Số người</TableHead>
                <TableHead className="w-32 text-xs font-semibold">Trạng thái</TableHead>
                <TableHead className="w-24 text-right text-xs font-semibold pr-4">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="hover:bg-transparent">
                    <TableCell className="text-center"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
                    <TableCell className="text-right pr-4"><Skeleton className="h-7 w-14 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FolderOpen className="h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium">Không tìm thấy lịch đặt phòng họp nào</p>
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
                      <TableCell>
                        <div className="font-medium text-xs text-foreground">{booking.title}</div>
                        {booking.description && (
                          <div className="text-[11px] text-muted-foreground line-clamp-1">{booking.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-primary">
                        {booking.roomName}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {booking.organizerName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {formatDateTime(booking.startTime)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {formatDateTime(booking.endTime)}
                      </TableCell>
                      <TableCell className="text-center text-xs text-foreground">
                        {booking.attendeeCount}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(effectiveStatus)}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {effectiveStatus !== "CANCELLED" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                            onClick={() => onCancelBooking(booking)}
                          >
                            Hủy lịch
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  RefreshCw,
  Search,
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  Armchair,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  useGetDeskBookingsQuery,
  useCancelDeskBookingMutation,
} from "@/features/workplace/api/workplace-api";
import { WorkplaceDeskBookingTable } from "@/features/workplace/components/admin/workplace-desk-booking-table";
import { WorkplaceDeskBookingCalendar } from "@/features/workplace/components/admin/workplace-desk-booking-calendar";
import { useWorkplaceFilters } from "@/features/workplace/hooks/use-workplace-filters";
import type { DeskBooking } from "@/features/workplace/types/workplace.types";

export default function WorkplaceDeskBookingsPage() {
  const { filters, setFilter, resetFilters, page, setPage } = useWorkplaceFilters();
  const [cancelledMap, setCancelledMap] = useState<Record<string, boolean>>({});
  const [isCalendarView, setIsCalendarView] = useState(true);

  const {
    data: bookingsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetDeskBookingsQuery({
    page,
    size: 15,
  });

  const [cancelBooking] = useCancelDeskBookingMutation();

  const allBookings = bookingsData?.items || [];
  const pagination = bookingsData?.pagination;

  // Filter in-memory for search and status
  const filteredBookings = allBookings.filter((b: DeskBooking) => {
    const isCancelled = cancelledMap[b.id] || b.status === "CANCELLED";
    const effectiveStatus = isCancelled ? "CANCELLED" : b.status;

    if (filters.status && filters.status !== "ALL" && effectiveStatus !== filters.status) {
      return false;
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const matchName = b.employeeName.toLowerCase().includes(s);
      const matchSeat = b.seatCode.toLowerCase().includes(s);
      const matchSite = b.siteName?.toLowerCase().includes(s) || false;
      if (!matchName && !matchSeat && !matchSite) return false;
    }
    return true;
  });

  const confirmedCount = allBookings.filter((b) => !cancelledMap[b.id] && b.status === "CONFIRMED").length;
  const checkedInCount = allBookings.filter((b) => !cancelledMap[b.id] && b.status === "CHECKED_IN").length;
  const cancelledCount = allBookings.filter((b) => cancelledMap[b.id] || b.status === "CANCELLED").length;

  const handleCancelBooking = async (booking: DeskBooking) => {
    if (!confirm(`Bạn có chắc chắn muốn hủy lượt đặt bàn ${booking.seatCode} của ${booking.employeeName}?`)) return;

    setCancelledMap((prev) => ({ ...prev, [booking.id]: true }));
    try {
      await cancelBooking(booking.id).unwrap();
      toast.success(`Đã hủy lượt đặt bàn ${booking.seatCode} thành công!`);
    } catch (err: any) {
      setCancelledMap((prev) => {
        const copy = { ...prev };
        delete copy[booking.id];
        return copy;
      });
      const msg = err?.data?.message || "Hủy lượt đặt bàn thất bại.";
      toast.error(msg);
    }
  };

  const hasActiveFilters = Boolean(filters.search || (filters.status && filters.status !== "ALL"));

  return (
    <div className="space-y-6">
      {/* ── Page Header Standard Rule 02 ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <CalendarDays className="w-6 h-6 text-primary shrink-0" />
            <span>Quản lý Đặt Bàn làm việc Linh hoạt</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Đặt bàn linh hoạt</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* ── 4 KPI Cards Standard Rule 03 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter("status", "ALL")}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all hover:border-primary/50 ${
            !filters.status || filters.status === "ALL"
              ? "border-primary/50 bg-primary/5"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Tổng lượt đặt</p>
              <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
                {pagination?.total ?? allBookings.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <Armchair className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter("status", "CONFIRMED")}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all hover:border-blue-500/50 ${
            filters.status === "CONFIRMED"
              ? "border-blue-500/50 bg-blue-500/5"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã xác nhận</p>
              <p className="text-2xl font-bold tracking-tight text-blue-600 mt-1">
                {confirmedCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter("status", "CHECKED_IN")}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all hover:border-emerald-500/50 ${
            filters.status === "CHECKED_IN"
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã nhận chỗ</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 mt-1">
                {checkedInCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div
          onClick={() => setFilter("status", "CANCELLED")}
          className={`cursor-pointer rounded-xl border p-4 shadow-2xs transition-all hover:border-destructive/50 ${
            filters.status === "CANCELLED"
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Đã hủy</p>
              <p className="text-2xl font-bold tracking-tight text-destructive mt-1">
                {cancelledCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 2-Row Filter Bar Standard Rule 03 ────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-xs space-y-3">
        {/* Row 1: Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            placeholder="Tìm theo tên nhân viên, mã bàn, địa điểm tòa nhà..."
            className="pl-9 pr-9 h-9 text-xs"
          />
          {filters.search && (
            <button
              onClick={() => setFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Row 2: Selects, Reset & View Mode Toggle (Chuẩn UI Cơ cấu tổ chức) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={filters.status || "ALL"}
              onValueChange={(val: string | null) => val && setFilter("status", val)}
            >
              <SelectTrigger className="h-8 text-xs w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
                <SelectItem value="CHECKED_IN">Đã nhận chỗ</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Xóa bộ lọc</span>
              </Button>
            )}
          </div>

          {/* View Mode Toggle: Lịch vs Bảng (Chuẩn UI Cơ cấu tổ chức) */}
          <div className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-2xs shrink-0">
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                isCalendarView
                  ? "bg-primary text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsCalendarView(true)}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span>Dạng lịch</span>
            </button>
            <button
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                !isCalendarView
                  ? "bg-primary text-white shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setIsCalendarView(false)}
            >
              <List className="h-3.5 w-3.5" />
              <span>Dạng bảng</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Calendar or Table View Switch ───────────────────────────────── */}
      {isCalendarView ? (
        <WorkplaceDeskBookingCalendar
          bookings={filteredBookings}
          isLoading={isLoading}
          cancelledMap={cancelledMap}
          onCancelBooking={handleCancelBooking}
        />
      ) : (
        <WorkplaceDeskBookingTable
          bookings={filteredBookings}
          isLoading={isLoading}
          page={page}
          totalPages={pagination?.pages || 1}
          totalItems={pagination?.total || filteredBookings.length}
          cancelledMap={cancelledMap}
          onPageChange={setPage}
          onCancelBooking={handleCancelBooking}
        />
      )}
    </div>
  );
}

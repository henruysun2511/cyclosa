"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Armchair,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DeskBooking, BookingStatus } from "../../types/workplace.types";

interface WorkplaceDeskBookingCalendarProps {
  bookings: DeskBooking[];
  isLoading: boolean;
  cancelledMap: Record<string, boolean>;
  onCancelBooking: (booking: DeskBooking) => void;
}

export function WorkplaceDeskBookingCalendar({
  bookings,
  isLoading,
  cancelledMap,
  onCancelBooking,
}: WorkplaceDeskBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayBookings, setSelectedDayBookings] = useState<{
    dateStr: string;
    bookings: DeskBooking[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Monday is start of week (0=Mon, ..., 6=Sun)
  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay === -1) startingDay = 6;

  const totalDays = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // Grid days
  const daysInGrid: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    daysInGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysInGrid.push(d);
  }

  const todayStr = new Date().toISOString().split("T")[0];

  const getDayDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const getBookingsForDay = (day: number) => {
    const dayStr = getDayDateStr(day);
    return bookings.filter((b) => b.bookingDate === dayStr);
  };

  const getEffectiveStatus = (b: DeskBooking): BookingStatus => {
    if (cancelledMap[b.id] || b.status === "CANCELLED") return "CANCELLED";
    return b.status;
  };

  const weekDayNames = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];

  return (
    <div className="space-y-4">
      {/* ── 1. Calendar Header & Controls ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold capitalize text-foreground flex items-center gap-2">
              {monthLabel}
            </h2>
            <p className="text-xs text-muted-foreground">
              Tổng số {bookings.length} lượt đặt bàn trong hệ thống
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="sm" onClick={handleToday} className="text-xs h-8">
            Hôm nay
          </Button>
          <div className="flex items-center rounded-lg border border-border bg-muted/20 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="h-7 w-7 rounded-md"
              title="Tháng trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="h-7 w-7 rounded-md"
              title="Tháng sau"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. Calendar Grid ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold text-muted-foreground">
          {weekDayNames.map((name, idx) => (
            <div
              key={name}
              className={`py-2.5 ${idx >= 5 ? "text-rose-500/80 bg-muted/20" : ""}`}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border text-xs">
          {daysInGrid.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] bg-muted/10 p-2 opacity-50"
                />
              );
            }

            const dayDateStr = getDayDateStr(day);
            const isToday = dayDateStr === todayStr;
            const dayBookings = getBookingsForDay(day);
            const hasBookings = dayBookings.length > 0;
            const isWeekend = idx % 7 >= 5;

            return (
              <div
                key={`day-${day}`}
                onClick={() => {
                  if (hasBookings) {
                    setSelectedDayBookings({ dateStr: dayDateStr, bookings: dayBookings });
                  }
                }}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  isWeekend ? "bg-muted/5" : "bg-card"
                } ${
                  hasBookings
                    ? "cursor-pointer hover:bg-primary/5 hover:border-primary/40"
                    : "hover:bg-muted/15"
                } ${isToday ? "ring-2 ring-primary ring-inset bg-primary/5" : ""}`}
              >
                {/* Day Number Header */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center font-semibold text-xs ${
                      isToday
                        ? "h-6 w-6 rounded-full bg-primary text-white font-bold shadow-xs"
                        : isWeekend
                        ? "text-rose-500 font-medium"
                        : "text-foreground"
                    }`}
                  >
                    {day}
                  </span>

                  {hasBookings && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-4 px-1 font-mono bg-primary/10 text-primary border-primary/20"
                    >
                      {dayBookings.length}
                    </Badge>
                  )}
                </div>

                {/* Day Bookings List Preview */}
                <div className="space-y-1 mt-1.5 flex-1 overflow-hidden">
                  {dayBookings.slice(0, 2).map((b) => {
                    const status = getEffectiveStatus(b);
                    const isCancelled = status === "CANCELLED";

                    return (
                      <div
                        key={b.id}
                        className={`truncate px-1.5 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 ${
                          isCancelled
                            ? "bg-muted text-muted-foreground line-through opacity-70"
                            : status === "CHECKED_IN"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                        }`}
                        title={`${b.seatCode} - ${b.employeeName}`}
                      >
                        <Armchair className="h-3 w-3 shrink-0" />
                        <span className="font-semibold shrink-0">{b.seatCode}:</span>
                        <span className="truncate">{b.employeeName}</span>
                      </div>
                    );
                  })}

                  {dayBookings.length > 2 && (
                    <p className="text-[10px] text-primary font-medium text-center hover:underline pt-0.5">
                      +{dayBookings.length - 2} lượt đặt khác
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 3. Legend ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground px-1">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Đã xác nhận (CONFIRMED)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 inline-block" />
            <span>Đã Check-in (CHECKED_IN)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400 inline-block" />
            <span>Đã hủy (CANCELLED)</span>
          </div>
        </div>
        <p className="italic text-[11px]">Nhấp vào ngày có lịch đặt để xem chi tiết & hủy đặt bàn</p>
      </div>

      {/* ── 4. Dialog Chi tiết đặt bàn theo ngày ───────────────────────── */}
      <Dialog
        open={Boolean(selectedDayBookings)}
        onOpenChange={(open) => !open && setSelectedDayBookings(null)}
      >
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <span>
                Lịch đặt bàn ngày:{" "}
                {selectedDayBookings
                  ? new Date(selectedDayBookings.dateStr).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            {selectedDayBookings?.bookings.map((booking, idx) => {
              const status = getEffectiveStatus(booking);
              const isCancelled = status === "CANCELLED";

              return (
                <div
                  key={booking.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCancelled
                      ? "bg-muted/30 border-dashed border-border opacity-70"
                      : "bg-card border-border shadow-2xs hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                          <Armchair className="h-4 w-4 text-primary" />
                          Bàn {booking.seatCode}
                        </span>
                        {status === "CONFIRMED" && (
                          <Badge className="bg-blue-600 text-white text-[10px] h-5">
                            Đã xác nhận
                          </Badge>
                        )}
                        {status === "CHECKED_IN" && (
                          <Badge className="bg-emerald-600 text-white text-[10px] h-5">
                            Đã Check-in
                          </Badge>
                        )}
                        {status === "CANCELLED" && (
                          <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
                            Đã hủy
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        {booking.employeeName}
                      </p>

                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {booking.siteName || "Cơ sở chính"}
                        {booking.floorName ? ` • ${booking.floorName}` : ""}
                      </p>

                      {booking.checkedInAt && (
                        <p className="text-[11px] text-emerald-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Check-in: {new Date(booking.checkedInAt).toLocaleTimeString("vi-VN")}
                        </p>
                      )}
                    </div>

                    {!isCancelled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          onCancelBooking(booking);
                          setSelectedDayBookings((prev) => {
                            if (!prev) return null;
                            return {
                              ...prev,
                              bookings: prev.bookings.map((b) =>
                                b.id === booking.id ? { ...b, status: "CANCELLED" } : b
                              ),
                            };
                          });
                        }}
                        className="text-xs h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Hủy đặt
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

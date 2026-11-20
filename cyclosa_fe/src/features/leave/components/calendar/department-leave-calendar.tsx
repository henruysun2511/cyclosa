"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Users,
} from "lucide-react";
import { LeaveGroupBadge } from "../shared/leave-group-badge";
import { DAY_PORTION_LABELS } from "../../constants/leave.constants";
import type { LeaveCalendarEventDto } from "../../types/leave.types";

interface DepartmentLeaveCalendarProps {
  events: LeaveCalendarEventDto[];
  isLoading: boolean;
  currentDate: Date;
  onMonthChange: (newDate: Date) => void;
}

export function DepartmentLeaveCalendar({
  events,
  isLoading,
  currentDate,
  onMonthChange,
}: DepartmentLeaveCalendarProps) {
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    dateStr: string;
    events: LeaveCalendarEventDto[];
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Monday is start of week (0=Sun, 1=Mon, ..., 6=Sat)
  let startingDay = firstDayOfMonth.getDay() - 1;
  if (startingDay === -1) startingDay = 6; // Sunday becomes index 6

  const totalDays = lastDayOfMonth.getDate();

  const handlePrevMonth = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    onMonthChange(new Date());
  };

  const monthLabel = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(currentDate);

  // Create grid cells
  const daysInGrid: (number | null)[] = [];
  for (let i = 0; i < startingDay; i++) {
    daysInGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysInGrid.push(d);
  }

  // Helper to find events on a given day
  const getEventsForDay = (day: number) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    return events.filter((ev) => {
      return ev.startDate <= dayStr && ev.endDate >= dayStr;
    });
  };

  const weekDayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      {/* Calendar Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold capitalize text-foreground flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            {monthLabel}
          </h2>
          <Button variant="outline" size="sm" onClick={handleToday} className="text-xs h-8">
            Hôm nay
          </Button>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-8 w-8"
            title="Tháng trước"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-8 w-8"
            title="Tháng sau"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center text-xs font-semibold text-muted-foreground py-2.5">
          {weekDayNames.map((name, idx) => (
            <div
              key={name}
              className={idx >= 5 ? "text-rose-600 dark:text-rose-400 font-bold" : ""}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Days matrix */}
        {isLoading ? (
          <div className="p-16 text-center text-sm text-muted-foreground animate-pulse">
            Đang tải dữ liệu lịch nghỉ phép...
          </div>
        ) : (
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border/60">
            {daysInGrid.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[90px] bg-muted/10 p-2"
                  />
                );
              }

              const dayStr = `${year}-${String(month + 1).padStart(
                2,
                "0"
              )}-${String(day).padStart(2, "0")}`;
              const dayEvents = getEventsForDay(day);
              const isToday = dayStr === todayStr;
              const isWeekendDay = (idx % 7) >= 5;

              return (
                <div
                  key={`day-${day}`}
                  onClick={() =>
                    dayEvents.length > 0 &&
                    setSelectedDayEvents({ dateStr: dayStr, events: dayEvents })
                  }
                  className={`min-h-[90px] p-2 flex flex-col justify-between transition-colors ${
                    isToday ? "bg-primary/5 ring-1 ring-inset ring-primary/40" : ""
                  } ${isWeekendDay ? "bg-muted/15" : "hover:bg-muted/30"} ${
                    dayEvents.length > 0 ? "cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold inline-flex items-center justify-center h-6 w-6 rounded-full ${
                        isToday
                          ? "bg-primary text-primary-foreground font-black"
                          : isWeekendDay
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-foreground"
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        {dayEvents.length} người
                      </span>
                    )}
                  </div>

                  {/* Leave Events Pills */}
                  <div className="space-y-1 mt-1.5 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[11px] font-medium leading-tight px-1.5 py-0.5 rounded truncate bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                        title={`${ev.employeeFullName} (${ev.leaveTypeName} - ${DAY_PORTION_LABELS[ev.dayPortion]})`}
                      >
                        {ev.employeeFullName}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-muted-foreground font-medium pl-1">
                        +{dayEvents.length - 2} người khác...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Day Modal / Details Drawer */}
      {selectedDayEvents && (
        <Card className="border border-primary/20 bg-card shadow-md">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Danh sách nhân sự nghỉ ngày{" "}
                {new Date(selectedDayEvents.dateStr).toLocaleDateString("vi-VN")}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDayEvents(null)}
              className="text-xs h-7"
            >
              Đóng
            </Button>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {selectedDayEvents.events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-center justify-between p-2.5 rounded-lg border bg-background"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {ev.employeeFullName}{" "}
                    <span className="text-xs font-normal text-muted-foreground font-mono">
                      ({ev.employeeCode})
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ev.departmentName || "Chưa phân phòng ban"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <LeaveGroupBadge group={ev.leaveGroup} />
                  <span className="text-xs font-medium text-foreground">
                    {DAY_PORTION_LABELS[ev.dayPortion]}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


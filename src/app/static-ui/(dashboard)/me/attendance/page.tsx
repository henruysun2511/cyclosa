"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Download,
  FileText,
  MapPin,
  Send,
  ArrowLeft,
  Home,
  Check,
  RotateCcw,
  User,
  Building2,
  CalendarDays,
  Smartphone,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Trạng thái ngày chấm công theo yêu cầu:
// - FULL (Xanh): Đủ công (1.0 công)
// - PARTIAL (Vàng): Thiếu công (0.5 công, đi muộn, về sớm, nửa ngày)
// - MISSING (Đỏ): Chưa đủ công (0.0 công, vắng mặt, quên chấm)
// - WEEKEND: Ngày nghỉ cuối tuần (T7, CN)
// - FUTURE: Ngày chưa đến
export type AttendanceStatus = "FULL" | "PARTIAL" | "MISSING" | "WEEKEND" | "FUTURE";

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  dayOfMonth: number;
  dayOfWeek: number; // 0 = CN, 1 = T2, ..., 6 = T7
  status: AttendanceStatus;
  workUnits: number; // 1.0, 0.5, 0.0
  checkIn?: string;
  checkOut?: string;
  duration?: string;
  shiftName: string;
  location?: string;
  note?: string;
  lateMinutes?: number;
  earlyMinutes?: number;
  needsExplanation?: boolean;
}

const MOCK_OCT_2026: Record<string, AttendanceRecord> = {
  "2026-10-01": {
    date: "2026-10-01",
    dayOfMonth: 1,
    dayOfWeek: 4, // T5
    status: "FULL",
    workUnits: 1.0,
    checkIn: "07:55",
    checkOut: "17:35",
    duration: "8h 40m",
    shiftName: "Ca Hành Chính (08:00 - 17:30)",
    location: "Trụ Sở Chính — FSI Tower",
    note: "Đi làm đúng giờ, đủ ca",
  },
  "2026-10-02": {
    date: "2026-10-02",
    dayOfMonth: 2,
    dayOfWeek: 5, // T6
    status: "MISSING", // Đỏ: Chưa đủ công
    workUnits: 0.0,
    checkIn: "07:58",
    checkOut: "--:--",
    duration: "--",
    shiftName: "Ca Hành Chính (08:00 - 17:30)",
    location: "Trụ Sở Chính — FSI Tower",
    note: "Thiếu giờ ra (chưa chấm check-out)",
    needsExplanation: true,
  },
  "2026-10-03": {
    date: "2026-10-03",
    dayOfMonth: 3,
    dayOfWeek: 6, // T7
    status: "WEEKEND",
    workUnits: 0,
    shiftName: "Nghỉ cuối tuần",
    note: "Nghỉ Thứ Bảy",
  },
  "2026-10-04": {
    date: "2026-10-04",
    dayOfMonth: 4,
    dayOfWeek: 0, // CN
    status: "WEEKEND",
    workUnits: 0,
    shiftName: "Nghỉ cuối tuần",
    note: "Nghỉ Chủ Nhật",
  },
  "2026-10-05": {
    date: "2026-10-05",
    dayOfMonth: 5,
    dayOfWeek: 1, // T2
    status: "PARTIAL", // Vàng: Thiếu công
    workUnits: 0.5,
    checkIn: "08:45",
    checkOut: "17:32",
    duration: "7h 47m",
    shiftName: "Ca Hành Chính (08:00 - 17:30)",
    location: "Trụ Sở Chính — FSI Tower",
    lateMinutes: 45,
    note: "Đi muộn 45 phút (sau 08:30)",
    needsExplanation: true,
  },
  "2026-10-06": {
    date: "2026-10-06",
    dayOfMonth: 6,
    dayOfWeek: 2, // T3
    status: "FULL",
    workUnits: 1.0,
    checkIn: "07:50",
    checkOut: "17:40",
    duration: "8h 50m",
    shiftName: "Ca Hành Chính (08:00 - 17:30)",
    location: "Trụ Sở Chính — FSI Tower",
    note: "Đi làm đúng giờ, đủ ca",
  },
  "2026-10-07": {
    date: "2026-10-07",
    dayOfMonth: 7,
    dayOfWeek: 3, // T4 (Hôm nay)
    status: "FULL",
    workUnits: 1.0,
    checkIn: "07:52",
    checkOut: "17:30",
    duration: "8h 38m",
    shiftName: "Ca Hành Chính (08:00 - 17:30)",
    location: "Trụ Sở Chính — FSI Tower",
    note: "Hôm nay: Đã hoàn thành ca làm việc",
  },
};

function generateMonthDays(year: number, monthIndex: number): AttendanceRecord[] {
  const totalDays = new Date(year, monthIndex + 1, 0).getDate();
  const list: AttendanceRecord[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const d = new Date(year, monthIndex, day);
    const dayOfWeek = d.getDay();
    const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (year === 2026 && monthIndex === 9 && MOCK_OCT_2026[dateStr]) {
      list.push(MOCK_OCT_2026[dateStr]);
      continue;
    }

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFuture =
      year > 2026 ||
      (year === 2026 && monthIndex > 9) ||
      (year === 2026 && monthIndex === 9 && day > 7);

    if (isFuture) {
      list.push({
        date: dateStr,
        dayOfMonth: day,
        dayOfWeek,
        status: isWeekend ? "WEEKEND" : "FUTURE",
        workUnits: 0,
        shiftName: isWeekend ? "Nghỉ cuối tuần" : "Ca Hành Chính (08:00 - 17:30)",
        note: isWeekend ? "Nghỉ tuần" : "Chưa đến ngày làm việc",
      });
    } else if (isWeekend) {
      list.push({
        date: dateStr,
        dayOfMonth: day,
        dayOfWeek,
        status: "WEEKEND",
        workUnits: 0,
        shiftName: "Nghỉ cuối tuần",
        note: "Nghỉ tuần",
      });
    } else {
      list.push({
        date: dateStr,
        dayOfMonth: day,
        dayOfWeek,
        status: "FULL",
        workUnits: 1.0,
        checkIn: "07:55",
        checkOut: "17:35",
        duration: "8h 40m",
        shiftName: "Ca Hành Chính (08:00 - 17:30)",
        location: "Trụ Sở Chính — FSI Tower",
        note: "Đi làm đúng giờ",
      });
    }
  }

  return list;
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const WEEKDAYS_FULL = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

export default function MyAttendancePage() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 9 = Tháng 10
  const [selectedDateStr, setSelectedDateStr] = useState<string>("2026-10-07");

  // Modal giải trình
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [explainReason, setExplainReason] = useState("Quên quét mã chấm công");
  const [explainNotes, setExplainNotes] = useState("");
  const [explainInTime, setExplainInTime] = useState("08:00");
  const [explainOutTime, setExplainOutTime] = useState("17:30");

  const daysInMonth = useMemo(() => {
    return generateMonthDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const selectedDay = useMemo(() => {
    return (
      daysInMonth.find((d) => d.date === selectedDateStr) ||
      daysInMonth[0]
    );
  }, [daysInMonth, selectedDateStr]);

  const prefixEmptyDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  }, [currentYear, currentMonth]);

  // Thống kê tổng hợp mềm mại
  const stats = useMemo(() => {
    let fullDays = 0;
    let partialDays = 0;
    let missingDays = 0;
    let totalWorkUnits = 0;

    daysInMonth.forEach((d) => {
      if (d.status === "FULL") {
        fullDays += 1;
        totalWorkUnits += d.workUnits;
      } else if (d.status === "PARTIAL") {
        partialDays += 1;
        totalWorkUnits += d.workUnits;
      } else if (d.status === "MISSING") {
        missingDays += 1;
      }
    });

    return {
      fullDays,
      partialDays,
      missingDays,
      totalWorkUnits,
      standardDays: 22,
    };
  }, [daysInMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9);
    setSelectedDateStr("2026-10-07");
  };

  const handleOpenExplain = (day: AttendanceRecord) => {
    setExplainReason("Quên quẹt thẻ lúc ra về");
    setExplainInTime(day.checkIn && day.checkIn !== "--:--" ? day.checkIn : "08:00");
    setExplainOutTime(day.checkOut && day.checkOut !== "--:--" ? day.checkOut : "17:30");
    setExplainNotes("");
    setIsExplainOpen(true);
  };

  const handleSubmitExplanation = () => {
    toast.success(
      `Đã gửi đơn giải trình ngày ${selectedDay?.date} đến người duyệt thành công!`
    );
    setIsExplainOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Header (Tương tự Dashboard: đơn giản, mềm mại, sạch sẽ) ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Lịch sử chấm công
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Theo dõi nhật ký chấm công của bạn và giải trình các ngày thiếu công.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Bộ chọn tháng/năm nhẹ nhàng */}
          <div className="flex items-center gap-1 rounded-lg border border-input bg-card px-2 py-1 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:text-foreground hover:bg-muted rounded transition-colors"
              title="Tháng trước"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            <span className="font-medium text-foreground px-1.5 min-w-[95px] text-center font-mono">
              Tháng {currentMonth + 1} / {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:text-foreground hover:bg-muted rounded transition-colors"
              title="Tháng sau"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-8 text-xs"
          >
            Hôm nay
          </Button>

          <Button
            asChild
            size="sm"
            className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Link href="/me/attendance/check-in">
              <Clock className="h-3.5 w-3.5" />
              <span>Chấm công</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ── 2. Thẻ KPI tổng kết tháng (Phong cách Dashboard) ────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng công */}
        <Card className="border-border bg-card shadow-xs hover:shadow-sm transition-all">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Tổng công lũy kế
              </span>
              <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <CalendarIcon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
                {stats.totalWorkUnits.toFixed(1)}{" "}
                <span className="text-xs text-muted-foreground font-normal">
                  / {stats.standardDays} công
                </span>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (stats.totalWorkUnits / stats.standardDays) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Đủ công (Xanh) */}
        <Card className="border-border bg-card shadow-xs hover:shadow-sm transition-all">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Đủ công (Xanh)
              </span>
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-emerald-600 font-mono">
                {stats.fullDays}{" "}
                <span className="text-xs text-muted-foreground font-normal">ngày</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Đi làm đầy đủ, 1.0 công/ngày
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Thiếu công (Vàng) */}
        <Card className="border-border bg-card shadow-xs hover:shadow-sm transition-all">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Thiếu công (Vàng)
              </span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-amber-600 font-mono">
                {stats.partialDays}{" "}
                <span className="text-xs text-muted-foreground font-normal">ngày</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                0.5 công (Đi muộn / về sớm)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Chưa đủ công (Đỏ) */}
        <Card className="border-border bg-card shadow-xs hover:shadow-sm transition-all">
          <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">
                Chưa đủ công (Đỏ)
              </span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-rose-600 font-mono">
                {stats.missingDays}{" "}
                <span className="text-xs text-muted-foreground font-normal">ngày</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                0.0 công (Cần gửi giải trình)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Khu vực Bố cục 2 cột (Lịch bên trái, Chi tiết bên phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Cột Trái: Lịch Tháng Đơn Giản & Mềm Mại (7 hoặc 8 cols) ─ */}
        <Card className="lg:col-span-7 xl:col-span-8 border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-4 px-5 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-foreground">
                Lịch chấm công tháng {currentMonth + 1}/{currentYear}
              </CardTitle>
            </div>

            {/* Chú thích màu nhỏ gọn, nhẹ nhàng */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-foreground font-medium">Đủ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-foreground font-medium">Thiếu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-foreground font-medium">Chưa đủ</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-5">
            {/* Header hàng thứ */}
            <div className="grid grid-cols-7 mb-2 text-center">
              {WEEKDAYS.map((wd, i) => (
                <div
                  key={wd}
                  className={cn(
                    "py-1.5 text-xs font-semibold",
                    i >= 5 ? "text-muted-foreground/60" : "text-muted-foreground"
                  )}
                >
                  {wd}
                </div>
              ))}
            </div>

            {/* Lưới các ô ngày: bo góc mềm mại (rounded-lg/xl), khoảng cách gap-1.5 */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {/* Ô trống đầu tháng */}
              {Array.from({ length: prefixEmptyDays }).map((_, idx) => (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[78px] sm:min-h-[88px] rounded-lg border border-transparent opacity-20 pointer-events-none"
                />
              ))}

              {/* Các ngày trong tháng */}
              {daysInMonth.map((day) => {
                const isSelected = selectedDateStr === day.date;
                const isToday =
                  currentYear === 2026 && currentMonth === 9 && day.dayOfMonth === 7;

                // Màu sắc đơn giản, mềm mại theo đúng yêu cầu:
                // - Xanh: Đủ công
                // - Vàng: Thiếu công
                // - Đỏ: Chưa đủ công
                let dayStyle = "bg-muted/30 border-border/60 hover:bg-muted/60 text-foreground";
                let badgeDot = "bg-muted-foreground/40";
                let badgeLabel = "";

                if (day.status === "FULL") {
                  dayStyle =
                    "bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-50 text-foreground dark:bg-emerald-950/20 dark:border-emerald-900";
                  badgeDot = "bg-emerald-500";
                  badgeLabel = "1.0";
                } else if (day.status === "PARTIAL") {
                  dayStyle =
                    "bg-amber-50/60 border-amber-200/80 hover:bg-amber-50 text-foreground dark:bg-amber-950/20 dark:border-amber-900";
                  badgeDot = "bg-amber-500";
                  badgeLabel = "0.5";
                } else if (day.status === "MISSING") {
                  dayStyle =
                    "bg-rose-50/60 border-rose-200/80 hover:bg-rose-50 text-foreground dark:bg-rose-950/20 dark:border-rose-900";
                  badgeDot = "bg-rose-500";
                  badgeLabel = "0.0";
                } else if (day.status === "WEEKEND") {
                  dayStyle = "bg-muted/20 border-border/40 text-muted-foreground/70";
                }

                return (
                  <button
                    key={day.date}
                    type="button"
                    onClick={() => setSelectedDateStr(day.date)}
                    className={cn(
                      "min-h-[78px] sm:min-h-[88px] p-2 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative",
                      dayStyle,
                      isSelected && "ring-2 ring-primary ring-offset-1 border-primary shadow-xs"
                    )}
                  >
                    {/* Header ô ngày */}
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-semibold font-mono",
                          day.status === "FULL" && "text-emerald-700 dark:text-emerald-400",
                          day.status === "PARTIAL" && "text-amber-700 dark:text-amber-400",
                          day.status === "MISSING" && "text-rose-700 dark:text-rose-400 font-bold"
                        )}
                      >
                        {day.dayOfMonth}
                      </span>

                      {isToday && (
                        <span className="text-[9px] font-medium bg-primary text-primary-foreground px-1 py-0 rounded">
                          Hôm nay
                        </span>
                      )}

                      {!isToday && badgeLabel && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {badgeLabel}
                        </span>
                      )}
                    </div>

                    {/* Giờ vào / ra mềm mại */}
                    <div className="my-0.5 space-y-0.5 text-[10px] font-mono text-muted-foreground">
                      {day.status === "FULL" && (
                        <>
                          <div>V: {day.checkIn}</div>
                          <div>R: {day.checkOut}</div>
                        </>
                      )}

                      {day.status === "PARTIAL" && (
                        <>
                          <div className="text-amber-700 dark:text-amber-400 font-medium">
                            V: {day.checkIn}
                          </div>
                          <div>R: {day.checkOut}</div>
                        </>
                      )}

                      {day.status === "MISSING" && (
                        <>
                          <div>V: {day.checkIn}</div>
                          <div className="text-rose-600 dark:text-rose-400 font-medium">
                            R: --:--
                          </div>
                        </>
                      )}

                      {day.status === "WEEKEND" && (
                        <span className="text-[10px] text-muted-foreground/50">Nghỉ</span>
                      )}
                    </div>

                    {/* Dấu chấm trạng thái */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full", badgeDot)} />
                        <span className="hidden sm:inline">
                          {day.status === "FULL" && "Đủ công"}
                          {day.status === "PARTIAL" && "Thiếu"}
                          {day.status === "MISSING" && "Chưa đủ"}
                          {day.status === "WEEKEND" && "Cuối tuần"}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="text-primary font-bold text-xs">●</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chú thích diễn giải mềm mại ở chân lịch */}
            <div className="mt-4 pt-3.5 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Xanh: Đủ 1.0 công</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Vàng: Thiếu công (0.5 công)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>Đỏ: Chưa đủ công (0.0 công)</span>
                </span>
              </div>

              <span>Bấm vào ô ngày để xem chi tiết bên phải</span>
            </div>
          </CardContent>
        </Card>

        {/* ── Cột Phải: Thẻ Chi Tiết Ngày Đang Chọn (Đơn giản, mềm mại) ─ */}
        <Card className="lg:col-span-5 xl:col-span-4 border-border bg-card shadow-xs rounded-xl overflow-hidden sticky top-6">
          <CardHeader className="py-4 px-5 border-b border-border flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Chi tiết ngày làm việc</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {selectedDay?.date
                  ? `${WEEKDAYS_FULL[selectedDay.dayOfWeek]}, ${selectedDay.date}`
                  : "Chưa chọn ngày"}
              </p>
            </div>

            <Badge variant="outline" className="font-mono text-xs">
              {selectedDay?.workUnits.toFixed(1)} công
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            {selectedDay ? (
              <>
                {/* Banner trạng thái công */}
                <div
                  className={cn(
                    "p-3.5 rounded-xl border flex items-center justify-between",
                    selectedDay.status === "FULL" &&
                      "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-200",
                    selectedDay.status === "PARTIAL" &&
                      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200",
                    selectedDay.status === "MISSING" &&
                      "bg-rose-50 border-rose-200 text-rose-900 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-200",
                    selectedDay.status === "WEEKEND" &&
                      "bg-muted/40 border-border text-muted-foreground",
                    selectedDay.status === "FUTURE" &&
                      "bg-card border-border text-muted-foreground"
                  )}
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-medium opacity-80 block">
                      Đánh giá ngày công
                    </span>
                    <strong className="text-sm font-semibold flex items-center gap-1.5">
                      {selectedDay.status === "FULL" && (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Đủ công (1.0 công)
                        </>
                      )}
                      {selectedDay.status === "PARTIAL" && (
                        <>
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          Thiếu công (0.5 công)
                        </>
                      )}
                      {selectedDay.status === "MISSING" && (
                        <>
                          <AlertCircle className="h-4 w-4 text-rose-600" />
                          Chưa đủ công (0.0 công)
                        </>
                      )}
                      {selectedDay.status === "WEEKEND" && "Nghỉ cuối tuần"}
                      {selectedDay.status === "FUTURE" && "Chưa đến ca"}
                    </strong>
                  </div>

                  <span className="text-xl font-bold font-mono">
                    {selectedDay.workUnits.toFixed(1)}
                  </span>
                </div>

                {/* Thông tin ca & thời gian */}
                <div className="space-y-2.5 rounded-lg border border-border p-3.5 bg-muted/20">
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">Ca làm việc:</span>
                    <span className="font-medium text-foreground">{selectedDay.shiftName}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">Giờ vào (Check-in):</span>
                    <span className="font-mono font-medium text-foreground">
                      {selectedDay.checkIn || "--:--"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">Giờ ra (Check-out):</span>
                    <span
                      className={cn(
                        "font-mono font-medium",
                        selectedDay.checkOut === "--:--" ? "text-rose-600" : "text-foreground"
                      )}
                    >
                      {selectedDay.checkOut || "--:--"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">Tổng thời gian:</span>
                    <span className="font-mono text-foreground">{selectedDay.duration || "--"}</span>
                  </div>

                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground">Địa điểm:</span>
                    <span className="text-foreground">{selectedDay.location || "FSI Tower"}</span>
                  </div>

                  {selectedDay.note && (
                    <div className="pt-1.5 border-t border-border/60 text-muted-foreground">
                      <span className="block text-[11px] mb-0.5">Ghi chú:</span>
                      <p className="text-foreground italic">{selectedDay.note}</p>
                    </div>
                  )}
                </div>

                {/* Cảnh báo và nút giải trình nếu thiếu hoặc chưa đủ công */}
                {selectedDay.needsExplanation ? (
                  <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 dark:bg-amber-950/20 dark:border-amber-900 space-y-2.5">
                    <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Chưa đủ công cho ngày này</p>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                          Bạn có thể gửi đơn giải trình để bổ sung giờ vào/ra cho Quản lý duyệt.
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleOpenExplain(selectedDay)}
                      className="w-full h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      <span>Gửi đơn giải trình</span>
                    </Button>
                  </div>
                ) : (
                  selectedDay.status !== "WEEKEND" &&
                  selectedDay.status !== "FUTURE" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenExplain(selectedDay)}
                      className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <span>Yêu cầu điều chỉnh công</span>
                    </Button>
                  )
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chọn một ngày trên lịch để xem chi tiết
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── MODAL: Gửi Đơn Giải Trình Chấm Công (Đơn giản, tinh tế) ──── */}
      <Dialog open={isExplainOpen} onOpenChange={setIsExplainOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Đơn giải trình chấm công
            </DialogTitle>
            <DialogDescription className="text-xs">
              Gửi giải trình cho ngày {selectedDay?.date} đến Quản lý trực tiếp để cập nhật lại công.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Ngày cần giải trình</Label>
              <Input
                value={selectedDay?.date || "2026-10-02"}
                disabled
                className="h-8 font-mono bg-muted/40 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Giờ vào thực tế</Label>
                <Input
                  type="time"
                  value={explainInTime}
                  onChange={(e) => setExplainInTime(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Giờ ra thực tế</Label>
                <Input
                  type="time"
                  value={explainOutTime}
                  onChange={(e) => setExplainOutTime(e.target.value)}
                  className="h-8 font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Lý do giải trình</Label>
              <select
                value={explainReason}
                onChange={(e) => setExplainReason(e.target.value)}
                className="w-full h-8 rounded-md border border-input bg-card px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Quên quẹt thẻ lúc ra về">Quên quẹt thẻ lúc ra về</option>
                <option value="Quên quét mã khi vào ca">Quên quét mã khi vào ca</option>
                <option value="Thiết bị chấm công gặp sự cố">Thiết bị chấm công gặp sự cố</option>
                <option value="Đi công tác bên ngoài">Đi công tác bên ngoài trụ sở</option>
                <option value="Đi muộn có lý do chính đáng">Đi muộn có lý do chính đáng</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Nội dung chi tiết</Label>
              <Textarea
                placeholder="Nhập ghi chú thêm cho người duyệt..."
                value={explainNotes}
                onChange={(e) => setExplainNotes(e.target.value)}
                rows={3}
                className="text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExplainOpen(false)}
              className="text-xs h-8"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSubmitExplanation}
              className="text-xs h-8 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Gửi giải trình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarX2 } from "lucide-react";
import type { ShiftAssignmentResponse } from "../../types/attendance.types";

interface ShiftScheduleMatrixProps {
  assignments: ShiftAssignmentResponse[];
  year: number;
  month: number;
  isLoading: boolean;
}

export function ShiftScheduleMatrix({
  assignments,
  year,
  month,
  isLoading,
}: ShiftScheduleMatrixProps) {
  // Số ngày trong tháng đã chọn
  const daysInMonth = new Date(year, month, 0).getDate();
  const dayNumbers = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Group assignments theo employee
  const employeeMap = React.useMemo(() => {
    const map = new Map<
      string,
      {
        employeeId: string;
        employeeCode: string;
        fullName: string;
        departmentName?: string;
        dates: Map<number, ShiftAssignmentResponse>;
      }
    >();

    assignments.forEach((assignment) => {
      const empId = assignment.employeeId;
      if (!map.has(empId)) {
        map.set(empId, {
          employeeId: empId,
          employeeCode: assignment.employeeCode || empId.slice(0, 8),
          fullName: assignment.employeeName || "Nhân viên",
          dates: new Map(),
        });
      }

      // Parse assignment date day
      const dateObj = new Date(assignment.assignmentDate || assignment.workDate || "");
      if (dateObj.getMonth() + 1 === month && dateObj.getFullYear() === year) {
        map.get(empId)!.dates.set(dateObj.getDate(), assignment);
      }
    });

    return Array.from(map.values());
  }, [assignments, year, month]);

  // Helper lấy thứ trong tuần
  const getDayOfWeekLabel = (day: number) => {
    const d = new Date(year, month - 1, day);
    const dayIndex = d.getDay(); // 0: CN, 1: T2, ...
    const labels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return {
      label: labels[dayIndex],
      isWeekend: dayIndex === 0 || dayIndex === 6,
    };
  };

  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[200px] sticky left-0 z-20 bg-muted/50 font-semibold border-r">
                Nhân viên
              </TableHead>
              {dayNumbers.map((day) => {
                const { label, isWeekend } = getDayOfWeekLabel(day);
                return (
                  <TableHead
                    key={day}
                    className={`text-center p-1.5 min-w-[38px] text-xs font-semibold ${
                      isWeekend ? "bg-muted/80 text-amber-600 dark:text-amber-400" : ""
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-[10px] font-normal text-muted-foreground">{label}</div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rIdx) => (
                <TableRow key={rIdx}>
                  <TableCell className="sticky left-0 bg-card border-r">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-20" />
                  </TableCell>
                  {dayNumbers.map((d) => (
                    <TableCell key={d} className="p-1 text-center">
                      <Skeleton className="h-6 w-7 mx-auto rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : employeeMap.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={daysInMonth + 1}
                  className="h-48 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <CalendarX2 className="h-8 w-8 text-muted-foreground/60" />
                    <p className="text-sm font-medium">
                      Chưa có dữ liệu phân ca trong Tháng {month}/{year}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bấm &ldquo;Phân ca hàng loạt&rdquo; để thiết lập lịch làm việc cho nhân viên
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              employeeMap.map((emp) => (
                <TableRow key={emp.employeeId} className="hover:bg-muted/30">
                  <TableCell className="sticky left-0 z-10 bg-card border-r py-2">
                    <div className="font-medium text-xs text-foreground truncate max-w-[180px]">
                      {emp.fullName}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{emp.employeeCode}</div>
                  </TableCell>
                  {dayNumbers.map((day) => {
                    const item = emp.dates.get(day);
                    const { isWeekend } = getDayOfWeekLabel(day);
                    return (
                      <TableCell
                        key={day}
                        className={`p-1 text-center text-xs ${
                          isWeekend ? "bg-muted/20" : ""
                        }`}
                      >
                        {item ? (
                          <Badge
                            variant="secondary"
                            className="px-1.5 py-0.5 text-[10px] font-medium tracking-tight cursor-default"
                            title={`${item.shiftName} (${item.startTime} - ${item.endTime})`}
                          >
                            {item.shiftCode}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/40 text-xs">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit2, Trash2, Moon, Clock, CalendarX } from "lucide-react";
import type { ShiftResponse } from "../../types/attendance.types";

interface ShiftTableProps {
  shifts: ShiftResponse[];
  isLoading: boolean;
  onEdit: (shift: ShiftResponse) => void;
  onDelete: (shift: ShiftResponse) => void;
  onToggleActive: (shift: ShiftResponse) => void;
  canManage?: boolean;
}

export function ShiftTable({
  shifts,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
  canManage = true,
}: ShiftTableProps) {
  const columnCount = 8;

  return (
    <div className="border rounded-lg bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[110px] text-xs font-semibold">Mã ca</TableHead>
            <TableHead className="text-xs font-semibold">Tên ca làm việc</TableHead>
            <TableHead className="text-xs font-semibold">Khung giờ làm việc</TableHead>
            <TableHead className="text-xs font-semibold">Nghỉ giữa ca</TableHead>
            <TableHead className="text-xs font-semibold">Ân hạn muộn/sớm</TableHead>
            <TableHead className="text-xs font-semibold text-center">Định mức công</TableHead>
            <TableHead className="text-xs font-semibold text-center">Trạng thái</TableHead>
            <TableHead className="w-[90px] text-xs font-semibold text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Embedded Skeleton Rows (Quy chuẩn 04)
            Array.from({ length: 5 }).map((_, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-5 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="h-5 w-10 bg-muted animate-pulse rounded mx-auto" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-7 w-14 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : shifts.length === 0 ? (
            // Embedded Empty State Row (Quy chuẩn 04)
            <TableRow>
              <TableCell colSpan={columnCount} className="h-56 text-center">
                <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center">
                    <CalendarX className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Không tìm thấy ca làm việc nào</p>
                  <p className="text-xs">
                    Thử thay đổi bộ lọc hoặc thêm ca làm việc mới để bắt đầu thiết lập lịch làm việc.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // Dữ liệu bảng thực tế
            shifts.map((shift) => (
              <TableRow key={shift.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs font-semibold bg-muted/50">
                    {shift.code}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-medium text-sm">
                    {shift.name}
                    {shift.isNightShift && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-purple-500/15 text-purple-700 dark:text-purple-300 gap-1 px-1.5 py-0"
                      >
                        <Moon className="w-2.5 h-2.5" /> Ca đêm
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-foreground">
                      {shift.startTime} - {shift.endTime}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {shift.breakStartTime && shift.breakEndTime ? (
                    `${shift.breakStartTime} - ${shift.breakEndTime}`
                  ) : (
                    <span className="text-muted-foreground/50">Không nghỉ</span>
                  )}
                </TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-col text-[11px] text-muted-foreground">
                    <span>Muộn: +{shift.lateGraceMinutes}p</span>
                    {shift.earlyGraceMinutes > 0 && <span>Sớm: -{shift.earlyGraceMinutes}p</span>}
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold text-xs text-primary">
                  {shift.workCredit.toFixed(1)} công
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={shift.isActive}
                    disabled={!canManage}
                    onCheckedChange={() => onToggleActive(shift)}
                    aria-label="Kích hoạt ca làm việc"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {canManage && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(shift)}
                          className="h-8 w-8 hover:text-primary"
                          title="Chỉnh sửa ca"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(shift)}
                          className="h-8 w-8 hover:text-destructive"
                          title="Xóa ca làm việc"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}


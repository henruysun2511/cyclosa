"use client";

import React from "react";
import Link from "next/link";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, Unlock, Eye, Calendar, FileSpreadsheet } from "lucide-react";
import type { TimesheetPeriodResponse } from "../../types/attendance.types";

interface PeriodTableProps {
  periods: TimesheetPeriodResponse[];
  isLoading: boolean;
}

export function PeriodTable({ periods, isLoading }: PeriodTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Tên & Mã kỳ công</TableHead>
            <TableHead>Khoảng thời gian chu kỳ</TableHead>
            <TableHead>Hạn giải trình (Cut-off)</TableHead>
            <TableHead className="text-center">Trạng thái kỳ</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableCell>
                <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
              </TableRow>
            ))
          ) : periods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <FileSpreadsheet className="h-8 w-8 text-muted-foreground/60" />
                  <p className="text-sm font-medium">Chưa có kỳ công nào được tạo</p>
                  <p className="text-xs text-muted-foreground">
                    Bấm &ldquo;Tạo kỳ công mới&rdquo; để bắt đầu chu kỳ tính công
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            periods.map((p) => {
              const isOpen = p.status === "OPEN";

              return (
                <TableRow key={p.id} className="hover:bg-muted/40 text-xs">
                  <TableCell>
                    <div className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                      {isOpen ? (
                        <Unlock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      )}
                      {p.periodName}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">{p.periodCode}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(p.startDate).toLocaleDateString("vi-VN")} đến{" "}
                      {new Date(p.endDate).toLocaleDateString("vi-VN")}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {p.cutoffDate ? new Date(p.cutoffDate).toLocaleDateString("vi-VN") : "--"}
                  </TableCell>
                  <TableCell className="text-center">
                    {isOpen ? (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 gap-1">
                        <Unlock className="h-3 w-3" /> Đang mở (OPEN)
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Lock className="h-3 w-3" /> Đã khóa (LOCKED)
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild className="h-8 text-xs gap-1">
                      <Link href={`/attendance/periods/${p.id}`}>
                        <Eye className="h-3.5 w-3.5" />
                        Chi tiết & Chốt sổ
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}


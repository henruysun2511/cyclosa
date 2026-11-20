"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  User,
  Users,
} from "lucide-react";
import { OnboardingStatusBadge } from "../shared/onboarding-status-badge";
import type { OnboardingProcessDto } from "../../types/onboarding.types";

export interface ProcessTableProps {
  processes: OnboardingProcessDto[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

export function ProcessTable({
  processes,
  isLoading,
  page,
  totalPages,
  totalItems,
  onPageChange,
}: ProcessTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(-2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="min-w-[220px] text-xs font-semibold">Nhân viên tiếp nhận</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Phòng ban & Mẫu áp dụng</TableHead>
              <TableHead className="w-[140px] text-xs font-semibold">Người hướng dẫn (Buddy)</TableHead>
              <TableHead className="w-[160px] text-xs font-semibold">Thời gian thử việc</TableHead>
              <TableHead className="w-[180px] text-xs font-semibold">Tiến độ thực hiện</TableHead>
              <TableHead className="w-[130px] text-xs font-semibold">Trạng thái</TableHead>
              <TableHead className="w-[60px] text-right text-xs font-semibold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-1">
                        <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-6 bg-muted animate-pulse rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : processes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-36 text-center text-xs text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p>Không tìm thấy tiến trình hội nhập nhân sự nào.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              processes.map((proc) => {
                const percent = proc.progressPercentage || 0;
                return (
                  <TableRow
                    key={proc.id}
                    className="hover:bg-muted/25 transition-colors"
                  >
                    {/* Thông tin nhân viên */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                          {getInitials(proc.employeeName)}
                        </div>
                        <div className="space-y-0.5">
                          <Link
                            href={`/onboarding/processes/${proc.id}`}
                            className="font-bold text-xs text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            <span>{proc.employeeName}</span>
                            <span className="font-mono text-[10.5px] text-muted-foreground font-normal">
                              ({proc.employeeCode})
                            </span>
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {proc.jobTitle || "Nhân viên mới"}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phòng ban & Mẫu */}
                    <TableCell>
                      <span className="text-xs font-medium text-foreground block truncate">
                        {proc.departmentName || "Khối Công nghệ"}
                      </span>
                      <span className="text-[11px] text-muted-foreground block truncate mt-0.5">
                        Mẫu: {proc.templateName || "Tiêu chuẩn"}
                      </span>
                    </TableCell>

                    {/* Mentor / Buddy */}
                    <TableCell>
                      {proc.mentorName ? (
                        <div className="flex items-center gap-1.5 text-xs text-foreground">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{proc.mentorName}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Chưa phân công
                        </span>
                      )}
                    </TableCell>

                    {/* Thời gian thử việc */}
                    <TableCell>
                      <div className="text-xs space-y-0.5 font-mono text-muted-foreground">
                        <div>
                          Bắt đầu:{" "}
                          <span className="text-foreground font-medium">
                            {proc.startDate}
                          </span>
                        </div>
                        <div>
                          Hạn HĐ:{" "}
                          <span className="text-foreground">
                            {proc.probationEndDate}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Tiến độ hoàn thành */}
                    <TableCell>
                      <div className="space-y-1.5 max-w-[140px]">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-mono text-muted-foreground">
                            {proc.completedTasks}/{proc.totalTasks} việc
                          </span>
                          <span className="font-bold font-mono text-primary text-xs">
                            {percent}%
                          </span>
                        </div>
                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        {proc.mandatoryUnfinishedTasks > 0 && (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 block">
                            Còn {proc.mandatoryUnfinishedTasks} việc bắt buộc
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Trạng thái */}
                    <TableCell>
                      <OnboardingStatusBadge status={proc.status} />
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link href={`/onboarding/processes/${proc.id}`}>
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Hiển thị {processes.length} trên tổng số {totalItems} tiến trình
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Trước</span>
            </Button>
            <span className="font-mono text-xs px-2 font-medium text-foreground">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="h-8 px-2.5 text-xs gap-1"
            >
              <span>Sau</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


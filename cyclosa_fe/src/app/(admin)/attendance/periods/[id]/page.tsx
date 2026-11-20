"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarRange, Lock, Unlock, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AttendancePageHeader,
  useGetTimesheetPeriodByIdQuery,
  usePreLockCheckQuery,
  useGetTimesheetSnapshotsQuery,
} from "@/features/attendance";
import { PreLockCheckPanel } from "@/features/attendance/components/periods/pre-lock-check-panel";
import { SnapshotSummaryTable } from "@/features/attendance/components/periods/snapshot-summary-table";
import { LockConfirmDialog } from "@/features/attendance/components/periods/lock-confirm-dialog";
import { UnlockDialog } from "@/features/attendance/components/periods/unlock-dialog";

interface PeriodDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PeriodDetailPage({ params }: PeriodDetailPageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [page, setPage] = useState(0);
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [isUnlockOpen, setIsUnlockOpen] = useState(false);

  // 1. Lấy thông tin Kỳ công
  const {
    data: periodData,
    isLoading: isPeriodLoading,
    refetch: refetchPeriod,
  } = useGetTimesheetPeriodByIdQuery(id);
  const period = periodData?.data;

  const isOpen = period?.status === "OPEN";

  // 2. Pre-lock Check
  const {
    data: preLockData,
    isLoading: isCheckLoading,
    refetch: refetchCheck,
  } = usePreLockCheckQuery(id);

  // 3. Snapshots nếu đã khóa
  const {
    data: snapshotsData,
    isLoading: isSnapshotsLoading,
    refetch: refetchSnapshots,
  } = useGetTimesheetSnapshotsQuery({ periodId: id, page, size: 20 });

  if (isPeriodLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (!period) {
    return (
      <div className="space-y-6 text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy thông tin kỳ công</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/attendance/periods">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách kỳ
          </Link>
        </Button>
      </div>
    );
  }

  const handleActionSuccess = () => {
    refetchPeriod();
    refetchCheck();
    refetchSnapshots();
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title={period.periodName || "Chi tiết kỳ công"}
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Kỳ công tháng", href: "/attendance/periods" },
          { label: period.periodName || period.periodCode || "Chi tiết" },
        ]}
        icon={CalendarRange}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/attendance/periods">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            {isOpen ? (
              <Button
                onClick={() => setIsLockOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
              >
                <Lock className="h-4 w-4" />
                Khóa kỳ công & Chốt Snapshot
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setIsUnlockOpen(true)}
                className="gap-1.5"
              >
                <Unlock className="h-4 w-4" />
                Mở khóa kỳ công
              </Button>
            )}
          </div>
        }
      />

      {/* Thẻ tóm tắt thông tin kỳ công */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border bg-card p-4 shadow-xs text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px]">Trạng thái kỳ:</span>
          <div className="mt-1">
            {isOpen ? (
              <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 gap-1">
                <Unlock className="h-3 w-3" /> Đang mở (OPEN)
              </Badge>
            ) : (
              <Badge variant="secondary" className="gap-1">
                <Lock className="h-3 w-3" /> Đã khóa (LOCKED)
              </Badge>
            )}
          </div>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Hạn giải trình (Cut-off):</span>
          <span className="font-semibold text-foreground text-sm mt-0.5 block">
            {period.cutoffDate ? new Date(period.cutoffDate).toLocaleDateString("vi-VN") : "--"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Ngày bắt đầu - kết thúc:</span>
          <span className="font-medium text-foreground mt-0.5 block">
            {new Date(period.startDate).toLocaleDateString("vi-VN")} - {new Date(period.endDate).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">Thời điểm chốt snapshot:</span>
          <span className="font-mono text-muted-foreground mt-0.5 block">
            {period.lockedAt ? new Date(period.lockedAt).toLocaleString("vi-VN") : "Chưa khóa"}
          </span>
        </div>
      </div>

      {/* Bảng Pre-lock Check */}
      <PreLockCheckPanel
        checkData={preLockData?.data}
        isLoading={isCheckLoading}
      />

      {/* Bảng Timesheet Snapshots */}
      <div className="space-y-2">
        <h3 className="text-base font-semibold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Danh sách Snapshot nhân sự đã chốt
        </h3>
        <SnapshotSummaryTable
          data={snapshotsData?.data}
          isLoading={isSnapshotsLoading}
          onPageChange={setPage}
        />
      </div>

      {/* Dialogs */}
      <LockConfirmDialog
        open={isLockOpen}
        onOpenChange={setIsLockOpen}
        periodId={period.id}
        periodName={period.periodName || period.periodCode || ""}
        onSuccess={handleActionSuccess}
      />

      <UnlockDialog
        open={isUnlockOpen}
        onOpenChange={setIsUnlockOpen}
        periodId={period.id}
        periodName={period.periodName || period.periodCode || ""}
        onSuccess={handleActionSuccess}
      />
    </div>
  );
}


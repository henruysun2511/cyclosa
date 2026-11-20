"use client";

import React, { useState } from "react";
import { FileCheck, Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttendancePageHeader,
  useGetAllAttendanceRequestsQuery,
  useAttendanceRequestFilters,
  type AttendanceRequestResponse,
} from "@/features/attendance";
import { AdminRequestTable } from "@/features/attendance/components/requests/admin-request-table";
import { RequestReviewDialog } from "@/features/attendance/components/requests/request-review-dialog";

export default function AdminAttendanceRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<AttendanceRequestResponse | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const {
    filters,
    setStatus,
    setRequestType,
    setAttendanceDate,
    setSearch,
    setPage,
    resetFilters,
  } = useAttendanceRequestFilters();

  const {
    data: requestsData,
    isLoading,
    refetch,
  } = useGetAllAttendanceRequestsQuery(filters);

  const handleReview = (req: AttendanceRequestResponse) => {
    setSelectedRequest(req);
    setIsReviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Đơn giải trình chấm công"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Đơn giải trình" },
        ]}
        icon={FileCheck}
      />

      {/* Bộ lọc đơn */}
      <div className="space-y-3 rounded-xl border bg-card p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã NV hoặc ID..."
              value={filters.search || ""}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>

          <Input
            type="date"
            value={filters.attendanceDate || ""}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="h-9"
          />

          <Select
            value={filters.status || "ALL"}
            onValueChange={(val) => setStatus(val === "ALL" ? undefined : (val as any))}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Trạng thái duyệt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Đã từ chối</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Select
              value={filters.requestType || "ALL"}
              onValueChange={(val) => setRequestType(val === "ALL" ? undefined : (val as any))}
            >
              <SelectTrigger className="h-9 flex-1">
                <SelectValue placeholder="Loại đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả loại đơn</SelectItem>
                <SelectItem value="FORGOT_PUNCH">Quên quẹt thẻ</SelectItem>
                <SelectItem value="TIME_DEVIATION">Sai lệch thời gian</SelectItem>
                <SelectItem value="ATTENDANCE_EXPLANATION">Giải trình đi muộn/về sớm</SelectItem>
                <SelectItem value="OVERTIME_REGISTRATION">Đăng ký làm thêm giờ (OT)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2 text-muted-foreground hover:text-foreground"
              title="Đặt lại"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AdminRequestTable
        data={requestsData?.data}
        isLoading={isLoading}
        onReviewRequest={handleReview}
        onPageChange={setPage}
      />

      <RequestReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        request={selectedRequest}
        onSuccess={() => refetch()}
      />
    </div>
  );
}


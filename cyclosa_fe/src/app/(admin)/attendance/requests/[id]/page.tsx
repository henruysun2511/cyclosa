"use client";

import React, { useState } from "react";
import { FileCheck, ArrowLeft, Clock, Calendar, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AttendancePageHeader,
  useGetAttendanceRequestByIdQuery,
  type AttendanceRequestResponse,
} from "@/features/attendance";
import { RequestReviewDialog } from "@/features/attendance/components/requests/request-review-dialog";

interface RequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function RequestDetailPage({ params }: RequestDetailPageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { data: requestData, isLoading, refetch } = useGetAttendanceRequestByIdQuery(id);
  const request = requestData?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 mb-4" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="space-y-6 text-center py-12">
        <p className="text-muted-foreground">Không tìm thấy thông tin đơn giải trình này</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/attendance/requests">
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttendancePageHeader
        title="Chi tiết đơn giải trình"
        breadcrumbs={[
          { label: "Chấm công", href: "/attendance/shifts" },
          { label: "Đơn giải trình", href: "/attendance/requests" },
          { label: request.employeeName || request.employeeCode || "Chi tiết" },
        ]}
        icon={FileCheck}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/attendance/requests">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            {request.status === "PENDING" && (
              <Button onClick={() => setIsReviewOpen(true)}>
                Xem xét phê duyệt
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Thẻ thông tin nhân viên & ca */}
        <Card className="shadow-xs border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Thông tin buổi làm việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Nhân viên:</span>
              <span className="font-semibold text-foreground">
                {request.employeeName} ({request.employeeCode})
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Ngày áp dụng:</span>
              <span className="font-medium">
                {new Date(request.attendanceDate || request.workDate).toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Giờ vào đề xuất:</span>
              <span className="font-mono font-medium">
                {request.proposedInTime ? new Date(request.proposedInTime).toLocaleTimeString("vi-VN") : "--"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giờ ra đề xuất:</span>
              <span className="font-mono font-medium">
                {request.proposedOutTime ? new Date(request.proposedOutTime).toLocaleTimeString("vi-VN") : "--"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Thẻ trạng thái & tiến trình duyệt */}
        <Card className="shadow-xs border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Trạng thái & Tiến trình duyệt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge variant={request.status === "APPROVED" ? "default" : request.status === "REJECTED" ? "destructive" : "secondary"}>
                {request.status}
              </Badge>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Người duyệt:</span>
              <span className="font-medium">{request.reviewerName || "--"}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Thời gian duyệt:</span>
              <span className="text-muted-foreground">
                {request.reviewedAt ? new Date(request.reviewedAt).toLocaleString("vi-VN") : "--"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Ghi chú phản hồi:</span>
              <p className="italic text-foreground bg-muted/40 p-2 rounded-lg">
                {request.reviewerComment || request.rejectionReason || "Chưa có ghi chú"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lý do chi tiết của nhân viên */}
      <Card className="shadow-xs border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Lý do giải trình từ nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-foreground bg-muted/20 p-4 rounded-xl border border-dashed leading-relaxed">
            {request.reason}
          </p>
        </CardContent>
      </Card>

      <RequestReviewDialog
        open={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        request={request}
        onSuccess={() => refetch()}
      />
    </div>
  );
}


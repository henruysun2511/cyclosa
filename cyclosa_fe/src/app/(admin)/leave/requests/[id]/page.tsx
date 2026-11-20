"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Ban, Check, X, Calendar, User, FileText, Clock } from "lucide-react";
import Link from "next/link";
import { LeavePageHeader } from "@/features/leave/components/shared/leave-page-header";
import { LeaveStatusBadge } from "@/features/leave/components/shared/leave-status-badge";
import { LeaveGroupBadge } from "@/features/leave/components/shared/leave-group-badge";
import { LeavePayerBadge } from "@/features/leave/components/shared/leave-payer-badge";
import { RejectDialog } from "@/features/leave/components/requests/reject-dialog";
import {
  useGetLeaveRequestByIdQuery,
  useCancelLeaveRequestMutation,
  useApproveLeaveRequestMutation,
  useRejectLeaveRequestMutation,
} from "@/features/leave/api/leave-api";
import { DAY_PORTION_LABELS } from "@/features/leave/constants/leave.constants";
import { useState } from "react";
import { toast } from "sonner";

interface LeaveRequestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function LeaveRequestDetailPage({ params }: LeaveRequestDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [rejectOpen, setRejectOpen] = useState(false);

  const { data: res, isLoading } = useGetLeaveRequestByIdQuery(id);
  const request = res?.data;

  const [cancelRequest, { isLoading: isCancelling }] = useCancelLeaveRequestMutation();
  const [approveRequest, { isLoading: isApproving }] = useApproveLeaveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectLeaveRequestMutation();

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-muted-foreground animate-pulse">
        Đang tải thông tin chi tiết đơn xin nghỉ phép...
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm font-medium text-destructive">
          Không tìm thấy đơn xin nghỉ phép hoặc đơn đã bị xóa
        </p>
        <Button variant="outline" asChild>
          <Link href="/leave/requests">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn xin nghỉ phép này?")) return;
    try {
      await cancelRequest(request.id).unwrap();
      toast.success("Hủy đơn thành công");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi hủy đơn";
      toast.error(msg);
    }
  };

  const handleApprove = async () => {
    try {
      await approveRequest(request.id).unwrap();
      toast.success("Phê duyệt đơn thành công");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi duyệt đơn";
      toast.error(msg);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    try {
      await rejectRequest({
        requestId: request.id,
        reason,
      }).unwrap();
      toast.success("Đã từ chối đơn nghỉ phép");
      setRejectOpen(false);
      router.refresh();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Có lỗi xảy ra khi từ chối đơn";
      toast.error(msg);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const canCancel =
    (request.status === "PENDING_APPROVAL" || request.status === "APPROVED") &&
    request.startDate >= today;
  const isPending = request.status === "PENDING_APPROVAL";

  return (
    <div className="space-y-6">
      <LeavePageHeader
        title="Chi tiết đơn xin nghỉ phép"
        breadcrumb="Chi tiết đơn nghỉ"
        icon={Calendar}
      >
        <Button variant="outline" size="sm" asChild className="gap-1.5">
          <Link href="/leave/requests">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Link>
        </Button>

        {isPending && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectOpen(true)}
              disabled={isRejecting}
              className="gap-1.5 text-rose-600 hover:text-rose-700"
            >
              <X className="h-4 w-4" />
              Từ chối
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              disabled={isApproving}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="h-4 w-4" />
              Phê duyệt
            </Button>
          </>
        )}

        {canCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleCancel}
            disabled={isCancelling}
            className="gap-1.5"
          >
            <Ban className="h-4 w-4" />
            Hủy đơn
          </Button>
        )}
      </LeavePageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Details Card */}
        <Card className="md:col-span-2 border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Thông tin yêu cầu nghỉ phép
              </CardTitle>
              <LeaveStatusBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Loại nghỉ phép</span>
                <span className="font-semibold text-foreground">{request.leaveTypeName}</span>
                <div className="flex gap-1.5 mt-1">
                  <LeaveGroupBadge group={request.leaveGroup} />
                  <LeavePayerBadge payer={request.payer} />
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Buổi nghỉ áp dụng</span>
                <span className="font-medium text-foreground">
                  {DAY_PORTION_LABELS[request.dayPortion]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2 border-b border-border/50">
              <div>
                <span className="text-xs text-muted-foreground block">Khoảng thời gian</span>
                <span className="font-semibold text-foreground">
                  {new Date(request.startDate).toLocaleDateString("vi-VN")}
                  {request.startDate !== request.endDate &&
                    ` → ${new Date(request.endDate).toLocaleDateString("vi-VN")}`}
                </span>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block">Tổng số ngày nghỉ</span>
                <span className="text-2xl font-black text-primary">
                  {request.daysCount}{" "}
                  <span className="text-xs font-normal text-muted-foreground">ngày</span>
                </span>
              </div>
            </div>

            <div className="py-2">
              <span className="text-xs text-muted-foreground block mb-1">Lý do xin nghỉ</span>
              <div className="p-3 rounded-lg bg-muted/30 text-foreground text-xs leading-relaxed">
                {request.reason || "Không ghi lý do cụ thể"}
              </div>
            </div>

            {request.rejectionReason && (
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-xs text-rose-800 dark:text-rose-300">
                <strong>Lý do từ chối:</strong> {request.rejectionReason}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Info Card */}
        <div className="space-y-4">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Thông tin người xin nghỉ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground block">Họ và tên</span>
                <strong className="text-foreground text-sm font-semibold">
                  {request.employeeFullName || "—"}
                </strong>
              </div>

              <div>
                <span className="text-muted-foreground block">Mã nhân viên</span>
                <span className="font-mono">{request.employeeCode || "—"}</span>
              </div>

              <div>
                <span className="text-muted-foreground block">Phòng ban</span>
                <span className="text-foreground">{request.departmentName || "—"}</span>
              </div>

              <div>
                <span className="text-muted-foreground block">Chức danh / Vị trí</span>
                <span className="text-foreground">{request.jobTitleName || "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Nhật ký tiến trình
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                <div>
                  <span className="text-muted-foreground block">Thời điểm nộp đơn</span>
                  <span className="font-medium">
                    {new Date(request.submittedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>

              {request.cancelledAt && (
                <div className="flex items-start gap-2 text-rose-600">
                  <Ban className="h-3.5 w-3.5 mt-0.5" />
                  <div>
                    <span className="block">Thời điểm hủy đơn</span>
                    <span className="font-medium">
                      {new Date(request.cancelledAt).toLocaleString("vi-VN")}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />
    </div>
  );
}


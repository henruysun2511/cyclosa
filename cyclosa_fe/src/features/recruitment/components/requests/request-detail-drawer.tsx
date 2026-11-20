"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  Send,
  Briefcase,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RequestStatusBadge } from "./request-status-badge";
import { EMPLOYMENT_TYPE_LABELS } from "../../constants/recruitment.constants";
import type { RecruitmentRequestDto } from "../../types/recruitment.types";
import { ApprovalTimeline, type ApprovalStepItem } from "@/components/shared/approval-timeline";

interface RequestDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: RecruitmentRequestDto | null;
  onSubmit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  canApprove?: boolean;
}

export function RequestDetailDrawer({
  open,
  onOpenChange,
  request,
  onSubmit,
  onApprove,
  onReject,
  canApprove = false,
}: RequestDetailDrawerProps) {
  if (!request) return null;

  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const isPending = request.status === "PENDING_APPROVAL";
  const isApproved = request.status === "APPROVED";

  const timelineSteps: ApprovalStepItem[] = [
    {
      id: "step-1",
      stepNumber: 1,
      stepName: "Khởi tạo đề xuất",
      approverName: request.creatorName || "Người lập đề xuất",
      status: "APPROVED",
      decidedAt: request.createdAt ? new Date(request.createdAt).toLocaleString("vi-VN") : undefined,
      comments: "Đã hoàn thành lập đề xuất định biên tuyển dụng.",
    },
    {
      id: "step-2",
      stepNumber: 2,
      stepName: "Trưởng phòng ban / Khối phê duyệt",
      approverName: "Trưởng bộ phận",
      status: request.status === "APPROVED" ? "APPROVED" : request.status === "REJECTED" ? "REJECTED" : "PENDING",
      decidedAt: request.approvedAt ? new Date(request.approvedAt).toLocaleString("vi-VN") : undefined,
      comments: request.rejectionReason || (request.status === "APPROVED" ? "Đã phê duyệt đề xuất tuyển dụng." : undefined),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">{request.code}</span>
                <RequestStatusBadge status={request.status} />
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {request.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-3 text-xs">
          {/* Thông tin cốt lõi */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-muted/30 p-3.5 rounded-xl border border-border">
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>Phòng ban:</span>
              </span>
              <p className="font-semibold text-foreground mt-1">
                {request.departmentName || "Phòng ban nội bộ"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                <span>Chỉ tiêu tuyển:</span>
              </span>
              <p className="font-semibold text-foreground mt-1 font-mono">
                {request.headcount} nhân sự
              </p>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Hình thức:</span>
              </span>
              <p className="font-semibold text-foreground mt-1">
                {EMPLOYMENT_TYPE_LABELS[request.employmentType] || request.employmentType}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                <span>Khung lương:</span>
              </span>
              <p className="font-semibold text-foreground mt-1 font-mono">
                {formatCurrency(request.minSalary)} - {formatCurrency(request.maxSalary)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Hạn tiếp nhận:</span>
              </span>
              <p className="font-semibold text-foreground mt-1">
                {request.targetDate
                  ? new Date(request.targetDate).toLocaleDateString("vi-VN")
                  : "Càng sớm càng tốt"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Người lập:</span>
              <p className="font-semibold text-foreground mt-1">
                {request.creatorName || "Hệ thống"}
              </p>
            </div>
          </div>

          {/* Lý do tuyển dụng */}
          <div className="space-y-1.5">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-xs">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Lý do tuyển dụng & Căn cứ định biên
            </h4>
            <p className="p-3 rounded-lg border border-border bg-card text-muted-foreground leading-relaxed">
              {request.reason}
            </p>
          </div>

          {/* Mô tả sơ bộ */}
          {request.jobDescription && (
            <div className="space-y-1.5">
              <h4 className="font-semibold text-foreground text-xs">Mô tả trách nhiệm công việc</h4>
              <p className="p-3 rounded-lg border border-border bg-card text-muted-foreground leading-relaxed whitespace-pre-line">
                {request.jobDescription}
              </p>
            </div>
          )}

          {/* Tiến trình phê duyệt */}
          <div className="space-y-2.5 border-t border-border pt-4">
            <h4 className="font-semibold text-foreground text-xs">Tiến trình xét duyệt đề xuất</h4>
            <ApprovalTimeline steps={timelineSteps} />
          </div>
        </div>

        {/* Nút hành động chân trang */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            {isPending && onSubmit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSubmit(request.id)}
                className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Send className="h-3.5 w-3.5 mr-1" />
                <span>Trình duyệt</span>
              </Button>
            )}

            {isPending && canApprove && onReject && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(request.id)}
                className="h-8 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" />
                <span>Từ chối</span>
              </Button>
            )}

            {isPending && canApprove && onApprove && (
              <Button
                size="sm"
                onClick={() => onApprove(request.id)}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                <span>Phê duyệt</span>
              </Button>
            )}

            {isApproved && (
              <Button asChild size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href={`/recruitment/job-openings/new?fromRequestId=${request.id}`}>
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  <span>Tạo vị trí tuyển dụng</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


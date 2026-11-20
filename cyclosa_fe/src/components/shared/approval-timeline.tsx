"use client";

import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApprovalStepItem {
  id: string | number;
  stepNumber: number;
  stepName: string;
  approverName: string;
  approverRole?: string;
  approverAvatar?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED";
  decidedAt?: string;
  comments?: string;
}

export interface ApprovalTimelineProps {
  steps: ApprovalStepItem[];
  className?: string;
}

export function ApprovalTimeline({ steps, className }: ApprovalTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        Chưa có quy trình phê duyệt nào được gắn.
      </div>
    );
  }

  const getStepIcon = (status: ApprovalStepItem["status"]) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-slate-900 bg-white" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-primary bg-white" />;
      case "PENDING":
        return <Clock className="h-5 w-5 text-slate-500 bg-white" />;
      default:
        return <AlertCircle className="h-5 w-5 text-slate-400 bg-white" />;
    }
  };

  const getStatusBadge = (status: ApprovalStepItem["status"]) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-900 text-white border border-slate-900">
            Đã duyệt
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-primary border border-red-200">
            Từ chối
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            Đang chờ duyệt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            Bỏ qua
          </span>
        );
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Tiến trình phê duyệt
      </h4>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => (
          <div key={step.id || idx} className="relative group">
            {/* Step Icon */}
            <div className="absolute -left-6 top-0.5 -translate-x-1/2 flex items-center justify-center">
              {getStepIcon(step.status)}
            </div>

            {/* Step Content Card */}
            <div className="bg-white rounded-lg border border-border p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    Bước {step.stepNumber}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {step.stepName}
                  </span>
                </div>
                {getStatusBadge(step.status)}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <div className="h-6 w-6 rounded-full bg-slate-100 border flex items-center justify-center text-slate-600">
                  <User className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    {step.approverName}
                  </span>
                  {step.approverRole && (
                    <span className="text-muted-foreground ml-1">
                      ({step.approverRole})
                    </span>
                  )}
                </div>
                {step.decidedAt && (
                  <span className="ml-auto text-muted-foreground">
                    {step.decidedAt}
                  </span>
                )}
              </div>

              {step.comments && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-700 bg-slate-50/80 p-2 rounded">
                  <span className="font-semibold text-slate-600">Nhận xét: </span>
                  {step.comments}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

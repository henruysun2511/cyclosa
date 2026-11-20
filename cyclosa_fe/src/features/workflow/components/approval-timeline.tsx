"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MinusCircle,
  UserCheck,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetWorkflowRequestByReferenceQuery,
  useGetWorkflowRequestDetailQuery,
} from "../api/workflow-api";
import {
  DECISION_CONFIG,
  OVERALL_STATUS_CONFIG,
  REQUEST_TYPE_MAP,
} from "../constants/workflow.constants";
import type {
  RequestType,
  WorkflowRequestDetailResponse,
  WorkflowRequestStepResponse,
} from "../types/workflow.types";
import { ApprovalActionDialog, type ApprovalActionMode } from "./approval-action-dialog";

interface ApprovalTimelineProps {
  referenceId?: string;
  requestType?: RequestType;
  requestId?: string;
  workflowData?: WorkflowRequestDetailResponse;
  className?: string;
  canApprove?: boolean;
}

export function ApprovalTimeline({
  referenceId,
  requestType,
  requestId,
  workflowData: initialData,
  className,
  canApprove = true,
}: ApprovalTimelineProps) {
  // Query theo referenceId nếu có
  const {
    data: dataByRef,
    isLoading: loadingByRef,
    refetch: refetchByRef,
  } = useGetWorkflowRequestByReferenceQuery(
    { referenceId: referenceId!, requestType: requestType! },
    { skip: !!initialData || !!requestId || !referenceId || !requestType }
  );

  // Query theo requestId nếu có
  const {
    data: dataById,
    isLoading: loadingById,
    refetch: refetchById,
  } = useGetWorkflowRequestDetailQuery(requestId!, {
    skip: !!initialData || !requestId,
  });

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: ApprovalActionMode | null;
    stepId?: string;
  }>({
    isOpen: false,
    mode: null,
  });

  const workflow = initialData || dataById || dataByRef;
  const isLoading = loadingByRef || loadingById;

  const handleActionSuccess = () => {
    if (refetchByRef) refetchByRef();
    if (refetchById) refetchById();
  };

  if (isLoading) {
    return (
      <Card className={cn("border shadow-sm", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!workflow) {
    return (
      <Card className={cn("border shadow-sm", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" />
            Tiến trình phê duyệt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground text-xs">
            Chưa có thông tin luồng phê duyệt hoặc chứng từ chưa được gửi duyệt.
          </div>
        </CardContent>
      </Card>
    );
  }

  const overall = OVERALL_STATUS_CONFIG[workflow.overallStatus] || {
    label: workflow.overallStatus,
    className: "bg-muted text-muted-foreground",
  };

  const steps = workflow.steps || [];

  return (
    <>
      <Card className={cn("border shadow-sm", className)}>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Tiến trình phê duyệt
              </CardTitle>
              {workflow.definitionName && (
                <p className="text-xs text-muted-foreground truncate">
                  Quy trình: <span className="font-medium text-foreground">{workflow.definitionName}</span>
                </p>
              )}
            </div>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                overall.className
              )}
            >
              {overall.label}
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {workflow.cancelReason && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg text-xs text-red-800 dark:text-red-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Lý do hủy yêu cầu:</p>
                <p className="mt-0.5">{workflow.cancelReason}</p>
              </div>
            </div>
          )}

          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
            {steps.map((step, idx) => {
              const isApproved = step.decision === "APPROVED";
              const isRejected = step.decision === "REJECTED";
              const isSkipped = step.decision === "SKIPPED";
              const isCurrent = Boolean(step.isCurrent);
              const isPending = !step.decision && !isCurrent;

              let iconBg = "bg-muted border-muted-foreground/30 text-muted-foreground";
              let StepIcon = Clock;

              if (isApproved) {
                iconBg = "bg-emerald-600 border-emerald-600 text-white shadow-sm";
                StepIcon = CheckCircle2;
              } else if (isRejected) {
                iconBg = "bg-red-600 border-red-600 text-white shadow-sm";
                StepIcon = XCircle;
              } else if (isSkipped) {
                iconBg = "bg-slate-300 dark:bg-slate-700 border-slate-300 text-slate-600 dark:text-slate-300";
                StepIcon = MinusCircle;
              } else if (isCurrent) {
                iconBg = "bg-amber-500 border-amber-500 text-white shadow-sm animate-pulse";
                StepIcon = Clock;
              }

              return (
                <div key={step.id || idx} className="relative group">
                  {/* Step icon dot */}
                  <div
                    className={cn(
                      "absolute -left-[30px] top-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform",
                      iconBg
                    )}
                  >
                    <StepIcon className="w-3.5 h-3.5" />
                  </div>

                  {/* Step content */}
                  <div
                    className={cn(
                      "p-3 rounded-lg border transition-all text-xs space-y-2",
                      isCurrent
                        ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 shadow-sm"
                        : "bg-card border-border/70"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-foreground text-xs flex items-center gap-1.5">
                          <span>Bước {step.stepOrder}:</span>
                          <span>{step.stepName}</span>
                        </div>
                        <div className="text-muted-foreground text-[11px] mt-0.5 flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {step.assigneeName}
                          </span>
                          {step.assigneeCode && (
                            <span className="font-mono text-muted-foreground">
                              ({step.assigneeCode})
                            </span>
                          )}
                          {step.assigneeJobTitle && (
                            <span className="text-muted-foreground border-l pl-2">
                              {step.assigneeJobTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status badge */}
                      {step.decision ? (
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0",
                            DECISION_CONFIG[step.decision]?.className
                          )}
                        >
                          {DECISION_CONFIG[step.decision]?.label}
                        </span>
                      ) : isCurrent ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border-transparent bg-amber-600 text-white shrink-0">
                          Chờ phê duyệt
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border-transparent bg-slate-500 text-white shrink-0">
                          Chưa tới lượt
                        </span>
                      )}
                    </div>

                    {/* Decided at timestamp */}
                    {step.decidedAt && (
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(step.decidedAt).toLocaleString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}

                    {/* Comment */}
                    {step.comment && (
                      <div className="bg-muted/60 p-2 rounded text-[11px] text-foreground flex items-start gap-1.5 border">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="italic">{step.comment}</span>
                      </div>
                    )}

                    {/* Action buttons if current step and allowed */}
                    {isCurrent && canApprove && (
                      <div className="flex items-center gap-2 pt-1 border-t">
                        <Button
                          type="button"
                          size="sm"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() =>
                            setDialogState({
                              isOpen: true,
                              mode: "APPROVE",
                              stepId: step.id,
                            })
                          }
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Phê duyệt
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                          onClick={() =>
                            setDialogState({
                              isOpen: true,
                              mode: "REJECT",
                              stepId: step.id,
                            })
                          }
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Từ chối
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ApprovalActionDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, mode: null })}
        mode={dialogState.mode}
        request={workflow}
        stepId={dialogState.stepId}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}


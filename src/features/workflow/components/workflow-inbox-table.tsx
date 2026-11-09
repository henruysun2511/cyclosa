"use client";

import React, { useState } from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Eye,
  Ban,
  ArrowUpDown,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  REQUEST_TYPE_MAP,
  OVERALL_STATUS_CONFIG,
} from "../constants/workflow.constants";
import type {
  WorkflowRequestResponse,
  WorkflowOverallStatus,
} from "../types/workflow.types";
import { ApprovalActionDialog, type ApprovalActionMode } from "./approval-action-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApprovalTimeline } from "./approval-timeline";

interface WorkflowInboxTableProps {
  items: WorkflowRequestResponse[];
  isLoading: boolean;
  activeTab: "inbox" | "submitted" | "history";
  page: number;
  totalPages: number;
  totalItems: number;
  size: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

export function WorkflowInboxTable({
  items,
  isLoading,
  activeTab,
  page,
  totalPages,
  totalItems,
  size,
  onPageChange,
  onRefresh,
}: WorkflowInboxTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<WorkflowRequestResponse | null>(null);
  const [actionMode, setActionMode] = useState<ApprovalActionMode | null>(null);
  const [previewRequestId, setPreviewRequestId] = useState<string | null>(null);

  const handleAction = (request: WorkflowRequestResponse, mode: ApprovalActionMode) => {
    setSelectedRequest(request);
    setActionMode(mode);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border p-4 shadow-sm space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-card rounded-xl border p-12 text-center shadow-sm">
        <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-foreground">
          Không có yêu cầu phê duyệt nào
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          {activeTab === "inbox"
            ? "Hộp thư của bạn đang trống. Hiện tại không có yêu cầu nào chờ bạn duyệt."
            : activeTab === "submitted"
            ? "Bạn chưa gửi yêu cầu phê duyệt nào hoặc chưa có chứng từ gửi duyệt."
            : "Chưa có lịch sử phê duyệt nào được ghi nhận."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px] font-semibold text-xs">Mã hồ sơ</TableHead>
                <TableHead className="min-w-[220px] font-semibold text-xs">Tiêu đề yêu cầu</TableHead>
                <TableHead className="w-[160px] font-semibold text-xs">Loại chứng từ</TableHead>
                <TableHead className="w-[160px] font-semibold text-xs">Người gửi</TableHead>
                <TableHead className="w-[180px] font-semibold text-xs">Bước hiện tại</TableHead>
                <TableHead className="w-[140px] font-semibold text-xs">Trạng thái</TableHead>
                <TableHead className="w-[140px] font-semibold text-xs">Ngày gửi</TableHead>
                <TableHead className="w-[90px] text-right font-semibold text-xs">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const statusConfig = OVERALL_STATUS_CONFIG[item.overallStatus] || {
                  label: item.overallStatus,
                  className: "bg-muted text-muted-foreground",
                };

                const isPending = item.overallStatus === "PENDING";
                const isMyInbox = activeTab === "inbox";
                const isMySubmitted = activeTab === "submitted";

                return (
                  <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                    {/* Mã hồ sơ */}
                    <TableCell className="font-mono text-xs font-medium text-foreground">
                      {item.referenceCode || "---"}
                    </TableCell>

                    {/* Tiêu đề & Amount */}
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setPreviewRequestId(item.id)}
                        className="text-left font-semibold text-xs text-foreground hover:text-primary transition-colors block line-clamp-1"
                      >
                        {item.title}
                      </button>
                      {item.requestAmount ? (
                        <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                          Giá trị: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.requestAmount)}
                        </div>
                      ) : null}
                    </TableCell>

                    {/* Loại chứng từ */}
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-normal py-0">
                        {REQUEST_TYPE_MAP[item.requestType] || item.requestType}
                      </Badge>
                    </TableCell>

                    {/* Người gửi */}
                    <TableCell className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <User className="w-3 h-3" />
                        </div>
                        <span className="truncate max-w-[120px] font-medium">
                          {item.requesterName}
                        </span>
                      </div>
                    </TableCell>

                    {/* Bước hiện tại */}
                    <TableCell className="text-xs">
                      {item.currentStepName ? (
                        <div className="space-y-0.5">
                          <div className="font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Bước {item.currentStepOrder}: {item.currentStepName}</span>
                          </div>
                          {item.currentAssigneeName && (
                            <div className="text-[11px] text-muted-foreground">
                              Duyệt: {item.currentAssigneeName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">---</span>
                      )}
                    </TableCell>

                    {/* Trạng thái chung */}
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border",
                          statusConfig.className
                        )}
                      >
                        {statusConfig.label}
                      </span>
                    </TableCell>

                    {/* Ngày gửi */}
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : "---"}
                    </TableCell>

                    {/* Thao tác */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-xs">
                          <DropdownMenuItem
                            onClick={() => setPreviewRequestId(item.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 mr-2" />
                            Xem tiến trình duyệt
                          </DropdownMenuItem>

                          {isMyInbox && isPending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleAction(item, "APPROVE")}
                                className="cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 dark:focus:bg-emerald-950/50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                Phê duyệt
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleAction(item, "REJECT")}
                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-2" />
                                Từ chối
                              </DropdownMenuItem>
                            </>
                          )}

                          {isMySubmitted && isPending && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleAction(item, "CANCEL")}
                                className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:focus:bg-red-950/50"
                              >
                                <Ban className="w-3.5 h-3.5 mr-2" />
                                Hủy yêu cầu
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
            <div>
              Hiển thị {(page - 1) * size + 1} - {Math.min(page * size, totalItems)} / {totalItems} hồ sơ
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="h-7 px-2.5 text-xs"
              >
                Trước
              </Button>
              <span className="px-2 font-medium text-foreground">
                Trang {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="h-7 px-2.5 text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Action Dialog */}
      <ApprovalActionDialog
        isOpen={Boolean(actionMode && selectedRequest)}
        onClose={() => {
          setActionMode(null);
          setSelectedRequest(null);
        }}
        mode={actionMode}
        request={selectedRequest}
        stepId={selectedRequest?.currentStepOrder ? "CURRENT" : undefined}
        onSuccess={onRefresh}
      />

      {/* Preview Progress Dialog */}
      <Dialog
        open={Boolean(previewRequestId)}
        onOpenChange={(open) => !open && setPreviewRequestId(null)}
      >
        <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Chi tiết tiến trình phê duyệt
            </DialogTitle>
          </DialogHeader>
          {previewRequestId && (
            <ApprovalTimeline
              requestId={previewRequestId}
              canApprove={activeTab === "inbox"}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


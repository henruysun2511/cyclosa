"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  User,
  Wrench,
  CheckCircle2,
  Play,
  UserCheck,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  useGetIssueByIdQuery,
  useStartIssueMutation,
  useResolveIssueMutation,
  useAssignIssueMutation,
  IssueResolveDialog,
  ISSUE_STATUS_OPTIONS,
  ISSUE_SEVERITY_OPTIONS,
  ISSUE_TYPE_OPTIONS,
} from "@/features/workplace";

export default function WorkplaceIssueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params?.id as string;

  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [technicianId, setTechnicianId] = useState("");

  const { data: issue, isLoading, refetch } = useGetIssueByIdQuery(issueId, { skip: !issueId });
  const [startIssue, { isLoading: isStarting }] = useStartIssueMutation();
  const [resolveIssue, { isLoading: isResolving }] = useResolveIssueMutation();
  const [assignIssue, { isLoading: isAssigning }] = useAssignIssueMutation();

  const statusConfig =
    ISSUE_STATUS_OPTIONS.find((s) => s.value === issue?.status) || ISSUE_STATUS_OPTIONS[0];
  const severityConfig =
    ISSUE_SEVERITY_OPTIONS.find((s) => s.value === issue?.severity) || ISSUE_SEVERITY_OPTIONS[0];
  const typeConfig =
    ISSUE_TYPE_OPTIONS.find((t) => t.value === issue?.issueType) || ISSUE_TYPE_OPTIONS[0];

  const handleStart = async () => {
    try {
      await startIssue(issueId).unwrap();
      toast.success("Đã tiếp nhận và bắt đầu xử lý sự cố!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể cập nhật tiến trình xử lý sự cố.");
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!technicianId.trim()) {
      toast.warning("Vui lòng nhập ID nhân sự kỹ thuật viên");
      return;
    }

    try {
      await assignIssue({ issueId, assignedEmployeeId: technicianId.trim() }).unwrap();
      toast.success("Phân công nhân sự xử lý sự cố thành công!");
      setIsAssignDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể phân công kỹ thuật viên.");
    }
  };

  const handleConfirmResolve = async (id: string, note: string) => {
    try {
      await resolveIssue({ issueId: id, resolutionNote: note }).unwrap();
      toast.success("Nghiệm thu và đóng hồ sơ sự cố thành công!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể nghiệm thu sự cố.");
      throw err;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header chuẩn Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <AlertCircle className="w-6 h-6 text-primary shrink-0" />
            <span>Chi tiết Sự cố: {issue?.title || "Hồ sơ sự cố"}</span>
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/workplace" className="hover:text-primary transition-colors">
              Không gian làm việc
            </Link>
            <span>/</span>
            <Link href="/workplace/issues" className="hover:text-primary transition-colors">
              Sự cố kỹ thuật
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{issue?.title || "Chi tiết"}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 gap-1.5"
            title="Làm mới dữ liệu từ máy chủ"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Làm mới</span>
          </Button>

          {issue?.status === "OPEN" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAssignDialogOpen(true)}
                className="h-9 gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-primary" />
                <span>Phân công xử lý</span>
              </Button>

              <Button
                size="sm"
                onClick={handleStart}
                disabled={isStarting}
                className="h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Play className="w-4 h-4" />
                <span>Bắt đầu xử lý</span>
              </Button>
            </>
          )}

          {issue?.status === "IN_PROGRESS" && (
            <Button
              size="sm"
              onClick={() => setIsResolveDialogOpen(true)}
              className="h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nghiệm thu sự cố</span>
            </Button>
          )}
        </div>
      </div>

      {/* 2. Thẻ chỉ số & Trạng thái sự cố */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Trạng thái hồ sơ</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Phân loại & Mức độ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{typeConfig.label}</Badge>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${severityConfig.color}`}>
                Mức độ {severityConfig.label}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Thời gian tiếp nhận</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-foreground">
              {issue?.reportedAt ? new Date(issue.reportedAt).toLocaleString("vi-VN") : "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Kỹ thuật viên phụ trách</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold text-foreground">
              {issue?.assignedToName || <span className="text-muted-foreground italic">Chưa chỉ định</span>}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Chi tiết Nội dung & Tiến trình */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Mô tả chi tiết sự cố</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs leading-relaxed">
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60">
                <p className="font-semibold text-sm text-foreground mb-1.5">{issue?.title}</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{issue?.description}</p>
              </div>

              {issue?.resolutionNote && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-100">
                  <p className="font-semibold text-xs mb-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Kết quả khắc phục & Nghiệm thu:</span>
                  </p>
                  <p className="text-xs whitespace-pre-wrap">{issue.resolutionNote}</p>
                  {issue.resolvedAt && (
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Thời điểm nghiệm thu: {new Date(issue.resolvedAt).toLocaleString("vi-VN")}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Vị trí hiện trường</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="space-y-1">
                <p className="text-muted-foreground">Tầng làm việc:</p>
                <p className="font-semibold text-foreground">{issue?.floorName || "Khu vực tầng"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Điểm cụ thể:</p>
                <p className="font-semibold text-foreground font-mono">
                  {issue?.seatCode ? `Bàn làm việc: ${issue.seatCode}` : issue?.floorObjectName || "Khu vực chung"}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <p className="text-muted-foreground">Người báo cáo sự cố:</p>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span>{issue?.reporterName}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog Phân công Kỹ thuật viên */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Phân công Kỹ thuật viên xử lý</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAssign} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mã định danh Kỹ thuật viên / IT (UUID) *</Label>
              <Input
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                placeholder="Nhập Employee ID của kỹ thuật viên..."
                className="text-xs h-9 font-mono"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAssignDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" size="sm" disabled={isAssigning}>
                {isAssigning ? "Đang phân công..." : "Xác nhận phân công"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Nghiệm thu Sự cố */}
      <IssueResolveDialog
        open={isResolveDialogOpen}
        onOpenChange={setIsResolveDialogOpen}
        issue={issue || null}
        onSubmit={handleConfirmResolve}
        isLoading={isResolving}
      />
    </div>
  );
}

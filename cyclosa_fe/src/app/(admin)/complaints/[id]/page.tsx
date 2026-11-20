"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquareWarning,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle2,
  Lock,
  PlayCircle,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ComplaintStatusBadge,
  AssignComplaintDialog,
  ResolveComplaintDialog,
  useGetComplaintByIdQuery,
  useStartComplaintInvestigationMutation,
  useCloseComplaintMutation,
  COMPLAINT_CATEGORY_LABELS,
} from "@/features/reward";
import { toast } from "sonner";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ComplaintDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data, isLoading, refetch } = useGetComplaintByIdQuery(id);
  const [startInvestigation, { isLoading: isStarting }] =
    useStartComplaintInvestigationMutation();
  const [closeComplaint, { isLoading: isClosing }] = useCloseComplaintMutation();

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  const complaint = data?.data;

  const handleStartInvestigate = async () => {
    try {
      await startInvestigation(id).unwrap();
      toast.success("Bắt đầu điều tra xác minh khiếu nại");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Không thể chuyển trạng thái");
    }
  };

  const handleClose = async () => {
    if (confirm("Xác nhận đóng vĩnh viễn hồ sơ khiếu nại này?")) {
      try {
        await closeComplaint(id).unwrap();
        toast.success("Đã đóng hồ sơ khiếu nại");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể đóng hồ sơ");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-muted-foreground">Không tìm thấy đơn khiếu nại này.</p>
        <Button variant="outline" size="sm" onClick={() => router.push("/complaints")}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header Chuẩn mực theo Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <MessageSquareWarning className="w-6 h-6 text-primary shrink-0" />
            <span>Chi tiết khiếu nại: {complaint.subject}</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/complaints" className="hover:text-primary transition-colors">
              Khiếu nại & Phản ánh
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{complaint.complainantEmployeeName}</span>
          </nav>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/complaints")}
            className="h-8 text-xs gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </Button>

          {complaint.status !== "CLOSED" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssignDialogOpen(true)}
              className="h-8 text-xs gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Phân công thụ lý</span>
            </Button>
          )}

          {complaint.status === "OPEN" && (
            <Button
              size="sm"
              onClick={handleStartInvestigate}
              disabled={isStarting}
              className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Bắt đầu điều tra</span>
            </Button>
          )}

          {complaint.status === "INVESTIGATING" && (
            <Button
              size="sm"
              onClick={() => setResolveDialogOpen(true)}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ghi nhận giải quyết</span>
            </Button>
          )}

          {complaint.status === "RESOLVED" && (
            <Button
              size="sm"
              onClick={handleClose}
              disabled={isClosing}
              className="h-8 text-xs gap-1.5 bg-slate-700 hover:bg-slate-800 text-white"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Đóng hồ sơ</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái: Nội dung khiếu nại & Phương án giải quyết */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquareWarning className="w-4 h-4 text-primary" />
                <span>Nội dung phản ánh / khiếu nại</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground font-medium">Tiêu đề:</span>
                <p className="text-base font-bold text-foreground mt-0.5">
                  {complaint.subject}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground font-medium">Nội dung chi tiết:</span>
                <p className="mt-1 p-4 bg-muted/40 rounded-xl text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {complaint.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Phương án giải quyết */}
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kết luận và phương án giải quyết</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs">
              {complaint.resolution ? (
                <div className="space-y-2">
                  <p className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-emerald-900 text-sm leading-relaxed whitespace-pre-wrap">
                    {complaint.resolution}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Thời gian giải quyết: {complaint.resolvedAt?.replace("T", " ")}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-3">
                  Chưa có kết luận giải quyết cho khiếu nại này.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Thông tin người gửi & Cán bộ thụ lý */}
        <div className="space-y-6">
          <Card className="shadow-xs border-border/60">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Thông tin người gửi & Thụ lý</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3 text-xs">
              <div>
                <span className="text-muted-foreground">Người khiếu nại:</span>
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {complaint.complainantEmployeeName}
                </p>
                <p className="text-muted-foreground font-mono">
                  {complaint.complainantEmployeeCode}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Phân loại:</span>
                <p className="font-medium text-foreground mt-0.5">
                  {COMPLAINT_CATEGORY_LABELS[complaint.category] || complaint.category}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground">Trạng thái:</span>
                <div className="mt-1">
                  <ComplaintStatusBadge status={complaint.status} />
                </div>
              </div>

              <div className="pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Cán bộ HR phụ trách thụ lý:</span>
                <p className="font-semibold text-foreground text-sm mt-0.5">
                  {complaint.handlerEmployeeName || (
                    <span className="text-muted-foreground italic font-normal">
                      Chưa được phân công
                    </span>
                  )}
                </p>
              </div>

              <div className="pt-2 border-t border-border/60 space-y-1 text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ngày gửi: {complaint.submittedAt?.replace("T", " ")}</span>
                </p>
                {complaint.closedAt && (
                  <p className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Đã đóng: {complaint.closedAt?.replace("T", " ")}</span>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <AssignComplaintDialog
        complaint={complaint}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
      />

      <ResolveComplaintDialog
        complaint={complaint}
        open={resolveDialogOpen}
        onOpenChange={setResolveDialogOpen}
      />
    </div>
  );
}


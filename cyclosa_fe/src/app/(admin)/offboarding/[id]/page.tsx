"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  UserCheck,
  Building,
  FileCheck2,
  FileText,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  useGetOffboardingRequestByIdQuery,
  useGetClearanceItemsQuery,
  useGetExitInterviewQuery,
  useGetOffboardingSummaryQuery,
  useCompleteOffboardingMutation,
} from "@/features/offboarding/api/offboarding-api";
import {
  OffboardingStatusBadge,
  OffboardingTypeBadge,
  ClearanceStatusBadge,
} from "@/features/offboarding/components/offboarding-badges";
import {
  CLEARANCE_TYPE_CONFIG,
  RESIGNATION_REASON_LABELS,
  TERMINATION_REASON_LABELS,
} from "@/features/offboarding/constants/offboarding.constants";
import { ClearanceActionDialog } from "@/features/offboarding/components/dialogs/clearance-action-dialog";
import { ExitInterviewDialog } from "@/features/offboarding/components/dialogs/exit-interview-dialog";
import { ApproveResignationDialog } from "@/features/offboarding/components/dialogs/approve-resignation-dialog";
import { RejectResignationDialog } from "@/features/offboarding/components/dialogs/reject-resignation-dialog";
import { OffboardingHandoverTab } from "@/features/offboarding/components/offboarding-handover-tab";
import type { OffboardingClearanceItem } from "@/features/offboarding/types/offboarding.types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OffboardingDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: requestRes, isLoading: isReqLoading } =
    useGetOffboardingRequestByIdQuery(id);
  const { data: clearanceRes, isLoading: isClearanceLoading } =
    useGetClearanceItemsQuery(id);
  const { data: interviewRes } = useGetExitInterviewQuery(id);
  const { data: summaryRes, isLoading: isSummaryLoading } =
    useGetOffboardingSummaryQuery(id);

  const [completeOffboarding, { isLoading: isCompleting }] =
    useCompleteOffboardingMutation();

  // Dialog States
  const [selectedClearanceItem, setSelectedClearanceItem] =
    useState<OffboardingClearanceItem | null>(null);
  const [openClearanceDialog, setOpenClearanceDialog] = useState(false);
  const [openInterviewDialog, setOpenInterviewDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const request = requestRes?.data;
  const clearanceItems = clearanceRes?.data || [];
  const exitInterview = interviewRes?.data;
  const summary = summaryRes?.data;

  const handleComplete = async () => {
    if (
      !confirm(
        `Xác nhận hoàn tất toàn bộ thủ tục thôi việc cho nhân sự ${request?.employeeName}?\nHành động này sẽ cập nhật trạng thái nhân viên và vô hiệu hóa tài khoản hệ thống.`
      )
    ) {
      return;
    }

    try {
      await completeOffboarding(id).unwrap();
      toast.success("Đã hoàn tất toàn bộ thủ tục thôi việc thành công");
    } catch (error: any) {
      toast.error(error?.data?.message || "Không thể hoàn tất thủ tục thôi việc");
    }
  };

  if (isReqLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="h-28 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="text-lg font-semibold">Không tìm thấy hồ sơ thôi việc</div>
        <Button variant="outline" asChild>
          <Link href="/offboarding">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>
    );
  }

  const initials = request.employeeName
    ? request.employeeName
        .split(" ")
        .map((n) => n[0])
        .slice(-2)
        .join("")
        .toUpperCase()
    : "NV";

  const isCompleted = request.status === "COMPLETED";

  return (
    <div className="space-y-6">
      {/* Nút quay lại & Tiêu đề trang (Rule 02: Không bọc icon box, không subtitle) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link href="/offboarding">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Chi tiết Hồ sơ Thôi việc</h1>
        </div>

        {/* Nút hành động chính */}
        <div className="flex items-center gap-2">
          {request.status === "PENDING" && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setOpenRejectDialog(true)}
              >
                Từ chối đơn
              </Button>
              <Button
                size="sm"
                onClick={() => setOpenApproveDialog(true)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Phê duyệt đơn
              </Button>
            </>
          )}

          {!isCompleted && request.status !== "PENDING" && (
            <Button
              size="sm"
              disabled={!summary?.canComplete || isCompleting}
              onClick={handleComplete}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {isCompleting ? "Đang xử lý..." : "Hoàn tất thủ tục"}
            </Button>
          )}
        </div>
      </div>

      {/* Banner thông tin nhân sự */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full border border-border bg-primary/10 text-primary flex items-center justify-center text-base font-semibold shrink-0">
                {initials}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold">{request.employeeName}</h2>
                  <OffboardingTypeBadge type={request.type} />
                  <OffboardingStatusBadge status={request.status} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-mono">{request.employeeCode}</span>
                  {request.departmentName && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {request.departmentName}
                      </span>
                    </>
                  )}
                  {request.positionName && (
                    <>
                      <span>•</span>
                      <span>{request.positionName}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Ngày làm việc cuối: <strong className="text-foreground">{request.actualLastWorkingDate}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Tiến độ bàn giao mini */}
            <div className="min-w-[200px] space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/40">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tiến độ bàn giao:</span>
                <span className="font-semibold text-foreground">
                  {request.clearedItemsCount}/{request.totalClearanceItems} ({request.clearanceProgressPercent}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all rounded-full"
                  style={{ width: `${request.clearanceProgressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs nội dung */}
      <Tabs defaultValue="clearance" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="clearance" className="text-xs">
            5 Hạng mục bàn giao ({request.clearedItemsCount}/5)
          </TabsTrigger>
          <TabsTrigger value="handover" className="text-xs">
            Chỗ ngồi & Tài sản (Liên thông)
          </TabsTrigger>
          <TabsTrigger value="info" className="text-xs">
            Thông tin & Lý do
          </TabsTrigger>
          <TabsTrigger value="interview" className="text-xs">
            Phỏng vấn thôi việc {exitInterview ? "✓" : ""}
          </TabsTrigger>
          <TabsTrigger value="summary" className="text-xs">
            Kiểm tra hoàn tất
          </TabsTrigger>
        </TabsList>

        {/* Tab 0: Liên thông Chỗ ngồi & Tài sản */}
        <TabsContent value="handover" className="space-y-4">
          <OffboardingHandoverTab requestId={id} isCompleted={isCompleted} />
        </TabsContent>

        {/* Tab 1: 5 Hạng mục bàn giao */}
        <TabsContent value="clearance" className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {clearanceItems.map((item) => {
              const config = CLEARANCE_TYPE_CONFIG[item.clearanceType];
              return (
                <Card key={item.id} className="border-border/60 shadow-sm hover:border-border transition-colors">
                  <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        0{config.step}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{config.label}</span>
                          <ClearanceStatusBadge status={item.status} />
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xl">
                          {config.description}
                        </p>
                        {item.notes && (
                          <div className="text-xs text-foreground bg-muted/40 p-2 rounded-md mt-1 border border-border/40">
                            <strong>Ghi chú:</strong> {item.notes}
                          </div>
                        )}
                        {item.clearedByName && (
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-0.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Xác nhận bởi: <span className="font-medium text-foreground">{item.clearedByName}</span>
                            {item.clearedAt && (
                              <span>vào lúc {new Date(item.clearedAt).toLocaleDateString("vi-VN")}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClearanceItem(item);
                          setOpenClearanceDialog(true);
                        }}
                        className="shrink-0 text-xs h-8"
                      >
                        Cập nhật xác nhận
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Tab 2: Thông tin & Lý do */}
        <TabsContent value="info" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Chi tiết Lý do & Căn cứ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                {request.type === "RESIGNATION" ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Lý do xin thôi việc:</span>
                      <span className="font-medium">
                        {request.resignationReason
                          ? RESIGNATION_REASON_LABELS[request.resignationReason]
                          : "Chưa rõ"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ngày gửi thông báo:</span>
                      <span className="font-medium">{request.noticeDate || "—"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ngày mong muốn nghỉ:</span>
                      <span className="font-medium">{request.desiredLastWorkingDate || "—"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Lý do chấm dứt:</span>
                      <span className="font-medium">
                        {request.terminationReason
                          ? TERMINATION_REASON_LABELS[request.terminationReason]
                          : "Chưa rõ"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Số quyết định:</span>
                      <span className="font-mono font-medium">{request.decisionNumber || "—"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Ngày ký quyết định:</span>
                      <span className="font-medium">{request.decisionDate || "—"}</span>
                    </div>
                  </>
                )}

                <div className="space-y-1 pt-1">
                  <span className="text-muted-foreground font-medium">Chi tiết lý do / Căn cứ:</span>
                  <p className="text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                    {request.reasonDetail || "Không có thông tin chi tiết bổ sung."}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  Bàn giao & Người phê duyệt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Nhân sự tiếp nhận kế nhiệm:</span>
                  <span className="font-medium">
                    {request.successorName || "Chưa chỉ định"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Người phê duyệt / ban hành:</span>
                  <span className="font-medium">
                    {request.approverName || "Chưa có"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Thời điểm phê duyệt:</span>
                  <span className="font-medium">
                    {request.approvedAt
                      ? new Date(request.approvedAt).toLocaleDateString("vi-VN")
                      : "—"}
                  </span>
                </div>
                {request.rejectionReason && (
                  <div className="space-y-1 pt-1">
                    <span className="text-rose-600 font-medium">Lý do từ chối:</span>
                    <p className="text-rose-700 bg-rose-50 dark:bg-rose-950/20 p-2.5 rounded-lg border border-rose-200 leading-relaxed">
                      {request.rejectionReason}
                    </p>
                  </div>
                )}
                {request.notes && (
                  <div className="space-y-1 pt-1">
                    <span className="text-muted-foreground font-medium">Ghi chú nội bộ:</span>
                    <p className="text-foreground bg-muted/30 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                      {request.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Phỏng vấn thôi việc */}
        <TabsContent value="interview" className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Khảo sát Phỏng vấn thôi việc
              </CardTitle>
              {!isCompleted && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenInterviewDialog(true)}
                  className="h-8 text-xs"
                >
                  {exitInterview ? "Chỉnh sửa khảo sát" : "Ghi nhận phỏng vấn"}
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {exitInterview ? (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/30 rounded-xl border border-border/40">
                    <div>
                      <span className="text-muted-foreground">Người phỏng vấn:</span>
                      <div className="font-medium text-foreground mt-0.5">{exitInterview.interviewerName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ngày phỏng vấn:</span>
                      <div className="font-medium text-foreground mt-0.5">{exitInterview.interviewDate}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sẵn sàng giới thiệu:</span>
                      <div className="font-medium text-foreground mt-0.5">
                        {exitInterview.willingToRecommend ? (
                          <span className="text-emerald-600 font-semibold">Có giới thiệu</span>
                        ) : (
                          <span className="text-slate-500">Không</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {exitInterview.primaryReason && (
                    <div className="space-y-1">
                      <span className="text-muted-foreground font-medium">Lý do chính yếu:</span>
                      <p className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-foreground">
                        {exitInterview.primaryReason}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exitInterview.workingEnvironmentFeedback && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">Phản hồi môi trường & văn hóa:</span>
                        <p className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-foreground">
                          {exitInterview.workingEnvironmentFeedback}
                        </p>
                      </div>
                    )}
                    {exitInterview.managementFeedback && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">Phản hồi quản lý trực tiếp:</span>
                        <p className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-foreground">
                          {exitInterview.managementFeedback}
                        </p>
                      </div>
                    )}
                    {exitInterview.compensationFeedback && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">Phản hồi đãi ngộ & thu nhập:</span>
                        <p className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-foreground">
                          {exitInterview.compensationFeedback}
                        </p>
                      </div>
                    )}
                    {exitInterview.improvementSuggestions && (
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-medium">Đề xuất cải thiện:</span>
                        <p className="p-2.5 rounded-lg bg-muted/20 border border-border/40 text-foreground">
                          {exitInterview.improvementSuggestions}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <div className="text-muted-foreground text-xs">Chưa có bản ghi phỏng vấn thôi việc cho hồ sơ này.</div>
                  {!isCompleted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenInterviewDialog(true)}
                    >
                      Bắt đầu khảo sát phỏng vấn
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Kiểm tra điều kiện hoàn tất */}
        <TabsContent value="summary" className="space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-primary" />
                Kiểm tra Điều kiện tiên quyết & Hoàn tất thủ tục
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2.5">
                {/* Điều kiện 1 */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card">
                  {request.status === "APPROVED" || request.status === "PROCESSING" || isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">
                      Đơn thôi việc / Quyết định chấm dứt đã được phê duyệt hợp lệ
                    </div>
                    <div className="text-muted-foreground">
                      Trạng thái hiện tại: {request.status}
                    </div>
                  </div>
                </div>

                {/* Điều kiện 2 */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card">
                  {request.clearedItemsCount === 5 || isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">
                      Đã xác nhận đầy đủ 5 hạng mục bàn giao Offboarding Clearance
                    </div>
                    <div className="text-muted-foreground">
                      Đã hoàn tất {request.clearedItemsCount}/5 hạng mục
                    </div>
                  </div>
                </div>

                {/* Điều kiện 3 */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card">
                  {summary?.unreturnedAssetsCount === 0 || isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div className="text-xs">
                    <div className="font-semibold text-foreground">
                      Thu hồi 100% trang thiết bị và tài sản công ty
                    </div>
                    <div className="text-muted-foreground">
                      Số tài sản chưa thu hồi: {summary?.unreturnedAssetsCount ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cảnh báo hành động */}
              {!isCompleted ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-semibold text-xs">
                    <ShieldAlert className="w-4 h-4" />
                    Tác động hệ thống khi bấm Hoàn tất thủ tục:
                  </div>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1">
                    <li>Chuyển trạng thái nhân sự sang <strong>RESIGNED</strong> (Thôi việc) hoặc <strong>TERMINATED</strong> (Chấm dứt HĐLĐ).</li>
                    <li>Khóa tài khoản người dùng đăng nhập hệ thống nội bộ của nhân viên.</li>
                    <li>Đóng hồ sơ bàn giao và lưu trữ vĩnh viễn trong lịch sử nhân sự.</li>
                  </ul>
                  <div className="pt-2">
                    <Button
                      disabled={!summary?.canComplete || isCompleting}
                      onClick={handleComplete}
                      className="w-full sm:w-auto"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      {isCompleting ? "Đang thực thi..." : "Xác nhận & Hoàn tất thủ tục thôi việc"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                  Hồ sơ thôi việc này đã được hoàn tất thủ tục thành công vào lúc{" "}
                  {request.completedAt ? new Date(request.completedAt).toLocaleString("vi-VN") : "—"}.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ClearanceActionDialog
        requestId={id}
        item={selectedClearanceItem}
        open={openClearanceDialog}
        onOpenChange={setOpenClearanceDialog}
      />

      <ExitInterviewDialog
        requestId={id}
        interview={exitInterview}
        open={openInterviewDialog}
        onOpenChange={setOpenInterviewDialog}
      />

      <ApproveResignationDialog
        request={request}
        open={openApproveDialog}
        onOpenChange={setOpenApproveDialog}
      />

      <RejectResignationDialog
        request={request}
        open={openRejectDialog}
        onOpenChange={setOpenRejectDialog}
      />
    </div>
  );
}

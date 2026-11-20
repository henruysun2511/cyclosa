"use client";

import React, { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Play,
  RotateCcw,
  Send,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetTransferByIdQuery,
  useSubmitTransferMutation,
  useApplyTransferMutation,
  useReturnTemporaryTransferMutation,
} from "@/features/transfer/api/transfer-api";
import {
  TRANSFER_STATUS_VARIANTS,
  TRANSFER_TYPE_VARIANTS,
} from "@/features/transfer/constants/transfer.constants";
import { ApproveTransferDialog } from "@/features/transfer/components/approve-transfer-dialog";
import { RejectTransferDialog } from "@/features/transfer/components/reject-transfer-dialog";
import { ExtendTransferDialog } from "@/features/transfer/components/extend-transfer-dialog";
import { usePermission } from "@/features/authorization/hooks/use-permission";

interface TransferDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TransferDetailPage({ params }: TransferDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const transferId = resolvedParams.id;

  const { can } = usePermission();
  const canManage = can("transfer.manage") || can("transfer.create");
  const canApprove = can("transfer.approve") || can("transfer.manage");

  const { data, isLoading, refetch } = useGetTransferByIdQuery(transferId);
  const transfer = data?.data;

  const [submitTransfer, { isLoading: isSubmitting }] = useSubmitTransferMutation();
  const [applyTransfer, { isLoading: isApplying }] = useApplyTransferMutation();
  const [returnTransfer, { isLoading: isReturning }] = useReturnTemporaryTransferMutation();

  const [approveOpen, setApproveOpen] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [extendOpen, setExtendOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="p-8 text-center max-w-md mx-auto space-y-4">
        <p className="text-sm text-muted-foreground">Không tìm thấy thông tin phiếu điều chuyển.</p>
        <Button variant="outline" onClick={() => router.push("/transfers")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const typeCfg = TRANSFER_TYPE_VARIANTS[transfer.transferType] || {
    label: transfer.transferType,
    className: "bg-muted text-muted-foreground",
  };
  const statusCfg = TRANSFER_STATUS_VARIANTS[transfer.status] || {
    label: transfer.status,
    className: "bg-muted text-muted-foreground",
  };

  const initials = transfer.employeeName
    ? transfer.employeeName
        .split(" ")
        .map((n) => n[0])
        .slice(-2)
        .join("")
    : "NV";

  const handleSubmit = async () => {
    if (confirm("Trình duyệt phiếu điều chuyển này?")) {
      try {
        await submitTransfer(transfer.id).unwrap();
        toast.success("Đã trình phê duyệt phiếu điều chuyển");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể trình phê duyệt");
      }
    }
  };

  const handleApply = async () => {
    if (
      confirm(
        "Xác nhận áp dụng quyết định điều chuyển vào hồ sơ nhân sự? Thông tin công tác mới sẽ có hiệu lực ngay lập tức."
      )
    ) {
      try {
        await applyTransfer(transfer.id).unwrap();
        toast.success("Áp dụng quyết định điều chuyển thành công");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể áp dụng quyết định");
      }
    }
  };

  const handleReturn = async () => {
    if (confirm("Xác nhận thực hiện điều chuyển hồi hương về đơn vị cũ?")) {
      try {
        await returnTransfer(transfer.id).unwrap();
        toast.success("Điều chuyển hồi hương thành công");
        refetch();
      } catch (err: any) {
        toast.error(err?.data?.message || "Không thể điều chuyển hồi hương");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Breadcrumbs chuẩn 100% Rule 02 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-foreground">
            <ArrowLeftRight className="w-6 h-6 text-primary shrink-0" />
            <span>Chi tiết phiếu điều chuyển #{transfer.id.slice(0, 8)}</span>
          </h1>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/employees" className="hover:text-primary transition-colors">
              Hồ sơ nhân sự
            </Link>
            <span>/</span>
            <Link href="/transfers" className="hover:text-primary transition-colors">
              Điều chuyển nhân sự
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">{transfer.employeeName}</span>
          </nav>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {canManage && transfer.status === "DRAFT" && (
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting} className="h-8 text-xs gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Trình phê duyệt
            </Button>
          )}

          {canApprove && (transfer.status === "PENDING_APPROVAL" || transfer.status === "SUBMITTED") && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="h-8 text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Từ chối
              </Button>
              <Button
                size="sm"
                onClick={() => setApproveOpen(true)}
                className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Phê duyệt
              </Button>
            </>
          )}

          {canManage && transfer.status === "APPROVED" && (
            <Button
              size="sm"
              onClick={handleApply}
              disabled={isApplying}
              className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Play className="w-3.5 h-3.5" />
              Áp dụng vào hồ sơ
            </Button>
          )}

          {canManage &&
            transfer.transferType === "TEMPORARY_DISPATCH" &&
            transfer.status === "COMPLETED" &&
            !transfer.isReturned && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExtendOpen(true)}
                  className="h-8 text-xs gap-1.5 text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Gia hạn biệt phái
                </Button>
                <Button
                  size="sm"
                  onClick={handleReturn}
                  disabled={isReturning}
                  className="h-8 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Điều chuyển hồi hương
                </Button>
              </>
            )}
        </div>
      </div>

      {/* 2. Banner Thông tin Nhân viên & Trạng thái phiếu */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border bg-card shadow-xs gap-4">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full border border-border bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0 overflow-hidden">
            {transfer.employeePortraitUrl ? (
              <img
                src={transfer.employeePortraitUrl}
                alt={transfer.employeeName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">{transfer.employeeName}</h2>
            <p className="text-xs text-muted-foreground font-mono">
              Mã NV: {transfer.employeeCode} {transfer.employeeEmail ? `• ${transfer.employeeEmail}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs px-2.5 py-0.5 ${typeCfg.className}`}>
            {typeCfg.label}
          </Badge>
          <Badge variant="outline" className={`text-xs px-2.5 py-0.5 ${statusCfg.className}`}>
            {statusCfg.label}
          </Badge>
        </div>
      </div>

      {/* 3. Khối So sánh Đối chiếu Trước <-> Sau (Side-by-Side Comparison) */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch">
        {/* Đơn vị Hiện tại (Nguồn) */}
        <Card className="md:col-span-5 shadow-xs border-dashed border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Đơn vị công tác trước
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Phòng ban:</span>
              <p className="font-semibold text-foreground text-sm">{transfer.fromDepartmentName}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Chức danh / Vị trí:</span>
              <p className="font-medium text-foreground">{transfer.fromJobTitleName}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Chi nhánh / Khu vực:</span>
              <p className="font-medium text-foreground">{transfer.fromBranchName || "Hội sở chính"}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Quản lý trực tiếp:</span>
              <p className="font-medium text-foreground">{transfer.fromManagerName || "Không có"}</p>
            </div>
          </CardContent>
        </Card>

        {/* Mũi tên & Thời hạn */}
        <div className="md:col-span-1 flex flex-col items-center justify-center gap-1.5 py-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-xs">
            <ArrowRight className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground text-center">
            Hiệu lực:<br />
            <strong>{transfer.effectiveDate}</strong>
          </span>
          {transfer.endDate && (
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 text-center">
              Đến:<br />
              <strong>{transfer.endDate}</strong>
            </span>
          )}
        </div>

        {/* Đơn vị Tiếp nhận (Đích) */}
        <Card className="md:col-span-5 shadow-xs border-primary/40 bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Đơn vị tiếp nhận mới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Phòng ban mới:</span>
              <p className="font-bold text-primary text-sm">{transfer.toDepartmentName}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Chức danh mới:</span>
              <p className="font-semibold text-foreground">{transfer.toJobTitleName}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Chi nhánh mới:</span>
              <p className="font-medium text-foreground">{transfer.toBranchName || "Hội sở chính"}</p>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Quản lý trực tiếp mới:</span>
              <p className="font-medium text-foreground">{transfer.toManagerName || "Không có"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Khối Đãi ngộ Lương thưởng & Căn cứ Quyết định */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lý do & Căn cứ */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" /> Lý do & Căn cứ điều chuyển
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Lý do chính:</span>
              <p className="font-semibold text-foreground">{transfer.reasonDescription || transfer.reason}</p>
            </div>
            {transfer.reasonDetail && (
              <div>
                <span className="text-muted-foreground block text-[11px]">Nội dung chi tiết:</span>
                <p className="text-foreground leading-relaxed bg-muted/30 p-2.5 rounded-lg border text-xs">
                  {transfer.reasonDetail}
                </p>
              </div>
            )}
            {transfer.notes && (
              <div>
                <span className="text-muted-foreground block text-[11px]">Ghi chú / Ý kiến bổ sung:</span>
                <p className="text-muted-foreground whitespace-pre-line">{transfer.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Đãi ngộ Lương & Phụ cấp */}
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Chế độ đãi ngộ & Phụ cấp mới
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {transfer.hasSalaryAdjustment ? (
              <>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Lương cơ bản mới:</span>
                  <p className="text-base font-bold text-emerald-600 font-mono">
                    {transfer.toBaseSalary ? `${Number(transfer.toBaseSalary).toLocaleString("vi-VN")} VNĐ` : "Chưa nhập"}
                  </p>
                </div>
                {transfer.allowances && transfer.allowances.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block text-[11px] mb-1.5">Phụ cấp đi kèm:</span>
                    <div className="space-y-1.5">
                      {transfer.allowances.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border text-xs"
                        >
                          <span className="font-medium text-foreground">{a.allowanceName}</span>
                          <span className="font-mono font-semibold text-emerald-600">
                            +{Number(a.amount).toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground italic">
                Không có điều chỉnh mức lương và phụ cấp theo quyết định điều chuyển này.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 5. Nhật ký Phê duyệt & Trạng thái Thực thi */}
      {(transfer.approvedAt || transfer.completedAt || transfer.rejectionReason) && (
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" /> Tiến trình thẩm định & Thực thi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            {transfer.approvedAt && (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Đã được phê duyệt lúc <strong>{new Date(transfer.approvedAt).toLocaleString("vi-VN")}</strong>
                  {transfer.approvedByName ? ` bởi ${transfer.approvedByName}` : ""}
                </span>
              </div>
            )}
            {transfer.rejectionReason && (
              <div className="flex items-start gap-2 text-rose-600">
                <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span>Đã bị từ chối phê duyệt.</span>
                  <p className="font-medium mt-0.5">Lý do: {transfer.rejectionReason}</p>
                </div>
              </div>
            )}
            {transfer.completedAt && (
              <div className="flex items-center gap-2 text-primary font-medium">
                <Play className="w-4 h-4 shrink-0" />
                <span>
                  Đã hoàn tất áp dụng vào hồ sơ nhân sự lúc{" "}
                  <strong>{new Date(transfer.completedAt).toLocaleString("vi-VN")}</strong>
                  {transfer.completedByName ? ` bởi ${transfer.completedByName}` : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <ApproveTransferDialog
        transferId={transfer.id}
        open={approveOpen}
        onOpenChange={setApproveOpen}
        onSuccess={() => refetch()}
      />

      <RejectTransferDialog
        transferId={transfer.id}
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        onSuccess={() => refetch()}
      />

      <ExtendTransferDialog
        transferId={transfer.id}
        open={extendOpen}
        onOpenChange={setExtendOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}

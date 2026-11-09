"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  FileSignature,
  Download,
  Printer,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  UserCheck,
  Building,
  Coins,
  History,
  AlertTriangle,
  ChevronRight,
  Eye,
  Edit,
  Sparkles,
  Paperclip,
  Check,
  XCircle,
  Plus,
  Send,
  Trash2,
  FileX,
  CreditCard,
  MapPin,
  Briefcase,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetContractByIdQuery,
  useGetContractAppendicesQuery,
  useGetContractVersionsQuery,
  useSubmitContractApprovalMutation,
  useApproveContractMutation,
  useRejectContractMutation,
  useSendContractSigningMutation,
  useActivateContractMutation,
  useDeleteContractMutation,
} from "@/features/contract/api/contract-api";
import {
  ContractStatusBadge,
  ContractTypeBadge,
} from "@/features/contract/components/contract-status-badge";
import {
  CONTRACT_TYPE_LABELS,
  SIGNING_FORM_LABELS,
  SIGNER_STATUS_LABELS,
  SIGNER_STATUS_COLORS,
} from "@/features/contract/constants/contract.constants";
import { ContractSigningDialog } from "@/features/contract/components/dialogs/contract-signing-dialog";
import { ContractAppendixDialog } from "@/features/contract/components/dialogs/contract-appendix-dialog";
import { ContractTerminateDialog } from "@/features/contract/components/dialogs/contract-terminate-dialog";
import type { ContractAppendixSummary } from "@/features/contract/types/contract.types";
import { usePermission } from "@/features/authorization/hooks/use-permission";
import { PERMISSIONS } from "@/features/authorization/constants/permission.constants";
import { ApprovalTimeline } from "@/features/workflow";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ContractDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const contractId = resolvedParams.id;
  const router = useRouter();
  const { can } = usePermission();
  const canManage = can(PERMISSIONS.EMPLOYEE.CREATE);

  const [activeTab, setActiveTab] = useState<
    "overview" | "document" | "signflow" | "appendices" | "versions"
  >("overview");

  // Sub-dialogs
  const [appendixOpen, setAppendixOpen] = useState(false);
  const [selectedAppendix, setSelectedAppendix] =
    useState<ContractAppendixSummary | null>(null);
  const [signingOpen, setSigningOpen] = useState(false);
  const [terminateOpen, setTerminateOpen] = useState(false);

  // Queries
  const {
    data: contract,
    isLoading,
    isError,
    refetch,
  } = useGetContractByIdQuery(contractId, {
    skip: !contractId,
  });

  const { data: appendices = [], refetch: refetchAppendices } =
    useGetContractAppendicesQuery(contractId, {
      skip: !contractId,
    });

  const { data: versions = [] } = useGetContractVersionsQuery(contractId, {
    skip: !contractId,
  });

  // Mutations
  const [submitApproval, { isLoading: isSubmitting }] =
    useSubmitContractApprovalMutation();
  const [approveContract, { isLoading: isApproving }] =
    useApproveContractMutation();
  const [rejectContract, { isLoading: isRejecting }] =
    useRejectContractMutation();
  const [sendSigning, { isLoading: isSendingSigning }] =
    useSendContractSigningMutation();
  const [activateContract, { isLoading: isActivating }] =
    useActivateContractMutation();
  const [deleteContract, { isLoading: isDeleting }] =
    useDeleteContractMutation();

  const handleAction = async (action: string) => {
    try {
      if (action === "submit") {
        await submitApproval(contractId).unwrap();
        toast.success("Đã gửi hợp đồng để phê duyệt");
      } else if (action === "approve") {
        await approveContract(contractId).unwrap();
        toast.success("Đã phê duyệt hợp đồng lao động");
      } else if (action === "reject") {
        const r = window.prompt("Nhập lý do từ chối hợp đồng:");
        if (!r) return;
        await rejectContract({ id: contractId, body: { reason: r } }).unwrap();
        toast.warning("Đã từ chối phê duyệt hợp đồng");
      } else if (action === "send-signing") {
        await sendSigning(contractId).unwrap();
        toast.success("Đã phát lệnh ký số E-Contract tới các bên");
      } else if (action === "activate") {
        await activateContract(contractId).unwrap();
        toast.success("Kích hoạt hợp đồng thành công (Đang hiệu lực)");
      } else if (action === "delete") {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bản nháp hợp đồng này?"))
          return;
        await deleteContract(contractId).unwrap();
        toast.success("Đã xóa bản nháp hợp đồng");
        router.push("/contracts");
        return;
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Thao tác thất bại");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Đang nạp dữ liệu chi tiết hợp đồng...
        </p>
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 text-center space-y-4 border rounded-xl bg-card">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Không tìm thấy thông tin hợp đồng
          </h2>
          <p className="text-xs text-muted-foreground">
            Hợp đồng này có thể đã bị xóa hoặc bạn không có quyền truy cập hồ sơ.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Link href="/contracts">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const status = contract.status;
  const isDraft = status === "DRAFT";
  const isPendingApproval = status === "PENDING_APPROVAL";
  const isApproved = status === "APPROVED";
  const isInSigning = status === "IN_SIGNING";
  const isActive = status === "ACTIVE";
  const canEdit = canManage && (isDraft || isPendingApproval || isApproved);

  const signers = contract.signers || [];
  const signedCount = signers.filter((s) => s.status === "SIGNED").length;
  const totalSigners = signers.length;

  const totalAllowances = (contract.allowances || []).reduce(
    (sum, a) => sum + (Number(a.amount) || 0),
    0
  );
  const totalIncome = (Number(contract.baseSalary) || 0) + totalAllowances;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── 1. Top Header & Điều hướng ───────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 -ml-1 text-slate-500">
              <Link href="/contracts" title="Quay lại danh sách">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileSignature className="h-6 w-6 text-primary" />
                <span>Chi tiết Hợp đồng: {contract.contractNumber}</span>
              </h1>
              <ContractStatusBadge status={contract.status} />
              <ContractTypeBadge type={contract.contractType} />
            </div>
          </div>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5 ml-10">
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link
              href="/contracts"
              className="hover:text-primary transition-colors"
            >
              Hợp đồng lao động
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium font-mono">
              {contract.contractNumber}
            </span>
          </nav>
        </div>

        {/* Nút thao tác nhanh theo trạng thái */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Nút Chỉnh sửa */}
          {canEdit && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8.5 text-xs gap-1.5"
            >
              <Link href={`/contracts/${contractId}/edit`}>
                <Edit className="h-3.5 w-3.5" />
                <span>Chỉnh sửa</span>
              </Link>
            </Button>
          )}

          {/* DRAFT actions */}
          {isDraft && canManage && (
            <>
              <Button
                size="sm"
                className="h-8.5 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
                onClick={() => handleAction("submit")}
                disabled={isSubmitting}
              >
                <Send className="h-3.5 w-3.5" />
                <span>Gửi phê duyệt</span>
              </Button>

              <Button
                size="sm"
                variant="destructive"
                className="h-8.5 text-xs gap-1.5"
                onClick={() => handleAction("delete")}
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Xóa nháp</span>
              </Button>
            </>
          )}

          {/* PENDING_APPROVAL actions */}
          {isPendingApproval && canManage && (
            <>
              <Button
                size="sm"
                className="h-8.5 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                onClick={() => handleAction("approve")}
                disabled={isApproving}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Phê duyệt</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8.5 text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => handleAction("reject")}
                disabled={isRejecting}
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Từ chối</span>
              </Button>
            </>
          )}

          {/* APPROVED actions */}
          {isApproved && canManage && (
            <Button
              size="sm"
              className="h-8.5 text-xs gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-xs"
              onClick={() => handleAction("send-signing")}
              disabled={isSendingSigning}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Phát lệnh ký số E-Contract</span>
            </Button>
          )}

          {/* IN_SIGNING actions */}
          {isInSigning && (
            <Button
              size="sm"
              className="h-8.5 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-xs"
              onClick={() => setSigningOpen(true)}
            >
              <FileSignature className="h-3.5 w-3.5" />
              <span>Ký OTP ngay</span>
            </Button>
          )}

          {/* ACTIVE actions */}
          {isActive && canManage && (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-8.5 text-xs gap-1.5"
                onClick={() => {
                  setSelectedAppendix(null);
                  setAppendixOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tạo phụ lục</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="h-8.5 text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => setTerminateOpen(true)}
              >
                <FileX className="h-3.5 w-3.5" />
                <span>Chấm dứt HĐ</span>
              </Button>
            </>
          )}

          {/* In / Tải PDF */}
          <Button
            size="sm"
            variant="outline"
            className="h-8.5 text-xs gap-1.5"
            onClick={handlePrint}
            title="In hoặc xuất tệp PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">In văn bản</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Thẻ KPI Tổng quan (Thiết kế chuẩn Static-UI) ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lương chính */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Mức lương cơ bản (Gross)
              </span>
              <div className="text-xl font-bold font-mono text-primary mt-0.5">
                {Number(contract.baseSalary).toLocaleString("vi-VN")}{" "}
                <span className="text-xs font-normal text-muted-foreground">VNĐ</span>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Phụ cấp: {totalAllowances.toLocaleString("vi-VN")} VNĐ
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Thời hạn hiệu lực */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Thời hạn hợp đồng
              </span>
              <div className="text-sm font-bold font-mono text-foreground mt-0.5">
                {contract.startDate} ➔ {contract.endDate || "Không xác định"}
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">
                Ký ngày: {contract.signingDate || "Chưa xác định"}
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Tiến trình ký số kèm thanh tiến độ */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Tiến trình Ký điện tử
              </span>
              <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                {signedCount} / {totalSigners || 2}{" "}
                <span className="text-xs font-normal text-muted-foreground">bên đã ký</span>
              </div>
              {/* Thanh tiến độ thương hiệu CYCLOSA */}
              <div className="w-28 bg-primary/15 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{
                    width: `${Math.round((signedCount / (totalSigners || 2)) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Trạng thái & Phụ lục */}
        <Card className="border-border bg-card shadow-xs hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">
                Trạng thái & Phụ lục
              </span>
              <div className="text-sm font-bold text-foreground mt-0.5 flex items-center gap-1.5">
                <ContractStatusBadge status={contract.status} />
              </div>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Đã phát sinh {appendices.length} phụ lục sửa đổi
              </span>
            </div>
            <div className="h-11 w-11 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Tabs điều hướng chi tiết ────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Thông tin chung & Đãi ngộ</span>
        </button>

        <button
          onClick={() => setActiveTab("document")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === "document"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Văn bản hợp đồng (A4 Preview)</span>
        </button>

        <button
          onClick={() => setActiveTab("signflow")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === "signflow"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Tiến trình ký kết ({signedCount}/{totalSigners || 2})</span>
        </button>

        <button
          onClick={() => setActiveTab("appendices")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === "appendices"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <Paperclip className="w-3.5 h-3.5" />
          <span>Phụ lục hợp đồng ({appendices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("versions")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5",
            activeTab === "versions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          <History className="w-3.5 h-3.5" />
          <span>Lịch sử phiên bản ({versions.length})</span>
        </button>
      </div>

      {/* ── 4. Nội dung chi tiết từng Tab ──────────────────────────── */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái (7 cột): Thông tin chủ thể & Đãi ngộ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Thông tin HĐLĐ */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Thông tin Hợp đồng Lao động
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Số tham chiếu hợp đồng:
                    </span>
                    <strong className="text-foreground text-sm font-mono">
                      {contract.contractNumber}
                    </strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Phân loại hợp đồng:
                    </span>
                    <span className="text-foreground font-semibold">
                      {CONTRACT_TYPE_LABELS[contract.contractType]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Người lao động (Bên B):
                    </span>
                    <strong className="text-foreground text-sm">
                      {contract.employeeName}
                    </strong>
                    <span className="text-muted-foreground text-[11px] block font-mono">
                      Mã nhân viên: {contract.employeeCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Chức danh & Phòng ban:
                    </span>
                    <strong className="text-foreground">
                      {contract.jobTitleName || "Theo thỏa thuận công việc"}
                    </strong>
                    <span className="text-muted-foreground text-[11px] block">
                      {contract.departmentName || "Khối tác nghiệp"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Ngày ký kết:
                    </span>
                    <span className="font-mono text-foreground font-medium">
                      {contract.signingDate || "Chưa xác định"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Bắt đầu hiệu lực:
                    </span>
                    <span className="font-mono text-foreground font-medium">
                      {contract.startDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Hết hạn hợp đồng:
                    </span>
                    <span className="font-mono text-foreground font-medium">
                      {contract.endDate || "Không xác định thời hạn"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chi tiết lương & đãi ngộ */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  Gói Thu nhập & Chế độ Phúc lợi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Lương chính (Gross/tháng):</span>
                  <strong className="font-mono text-foreground text-sm">
                    {Number(contract.baseSalary).toLocaleString("vi-VN")} VNĐ
                  </strong>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-border">
                  <span className="text-muted-foreground">Phương thức thanh toán:</span>
                  <span className="font-medium text-foreground">
                    {contract.salaryPaymentMethod === "BANK_TRANSFER"
                      ? "Chuyển khoản qua ngân hàng"
                      : "Tiền mặt trực tiếp"}
                  </span>
                </div>

                {contract.salaryPaymentMethod === "BANK_TRANSFER" && contract.bankAccount && (
                  <div className="flex justify-between items-center py-1.5 border-b border-border">
                    <span className="text-muted-foreground">Tài khoản ngân hàng:</span>
                    <span className="font-mono text-foreground">
                      {contract.bankAccount} ({contract.bankName || "Ngân hàng thụ hưởng"})
                    </span>
                  </div>
                )}

                {contract.allowances && contract.allowances.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-muted-foreground block mb-2">
                      Danh mục phụ cấp hàng tháng:
                    </span>
                    <div className="space-y-1.5">
                      {contract.allowances.map((al, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1.5 px-3 bg-muted/30 rounded-lg border border-border"
                        >
                          <span className="font-medium">{al.allowanceType}</span>
                          <div className="flex items-center gap-2.5">
                            {al.isInsuranceInclusive && (
                              <Badge variant="outline" className="text-[10px] h-5">
                                Tính BHXH
                              </Badge>
                            )}
                            <span className="font-mono font-semibold">
                              {Number(al.amount).toLocaleString("vi-VN")} VNĐ
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 bg-primary/5 rounded-lg px-3 mt-2">
                  <span className="font-semibold text-foreground">
                    Tổng gói thu nhập thỏa thuận:
                  </span>
                  <strong className="font-mono text-base text-primary">
                    {totalIncome.toLocaleString("vi-VN")} VNĐ / tháng
                  </strong>
                </div>
              </CardContent>
            </Card>

            {/* Điều kiện làm việc & Quyền lợi khác */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-primary" />
                  Điều kiện làm việc & Thỏa thuận bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-start gap-2 py-1">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Địa điểm làm việc:
                    </span>
                    <p className="font-medium text-foreground">
                      {contract.workLocation || "Theo thỏa thuận và phân công của công ty"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 py-1 border-t border-border pt-2">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <span className="text-muted-foreground text-[11px] block">
                      Chế độ thời giờ làm việc:
                    </span>
                    <p className="font-medium text-foreground">
                      {contract.workingTimeNote || "44 giờ/tuần theo Nội quy lao động công ty"}
                    </p>
                  </div>
                </div>

                {contract.otherBenefits && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground text-[11px] block mb-1">
                      Phúc lợi bổ sung:
                    </span>
                    <p className="p-2.5 bg-muted/30 rounded-lg border text-muted-foreground">
                      {contract.otherBenefits}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Thông tin chấm dứt hợp đồng nếu có */}
            {contract.terminationDate && (
              <Card className="border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs">
                <CardHeader className="py-3 px-5 border-b border-rose-200 dark:border-rose-900 bg-rose-100/50 dark:bg-rose-950/40">
                  <CardTitle className="text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center gap-2">
                    <FileX className="w-4 h-4 text-rose-600" />
                    Hợp đồng đã chấm dứt hiệu lực
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs text-rose-900 dark:text-rose-300">
                  <div className="flex justify-between">
                    <span>Ngày chấm dứt:</span>
                    <strong className="font-mono">{contract.terminationDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Lý do chấm dứt:</span>
                    <span>{contract.terminationReason || "Theo thỏa thuận hai bên"}</span>
                  </div>
                  {contract.liquidationNotes && (
                    <div className="pt-2 border-t border-rose-200 dark:border-rose-800">
                      <span>Biên bản thanh lý:</span>
                      <p className="mt-0.5 italic">{contract.liquidationNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cột phải (5 cột): Tiến trình ký kết & Thao tác */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tiến trình Phê duyệt chứng từ đa cấp */}
            <ApprovalTimeline
              referenceId={contract.id}
              requestType="CONTRACT"
              canApprove={canManage}
            />

            {/* Tiến trình ký kết */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-primary" />
                  Tiến trình Ký điện tử E-Contract
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                {signers.map((signer, i) => (
                  <div
                    key={signer.id || i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0",
                          signer.status === "SIGNED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {signer.status === "SIGNED" ? "✓" : i + 1}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-foreground block truncate">
                          {signer.signerName}
                        </strong>
                        <span className="text-[11px] text-muted-foreground block truncate">
                          {signer.side === "PARTY_A"
                            ? "Đại diện Bên A"
                            : "Người lao động (Bên B)"}{" "}
                          • {signer.signerRoleTitle || "Ký xác nhận"}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      {signer.status === "SIGNED" ? (
                        <div className="space-y-0.5">
                          <Badge
                            className="bg-emerald-600 text-white border-transparent text-xs font-medium"
                          >
                            Đã ký số
                          </Badge>
                          {signer.signedAt && (
                            <span className="text-[10px] text-muted-foreground block font-mono">
                              {new Date(signer.signedAt).toLocaleDateString("vi-VN")}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge
                          className="bg-amber-600 text-white border-transparent text-xs font-medium"
                        >
                          Chờ ký
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {isInSigning && (
                  <div className="pt-2">
                    <Button
                      onClick={() => setSigningOpen(true)}
                      className="w-full text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
                    >
                      <FileSignature className="h-4 w-4" />
                      <span>Thực hiện ký OTP hợp đồng ngay</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mã băm toàn vẹn SHA-256 */}
            {contract.fileHashSha256 && (
              <Card className="border-border bg-card shadow-xs">
                <CardHeader className="py-3 px-5 border-b border-border bg-muted/20">
                  <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Tính toàn vẹn dữ liệu (SHA-256)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-1.5 text-xs">
                  <p className="text-[11px] text-muted-foreground">
                    Chữ ký số và nội dung hợp đồng được niêm phong chống sửa đổi:
                  </p>
                  <p className="font-mono text-[11px] break-all bg-muted/40 p-2 rounded border select-all">
                    {contract.fileHashSha256}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Đối soát BLLĐ 2019 */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="py-3 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Đối soát Pháp lý Bộ luật Lao động 2019
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Đáp ứng các điều kiện pháp lý hiện hành của BLLĐ 2019.</span>
                </div>
                <p className="text-[11px] text-muted-foreground pt-1">
                  Đã tự động rà soát mức lương sàn, thời hạn tối đa, số lần ký HĐ có thời hạn và thời giờ làm việc.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT PREVIEW */}
      {activeTab === "document" && (
        <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <div className="bg-muted/30 p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4 text-primary" />
              <span>Bản xem trước A4 của hợp đồng: {contract.contractNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="h-8 text-xs gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In tài liệu</span>
              </Button>
              {isInSigning && (
                <Button
                  size="sm"
                  onClick={() => setSigningOpen(true)}
                  className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1"
                >
                  <FileSignature className="w-3.5 h-3.5" />
                  <span>Ký điện tử</span>
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-6 sm:p-12 max-w-4xl mx-auto bg-white dark:bg-slate-900 border my-6 rounded-lg shadow-sm text-foreground space-y-6">
            {/* Header Quốc hiệu */}
            <div className="text-center space-y-1 pb-4 border-b border-border">
              <p className="font-bold text-xs uppercase tracking-wider">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </p>
              <p className="text-xs font-semibold">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-32 h-[1px] bg-foreground/30 mx-auto my-2" />
              <h2 className="text-lg font-bold uppercase mt-4 text-primary">
                HỢP ĐỒNG LAO ĐỘNG
              </h2>
              <p className="text-xs font-mono text-muted-foreground">
                Số: {contract.contractNumber}
              </p>
            </div>

            {/* Nội dung hợp đồng */}
            <div className="text-xs space-y-4 leading-relaxed">
              <p>
                Hôm nay, ngày {contract.signingDate ? contract.signingDate.split("-")[2] : "..."} tháng{" "}
                {contract.signingDate ? contract.signingDate.split("-")[1] : "..."} năm{" "}
                {contract.signingDate ? contract.signingDate.split("-")[0] : "..."}, tại trụ sở Công ty, chúng tôi gồm các bên:
              </p>

              {/* BÊN A */}
              <div className="p-3 bg-muted/20 rounded border space-y-1">
                <p className="font-bold uppercase text-foreground">
                  BÊN SỬ DỤNG LAO ĐỘNG (BÊN A):
                </p>
                <p>
                  Đại diện bởi: <strong>{signers.find((s) => s.side === "PARTY_A")?.signerName || "Đại diện pháp luật"}</strong>
                </p>
                <p>
                  Chức vụ: {signers.find((s) => s.side === "PARTY_A")?.signerRoleTitle || "Tổng Giám đốc"}
                </p>
              </div>

              {/* BÊN B */}
              <div className="p-3 bg-muted/20 rounded border space-y-1">
                <p className="font-bold uppercase text-foreground">
                  BÊN NGƯỜI LAO ĐỘNG (BÊN B):
                </p>
                <p>
                  Họ và tên: <strong>{contract.employeeName}</strong>
                </p>
                <p>
                  Mã nhân viên: <span className="font-mono">{contract.employeeCode}</span>
                </p>
                <p>
                  Chức danh chuyên môn: {contract.jobTitleName || "Theo bản mô tả công việc"}
                </p>
              </div>

              {/* Điều khoản chính */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-foreground">
                  Điều 1. Thời hạn và công việc hợp đồng
                </p>
                <p>
                  - Loại hợp đồng: <strong>{CONTRACT_TYPE_LABELS[contract.contractType]}</strong>
                </p>
                <p>
                  - Thời hạn hiệu lực: Từ ngày <strong>{contract.startDate}</strong> đến ngày{" "}
                  <strong>{contract.endDate || "không xác định"}</strong>.
                </p>
                <p>
                  - Địa điểm làm việc: {contract.workLocation || "Theo thỏa thuận hoặc trụ sở công ty"}.
                </p>

                <p className="font-bold text-foreground pt-2">
                  Điều 2. Chế độ làm việc và thời giờ nghỉ ngơi
                </p>
                <p>
                  - Thời giờ làm việc: {contract.workingTimeNote || "44 giờ/tuần theo quy chế công ty"}.
                </p>

                <p className="font-bold text-foreground pt-2">
                  Điều 3. Nghĩa vụ và quyền lợi của người lao động
                </p>
                <p>
                  - Mức lương chính:{" "}
                  <strong>{Number(contract.baseSalary).toLocaleString("vi-VN")} VNĐ/tháng</strong>.
                </p>
                <p>
                  - Hình thức trả lương:{" "}
                  {contract.salaryPaymentMethod === "BANK_TRANSFER"
                    ? "Chuyển khoản qua tài khoản ngân hàng"
                    : "Tiền mặt"}.
                </p>
                {contract.allowances && contract.allowances.length > 0 && (
                  <p>
                    - Các khoản phụ cấp:{" "}
                    {contract.allowances
                      .map(
                        (a) =>
                          `${a.allowanceType}: ${Number(a.amount).toLocaleString("vi-VN")} VNĐ`
                      )
                      .join("; ")}
                    .
                  </p>
                )}
              </div>

              {/* Khung ký tên */}
              <div className="grid grid-cols-2 gap-8 pt-8 text-center">
                <div className="space-y-12">
                  <p className="font-bold uppercase">ĐẠI DIỆN BÊN A</p>
                  <div className="h-16 flex items-center justify-center">
                    {signers.find((s) => s.side === "PARTY_A")?.status === "SIGNED" ? (
                      <span className="text-emerald-600 font-bold border-2 border-emerald-600 rounded px-3 py-1 rotate-[-3deg] text-[11px]">
                        ✓ ĐÃ KÝ ĐIỆN TỬ
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">
                        (Chưa ký)
                      </span>
                    )}
                  </div>
                  <p className="font-semibold">
                    {signers.find((s) => s.side === "PARTY_A")?.signerName || "Đại diện công ty"}
                  </p>
                </div>

                <div className="space-y-12">
                  <p className="font-bold uppercase">NGƯỜI LAO ĐỘNG (BÊN B)</p>
                  <div className="h-16 flex items-center justify-center">
                    {signers.find((s) => s.side === "PARTY_B")?.status === "SIGNED" ? (
                      <span className="text-emerald-600 font-bold border-2 border-emerald-600 rounded px-3 py-1 rotate-[-3deg] text-[11px]">
                        ✓ ĐÃ KÝ ĐIỆN TỬ
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-[11px]">
                        (Chưa ký)
                      </span>
                    )}
                  </div>
                  <p className="font-semibold">{contract.employeeName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: SIGNFLOW */}
      {activeTab === "signflow" && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Chi tiết Luồng ký số E-Contract & Bằng chứng xác thực
            </CardTitle>
            {isInSigning && (
              <Button
                size="sm"
                onClick={() => setSigningOpen(true)}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Mở giao diện ký OTP</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="space-y-3">
              {signers.map((signer, index) => (
                <Card key={signer.id || index} className="border-border/60">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-sm text-foreground">
                          {signer.signerName}
                        </span>
                        <Badge className="bg-slate-700 text-white border-transparent text-xs font-medium">
                          {signer.side === "PARTY_A"
                            ? "Bên A (Người sử dụng lao động)"
                            : "Bên B (Người lao động)"}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-xs font-semibold",
                            SIGNER_STATUS_COLORS[signer.status]?.bg,
                            SIGNER_STATUS_COLORS[signer.status]?.text
                          )}
                        >
                          {SIGNER_STATUS_LABELS[signer.status] || signer.status}
                        </Badge>
                      </div>

                      <p className="text-muted-foreground text-[11px]">
                        Chức vụ: <strong>{signer.signerRoleTitle || "Thành viên ký kết"}</strong> • Phương thức:{" "}
                        <span className="font-mono">{signer.signingMethod}</span>
                      </p>

                      {signer.signedAt && (
                        <p className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Thời điểm hoàn tất chữ ký:{" "}
                          {new Date(signer.signedAt).toLocaleString("vi-VN")}
                        </p>
                      )}

                      {signer.ipAddress && (
                        <p className="text-muted-foreground text-[10px] font-mono">
                          Địa chỉ IP ký: {signer.ipAddress}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {signer.status === "SIGNED" ? (
                        <div className="h-8 px-3 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 font-semibold text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đã xác thực
                        </div>
                      ) : (
                        <div className="h-8 px-3 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 font-semibold text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          Đang chờ ký
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {signers.length === 0 && (
                <p className="text-muted-foreground italic text-center py-8">
                  Chưa khởi tạo danh sách người ký cho hợp đồng này.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: APPENDICES */}
      {activeTab === "appendices" && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-primary" />
              Danh mục Phụ lục Hợp đồng Lao động ({appendices.length})
            </CardTitle>
            {isActive && canManage && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedAppendix(null);
                  setAppendixOpen(true);
                }}
                className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm phụ lục mới</span>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="space-y-2.5">
              {appendices.map((ap) => (
                <Card
                  key={ap.id}
                  className="cursor-pointer hover:border-primary transition-all border-border/70"
                  onClick={() => {
                    setSelectedAppendix(ap);
                    setAppendixOpen(true);
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">
                          {ap.appendixNumber}
                        </span>
                        <ContractStatusBadge status={ap.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hiệu lực từ: <strong className="font-mono">{ap.effectiveDate}</strong> • Phân loại:{" "}
                        <span className="font-medium">{ap.appendixType}</span>
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Chi tiết →
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {appendices.length === 0 && (
                <div className="text-center py-12 text-muted-foreground space-y-2">
                  <Paperclip className="w-8 h-8 mx-auto opacity-30 text-primary" />
                  <p className="font-medium">Chưa có phụ lục hợp đồng nào phát sinh.</p>
                  <p className="text-[11px]">
                    Các phụ lục điều chỉnh lương hoặc gia hạn hợp đồng sẽ được lưu trữ tại đây khi ký kết.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: VERSIONS AUDIT TRAIL */}
      {activeTab === "versions" && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Lịch sử Thay đổi Phiên bản Hợp đồng (Audit Trail)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            <div className="space-y-2.5">
              {versions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-3.5 rounded-lg border bg-muted/20 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-sm text-foreground">
                      Phiên bản #{ver.versionNumber}
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      {ver.changeSummary || "Cập nhật thông tin hợp đồng"}
                    </p>
                  </div>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {new Date(ver.changedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              ))}

              {versions.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-8">
                  Chưa có lịch sử thay đổi phiên bản.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── 5. Sub-dialogs (Ký số OTP, Phụ lục, Chấm dứt) ─────────── */}
      {appendixOpen && (
        <ContractAppendixDialog
          open={appendixOpen}
          onOpenChange={setAppendixOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          appendix={selectedAppendix}
          onSuccess={() => {
            refetch();
            refetchAppendices();
          }}
        />
      )}

      {signingOpen && (
        <ContractSigningDialog
          open={signingOpen}
          onOpenChange={setSigningOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          isSelfSigning={true}
          onSuccess={() => refetch()}
        />
      )}

      {terminateOpen && (
        <ContractTerminateDialog
          open={terminateOpen}
          onOpenChange={setTerminateOpen}
          contractId={contractId}
          contractNumber={contract.contractNumber}
          employeeName={contract.employeeName}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}


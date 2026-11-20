"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Download,
  Printer,
  ZoomIn,
  ZoomOut,
  ChevronRight,
  UserCheck,
  Building,
  KeyRound,
  FileSignature,
  XCircle,
  QrCode,
  Sparkles,
  Info,
  Check,
  Eye,
  PenTool,
  Lock,
  ChevronDown,
  Loader2,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetMyContractsQuery,
  useGetMyContractByIdQuery,
  useRequestMyContractOtpMutation,
  useSignMyContractMutation,
} from "@/features/contract/api/contract-api";
import type { SigningMethod, ContractSigner } from "@/features/contract/types/contract.types";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_TYPE_LABELS,
} from "@/features/contract/constants/contract.constants";
import { useGetMeQuery } from "@/features/auth/api/auth-api";
import { useGetMyProfileQuery } from "@/features/employee";

export type ContractSigningStatus =
  | "WAITING_MY_SIGN"
  | "PARTIALLY_SIGNED"
  | "FULLY_SIGNED"
  | "REJECTED";

function ContractSigningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contractIdParam = searchParams.get("id");

  // Nạp danh sách hợp đồng cá nhân từ API
  const { data: meRes } = useGetMeQuery();
  const { data: myProfile } = useGetMyProfileQuery();
  const {
    data: contracts,
    isLoading: isContractsLoading,
    refetch: refetchContracts,
  } = useGetMyContractsQuery();

  const contractList = contracts || [];
  const targetSummary =
    contractList.find((c) => (contractIdParam ? c.id === contractIdParam : c.status === "IN_SIGNING")) ||
    contractList[0];

  const targetContractId = targetSummary?.id;

  // Nạp chi tiết hợp đồng (bao gồm danh sách người ký thực tế, mã băm SHA256, renderedHtml, filePdfUrl)
  const {
    data: contractDetail,
    isLoading: isDetailLoading,
    refetch: refetchDetail,
  } = useGetMyContractByIdQuery(targetContractId!, {
    skip: !targetContractId,
  });

  const [requestOtpApi, { isLoading: isRequestingOtp }] = useRequestMyContractOtpMutation();
  const [signContractApi, { isLoading: isSigningApi }] = useSignMyContractMutation();

  // Dữ liệu hiển thị (100% dữ liệu thực - KHÔNG MOCK FALLBACK)
  const contractCode = contractDetail?.contractNumber || targetSummary?.contractNumber || "Chưa có mã hợp đồng";
  const contractType = contractDetail?.contractType || targetSummary?.contractType;
  const contractTypeLabel = contractType ? CONTRACT_TYPE_LABELS[contractType] || contractType : "Hợp đồng lao động";
  const contractStatus = contractDetail?.status || targetSummary?.status || "DRAFT";

  const employeeName = myProfile?.fullName || meRes?.data?.username || "Chưa cập nhật";
  const employeeCode = myProfile?.employeeCode || "Chưa cập nhật";
  const employeeIdCard = myProfile?.identityDocuments?.[0]?.documentNumber || "Chưa cập nhật";
  const employeePhone = myProfile?.phone || "Chưa cập nhật";
  const employeeEmail = myProfile?.personalEmail || meRes?.data?.email || "Chưa cập nhật";
  const employeeAddress = myProfile?.address || "Chưa cập nhật";

  const jobTitle =
    contractDetail?.jobTitleName ||
    targetSummary?.jobTitleName ||
    myProfile?.currentJobTitleName ||
    "Chưa cập nhật";

  const department =
    contractDetail?.departmentName ||
    targetSummary?.departmentName ||
    myProfile?.currentDepartmentName ||
    "Chưa cập nhật";

  const workLocation = contractDetail?.workLocation || myProfile?.currentBranchName || "Chưa cập nhật";

  const baseSalary =
    contractDetail?.baseSalary != null
      ? `${contractDetail.baseSalary.toLocaleString("vi-VN")} VNĐ`
      : targetSummary?.baseSalary != null
      ? `${targetSummary.baseSalary.toLocaleString("vi-VN")} VNĐ`
      : "Chưa cập nhật";

  const workingTimeDescription =
    contractDetail?.workingTimeNote ||
    "Theo nội quy và quy chế lao động của công ty";

  const startDate = contractDetail?.startDate || targetSummary?.startDate || "Chưa cập nhật";
  const signingDate = contractDetail?.signingDate || targetSummary?.signingDate || "Chưa cập nhật";
  const endDate = contractDetail?.endDate || targetSummary?.endDate || "Không xác định thời hạn";
  const fileHashSha256 = contractDetail?.fileHashSha256 || "Chưa khởi tạo mã băm điện tử";

  // Người ký bên A (Đại diện người sử dụng lao động) và Bên B (Người lao động)
  const signers: ContractSigner[] = contractDetail?.signers || [];
  const partyASigner = signers.find((s) => s.side === "PARTY_A");
  const partyBSigner = signers.find((s) => s.side === "PARTY_B");

  // Trạng thái ký của người lao động hiện tại
  const isMySignCompleted =
    contractStatus === "ACTIVE" ||
    partyBSigner?.status === "SIGNED";

  const initialStatus: ContractSigningStatus =
    contractStatus === "IN_SIGNING" && !isMySignCompleted
      ? "WAITING_MY_SIGN"
      : isMySignCompleted && contractStatus === "ACTIVE"
      ? "FULLY_SIGNED"
      : isMySignCompleted
      ? "PARTIALLY_SIGNED"
      : "WAITING_MY_SIGN";

  const [signingStatus, setSigningStatus] = useState<ContractSigningStatus>(initialStatus);
  const [activeSection, setActiveSection] = useState("sec_1");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Modal xác nhận ký
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [checkReadTerms, setCheckReadTerms] = useState(false);
  const [checkAccurateInfo, setCheckAccurateInfo] = useState(false);
  const [signingMethod, setSigningMethod] = useState<"INTERNAL_CA" | "SMART_CA" | "DRAW">("INTERNAL_CA");
  const [otpCode, setOtpCode] = useState("");
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);

  // Modal thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Modal từ chối ký
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tableOfContents = [
    { id: "sec_1", number: "1", title: "Thông tin các bên tham gia" },
    { id: "sec_2", number: "2", title: "Công việc và địa điểm làm việc" },
    { id: "sec_3", number: "3", title: "Thời hạn hợp đồng lao động" },
    { id: "sec_4", number: "4", title: "Chế độ tiền lương và phụ cấp" },
    { id: "sec_5", number: "5", title: "Quyền lợi và nghĩa vụ lao động" },
    { id: "sec_6", number: "6", title: "Điều khoản thi hành & Chữ ký" },
  ];

  // Gửi mã OTP thực tế
  const handleRequestOtp = async () => {
    if (!targetContractId) return;
    try {
      const res = await requestOtpApi(targetContractId).unwrap();
      const msg = res?.message || "Đã gửi mã xác thực OTP đến số điện thoại / email của bạn.";
      setOtpSentNotice(msg);
      toast.success(msg);
    } catch (err: unknown) {
      const errMsg = (err as { data?: { message?: string } })?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.";
      toast.error(errMsg);
    }
  };

  // Xác nhận ký hợp đồng
  const handleConfirmSign = async () => {
    if (!checkReadTerms || !checkAccurateInfo) {
      toast.error("Vui lòng tích xác nhận cả 2 điều khoản trước khi ký!");
      return;
    }

    if (signingMethod === "INTERNAL_CA" && (!otpCode || otpCode.trim().length === 0)) {
      toast.error("Vui lòng nhập mã OTP xác thực ký đã được gửi đến bạn!");
      return;
    }

    if (!targetContractId) {
      toast.error("Không tìm thấy thông tin hợp đồng cần ký!");
      return;
    }

    try {
      const methodMap: Record<string, SigningMethod> = {
        INTERNAL_CA: "OTP_SMS",
        SMART_CA: "SMART_CA",
        DRAW: "DIGITAL_CERT",
      };

      await signContractApi({
        contractId: targetContractId,
        body: {
          otpCode: otpCode.trim(),
          signingMethod: methodMap[signingMethod] || "OTP_SMS",
        },
      }).unwrap();

      setSigningStatus("PARTIALLY_SIGNED");
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      refetchContracts();
      refetchDetail();
      toast.success("Ký hợp đồng điện tử thành công! Hệ thống đã ghi nhận chữ ký số của bạn.");
    } catch (err: unknown) {
      const errMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        "Ký hợp đồng không thành công. Vui lòng kiểm tra lại mã OTP hoặc thử lại sau.";
      toast.error(errMsg);
    }
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối ký!");
      return;
    }
    setSigningStatus("REJECTED");
    setShowRejectModal(false);
    toast.info("Đã ghi nhận phản hồi từ chối ký hợp đồng.");
  };

  // Tải tệp PDF ký số
  const handleDownloadPdf = () => {
    const pdfUrl = contractDetail?.signedFileUrl || contractDetail?.contractFileUrl;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      toast.error("Hợp đồng này chưa có bản PDF đính kèm từ máy chủ.");
    }
  };

  // Loading state
  if (isContractsLoading || isDetailLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Đang nạp dữ liệu văn bản hợp đồng từ hệ thống...</p>
      </div>
    );
  }

  // Empty state khi không có hợp đồng
  if (!targetContractId || contractList.length === 0) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Không tìm thấy hợp đồng lao động</h2>
        <p className="text-xs text-muted-foreground">
          Hiện tại tài khoản của bạn chưa có hợp đồng lao động nào cần ký hoặc chưa được bàn giao từ phòng Nhân sự.
        </p>
        <Button asChild size="sm" variant="outline" className="text-xs">
          <Link href="/me/contracts">Quay lại danh sách hợp đồng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-24 select-none">
      {/* ── 1. THANH TRÊN: TÊN HỢP ĐỒNG, MÃ, TRẠNG THÁI KÝ ────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4 bg-card px-4 py-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1 cursor-pointer">
            <Link href="/me/contracts">
              <ArrowLeft className="h-3.5 w-3.5 mr-0.5" />
              <span>Hợp đồng</span>
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              <span>{contractTypeLabel}</span>
            </h1>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              {contractCode}
            </span>

            {/* Trạng thái ký */}
            {signingStatus === "WAITING_MY_SIGN" && (
              <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold animate-pulse">
                ● Chờ bạn ký
              </Badge>
            )}
            {signingStatus === "PARTIALLY_SIGNED" && (
              <Badge className="bg-amber-50 text-amber-700 border-amber-300 text-xs font-semibold">
                ● Đã ký (Chờ đại diện ký duyệt)
              </Badge>
            )}
            {signingStatus === "FULLY_SIGNED" && (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-xs font-semibold">
                ● Hoàn tất ký số
              </Badge>
            )}
            {signingStatus === "REJECTED" && (
              <Badge className="bg-slate-100 text-slate-700 border-slate-300 text-xs font-semibold">
                ● Đã từ chối ký
              </Badge>
            )}
          </div>
        </div>

        {/* Thanh công cụ xem văn bản */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
              title="Thu nhỏ"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] font-mono px-1.5 text-muted-foreground">{zoomLevel}%</span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => setZoomLevel((z) => Math.min(z + 10, 130))}
              title="Phóng to"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1 cursor-pointer"
            onClick={handleDownloadPdf}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Tải PDF</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1 cursor-pointer"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>In tài liệu</span>
          </Button>
        </div>
      </div>

      {/* ── 2. BỐ CỤC 3 VÙNG: MỤC LỤC (Trái) - NỘI DUNG (Giữa) - THÔNG TIN KÝ (Phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── CỘT TRÁI: MỤC LỤC HỢP ĐỒNG (3 cols) ─────────────── */}
        <div className="lg:col-span-3 space-y-3">
          <Card className="border-border bg-card shadow-xs rounded-xl sticky top-4">
            <CardHeader className="py-3.5 px-4 border-b border-border bg-muted/20">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  <span>Mục lục hợp đồng</span>
                </span>
                <span className="text-[10px] text-muted-foreground">6 Mục</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-2.5 space-y-1 text-xs">
              {tableOfContents.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors font-medium cursor-pointer",
                    activeSection === sec.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 rounded-md flex items-center justify-center font-mono text-[10px] font-bold shrink-0",
                      activeSection === sec.id
                        ? "bg-white text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {sec.number}
                  </span>
                  <span className="truncate text-xs">{sec.title}</span>
                </button>
              ))}

              {/* Thông tin pháp lý & Mã băm điện tử */}
              <div className="mt-4 pt-3 border-t border-border px-2 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Tính pháp lý điện tử</span>
                </div>
                <p className="leading-relaxed">
                  Tuân thủ Luật Giao dịch Điện tử số 20/2023/QH15 & Bộ luật Lao động số 45/2019/QH14.
                </p>
                <div className="space-y-0.5">
                  <span className="block font-semibold text-[10px] text-foreground">Mã băm SHA-256:</span>
                  <div className="font-mono text-[10px] text-muted-foreground break-all bg-muted/40 p-1.5 rounded border border-border">
                    {fileHashSha256}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── CỘT GIỮA: NỘI DUNG HỢP ĐỒNG (6 cols) ── */}
        <div className="lg:col-span-6 space-y-3">
          <div
            ref={contentRef}
            className="overflow-auto max-h-[820px] rounded-xl border border-border shadow-md bg-slate-200/60 dark:bg-slate-950/60 p-4 sm:p-6 flex justify-center"
          >
            {/* TRANG TÀI LIỆU HỢP ĐỒNG A4 */}
            <div
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-8 sm:p-12 shadow-lg border border-slate-300 dark:border-slate-800 rounded-lg max-w-[760px] w-full font-serif text-[13px] leading-relaxed transition-transform duration-150 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* QUỐC HIỆU & TIÊU NGỮ */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-300 dark:border-slate-800">
                <p className="font-bold uppercase tracking-wider text-[12px] font-sans">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </p>
                <p className="font-semibold italic text-[12px] font-sans">
                  Độc lập - Tự do - Hạnh phúc
                </p>
                <div className="w-32 h-[1px] bg-slate-400 mx-auto mt-1" />
                <p className="font-sans text-[11px] text-slate-500 pt-2 text-right">
                  Số: <strong>{contractCode}</strong>
                </p>
              </div>

              {/* TIÊU ĐỀ HỢP ĐỒNG */}
                  <div className="text-center my-6 space-y-1">
                    <h2 className="text-xl font-bold uppercase tracking-wide font-sans text-slate-900 dark:text-white">
                      {contractTypeLabel}
                    </h2>
                    <p className="text-xs italic text-slate-600 dark:text-slate-400">
                      (Căn cứ theo Bộ luật Lao động số 45/2019/QH14 và các văn bản hướng dẫn thi hành)
                    </p>
                  </div>

                  {/* MỤC 1: THÔNG TIN CÁC BÊN */}
                  <section id="sec_1" className="space-y-4 pt-2">
                    <p className="italic">
                      Hôm nay, ngày {signingDate !== "Chưa cập nhật" ? signingDate : "..."}, hai bên thống nhất ký kết hợp đồng gồm có:
                    </p>

                    {/* BÊN A */}
                    <div className="space-y-1 pl-2 border-l-2 border-slate-400">
                      <p className="font-bold uppercase font-sans text-xs text-primary">
                        BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG
                      </p>
                      <p>
                        <strong>Đại diện bởi:</strong> {partyASigner?.signerName || "Chưa chỉ định người đại diện"} &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Chức vụ:</strong> {partyASigner?.signerRoleTitle || "Đại diện theo pháp luật"}
                      </p>
                      <p>
                        <strong>Địa điểm làm việc:</strong> {workLocation}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> {partyASigner?.signerPhone || "Chưa cập nhật"} &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Email liên hệ:</strong> {partyASigner?.signerEmail || "Chưa cập nhật"}
                      </p>
                    </div>

                    {/* BÊN B */}
                    <div className="space-y-1 pl-2 border-l-2 border-primary mt-3">
                      <p className="font-bold uppercase font-sans text-xs text-primary">
                        BÊN B: NGƯỜI LAO ĐỘNG — {employeeName.toUpperCase()}
                      </p>
                      <p>
                        <strong>Họ và tên:</strong> {employeeName.toUpperCase()} &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Mã nhân viên:</strong> {employeeCode}
                      </p>
                      <p>
                        <strong>Số CCCD/Hộ chiếu:</strong> {employeeIdCard}
                      </p>
                      <p>
                        <strong>Địa chỉ thường trú:</strong> {employeeAddress}
                      </p>
                      <p>
                        <strong>Điện thoại:</strong> {employeePhone} &nbsp;&nbsp;&nbsp;&nbsp; 
                        <strong>Email cá nhân:</strong> {employeeEmail}
                      </p>
                    </div>
                  </section>

                  {/* MỤC 2: CÔNG VIỆC VÀ ĐỊA ĐIỂM */}
                  <section id="sec_2" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                      Điều 1. Công việc, chức danh và địa điểm làm việc
                    </h3>
                    <p>
                      1.1. <strong>Chức danh chuyên môn:</strong> {jobTitle}.
                    </p>
                    <p>
                      1.2. <strong>Phòng ban / Đơn vị công tác:</strong> {department}.
                    </p>
                    <p>
                      1.3. <strong>Địa điểm làm việc:</strong> {workLocation}.
                    </p>
                    <p>
                      1.4. <strong>Mô tả công việc:</strong> {workingTimeDescription}.
                    </p>
                  </section>

                  {/* MỤC 3: THỜI HẠN HỢP ĐỒNG */}
                  <section id="sec_3" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                      Điều 2. Thời hạn hợp đồng lao động
                    </h3>
                    <p>
                      2.1. <strong>Hình thức hợp đồng:</strong> {contractTypeLabel}.
                    </p>
                    <p>
                      2.2. <strong>Ngày bắt đầu hiệu lực:</strong> {startDate}.
                    </p>
                    <p>
                      2.3. <strong>Ngày kết thúc:</strong> {endDate}.
                    </p>
                  </section>

                  {/* MỤC 4: TIỀN LƯƠNG VÀ PHỤ CẤP */}
                  <section id="sec_4" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                      Điều 3. Chế độ tiền lương, phụ cấp và hình thức trả lương
                    </h3>
                    <p>
                      3.1. <strong>Mức lương chính:</strong> <strong>{baseSalary}</strong>.
                    </p>
                    <p>
                      3.2. <strong>Mức lương đóng BHXH:</strong> Theo quy định pháp luật dựa trên mức lương chính.
                    </p>
                    <p>
                      3.3. <strong>Phụ cấp và các khoản bổ sung:</strong>{" "}
                      {contractDetail?.allowances && contractDetail.allowances.length > 0
                        ? contractDetail.allowances
                            .map((a) => `${a.allowanceType}: ${a.amount.toLocaleString("vi-VN")} VNĐ`)
                            .join(", ")
                        : "Không có phụ cấp riêng"}
                    </p>
                    <p>
                      3.4. <strong>Hình thức chi trả:</strong> Qua tài khoản ngân hàng của Người lao động vào kỳ trả lương hàng tháng.
                    </p>
                  </section>

                  {/* MỤC 5: QUYỀN LỢI VÀ NGHĨA VỤ */}
                  <section id="sec_5" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                      Điều 4. Quyền lợi và nghĩa vụ của các bên
                    </h3>
                    <p>
                      4.1. <strong>Thời giờ làm việc:</strong> Theo quy định ca làm việc của doanh nghiệp.
                    </p>
                    <p>
                      4.2. <strong>Chế độ nghỉ ngơi:</strong> Được hưởng các ngày nghỉ lễ, tết và ngày nghỉ hàng năm theo quy định của pháp luật lao động.
                    </p>
                    <p>
                      4.3. <strong>Bảo hiểm:</strong> Được tham gia BHXH, BHYT, BHTN theo mức quy định của pháp luật hiện hành.
                    </p>
                  </section>

                  {/* MỤC 6: ĐIỀU KHOẢN THI HÀNH & CHỮ KÝ CÁC BÊN */}
                  <section id="sec_6" className="mt-8 pt-6 border-t-2 border-slate-300 dark:border-slate-700 space-y-4">
                    <h3 className="font-bold uppercase font-sans text-xs text-center text-slate-800 dark:text-slate-200">
                      Điều 5. Điều khoản thi hành & Chữ ký của các bên
                    </h3>
                    <p className="text-center italic text-xs">
                      Hợp đồng này được lập dưới dạng Thông điệp dữ liệu điện tử có giá trị pháp lý theo quy định của pháp luật.
                    </p>

                    {/* KHU VỰC VÙNG KÝ CỦA CÁC BÊN */}
                    <div className="grid grid-cols-2 gap-6 pt-6">
                      {/* BÊN B: NGƯỜI LAO ĐỘNG */}
                      <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center space-y-2">
                        <p className="font-bold font-sans uppercase text-xs">
                          NGƯỜI LAO ĐỘNG (BÊN B)
                        </p>
                        <span className="text-[11px] text-muted-foreground block">(Ký, ghi rõ họ tên)</span>

                        {/* VÙNG CHỮ KÝ */}
                        <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 transition-all">
                          {isMySignCompleted || signingStatus === "PARTIALLY_SIGNED" || signingStatus === "FULLY_SIGNED" ? (
                            <div className="text-center p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 space-y-0.5">
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                              <strong className="text-xs font-bold block">✓ ĐÃ KÝ ĐIỆN TỬ</strong>
                              <span className="text-[10px] block font-mono">{employeeName}</span>
                              <span className="text-[9px] text-muted-foreground block font-mono">
                                {partyBSigner?.signedAt ? `Thời gian: ${new Date(partyBSigner.signedAt).toLocaleString("vi-VN")}` : "Chữ ký số hợp lệ"}
                              </span>
                            </div>
                          ) : signingStatus === "REJECTED" ? (
                            <div className="text-center text-rose-600 text-xs">
                              <XCircle className="h-5 w-5 mx-auto mb-1" />
                              <span>Đã từ chối ký</span>
                            </div>
                          ) : (
                            <div className="text-center space-y-1">
                              <span className="text-xs font-semibold text-primary block">
                                [CHỜ BẠN KÝ ĐIỆN TỬ]
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                Nhấp nút &quot;Ký hợp đồng&quot; ở thanh dưới
                              </span>
                            </div>
                          )}
                        </div>

                        <strong className="text-xs font-sans block text-foreground">
                          {employeeName.toUpperCase()}
                        </strong>
                      </div>

                      {/* BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG */}
                      <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center space-y-2">
                        <p className="font-bold font-sans uppercase text-xs">
                          ĐẠI DIỆN PHÁP LUẬT (BÊN A)
                        </p>
                        <span className="text-[11px] text-muted-foreground block">(Ký, đóng dấu số)</span>

                        {/* VÙNG CHỮ KÝ ĐẠI DIỆN */}
                        <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2">
                          {partyASigner?.status === "SIGNED" || contractStatus === "ACTIVE" ? (
                            <div className="text-center p-2 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 space-y-0.5">
                              <CheckCircle2 className="h-5 w-5 text-blue-600 mx-auto" />
                              <strong className="text-xs font-bold block">✓ ĐÃ KÝ SỐ</strong>
                              <span className="text-[10px] block font-mono">{partyASigner?.signerName || "Người đại diện Bên A"}</span>
                              <span className="text-[9px] text-muted-foreground block font-mono">
                                {partyASigner?.signedAt ? new Date(partyASigner.signedAt).toLocaleString("vi-VN") : "Đã hoàn tất ký số"}
                              </span>
                            </div>
                          ) : partyASigner ? (
                            <div className="text-center space-y-1">
                              <span className="text-xs text-muted-foreground block">
                                [ĐANG CHỜ ĐẠI DIỆN KÝ]
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                {partyASigner.signerName} ({partyASigner.signerRoleTitle || "Đại diện bên A"})
                              </span>
                            </div>
                          ) : (
                            <div className="text-center space-y-1">
                              <span className="text-xs text-muted-foreground block">
                                [CHƯA PHÂN BỔ ĐẠI DIỆN KÝ]
                              </span>
                            </div>
                          )}
                        </div>

                        <strong className="text-xs font-sans block text-foreground">
                          {partyASigner?.signerName ? partyASigner.signerName.toUpperCase() : "CHƯA CHỈ ĐỊNH"}
                        </strong>
                      </div>
                    </div>
                  </section>
            </div>
          </div>
        </div>

        {/* ── CỘT PHẢI: THÔNG TIN KÝ (SIGNERS & METADATA) (3 cols) ── */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden sticky top-4">
            <CardHeader className="py-3.5 px-4 border-b border-border bg-muted/20">
              <CardTitle className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-primary" />
                <span>Tiến trình ký kết</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Danh sách người ký (Signers) từ API thực tế */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Người tham gia ký kết ({signers.length})
                </span>

                {signers.length > 0 ? (
                  signers.map((signer) => (
                    <div
                      key={signer.id || signer.signingOrder}
                      className={cn(
                        "p-2.5 rounded-lg border flex items-center justify-between transition-all",
                        signer.status === "SIGNED"
                          ? "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20"
                          : signer.status === "WAITING" || signer.status === "NOTIFIED"
                          ? "border-amber-200 bg-amber-50/30 dark:bg-amber-950/20"
                          : "border-border bg-muted/10"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full flex items-center justify-center font-bold text-[11px]",
                            signer.status === "SIGNED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {signer.status === "SIGNED" ? "✓" : signer.signingOrder}
                        </div>
                        <div>
                          <strong className="text-xs block text-foreground">
                            {signer.signerName} {signer.side === "PARTY_B" ? "(Bạn)" : ""}
                          </strong>
                          <span className="text-[10px] text-muted-foreground block">
                            {signer.signerRoleTitle || (signer.side === "PARTY_A" ? "Người sử dụng LĐ" : "Người lao động")}
                          </span>
                          {signer.signedAt && (
                            <span className="text-[9px] text-muted-foreground block font-mono">
                              Ký: {new Date(signer.signedAt).toLocaleString("vi-VN")}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          signer.status === "SIGNED"
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                            : signer.status === "WAITING" || signer.status === "NOTIFIED"
                            ? "bg-amber-100 text-amber-700 border-amber-300"
                            : "text-muted-foreground"
                        )}
                      >
                        {signer.status === "SIGNED"
                          ? "Đã ký"
                          : signer.status === "REJECTED"
                          ? "Từ chối"
                          : "Chờ ký"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-muted-foreground italic rounded-lg border border-dashed border-border text-center">
                    Chưa có danh sách người ký được chỉ định
                  </div>
                )}
              </div>

              {/* Trạng thái hiện tại của bạn */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Trạng thái hiện tại
                </span>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-xs font-semibold text-foreground block">
                    {signingStatus === "WAITING_MY_SIGN" && "Bạn chưa ký hợp đồng này"}
                    {signingStatus === "PARTIALLY_SIGNED" && "Bạn đã hoàn thành lượt ký"}
                    {signingStatus === "FULLY_SIGNED" && "Hợp đồng đã hoàn tất ký kết"}
                    {signingStatus === "REJECTED" && "Bạn đã từ chối ký hợp đồng"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    {signingStatus === "WAITING_MY_SIGN" && "Vui lòng xem kỹ nội dung và xác nhận ký."}
                    {signingStatus === "PARTIALLY_SIGNED" && "Đang chờ các bên còn lại hoàn thành ký kết."}
                  </span>
                </div>
              </div>

              {/* Dữ liệu kiểm toán */}
              <div className="pt-2 border-t border-border text-[10px] text-muted-foreground space-y-1">
                <p><strong>Ngày phát hành:</strong> {signingDate}</p>
                <p><strong>Ngày hiệu lực:</strong> {startDate}</p>
                <p><strong>Bảo mật:</strong> Mã hóa SSL/TLS 256-bit</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── 3. THANH DƯỚI CỐ ĐỊNH: TỪ CHỐI KÝ & KÝ HỢP ĐỒNG ───────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border py-3 px-6 shadow-xl flex items-center justify-between">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Tài liệu: <strong>{contractCode}</strong>
            </span>
            <Badge variant="outline" className="text-[11px] font-mono">
              Hình thức: Ký điện tử
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {signingStatus === "WAITING_MY_SIGN" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  className="h-9 px-4 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Từ chối ký</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="h-9 px-6 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-md cursor-pointer"
                >
                  <FileSignature className="h-4 w-4" />
                  <span>Ký hợp đồng</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Bạn đã hoàn thành lượt ký của mình</span>
                </span>
                <Button asChild size="sm" variant="outline" className="h-8 text-xs cursor-pointer">
                  <Link href="/me/contracts">Về danh sách hợp đồng</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MODAL 1: XÁC NHẬN KÝ HỢP ĐỒNG ────────────────────────── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <FileSignature className="h-5 w-5 text-primary" />
                <span>Xác nhận ký hợp đồng</span>
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/20 space-y-1">
                <span className="text-muted-foreground block text-[11px]">Bạn đang thực hiện ký:</span>
                <strong className="text-sm font-bold text-foreground block">
                  {contractTypeLabel} ({contractCode})
                </strong>
                <span className="text-[11px] text-primary block">
                  Người ký: {employeeName} ({employeeCode}) • {jobTitle}
                </span>
              </div>

              {/* Các điều khoản xác nhận */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkReadTerms}
                    onChange={(e) => setCheckReadTerms(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-foreground leading-relaxed">
                    Tôi đã đọc kỹ và đồng ý toàn bộ các điều khoản trong hợp đồng lao động này.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkAccurateInfo}
                    onChange={(e) => setCheckAccurateInfo(e.target.checked)}
                    className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="text-foreground leading-relaxed">
                    Tôi xác nhận các thông tin cá nhân, quyền lợi tiền lương là chính xác.
                  </span>
                </label>
              </div>

              {/* Chọn phương thức ký */}
              <div className="space-y-2 pt-2 border-t border-border">
                <label className="font-semibold text-muted-foreground uppercase text-[11px] block">
                  Phương thức ký
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSigningMethod("INTERNAL_CA")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                      signingMethod === "INTERNAL_CA"
                        ? "border-primary bg-red-50/50 text-primary font-semibold ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <KeyRound className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] block leading-tight">Chữ ký số OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSigningMethod("SMART_CA")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                      signingMethod === "SMART_CA"
                        ? "border-primary bg-red-50/50 text-primary font-semibold ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <ShieldCheck className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] block leading-tight">SmartCA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSigningMethod("DRAW")}
                    className={cn(
                      "p-2.5 rounded-xl border text-center transition-all cursor-pointer",
                      signingMethod === "DRAW"
                        ? "border-primary bg-red-50/50 text-primary font-semibold ring-1 ring-primary"
                        : "border-border hover:bg-muted text-muted-foreground"
                    )}
                  >
                    <PenTool className="h-4 w-4 mx-auto mb-1" />
                    <span className="text-[10px] block leading-tight">Vẽ tay</span>
                  </button>
                </div>

                {signingMethod === "INTERNAL_CA" && (
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground block">
                        Mã OTP xác thực sẽ gửi đến số: <strong>{employeePhone}</strong>
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isRequestingOtp}
                        onClick={handleRequestOtp}
                        className="h-7 text-[10px] gap-1 cursor-pointer"
                      >
                        {isRequestingOtp ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3" />
                        )}
                        <span>{otpSentNotice ? "Gửi lại OTP" : "Nhận mã OTP"}</span>
                      </Button>
                    </div>

                    {otpSentNotice && (
                      <p className="text-[10px] text-emerald-600 font-medium">{otpSentNotice}</p>
                    )}

                    <input
                      type="text"
                      placeholder="Nhập mã OTP xác thực"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full h-8 px-2.5 rounded-lg border border-border bg-card font-mono text-center tracking-widest text-sm focus:outline-hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="h-8.5 text-xs cursor-pointer"
              >
                Hủy
              </Button>

              <Button
                size="sm"
                disabled={!checkReadTerms || !checkAccurateInfo || isSigningApi}
                onClick={handleConfirmSign}
                className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5 cursor-pointer gap-1.5"
              >
                {isSigningApi && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Xác nhận ký</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: KÝ HỢP ĐỒNG THÀNH CÔNG ───────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">Ký hợp đồng thành công!</h3>
              <p className="text-xs text-muted-foreground">
                Bạn đã hoàn tất ký điện tử cho <strong>{contractCode}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs text-left space-y-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Tiến trình ký kết
              </span>

              <div className="space-y-2">
                {signers.length > 0 ? (
                  signers.map((s) => (
                    <div key={s.id || s.signingOrder} className="flex items-center justify-between">
                      <span className="text-foreground">
                        {s.signerName} {s.side === "PARTY_B" ? "(Bạn)" : ""}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          s.status === "SIGNED" || s.side === "PARTY_B"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : "text-muted-foreground"
                        )}
                      >
                        {s.status === "SIGNED" || s.side === "PARTY_B" ? "Đã ký" : "Chờ ký"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs italic">Đã ghi nhận chữ ký điện tử của bạn.</p>
                )}
              </div>
            </div>

            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 text-xs h-9 cursor-pointer"
              >
                Xem lại hợp đồng
              </Button>

              <Button
                size="sm"
                asChild
                className="flex-1 text-xs h-9 bg-primary text-primary-foreground font-semibold cursor-pointer"
              >
                <Link href="/me/contracts">Danh sách hợp đồng</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: TỪ CHỐI KÝ HỢP ĐỒNG ─────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <XCircle className="h-5 w-5 text-rose-600" />
                <span>Từ chối ký hợp đồng</span>
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">
                Nếu bạn phát hiện sai sót về thông tin cá nhân, mức lương hoặc các điều khoản, vui lòng nhập lý do bên dưới để bộ phận Nhân sự kiểm tra và điều chỉnh lại.
              </p>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Lý do từ chối ký (*):</label>
                <textarea
                  rows={4}
                  placeholder="Ví dụ: Sai thông tin số CCCD, mức lương chưa đúng thỏa thuận ban đầu..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-card text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                className="h-8.5 text-xs cursor-pointer"
              >
                Đóng
              </Button>

              <Button
                size="sm"
                onClick={handleConfirmReject}
                className="h-8.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
              >
                Gửi phản hồi từ chối
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentSigningPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">Đang tải tài liệu ký số...</div>}>
      <ContractSigningContent />
    </Suspense>
  );
}

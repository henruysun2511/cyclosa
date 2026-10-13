"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Các trạng thái ký
export type ContractSigningStatus =
  | "WAITING_MY_SIGN" // Chờ bạn ký
  | "PARTIALLY_SIGNED" // Bạn đã ký, chờ đại diện ký
  | "FULLY_SIGNED" // Tất cả các bên đã ký
  | "REJECTED"; // Từ chối ký

export default function DocumentSigningPage() {
  const [signingStatus, setSigningStatus] = useState<ContractSigningStatus>("WAITING_MY_SIGN");
  const [activeSection, setActiveSection] = useState("sec_1");
  const [zoomLevel, setZoomLevel] = useState(100);

  // Modal xác nhận ký
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [checkReadTerms, setCheckReadTerms] = useState(false);
  const [checkAccurateInfo, setCheckAccurateInfo] = useState(false);
  const [signingMethod, setSigningMethod] = useState<"INTERNAL_CA" | "SMART_CA" | "DRAW">("INTERNAL_CA");
  const [otpCode, setOtpCode] = useState("");
  const [signatureData, setSignatureData] = useState<string | null>(null);

  // Modal thành công
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Modal từ chối ký
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Refs tới từng mục hợp đồng để cuộn
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Mục lục hợp đồng
  const tableOfContents = [
    { id: "sec_1", number: "1", title: "Thông tin các bên tham gia" },
    { id: "sec_2", number: "2", title: "Công việc và địa điểm làm việc" },
    { id: "sec_3", number: "3", title: "Thời hạn hợp đồng lao động" },
    { id: "sec_4", number: "4", title: "Chế độ tiền lương và phụ cấp" },
    { id: "sec_5", number: "5", title: "Quyền lợi và nghĩa vụ lao động" },
    { id: "sec_6", number: "6", title: "Điều khoản thi hành & Chữ ký" },
  ];

  // Xử lý xác nhận ký
  const handleConfirmSign = () => {
    if (!checkReadTerms || !checkAccurateInfo) {
      toast.error("Vui lòng tích xác nhận cả 2 điều khoản trước khi ký!");
      return;
    }

    setSigningStatus("PARTIALLY_SIGNED");
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    toast.success("Ký hợp đồng điện tử thành công! Đã gửi thông báo đến Người đại diện theo pháp luật.");
  };

  // Xử lý từ chối ký
  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối ký!");
      return;
    }
    setSigningStatus("REJECTED");
    setShowRejectModal(false);
    toast.info("Đã từ chối ký hợp đồng và gửi phản hồi đến Ban Nhân sự.");
  };

  return (
    <div className="space-y-4 max-w-[1700px] mx-auto pb-24">
      {/* ── 1. THANH TRÊN: TÊN HỢP ĐỒNG, MÃ, TRẠNG THÁI KÝ ────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4 bg-card px-4 py-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Link href="/contracts">
              <ArrowLeft className="h-3.5 w-3.5 mr-0.5" />
              <span>Hợp đồng</span>
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-primary" />
              <span>Hợp đồng lao động</span>
            </h1>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
              HĐLĐ-2026-00125
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
              <Badge className="bg-blue-50 text-blue-700 border-blue-300 text-xs font-semibold">
                ● Hoàn tất ký (Chờ kích hoạt Active)
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
            className="h-8 text-xs gap-1"
            onClick={() => toast.info("Đang xuất tệp PDF HĐLĐ-2026-00125 có chữ ký số...")}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Tải PDF</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1"
            onClick={() => window.print()}
          >
            <Printer className="h-3.5 w-3.5" />
            <span>In tài liệu</span>
          </Button>
        </div>
      </div>

      {/* ── 2. BỐ CỤC 3 VÙNG: MỤC LỤC (Trái) - NỘI DUNG (Giữa) - THÔNG TIN KÝ (Phải) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ── CỘT TRÁI: MỤC LỤC HỢP ĐỒNG (2.5 cols) ─────────────── */}
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
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors font-medium",
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

              {/* Thông tin pháp lý nhanh */}
              <div className="mt-4 pt-3 border-t border-border px-2 space-y-2 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Tính pháp lý điện tử</span>
                </div>
                <p className="leading-relaxed">
                  Tuân thủ Luật Giao dịch Điện tử số 20/2023/QH15 & Bộ luật Lao động số 45/2019/QH14.
                </p>
                <div className="font-mono text-[10px] text-muted-foreground">
                  SHA-256: 4f8a...9c2e
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── CỘT GIỮA: NỘI DUNG HỢP ĐỒNG (6.5 cols - CHIẾM DIỆN TÍCH LỚN NHẤT) ── */}
        <div className="lg:col-span-6 space-y-3">
          <div
            ref={contentRef}
            className="overflow-auto max-h-[820px] rounded-xl border border-border shadow-md bg-slate-200/60 dark:bg-slate-950/60 p-4 sm:p-6 flex justify-center"
          >
            {/* TRANG TÀI LIỆU HỢP ĐỒNG A4 CHUẨN THỰC TẾ */}
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
                  Số: <strong>HĐLĐ-2026-00125</strong> / CYCLOSA-HR
                </p>
              </div>

              {/* TIÊU ĐỀ HỢP ĐỒNG */}
              <div className="text-center my-6 space-y-1">
                <h2 className="text-xl font-bold uppercase tracking-wide font-sans text-slate-900 dark:text-white">
                  HỢP ĐỒNG LAO ĐỘNG
                </h2>
                <p className="text-xs italic text-slate-600 dark:text-slate-400">
                  (Ban hành theo Bộ luật Lao động số 45/2019/QH14 ngày 20/11/2019)
                </p>
              </div>

              {/* MỤC 1: THÔNG TIN CÁC BÊN */}
              <section id="sec_1" className="space-y-4 pt-2">
                <p className="italic">
                  Hôm nay, ngày 07 tháng 10 năm 2026, tại Trụ sở Keangnam Landmark 72, Hà Nội, chúng tôi gồm có:
                </p>

                {/* BÊN A */}
                <div className="space-y-1 pl-2 border-l-2 border-slate-400">
                  <p className="font-bold uppercase font-sans text-xs text-primary">
                    BÊN A: NGƯỜI SỬ DỤNG LAO ĐỘNG — CÔNG TY CỔ PHẦN CÔNG NGHỆ CYCLOSA (FSI GROUP)
                  </p>
                  <p>
                    <strong>Đại diện bởi:</strong> Ông Lê Hoàng Nam &nbsp;&nbsp;&nbsp;&nbsp; <strong>Chức vụ:</strong> Tổng Giám Đốc
                  </p>
                  <p>
                    <strong>Địa chỉ trụ sở:</strong> Tầng 12 & 14, Tòa nhà Keangnam Landmark 72, Mễ Trì, Nam Từ Liêm, Hà Nội.
                  </p>
                  <p>
                    <strong>Mã số doanh nghiệp:</strong> 0108999888 do Sở KH&ĐT TP. Hà Nội cấp.
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> (024) 3888 9999 &nbsp;&nbsp;&nbsp;&nbsp; <strong>Email:</strong> legal@cyclosa.vn
                  </p>
                </div>

                {/* BÊN B */}
                <div className="space-y-1 pl-2 border-l-2 border-primary mt-3">
                  <p className="font-bold uppercase font-sans text-xs text-primary">
                    BÊN B: NGƯỜI LAO ĐỘNG — ÔNG NGUYỄN VĂN AN
                  </p>
                  <p>
                    <strong>Họ và tên:</strong> NGUYỄN VĂN AN &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mã nhân viên:</strong> NV00125
                  </p>
                  <p>
                    <strong>Ngày sinh:</strong> 15/08/1996 &nbsp;&nbsp;&nbsp;&nbsp; <strong>Quốc tịch:</strong> Việt Nam
                  </p>
                  <p>
                    <strong>Số CCCD:</strong> 001096001234 &nbsp;&nbsp;&nbsp;&nbsp; <strong>Ngày cấp:</strong> 10/05/2021 &nbsp;&nbsp;&nbsp;&nbsp; <strong>Nơi cấp:</strong> Cục CSQLHC về TTXH
                  </p>
                  <p>
                    <strong>Địa chỉ thường trú:</strong> Số 18, Ngõ 42 Phố Triều Khúc, Quận Thanh Xuân, TP. Hà Nội.
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> 0901 234 567 &nbsp;&nbsp;&nbsp;&nbsp; <strong>Email cá nhân:</strong> an.nguyen@cyclosa.vn
                  </p>
                </div>
              </section>

              {/* MỤC 2: CÔNG VIỆC VÀ ĐỊA ĐIỂM */}
              <section id="sec_2" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                  Điều 1. Công việc, chức danh và địa điểm làm việc
                </h3>
                <p>
                  1.1. <strong>Chức danh chuyên môn:</strong> Chuyên viên Cao cấp Phát triển Phần mềm (Senior Software Engineer).
                </p>
                <p>
                  1.2. <strong>Đơn vị công tác:</strong> Ban Công nghệ (FSI R&D Hub) trực thuộc Khối Kỹ Thuật.
                </p>
                <p>
                  1.3. <strong>Địa điểm làm việc:</strong> Trụ sở Keangnam Landmark 72, Hà Nội và làm việc linh hoạt theo quy chế Hybrid Work của Công ty.
                </p>
                <p>
                  1.4. <strong>Mô tả công việc:</strong> Tham gia kiến trúc và triển khai nền tảng CYCLOSA HRM, chịu trách nhiệm chất lượng kỹ thuật mã nguồn và cố vấn chuyên môn cho đội ngũ kỹ sư.
                </p>
              </section>

              {/* MỤC 3: THỜI HẠN HỢP ĐỒNG */}
              <section id="sec_3" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                  Điều 2. Thời hạn hợp đồng lao động
                </h3>
                <p>
                  2.1. <strong>Loại hợp đồng:</strong> Hợp đồng lao động xác định thời hạn 36 tháng.
                </p>
                <p>
                  2.2. <strong>Thời hạn hiệu lực:</strong> Từ ngày <strong>15/10/2026</strong> đến hết ngày <strong>14/10/2029</strong>.
                </p>
                <p>
                  2.3. Hết thời hạn hợp đồng, nếu hai bên tiếp tục duy trì quan hệ lao động thì sẽ ký kết hợp đồng không xác định thời hạn theo luật định.
                </p>
              </section>

              {/* MỤC 4: TIỀN LƯƠNG VÀ PHỤ CẤP */}
              <section id="sec_4" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                  Điều 3. Chế độ tiền lương, phụ cấp và hình thức trả lương
                </h3>
                <p>
                  3.1. <strong>Mức lương chính:</strong> <strong>38.000.000 VNĐ / tháng</strong> (Ba mươi tám triệu đồng chẵn).
                </p>
                <p>
                  3.2. <strong>Phụ cấp:</strong> Phụ cấp ăn trưa 1.200.000 VNĐ/tháng, Phụ cấp điện thoại & thiết bị 1.000.000 VNĐ/tháng.
                </p>
                <p>
                  3.3. <strong>Kỳ trả lương:</strong> Vào ngày 05 hàng tháng qua tài khoản ngân hàng của Người lao động.
                </p>
                <p>
                  3.4. <strong>Thưởng & Đãi ngộ:</strong> Thưởng tháng 13, thưởng hiệu quả kinh doanh theo KPI năm và gói bảo hiểm sức khỏe quốc tế Bảo Việt Healthcare VIP.
                </p>
              </section>

              {/* MỤC 5: QUYỀN LỢI VÀ NGHĨA VỤ */}
              <section id="sec_5" className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="font-bold uppercase font-sans text-xs text-slate-800 dark:text-slate-200">
                  Điều 4. Quyền lợi và nghĩa vụ của các bên
                </h3>
                <p>
                  4.1. <strong>Thời giờ làm việc:</strong> 40 giờ/tuần (từ Thứ Hai đến Thứ Sáu, nghỉ Thứ Bảy và Chủ Nhật).
                </p>
                <p>
                  4.2. <strong>Nghỉ phép năm:</strong> 14 ngày phép hưởng nguyên lương mỗi năm, tăng thêm 01 ngày sau mỗi 03 năm làm việc.
                </p>
                <p>
                  4.3. <strong>Bảo hiểm:</strong> Được đóng đầy đủ BHXH, BHYT, BHTN theo mức quy định của pháp luật Việt Nam.
                </p>
                <p>
                  4.4. <strong>Bảo mật thông tin:</strong> Người lao động cam kết tuân thủ Thỏa thuận bảo mật thông tin (NDA) và sở hữu trí tuệ của Tập đoàn.
                </p>
              </section>

              {/* MỤC 6: ĐIỀU KHOẢN THI HÀNH & CHỮ KÝ CÁC BÊN */}
              <section id="sec_6" className="mt-8 pt-6 border-t-2 border-slate-300 dark:border-slate-700 space-y-4">
                <h3 className="font-bold uppercase font-sans text-xs text-center text-slate-800 dark:text-slate-200">
                  Điều 5. Điều khoản thi hành & Chữ ký của các bên
                </h3>
                <p className="text-center italic text-xs">
                  Hợp đồng này được lập dưới dạng Thông điệp dữ liệu điện tử có giá trị pháp lý tương đương bản giấy gốc.
                </p>

                {/* KHU VỰC VÙNG KÝ CỦA CÁC BÊN */}
                <div className="grid grid-cols-2 gap-6 pt-6">
                  {/* BÊN B: NGƯỜI LAO ĐỘNG */}
                  <div className="border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center space-y-2">
                    <p className="font-bold font-sans uppercase text-xs">
                      NGƯỜI LAO ĐỘNG (BÊN B)
                    </p>
                    <span className="text-[11px] text-muted-foreground block">(Ký, ghi rõ họ tên)</span>

                    {/* VÙNG CHỮ KÝ CỦA BẠN */}
                    <div className="h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-2 transition-all">
                      {signingStatus === "WAITING_MY_SIGN" && (
                        <div className="text-center space-y-1">
                          <span className="text-xs font-semibold text-primary block">
                            [CHỜ NGUYỄN VĂN AN KÝ]
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            Nhấp nút \"Ký hợp đồng\" ở thanh dưới
                          </span>
                        </div>
                      )}

                      {(signingStatus === "PARTIALLY_SIGNED" || signingStatus === "FULLY_SIGNED") && (
                        <div className="text-center p-2 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 space-y-0.5">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto" />
                          <strong className="text-xs font-bold block">✓ ĐÃ KÝ ĐIỆN TỬ</strong>
                          <span className="text-[10px] block font-mono">Nguyễn Văn An</span>
                          <span className="text-[9px] text-muted-foreground block font-mono">
                            07/10/2026 14:35:10 • OTP Verified
                          </span>
                        </div>
                      )}

                      {signingStatus === "REJECTED" && (
                        <div className="text-center text-rose-600 text-xs">
                          <XCircle className="h-5 w-5 mx-auto mb-1" />
                          <span>Đã từ chối ký</span>
                        </div>
                      )}
                    </div>

                    <strong className="text-xs font-sans block text-foreground">
                      NGUYỄN VĂN AN
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
                      {signingStatus === "FULLY_SIGNED" ? (
                        <div className="text-center p-2 rounded bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 space-y-0.5">
                          <CheckCircle2 className="h-5 w-5 text-blue-600 mx-auto" />
                          <strong className="text-xs font-bold block">✓ ĐÃ KÝ SỐ CA</strong>
                          <span className="text-[10px] block font-mono">Lê Hoàng Nam (Tổng Giám Đốc)</span>
                          <span className="text-[9px] text-muted-foreground block font-mono">
                            VNPT SmartCA Verified
                          </span>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <span className="text-xs text-muted-foreground block">
                            [ĐANG CHỜ ĐẠI DIỆN KÝ]
                          </span>
                          <span className="text-[10px] text-muted-foreground block">
                            Sẽ ký sau khi Người lao động hoàn tất
                          </span>
                        </div>
                      )}
                    </div>

                    <strong className="text-xs font-sans block text-foreground">
                      LÊ HOÀNG NAM
                    </strong>
                  </div>
                </div>

                {/* CHỨNG THỰC CỦA HR */}
                <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      Xác thực bởi HR: <strong>Trần Mai Phương</strong> (Trưởng ban Nhân sự)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-700">06/10/2026 15:30:22</span>
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
                <span>Thông tin & Tiến trình ký</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Danh sách người ký (Signers) */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Người tham gia ký kết
                </span>

                {/* 1. HR */}
                <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[11px]">
                      ✓
                    </div>
                    <div>
                      <strong className="text-xs block text-foreground">Trần Mai Phương</strong>
                      <span className="text-[10px] text-muted-foreground block">Đại diện HR</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-300">
                    Đã ký
                  </Badge>
                </div>

                {/* 2. Nhân viên (Bạn) */}
                <div
                  className={cn(
                    "p-2.5 rounded-lg border flex items-center justify-between transition-all",
                    signingStatus === "WAITING_MY_SIGN"
                      ? "border-red-300 bg-red-50/50 dark:bg-red-950/30"
                      : "border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center font-bold text-[11px]",
                        signingStatus === "WAITING_MY_SIGN"
                          ? "bg-primary text-primary-foreground"
                          : "bg-emerald-100 text-emerald-700"
                      )}
                    >
                      {signingStatus === "WAITING_MY_SIGN" ? "●" : "✓"}
                    </div>
                    <div>
                      <strong className="text-xs block text-foreground">Nguyễn Văn An (Bạn)</strong>
                      <span className="text-[10px] text-muted-foreground block">Người lao động</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      signingStatus === "WAITING_MY_SIGN"
                        ? "bg-red-100 text-primary border-red-300"
                        : "bg-emerald-100 text-emerald-700 border-emerald-300"
                    )}
                  >
                    {signingStatus === "WAITING_MY_SIGN" ? "Chưa ký" : "Đã ký"}
                  </Badge>
                </div>

                {/* 3. Đại diện pháp luật */}
                <div className="p-2.5 rounded-lg border border-border bg-muted/10 flex items-center justify-between opacity-85">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold text-[11px]">
                      ○
                    </div>
                    <div>
                      <strong className="text-xs block text-foreground">Lê Hoàng Nam</strong>
                      <span className="text-[10px] text-muted-foreground block">Tổng Giám Đốc</span>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Chờ ký
                  </Badge>
                </div>
              </div>

              {/* Trạng thái hiện tại của bạn */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Trạng thái hiện tại
                </span>
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <span className="text-xs font-semibold text-foreground block">
                    {signingStatus === "WAITING_MY_SIGN" && "Bạn chưa ký hợp đồng này"}
                    {signingStatus === "PARTIALLY_SIGNED" && "Bạn đã ký thành công"}
                    {signingStatus === "FULLY_SIGNED" && "Hợp đồng đã ký đủ các bên"}
                    {signingStatus === "REJECTED" && "Bạn đã từ chối ký"}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    {signingStatus === "WAITING_MY_SIGN" && "Vui lòng xem kỹ 6 mục nội dung và xác nhận ký."}
                    {signingStatus === "PARTIALLY_SIGNED" && "Hệ thống đang chuyển đến Người đại diện ký duyệt."}
                  </span>
                </div>
              </div>

              {/* Phương thức ký */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Phương thức hỗ trợ
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-[10px]">Chữ ký số OTP</Badge>
                  <Badge variant="outline" className="text-[10px]">SmartCA</Badge>
                  <Badge variant="outline" className="text-[10px]">Chữ ký vẽ tay</Badge>
                </div>
              </div>

              {/* Dữ liệu kiểm toán */}
              <div className="pt-2 border-t border-border text-[10px] text-muted-foreground space-y-1">
                <p><strong>Ngày phát hành:</strong> 06/10/2026 15:30</p>
                <p><strong>Hạn chót ký:</strong> 14/10/2026 23:59</p>
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
              Tài liệu: <strong>HĐLĐ-2026-00125</strong> • 6 mục điều khoản
            </span>
            <Badge variant="outline" className="text-[11px] font-mono">
              Hiệu lực: 15/10/2026
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            {signingStatus === "WAITING_MY_SIGN" ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRejectModal(true)}
                  className="h-9 px-4 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  <span>Từ chối ký</span>
                </Button>

                <Button
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="h-9 px-6 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-md"
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
                <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                  <Link href="/contracts">Về danh sách hợp đồng</Link>
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
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 dark:bg-red-950/20 space-y-1">
                <span className="text-muted-foreground block text-[11px]">Bạn đang thực hiện ký:</span>
                <strong className="text-sm font-bold text-foreground block">
                  Hợp đồng lao động HĐLĐ-2026-00125
                </strong>
                <span className="text-[11px] text-primary block">
                  Người ký: Nguyễn Văn An (NV00125) • Senior Software Engineer
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
                    Tôi đã đọc kỹ và đồng ý toàn bộ 6 điều khoản trong hợp đồng lao động này.
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
                      "p-2.5 rounded-xl border text-center transition-all",
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
                      "p-2.5 rounded-xl border text-center transition-all",
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
                      "p-2.5 rounded-xl border text-center transition-all",
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
                  <div className="p-3 rounded-lg border border-border bg-muted/20 space-y-1.5 mt-2">
                    <span className="text-[11px] text-muted-foreground block">
                      Mã OTP xác thực ký đã được gửi đến số <strong>0901***567</strong>:
                    </span>
                    <input
                      type="text"
                      placeholder="Nhập mã OTP (ví dụ: 889966)"
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
                className="h-8.5 text-xs"
              >
                Hủy
              </Button>

              <Button
                size="sm"
                disabled={!checkReadTerms || !checkAccurateInfo}
                onClick={handleConfirmSign}
                className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5"
              >
                Xác nhận ký
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
                Bạn đã hoàn tất ký điện tử cho <strong>HĐLĐ-2026-00125</strong>.
              </p>
            </div>

            {/* Trạng thái ký chi tiết */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 text-xs text-left space-y-3">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Trạng thái tiến trình ký (Signflow Status)
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">✓ Đại diện HR (Trần Mai Phương)</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                    Đã ký
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-foreground font-medium text-primary">✓ Nguyễn Văn An (Bạn)</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-100 text-emerald-800 border-emerald-300">
                    Đã ký
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">○ Người đại diện (Lê Hoàng Nam)</span>
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Đang chờ ký
                  </Badge>
                </div>
              </div>

              {/* Ghi chú phân định FULLY_SIGNED vs ACTIVE */}
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground leading-relaxed">
                ℹ️ <strong>Lưu ý:</strong> Hợp đồng hiện đang ở trạng thái <em>Chờ đại diện ký</em>. Sau khi tất cả các bên hoàn tất ký kết, hợp đồng sẽ đạt trạng thái <strong>FULLY_SIGNED</strong> và chính thức chuyển sang <strong>ACTIVE (CÓ HIỆU LỰC)</strong> vào ngày <strong>15/10/2026</strong>.
              </div>
            </div>

            <div className="flex gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 text-xs h-9"
              >
                Xem lại hợp đồng
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setShowSuccessModal(false);
                  toast.success("Đang tải xuống bản sao hợp đồng có chữ ký điện tử...");
                }}
                className="flex-1 text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                <span>Tải hợp đồng</span>
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
              <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                <span>Từ chối ký hợp đồng</span>
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">
                Vui lòng cung cấp lý do từ chối để bộ phận Nhân sự & Pháp chế tiến hành điều chỉnh nội dung hợp đồng:
              </p>

              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ví dụ: Sai thông tin số CCCD, mức lương phụ cấp chưa khớp thỏa thuận..."
                className="w-full p-2.5 rounded-lg border border-border bg-card text-xs focus:outline-hidden"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectModal(false)}
                className="h-8 text-xs"
              >
                Quay lại
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmReject}
                className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-medium"
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

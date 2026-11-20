"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  FileText,
  FileCheck2,
  User,
  Building2,
  Calendar,
  MapPin,
  QrCode,
  Eye,
  EyeOff,
  Copy,
  Download,
  RefreshCw,
  Edit3,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DocumentOcrVerifyPage() {
  // Zoom & view mode state
  const [zoomLevel, setZoomLevel] = useState(100);
  const [docView, setDocView] = useState<"cccd_front" | "cccd_back" | "curriculum_vitae">("cccd_front");
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [activeField, setActiveField] = useState<string | null>(null);

  const initialValues = {
    idNumber: "001085002914",
    fullName: "NGUYỄN VĂN AN",
    dob: "15/08/1982",
    gender: "Nam",
    nationality: "Việt Nam",
    ethnicity: "Kinh",
    hometown: "Kim Động, Hưng Yên",
    residence: "Biệt thự BT05, KĐT Ngoại Giao Đoàn, P. Xuân Tảo, Bắc Từ Liêm, Hà Nội",
    issueDate: "12/04/2021",
    issuePlace: "Cục Cảnh sát QLHC về TTXH",
    expiryDate: "15/08/2042",
    taxCode: "8029183491",
  };

  // Form extracted fields (Metadata)
  const [idNumber, setIdNumber] = useState(initialValues.idNumber);
  const [fullName, setFullName] = useState(initialValues.fullName);
  const [dob, setDob] = useState(initialValues.dob);
  const [gender, setGender] = useState(initialValues.gender);
  const [nationality, setNationality] = useState(initialValues.nationality);
  const [ethnicity, setEthnicity] = useState(initialValues.ethnicity);
  const [hometown, setHometown] = useState(initialValues.hometown);
  const [residence, setResidence] = useState(initialValues.residence);
  const [issueDate, setIssueDate] = useState(initialValues.issueDate);
  const [issuePlace, setIssuePlace] = useState(initialValues.issuePlace);
  const [expiryDate, setExpiryDate] = useState(initialValues.expiryDate);
  const [taxCode, setTaxCode] = useState(initialValues.taxCode);

  const handleReset = () => {
    setIdNumber(initialValues.idNumber);
    setFullName(initialValues.fullName);
    setDob(initialValues.dob);
    setGender(initialValues.gender);
    setNationality(initialValues.nationality);
    setEthnicity(initialValues.ethnicity);
    setHometown(initialValues.hometown);
    setResidence(initialValues.residence);
    setIssueDate(initialValues.issueDate);
    setIssuePlace(initialValues.issuePlace);
    setExpiryDate(initialValues.expiryDate);
    setTaxCode(initialValues.taxCode);
    toast.info("Đã khôi phục dữ liệu ban đầu từ ảnh quét OCR");
  };

  const handleConfirmVerification = () => {
    toast.success("Xác thực hồ sơ OCR thành công!", {
      description: "Dữ liệu pháp lý CCCD đã được ghi nhận và đồng bộ vào Hồ sơ nhân sự cốt lõi (EMP001).",
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* ── Bố Cục 2 Bên (Bên Trái: Trình xem tài liệu & OCR Boxes | Bên Phải: Metadata trích xuất) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── BÊN TRÁI: ẢNH CĂN CƯỚC CÔNG DÂN & HỒ SƠ GIẢ LẬP BẰNG HTML (6 hoặc 7 cols) ─ */}
        <Card className="lg:col-span-6 xl:col-span-7 border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3 px-5 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/20">
            {/* Document Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg">
              <button
                type="button"
                onClick={() => setDocView("cccd_front")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                  docView === "cccd_front"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                CCCD Mặt trước
              </button>

              <button
                type="button"
                onClick={() => setDocView("cccd_back")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                  docView === "cccd_back"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                CCCD Mặt sau
              </button>

              <button
                type="button"
                onClick={() => setDocView("curriculum_vitae")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                  docView === "curriculum_vitae"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Hồ sơ lý lịch
              </button>
            </div>

            {/* Viewer Controls */}
            <div className="flex items-center gap-1 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="h-7 text-2xs gap-1 text-muted-foreground"
                title="Bật/Tắt khung nhận diện OCR"
              >
                {showBoundingBoxes ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>OCR Boxes</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
                className="h-7 w-7 p-0"
                title="Thu nhỏ"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>

              <span className="font-mono text-2xs text-muted-foreground min-w-[35px] text-center">
                {zoomLevel}%
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(130, z + 10))}
                className="h-7 w-7 p-0"
                title="Phóng to"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(100)}
                className="h-7 w-7 p-0"
                title="Đặt lại kích thước"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 bg-slate-100/60 flex items-center justify-center min-h-[440px] overflow-auto">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center" }}
              className="transition-transform duration-150"
            >
              {/* ────────────────────────────────────────────────────────── */}
              {/* 1. MẶT TRƯỚC CCCD GIẢ LẬP BẰNG HTML                       */}
              {/* ────────────────────────────────────────────────────────── */}
              {docView === "cccd_front" && (
                <div className="w-[490px] h-[310px] rounded-2xl bg-gradient-to-br from-emerald-50/90 via-sky-50/80 to-amber-50/70 border border-slate-300 shadow-md p-5 flex flex-col justify-between relative overflow-hidden select-none">
                  {/* Subtle security guilloche pattern overlay */}
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px]" />

                  {/* Header Quốc hiệu & Tiêu ngữ */}
                  <div className="flex justify-between items-start border-b border-emerald-900/10 pb-2 relative z-10">
                    <div className="flex items-center gap-2.5">
                      {/* Quốc huy Việt Nam mô phỏng */}
                      <div className="h-10 w-10 rounded-full bg-red-600 text-yellow-300 flex items-center justify-center shadow-xs shrink-0 border border-yellow-400">
                        <span className="text-base font-bold">★</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold tracking-tight text-slate-800 uppercase leading-none">
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </p>
                        <p className="text-[9px] font-medium text-slate-600 text-center tracking-normal mt-0.5">
                          Độc lập - Tự do - Hạnh phúc
                        </p>
                        <p className="text-[12px] font-bold text-red-700 uppercase tracking-wider mt-1">
                          CĂN CƯỚC CÔNG DÂN / <span className="text-[9px] text-slate-500 font-normal">Identity Card</span>
                        </p>
                      </div>
                    </div>

                    {/* Chip điện tử thông minh EMV mô phỏng bằng HTML */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-amber-300 via-yellow-200 to-amber-400 border border-amber-500 shadow-xs flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-x-0 h-0.5 bg-amber-600/40 top-2" />
                        <div className="absolute inset-x-0 h-0.5 bg-amber-600/40 bottom-2" />
                        <div className="absolute inset-y-0 w-0.5 bg-amber-600/40 left-3" />
                        <div className="h-2 w-3 rounded-xs border border-amber-600/60 bg-amber-100/50" />
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 uppercase">CHIP</span>
                    </div>
                  </div>

                  {/* Body: Ảnh thẻ 3x4 & Thông tin chi tiết */}
                  <div className="grid grid-cols-12 gap-3.5 items-center relative z-10 my-1">
                    {/* Ảnh thẻ 3x4 */}
                    <div className="col-span-4 flex flex-col items-center">
                      <div className="h-[125px] w-[95px] rounded-lg border-2 border-slate-300 bg-sky-100 overflow-hidden shadow-xs relative">
                        <img
                          src="/avatars/emp_1.jpg"
                          alt="Ảnh chân dung công dân"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                        {/* Dấu mờ an ninh */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                      <span className="text-[8px] text-slate-500 mt-1 font-mono">
                        Hạn: {expiryDate}
                      </span>
                    </div>

                    {/* Các dòng thông tin nhận diện kèm Bounding Box OCR */}
                    <div className="col-span-8 space-y-1.5 text-xs">
                      {/* Số định danh cá nhân */}
                      <div
                        className={cn(
                          "transition-all rounded px-1.5 py-0.5",
                          showBoundingBoxes && "border-2 border-dashed border-emerald-500 bg-emerald-500/10",
                          activeField === "idNumber" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                        )}
                      >
                        <span className="text-[9px] text-slate-500 block leading-tight">
                          Số / No.:
                        </span>
                        <span className="text-base font-bold font-mono tracking-wider text-red-700">
                          {idNumber}
                        </span>
                      </div>

                      {/* Họ và tên */}
                      <div
                        className={cn(
                          "transition-all rounded px-1.5 py-0.5",
                          showBoundingBoxes && "border border-dashed border-blue-500 bg-blue-500/5",
                          activeField === "fullName" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                        )}
                      >
                        <span className="text-[9px] text-slate-500 block leading-tight">
                          Họ và tên / Full name:
                        </span>
                        <span className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                          {fullName}
                        </span>
                      </div>

                      {/* Ngày sinh & Giới tính */}
                      <div className="grid grid-cols-2 gap-2">
                        <div
                          className={cn(
                            "transition-all rounded px-1.5 py-0.5",
                            showBoundingBoxes && "border border-dashed border-slate-400 bg-slate-400/5",
                            activeField === "dob" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                          )}
                        >
                          <span className="text-[8px] text-slate-500 block leading-tight">
                            Ngày sinh / Date of birth:
                          </span>
                          <span className="text-[11px] font-semibold font-mono text-slate-800">
                            {dob}
                          </span>
                        </div>

                        <div
                          className={cn(
                            "transition-all rounded px-1.5 py-0.5",
                            showBoundingBoxes && "border border-dashed border-slate-400 bg-slate-400/5",
                            activeField === "gender" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                          )}
                        >
                          <span className="text-[8px] text-slate-500 block leading-tight">
                            Giới tính / Sex:
                          </span>
                          <span className="text-[11px] font-semibold text-slate-800">
                            {gender}
                          </span>
                        </div>
                      </div>

                      {/* Quê quán */}
                      <div
                        className={cn(
                          "transition-all rounded px-1.5 py-0.5",
                          showBoundingBoxes && "border border-dashed border-slate-400 bg-slate-400/5",
                          activeField === "hometown" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                        )}
                      >
                        <span className="text-[8px] text-slate-500 block leading-tight">
                          Quê quán / Place of origin:
                        </span>
                        <span className="text-[10px] font-medium text-slate-800 truncate block">
                          {hometown}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer: Thường trú */}
                  <div
                    className={cn(
                      "transition-all rounded px-2 py-1 border-t border-slate-200/80 text-[10px] z-10",
                      showBoundingBoxes && "border border-dashed border-slate-400 bg-slate-400/5",
                      activeField === "residence" && "border-primary bg-primary/15 ring-2 ring-primary/20"
                    )}
                  >
                    <span className="text-[8px] text-slate-500 block leading-tight">
                      Nơi thường trú / Place of residence:
                    </span>
                    <span className="text-[10px] font-medium text-slate-800 truncate block">
                      {residence}
                    </span>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* 2. MẶT SAU CCCD GIẢ LẬP BẰNG HTML                          */}
              {/* ────────────────────────────────────────────────────────── */}
              {docView === "cccd_back" && (
                <div className="w-[490px] h-[310px] rounded-2xl bg-gradient-to-br from-emerald-50/90 via-sky-50/80 to-amber-50/70 border border-slate-300 shadow-md p-5 flex flex-col justify-between relative overflow-hidden select-none">
                  {/* Top section: Đặc điểm nhân dạng & Ngày cấp */}
                  <div className="grid grid-cols-12 gap-3 z-10">
                    <div className="col-span-8 space-y-2 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-500 block leading-tight font-semibold">
                          Đặc điểm nhân dạng / Personal identification:
                        </span>
                        <p className="text-[10px] text-slate-800 leading-relaxed font-medium">
                          Nốt ruồi cách 1cm dưới sau đuôi mắt trái.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-[9px] text-slate-500 block leading-tight font-semibold">
                            Ngày cấp / Date of issue:
                          </span>
                          <span className="text-[11px] font-mono font-bold text-slate-800">
                            {issueDate}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block leading-tight font-semibold">
                            Nơi cấp / Place of issue:
                          </span>
                          <span className="text-[9px] font-medium text-slate-800 block">
                            {issuePlace}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dấu đỏ và vân tay mô phỏng */}
                    <div className="col-span-4 flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-2 border-red-600/80 text-red-600 flex items-center justify-center text-[7px] text-center font-bold uppercase rotate-[-12deg] p-1 shadow-2xs">
                        CỤC TRƯỞNG CỤC CẢNH SÁT QLHC VỀ TTXH
                      </div>
                    </div>
                  </div>

                  {/* Middle: 2 Ô vân tay mô phỏng */}
                  <div className="flex items-center justify-around py-1 border-t border-slate-200 z-10 text-[9px] text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-12 rounded border border-dashed border-slate-400 bg-slate-200/50 flex items-center justify-center text-[8px]">
                        Vân tay trỏ T
                      </div>
                      <div className="h-9 w-12 rounded border border-dashed border-slate-400 bg-slate-200/50 flex items-center justify-center text-[8px]">
                        Vân tay trỏ P
                      </div>
                    </div>
                    <span className="text-2xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Đã quét sinh trắc học
                    </span>
                  </div>

                  {/* Bottom: Vùng mã đọc máy MRZ (Machine Readable Zone) chuẩn ICAO */}
                  <div className="bg-white/80 rounded-lg p-2 border border-slate-300 font-mono text-[9px] tracking-widest text-slate-700 leading-none space-y-0.5 z-10">
                    <div>IDVNM{idNumber}001085002914&lt;&lt;7</div>
                    <div>8208154M4208158VNM&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;0</div>
                    <div>NGUYEN&lt;&lt;VAN&lt;AN&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
                  </div>
                </div>
              )}

              {/* ────────────────────────────────────────────────────────── */}
              {/* 3. HỒ SƠ LÝ LỊCH NHÂN SỰ GIẢ LẬP BẰNG HTML (A4 Form)        */}
              {/* ────────────────────────────────────────────────────────── */}
              {docView === "curriculum_vitae" && (
                <div className="w-[490px] min-h-[340px] rounded-xl bg-white border border-slate-300 shadow-md p-6 text-xs space-y-3.5 select-none relative">
                  <div className="text-center border-b border-slate-200 pb-3">
                    <p className="text-[10px] font-bold uppercase text-slate-600">
                      CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                    </p>
                    <p className="text-[9px] text-slate-500">Độc lập - Tự do - Hạnh phúc</p>
                    <h3 className="text-sm font-bold text-slate-900 uppercase mt-2">
                      TỜ KHAI LÝ LỊCH NHÂN SỰ DOANH NGHIỆP
                    </h3>
                    <p className="text-[9px] text-slate-400 font-mono">Mã hồ sơ: DOC-EMP-001/CYCLOSA</p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-800">
                    <p className="flex justify-between border-b border-dashed border-slate-200 py-1">
                      <span className="text-slate-500">1. Họ và tên người lao động:</span>
                      <strong className="font-semibold uppercase">{fullName}</strong>
                    </p>
                    <p className="flex justify-between border-b border-dashed border-slate-200 py-1">
                      <span className="text-slate-500">2. Số căn cước công dân:</span>
                      <strong className="font-mono text-red-700">{idNumber}</strong>
                    </p>
                    <p className="flex justify-between border-b border-dashed border-slate-200 py-1">
                      <span className="text-slate-500">3. Ngày tháng năm sinh:</span>
                      <strong className="font-mono">{dob}</strong>
                    </p>
                    <p className="flex justify-between border-b border-dashed border-slate-200 py-1">
                      <span className="text-slate-500">4. Nơi đăng ký thường trú:</span>
                      <span className="max-w-[280px] text-right truncate">{residence}</span>
                    </p>
                    <p className="flex justify-between border-b border-dashed border-slate-200 py-1">
                      <span className="text-slate-500">5. Mã số thuế TNCN:</span>
                      <strong className="font-mono text-emerald-700">{taxCode}</strong>
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-[10px] text-slate-500">
                    <span>Người khai: {fullName}</span>
                    <span className="text-emerald-700 font-semibold">✓ Đã ký số VNPT-CA</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── BÊN PHẢI: DANH SÁCH METADATA TRÍCH XUẤT TỪ OCR (5 hoặc 6 cols) ─ */}
        <Card className="lg:col-span-6 xl:col-span-5 border-border bg-card shadow-xs rounded-xl overflow-hidden">
          <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Danh sách Metadata trích xuất</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Các trường OCR có thể chỉnh sửa trực tiếp nếu AI nhận sai sót
              </p>
            </div>

            <Badge variant="outline" className="font-mono text-xs">
              11 trường
            </Badge>
          </CardHeader>

          <CardContent className="p-5 space-y-4 text-xs">
            {/* Field 1: Số CCCD */}
            <div
              onMouseEnter={() => setActiveField("idNumber")}
              onMouseLeave={() => setActiveField(null)}
              className="space-y-1 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Số CCCD / Mã định danh</span>
                  <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  99.8% Khớp
                </span>
              </div>
              <Input
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="h-8 text-xs font-mono font-bold text-primary bg-card"
              />
            </div>

            {/* Field 2: Họ và tên */}
            <div
              onMouseEnter={() => setActiveField("fullName")}
              onMouseLeave={() => setActiveField(null)}
              className="space-y-1 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <span>Họ và tên đầy đủ</span>
                  <span className="text-rose-500">*</span>
                </Label>
                <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  99.5% Khớp
                </span>
              </div>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-8 text-xs font-semibold uppercase bg-card"
              />
            </div>

            {/* Field 3 & 4: Ngày sinh & Giới tính */}
            <div className="grid grid-cols-2 gap-3 px-2">
              <div
                onMouseEnter={() => setActiveField("dob")}
                onMouseLeave={() => setActiveField(null)}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">Ngày sinh</Label>
                  <span className="text-[9px] font-mono text-emerald-600">99.2%</span>
                </div>
                <Input
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="h-8 text-xs font-mono bg-card"
                />
              </div>

              <div
                onMouseEnter={() => setActiveField("gender")}
                onMouseLeave={() => setActiveField(null)}
                className="space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground">Giới tính</Label>
                  <span className="text-[9px] font-mono text-emerald-600">99.9%</span>
                </div>
                <Input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-8 text-xs bg-card"
                />
              </div>
            </div>

            {/* Field 5 & 6: Quốc tịch & Dân tộc */}
            <div className="grid grid-cols-2 gap-3 px-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Quốc tịch</Label>
                <Input
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Dân tộc</Label>
                <Input
                  value={ethnicity}
                  onChange={(e) => setEthnicity(e.target.value)}
                  className="h-8 text-xs bg-card"
                />
              </div>
            </div>

            {/* Field 7: Quê quán */}
            <div
              onMouseEnter={() => setActiveField("hometown")}
              onMouseLeave={() => setActiveField(null)}
              className="space-y-1 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">Quê quán (Nguyên quán)</Label>
                <span className="text-[9px] font-mono text-emerald-600">98.9%</span>
              </div>
              <Input
                value={hometown}
                onChange={(e) => setHometown(e.target.value)}
                className="h-8 text-xs bg-card"
              />
            </div>

            {/* Field 8: Nơi thường trú */}
            <div
              onMouseEnter={() => setActiveField("residence")}
              onMouseLeave={() => setActiveField(null)}
              className="space-y-1 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">Nơi thường trú theo CCCD</Label>
                <span className="text-[9px] font-mono text-emerald-600">99.1%</span>
              </div>
              <Input
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                className="h-8 text-xs bg-card"
              />
            </div>

            {/* Field 9 & 10: Ngày cấp & Nơi cấp */}
            <div className="grid grid-cols-2 gap-3 px-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Ngày cấp</Label>
                <Input
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="h-8 text-xs font-mono bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Có giá trị đến</Label>
                <Input
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="h-8 text-xs font-mono bg-card"
                />
              </div>
            </div>

            {/* Field 11: Nơi cấp & Mã số thuế */}
            <div className="grid grid-cols-2 gap-3 px-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Cơ quan cấp</Label>
                <Input
                  value={issuePlace}
                  onChange={(e) => setIssuePlace(e.target.value)}
                  className="h-8 text-xs bg-card"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Mã số thuế TNCN</Label>
                <Input
                  value={taxCode}
                  onChange={(e) => setTaxCode(e.target.value)}
                  className="h-8 text-xs font-mono bg-card"
                />
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs"
              >
                Đặt lại
              </Button>

              <Button
                size="sm"
                onClick={handleConfirmVerification}
                className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Xác nhận & Lưu hồ sơ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

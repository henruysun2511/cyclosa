"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContractDetailPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "document" | "signflow" | "appendices">("overview");

  const contractInfo = {
    contractNumber: "HĐLĐ-2026-00125",
    title: "Hợp đồng lao động xác định thời hạn (36 tháng)",
    employeeName: "Nguyễn Văn An",
    employeeCode: "NV00125",
    role: "Chuyên viên Cao cấp Phát triển Phần mềm",
    department: "Ban Công nghệ (FSI R&D Hub)",
    signDate: "07/10/2026",
    effectiveDate: "15/10/2026",
    expiryDate: "14/10/2029",
    salary: 38000000,
    allowance: 2200000,
    status: "WAITING_MY_SIGN", // WAITING_MY_SIGN | PARTIALLY_SIGNED | FULLY_SIGNED | ACTIVE
    signers: [
      { name: "Trần Mai Phương", role: "Đại diện HR", status: "SIGNED", signedAt: "06/10/2026 15:30" },
      { name: "Nguyễn Văn An", role: "Người lao động", status: "PENDING", signedAt: null },
      { name: "Lê Hoàng Nam", role: "Tổng Giám Đốc", status: "PENDING", signedAt: null },
    ]
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ── 1. Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
            <Link href="/contracts">
              <ArrowLeft className="h-3.5 w-3.5 mr-0.5" />
              <span>Danh sách</span>
            </Link>
          </Button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <FileSignature className="h-6 w-6 text-primary" />
                <span>Chi tiết Hợp đồng: {contractInfo.contractNumber}</span>
              </h1>
              <Badge className="bg-red-50 text-primary border-red-200 text-xs font-semibold">
                ● Chờ bạn ký
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Người lao động: <strong>{contractInfo.employeeName}</strong> ({contractInfo.employeeCode}) • {contractInfo.role}
            </p>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="h-8.5 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs">
            <Link href="/me/signing">
              <FileSignature className="h-3.5 w-3.5" />
              <span>Chuyển sang trang Ký điện tử</span>
            </Link>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8.5 text-xs gap-1"
            onClick={() => toast.info("Đang tải xuống tệp PDF hợp đồng đính kèm...")}
          >
            <Download className="h-3.5 w-3.5" />
            <span>Tải PDF</span>
          </Button>
        </div>
      </div>

      {/* ── 2. Thẻ KPI Tổng quan ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Mức lương cơ bản</span>
              <div className="text-xl font-bold font-mono text-primary mt-0.5">
                38.000.000 <span className="text-xs font-normal text-muted-foreground">VNĐ</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Phụ cấp: 2.200.000 VNĐ</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 text-primary flex items-center justify-center">
              <Coins className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Thời hạn hợp đồng</span>
              <div className="text-base font-bold text-foreground mt-0.5">
                36 Tháng (3 năm)
              </div>
              <span className="text-[11px] text-muted-foreground font-mono">15/10/2026 ➔ 14/10/2029</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Tiến độ ký số</span>
              <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                1/3 <span className="text-xs font-normal text-muted-foreground">người đã ký</span>
              </div>
              {/* Progress bar đỏ CYCLOSA */}
              <div className="w-24 bg-red-100 dark:bg-red-950/40 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-primary h-full rounded-full" style={{ width: "33%" }} />
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center justify-center">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground font-medium block">Trạng thái hiệu lực</span>
              <div className="text-sm font-bold text-amber-600 mt-0.5">
                CHƯA KÍCH HOẠT
              </div>
              <span className="text-[11px] text-muted-foreground">Chờ hoàn tất ký & đến ngày</span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── 3. Tabs điều hướng chi tiết ────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 transition-colors",
            activeTab === "overview"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Thông tin chung & Đãi ngộ
        </button>
        <button
          onClick={() => setActiveTab("document")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 transition-colors",
            activeTab === "document"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Văn bản hợp đồng (A4 Preview)
        </button>
        <button
          onClick={() => setActiveTab("signflow")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 transition-colors",
            activeTab === "signflow"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Tiến trình ký kết (Signflow)
        </button>
        <button
          onClick={() => setActiveTab("appendices")}
          className={cn(
            "px-4 py-2 text-xs font-semibold border-b-2 transition-colors",
            activeTab === "appendices"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Phụ lục hợp đồng (0)
        </button>
      </div>

      {/* ── 4. Nội dung Tab ────────────────────────────────────── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cột trái: Thông tin hợp đồng & nhân sự (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Thông tin Hợp đồng Lao động
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Mã hợp đồng:</span>
                    <strong className="text-foreground text-sm font-mono">{contractInfo.contractNumber}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Loại hợp đồng:</span>
                    <span className="text-foreground font-semibold">{contractInfo.title}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Người lao động:</span>
                    <strong className="text-foreground">{contractInfo.employeeName}</strong>
                    <span className="text-muted-foreground text-[11px] block font-mono">Mã: {contractInfo.employeeCode}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Chức danh bổ nhiệm:</span>
                    <strong className="text-foreground">{contractInfo.role}</strong>
                    <span className="text-muted-foreground text-[11px] block">{contractInfo.department}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Ngày ký kết:</span>
                    <span className="font-mono text-foreground font-medium">{contractInfo.signDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Ngày có hiệu lực:</span>
                    <span className="font-mono text-foreground font-medium">{contractInfo.effectiveDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-[11px] block">Ngày hết hạn:</span>
                    <span className="font-mono text-foreground font-medium">{contractInfo.expiryDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chi tiết lương & đãi ngộ */}
            <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Gói Thu nhập & Chế độ Phúc lợi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Lương chính (Gross):</span>
                  <strong className="font-mono text-foreground text-sm">38.000.000 VNĐ</strong>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Phụ cấp ăn trưa:</span>
                  <span className="font-mono text-foreground">1.200.000 VNĐ</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Phụ cấp thiết bị & công nghệ:</span>
                  <span className="font-mono text-foreground">1.000.000 VNĐ</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border">
                  <span className="text-muted-foreground">Bảo hiểm sức khỏe:</span>
                  <span className="text-emerald-700 font-medium">Bảo Việt Healthcare Diamond (Công ty chi trả 100%)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Số ngày phép năm:</span>
                  <strong className="text-foreground">14 ngày phép hưởng nguyên lương / năm</strong>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cột phải: Tiến trình ký kết & Thao tác (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-border bg-card shadow-xs rounded-xl overflow-hidden">
              <CardHeader className="py-3.5 px-5 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Tiến trình Ký điện tử</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3.5 text-xs">
                {contractInfo.signers.map((signer, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/10">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs",
                          signer.status === "SIGNED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {signer.status === "SIGNED" ? "✓" : i + 1}
                      </div>
                      <div>
                        <strong className="text-foreground block">{signer.name}</strong>
                        <span className="text-[11px] text-muted-foreground block">{signer.role}</span>
                      </div>
                    </div>
                    <div>
                      {signer.status === "SIGNED" ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px]">
                          Đã ký ({signer.signedAt})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Chờ ký
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <Button asChild className="w-full text-xs h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5">
                    <Link href="/me/signing">
                      <FileSignature className="h-4 w-4" />
                      <span>Thực hiện ký hợp đồng ngay</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tab Preview Văn bản */}
      {activeTab === "document" && (
        <Card className="border-border bg-card shadow-xs rounded-xl p-6 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Bản xem trước A4 của hợp đồng lao động HĐLĐ-2026-00125. Để ký và tương tác trực tiếp, vui lòng mở trang Ký tài liệu.
          </p>
          <Button asChild className="bg-primary text-primary-foreground text-xs">
            <Link href="/me/signing">Mở giao diện Ký hợp đồng điện tử</Link>
          </Button>
        </Card>
      )}

      {/* Tab Tiến trình ký */}
      {activeTab === "signflow" && (
        <Card className="border-border bg-card shadow-xs rounded-xl p-6 space-y-3 text-xs">
          <h3 className="text-sm font-semibold text-foreground">Luồng luân chuyển chữ ký số:</h3>
          <p className="text-muted-foreground">1. Đại diện HR khởi tạo & xác thực chữ ký (Đã hoàn thành)</p>
          <p className="text-primary font-semibold">2. Người lao động (Nguyễn Văn An) ký điện tử qua OTP/SmartCA (Đang chờ bạn thực hiện)</p>
          <p className="text-muted-foreground">3. Người đại diện pháp luật (Tổng Giám Đốc) ký đóng dấu điện tử (Bước cuối)</p>
          <p className="text-muted-foreground">4. Hợp đồng đạt trạng thái FULLY_SIGNED và tự động kích hoạt ACTIVE vào ngày 15/10/2026.</p>
        </Card>
      )}

      {/* Tab Phụ lục */}
      {activeTab === "appendices" && (
        <Card className="border-border bg-card shadow-xs rounded-xl p-8 text-center text-muted-foreground text-xs">
          <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-40 text-primary" />
          <p className="font-medium">Chưa có phụ lục hợp đồng nào phát sinh.</p>
          <span>Các phụ lục điều chỉnh lương hoặc gia hạn sẽ được lưu trữ tại đây khi ký kết.</span>
        </Card>
      )}
    </div>
  );
}

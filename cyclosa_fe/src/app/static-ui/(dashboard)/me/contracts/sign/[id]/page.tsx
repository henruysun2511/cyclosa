"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileSignature,
  CheckCircle2,
  Lock,
  Download,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignaturePad, OtpInput } from "@/components/shared";

export default function SignContractMobilePage() {
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"review" | "signature" | "otp" | "done">("review");
  const [loading, setLoading] = useState(false);

  const handleConfirmOtp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground">
          <Link href="/contracts">
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
            Quay lại danh sách hợp đồng
          </Link>
        </Button>
        <Badge variant="outline" className="font-mono text-xs">CON-13</Badge>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Ký Hợp đồng Lao động Điện tử
        </h1>
        <p className="text-xs text-muted-foreground">
          Xác thực danh tính và ký chữ ký số hợp chuẩn theo Luật Giao dịch điện tử.
        </p>
      </div>

      {step === "done" ? (
        <Card className="shadow-md border-emerald-200 bg-white p-8 text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-4 border-emerald-100 shadow-xs">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Ký hợp đồng thành công!</h2>
            <p className="text-xs text-muted-foreground">
              Văn bản đã được đóng dấu thời gian (Timestamp) và chứng thư số của Công ty. Bản sao hợp đồng đã được gửi về email của bạn.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="outline" size="sm" className="text-xs w-full sm:w-auto">
              <Download className="h-3.5 w-3.5 mr-1.5" /> Tải bản PDF ký số
            </Button>
            <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white text-xs w-full sm:w-auto">
              <Link href="/dashboard">Về Trang chủ</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="shadow-2xs border-border">
          <CardHeader className="py-4 px-6 border-b border-border flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSignature className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                {step === "review" && "Bước 1/3: Rà soát điều khoản hợp đồng"}
                {step === "signature" && "Bước 2/3: Vẽ chữ ký điện tử"}
                {step === "otp" && "Bước 3/3: Xác thực OTP bảo mật"}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="font-mono text-2xs">HĐLĐ-2026/088</Badge>
          </CardHeader>

          <CardContent className="p-6 space-y-5 text-xs">
            {/* Step 1: Review Document Terms */}
            {step === "review" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 font-serif text-slate-800 leading-relaxed max-h-60 overflow-y-auto">
                  <p className="text-center font-bold text-sm uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                  <p className="text-center font-bold text-xs uppercase pb-2 border-b">HỢP ĐỒNG LAO ĐỘNG</p>
                  <p><strong>Bên A (Người sử dụng lao động):</strong> Công ty Cổ phần Công nghệ FSI</p>
                  <p><strong>Bên B (Người lao động):</strong> Phạm Minh Tuấn — CCCD số: 001294008123</p>
                  <p><strong>Điều 1:</strong> Thời hạn hợp đồng không xác định thời hạn kể từ ngày 01/10/2026.</p>
                  <p><strong>Điều 2:</strong> Chức danh chuyên môn: Senior Frontend Engineer.</p>
                  <p><strong>Điều 3:</strong> Mức lương chính: 38,000,000 VNĐ/tháng + các chế độ bảo hiểm theo luật.</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xs flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Tôi đã đọc kỹ và đồng ý với toàn bộ các điều khoản trong hợp đồng này.</span>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-10 font-bold"
                  onClick={() => setStep("signature")}
                >
                  Xác nhận & Tiến hành ký tên
                </Button>
              </div>
            )}

            {/* Step 2: Draw Signature */}
            {step === "signature" && (
              <div className="space-y-4">
                <SignaturePad
                  onSave={(data) => setSignatureData(data)}
                  onClear={() => setSignatureData(null)}
                />

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => setStep("review")} className="text-xs">
                    Quay lại
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white text-xs"
                    disabled={!signatureData}
                    onClick={() => setStep("otp")}
                  >
                    Tiếp tục sang bước OTP
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Enter OTP */}
            {step === "otp" && (
              <div className="space-y-5 text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Lock className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Nhập mã xác thực OTP</h4>
                  <p className="text-2xs text-muted-foreground">
                    Mã 6 chữ số đã được gửi tới số điện thoại <strong>0974***890</strong>
                  </p>
                </div>

                <OtpInput value={otp} onChange={setOtp} />

                <div className="pt-2 flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => setStep("signature")} className="text-xs">
                    Ký lại
                  </Button>
                  <Button
                    size="sm"
                    disabled={otp.length < 6 || loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-6 font-bold"
                    onClick={handleConfirmOtp}
                  >
                    {loading ? "Đang mã hóa chữ ký..." : "Xác thực & Ký hợp đồng"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  Briefcase,
  Mail,
  Phone,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";

export default function NewCandidateUploadPage() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    experienceYears: number;
    education: string;
    keySkills: string[];
    aiFitScore: number;
    aiSummary: string;
  } | null>(null);

  const handleSimulateUpload = () => {
    setFileUploaded(true);
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setParsedData({
        fullName: "Lê Minh Tuấn",
        email: "tuan.leminh@gmail.com",
        phone: "0982 123 456",
        experienceYears: 5,
        education: "Đại học Bách Khoa Hà Nội — Kỹ thuật Phần mềm (2016-2021)",
        keySkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Redux Toolkit", "GraphQL"],
        aiFitScore: 92,
        aiSummary:
          "Ứng viên có 5 năm kinh nghiệm chuyên sâu Frontend React/Next.js. Phù hợp 92% với tiêu chí vị trí Senior Frontend Engineer (REQ-2026-089).",
      });
      toast.success("Trích xuất thông tin CV bằng AI thành công (Độ chính xác 92%)");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Tiếp nhận Hồ sơ & Trích xuất AI
          </h1>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link
              href="/recruitment/openings"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Tuyển dụng
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Trích xuất CV (REC-13)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/recruitment/openings" className="btn-outline">
            Quay lại Pipeline
          </Link>
        </div>
      </div>

      {/* ── Split Layout: Upload Left, Extraction Result Right ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Upload Dropzone */}
        <div className="table-card p-6 space-y-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <UploadCloud className="h-4 w-4 text-primary" />
            Tải lên tài liệu CV / Résumé
          </h2>

          <div
            onClick={handleSimulateUpload}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              fileUploaded ? "border-accent bg-green-50/50" : "border-border hover:border-primary hover:bg-slate-50"
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
              <FileText className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {fileUploaded ? "CV_Le_Minh_Tuan_Senior_Frontend.pdf (1.8 MB)" : "Nhấp hoặc kéo thả file CV vào đây"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Định dạng hỗ trợ: PDF, DOCX (Tối đa 15MB)
            </p>
            {!fileUploaded && (
              <button type="button" className="btn-primary mt-4">
                Chọn tệp tin
              </button>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-4 border border-border space-y-2 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Công nghệ CYCLOSA AI OCR & NLP:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Tự động nhận diện Họ tên, Email, SĐT, Địa chỉ, Số năm kinh nghiệm</li>
              <li>Chấm điểm AI Match Score với Bản mô tả công việc (JD)</li>
              <li>Tự động phát hiện xung đột và chuẩn hóa kỹ năng</li>
            </ul>
          </div>
        </div>

        {/* Right: AI Extraction Preview */}
        <div className="table-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Kết quả trích xuất tự động
            </h2>
            {parsedData && (
              <span className="badge badge-active">
                AI Match: {parsedData.aiFitScore}%
              </span>
            )}
          </div>

          {analyzing ? (
            <div className="py-20 text-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
              <p className="text-sm font-medium text-foreground">
                AI đang quét và phân tích dữ liệu ứng viên...
              </p>
            </div>
          ) : parsedData ? (
            <div className="space-y-4 text-xs animate-fadeIn">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3.5">
                <p className="text-primary font-semibold">Tóm tắt đánh giá bởi AI:</p>
                <p className="text-foreground mt-1 leading-relaxed">
                  {parsedData.aiSummary}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-muted-foreground block">Họ và tên</label>
                  <input className="input mt-1" defaultValue={parsedData.fullName} />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block">Email</label>
                  <input className="input mt-1" defaultValue={parsedData.email} />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block">Số điện thoại</label>
                  <input className="input mt-1" defaultValue={parsedData.phone} />
                </div>
                <div>
                  <label className="font-medium text-muted-foreground block">Kinh nghiệm</label>
                  <input className="input mt-1" defaultValue={`${parsedData.experienceYears} năm`} />
                </div>
              </div>

              <div>
                <label className="font-medium text-muted-foreground block">Học vấn</label>
                <input className="input mt-1" defaultValue={parsedData.education} />
              </div>

              <div>
                <label className="font-medium text-muted-foreground block mb-1">
                  Kỹ năng phát hiện được
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {parsedData.keySkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-800"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    toast.success("Đã lưu ứng viên vào quy trình tuyển dụng");
                  }}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Xác nhận & Thêm vào Pipeline</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-xs text-muted-foreground">
              Vui lòng tải lên tài liệu CV ở khung bên trái để bắt đầu trích xuất
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

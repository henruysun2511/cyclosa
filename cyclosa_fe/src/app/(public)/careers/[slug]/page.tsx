"use client";

import React, { use, useState, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  X,
  ArrowLeft,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetPublicJobOpeningBySlugQuery,
  useApplyPublicJobOpeningMutation,
} from "@/features/recruitment";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function PublicJobOpeningLandingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: job, isLoading, isError } = useGetPublicJobOpeningBySlugQuery(slug);
  const [applyMutation, { isLoading: isSubmitting }] = useApplyPublicJobOpeningMutation();

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [aiConsent, setAiConsent] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    id?: string;
    code?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Kích thước tệp vượt quá 10MB. Vui lòng tải lên file nhỏ hơn.");
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      toast.error("Định dạng tệp không được hỗ trợ. Vui lòng chọn file PDF hoặc DOCX.");
      return;
    }

    setSelectedFile(file);
    toast.success(`Đã đính kèm tệp: ${file.name}`);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên của bạn");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại liên hệ");
      return;
    }

    if (!selectedFile) {
      toast.error("Vui lòng đính kèm tệp hồ sơ / CV (PDF hoặc DOCX)");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim().toLowerCase());
    formData.append("phone", phone.trim());
    formData.append("aiScreeningConsent", String(aiConsent));

    if (linkedinUrl.trim()) {
      formData.append("linkedinUrl", linkedinUrl.trim());
    }

    if (coverLetter.trim()) {
      formData.append("coverLetter", coverLetter.trim());
    }

    formData.append("cv", selectedFile);

    try {
      const res = await applyMutation({ slug, formData }).unwrap();
      setIsSubmittedSuccess(true);
      setApplicationResult({
        id: res.id,
        code: res.applicationCode || res.code,
      });
      toast.success("Nộp hồ sơ ứng tuyển thành công!");
    } catch (err: unknown) {
      const errorData = (err as { data?: { message?: string; code?: number } })?.data;
      if (errorData?.code === 1403 || errorData?.message?.includes("đã nộp")) {
        toast.error("Bạn đã nộp hồ sơ ứng tuyển vào vị trí này trước đó. Không thể nộp lại.");
      } else {
        toast.error(errorData?.message || "Không thể nộp hồ sơ ứng tuyển. Vui lòng thử lại sau.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground animate-pulse">
          Đang tải thông tin trang tuyển dụng...
        </p>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold text-foreground">Vị trí tuyển dụng không khả dụng</h2>
        <p className="text-xs text-muted-foreground">
          Vị trí này có thể đã hết hạn nhận hồ sơ, bị đóng hoặc đường dẫn không chính xác.
        </p>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link href="/careers">Xem các vị trí đang tuyển khác</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Top Banner Navigation */}
      <div className="bg-muted/30 border-b border-border py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs">
          <Link
            href="/careers"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Quay lại tất cả vị trí</span>
          </Link>

          <span className="text-[11px] font-mono text-muted-foreground">
            Mã vị trí: {job.landingSlug}
          </span>
        </div>
      </div>

      {/* Hero Header of Opening */}
      <section className="bg-linear-to-b from-primary/5 via-background to-background border-b border-border/50 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              {job.departmentName || "Khối Công nghệ & Vận hành"}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Đang mở tuyển dụng
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">
            {job.title}
          </h1>

          {/* Quick Specs */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground pt-2">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>Địa điểm: {job.workLocation || "Hà Nội"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-primary shrink-0" />
              <span>Hình thức: {job.employmentType === "FULL_TIME" ? "Toàn thời gian" : "Linh hoạt"}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Mức lương:{" "}
                {job.isSalaryNegotiable
                  ? "Thỏa thuận theo năng lực"
                  : `${formatCurrency(job.salaryBandMin)} - ${formatCurrency(job.salaryBandMax)}`}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span>
                Hạn nộp:{" "}
                {job.deadlineDate
                  ? new Date(job.deadlineDate).toLocaleDateString("vi-VN")
                  : "Ưu tiên nộp sớm"}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Layout: 2 Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Job Details & Perks (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Mô tả công việc */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bản mô tả trách nhiệm công việc (JD)
            </h2>
            <div className="text-xs text-foreground leading-relaxed whitespace-pre-line space-y-2">
              {job.description || "Chưa có mô tả chi tiết cho vị trí này."}
            </div>
          </div>

          {/* Yêu cầu năng lực */}
          {job.requirements && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Yêu cầu năng lực & Trình độ chuyên môn
              </h2>
              <div className="text-xs text-foreground leading-relaxed whitespace-pre-line space-y-2">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Quyền lợi và chế độ đãi ngộ */}
          {job.benefits && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-2xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Chế độ đãi ngộ & Phúc lợi tại CYCLOSA
              </h2>
              <div className="text-xs text-foreground leading-relaxed whitespace-pre-line space-y-2">
                {job.benefits}
              </div>
            </div>
          )}

          {/* Cam kết quy trình tuyển dụng thông minh */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-xs text-foreground">
                Quy trình ứng tuyển nhanh với AI Screening tại CYCLOSA
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              CYCLOSA áp dụng công nghệ AI tiên tiến giúp bóc tách và khớp nối hồ sơ của bạn với vị trí tuyển dụng trong vòng 24 giờ. 
              Các ứng viên tiềm năng sẽ nhận được phản hồi lịch phỏng vấn sớm nhất từ chuyên viên nhân sự.
            </p>
          </div>
        </div>

        {/* Right Column: Application Form or Success State (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
            {isSubmittedSuccess ? (
              /* Success Screen */
              <div className="py-6 text-center space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
                  <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Ứng tuyển thành công!</h3>
                  <p className="text-xs text-muted-foreground">
                    Hồ sơ ứng tuyển của bạn đã được chuyển đến Hội đồng tuyển dụng CYCLOSA.
                  </p>
                </div>

                {applicationResult?.code && (
                  <div className="p-3 bg-muted/40 rounded-xl border border-border font-mono text-xs">
                    <span className="text-muted-foreground block text-[10px]">Mã đơn ứng tuyển:</span>
                    <strong className="text-primary text-sm font-bold">{applicationResult.code}</strong>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-left text-xs text-muted-foreground space-y-1.5">
                  <p className="font-semibold text-foreground">Các bước tiếp theo:</p>
                  <p>1. Bộ phận tuyển dụng sẽ kiểm tra hồ sơ và kết quả sàng lọc sơ bộ.</p>
                  <p>2. Lịch phỏng vấn chi tiết sẽ được gửi trực tiếp qua email: <strong>{email}</strong>.</p>
                </div>

                <Button
                  asChild
                  className="w-full h-9 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link href="/careers">Xem các cơ hội nghề nghiệp khác</Link>
                </Button>
              </div>
            ) : (
              /* Online Application Form */
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="border-b border-border pb-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Send className="h-4 w-4 text-primary" />
                    <span>Nộp hồ sơ ứng tuyển trực tuyến</span>
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Điền thông tin và đính kèm CV để chuyên viên tuyển dụng xem xét hồ sơ của bạn.
                  </p>
                </div>

                {/* Họ tên */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Họ và tên của bạn <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="text"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">
                      Email liên hệ <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-foreground">
                      Số điện thoại <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      type="tel"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* LinkedIn or Portfolio */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    LinkedIn / Portfolio / GitHub (không bắt buộc)
                  </label>
                  <Input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Thư tự giới thiệu */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Thư tự giới thiệu (Cover Letter)
                  </label>
                  <Textarea
                    placeholder="Chia sẻ lý do bạn quan tâm đến vị trí này hoặc những thành tựu nổi bật..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="text-xs min-h-[72px] resize-none"
                  />
                </div>

                {/* Tải lên CV */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-foreground">
                    Tệp đính kèm CV (PDF, DOCX tối đa 10MB) <span className="text-destructive">*</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="p-3 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-medium text-foreground truncate">{selectedFile.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                          ({(selectedFile.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 rounded-xl p-4 text-center cursor-pointer transition-colors space-y-1.5"
                    >
                      <UploadCloud className="h-6 w-6 text-muted-foreground mx-auto" />
                      <p className="text-xs font-semibold text-foreground">
                        Nhấn để chọn hoặc kéo thả tệp CV tại đây
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Hỗ trợ định dạng PDF, DOCX dung lượng không quá 10MB
                      </p>
                    </div>
                  )}
                </div>

                {/* AI Screening Consent Checkbox (BA Requirement) */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={aiConsent}
                      onChange={(e) => setAiConsent(e.target.checked)}
                      className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-[11px] text-muted-foreground leading-snug">
                      Tôi đồng ý để hệ thống AI hỗ trợ phân tích và chấm điểm hồ sơ ứng tuyển 
                      theo chính sách bảo mật dữ liệu cá nhân của CYCLOSA.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-10 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-3.5 w-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                      <span>Đang tải tệp & gửi hồ sơ...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-3.5 w-3.5" />
                      <span>Nộp hồ sơ ứng tuyển ngay</span>
                    </div>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

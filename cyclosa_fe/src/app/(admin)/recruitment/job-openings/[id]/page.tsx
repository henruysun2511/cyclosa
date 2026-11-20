"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Kanban,
  Share2,
  Lock,
  Globe,
  Award,
  CheckCircle2,
  FileText,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useGetJobOpeningByIdQuery,
  usePublishJobOpeningMutation,
  useCloseJobOpeningMutation,
  useGetJobPostingsByJobOpeningQuery,
  usePublishJobPostingMutation,
  RecruitmentPageHeader,
  JobOpeningStatusBadge,
  JobPostingDialog,
  type PublishJobPostingPayload,
} from "@/features/recruitment";
import {
  EMPLOYMENT_TYPE_LABELS,
  WORKPLACE_TYPE_LABELS,
  INTERVIEW_ROUND_TYPE_LABELS,
} from "@/features/recruitment/constants/recruitment.constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JobOpeningDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<"overview" | "rounds" | "postings">("overview");
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const { data: opening, isLoading } = useGetJobOpeningByIdQuery(id);
  const { data: postings = [] } = useGetJobPostingsByJobOpeningQuery(id);

  const [publishOpening] = usePublishJobOpeningMutation();
  const [closeOpening] = useCloseJobOpeningMutation();
  const [publishPosting, { isLoading: isPublishing }] = usePublishJobPostingMutation();

  const getCareerUrl = () => {
    if (!opening?.landingSlug) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/careers/${opening.landingSlug}`;
  };

  const handleCopyCareerLink = async () => {
    const url = getCareerUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setHasCopied(true);
      toast.success("Đã sao chép link ứng tuyển công khai vào bộ nhớ tạm!");
      setTimeout(() => setHasCopied(false), 2500);
    } catch {
      toast.error("Không thể sao chép liên kết vào bộ nhớ tạm");
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải thông tin chi tiết vị trí tuyển dụng...
      </div>
    );
  }

  if (!opening) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">Không tìm thấy vị trí tuyển dụng này.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/recruitment/job-openings">Quay lại danh sách</Link>
        </Button>
      </div>
    );
  }

  const percent = Math.min(
    100,
    Math.round(((opening.hiredCount || 0) / (opening.totalNeeded || 1)) * 100)
  );

  const handlePublish = async () => {
    try {
      await publishOpening(id).unwrap();
      toast.success("Đã kích hoạt và mở đợt tuyển dụng thành công!");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể mở tuyển vị trí");
    }
  };

  const handleClose = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn đóng tuyển vị trí này?")) return;
    try {
      await closeOpening(id).unwrap();
      toast.success("Đã đóng vị trí tuyển dụng thành công.");
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể đóng tuyển vị trí");
    }
  };

  const handlePublishPosting = async (payload: PublishJobPostingPayload) => {
    try {
      await publishPosting(payload).unwrap();
      toast.success("Xuất bản tin đăng tuyển dụng thành công!");
      setIsPostingModalOpen(false);
    } catch (err: unknown) {
      toast.error((err as { data?: { message?: string } })?.data?.message || "Không thể xuất bản tin đăng");
    }
  };

  const formatCurrency = (val?: number) => {
    if (!val) return "Thỏa thuận";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <RecruitmentPageHeader
        title={opening.title}
        icon={Briefcase}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Vị trí tuyển dụng", href: "/recruitment/job-openings" },
          { label: opening.title || opening.code },
        ]}
        actions={
          <>
            {opening.landingSlug && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-8 text-xs border-primary/30 text-primary hover:bg-primary/5 gap-1.5"
              >
                <Link href={`/careers/${opening.landingSlug}`} target="_blank">
                  <Globe className="h-3.5 w-3.5" />
                  <span>Xem trang tuyển dụng</span>
                </Link>
              </Button>
            )}

            <Button asChild size="sm" className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href={`/recruitment/applications?jobOpeningId=${opening.id}`}>
                <Kanban className="h-3.5 w-3.5 mr-1.5" />
                <span>Bảng ATS Pipeline ({opening.applicantCount || 0})</span>
              </Link>
            </Button>

            {opening.status === "DRAFT" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handlePublish}
                className="h-8 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                <span>Mở tuyển vị trí</span>
              </Button>
            )}

            {opening.status === "OPEN" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPostingModalOpen(true)}
                className="h-8 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <Share2 className="h-3.5 w-3.5 mr-1.5" />
                <span>Đăng tin kênh ngoài</span>
              </Button>
            )}

            {opening.status === "OPEN" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                className="h-8 text-xs text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <Lock className="h-3.5 w-3.5 mr-1.5" />
                <span>Đóng vị trí</span>
              </Button>
            )}
          </>
        }
      />

      {/* Tabs Switcher */}
      <div className="flex border-b border-border gap-6 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Thông tin chi tiết & JD
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("rounds")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "rounds"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Vòng phỏng vấn & Tiêu chí</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-muted rounded-full">
            {opening.rounds?.length || 0}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("postings")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "postings"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Tin đăng tuyển dụng</span>
          <span className="font-mono text-[10px] px-1.5 py-0.2 bg-muted rounded-full">
            {postings.length}
          </span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* KPI Tiến độ */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Tiến độ hoàn thành chỉ tiêu tuyển mộ
                </span>
                <span className="font-mono text-xs font-bold text-primary">{percent}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-1 text-xs">
                <div className="p-2 bg-muted/30 rounded border border-border">
                  <span className="text-muted-foreground block text-[11px]">Chỉ tiêu cần tuyển</span>
                  <strong className="text-foreground text-sm font-mono">{opening.totalNeeded}</strong>
                </div>
                <div className="p-2 bg-muted/30 rounded border border-border">
                  <span className="text-muted-foreground block text-[11px]">Đã tiếp nhận</span>
                  <strong className="text-emerald-600 text-sm font-mono">{opening.hiredCount || 0}</strong>
                </div>
                <div className="p-2 bg-muted/30 rounded border border-border">
                  <span className="text-muted-foreground block text-[11px]">Hồ sơ ứng tuyển</span>
                  <strong className="text-blue-600 text-sm font-mono">{opening.applicantCount || 0}</strong>
                </div>
              </div>
            </div>

            {/* Mô tả công việc */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Bản mô tả trách nhiệm công việc
              </h3>
              <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                {opening.description}
              </p>
            </div>

            {/* Yêu cầu ứng viên */}
            {opening.requirements && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  Yêu cầu năng lực & Trình độ chuyên môn
                </h3>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {opening.requirements}
                </p>
              </div>
            )}

            {/* Quyền lợi */}
            {opening.benefits && (
              <div className="rounded-xl border border-border bg-card p-6 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Chế độ đãi ngộ & Phúc lợi
                </h3>
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-line">
                  {opening.benefits}
                </p>
              </div>
            )}
          </div>

          {/* Cột thông số hệ thống bên phải */}
          <div className="space-y-6">
            {/* Card Cổng tuyển dụng công khai (Career Landing Page) */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-2xs space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <h3 className="font-bold text-foreground">Trang tuyển dụng công khai</h3>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    opening.status === "OPEN"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {opening.status === "OPEN" ? "Đang mở công khai" : "Chưa kích hoạt"}
                </span>
              </div>

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Đường dẫn tĩnh dành riêng cho vị trí này để ứng viên nộp CV trực tuyến và chia sẻ lên mạng xã hội.
              </p>

              <div className="flex items-center gap-2 bg-background/80 border border-border rounded-lg p-2 font-mono text-[11px] text-foreground select-all overflow-x-auto">
                <span className="text-primary truncate">{getCareerUrl()}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyCareerLink}
                  className="h-8 text-xs bg-background hover:bg-muted gap-1.5"
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Đã sao chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Sao chép link</span>
                    </>
                  )}
                </Button>

                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-background hover:bg-muted gap-1.5"
                >
                  <Link href={`/careers/${opening.landingSlug}`} target="_blank">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Xem trang</span>
                  </Link>
                </Button>
              </div>

              <div className="p-2.5 rounded-lg bg-background/60 border border-border/60 text-[11px] text-muted-foreground">
                <p>
                  * AI sẽ tự động phân tích CV, tính điểm tương thích và chuyển ứng viên vào giai đoạn <strong>APPLIED</strong> trên bảng ATS.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-2xs space-y-4 text-xs">
              <h3 className="font-semibold text-foreground uppercase tracking-wider text-[11px] border-b border-border pb-2">
                Thông số vị trí tuyển dụng
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <JobOpeningStatusBadge status={opening.status} />
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Hình thức làm việc:</span>
                  <span className="font-medium text-foreground">
                    {EMPLOYMENT_TYPE_LABELS[opening.employmentType]}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Môi trường:</span>
                  <span className="font-medium text-foreground">
                    {WORKPLACE_TYPE_LABELS[opening.workplaceType]}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Khung dải lương:</span>
                  <span className="font-medium text-foreground font-mono">
                    {opening.isSalaryNegotiable
                      ? "Thỏa thuận"
                      : `${formatCurrency(opening.minSalary)} - ${formatCurrency(opening.maxSalary)}`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-muted-foreground">Hạn nộp hồ sơ:</span>
                  <span className="font-medium text-foreground">
                    {opening.deadline
                      ? new Date(opening.deadline).toLocaleDateString("vi-VN")
                      : "Không giới hạn"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Địa điểm làm việc:</span>
                  <span className="font-medium text-foreground text-right max-w-[170px] truncate">
                    {opening.location || "Hà Nội"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROUNDS & CRITERIA */}
      {activeTab === "rounds" && (
        <div className="space-y-4">
          {(!opening.rounds || opening.rounds.length === 0) ? (
            <div className="p-8 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground">
              Vị trí này chưa được cấu hình các vòng phỏng vấn chuyên sâu.
            </div>
          ) : (
            opening.rounds.map((round) => (
              <div key={round.id || round.roundNo} className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-xs font-bold">
                      {round.roundNo}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-foreground">{round.name}</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Loại vòng: {INTERVIEW_ROUND_TYPE_LABELS[round.roundType]} • Điểm đạt sàn:{" "}
                        <strong className="text-foreground font-mono">{round.passScore ?? 70}đ</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Tiêu chí chấm điểm độc lập:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(round.criteria || []).map((crit, cIdx) => (
                      <div key={cIdx} className="p-2.5 rounded-lg border border-border bg-muted/20 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-medium text-foreground">{crit.name}</p>
                          {crit.description && (
                            <p className="text-[11px] text-muted-foreground">{crit.description}</p>
                          )}
                        </div>
                        <span className="font-mono text-xs font-bold text-primary shrink-0 ml-2">
                          {crit.weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: POSTINGS */}
      {activeTab === "postings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Danh sách các tin tuyển dụng đã được xuất bản trên các sàn việc làm và mạng xã hội.
            </p>
            <Button
              size="sm"
              onClick={() => setIsPostingModalOpen(true)}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Đăng tin lên Kênh mới</span>
            </Button>
          </div>

          {postings.length === 0 ? (
            <div className="p-8 border border-dashed border-border rounded-xl text-center text-xs text-muted-foreground">
              Chưa có tin tuyển dụng nào được đăng lên kênh đối tác ngoài.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {postings.map((p) => (
                <div key={p.id} className="rounded-xl border border-border bg-card p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">{p.channelName || "Kênh việc làm"}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {p.status}
                    </span>
                  </div>
                  {p.postingUrl && (
                    <a
                      href={p.postingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 line-clamp-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>{p.postingUrl}</span>
                    </a>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Ngày đăng: {p.postedAt ? new Date(p.postedAt).toLocaleDateString("vi-VN") : "-"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post to Channel Dialog */}
      <JobPostingDialog
        open={isPostingModalOpen}
        onOpenChange={setIsPostingModalOpen}
        jobOpening={opening}
        onSubmit={handlePublishPosting}
        isLoading={isPublishing}
      />
    </div>
  );
}

"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  Users,
  Video,
  MapPin,
  Clock,
  Lock,
  Sparkles,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetInterviewByIdQuery,
  RecruitmentPageHeader,
  AiStarQuestionsModal,
} from "@/features/recruitment";
import {
  INTERVIEW_FORMAT_LABELS,
  INTERVIEW_ROUND_TYPE_LABELS,
  INTERVIEW_STATUS_BADGES,
} from "@/features/recruitment/constants/recruitment.constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function InterviewDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: interview, isLoading } = useGetInterviewByIdQuery(id);
  const [isStarModalOpen, setIsStarModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground animate-pulse">
        Đang tải thông tin buổi phỏng vấn...
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="p-12 text-center space-y-3">
        <p className="text-sm text-destructive font-medium">Không tìm thấy buổi phỏng vấn này.</p>
        <Button asChild variant="outline" size="sm">
          <Link href="/recruitment/interviews">Quay lại Lịch</Link>
        </Button>
      </div>
    );
  }

  const statusBadge = INTERVIEW_STATUS_BADGES[interview.status] || {
    label: interview.status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6 pb-16">
      <RecruitmentPageHeader
        title={`Buổi phỏng vấn: ${interview.candidateName}`}
        icon={Calendar}
        breadcrumbs={[
          { label: "Tuyển dụng", href: "/recruitment/job-openings" },
          { label: "Lịch phỏng vấn", href: "/recruitment/interviews" },
          { label: interview.code },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsStarModalOpen(true)}
              className="h-8 text-xs gap-1.5 text-primary border-primary/20 hover:bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Gợi ý câu hỏi STAR (AI)</span>
            </Button>

            <Button asChild size="sm" className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white font-medium">
              <Link href={`/recruitment/interviews/${interview.id}/scorecard`}>
                <Lock className="h-3.5 w-3.5 mr-1" />
                <span>Chấm điểm Blind Grading</span>
              </Link>
            </Button>
          </div>
        }
      />

      {/* Thông tin buổi phỏng vấn */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Ứng viên tham gia:</span>
            <h2 className="text-lg font-bold text-foreground">{interview.candidateName}</h2>
            <p className="text-xs text-muted-foreground">{interview.candidateEmail}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground block mb-1">Trạng thái:</span>
            <Badge variant="outline" className={`text-xs font-semibold ${statusBadge.className}`}>
              {statusBadge.label}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
            <span className="text-muted-foreground font-medium block">Thông tin Lịch trình</span>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                {interview.scheduledStartTime
                  ? new Date(interview.scheduledStartTime).toLocaleString("vi-VN")
                  : "09:00 - 08/10/2026"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Vòng phỏng vấn:{" "}
              <strong className="text-foreground">
                {interview.roundName || (interview.roundType ? INTERVIEW_ROUND_TYPE_LABELS[interview.roundType] : "Chuyên môn")}
              </strong>
            </p>
          </div>

          <div className="p-3.5 bg-muted/30 rounded-xl border border-border space-y-2">
            <span className="text-muted-foreground font-medium block">Hình thức & Địa điểm</span>
            <div className="flex items-center gap-2 text-foreground font-semibold">
              {interview.interviewFormat === "ONLINE" ? (
                <Video className="h-4 w-4 text-blue-600" />
              ) : (
                <MapPin className="h-4 w-4 text-amber-600" />
              )}
              <span>{INTERVIEW_FORMAT_LABELS[interview.interviewFormat]}</span>
            </div>
            {interview.meetingLink && (
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary hover:underline line-clamp-1"
              >
                {interview.meetingLink}
              </a>
            )}
            {interview.location && (
              <p className="text-[11px] text-muted-foreground">{interview.location}</p>
            )}
          </div>
        </div>

        {/* Danh sách Hội đồng giám khảo (Panelists) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Hội đồng Giám khảo Phỏng vấn ({interview.panelists?.length || 0} thành viên)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(interview.panelists && interview.panelists.length > 0) ? (
              interview.panelists.map((panelist, idx) => (
                <div
                  key={panelist.id || idx}
                  className="p-3 rounded-lg border border-border bg-card flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      {panelist.employeeName || "Giám khảo chuyên môn"}
                      {panelist.isLeadInterviewer && (
                        <Badge variant="secondary" className="text-[10px] px-1 py-0">
                          Lead
                        </Badge>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{panelist.employeeEmail}</span>
                  </div>

                  <span
                    className={`text-[11px] font-medium font-mono px-2 py-0.5 rounded-full ${
                      panelist.hasSubmittedScorecard
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {panelist.hasSubmittedScorecard ? "Đã nộp điểm" : "Chưa nộp"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">Chưa có thông tin hội đồng giám khảo.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI STAR Modal */}
      <AiStarQuestionsModal
        open={isStarModalOpen}
        onOpenChange={setIsStarModalOpen}
        roundId={interview.roundId || "round_01"}
        jobTitle={interview.jobOpeningTitle}
      />
    </div>
  );
}


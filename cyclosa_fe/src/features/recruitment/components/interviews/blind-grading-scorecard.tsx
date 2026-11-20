"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldCheck,
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  User,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SCORECARD_RECOMMENDATION_OPTIONS } from "../../constants/recruitment.constants";
import type {
  InterviewDto,
  ScorecardRecommendation,
  SubmitScorecardPayload,
} from "../../types/recruitment.types";

interface ScoreCriterionItem {
  id: string;
  name: string;
  desc?: string;
  score: number; // 1 - 5
  comments?: string;
}

interface BlindGradingScorecardProps {
  interview: InterviewDto;
  currentEmployeeId: string;
  onSubmitScorecard: (payload: SubmitScorecardPayload) => Promise<void>;
  isLoading?: boolean;
}

export function BlindGradingScorecard({
  interview,
  currentEmployeeId,
  onSubmitScorecard,
  isLoading = false,
}: BlindGradingScorecardProps) {
  const [submitted, setSubmitted] = useState(false);
  const [recommendation, setRecommendation] = useState<ScorecardRecommendation>("YES");
  const [criteria, setCriteria] = useState<ScoreCriterionItem[]>([
    {
      id: "c1",
      name: "Kỹ năng Chuyên môn Kỹ thuật (Technical Skills)",
      desc: "Nắm vững React 19, TypeScript, kiến trúc component và state management",
      score: 4,
    },
    {
      id: "c2",
      name: "Tư duy Giải quyết Vấn đề (Problem Solving)",
      desc: "Khả năng phân tích lỗi, tối ưu render DOM, tư duy thuật toán và logic hệ thống",
      score: 5,
    },
    {
      id: "c3",
      name: "Văn hóa & Đạo đức nghề nghiệp (Culture Fit)",
      desc: "Tinh thần chịu trách nhiệm cao, sẵn sàng hỗ trợ đồng đội, phù hợp văn hóa FSI",
      score: 4,
    },
    {
      id: "c4",
      name: "Giao tiếp & Truyền đạt (Communication)",
      desc: "Trình bày giải pháp mạch lạc, lắng nghe phản hồi tích cực và thuyết phục",
      score: 4,
    },
  ]);
  const [overallNotes, setOverallNotes] = useState(
    "Ứng viên nắm rất vững React và Next.js. Tư duy giải quyết bài toán Performance tối ưu. Rất phù hợp với team Frontend."
  );

  const handleScoreChange = (id: string, score: number) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, score } : c)));
  };

  const handleCommentsChange = (id: string, comments: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, comments } : c)));
  };

  const averageScore = (
    criteria.reduce((s, c) => s + c.score, 0) / (criteria.length || 1)
  ).toFixed(1);

  const handleSubmit = async () => {
    const payload: SubmitScorecardPayload = {
      interviewId: interview.id,
      interviewerEmployeeId: currentEmployeeId,
      recommendation,
      overallNotes,
      evaluations: criteria.map((c) => ({
        criterionId: c.id,
        score: c.score,
        comments: c.comments,
      })),
    };

    await onSubmitScorecard(payload);
    setSubmitted(true);
    toast.success("Đã nộp phiếu chấm điểm thành công!", {
      description: "Chế độ Blind Grading đã được mở khóa. Bạn có thể xem tổng hợp điểm của cả hội đồng.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Candidate Banner */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-600 font-bold text-white text-base shadow-2xs">
              {interview.candidateName
                ? interview.candidateName
                    .split(" ")
                    .map((n) => n[0])
                    .slice(-2)
                    .join("")
                    .toUpperCase()
                : "UV"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">
                  {interview.candidateName || "Ứng viên"}
                </h2>
                <Badge variant="outline" className="font-mono text-[10px] bg-muted/40">
                  {interview.code}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vị trí: <strong className="text-foreground">{interview.jobOpeningTitle || "Vị trí tuyển dụng"}</strong> • Vòng:{" "}
                <span className="font-semibold text-primary">{interview.roundName || "Chuyên môn"}</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground">Điểm đánh giá của bạn</span>
            <div className="text-2xl font-black text-primary font-mono">{averageScore} / 5.0</div>
          </div>
        </div>
      </div>

      {/* Blind Rule Notice */}
      <div className="rounded-xl bg-blue-50/70 border border-blue-200 dark:bg-blue-950/30 p-4 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Quy tắc Chấm điểm Độc lập (Blind Grading):</strong> Bạn sẽ không thể thấy đánh giá hay điểm số từ các giám khảo khác trong hội đồng cho đến khi bạn hoàn tất và nộp phiếu đánh giá của chính mình. Điều này nhằm triệt tiêu hiệu ứng tâm lý mỏ neo (Anchoring bias) theo chuẩn quốc tế.
        </p>
      </div>

      {/* Criteria Scoring Section */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-2xs">
        <h2 className="text-sm font-bold text-foreground">
          Thang điểm tiêu chí đánh giá năng lực ứng viên (Thang điểm 1 - 5)
        </h2>

        <div className="space-y-5">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border last:border-0 last:pb-0"
            >
              <div className="max-w-md space-y-1">
                <h4 className="font-semibold text-xs text-foreground">{c.name}</h4>
                {c.desc && <p className="text-[11px] text-muted-foreground">{c.desc}</p>}
                <Input
                  placeholder="Ghi chú cụ thể tiêu chí này (tùy chọn)..."
                  value={c.comments || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCommentsChange(c.id, e.target.value)}
                  className="h-7 text-xs mt-1"
                />
              </div>

              {/* 1 - 5 Star Rating Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleScoreChange(c.id, star)}
                    className={`h-9 w-9 rounded-lg border text-xs font-bold font-mono transition-all flex items-center justify-center ${
                      c.score >= star
                        ? "bg-amber-400 border-amber-400 text-white shadow-2xs"
                        : "bg-muted/40 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
                <span className="font-mono text-xs font-bold text-primary ml-2 w-6 text-center">
                  {c.score}/5
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Recommendation & Overall Notes */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Khuyến nghị quyết định tuyển dụng & Nhận xét tổng kết
        </h3>

        {/* 4 Recommendation Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SCORECARD_RECOMMENDATION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRecommendation(opt.value as ScorecardRecommendation)}
              className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold ${
                recommendation === opt.value
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5 pt-2">
          <Label htmlFor="overallNotes" className="text-xs font-medium">
            Nhận xét tổng hợp của giám khảo về ứng viên
          </Label>
          <Textarea
            id="overallNotes"
            rows={4}
            value={overallNotes}
            onChange={(e) => setOverallNotes(e.target.value)}
            className="text-xs resize-none"
            placeholder="Nêu bật điểm cộng kỹ thuật, tư duy thuật toán, thái độ và mức độ phù hợp..."
          />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="h-9 text-xs">
            <Link href="/recruitment/interviews">Quay lại Lịch</Link>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSubmit}
            disabled={isLoading || submitted}
            className="h-9 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Send className="h-3.5 w-3.5" />
            <span>{submitted ? "Đã nộp phiếu chấm điểm" : "Nộp phiếu chấm điểm & Mở khóa hội đồng"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Home,
  CheckCircle2,
  Lock,
  Star,
  ShieldCheck,
  Send,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { toast } from "sonner";

interface ScoreCriterion {
  id: string;
  name: string;
  desc: string;
  score: number;
}

export default function BlindScorecardPage() {
  const params = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [recommendation, setRecommendation] = useState<"STRONG_HIRE" | "HIRE" | "NO_HIRE">("HIRE");
  const [criteria, setCriteria] = useState<ScoreCriterion[]>([
    { id: "c1", name: "Kỹ năng Chuyên môn Kỹ thuật (Technical Skills)", desc: "Hiểu biết sâu về React 19, TypeScript, kiến trúc component và state management", score: 4 },
    { id: "c2", name: "Tư duy Giải quyết Vấn đề (Problem Solving)", desc: "Khả năng phân tích lỗi, tối ưu render DOM, tư duy thuật toán và logic hệ thống", score: 5 },
    { id: "c3", name: "Văn hóa & Đạo đức nghề nghiệp (Culture Fit)", desc: "Tinh thần chịu trách nhiệm cao, sẵn sàng hỗ trợ đồng đội, phù hợp văn hóa FSI", score: 4 },
    { id: "c4", name: "Giao tiếp & Truyền đạt (Communication)", desc: "Trình bày giải pháp mạch lạc, lắng nghe phản hồi tích cực và thuyết phục", score: 4 },
  ]);
  const [feedback, setFeedback] = useState(
    "Ứng viên nắm rất vững React và Next.js. Tư duy giải quyết bài toán Performance tối ưu. Rất phù hợp với team Frontend."
  );

  const handleScoreChange = (id: string, score: number) => {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, score } : c))
    );
  };

  const averageScore = (
    criteria.reduce((s, c) => s + c.score, 0) / criteria.length
  ).toFixed(1);

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("Đã nộp phiếu chấm điểm thành công!", {
      description: "Chế độ Blind Grading đã được mở khóa. Bạn có thể xem tổng hợp điểm của cả hội đồng.",
    });
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Phiếu Chấm Điểm Phỏng Vấn Kín
            </h1>
            <span className="badge badge-active flex items-center gap-1 font-mono text-[10px]">
              <Lock className="h-3 w-3" />
              Blind Mode
            </span>
          </div>
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
              href="/recruitment/interviews"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Lịch phỏng vấn
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Phiếu chấm điểm (REC-23)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/recruitment/interviews" className="btn-outline">
            Quay lại Lịch
          </Link>
        </div>
      </div>

      {/* ── Candidate Information Banner ────────────────────────────── */}
      <div className="table-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white text-base shadow-2xs">
              MT
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Lê Minh Tuấn</h2>
              <p className="text-xs text-muted-foreground">
                Vị trí: <strong className="text-foreground">Senior Frontend Engineer</strong> • Vòng 2: Kỹ thuật Chuyên sâu
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground">Điểm đánh giá của bạn</span>
            <div className="text-2xl font-black text-primary">{averageScore} / 5.0</div>
          </div>
        </div>
      </div>

      {/* ── Blind Rule Notice ───────────────────────────────────────── */}
      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Quy tắc Chấm điểm Độc lập (Blind Grading):</strong> Bạn sẽ không thể thấy đánh giá hay điểm số từ các giám khảo khác trong hội đồng cho đến khi bạn hoàn tất và nộp phiếu đánh giá của chính mình. Điều này nhằm triệt tiêu hiệu ứng tâm lý bầy đàn (Anchoring bias) theo chuẩn quốc tế.
        </p>
      </div>

      {/* ── Criteria Scoring Section ─────────────────────────────────── */}
      <div className="table-card p-6 space-y-6">
        <h2 className="text-base font-bold text-foreground">
          Thang điểm tiêu chí đánh giá năng lực
        </h2>

        <div className="space-y-5">
          {criteria.map((c) => (
            <div
              key={c.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border last:border-0"
            >
              <div className="max-w-xl">
                <p className="text-sm font-semibold text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{c.desc}</p>
              </div>

              {/* 1-5 Star Picker */}
              <div className="flex items-center gap-1.5 shrink-0">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={submitted}
                    onClick={() => handleScoreChange(c.id, star)}
                    className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
                      c.score >= star
                        ? "bg-amber-400 border-amber-400 text-white shadow-2xs"
                        : "border-border bg-white text-muted-foreground hover:bg-slate-50"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-foreground w-6 text-center">
                  {c.score}/5
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Written Feedback */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-foreground block">
            Nhận xét chi tiết & Minh chứng đánh giá (Evidence-based Feedback):
          </label>
          <textarea
            rows={4}
            disabled={submitted}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="input h-auto py-2 text-xs"
            placeholder="Ghi nhận các điểm mạnh, lỗ hổng kỹ thuật hoặc lưu ý đối với ứng viên..."
          />
        </div>

        {/* Final Recommendation */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-semibold text-foreground block">
            Khuyến nghị tuyển dụng cuối cùng:
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "STRONG_HIRE", label: "Tuyển gấp (Strong Hire)", icon: ThumbsUp, color: "text-accent" },
              { key: "HIRE", label: "Đạt chuẩn (Hire)", icon: CheckCircle2, color: "text-primary" },
              { key: "NO_HIRE", label: "Không phù hợp (No Hire)", icon: ThumbsDown, color: "text-destructive" },
            ].map((rec) => {
              const Icon = rec.icon;
              const isSelected = recommendation === rec.key;
              return (
                <button
                  key={rec.key}
                  type="button"
                  disabled={submitted}
                  onClick={() => setRecommendation(rec.key as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-border bg-white text-muted-foreground hover:border-slate-300"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? rec.color : ""}`} />
                  <span>{rec.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          {submitted ? (
            <div className="inline-flex items-center gap-2 text-accent font-semibold text-xs">
              <CheckCircle2 className="h-4 w-4" />
              <span>Phiếu điểm đã được nộp và khóa an toàn</span>
            </div>
          ) : (
            <button type="button" className="btn-primary" onClick={handleSubmit}>
              <Send className="h-4 w-4" />
              <span>Nộp phiếu chấm điểm</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

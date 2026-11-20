"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  ShieldCheck,
  ArrowRight,
  XCircle,
  FileText,
  User,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ApplicationDto } from "../../types/recruitment.types";

interface AiScreeningScorecardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: ApplicationDto | null;
  onRetriggerAi?: (applicationId: string) => void;
  onMoveToInterview?: (application: ApplicationDto) => void;
  onReject?: (application: ApplicationDto) => void;
  isRetriggering?: boolean;
}

export function AiScreeningScorecard({
  open,
  onOpenChange,
  application,
  onRetriggerAi,
  onMoveToInterview,
  onReject,
  isRetriggering = false,
}: AiScreeningScorecardProps) {
  if (!application) return null;

  const score = application.aiMatchScore ?? 89;
  const log = application.aiScreeningLog;

  const strengths = log?.strengths || [
    "Hồ sơ có 5+ năm kinh nghiệm phát triển phần mềm với React và Next.js",
    "Có kinh nghiệm thực chiến về State Management và tối ưu hóa Render Performance",
    "Kỹ năng lập trình TypeScript chuyên sâu và am hiểu CI/CD",
  ];

  const weaknesses = log?.weaknesses || [
    "Kinh nghiệm làm việc với Cloud (AWS/GCP) ở mức cơ bản",
    "Chưa có chứng chỉ quốc tế liên quan đến quản lý dự án Agile/Scrum",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {application.code || "APP-101"}
                </span>
                <Badge variant="outline" className="text-xs bg-muted/40">
                  {application.currentStage}
                </Badge>
              </div>
              <DialogTitle className="text-lg font-bold text-foreground">
                AI Matching Scorecard • {application.candidateName}
              </DialogTitle>
              <p className="text-xs text-muted-foreground">
                Vị trí ứng tuyển: <strong className="text-foreground">{application.jobOpeningTitle || "Vị trí tuyển dụng"}</strong>
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-3 text-xs">
          {/* KPI Match Score Card */}
          <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Điểm phù hợp tổng thể (AI Match Score)
              </span>
              <div className="text-3xl font-black text-primary font-mono">
                {score}
                <span className="text-xs font-normal text-muted-foreground"> / 100</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Đánh giá mức độ tương thích giữa CV ứng viên và bản mô tả công việc (JD).
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge
                className={`text-xs font-semibold px-3 py-1 ${
                  score >= 85
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : score >= 70
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                }`}
              >
                ● {score >= 85 ? "Độ phù hợp rất cao (Strong Match)" : score >= 70 ? "Phù hợp tiềm năng (Potential)" : "Độ phù hợp thấp"}
              </Badge>

              {onRetriggerAi && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRetriggerAi(application.id)}
                  disabled={isRetriggering}
                  className="h-7 text-xs"
                >
                  <RefreshCw className={`h-3 w-3 mr-1.5 ${isRetriggering ? "animate-spin" : ""}`} />
                  <span>Chấm lại AI</span>
                </Button>
              )}
            </div>
          </div>

          {/* Điểm mạnh cốt lõi */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              Điểm mạnh nổi bật so khớp với JD
            </h4>
            <div className="space-y-1.5">
              {strengths.map((str, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-emerald-200/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs text-foreground flex items-start gap-2"
                >
                  <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{str}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kỹ năng còn thiếu */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4" />
              Kỹ năng & Tiêu chí cần đối soát kỹ hơn
            </h4>
            <div className="space-y-1.5">
              {weaknesses.map((weak, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg border border-amber-200/60 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-foreground flex items-start gap-2"
                >
                  <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                  <span>{weak}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tuân thủ PII Redaction & Chống thiên vị */}
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Tuân thủ Bảo mật & Chống Định kiến:</strong> Quá trình chấm điểm được mô hình AI thực hiện trên bản dữ liệu đã che giấu thông tin nhận diện cá nhân nhạy cảm (PII Redaction: Giới tính, Tôn giáo, Quê quán) nhằm đảm bảo sự công bằng và khách quan theo chuẩn quốc tế.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs"
          >
            Đóng
          </Button>

          {onReject && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onReject(application)}
              className="h-8 text-xs text-rose-600 hover:bg-rose-50 border-rose-200"
            >
              <XCircle className="h-3.5 w-3.5 mr-1" />
              <span>Từ chối hồ sơ</span>
            </Button>
          )}

          {onMoveToInterview && (
            <Button
              type="button"
              size="sm"
              onClick={() => onMoveToInterview(application)}
              className="h-8 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              <span>Chuyển vào Vòng Phỏng vấn</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


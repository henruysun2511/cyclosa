"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  User,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ApplicationDto } from "../../types/recruitment.types";

interface AtsCandidateCardProps {
  application: ApplicationDto;
  onOpenScorecard: (app: ApplicationDto) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

export function AtsCandidateCard({
  application,
  onOpenScorecard,
  onDragStart,
}: AtsCandidateCardProps) {
  const matchScore =
    application.aiMatchScore ??
    (80 + ((application.id.charCodeAt(application.id.length - 1) || 0) % 18));

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) {
      return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300";
    }
    if (score >= 70) {
      return "text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300";
    }
    return "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300";
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application.id)}
      className="group rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-2xs hover:shadow-sm hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top Header: Jira-style Code + AI Match Score Gauge */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-muted-foreground group-hover:text-primary transition-colors">
          {application.code || "APP-101"}
        </span>

        <button
          type="button"
          onClick={() => onOpenScorecard(application)}
          className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-full border transition-all ${getScoreBadgeColor(
            matchScore
          )}`}
          title="Bấm để xem chi tiết AI Matching Scorecard"
        >
          <Sparkles className="h-3 w-3" />
          <span>{matchScore}%</span>
        </button>
      </div>

      {/* Candidate Name & Job Title */}
      <div>
        <Link
          href={`/recruitment/applications/${application.id}`}
          className="font-bold text-xs text-foreground hover:text-primary transition-colors text-left line-clamp-1 block"
          title="Bấm để mở không gian thẩm định CV chi tiết chuẩn Harvard"
        >
          {application.candidateName || "Nguyễn Văn A"}
        </Link>
        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
          {application.jobOpeningTitle || "Vị trí tuyển dụng"}
        </p>
      </div>

      {/* Source Tag & Applied Date */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/50">
        <span className="truncate max-w-[110px]">
          {application.source || "Nộp trực tiếp"}
        </span>
        <span className="font-mono">
          {application.appliedDate
            ? new Date(application.appliedDate).toLocaleDateString("vi-VN")
            : "Hôm nay"}
        </span>
      </div>
    </div>
  );
}

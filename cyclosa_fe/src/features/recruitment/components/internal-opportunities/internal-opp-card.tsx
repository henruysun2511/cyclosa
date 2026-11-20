"use client";

import React from "react";
import { Sparkles, Building2, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INTERNAL_OPPORTUNITY_TYPE_LABELS } from "../../constants/recruitment.constants";
import type { InternalOpportunityDto } from "../../types/recruitment.types";

interface InternalOppCardProps {
  opportunity: InternalOpportunityDto;
  onApply: (opp: InternalOpportunityDto) => void;
  onViewApplications?: (opp: InternalOpportunityDto) => void;
  canManage?: boolean;
}

export function InternalOppCard({
  opportunity,
  onApply,
  onViewApplications,
  canManage = false,
}: InternalOppCardProps) {
  const typeLabel =
    INTERNAL_OPPORTUNITY_TYPE_LABELS[opportunity.opportunityType] || opportunity.opportunityType;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-2xs hover:shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header: Type Badge & Code */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-[11px] font-semibold bg-primary/5 text-primary border-primary/20"
          >
            ● {typeLabel}
          </Badge>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {opportunity.code}
          </span>
        </div>

        {/* Title & Department */}
        <div>
          <h3 className="font-bold text-sm text-foreground line-clamp-1">
            {opportunity.jobOpeningTitle || "Vị trí tuyển dụng nội bộ"}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Building2 className="h-3 w-3" />
            <span>{opportunity.departmentName || "Phòng ban nội bộ"}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
          {opportunity.description ||
            "Cơ hội thuyên chuyển và thăng tiến dành riêng cho nhân sự nội bộ FSI. Phát triển lộ trình nghề nghiệp đa nhiệm."}
        </p>

        {/* Meta: Deadline & Count */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Hạn nộp:{" "}
              {opportunity.applicationDeadline
                ? new Date(opportunity.applicationDeadline).toLocaleDateString("vi-VN")
                : "Không giới hạn"}
            </span>
          </span>

          <span className="flex items-center gap-1 font-mono font-semibold text-primary">
            <Users className="h-3 w-3" />
            <span>{opportunity.applicantCount || 0} ứng tuyển</span>
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 flex items-center justify-between gap-2 border-t border-border/50">
        {canManage && onViewApplications && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewApplications(opportunity)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Xem danh sách ({opportunity.applicantCount || 0})
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          onClick={() => onApply(opportunity)}
          className="h-8 text-xs gap-1.5 ml-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
        >
          <span>Ứng tuyển nội bộ</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}


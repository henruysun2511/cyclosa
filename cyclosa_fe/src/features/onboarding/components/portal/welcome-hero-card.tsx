"use client";

import React from "react";
import { Sparkles, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { OnboardingProcessDto } from "../../types/onboarding.types";

interface WelcomeHeroCardProps {
  process: OnboardingProcessDto;
}

export function WelcomeHeroCard({ process }: WelcomeHeroCardProps) {
  const percent = process.progressPercentage || 0;

  return (
    <Card className="border-border bg-gradient-to-r from-primary/10 via-background to-background shadow-xs rounded-2xl overflow-hidden relative">
      <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-primary text-primary-foreground text-xs px-2.5 py-0.5 font-semibold gap-1">
              <Sparkles className="h-3 w-3" />
              Lộ trình Hội nhập 60 Ngày
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              Mã: {process.code}
            </Badge>
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Chào mừng {process.employeeName} gia nhập CYCLOSA!
          </h2>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Chúng tôi vô cùng hào hứng khi được đồng hành cùng bạn trên chặng đường phát triển mới.
            Hãy hoàn thành các mốc công việc dưới đây để chuẩn bị sẵn sàng cho sự nghiệp thành công tại doanh nghiệp.
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground pt-1 flex-wrap">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Bắt đầu: {process.startDate}
            </span>
            <span>•</span>
            <span>Kết thúc thử việc: {process.probationEndDate}</span>
          </div>
        </div>

        {/* Vòng tròn tiến độ */}
        <div className="flex items-center gap-5 shrink-0 bg-card p-4 rounded-xl border border-border shadow-2xs">
          <div className="text-center space-y-1">
            <div className="text-3xl font-bold font-mono text-primary">
              {percent}%
            </div>
            <span className="text-[11px] text-muted-foreground block">
              Tiến độ hoàn thành
            </span>
          </div>

          <div className="h-10 w-[1px] bg-border" />

          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>Đã xong:</span>
              <strong className="font-mono text-foreground">
                {process.completedTasks}/{process.totalTasks} việc
              </strong>
            </div>
            <div className="flex justify-between gap-3 text-muted-foreground">
              <span>Bắt buộc còn lại:</span>
              <strong className="font-mono text-amber-600">
                {process.mandatoryUnfinishedTasks} việc
              </strong>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


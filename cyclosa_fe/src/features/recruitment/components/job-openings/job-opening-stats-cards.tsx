"use client";

import React from "react";
import { Briefcase, CheckCircle2, Clock, PauseCircle } from "lucide-react";
import { RecruitmentKpiCards } from "../shared/recruitment-kpi-cards";
import type { JobOpeningDto } from "../../types/recruitment.types";
import type { KpiCardItem } from "@/components/shared/kpi-metric-cards";

interface JobOpeningStatsCardsProps {
  openings: JobOpeningDto[];
  totalFromPagination?: number;
}

export function JobOpeningStatsCards({
  openings,
  totalFromPagination,
}: JobOpeningStatsCardsProps) {
  const total = totalFromPagination ?? openings.length;
  const openCount = openings.filter((o) => o.status === "OPEN").length;
  const closedCount = openings.filter((o) => o.status === "CLOSED").length;
  const onHoldCount = openings.filter((o) => o.status === "ON_HOLD" || o.status === "DRAFT").length;

  const cards: KpiCardItem[] = [
    {
      title: "Tổng số vị trí",
      value: String(total),
      subtext: "Các vị trí tuyển dụng trong toàn công ty",
      icon: Briefcase,
      iconBg: "bg-primary text-primary-foreground",
      chartColor: "#DC2626",
      chartType: "curve-red",
    },
    {
      title: "Đang mở tuyển",
      value: String(openCount),
      subtext: "Đang tiếp nhận hồ sơ & ứng tuyển",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      chartColor: "#10B981",
      chartType: "curve-green",
    },
    {
      title: "Đã tuyển đủ / Đóng",
      value: String(closedCount),
      subtext: "Đã hoàn thành chỉ tiêu nhân sự",
      icon: Clock,
      iconBg: "bg-blue-600 text-white",
      chartColor: "#2563EB",
      chartType: "curve-blue",
    },
    {
      title: "Bản nháp & Tạm dừng",
      value: String(onHoldCount),
      subtext: "Chưa công bố hoặc đang bảo lưu",
      icon: PauseCircle,
      iconBg: "bg-amber-500 text-white",
      chartColor: "#F59E0B",
      chartType: "curve-amber",
    },
  ];

  return <RecruitmentKpiCards cards={cards} />;
}


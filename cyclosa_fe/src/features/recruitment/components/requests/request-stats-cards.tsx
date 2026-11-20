"use client";

import React from "react";
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { RecruitmentKpiCards } from "../shared/recruitment-kpi-cards";
import type { RecruitmentRequestDto } from "../../types/recruitment.types";
import type { KpiCardItem } from "@/components/shared/kpi-metric-cards";

interface RequestStatsCardsProps {
  requests: RecruitmentRequestDto[];
  totalFromPagination?: number;
}

export function RequestStatsCards({
  requests,
  totalFromPagination,
}: RequestStatsCardsProps) {
  const total = totalFromPagination ?? requests.length;
  const pendingCount = requests.filter((r) => r.status === "PENDING_APPROVAL").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter(
    (r) => r.status === "REJECTED" || r.status === "CANCELLED"
  ).length;

  const cards: KpiCardItem[] = [
    {
      title: "Tổng số đề xuất",
      value: String(total),
      subtext: "Toàn bộ đề xuất tuyển dụng nhân sự",
      icon: FileText,
      iconBg: "bg-primary text-primary-foreground",
      chartColor: "#DC2626",
      chartType: "curve-red",
    },
    {
      title: "Chờ phê duyệt",
      value: String(pendingCount),
      subtext: "Đang chờ quản lý/BGĐ xem xét",
      icon: Clock,
      iconBg: "bg-amber-500 text-white",
      chartColor: "#F59E0B",
      chartType: "curve-amber",
    },
    {
      title: "Đã phê duyệt",
      value: String(approvedCount),
      subtext: "Sẵn sàng tạo vị trí tuyển dụng",
      icon: CheckCircle2,
      iconBg: "bg-emerald-600 text-white",
      chartColor: "#10B981",
      chartType: "curve-green",
    },
    {
      title: "Đã từ chối / Hủy",
      value: String(rejectedCount),
      subtext: "Không được phê duyệt ngân sách",
      icon: XCircle,
      iconBg: "bg-slate-500 text-white",
      chartColor: "#64748B",
      chartType: "curve-blue",
    },
  ];

  return <RecruitmentKpiCards cards={cards} />;
}


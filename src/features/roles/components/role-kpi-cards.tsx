"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShieldAlert, Sliders, KeyRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RoleKpiCardsProps {
  totalRoles: number;
  systemRolesCount: number;
  customRolesCount: number;
  isLoading?: boolean;
}

export function RoleKpiCards({
  totalRoles,
  systemRolesCount,
  customRolesCount,
  isLoading = false,
}: RoleKpiCardsProps) {
  const cards = [
    {
      title: "Tổng số Vai trò",
      value: totalRoles,
      description: "Đang kích hoạt trên hệ thống",
      icon: Shield,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Vai trò Hệ thống",
      value: systemRolesCount,
      description: "Cốt lõi, bảo vệ mặc định",
      icon: ShieldAlert,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
    },
    {
      title: "Vai trò Tùy chỉnh",
      value: customRolesCount,
      description: "Doanh nghiệp tự thiết lập",
      icon: Sliders,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Quyền hạn Phân hệ",
      value: "36 / 12",
      description: "36 quyền thuộc 12 phân hệ",
      icon: KeyRound,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className="border shadow-xs transition-all hover:shadow-md">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 my-1" />
                ) : (
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${card.bg}`}
              >
                <Icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

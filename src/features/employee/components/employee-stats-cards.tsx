"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, Clock, AlertCircle } from "lucide-react";

interface EmployeeStatsCardsProps {
  total: number;
  activeCount: number;
  probationCount: number;
  leaveCount: number;
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
}

export function EmployeeStatsCards({
  total,
  activeCount,
  probationCount,
  leaveCount,
  selectedStatus,
  onSelectStatus,
}: EmployeeStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card
        onClick={() => onSelectStatus("ALL")}
        className={`cursor-pointer transition-all hover:shadow-sm ${
          !selectedStatus || selectedStatus === "ALL"
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : ""
        }`}
      >
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Tổng nhân sự</p>
            <p className="text-lg font-bold">{total}</p>
          </div>
        </CardContent>
      </Card>

      <Card
        onClick={() => onSelectStatus("ACTIVE")}
        className={`cursor-pointer transition-all hover:shadow-sm ${
          selectedStatus === "ACTIVE"
            ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20"
            : ""
        }`}
      >
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Chính thức</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {activeCount}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        onClick={() => onSelectStatus("PROBATION")}
        className={`cursor-pointer transition-all hover:shadow-sm ${
          selectedStatus === "PROBATION"
            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-500/20"
            : ""
        }`}
      >
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Thử việc</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
              {probationCount}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card
        onClick={() => onSelectStatus("ON_LEAVE")}
        className={`cursor-pointer transition-all hover:shadow-sm ${
          selectedStatus === "ON_LEAVE"
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 ring-1 ring-blue-500/20"
            : ""
        }`}
      >
        <CardContent className="p-3.5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">Nghỉ chế độ</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {leaveCount}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


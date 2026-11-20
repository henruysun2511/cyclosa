"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock, MapPin, Sparkles, User, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AttendanceLogResponse } from "../../types/attendance.types";

interface LatestPunchCardProps {
  result: AttendanceLogResponse | null;
  photoUrl?: string | null;
  employeeName?: string | null;
}

export function LatestPunchCard({
  result,
  photoUrl,
  employeeName,
}: LatestPunchCardProps) {
  if (!result) return null;

  const isSuccess = result.verificationResult === "SUCCESS";
  const displayName = result.employeeName || employeeName || "Nhân viên";
  const punchDate = new Date(result.punchTime || result.occurredAt || "");
  const timeStr = punchDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = punchDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <Card className="border-2 border-emerald-500/30 shadow-md bg-gradient-to-br from-card to-emerald-50/20 dark:to-emerald-950/10 overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Kết quả quét gần nhất
        </CardTitle>
        <Badge
          variant={isSuccess ? "default" : "destructive"}
          className={
            isSuccess
              ? "bg-emerald-600 hover:bg-emerald-700 text-white text-[10px]"
              : "text-[10px]"
          }
        >
          {isSuccess ? "Thành công" : "Cần giải trình"}
        </Badge>
      </CardHeader>

      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center gap-3.5">
          {/* Ảnh chụp thực tế của nhân viên */}
          {photoUrl ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-500/60 shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Ảnh điểm danh"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 p-0.5 rounded-full bg-emerald-600 text-white shadow-xs">
                {isSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center shrink-0 border">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Thông tin nhân viên & Thời gian */}
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-sm text-foreground truncate">
                {displayName}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
                  result.eventType === "CHECK_IN"
                    ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                    : "border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                }`}
              >
                {result.eventType === "CHECK_IN" ? "Vào ca (Check-in)" : "Tan ca (Check-out)"}
              </Badge>
            </div>

            {/* Đồng hồ ghi nhận to rõ */}
            <div className="flex items-baseline gap-2 pt-0.5">
              <span className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-1">
                <Clock className="h-4 w-4 text-primary" />
                {timeStr}
              </span>
              <span className="text-xs text-muted-foreground">({dateStr})</span>
            </div>

            {result.employeeCode && (
              <p className="text-[11px] text-muted-foreground font-mono">
                Mã NV: {result.employeeCode}
              </p>
            )}
          </div>
        </div>

        {/* Thông số kỹ thuật Face AI & GPS */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-background/80 rounded-lg p-2.5 border">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span>Face AI:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {result.faceMatchScore ? `${result.faceMatchScore.toFixed(1)}%` : "Khớp"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span>GPS:</span>
            <span className="font-semibold text-foreground">
              {result.distanceMeters !== undefined ? `${result.distanceMeters}m` : "Hợp lệ"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


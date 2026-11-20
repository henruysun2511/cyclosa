"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Home,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Users,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface GradeBucket {
  grade: string;
  name: string;
  targetPercent: number; // e.g. 10%
  actualCount: number;
  maxPercent: number;
  color: string;
}

export default function PerformanceCalibrationPage() {
  const [totalEmployees] = useState(450);
  const [saved, setSaved] = useState(false);

  const [buckets, setBuckets] = useState<GradeBucket[]>([
    { grade: "A", name: "Xuất sắc (Outstanding)", targetPercent: 10, actualCount: 45, maxPercent: 10, color: "bg-emerald-500" },
    { grade: "B", name: "Tốt / Vượt kỳ vọng (Exceeds)", targetPercent: 25, actualCount: 112, maxPercent: 25, color: "bg-blue-500" },
    { grade: "C", name: "Đạt yêu cầu (Meets)", targetPercent: 50, actualCount: 228, maxPercent: 55, color: "bg-amber-500" },
    { grade: "D", name: "Cần cải thiện (Needs Improvement)", targetPercent: 15, actualCount: 65, maxPercent: 15, color: "bg-red-500" },
  ]);

  const handleAdjustCount = (grade: string, delta: number) => {
    setBuckets((prev) =>
      prev.map((b) => {
        if (b.grade === grade) {
          const nextCount = Math.max(0, b.actualCount + delta);
          return { ...b, actualCount: nextCount };
        }
        return b;
      })
    );
  };

  const currentTotal = buckets.reduce((s, b) => s + b.actualCount, 0);

  const handleSaveCalibration = () => {
    setSaved(true);
    toast.success("Đã chốt và lưu kết quả Hiệu chuẩn phân phối điểm (Bell Curve)!");
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* ── Page Header & Breadcrumb & Action Buttons ────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Hiệu chuẩn Phân phối Chuẩn
          </h1>
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
              href="/performance/cycles"
              className="hover:text-primary cursor-pointer transition-colors"
            >
              Hiệu suất & Mục tiêu
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Hiệu chuẩn Bell Curve (PERF-07)</span>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/performance/cycles" className="btn-outline">
            Quay lại Kỳ đánh giá
          </Link>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveCalibration}
          >
            <Save className="h-4 w-4" />
            <span>Chốt phân phối điểm</span>
          </button>
        </div>
      </div>

      {/* ── Bell Curve Visual Chart Card ────────────────────────────── */}
      <div className="table-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">
              Mô hình phân phối chuẩn định mức FSI (Target vs Actual)
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đảm bảo tính khách quan, chống thiên vị và kiểm soát ngân sách thưởng hiệu quả quý.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-muted-foreground">Tổng nhân sự hiệu chuẩn:</span>
            <div className="text-xl font-black text-foreground">
              {currentTotal} / {totalEmployees}
            </div>
          </div>
        </div>

        {/* Visual Stacked Bar representing the Bell Curve */}
        <div className="space-y-2">
          <div className="flex h-12 w-full rounded-xl overflow-hidden shadow-inner">
            {buckets.map((b) => {
              const pct = ((b.actualCount / currentTotal) * 100).toFixed(1);
              return (
                <div
                  key={b.grade}
                  style={{ width: `${pct}%` }}
                  className={`${b.color} flex flex-col items-center justify-center text-white text-xs font-bold transition-all px-2`}
                  title={`${b.name}: ${b.actualCount} (${pct}%)`}
                >
                  <span>Hạng {b.grade}</span>
                  <span className="text-[10px] font-normal opacity-90">{pct}%</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between text-2xs font-mono text-muted-foreground px-1">
            <span>Hạng A (Tối đa {buckets[0].maxPercent}%)</span>
            <span>Hạng B (Mục tiêu {buckets[1].targetPercent}%)</span>
            <span>Hạng C (Mục tiêu {buckets[2].targetPercent}%)</span>
            <span>Hạng D (Mục tiêu {buckets[3].targetPercent}%)</span>
          </div>
        </div>

        {/* Sliders / Counter Controls for Each Grade Bucket */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {buckets.map((b) => {
            const actualPct = ((b.actualCount / currentTotal) * 100).toFixed(1);
            const isOverQuota = Number(actualPct) > b.maxPercent;
            return (
              <div
                key={b.grade}
                className={`rounded-xl border p-4 transition-colors ${
                  isOverQuota ? "border-destructive bg-red-50/30" : "border-border bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${b.color}`} />
                    <span className="font-bold text-sm text-foreground">
                      Hạng {b.grade} — {b.name}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-foreground">
                    {actualPct}%
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted-foreground">
                    Số lượng nhân sự:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={saved}
                      onClick={() => handleAdjustCount(b.grade, -1)}
                      className="btn-icon-sm"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm w-10 text-center">
                      {b.actualCount}
                    </span>
                    <button
                      type="button"
                      disabled={saved}
                      onClick={() => handleAdjustCount(b.grade, 1)}
                      className="btn-icon-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {isOverQuota && (
                  <p className="text-[11px] text-destructive mt-2 flex items-center gap-1 font-medium">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    Vượt trần quy định {b.maxPercent}% theo chính sách HĐQT
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
